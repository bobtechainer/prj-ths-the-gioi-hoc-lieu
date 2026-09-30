# 2.5D, cốt truyện, và tài sản có sẵn — khảo sát nhanh

**Ngày:** 13/08/2026
**Câu hỏi gốc:** *"Biến Xưởng lắp tế bào thành 2,5D và có cốt truyện — có cách nào không, và có tận dụng được mô hình có sẵn trên mạng để khỏi phải vẽ không?"*
**Chế độ:** quick brief (deep-research). Nối tiếp `khao-sat-cong-nghe-game-2026-08-13.md`, không lặp lại kết luận cũ.

---

## 0. Trả lời ngắn

**Có — cả ba việc đều làm được, nhưng không phải theo thứ tự đội đang nghĩ.**

Phát hiện đắt giá nhất của đợt khảo sát này: **NIH BioArt Source có sẵn hơn 2.000 hình khoa học vẽ chuyên nghiệp, có hẳn mục "Cells and Organelles", tải được file SVG, giấy phép Public Domain, dùng thương mại thoải mái.** Nghĩa là bộ hình bào quan đội đang vẽ tay từng đường `<path>` một — có bản làm sẵn bởi hoạ sĩ y khoa của chính phủ Mỹ, đúng định dạng SVG mà renderer hiện tại đang dùng, không phải đổi engine, không phải chuyển 3D, không phải ghi công.

Còn "2,5D" thì phải tách làm ba nghĩa rất khác nhau về giá. Nghĩa rẻ nhất chỉ tốn vài ngày và **không cần model 3D nào cả**.

---

## 1. "2,5D" là ba thứ khác nhau — chọn nhầm là mất một tháng

| Đường | Là gì | Có cần model 3D? | Công | Sim-core |
|---|---|---|---|---|
| **A. Chiếu trục đo (isometric)** | Vẫn vẽ 2D, chỉ đổi phép chiếu toạ độ + sắp xếp lớp theo chiều sâu | ❌ Không | **2–4 ngày** | Giữ nguyên 100% |
| **B. Lớp chiều sâu + đổ bóng** | Nền / sân / tiền cảnh trượt lệch tốc độ, bóng đổ, nghiêng nhẹ | ❌ Không | **1–2 ngày** | Giữ nguyên 100% |
| **C. 3D thật, camera trực giao** | Three.js `OrthographicCamera`, mesh thật, ánh sáng thật | ✅ Có | **3–6 tuần** | Giữ nguyên, viết lại toàn bộ lớp UI |

### Vì sao A rẻ đến thế

Lớp UI hiện tại đã tự khai báo đúng chỗ cần sửa:

```js
/* ---------- hình học băng chuyền (chỉ UI biết pixel) ---------- */
const NODES = [ { x: 268, y: 352 }, ... ];
```

Toạ độ đã nằm gọn một chỗ, và `SIM` hoàn toàn không biết gì về pixel. Chuyển sang trục đo là chèn **một hàm chiếu** vào giữa:

```js
const ISO = ({x, y, z = 0}) => ({
  sx: (x - y) * 0.866,          // cos 30°
  sy: (x + y) * 0.5 - z          // sin 30°, z là độ cao
});
const depth = ({x, y}) => x + y; // sắp xếp lớp: cộng lớn thì vẽ sau
```

Rồi mọi `E('circle', {cx, cy})` đọc qua `ISO()` thay vì đọc thẳng. Thêm một bước `sort(depth)` trước khi append vào layer. Toàn bộ phần khó — logic dây chuyền, hàng đợi, kẹt máy — không đụng một dòng.

**Cái đắt không phải phép toán, mà là hình.** Hình vẽ chính diện đặt vào cảnh trục đo sẽ trông lệch. Mỗi bào quan cần một góc nhìn nghiêng. Đó chính là chỗ mục 2 giải quyết.

### Vì sao chưa nên nhảy thẳng vào C

