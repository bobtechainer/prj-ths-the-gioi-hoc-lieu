# Design v2 — Xưởng lắp tế bào: "Nhà máy tí hon"

Combo đã duyệt (build-registry 2026-08-11): build-assemble · inside-the-machine ·
paper-craft sáng · mystery-first · **kiện hàng chạy thật, dồn ứ trước trạm thiếu**.

## Căn cứ thực tế
- Con đường tiết protein trong SGK Sinh học 10 (Bài 8 — Tế bào nhân thực):
  nhân (mARN) → ribosome (chuỗi polypeptide) → lưới nội chất hạt (gấp) →
  bộ máy Golgi (đóng gói) → túi tiết → màng sinh chất. Ribosome và Golgi
  tiêu tốn ATP do ti thể cung cấp.
- Tiền lệ game: CellCraft (lắp bào quan rồi tế bào tự chạy). Bản v1 của chính
  dự án: người xem không hiểu vì dòng chảy chỉ là vạch đứt trừu tượng.

## Vấn đề v1 → cách sửa
| V1 gây khó hiểu | V2 |
|---|---|
| 6 ô tròn giống hệt nhau xếp vòng, không thấy thứ tự | Băng chuyền giấy vẽ sẵn từ Nhân → Cửa xuất, pad đánh số theo dòng |
| Dòng chảy = vạch đứt, chỉ hiện sau khi bấm nút | KIỆN HÀNG là vật thể thật, sinh ra từ Nhân, chạy trên băng, nhìn thấy từng bước biến đổi |
| "Tắt ở đâu" phải đọc chữ trong nhật ký | Kiện DỒN Ứ thành đống ngay trước trạm thiếu, kèm bong bóng "!" — không cần đọc |
| Nhân cũng phải tự đặt → không có điểm khởi đầu | Nhân dựng sẵn trong cảnh, là đầu dây chuyền |
| Nhu cầu ATP vô hình | Dây cáp điện vẽ sẵn từ pad nguồn tới 2 trạm; trạm chưa có điện hiện pin đỏ |

## Bố cục màn chơi
- Tế bào = sàn nhà máy nhìn cắt ngang, màng là tường giấy dày, CỬA XUẤT bên phải.
- NHÂN dựng sẵn (mái vòm giấy) ở đầu băng. Băng chuyền uốn chữ S qua 4 pad
  P1→P4 rồi tới cửa. Pad nguồn S1 (giữa dưới) nối cáp vàng tới P1 và P3.
  Pad kho S2 nằm SÁT NHÂN (bẫy lysosome).
- Khay 7 bào quan: Ribosome, Lưới nội chất hạt, Golgi, Túi tiết, Ti thể,
  Lysosome, Lục lạp. Lời giải: P1..P4 đúng thứ tự + Ti thể vào S1. S2 để trống.
- Bác trưởng xưởng (đầu giấy cắt, mũ bảo hộ) thoại viết sẵn trong bong bóng.

## Luật mô phỏng (kiện hàng)
- Nhân sống → sinh kiện mARN theo chu kỳ cố định (không ngẫu nhiên).
- Kiện đến pad: trạm đúng chức năng + đủ điện → biến đổi (nảy 0,5s) → đi tiếp.
  Ngược lại → xếp hàng trước pad, chồng đống, lắc lư; ≥3 kiện hiện "!".
- Ti thể ở S1 → tia chớp ATP bay theo cáp; Ribosome/Golgi không điện = pin đỏ, đứng.
- Kiện tới cửa → nổ pháo giấy, đếm sản lượng +1. Đủ 8 kiện → màn chốt.
- Lysosome đặt vào S2 → bọt enzyme bay sang nhân → nhân xám, nứt, ngừng sinh kiện.
  Gỡ ra → nhân hồi (demo cần đảo ngược được). Lysosome ở pad khác: vô hại.
- Lục lạp: vô hại, không làm gì; bác trưởng xưởng bình luận (tế bào động vật).
- Không có chữ "Sai"/"Đúng" ở bất kỳ đâu trong lúc chơi.

## Ba màn giữ nguyên
Bản đồ (đảo giấy, 3 công trình, 1 mở) → Chơi → Chốt chặng (thoại + loot +
"Xem lại trong bài" trích SGK trang 47).

## Kỹ thuật
- Một tệp HTML, SVG 2D, không phụ thuộc ngoài. Mở là chạy, chiếu máy chiếu rõ.
- LÕI MÔ PHỎNG là script THUẦN tách riêng (`<script id="sim-core">`, không đụng
  DOM) — bốc ra chạy được trong Node để probe số liệu.
- Bước cố định 1/120s, không Math.random trong logic. Hooks theo contract:
  `__step __place __remove __setRun __state __goScreen __screenPos`.
