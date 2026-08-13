# Khảo sát công nghệ game — kết luận và khuyến nghị

**Ngày:** 13/08/2026
**Câu hỏi gốc:** *"Liệu có cách nào sưu tầm game rồi phát triển từ đó thay vì tự code như bây giờ không? Engine đồ hoạ đang khá xấu và không fun."*
**Phạm vi:** 7 mũi khảo sát độc lập, mọi số liệu tra cứu trực tiếp từ GitHub API, npm registry, và trang chính chủ.

---

## 1. Ba con số quyết định

| Đo cái gì | Kết quả |
|---|---|
| 3.187 game trong OSGameClones → lọc **web + giấy phép cho phép thương mại** | **111** (3,5%) |
| Trong 111 game đó, số còn đang phát triển | **3** (3%) — 58% đã dừng hẳn |
| 500 repo `topic:html5-game` trên GitHub → tỉ lệ **không có giấy phép nào** | **49,6%** |

Kho "3.000 game mã nguồn mở" thực chất còn khoảng **ba game sống** đủ điều kiện dùng thương mại. Câu "sưu tầm game rồi phát triển từ đó" nghe hợp lý, nhưng số liệu không ủng hộ.

---

## 2. Chẩn đoán: hai bệnh khác nhau, và cả hai đều không phải bệnh công nghệ

Đội mô tả game "xấu và không fun". Đó là **hai vấn đề riêng biệt**, thuốc khác nhau:

**Xấu** — không phải vì dùng SVG. SVG vẽ đẹp được. Xấu vì **thiếu chỉ đạo mỹ thuật**: mỗi hình một bảng màu, mỗi hình một độ dày nét, không có hệ thống. Đổi sang Phaser mà vẫn vẽ kiểu cũ thì vẫn xấu y hệt.

**Không fun** — không nằm ở đồ hoạ. Fun đến từ *game feel*: âm thanh phản hồi, nhún nảy, đóng băng khoảnh khắc quyết định, số nảy lên. Game xấu mà nhiều juice vẫn vui; game đẹp mà khô cứng vẫn chán.

**Ba mũi khảo sát độc lập cùng chỉ về một chỗ.** Mũi engine viết: *"engine không phải thứ quyết định game đẹp hay xấu — đội đang quy sai nguyên nhân."* Mũi mỹ thuật: *"không thiếu tài sản, thiếu chỉ đạo mỹ thuật."* Mũi game feel: fun đến từ juice.

---

## 3. Việc nên làm, theo thứ tự

### Tuần 1 — chữa đúng bệnh, chưa đụng công nghệ (≈2,5 ngày)

**a. Khoá chỉ đạo mỹ thuật (½ ngày, làm một lần cho cả dự án)**
- Chọn **6 màu**, ghi thành mã màu cố định. Một màu chủ đạo chiếm 40–60% diện tích.
- Chốt **ba con số**: độ dày nét, bán kính bo góc, lưới cơ sở (mọi khoảng cách là bội số của 8).
- Viết script ép toàn bộ hình về đúng 6 màu đó.
- Đổi viền đen thuần `#000` sang **màu tối cùng tông với vật thể**. Lá cây xanh thì viền xanh đậm. Nét đen thuần làm hình trông như clip art.
- Phủ **nhiễu hạt 6–10%** lên toàn cảnh bằng bộ lọc SVG `feTurbulence`. Hình phẳng 100% luôn trông rẻ tiền.

**b. Năm việc game feel tầng S (≈2 giờ)**
1. **Âm thanh cho mọi thao tác** — hiệu quả cao nhất tuyệt đối. Kèm biến tấu cao độ ±7% mỗi lần phát, nếu không nghe 20 lần là chán.
2. **Nhún nảy khi bấm/nhặt/đặt** — bẹt xuống 0.88 rồi bật lên 1.06. Chỉ CSS transform.
3. **Đóng băng 90 mili giây** ở khoảnh khắc quyết định. Rẻ nhất, ít người làm nhất.
4. **Rung màn có xoay.** Bắt buộc có thành phần xoay 0,5–1,2 độ — thiếu xoay thì não đọc ra "màn hình bị lag", có xoay thì đọc ra "bị đấm". Dùng mô hình trauma bình phương + nhiễu mượt, **không** dùng `Math.random()` thuần.
5. **Số nảy** tại đúng vị trí xảy ra sự kiện, kèm lệch ngang ngẫu nhiên.

