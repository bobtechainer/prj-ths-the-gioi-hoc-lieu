# Spec matrix — xuong-lap-te-bao v2 "Nhà máy tí hon"
Updated: 2026-08-11 · iteration 2

| ID  | Requirement | Verify | W | Status |
|-----|-------------|--------|---|--------|
| S01 | Băng chuyền hiển thị sẵn từ Nhân → Cửa xuất, pad P1–P4 đánh số theo dòng, S1 có cáp điện tới P1+P3, S2 sát nhân | shot:empty | 5 | ✓ |
| S02 | Nhân dựng sẵn, sinh kiện mARN theo chu kỳ cố định khi đang chạy | probe:spawn | 5 | ✓ |
| S03 | Kiện dồn ứ trước pad trống/không xử lý được; ≥3 kiện hiện bong bóng "!" | probe:queue | 5 | ✓ |
| S04 | Trạm đúng chức năng biến đổi kiện đúng loại (mARN→thô tại Ribosome, thô→gấp tại LNC, gấp→gói tại Golgi, gói→xuất tại Túi tiết) | probe:transform | 5 | ✓ |
| S05 | Ribosome/Golgi không có Ti thể ở S1 → pin đỏ, không xử lý, kiện ứ; đặt Ti thể → có tia ATP, chạy lại | probe:atp | 5 | ✓ |
| S06 | Xếp đúng 5 trạm → kiện đi hết dây chuyền, sản lượng tăng, đủ 8 → màn chốt | probe:complete | 5 | ✓ |
| S07 | Lysosome vào S2 (sát nhân) → nhân ngừng sinh kiện + hiệu ứng rõ; gỡ ra → nhân hồi; Lysosome pad khác vô hại | probe:lyso | 5 | ✓ |
| S08 | Sai thứ tự trên băng (vd Golgi ở P1) → kiện ứ trước trạm đó, không crash, không deadlock sim | probe:order | 3 | ✓ |
| S09 | Không có chữ "Sai"/"Đúng"/"Wrong" trong UI lúc chơi | code:no-sai | 3 | ✓ |
| S10 | Kéo-thả bằng pointer events (chuột + cảm ứng); chip đã dùng mờ đi; thả ngoài pad → trả về khay | drag:place | 3 | ~ |
| S11 | Chạm trạm đã đặt → gỡ về khay, sim cập nhật ngay cả khi đang chạy | drag:remove | 3 | ~ |
| S12 | 3 màn bản đồ → chơi → chốt; nút điều hướng hoạt động cả hai chiều | shot:map,done | 3 | ✓ |
| S13 | Màn chốt: thoại bác trưởng xưởng + loot + "Xem lại trong bài" mở trích đoạn có nguồn trang | shot:done | 3 | ✓ |
| S14 | Chạm chip trong khay → thẻ thông tin: tên, làm gì, cần, tạo ra | shot:info | 3 | ~ |
| S15 | Art paper-craft sáng nhất quán cả 3 màn; chữ to đọc được khi trình chiếu | shot:style | 1 | ✓ |
| S16 | 1280×720 không chồng lấn UI; khung dọc điện thoại vẫn dùng được | shot:720 | 3 | ~ |
| S17 | (Honesty) Số sản lượng trên màn == parcelsExited trong __state() | probe:cal | 5 | ✓ |
| S18 | (Honesty) __step tất định: cùng state + cùng lệnh → cùng kết quả byte-một | probe:det | 3 | ✓ |
| S19 | (Honesty) Fuzz 200 cách xếp ngẫu nhiên + chạy 60s sim: không crash, không NaN, sim không kẹt vô hạn | probe:fuzz | 3 | ✓ |
| S20 | Hooks đủ theo contract: __step __place __remove __setRun __state __goScreen __screenPos; sim-core thuần bốc chạy được trong Node | code:hooks | 3 | ~ |
| S21 | Thoại bác trưởng xưởng đúng giọng nhân vật, ngắn, không giọng máy | shot:log | 1 | ✓ |