Báo cáo trước đã đo: đội đang có **12 môn × 30 chủ đề = 360 game**, và bài toán thật là kho nội dung chứ không phải engine. Three.js thêm vào đó:

- Ngân sách tải: Three.js core ~170 KB gzip, cộng model, cộng texture — trên máy tính bảng rẻ mà học sinh thật sự dùng thì đây là rủi ro có thật, không phải lo xa.
- Ngưỡng an toàn thực tế cho web di động là **dưới ~100K tam giác toàn cảnh**, và phải gộp mesh để giảm draw call.
- Model khoa học tải từ NIH 3D là mesh in 3D — **rất nhiều tam giác, không có UV, không có texture**. Không phải "tải về thả vào là chạy"; phải làm lại lưới (retopo) và bung UV. Đây là công việc 3D chuyên môn, không rẻ hơn vẽ.

**Khuyến nghị: làm A + B trước.** Nếu sau đó vẫn muốn 3D thật, làm bản thử 3 ngày trên máy tính bảng thật, đúng kỷ luật báo cáo trước đã đặt ra.

---

## 2. Tài sản có sẵn — không phải vẽ nữa

### 2.1 NIH BioArt Source — nguồn tốt nhất, và nó là 2D SVG

**https://bioart.niaid.nih.gov**

| Hạng mục | Thực tế |
|---|---|
| Số lượng | 2.000+ hình khoa học/y khoa |
| Có mục cần dùng? | ✅ **"Cells and Organelles"** — một trong 16 mục |
| Định dạng | **AI, EPS, PNG, SVG** — tải riêng hoặc tải cả bộ, có bản nhiều màu và bản xám |
| Giấy phép | **Public Domain** cho phần lớn mục — *"free for any use, including educational, research, informational, and commercial purposes"* |
| Ghi công | *"Citation is appreciated but not required"* với mục Public Domain |
| Ai vẽ | Hoạ sĩ minh hoạ y khoa chuyên nghiệp của NIH |

Đã kiểm chứng trực tiếp một mục: **BIOART-000352 "Mitochondria"** — vector, tác giả Ryan Kissinger, ghi rõ **Public Domain**.

**Vì sao đây là câu trả lời đúng cho đội:** renderer hiện tại là inline SVG. Hình BioArt cũng là SVG. Đây là thay thế **trực tiếp**, không qua trung gian, không đổi công nghệ, không đổi kiến trúc. Việc còn lại chỉ là ép bảng màu về 6 màu đã chốt ở báo cáo trước — mà đội đã định viết script làm việc đó rồi.

⚠️ **Bẫy phải tránh:** BioArt có bộ lọc theo giấy phép, và trong kho **có cả CC-BY-NC** (cấm thương mại). **Bắt buộc lọc "Public Domain" trước khi tải**, và ghi lại mã BIOART-xxxxxx của từng hình đã dùng. Lấy nhầm một hình NC là dính đúng cái bẫy §5.3 báo cáo trước đã cảnh báo.

### 2.2 Các nguồn khác, xếp theo mức dùng được

| Nguồn | Nội dung | Giấy phép | Dùng cho | Đánh giá |
|---|---|---|---|---|
| **NIH BioArt** | Bào quan, tế bào, quá trình tế bào (2D vector) | Public Domain (lọc kỹ) | Toàn bộ hình sinh học | 🟢 **Dùng ngay** |
| **Kenney.nl** | 40.000+ tài sản game | CC0 | Giao diện, âm thanh, prop nhà máy | 🟢 Đã dùng phần âm thanh, dùng tiếp phần hình |
| **Quaternius** | Nhân vật low-poly, phần lớn **đã gắn xương và có animation** | CC0 | Nhân vật Mầm nếu lên 3D | 🟢 Sạch, nhưng chỉ cần khi đi đường C |
| **KayKit (Kay Lousberg)** | Bộ low-poly: nhân vật, hầm ngục, prop | CC0 (bản miễn phí) | Bối cảnh nhà máy | 🟢 Sạch |
| **NIH 3D** (3d.nih.gov) | Mesh sinh học: tế bào, bào quan, phân tử. STL/GLB | CC hoặc Public Domain **tuỳ từng mục** | Chỉ khi đi đường C | 🟡 Mesh in 3D — phải retopo, tốn công |
| **Sketchfab** | Rất nhiều model bào quan miễn phí | **Hỗn hợp** — CC0 / CC-BY / CC-BY-NC / Editorial | Chỉ khi đi đường C | 🔴 **Rủi ro cao, đọc kỹ** |