**Ba cảnh báo riêng cho học liệu:**
- **Đừng rung màn khi trả lời sai.** Rung là trừng phạt. Sai nên lắc ngang nhẹ + tiếng trầm ngắn.
- **`prefers-reduced-motion` là bắt buộc** — rung màn gây chóng mặt buồn nôn cho một tỉ lệ học sinh không nhỏ.
- **Trình duyệt chặn âm thanh tới khi người dùng chạm lần đầu.** Quên xử lý là game im lặng hoàn toàn *không báo lỗi gì* — bug hay gặp nhất khi thêm âm thanh vào web.

**c. Bộ thư viện tối thiểu (~52 KB)**
| Thư viện | Kích thước | Giấy phép | Việc |
|---|---|---|---|
| Howler.js | 7,7 KB | MIT | Âm thanh: gộp sprite, mở khoá autoplay, phát chồng |
| anime.js v4 | 39 KB | MIT | Tween, easing, spring, stagger |
| canvas-confetti | 4,3 KB | ISC | Ăn mừng hoàn thành |
| `juice.js` tự viết | ~1 KB | của đội | Rung màn + đóng băng + số nảy — không thư viện nào đáng dùng |

**Không dùng GSAP.** Đúng là miễn phí từ 2025 (Webflow mua lại), nhưng **không phải mã nguồn mở theo chuẩn OSI** — nếu đội có quy trình duyệt thư viện chỉ chấp nhận MIT/Apache thì nó bị chặn. anime.js v4 làm được 95% việc, MIT thật.

**Âm thanh:** Kenney CC0 — 280 tiếng trong 3 gói (Interface Sounds 100, UI Audio 50, Impact Sounds 130), không phải ghi công. Đã xác minh qua 68 bộ.

### Tuần 2 — thử engine bằng một bản nhỏ (2–3 ngày)

**Chọn Phaser 4.** Không phải vì hiệu năng — game vài trăm sprite thì engine nào cũng thừa. Vì:
- **Template Next.js chính thức** (Phaser 4 + Next 15 + React 19, có cầu nối hai chiều). Không engine JS nào khác có.
- **13 bộ lọc dựng sẵn** — Bloom, Glow, Shadow, Vignette. Biến sprite phẳng thành thứ trông có đầu tư.
- MIT, 40.133 sao, cộng đồng lớn nhất.

**Cách làm đúng:** đừng port game 1.500 dòng ngay. Làm bản thử **một băng chuyền, một máy, một kiện hàng** trong 2–3 ngày, đem chạy trên **chiếc máy tính bảng rẻ nhất học sinh thật sự dùng**. Đạt thì làm tiếp, không đạt thì mất 3 ngày thay vì 4 tuần.

**Nếu port toàn bộ:** 16–25 ngày công. Tin tốt: **40–50% code sống sót** — lõi mô phỏng là hàm thuần, không dính đồ hoạ.

**Cảnh báo Phaser:** nó **không tree-shake**. Bundle tự build còn *to hơn* bản dựng sẵn. Coi 361 KB gzip là chi phí cố định, bắt buộc nạp động.

### Sau đó — fork ở đúng hai chỗ có hàng

| Thể loại | Fork được? | Ứng viên | Công |
|---|---|---|---|
| **Suy luận / bản đồ** | ✅ Có | `geoguess-lite` (MIT) | **2–4 tuần** |
| **Hợp tác nhiều người** | 🟡 Được, phải làm lại nhiều | `overcooked_ai` (MIT cả mã lẫn hình) | 2–3 tuần (giữ Python) / 4–6 tuần (chuyển Node) |
| **Dây chuyền / nhà máy** | ❌ Không có hàng | Tự viết | 4–8 tuần |

