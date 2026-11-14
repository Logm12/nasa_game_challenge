# Tài Liệu Kỹ Thuật: Hệ Thống History & Report Online (Netlify Serverless)

Tài liệu này ghi nhận hiện trạng khảo sát, kiến trúc hệ thống, cơ chế bảo mật, giải pháp phục hồi lỗi và kế hoạch triển khai lưu trữ bền vững online cho WebGL-Orbiter & NASA Game Challenge.

---

## 1. Khảo Sát Hiện Trạng Netlify, Cơ Chế Xác Thực & Phương Án Lưu Trữ Bền Vững

### 1.1 Khảo sát cấu hình Netlify hiện có
- **File cấu hình:** `netlify.toml`
  - Đã được cập nhật bổ sung thư mục functions: `[functions] directory = "netlify/functions"`.
  - Cấu hình chuyển tiếp (Redirect rule): `/api/missions/history/*` trỏ tới `/.netlify/functions/mission-history`.
- **Serverless Runtime:**
  - Netlify Functions chạy trong môi trường container ephemeral không trạng thái (stateless/ephemeral container). Khi function container bị recycle hoặc cold start, toàn bộ Map trong RAM, biến toàn cục và thư mục tạm `/tmp` đều bị xóa sạch.
  - Do đó, **không được coi Map trong RAM hay thư mục tạm của Function là lưu trữ online**.

### 1.2 Khảo sát & Đề xuất các phương án Cloud Persistent Storage (Lưu trữ bền vững)

| Phương Án | Công Nghệ | Ưu Điểm & Tích Hợp | Yêu Cầu Cấu Hình | Mức Chi Phí (Tự kích hoạt: KHÔNG) |
| :--- | :--- | :--- | :--- | :--- |
| **Phương án 1 (Khuyến nghị)** | **Netlify Blobs** | Tích hợp gốc trong Netlify runtime (`@netlify/blobs`), không cần mở port DB hay xử lý connection pool; latency thấp nhất cho serverless. | Cấu hình Netlify Site ID và biến môi trường Netlify Blobs token. | **Miễn phí** trong gói Free (10,000 reads/tháng, 1,000 writes/tháng, 1GB storage). |
| **Phương án 2** | **Supabase (PostgreSQL)** | Cơ sở dữ liệu quan hệ mạnh mẽ, hỗ trợ RLS (Row Level Security), lưu trữ lịch sử, commands audit log và JSON report lâu dài. Đã có sẵn schema `SQL_SCHEMA_V1`. | Project Supabase, biến môi trường `DATABASE_URL` hoặc Supabase API Key. | **Miễn phí** trong gói Free Tier (500MB database, 50,000 MAU). |
| **Phương án 3** | **Upstash Redis** | KV Store tốc độ cao, hỗ trợ REST API qua HTTPS (tránh nghẽn connection pool serverless), phù hợp lưu trữ session và run state tức thời. | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`. | **Miễn phí** trong gói Free (10,000 commands/ngày). |

> [!IMPORTANT]
> **Cam kết nguyên tắc:** Hiện tại chưa kích hoạt bất kỳ dịch vụ trả phí nào. Toàn bộ logic đã được đóng gói độc lập thông qua interface `IOnlineHistoryStorage`, Netlify Function (`netlify/functions/mission-history.ts`), và `FileBasedOnlineHistoryStorage` để chạy và kiểm thử độc lập 100% tại môi trường local. **Chưa cấu hình dịch vụ cloud thật thì không tuyên bố đã lưu online production thành công.**

---

## 2. Kiến Trúc & Luồng Dữ Liệu Thực Tế

```
[Client / UI / Test]
       │  (Bearer <auth_token>, OnlineSyncPayload)
       ▼
[OnlineMissionHistoryClientAdapter] ── Quản lý trạng thái: idle, saving, saved_online, error
       │  (HTTP / Direct In-Process)
       ▼