### 2.3 Cảnh báo riêng về Sketchfab

Sketchfab trộn ba hệ giấy phép khác nhau trên cùng một trang, và mặc định tìm kiếm **không** lọc giúp:

1. **CC0** — thoải mái, không cần ghi công.
2. **CC-BY** — dùng thương mại được, **nhưng phải ghi công tác giả + link về Sketchfab, và phần ghi công phải đi theo tài sản ở mọi nơi nó xuất hiện.** Tài liệu chính chủ nói rõ: nếu sản phẩm cho người dùng cuối tạo ra thứ gì đó, **người dùng cuối cũng phải thấy được ghi công**, không chỉ người tạo. Với game bán cho trường thì đây là nghĩa vụ vận hành thật, không phải thủ tục.
3. **Standard / Editorial License riêng của Sketchfab** — Editorial **cấm hoàn toàn mọi mục đích thương mại**. Standard cấm phân phối tài sản dưới dạng file độc lập.

Nhiều model bào quan tìm được ghi *"educational use"* trong phần mô tả — đó **không phải** một giấy phép hợp lệ, và không tương đương "được dùng trong sản phẩm giáo dục bán cho trường". Bán phần mềm cho trường vẫn là hoạt động thương mại.

**Quy tắc: chỉ lấy CC0 từ Sketchfab.** Muốn lấy CC-BY thì phải dựng sẵn màn "Nguồn hình ảnh" trong game trước khi tải hình đầu tiên.

---

## 3. Sinh model bằng AI — được, nhưng có một cái bẫy pháp lý riêng của Việt Nam

| Công cụ | Chất lượng | Giấy phép đầu ra | Ghi chú |
|---|---|---|---|
| **Meshy 6** | Tốt nhất trong nhóm dịch vụ trả phí; 63,8% người đánh giá chuyên môn chọn | **Bản miễn phí: CC BY 4.0 → bắt buộc ghi công.** Gói trả phí: đầy đủ quyền thương mại | Đường sạch nhất nếu chịu trả tiền |
| **Tripo** | Đáng tiền nhất cho quy trình game; có tự gắn xương, retopo tứ giác nhanh | Bản miễn phí cũng **CC BY 4.0** | Tự gắn xương là điểm cộng lớn cho nhân vật |
| **Rodin Gen-2.5** | Hình học chi tiết nhất | Theo gói | |
| **TRELLIS 2** (Microsoft Research) | Texture đẹp nhất (Gaussian Splatting) | **MIT — sạch nhất về pháp lý** | Mã nguồn mở, nhưng cần card 24 GB (~2.000 USD) |
| **Hunyuan3D 2.1** | Tốt | Giấy phép cộng đồng, **loại trừ lãnh thổ EU / Anh / Hàn Quốc** | Việt Nam không bị loại trừ, nhưng phải đọc kỹ nếu sau này bán ra ngoài |

⚠️ **Bẫy quan trọng nhất — nối thẳng với §5.6 báo cáo trước.** **Nghị định 134/2026, Điều 5a** (hiệu lực 9/4/2026): quyền tác giả chỉ phát sinh khi con người đóng góp *"đáng kể và mang tính quyết định"*. Gõ prompt "mitochondria low poly" rồi nhận kết quả **không đạt ngưỡng đó**.

