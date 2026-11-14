# Tài Liệu Hướng Dẫn Vận Hành & Kiến Trúc Backend Cục Bộ (Local Mission Service)

Tài liệu này ghi nhận hiện trạng kiến trúc, cơ chế vận hành, phạm vi an ninh và hướng dẫn kiểm thử cho hệ thống Mission Backend cục bộ (thuộc chuỗi TIP-001 đến TIP-007 cùng các bản sửa lỗi FIX-BE01, FIX-BE02, FIX-BE03).

---

## 1. Hiện Trạng Kiến Trúc Thực Tế

Hệ thống Mission Backend hiện tại được thiết kế theo mô hình **Local-First In-Process Architecture**:

```
[UI / Client Code]
       │
       ▼
[MockMissionClientAdapter]  ── (Interface ApiResponse<T>, mô phỏng Network)
       │
       ▼
[MissionApiService]          ── (Session Auth, Concurrency Revision, Idempotency)
       │
       ▼
[MissionRunManager]          ── (Domain Rules, Logic M1/M2, Tính Ngưỡng Đạt)
       │
       ▼
[MissionDatabaseRepository]   ── (In-Memory Run/Report/Command Storage)
```

### Các Thành Phần Chính:
1. **`MissionDatabaseRepository` (`src/domain/mission-database.ts`)**:
   - Kho lưu trữ In-Memory quản lý các bản ghi `StoredRunRecord` và `StoredReportRecord` bằng `Map`.
   - Cung cấp phương thức nguyên tử `atomicUpdateRunAndCommand()` cập nhật đồng thời run state và lịch sử command.
   - Hỗ trợ cờ mô phỏng lỗi ghi `setSimulateFailure()` để kiểm tra độ tin cậy của tầng dịch vụ khi gặp sự cố lưu trữ.
2. **`MissionApiService` (`src/domain/mission-api.ts`)**:
   - Tầng điều phối xử lý logic API in-process, đóng gói các phản hồi theo cấu trúc chuẩn `ApiResponse<T>`.
   - Kiểm soát quyền sở hữu phiên (`ownerSessionId`) và từ chối các phiên truy cập lạ hoặc rỗng (FIX-BE01).
   - Đảm bảo tính nhất quán dữ liệu giữa Service và Repository sau mọi command thành công (FIX-BE02).
   - Bắt lỗi lưu trữ từ Repository và trả về mã lỗi 500 nếu ghi dữ liệu thất bại (FIX-BE03).
3. **`MissionRunManager` (`src/domain/mission-run-manager.ts`)**:
   - Quản lý vòng đời ván chơi (`IN_PROGRESS`, `SUCCESS`, `FAILURE`, `UNRESOLVED`).
   - Kiểm soát tính bất biến và số thứ tự sửa đổi (`revision`), bảo vệ khỏi race condition và xử lý lệnh trùng lặp (Idempotency).
4. **`MockMissionClientAdapter` (`src/domain/mission-adapter.ts`)**:
   - Bộ điều hợp phía Frontend cung cấp giao diện tương tác bất đồng bộ, tương thích hoàn toàn với schema của API thật trong tương lai.

---

## 2. Giới Hạn Vận Hành & Ranh Giới Kỹ Thuật (Boundaries & Constraints)

Nhằm đảm bảo an toàn tuyệt đối cho hệ thống vật lý và đồ họa của WebGL-Orbiter, các ranh giới sau được áp dụng nghiêm ngặt:

- **KHÔNG có cơ sở dữ liệu vật lý (No Persistent DB)**: Dữ liệu được lưu trong bộ nhớ RAM (In-Memory). Dữ liệu sẽ được làm mới khi khởi động lại tiến trình hoặc tải lại trang web. Chưa tích hợp SQLite, PostgreSQL hoặc MongoDB.
- **KHÔNG có máy chủ HTTP mạng (No Real HTTP Server)**: Chưa mở port mạng REST API (chưa có Express/Fastify/Koa server độc lập). Mọi giao tiếp diễn ra in-process thông qua TypeScript interface chuẩn `ApiResponse<T>`.
- **KHÔNG sử dụng lệnh `npm run dev`**: Trong `package.json` của dự án không tồn tại script `npm run dev`. Không chạy lệnh này để tránh lỗi command not found.
- **KHÔNG sửa đổi mô phỏng gốc**: Các module vật lý quỹ đạo (`NasaMissionDesigner.ts`, `CelestialBody.ts`, `Universe.ts`, `GameState.ts`, `SolarSystemExplorer.ts`) và logic nhiệm vụ NASA cũ được bảo vệ nguyên vẹn 100%. M1 và M2 chưa được đấu nối vào UI Three.js để tránh ảnh hưởng đến vòng lặp render đồ họa.

---

## 3. Các Bản Sửa Lỗi An Ninh & Tính Toàn Vẹn Dữ Liệu

| Mã Lỗi | Nội Dung & Giải Pháp |
| :--- | :--- |
| **FIX-BE01** | **Xác thực quyền sở hữu Report**: `handleGetReport` luôn kiểm tra `ownerSessionId` từ bản ghi trong repository. Khi tạo mới lại instance `MissionApiService`, nếu session rỗng trả về `401 Unauthorized`, nếu session khác với người tạo run trả về `403 Forbidden`. |
| **FIX-BE02** | **Đồng bộ hóa Repository & Revision**: Sau MỌI command hợp lệ (`ANSWER_QUIZ`, thu thập mẫu, `COMPLETE_RUN`), service gọi `atomicUpdateRunAndCommand` để lưu trạng thái mới nhất vào repository. Thuộc tính `revision` được phản ánh đầy đủ trong `ClientMissionView`. |
| **FIX-BE03** | **Bắt lỗi lưu trữ Repository an toàn**: Khi repository ném ngoại lệ hoặc trả về thất bại trong `saveRun` hoặc `atomicUpdateRunAndCommand`, service trả về `statusCode: 500`, huỷ bỏ active run giả và không trả về trạng thái thành công giả lập. |

---

## 4. Hướng Dẫn Chạy & Kiểm Thử Cục Bộ

### 4.1 Chạy Bộ Kiểm Thử (Unit & Integration Tests)
Chạy toàn bộ 7 bộ kiểm thử bao gồm kiểm tra hồi quy bảo vệ baseline, save security, quy tắc nhiệm vụ, lifecycle ván chơi và tích hợp API/Database:
```bash
npm test
```
*Kết quả yêu cầu: Toàn bộ 7 suites PASS 100%.*

### 4.2 Đóng Gói Ứng Dụng (Production Build)
Build bundle webpack tối ưu cho môi trường production:
```bash
npm run build
```
*Đầu ra: Thư mục `dist/` chứa `bundle.js` và các tài nguyên WebGL.*

### 4.3 Khởi Động Web Server Cục Bộ
Để chạy và kiểm tra ứng dụng giao diện mô phỏng WebGL trên trình duyệt:
- **Cách 1 (Static File Server - Khuyến nghị)**:
  ```bash
  node serve.js
  ```
  Truy cập qua trình duyệt tại: `http://localhost:8000`
- **Cách 2 (Webpack Dev Server)**:
  ```bash
  npm start
  ```
  Truy cập qua cổng mặc định do Webpack Dev Server cung cấp (thường là `http://localhost:8080`).
