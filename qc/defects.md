# Defects — xuong-lap-te-bao v2
Updated: 2026-08-11 · iteration 2 (sau vòng 4-lens: 28 phát hiện, dedupe với đợt tự soi)

## Đợt 1 — tự soi bằng screenshot harness

| ID | Sev | Defect | Seen | Status |
|----|-----|--------|------|--------|
| D01 | P0 | Trạm đã đặt vô hình/tí hon: layer vẽ lại mỗi khung → animation restart; CSS scale trên `<g>` quanh gốc viewBox | 1 | fixed |
| D02 | P1 | Kiện đang biến đổi vẽ `scale(NaN)` — snapshot thiếu `tt` | 1 | fixed |
| D03 | P1 | Sản lượng chạy quá đơn hàng ("13/8") — sim chạy tiếp sau thắng | 1 | fixed |
| D04 | P1 | Bóng thoại đè lên Ô KHO | 1 | fixed |
| D05 | P2 | Ống khói nhân lơ lửng | 1 | fixed |
| D06 | P2 | Nhãn "Ti thể" bị tường cắt | 1 | fixed |
| D07 | P2 | Không có thoại xác nhận khi nối điện | 1 | fixed |
| D08 | P2 | Màn chốt chậm 900ms wall-clock ở chế độ máy | 1 | fixed |

## Đợt 2 — vòng review 4 lăng kính (code · logic · UI · interaction)

| ID | Sev | Defect | Seen | Status |
|----|-----|--------|------|--------|
| D09 | P0 | Thẻ thông tin (mở tự động khi nhấc chip) CHE Ô NGUỒN → kéo Ti thể vào bằng chuột thật là bất khả thi | 1 | fixed (chạm=xem thẻ, kéo=ẩn thẻ + `body.dragging` ẩn cứng; probe _p0check 8/8) |
| D10 | P0 | Gỡ trạm lúc kiện đang biến đổi → `TypeError reading "ra"` mỗi khung, sim đông cứng | 1 | fixed (remove() trả kiện về hàng chờ + guard nhánh transform; probe S11b) |
| D11 | P1 | `setTimeout(showDone,900)` không huỷ → Dọn sàn/về Bản đồ trong 0,9s vẫn bị màn chốt đè lên ca mới | 1 | fixed (doneTimer + clearTimeout trong resetShift) |
| D12 | P1 | Vòng lặp truyền dt thô → tốc độ sim phụ thuộc tần số quét (90Hz chạy 0,75×, 240Hz chạy 2×) | 1 | fixed (bộ tích luỹ acc, giữ phần dư mỗi khung) |
| D13 | P1 | Đồng hồ màn chốt lấy đồng hồ tường, hook-run hiện "0 giây" — vi phạm honesty | 1 | fixed (sim.runT — chỉ đếm lúc ca chạy; probe S13b) |
| D14 | P1 | Thoại "chưa có nguồn" đứng lại sau khi đã nối điện | 1 | fixed (thoại power-on khi tia ATP đầu; trùng D07) |
| D15 | P1 | Không pointercancel/capture: Escape/gián đoạn giữa kéo kẹt ghost, chạm pad sau đặt lén chip cũ | 1 | fixed (cancelDrag + setPointerCapture + blur; probe _p0check) |
| D16 | P1 | Khay mobile không cuộn được bằng chạm (touch-action:none) → 4 chip ngoài tầm với | 1 | fixed (khay bọc 2 hàng ở màn hẹp, hết cuộn ngang) |
| D17 | P2 | Bật/tắt điện làm mọi trạm pop lại | 1 | fixed (bang chỉ khi bố trí pads đổi) |
| D18 | P2 | Lắc "!" theo performance.now → khung hình không tất định | 1 | fixed (theo sim.t) |
| D19 | P2 | Nút chạy còn bấm được dưới modal chốt → out vượt 8 | 1 | fixed (guard sim.done + sim tự dừng khi thắng) |
| D20 | P2 | Trạm ATP làm nốt kiện đang dở khi vừa mất điện | 1 | fixed (freeze tt khi mất điện; probe S05b) |
| D21 | P2 | `__step(0)` tiến 1 substep, sai contract render-only | 1 | fixed (bỏ max(1,…); probe S20b) |
| D22 | P2 | Ba bản sao sim-core (html/_core/_ui) dễ lệch | 1 | fixed (_probe tự bốc từ html; xoá _ui.js) |
| D23 | P2 | Assertion `\|\| true` vô nghĩa trong _probe.js | 1 | fixed |
| D24 | P2 | Dead code: __doneStack, ternary hai nhánh giống nhau | 1 | fixed |
| D25 | P2 | Ô KHO không đọc ra "sát nhân" | 1 | fixed (dời (296,196) + vạch nối đứt vào vai nhân) |
| D26 | P2 | Chữ hint 12px khó đọc khi trình chiếu | 1 | fixed (15px, đậm màu hơn) |
| D27 | P2 | Về Bản đồ rồi vào lại bị xoá trắng ca đang dở | 1 | fixed (giữ ca; chỉ dọn khi xong ca hoặc lần đầu) |
| D28 | P2 | Thẻ thông tin có thể chạm mép bóng thoại ở 1280×720 | 1 | fixed (dời thẻ sang 58%) |
| D29 | P2 | Kiện chạy đè lên nhãn trạm ("Bộ máy Golgi", "TRẠM 4") thoáng qua | 1 | **open** — chấp nhận ở mức demo |
| D30 | P2 | Vẽ lại toàn bộ node kiện mỗi khung + loop không gate theo màn hình | 1 | **open** — quy mô 9 kiện, chưa đo được hệ quả thật |
| D31 | P2 | Pad chạm ~35px trên điện thoại dọc (<44px chuẩn) | 1 | **open** — thiết bị đích của demo là tablet/desktop |