Hệ quả cụ thể: đội **được phép dùng** model AI sinh ra, nhưng **có thể không sở hữu** chúng — ai chép cũng không kiện được. Với hợp đồng bán cho trường có điều khoản cam kết sở hữu trí tuệ, đây là rủi ro thật.

**Cách xử lý, gần như miễn phí nếu làm từ đầu:** mỗi model AI sinh ra đều phải qua tay người — chỉnh lưới, sửa tỉ lệ, áp bảng màu 6 màu của dự án, ghép vào cảnh — và **lưu vết quá trình đó**. Có hồ sơ chứng minh người đã thiết kế, chọn lọc, biên tập thì mới đạt ngưỡng "đáng kể và mang tính quyết định".

**So sánh thẳng:** BioArt cho hình **đã do người vẽ, Public Domain, không vướng Điều 5a, không cần ghi công, không cần retopo, đúng định dạng SVG đang dùng**. AI sinh model chỉ đáng làm nếu đội đã quyết đi đường C và cần thứ BioArt không có (nhân vật, bối cảnh nhà máy) — mà chỗ đó thì Quaternius và KayKit đã có sẵn CC0 rồi.

---

## 4. Cốt truyện — bằng chứng nói gì

### 4.1 Con số

| Nguồn | Kết quả | Hạng |
|---|---|---|
| **Barz và cộng sự (2024)**, *Review of Educational Research* — meta-analysis học qua game số ở trường | Học tập chung **g = .54**; nhận thức **g = .67**; động lực – cảm xúc **g = .32** | Tier 1 (Q1, có bình duyệt) |
| Meta-analysis game số trong STEM K-12, 33 nghiên cứu (N = 3.894) | Hiệu ứng tổng **ES = 0,667** | Tier 1 |
| Tổng quan phê phán game giáo dục có cốt truyện, 130 nghiên cứu | Chỉ **2,3%** báo cáo game kém hơn nhóm đối chứng; **62,3%** đạt toàn bộ mục tiêu giáo dục | Tier 2 — mới đọc phần tóm tắt |
| **Crystal Island** (Lester và cộng sự, NC State) — môi trường học tập lấy truyện làm trung tâm, vi sinh vật học lớp 8 | Tăng có ý nghĩa thống kê **cả kiến thức khoa học lẫn năng lực giải quyết vấn đề**; kết quả ổn định giữa hai giới | Tier 1 |

### 4.2 Điều bằng chứng KHÔNG nói — phần quan trọng hơn

Cùng bộ tài liệu đó cũng cho thấy đóng góp riêng của cốt truyện vào **kiến thức** thì **vẫn đang tranh cãi**:

- Tổng quan 130 nghiên cứu xếp game có cốt truyện là **hiệu quả rõ rệt hơn** ở thái độ, gắn kết, động lực, kỹ năng — nhưng chỉ **"nhỉnh hơn một chút"** ở tiếp thu kiến thức, và **ngang bằng** ở thay đổi hành vi.
- Có nghiên cứu tìm thấy chơi game có truyện **không giúp học tốt hơn so với xem trình chiếu**; cái tăng lên là cảm giác nhập vai tự đánh giá.

**Diễn giải thẳng:** cốt truyện mua được **động lực và sự kiên trì**, không tự động mua được **điểm số**. Và cốt truyện gắn hờ vào bên ngoài còn có nguy cơ gây hại — hiệu ứng "chi tiết hấp dẫn" (seductive details): trang trí thú vị nhưng không liên quan sẽ kéo sự chú ý ra khỏi nội dung cần học.

### 4.3 Kết luận thiết kế

Ranh giới nằm ở chỗ **truyện có mang cơ chế chơi hay chỉ khoác lên nó**.

Crystal Island là khuôn mẫu gần nhất với Xưởng lắp tế bào — cũng sinh học, cũng lứa tuổi trung học cơ sở — và nó hoạt động vì **câu hỏi của truyện chính là câu hỏi của bài học**: có dịch bệnh trên đảo, phải tìm ra mầm bệnh; muốn tìm ra thì buộc phải hiểu vi sinh vật.

