# Defects — xuong-lap-te-bao v2
Updated: 2026-08-11 · iteration 1 (tự soi bằng screenshot harness trước khi 4-lens về)

| ID | Sev | Defect | Seen | Status |
|----|-----|--------|------|--------|
| D01 | P0 | Trạm đã đặt vô hình/tí hon: layer trạm vẽ lại mỗi khung → animation `bang` restart; và CSS scale trên `<g>` SVG scale quanh gốc viewBox chứ không quanh tâm | 1 | fixed (chỉ dựng lại khi padsKey đổi + `transform-box:fill-box`) |
| D02 | P1 | Kiện đang biến đổi vẽ `scale(NaN)` — snapshot không kèm `tt` | 1 | fixed (snapshot kèm tt + guard Number.isFinite) |
| D03 | P1 | Sản lượng chạy quá đơn hàng, hiển thị "13/8" — sim vẫn chạy sau khi thắng | 1 | fixed (win → running=false, hết ca) |
| D04 | P1 | Bóng thoại bác trưởng xưởng đè lên Ô KHO (S2) góc trên-trái | 1 | fixed (chuyển foreman xuống góc dưới-trái) |
| D05 | P2 | Ống khói nhân lơ lửng cách mái 24px — vật thể trôi nổi | 1 | fixed (hạ y 236→268) |
| D06 | P2 | Nhãn "Ti thể" ở Ô NGUỒN bị tường dưới cắt | 1 | fixed (S1 y 592→552) |
| D07 | P2 | Bác trưởng xưởng không xác nhận khi nối điện thành công sau lời nhắc pin đỏ | 1 | fixed (thoại "Có điện rồi đó!" khi tia ATP đầu tiên) |
| D08 | P2 | Màn chốt hiện chậm 900ms ở chế độ máy review (setTimeout wall-clock) | 1 | fixed (auto=false → showDone ngay) |