**`geoguess-lite`** — stack trùng khít với đội: Vue 3 + TypeScript + Tailwind 4 + reka-ui (chính là shadcn-vue). Đã tránh sẵn Google Street View. Nếu bỏ luôn phần ảnh đường phố, thay panel panorama bằng **panel manh mối**, thì hết mọi nghĩa vụ về ảnh — và đó chính là game Đoàn khảo sát đội đang có.

**`overcooked_ai`** — thứ duy nhất có MIT sạch cho *cả* mã lẫn hình. Màn chơi là 49 tệp text ASCII thuần, đổi màn chỉ là sửa vài dòng. Có sẵn màn `asymmetric_advantages`, đúng tinh thần "một người giữ cầu dao cho người kia thay đồ".

**Dây chuyền không có hàng.** `shapez.io` là GPL-3.0; giai đoạn trước 2020 cũng không phải MIT thuần mà là **MIT + Commons Clause cấm bán**. Dòng `"license": "MIT"` còn sót trong `package.json` là rác, không có giá trị pháp lý. Danh sách tổng hợp cả thể loại chỉ có hai game mã nguồn mở — Mindustry và shapez — **cả hai đều GPL**.

**Lối thoát hợp pháp:** *cơ chế chơi không được bảo hộ bản quyền, chỉ mã và hình mới được.* Đội hoàn toàn có quyền làm game băng chuyền giống hệt về lối chơi. Điều kiện kỷ luật: **tuyệt đối không mở mã nguồn của họ ra vừa xem vừa gõ** — làm vậy là tạo tác phẩm phái sinh, dính GPL ngay.

---

## 4. Bài toán thật: 360 game là bài toán kho nội dung, không phải bài toán engine

12 môn × 30 chủ đề = **360 game**. Không công cụ nào cứu được con số đó — kể cả AI sinh game, vì 360 game sinh bằng AI là **360 bộ mã phải bảo trì**.

Cách đúng là tách nội dung khỏi cơ chế chơi:

```
12–15 khuôn game   ← làm kỹ, làm đẹp một lần
       ↑ nạp nội dung qua API lúc chạy
   Kho nội dung     ← giáo viên tự nhập, không cần lập trình viên
       ↓
360 "bài học" = 15 khuôn × 24 bộ nội dung
```

Ba game hiện tại đã làm đúng một nửa — lõi mô phỏng của cả ba đều đọc dữ liệu chứ không viết cứng. Chỉ cần đẩy nốt phần nội dung ra ngoài là thành khuôn dùng lại được.

---

## 5. Cảnh báo pháp lý — phần quan trọng nhất

### 5.1 "Lỗ hổng ASP" KHÔNG bảo vệ game HTML5

Nhiều người tin rằng chạy trên web thì không phải công bố mã GPL. **Với server thì đúng. Với game HTML5 thì sai, và cái sai này chí mạng.**

GPL chỉ kích hoạt khi có hành vi *chuyển giao*. Chạy trên server của mình = không chuyển giao → không phải công bố. Nhưng **game HTML5 không chạy trên server** — nó chạy trong trình duyệt học sinh, và để chạy được thì server **phải gửi toàn bộ tệp JavaScript xuống máy người dùng**. Gửi JS xuống trình duyệt = phân phối = chuyển giao.

| Kiến trúc | GPL kích hoạt? |
|---|---|
| Backend dùng thư viện GPL, chỉ chạy trên server | ❌ Không — an toàn |
| **Game HTML5 gửi xuống trình duyệt** | ✅ **Có — phải công bố toàn bộ mã cho từng trường mua** |

Minify hay bundle **không cứu được**: GPL yêu cầu mã nguồn ưu tiên để chỉnh sửa, tức mã *trước khi* minify.

> **Với game web, GPL hành xử gần như AGPL.**

*Chưa có án lệ Việt Nam về điểm này. Nếu đội vẫn muốn dùng mã GPL, đây là chỗ bắt buộc phải có ý kiến luật sư.*

### 5.2 Không có giấy phép = không được dùng