Game hiện tại đã có sẵn hạt giống đúng chỗ. Màn chọn chuyện không hỏi "bào quan là gì" mà hỏi:

> *"Làm sao tế bào biết phải làm việc gì?"*

Đó đã là câu hỏi truyện rồi. Việc còn thiếu là **hệ quả**: hiện tại đặt sai máy thì dây chuyền kẹt — đúng, nhưng không ai thiệt gì. Khuôn Crystal Island là biến nó thành điều tra:

- Nhà máy đang chạy thì **hỏng** — kiện hàng ra sai, có thứ gì đó đã ngừng việc.
- Người chơi phải **chẩn đoán bào quan nào**, bằng cách quan sát triệu chứng ở đầu ra chứ không phải bằng cách đọc nhãn.
- Sửa được thì nhà máy chạy lại; sai thì có manh mối mới, không phải màn hình thua.

Thiết kế đó thoả cả hai: cốt truyện **là** cơ chế (không phải trang trí → không dính bẫy chi tiết hấp dẫn), và nó dùng lại nguyên vẹn lõi mô phỏng đang có — chỉ thêm trạng thái "một trạm bị hỏng ngầm" vào `SIM.create()`.

⚠️ Một cảnh báo tiếp nối báo cáo trước: **hỏng máy không được xử lý như trừng phạt.** Không rung màn, không tiếng báo lỗi gắt. Hỏng là **manh mối**, là thứ đáng tò mò.

---

## 5. Việc nên làm, theo thứ tự

| Thứ tự | Việc | Công | Được gì |
|---|---|---|---|
| 1 | **Thay hình bào quan bằng BioArt Public Domain**, ép về 6 màu đã chốt | 1 ngày | Hết vẽ tay; hình chuẩn khoa học; đẹp hơn ngay |
| 2 | **Lớp chiều sâu + đổ bóng** (đường B) | 1–2 ngày | Có cảm giác không gian, chưa đụng toạ độ |
| 3 | **Chuyển phép chiếu trục đo** (đường A) | 2–4 ngày | Đúng nghĩa "2,5D" mà học sinh nhìn ra |
| 4 | **Khung điều tra kiểu Crystal Island** cho bốn trạm sẵn có | 3–5 ngày | Có cốt truyện, và cốt truyện gánh việc dạy |
| 5 | *Chỉ khi 1–4 đã xong:* bản thử Three.js trực giao trên máy tính bảng thật | 3 ngày | Dữ liệu để quyết đường C, thay vì phỏng đoán |

Bốn việc đầu **không đổi một dòng hạ tầng nào**, không thêm thư viện nào ngoài bộ 52 KB đã chốt, và không đụng vào `SIM`.

---

## 6. Giới hạn của khảo sát này

- Chế độ **quick brief** — tra cứu diện rộng, không phải rà soát hệ thống theo PRISMA.
- Hiệu ứng của Barz và cộng sự (2024) lấy từ trang nhà xuất bản và phần tóm tắt, **chưa đọc toàn văn** (có tường phí). Con số g = .54 / .67 / .32 nên coi là đã dẫn đúng nguồn nhưng **chưa kiểm chứng độc lập từ bản gốc**.
- Tổng quan 130 nghiên cứu về game có cốt truyện: **mới đọc tóm tắt**, xếp Tier 2. Các con số 2,3% / 62,3% cần đọc toàn văn trước khi đưa vào tài liệu đối ngoại.
- Số liệu chất lượng công cụ AI sinh 3D lấy từ trang so sánh của **chính nhà cung cấp** (Meshy) — có xung đột lợi ích rõ ràng, đã ghi rõ trong bảng. Con số "63,8% người đánh giá chuyên môn" **không đáng tin ở mức dùng để ra quyết định**.
- **Không có án lệ Việt Nam** về Nghị định 134/2026 Điều 5a áp cho tài sản AI sinh. Phần diễn giải ở §3 là đọc điều luật theo nghĩa đen, không phải ý kiến pháp lý.
- Điều khoản giấy phép của từng mục BioArt / Sketchfab **thay đổi theo từng mục** — bảng ở §2 là quy tắc chung, vẫn phải kiểm từng file trước khi tải.

