# Tài Liệu Kỹ Thuật: Tái Hiện Mô Phỏng 3D Nhiệm Vụ NASA DART (Q24)

## 1. Giới thiệu & Phạm vi Tái Hiện (Historical Scope)
Tài liệu này mô tả chi tiết kiến trúc toán lý, thuật toán phát hiện va chạm liên tục (CCD), cơ chế truyền động lượng với hệ số khuếch đại $\beta$, và luồng trải nghiệm người dùng trong việc tái hiện nhiệm vụ **NASA DART (Double Asteroid Redirection Test)** trong dự án `nasa_game_challenge`.

### Phạm vi triển khai:
- **Pha tiếp cận cuối (Terminal Approach)**: Mô phỏng DART cách hệ tiểu hành tinh đôi Dimorphos–Didymos ~15 km với vận tốc tiếp cận tương đối thực nghiệm $v_{rel} \approx 6.14\text{ km/s}$.
- **Hệ thống dẫn đường tự động quang học (SMART Nav Assist)**: Hỗ trợ vi chỉnh lực đẩy RCS hướng thẳng vào tâm quang học của vệ tinh Dimorphos.
- **Va chạm động học (Kinetic Impact)**: Xử lý va chạm quét hình cầu (Swept-Sphere CCD) loại bỏ hoàn toàn hiện tượng xuyên hầm (tunneling) ở vận tốc cao.
- **Biến thiên cơ học quỹ đạo 2 vật thể Kepler**: Tính toán chính xác độ suy giảm vận tốc tiếp tuyến $\Delta v$, bán trục lớn mới $a_1$, và chu kỳ quay mới $T_1$ của Dimorphos quanh Didymos.
- **Báo cáo tổng kết (Debrief)**: Tách bạch rõ ràng số liệu giữa lượt mô phỏng của người dùng và các quan sát thực nghiệm lịch sử của NASA.
- **Đa ngôn ngữ**: Bản địa hóa toàn diện trên cả 9 ngôn ngữ (`en_us`, `vi`, `en_uk`, `ja`, `ko`, `fr`, `de`, `it`, `es`).

---

## 2. Nguồn Tham Khảo Chính Thức & Thông Số Vật Lý (Official Sources & Parameters)