Mặc định, tác phẩm sáng tạo **thuộc bản quyền độc quyền của tác giả**. GitHub ToS chỉ cho phép **xem và fork trong nội bộ GitHub** — không cho sửa, đóng gói, bán.

Mức độ phổ biến đã đo: **49,6%** repo `topic:html5-game` và **76,8%** repo js13kGames không có giấy phép dùng được. Game jam cho **mã nguồn**, không cho **quyền**.

### 5.3 Bẫy tệp giấy phép thứ hai

Ba trong bốn ứng viên đẹp nhất đều có tệp giấy phép riêng khoá phần hình ảnh — GitHub chỉ hiện **một** badge:

| Repo | Badge GitHub | Thực tế |
|---|---|---|
| `moorestech` | Apache-2.0 | `CONTENT_LICENSE.md` khoá toàn bộ hình, âm thanh, giao diện **và cả dữ liệu game** |
| `starship-olympics` | MIT | `LICENSE_assets.txt` = CC-BY-**NC**-SA |
| `fishfolk/jumpy` | MIT/Apache | Hình là **CC BY-NC** — cấm thương mại |
| `DrillDown` | Apache-2.0 | CREDITS ghi *"all rights reserved"*, hình là hàng đi mượn |

**Lệnh chạy ngay sau khi clone — 10 giây, cứu cả dự án:**
```bash
find . -iname "*LICEN[SC]E*" -o -iname "*COPYING*" -o -iname "*NOTICE*" \
       -o -iname "*CREDITS*" | grep -v node_modules
```
Ra nhiều hơn một tệp → giấy phép hỗn hợp → đọc từng cái.

### 5.4 Nhãn hiệu vẫn được bảo hộ dù mã mở

Giấy phép nguồn mở chỉ cấp quyền về **bản quyền**, không cấp quyền về **nhãn hiệu**. Apache-2.0 Điều 6 nói thẳng điều này.

Ví dụ sát sườn: trong 111 game permissive lọc ra có mục *"Javascript Tetris"* — mã MIT, fork thoải mái. Nhưng **"Tetris" là nhãn hiệu đã đăng ký**, và chủ sở hữu thực thi rất gắt: đã gỡ "Setris" và "Playtris" khỏi itch.io chỉ vì tên gần giống.

**Lấy được mã, không lấy được tên.** Fork gì cũng phải đổi tên hoàn toàn và thay sạch hình.

### 5.5 Rosebud AI — loại khỏi phương án sản xuất

Điều khoản dịch vụ mục 4(b), nguyên văn:

> *"Rosebud shall own and have all right and title to any data, content, code, artwork, or other materials created or generated as a result of any Prompt."*

Gói trả phí chỉ cấp *quyền thương mại hoá*, không chuyển quyền sở hữu. Bán cho trường mà hợp đồng có cam kết sở hữu trí tuệ thì **không cam kết được**. Thêm nữa: nội dung của đội bị dùng để huấn luyện mô hình của họ. Bản miễn phí **cấm cả dùng nội bộ doanh nghiệp**.

### 5.6 Hai văn bản Việt Nam vừa có hiệu lực

**Luật AI** — hiệu lực 1/3/2026. Giáo dục thuộc nhóm rủi ro cao. **Ranh giới quan trọng:** luật áp cho *hệ thống AI được triển khai* — game chạy AI lúc học sinh dùng. Game HTML tĩnh do AI viết nhưng lúc chạy không gọi mô hình nào thì nhiều khả năng **không** thuộc diện. Ngược lại, nếu làm gia sư AI hay chấm tự luận bằng AI thì thuộc diện và phải đăng ký. Giai đoạn chuyển tiếp cho giáo dục tới 1/9/2027.

**Nghị định 134/2026** — hiệu lực 9/4/2026, Điều 5a: quyền tác giả chỉ phát sinh khi con người đóng góp **"đáng kể và mang tính quyết định"**. Prompt chung chung rồi nhận kết quả thụ động **không đạt ngưỡng**. Nếu sinh hàng loạt game bằng AI mà không giữ hồ sơ chứng minh người đã thiết kế, chọn lọc, biên tập — thì **có thể không được bảo hộ quyền tác giả**, ai chép cũng không kiện được.