## Đợt 3 — người kiểm độc lập (final sweep, PASS)

| ID | Sev | Defect | Seen | Status |
|----|-----|--------|------|--------|
| D32 | P2 | Kiện xếp hàng che một phần bảng tên trạm khi ứ đông | 1 | open — demo chấp nhận |
| D33 | P2 | Góc Ô NGUỒN–TRẠM 2 hơi chật, chữ chạm mép nhà | 1 | open — demo chấp nhận |
| D34 | P2 | Chữ phụ SVG ~10-11px hiển thị thật ở 720p, bàn cuối lớp khó đọc | 1 | open — hình khối/màu gánh phần hiểu |
| D35 | P2 | Tệp harness dev nằm cạnh tệp giao hàng | 1 | fixed — dời vào prototype/qa/, ảnh bằng chứng về qc/evidence/ |

## Đợt 4 — thêm Mầm + viết lại chữ + bỏ popup lý thuyết

| ID | Sev | Defect | Seen | Status |
|----|-----|--------|------|--------|
| D36 | P1 | Lý thuyết hiện bằng popup che hết dây chuyền, người học không xem được hệ thống chạy trong lúc đọc | 1 | fixed — bảng lý thuyết mở tại chỗ bên cạnh, băng chuyền vẫn chạy, đơn ngừng đếm ở 8 |
| D37 | P1 | Bóng thoại bác trưởng xưởng giữ nguyên câu mở màn sau khi đã xong việc | 1 | fixed — bác chốt một câu khi đủ đơn |
| D38 | P1 | Khung dọc: hai bóng thoại (bác + Mầm) đè lên nhau, không đọc được câu nào | 1 | fixed — màn hẹp chỉ hiện bóng của người vừa nói |
| D39 | P1 | Bảng tên trạm bị kiện hàng xếp hàng che mất chữ | 1 | fixed — tách lớp nhãn, vẽ sau lớp kiện hàng |
| D40 | P2 | Nhãn "Ổ ĐIỆN" bị băng chuyền chạy đè, khó đọc | 1 | fixed — viền trắng quanh chữ (paint-order) |
| D41 | P2 | Bảng tên hai dòng ở Ổ ĐIỆN tràn qua tường dưới của tế bào | 1 | fixed — dời ô nguồn lên (520, 508) |
| D42 | P2 | Mầm trên bản đồ đứng đè vào công trình Vườn thực nghiệm | 1 | fixed — dời Vườn sang phải, Mầm đứng cạnh bảng tên cây |
| D43 | P2 | Thuật ngữ Sinh học dồn vào mặt người chơi trước khi giải thích ("bào quan", "Lưới nội chất hạt") | 1 | fixed — hai lớp tên: tên nghề to + tên sách nhỏ in nghiêng |