### Các nguồn tài liệu chính thống:
1. **NASA Science - DART Mission Overview**:
   - URL: [https://science.nasa.gov/mission/dart/](https://science.nasa.gov/mission/dart/)
   - Dữ liệu: Mục tiêu, cấu hình tàu DART, khối lượng tại thời điểm va chạm ($m_{DART} \approx 570\text{ kg}$).
2. **NASA News Release (11/10/2022) - Impact Changed Asteroid's Motion in Space**:
   - URL: [https://www.nasa.gov/news-release/nasa-confirms-dart-mission-impact-changed-asteroids-motion-in-space/](https://www.nasa.gov/news-release/nasa-confirms-dart-mission-impact-changed-asteroids-motion-in-space/)
   - Dữ liệu: Chu kỳ trước va chạm ($11\text{h } 55\text{m}$), mức thay đổi chu kỳ ban đầu (~32 phút, giảm xuống $11\text{h } 23\text{m}$), ngưỡng thành công tối thiểu (73 giây).
3. **NASA Study (19/03/2024) - Asteroid's Orbit and Shape Changed After DART Impact**:
   - URL: [https://www.nasa.gov/missions/dart/nasa-study-asteroids-orbit-shape-changed-after-dart-impact/](https://www.nasa.gov/missions/dart/nasa-study-asteroids-orbit-shape-changed-after-dart-impact/)
   - Dữ liệu: Chu kỳ cập nhật chính xác $11\text{h } 22\text{m } 37\text{s} \pm 12\text{s}$ ($\Delta T \approx -33\text{ phút } 15\text{ giây}$), sự thay đổi hình dạng của Dimorphos từ dạng elipsoid đối xứng sang dạng elipsoid ba trục bất đối xứng.
4. **Nature (2023) - Daly et al., "Successful Kinetic Impact into an Asteroid by the DART Mission"**:
   - Khối lượng tổng hệ Didymos + Dimorphos: $(5.40 \pm 0.3) \times 10^{11}\text{ kg}$.
   - Khối lượng Dimorphos: $M_{Dim} \approx 4.30 \times 10^9\text{ kg}$.
   - Khối lượng Didymos: $M_{Did} \approx 5.357 \times 10^{11}\text{ kg}$.
   - Hệ số tăng cường động lượng (Momentum enhancement factor) $\beta \in [2.2, 4.9]$, giá trị chuẩn định calibration: $\beta = 3.42$.

### Bảng thông số vật lý chuẩn:
| Đại lượng | Ký hiệu | Giá trị vật lý | Đơn vị SI |
| :--- | :---: | :---: | :---: |
| Hằng số hấp dẫn | $G$ | $6.67430 \times 10^{-11}$ | $\text{m}^3 \cdot \text{kg}^{-1} \cdot \text{s}^{-2}$ |
| Khối lượng tiểu hành tinh chính Didymos | $M_{Did}$ | $5.357 \times 10^{11}$ | $\text{kg}$ |
| Khối lượng vệ tinh Dimorphos | $M_{Dim}$ | $4.30 \times 10^9$ | $\text{kg}$ |
| Tham số hấp dẫn chuẩn của hệ ($\mu$) | $\mu = G(M_{Did} + M_{Dim})$ | $3.60412 \times 10^1$ | $\text{m}^3/\text{s}^2$ |
| Khối lượng tàu DART khi va chạm | $m_{DART}$ | $570.0$ | $\text{kg}$ |
| Bán kính vật lý Didymos | $R_{Did}$ | $390.0$ | $\text{m}$ (đường kính 780 m) |
| Bán kính vật lý Dimorphos | $R_{Dim}$ | $75.5$ | $\text{m}$ (đường kính 151 m) |
| Bán trục lớn ban đầu | $a_0$ | $1,189.0$ | $\text{m}$ |
| Chu kỳ quỹ đạo ban đầu | $T_0$ | $42,912.0$ | $\text{giây}$ ($715.2\text{ phút} = 11\text{h } 55\text{m } 12\text{s}$) |
| Vận tốc tiếp cận tương đối | $v_{rel}$ | $6,140.0$ | $\text{m/s}$ ($6.14\text{ km/s}$) |
| Hệ số truyền xung lượng mảnh vụn | $\beta$ | $3.42$ | Không thứ nguyên |

---

## 3. Hệ Tọa Độ, Cơ Học Quỹ Đạo & Thuật Toán Phát Hiện Va Chạm Liên Tục (CCD)

### 3.1. Hệ quy chiếu & Vận tốc quỹ đạo tròn ban đầu
Hệ quy chiếu 2 vật thể lấy gốc tọa độ tại tâm Didymos. Do $M_{Did} \gg M_{Dim}$ ($M_{Did} \approx 124.6 \times M_{Dim}$), tâm hấp dẫn xấp xỉ tâm Didymos.

Vận tốc quỹ đạo tròn ban đầu của Dimorphos:
$$v_0 = \sqrt{\frac{\mu}{a_0}} = \sqrt{\frac{36.0412}{1189}} \approx 0.1741\text{ m/s} = 17.41\text{ cm/s}$$

### 3.2. Truyền động lượng & Hệ số khuếch đại $\beta$
Tàu DART tiếp cận theo hướng nghịch chiều quỹ đạo (retrograde). Khi va chạm xảy ra, không chỉ khối lượng tàu truyền động lượng trực tiếp mà phản lực từ hàng nghìn tấn đá bụi (ejecta) phun trào theo hướng ngược lại làm tăng thêm xung lực hãm theo hệ số $\beta$:
$$\Delta \vec{v}_{Dim} = \beta \frac{m_{DART}}{M_{Dim}} \vec{v}_{rel}$$

Với va chạm đối đầu trực diện:
$$\Delta v = -3.42 \times \frac{570\text{ kg}}{4.30 \times 10^9\text{ kg}} \times 6,140\text{ m/s} \approx -0.00278\text{ m/s} = -2.78\text{ mm/s}$$

Vận tốc tiếp tuyến mới của Dimorphos tại điểm va chạm ($r_0 = a_0$):
$$v_1 = v_0 + \Delta v \approx 0.1741 - 0.00278 = 0.17132\text{ m/s}$$

### 3.3. Xác định quỹ đạo mới theo phương trình năng lượng Kepler
Năng lượng cơ đạo riêng phần (specific orbital energy) sau va chạm:
$$\epsilon = \frac{v_1^2}{2} - \frac{\mu}{r_0} = -\frac{\mu}{2 a_1}$$

- **Trường hợp quỹ đạo elip khép kín ($\epsilon < 0$)**:
  $$a_1 = \frac{\mu r_0}{2\mu - r_0 v_1^2}$$
  Chu kỳ quay mới theo Định luật III Kepler:
  $$T_1 = 2\pi \sqrt{\frac{a_1^3}{\mu}}$$
  Độ biến thiên chu kỳ quỹ đạo:
  $$\Delta T = T_1 - T_0 \approx 40,948\text{ s} - 42,912\text{ s} \approx -1,964\text{ s} \approx -32.73\text{ phút}$$
  Kết quả này hoàn toàn khớp với khoảng thực nghiệm của NASA (32 phút đến 33 phút 15 giây).

- **Trường hợp hyperbol thoát ly ($\epsilon \ge 0$)**:
  Nếu lực va chạm vượt ngưỡng liên kết hấp dẫn, hệ thống xác định trạng thái thoát ly (`unbound hyperbolic`), gán `postImpactOrbit = null` và không tự ý tính chu kỳ tuần hoàn giả mạo.

### 3.4. Thuật toán phát hiện va chạm liên tục (Swept-Sphere CCD)
Ở vận tốc $6.14\text{ km/s}$ và bước tích phân mô phỏng $\Delta t = 0.5\text{ s}$, tàu DART di chuyển một quãng đường hơn $3,000\text{ m}$ trong một frame. Với đường kính Dimorphos chỉ $151\text{ m}$, thuật toán kiểm tra vị trí từng điểm (discrete collision check) sẽ gây ra lỗi xuyên hầm (tunneling), khiến tàu bay xuyên qua mục tiêu mà không kích hoạt va chạm.

**Giải pháp CCD quét hình cầu:**
Khảo sát đoạn đường đi thẳng $[\vec{p}_0, \vec{p}_1]$ của DART với $\Delta \vec{p} = \vec{p}_1 - \vec{p}_0$:
1. Xác định vị trí tương đối với tâm mục tiêu $\vec{c}$:
   $$u = \text{clamp}\left( \frac{(\vec{c} - \vec{p}_0) \cdot \Delta \vec{p}}{\|\Delta \vec{p}\|^2}, 0, 1 \right)$$
2. Điểm tiếp cận gần nhất trên đoạn quỹ đạo:
   $$\vec{p}_{closest} = \vec{p}_0 + u \Delta \vec{p}$$
3. Khoảng cách tối thiểu:
   $$d_{min} = \|\vec{p}_{closest} - \vec{c}\|$$
4. Nếu $d_{min} \le R_{target} + R_{DART}$:
   Va chạm xảy ra chính xác tại tỷ lệ thời gian $t_{impact} = t_0 + u \Delta t$. Xung lực được áp dụng duy nhất một lần (`impactHandled = true`).

---

## 4. Tiêu Chí Thành Công & Máy Trạng Thái Mô Phỏng (Success Criteria & FSM)

Ngưỡng thành công chính thức do NASA công bố: Sự thay đổi chu kỳ quay của Dimorphos phải đạt tối thiểu **73 giây** ($1.2\text{ phút}$).

Các trạng thái của mô phỏng (`DartSimulationState`):
- `approaching`: Tàu đang trên quỹ đạo tiếp cận, hệ thống dẫn đường SMART Nav hoạt động.
- `impacted_target`: Tàu va chạm trúng Dimorphos, cơ chế vật lý tính toán thành công $\Delta T$.
  - Nếu $|\Delta T| \ge 73\text{ s}$: Đạt mục tiêu phòng vệ hành tinh (`completed`).
  - Nếu $|\Delta T| < 73\text{ s}$: Va chạm sượt/năng lượng quá yếu (`insufficient_period_change`).
- `missed`: Tàu bay qua hệ Didymos–Dimorphos ra ngoài bán kính $50\text{ km}$ mà không va chạm.
- `hit_wrong_body`: Tàu va chạm nhầm vào tiểu hành tinh chính Didymos.
- `invalid_state`: Lỗi dữ liệu vật lý (khối lượng $\le 0$ hoặc tham số không xác định).

---

## 5. Phân Định Minh Bạch: Lượt Mô Phỏng vs. DART Ngoài Thực Tế
Trong giao diện tổng kết (Debrief Modal), hệ thống phân tách rạch ròi 2 khu vực:
1. **Lượt mô phỏng này (This Simulation Run)**:
   - Thiên thể va chạm thực tế (Dimorphos / Didymos / Không va chạm).
   - Vận tốc va chạm đo được của tàu người chơi.
   - Chu kỳ trước và sau va chạm của lượt chơi.
   - Độ biến thiên chu kỳ $\Delta T$ tính bằng vật lý thực tế của lượt chơi.
   - Nhận định kỹ thuật và khuyến nghị bay cho lượt chơi tiếp theo.
2. **DART ngoài thực tế (Real-World NASA DART Observations)**:
   - Bối cảnh thử nghiệm phòng vệ hành tinh ngày 26/09/2022.
   - Chu kỳ ban đầu ghi nhận bởi kính viễn vọng mặt đất: $11\text{h } 55\text{m } 12\text{s}$.
   - Đo đạc ban đầu tháng 10/2022: Giảm ~32 phút xuống còn $11\text{h } 23\text{m}$.
   - Nghiên cứu công bố tháng 03/2024: Xác nhận mức giảm $33\text{m } 15\text{s} \pm 12\text{s}$ (chu kỳ mới $11\text{h } 22\text{m } 37\text{s}$).
   - Nguồn dẫn liên kết chính thức từ `science.nasa.gov`.

---

## 6. Cấu Hình Kiểm Thử Chuẩn (Benchmark Configurations)

| Kịch bản | Vị trí ban đầu (km) | Vận tốc ban đầu (km/s) | Kết quả mong đợi | $\Delta T$ tính toán |
| :--- | :---: | :---: | :---: | :---: |
| **1. Chuẩn danh định (Nominal Hit)** | $[0, 15, 0]$ | $[0, -6.14, 0]$ | Trúng Dimorphos, hoàn thành nhiệm vụ | $\approx -32.73\text{ phút}$ |
| **2. Bắn trượt (Missed Flyby)** | $[0.5, 15, 0]$ | $[0, -6.14, 0]$ | Bay qua an toàn, không có xung lực va chạm | $0.0\text{ s}$ |
| **3. Va chạm nhầm (Wrong Body)** | $[0, 15, -1.189]$ | $[0, -6.14, 0]$ | Trúng Didymos, không thay đổi chu kỳ Dimorphos | $0.0\text{ s}$ |
| **4. Va chạm cùng chiều (Prograde Hit)** | $[0, -15, 0]$ | $[0, +6.14, 0]$ | Tăng chu kỳ quay của Dimorphos | $> 0\text{ s}$ |

---

## 7. Ma Trận Kiểm Thử Headless (14 Unit Test Cases)
Bộ kiểm thử `tests/dart-simulation.test.ts` chạy hoàn toàn độc lập với môi trường WebGL (`npm test`), bao phủ 100% các tình huống biên:
1. `PASS 1`: Kịch bản danh định va chạm Dimorphos với $\Delta T \approx -32.73\text{ min}$, đạt ngưỡng 73 giây.
2. `PASS 2`: Bay chệch hướng ngoài phạm vi va chạm được phân loại chính xác là `missed`.
3. `PASS 3`: Va chạm vào Didymos được định danh chính xác là `hit_wrong_body`.
4. `PASS 4`: Bước thời gian lớn ($\Delta t = 0.5\text{ s}$) ở vận tốc $6.14\text{ km/s}$ không bị xuyên hầm nhờ CCD.
5. `PASS 5`: Quỹ đạo lướt qua cách viền va chạm 10 m không kích hoạt va chạm giả.
6. `PASS 6`: Dữ liệu khối lượng bằng 0 hoặc âm được xử lý an toàn với `invalid_state`.
7. `PASS 7`: Va chạm cùng chiều làm tăng chu kỳ quỹ đạo đúng quy luật bảo toàn động lượng.
8. `PASS 8`: Năng lượng va chạm cực đại gây thoát ly hyperbol được gán nhãn chính xác mà không tính chu kỳ ảo.
9. `PASS 9`: Xung lực truyền động lượng chỉ áp dụng đúng 1 lần duy nhất trong suốt vòng đời mô phỏng.
10. `PASS 10`: Cơ chế lưu và khôi phục trạng thái (`snapshot / restore`) đạt tính tất định 100%.
11. `PASS 11`: Tính bất biến theo tần số lấy mẫu: bước tích phân ở 15, 30 và 60 FPS cho cùng kết quả va chạm.
12. `PASS 12`: Gọi kiểm tra sớm khi tàu chưa va chạm không thể trả về trạng thái hoàn thành sai lệch.
13. `PASS 13`: Hàm `reset()` hoàn trả toàn bộ cờ logic, đồng hồ và vector về điều kiện ban đầu.
14. `PASS 14`: Toàn bộ 42 khóa từ điển DART được định nghĩa đầy đủ và đồng bộ trên cả 9 ngôn ngữ.

---

## 8. Giới Hạn Kỹ Thuật & Đơn Giản Hóa Phục Vụ Giáo Dục
- **Trường hấp dẫn đơn giản hóa**: Mô hình sử dụng bài toán 2 vật thể Kepler chuẩn thay vì tích phân trường thế phi cầu đa cực ($C_{22}, J_2$) của tiểu hành tinh có hình dạng bất đối xứng.
- **Tỷ lệ hiển thị 3D (Visual Scale Notice)**: Trên không gian 3D của trình duyệt, đường kính $151\text{ m}$ của Dimorphos và $780\text{ m}$ của Didymos ở khoảng cách liên hành tinh sẽ trở thành các điểm ảnh đơn cực nhỏ. Do đó kích thước hình ảnh (visual mesh) được điều chỉnh tỷ lệ hiển thị hợp lý để học sinh quan sát rõ hình thái thiên thể và khói bụi va chạm, trong khi **bộ tính toán cơ học vật lý bên dưới (physics engine) luôn sử dụng 100% kích thước và khoảng cách thực theo đơn vị mét chuẩn SI**.
- **Hiệu năng & Tiết kiệm tài nguyên**: Hiệu ứng bụi vụn va chạm (ejecta plume) tự động điều chỉnh số lượng hạt theo cấu hình phần cứng thông qua `QualityManager` (10 hạt trên Low, 25 hạt trên Balanced, 45 hạt trên High) và tự động hủy bỏ hình học/vật liệu khỏi bộ nhớ GPU sau 3 giây.