> **Việc cần làm ngay, gần như miễn phí:** lập quy trình lưu vết song song — tài liệu thiết kế, bản ghi rà soát, nhật ký ai sửa gì. Làm từ đầu thì không tốn gì; làm sau thì không dựng lại được.

### 5.7 Tin tốt: nguồn mở được ưu tiên khi bán cho trường

**Thông tư 20/2014/TT-BTTTT** quy định phần mềm nguồn mở **được ưu tiên mua sắm trong cơ quan nhà nước**. **Thông tư 08/2010/TT-BGDĐT** chủ trương dùng nguồn mở trong cơ sở giáo dục. Dùng nguồn mở là **điểm cộng** khi đấu thầu, không phải điểm trừ.

Nhưng **Luật SHTT Điều 50**: đăng ký quyền tác giả cho tác phẩm phái sinh **bắt buộc khai báo tác phẩm gốc**. Trong hồ sơ thầu, cách làm chuẩn là khai báo trung thực: *"phần mềm do chúng tôi phát triển, có sử dụng các thành phần nguồn mở theo giấy phép MIT/Apache-2.0, danh mục kèm phụ lục"* — hoàn toàn được chấp nhận. Cam kết "sở hữu toàn bộ" trong khi thực chất là fork thì **sai sự thật**.

---

## 6. Công cụ tra cứu — cú pháp đã kiểm chứng

**Hai luật GitHub, khác trực giác:**
- Từ khoá `OR` → **lỗi HTTP 422**. Không dùng được.
- Lặp `license:` = **HOẶC**. Đã kiểm chứng bằng số học: `topic:educational-game license:mit` (286) + `license:apache-2.0` (29) = gộp lại đúng **315**.
- Lặp `topic:` = **VÀ**. `topic:phaser3` (1.447) + `topic:pixijs` (1.414) → gộp còn **6**.

**Truy vấn dùng ngay:**
```
topic:html5-game license:mit license:apache-2.0 license:bsd-3-clause license:unlicense license:zlib archived:false
topic:phaser license:mit stars:>50 pushed:>2025-01-01
topic:educational-game license:mit license:apache-2.0 archived:false
```

**Truy vấn phòng thủ — chạy để loại trừ:**
```
topic:html5-game license:agpl-3.0        → danh sách đen, tuyệt đối không đụng
```

**Giới hạn cần biết:** GitHub phát hiện giấy phép bằng cách quét tệp `LICENSE` ở gốc. Nó **không thấy** giấy phép hỗn hợp bên trong. Kết quả `license:mit` là **tín hiệu tốt để xem tiếp**, không phải kết luận.

**Rào chắn tự động — cắm vào CI:**
```bash
npx license-checker --production --failOn "GPL-3.0;GPL-2.0;AGPL-3.0;LGPL-3.0;LGPL-2.1;CC-BY-NC-4.0;CC-BY-NC-SA-4.0"
```

**Lưu bằng chứng khi fork** (giấy phép có thể đổi, repo có thể bị xoá):
- Ghim commit hash, sao lưu tệp LICENSE tại thời điểm fork, lưu metadata GitHub, chụp màn hình trang repo.
- Lưu vĩnh viễn qua **Software Heritage** — mã định danh SWHID đã là **tiêu chuẩn ISO/IEC 18670 từ 23/04/2025**, vẫn hợp lệ kể cả khi repo gốc bị xoá.

---

## 7. Tổng kết một dòng

**Vấn đề không nằm ở công nghệ.** Fork không cứu được (chỉ 3 game sống đủ điều kiện trong toàn bộ kho). Đổi engine không tự làm game vui hơn. Thứ đang thiếu là **bảng màu thống nhất** (nửa ngày) và **game feel** (hai giờ) — và cả hai đều làm được ngay tuần này, trên chính bản đang có, không đổi một dòng hạ tầng nào.

Sau đó mới tính chuyện engine, và chỉ nên tính bằng một bản thử ba ngày trên máy tính bảng thật.
