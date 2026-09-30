# Thế giới học liệu

Đây là bản demo thử ý tưởng biến học liệu trong kho Trường học số thành game. Người học không trả lời trắc nghiệm. Các em lắp, sửa, đặt thứ gì đó rồi nhìn hệ thống chạy hoặc hỏng. Bản này làm để trình chiếu và bàn hướng đi, chưa nối với kho thật.

Người làm: Bob (BobLe, bob@techainer.com), tháng 8/2026 (11–13/08). Tình trạng: bản demo.

## Mở hoặc chạy thế nào

Không cần cài gì. Mở thẳng file HTML bằng Chrome hoặc Edge:

- `prototype/xuong-lap-te-bao.html` là bản chính, mới nhất.
- `prototype/xuong-te-bao-gimkit.html` là bản thử kiểu Gimkit (đi lại trong xưởng, trả lời câu hỏi để lấy năng lượng).

Máy có mạng thì chữ hiện đúng phông Baloo 2. Không có mạng vẫn chơi được, chỉ đổi phông.

Bản đã đưa lên mạng: https://ths-xuong-lap-te-bao.vercel.app. Link này chỉ có game đầu tiên (bản ngày 11/08), chưa có hai game sau.

## Trong bản demo có gì

Màn đầu là một dãy 12 câu hỏi thuộc 4 môn. Ba câu có game, các câu còn lại đang khóa:

| Câu hỏi | Môn, lớp | Game |
|---|---|---|
| Làm sao tế bào biết phải làm việc gì? | Sinh học 10 | Xưởng lắp tế bào: đặt bào quan lên băng chuyền cho ra đủ 8 kiện đạm |
| Điện trong nhà chạy từ đâu tới? | KHTN 8 | Trạm điện khu phố: tìm chỗ hỏng cho 6 nhà sáng đèn, chơi được 2 người trên một máy |
| Đặt trạm đo mưa ở đâu mới chuẩn? | Địa lý 6 | Đoàn khảo sát: suy luận từ manh mối, có giới hạn ngày công |

Đi cùng người chơi là Mầm, linh vật vẽ lại theo gương mặt chatbot của Trường học số. Mầm chỉ hỏi, không phán đúng sai.

## Trong repo có gì

| Thư mục, file | Để làm gì |
|---|---|
| `prototype/` | Hai bản game (mỗi bản một file HTML) và ảnh chụp màn hình |
| `prototype/qa/` | Script chụp màn hình, script dò lỗi, script Python đã dùng để vá file HTML, ảnh chụp từng vòng kiểm |
| `deploy/` | Bản đưa lên Vercel: `index.html` và `vercel.json`. Cách deploy lại ghi trong `deploy/README.md` |
| `docs/superpowers/specs/` | Tài liệu thiết kế bản v1 đầy đủ (3 game, thị trấn 2.5D, chơi nhiều người). Bản demo chỉ làm một phần nhỏ |
| `docs/khao-sat-cong-nghe-game-2026-08-13.md` | Khảo sát có nên sưu tầm game mã nguồn mở hay đổi engine không |
| `docs/bao-cao-khao-sat-game.html` | Bản HTML của khảo sát trên, viết lại cho người không rành kỹ thuật đọc |
| `docs/khao-sat-2.5d-cot-truyen-tai-san-2026-08-13.md` | Khảo sát làm 2.5D, thêm cốt truyện, tận dụng hình vẽ có sẵn trên mạng |
| `qc/` | Sổ lỗi đã sửa, bảng yêu cầu và kết quả kiểm, ảnh làm bằng chứng |

## Dữ liệu

Không có dữ liệu người dùng. Nội dung bài học (bào quan, mạch điện, bản đồ mưa) viết tay trong file HTML, bám SGK. Không đăng nhập, không gọi máy chủ nào, không lưu tiến độ.

## Không có trong repo

Thư mục `deploy/.vercel/` được để lại trên máy. Nó chỉ dùng để nối thư mục với dự án Vercel trên tài khoản của Bob, Vercel dặn không chia sẻ ra ngoài.

## Lưu ý cho người nhận

- `deploy/index.html` là bản cũ. Muốn đưa bản mới lên thì chép `prototype/xuong-lap-te-bao.html` sang rồi deploy lại. Người nhận phải nối lại với tài khoản Vercel của mình, vì dự án hiện nằm dưới tài khoản của Bob.
- Script trong `prototype/qa/*.js` mượn Playwright từ `node_modules` của repo `prj-gkebook-shadcn-frontend`, đường dẫn ghi cứng theo máy Bob. Sang máy khác phải sửa dòng `require` hoặc cài Playwright riêng.
- Các file `prototype/qa/_patch_*.py` và `_fix_loi.py` đã chạy xong. Đừng chạy lại trên file HTML hiện tại, dễ bị chèn trùng.
- Bản Gimkit có câu hỏi trắc nghiệm, khác nguyên tắc "không hỏi–đáp" của bản chính. Nó chỉ là bản thử để so sánh cảm giác chơi.
- Tài liệu thiết kế tự ghi rằng bản demo là đồ bỏ sau khi trình chiếu. Nếu làm thật thì bắt đầu từ tài liệu thiết kế và hai file khảo sát, không phát triển tiếp từ file HTML này.