**Công bố sử dụng AI:** khảo sát này do công cụ nghiên cứu có hỗ trợ AI thực hiện. Mọi nguồn đều truy được về đường dẫn gốc; hai mục BioArt (trang chủ và BIOART-000352) đã mở trực tiếp để kiểm chứng.

---

## 7. Nguồn

**Tài sản**
- [NIH BioArt Source](https://bioart.niaid.nih.gov/) · [FAQ giấy phép](https://bioart.niaid.nih.gov/faqs) · [BIOART-000352 Mitochondria](https://bioart.niaid.nih.gov/bioart/352)
- [Thông báo NIAID về BioArt Source](https://www.niaid.nih.gov/news-events/nih-bioart-source-free-biomedical-art-resource-library)
- [Tổng hợp BioART 2D và NIH 3D — ĐH Wisconsin](https://bcrf.biochem.wisc.edu/2024/11/21/free-nih-bioart-2d-and-nih-3d/)
- [NIH 3D](https://3d.nih.gov/) · [NIH 3D Print Exchange — re3data](https://www.re3data.org/repository/r3d100013737)
- [Sketchfab — hướng dẫn ghi công khi tải model](https://support.fab.com/s/article/Crediting-users-for-3D-model-downloads) · [Thoả thuận giấy phép Sketchfab](https://sketchfab.com/licenses)
- [awesome-cc0 — danh mục tài sản CC0](https://github.com/madjin/awesome-cc0)

**AI sinh 3D**
- [So sánh công cụ sinh 3D bằng AI 2026 — RapidDirect](https://www.rapiddirect.com/blog/best-8-ai-3d-model-generators/)
- [TRELLIS vs Meshy vs Tripo vs Hitem3D](https://trellis2.app/blog/best-ai-3d-model-generator)
- [Best 3D Model Generation APIs 2026 — 3DAI Studio](https://www.3daistudio.com/blog/best-3d-model-generation-apis-2026)

**Cốt truyện và học tập**
- [Barz, Benick, Dörrenbächer-Ulrich & Perels (2024). *Review of Educational Research*](https://journals.sagepub.com/doi/10.3102/00346543231167795)
- [Crystal Island: A Narrative-Centered Learning Environment for Eighth Grade Microbiology](https://www.researchgate.net/publication/255576748_Crystal_Island_A_Narrative-Centered_Learning_Environment_for_Eighth_Grade_Microbiology)
- [Narrative-Centered Learning Environments — Springer](https://link.springer.com/chapter/10.1007/978-1-4614-4696-5_15)
- [A Critical Review of the Effectiveness of Narrative-Driven Digital Educational Games](https://www.researchgate.net/publication/327780219_A_Critical_Review_of_the_Effectiveness_of_Narrative-Driven_Digital_Educational_Games)
- [Game-based learning in early childhood education — Frontiers in Psychology (2024)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11018941/)

**Kỹ thuật 2,5D**
- [Isometric video game graphics — Wikipedia](https://en.wikipedia.org/wiki/Isometric_video_game_graphics) · [2.5D — Wikipedia](https://en.wikipedia.org/wiki/2.5D)
- [Isometric Game / Orthographic Camera — enable3d](https://enable3d.io/examples/isometric-game-orthographic-camera.html)
- [Dựng RPG trục đo chạy trình duyệt bằng Three.js](https://dev.to/mendolatech/how-i-built-a-browser-based-isometric-rpg-with-threejs-1j82)