[Netlify Function / OnlineHistoryService]
       │
       ├── 1. Xác thực Server-Side: verifyAuthToken() -> verifiedUserId (Không tin body)
       ├── 2. Kiểm tra quyền sở hữu (401 Unauthorized / 403 Forbidden / 404 Not Found)
       ├── 3. Kiểm soát Idempotency: Kiểm tra runId đã lưu -> Trả lại bản ghi cũ nếu trùng
       ▼
[IOnlineHistoryStorage / FileBasedOnlineHistoryStorage]
       └── Lưu bền vững phân vùng theo user: [.server_storage/online_history/<ownerId>/<runId>.json]
```

### 2.1 Các Bản Ghi Bền Vững Được Lưu Trữ:
- `ownerId`: Chủ sở hữu lượt chơi (được server xác thực từ token).
- `missionId`, `missionType`: Mã nhiệm vụ và loại nhiệm vụ (M1/M2).
- `spacecraftName`, `spacecraftPayload`: Cấu hình tàu bay và module trang bị.
- `startTimeIso`, `endTimeIso`, `durationSeconds`: Thời điểm và thời lượng chơi.
- `status`: Trạng thái (`SUCCESS`, `FAILURE`, `UNRESOLVED`, `IN_PROGRESS`).
- `isThresholdMet`, `score`, `remainingBudget`: Kết quả đánh giá.
- `rulesVersion`, `contentVersion`: Phiên bản quy tắc tại thời điểm chốt kết quả.
- `debriefReport`: Toàn văn báo cáo kết thúc ván (giữ nguyên bản, không tính toán lại theo quy tắc mới).
- `syncedAtIso`: Dấu thời gian đồng bộ lên server.

---

## 3. Khắc Phục Hai Vấn Đề Nền Trong Core Mission Service

### 3.1 Rollback Manager khi Lưu Trữ Repository Thất Bại (Mục 2)
- **Vấn đề trước sửa:** Khi gọi `atomicUpdateRunAndCommand` gặp lỗi (ném ngoại lệ hoặc repository đầy), `MissionRunManager` đã tăng revision, đã ghi nhận câu trả lời/mẫu vật và lưu command vào bộ nhớ chống lệnh trùng, dẫn đến memory bị lệch hoàn toàn so với database.
- **Giải pháp:**
  - `MissionRunManager` được trang bị cơ chế snapshot (`createSnapshot()`) và khôi phục (`restoreSnapshot()`).
  - Trong `MissionApiService.handleExecuteCommand()`: chụp snapshot trước khi chạy lệnh. Nếu repository ghi thất bại $\rightarrow$ lập tức rollback Manager về snapshot cũ và trả về mã lỗi 500.
  - Khi client thử lại (retry) lệnh: Manager tiếp nhận và xử lý lại bình thường, không bị coi là lệnh trùng và không làm lệch revision.

### 3.2 Khôi Phục Hoàn Chỉnh Manager khi Tạo Lại Service Instance (Mục 2)
- **Vấn đề trước sửa:** Khi tạo lại `MissionApiService` từ repository, code cũ chỉ khởi tạo `new MissionRunManager()` rồi gọi `startRun()`, khiến `revision` bị quay về 1, toàn bộ câu trả lời, mẫu vật và bộ nhớ chống lệnh trùng (`processedCommandMap`) bị mất sạch.
- **Giải pháp:**
  - Bổ sung phương thức `getRecordedCommandsForRun(runId)` trong `IMissionStorageRepository`.
  - Triển khai `MissionRunManager.restoreFromStored(config, progress, recordedCommands)`: phục hồi chính xác `status`, `revision`, `currentBudget`, `elapsedTime`, replay các commands thành công vào `m1Answers`/`m2CollectedRecords`, và nạp đầy đủ lịch sử command vào `processedCommandMap`.
  - Nhờ đó: client gửi lệnh tiếp theo với `expectedRevision` hiện tại được chấp nhận ngay; gửi lại lệnh cũ nhận đúng kết quả đã lưu mà không bị tính điểm lần hai.

---

## 4. Chuẩn Hóa Đa Ngôn Ngữ (9 Ngôn Ngữ) & Tính Bất Biến Của Kết Quả

- **9 Ngôn ngữ được hỗ trợ đầy đủ:** `en_us`, `vi`, `en_uk`, `ja`, `ko`, `fr`, `de`, `it`, `es`.
- **Rà soát Flight Deck:** Toàn bộ nhãn hiển thị và tooltip của Bàn điều khiển bay (STAB LOCK, PROGRADE, RETROGRADE, MANUAL, MAIN THRUST, ORBIT SPEED) được đồng bộ qua hệ thống từ điển; hàm `syncSasUI` lấy nhãn từ `ControlTexts` thay vì gán chuỗi tĩnh; đăng ký `onLangChange` cập nhật tức thời khi chuyển ngôn ngữ.
- **Thông báo Save/Load:** Các thông báo lỗi đọc storage, hỏng dữ liệu, lỗi xóa, lỗi lưu đè trong `SaveControl.ts` và `LoadControl.ts` đã chuyển toàn bộ sang hệ thống dịch (`saveErrRead`, `saveErrCorrupt`, `saveErrDelete`, `saveErrInvalidState`, `saveErrStorageWrite`).
- **Giao diện History:** Cung cấp đầy đủ các khóa dịch `historyTitle`, `historyEmpty`, `historyLoading`, `historyError`, `historySaving`, `historySavedOnline`, `historyRetry`, `historyViewReport`.
- **Tính bất biến:** Báo cáo debrief (`RunResult`) và kết quả ván chơi được lưu trữ độc lập; việc chuyển đổi ngôn ngữ chỉ thay đổi giao diện hiển thị, dữ liệu kết quả (`score`, `status`, `reasons`) giữ nguyên 100%.

---

## 5. Hướng Dẫn Kiểm Thử & Chạy Cục Bộ

### 5.1 Chạy Bộ Kiểm Thử Tự Động (Tất cả các suites)
```bash
npm test
```
*Bao gồm 9 bộ kiểm thử độc lập:*
1. `tests/i18n.test.ts`: Kiểm tra đủ khóa, placeholder và không lẫn tiếng Việt trong 9 ngôn ngữ.
2. `tests/i18n-runtime-ui.test.ts`: Kiểm tra chuyển ngôn ngữ runtime cho UI và tính bất biến của kết quả.
3. `tests/performance-quality.test.ts`: Kiểm tra preset đồ họa và DPR capping.
4. `tests/protection-baseline.test.ts`: Kiểm tra 12 chốt bảo vệ baseline vật lý/quỹ đạo/hằng số.
5. `tests/save-security.test.ts`: Kiểm tra bảo mật và kiểm định dữ liệu lưu/tải.
6. `tests/mission-rules.test.ts`: Kiểm tra quy tắc M1 (ngưỡng 80%) và M2 (≥3 loại mẫu tại Earth/Moon/Mars).
7. `tests/mission-run-manager.test.ts`: Kiểm tra quản lý ván, revision, idempotency và unresolved policy.
8. `tests/mission-integration.test.ts`: Kiểm tra phân quyền session, revision client view và mã lỗi 500.
9. `tests/mission-resilience.test.ts`: Kiểm tra rollback snapshot khi ghi repo lỗi và phục hồi đầy đủ khi tạo lại service.
10. `tests/mission-online-history.test.ts`: Kiểm tra xác thực Bearer token, phân quyền, phân trang và retry adapter.

### 5.2 Đóng Gói Ứng Dụng
```bash
npm run build
```

### 5.3 Khởi Động Trình Giả Lập Cục Bộ
```bash
node serve.js
# Truy cập qua trình duyệt tại: http://localhost:8000
```
Hoặc dùng Webpack Dev Server:
```bash
npm start
```
*(Lưu ý: Không sử dụng lệnh `npm run dev` do dự án không có script này).*
