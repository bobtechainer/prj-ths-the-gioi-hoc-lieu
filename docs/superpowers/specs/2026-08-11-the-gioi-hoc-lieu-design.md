# Thế Giới Học Liệu — Thiết kế view người dùng cuối (v1)

**Ngày:** 11/08/2026
**Phạm vi tài liệu:** view người dùng cuối. Studio (công cụ cho người tạo) là spec riêng, làm sau.
**Trạng thái:** đã chốt qua brainstorm, chờ chuyển sang kế hoạch triển khai.

---

## 1. Vấn đề

Kho học liệu hiện tại ([prj-gkebook-shadcn-frontend](../../../../prj-gkebook-shadcn-frontend/)) chứa 11 định dạng học liệu — bài giảng PPTX, tài liệu PDF/DOC, video, âm thanh, hình ảnh, mô hình 3D/VR, SCORM/xAPI, học liệu tương tác, sách điện tử có chèn học liệu vào từng trang, bộ đề với 15 dạng câu hỏi, và ngân hàng câu hỏi.

Toàn bộ số đó hiện chỉ được **xem**. Người học mở ra, đọc hoặc nghe, rồi đóng lại. Giá trị của kho nằm ở chỗ nó có bao nhiêu tệp, chứ không nằm ở chỗ người ta làm được gì với chúng.

Sản phẩm này giải quyết đúng một điều: **biến học liệu tĩnh thành thứ chơi được, theo hướng hiểu và tương tác chứ không phải hỏi–đáp.**

## 2. Mục tiêu

1. Người học mở một học liệu bất kỳ trong kho và **chơi được ngay**, không cần ai chuẩn bị trước.
2. Ba thế giới demo chứng minh ba kiểu tương tác hoàn toàn khác nhau trên cùng một hạ tầng.
3. Xây được **tầng nguyên liệu** dùng lại được cho mọi thứ về sau, không chỉ cho ba game này.
4. Không có câu hỏi trắc nghiệm nào trong toàn bộ ba demo.

### Không phải mục tiêu ở v1

Studio · nhóm nguyên liệu thời gian và định lượng (video, âm thanh, số liệu) · màn hình giáo viên · nhân vật đi lại trong thế giới · tiền tệ và chợ · người dùng tự đăng trải nghiệm lên hub · xuất báo cáo điểm số.

## 2b. Bản dựng thử (đã làm) — phạm vi hẹp hơn hẳn

Trước khi làm v1 như mô tả trong tài liệu này, đã dựng một **bản thử để trình chiếu**, không phải để người dùng thật chơi. Tệp: [`prototype/xuong-lap-te-bao.html`](../../../prototype/xuong-lap-te-bao.html) — mở bằng trình duyệt là chạy, không cần cài đặt, không có máy chủ.

| | Bản v1 trong tài liệu này | Bản dựng thử |
|---|---|---|
| Game | 3 | 1 — Xưởng lắp tế bào |
| Màn hình | 7 | 3 — bản đồ → chơi → chốt |
| Thế giới | Thị trấn 2.5D từ ~1.060 mô hình | Một hình minh hoạ SVG tĩnh, 3 công trình |
| Kỹ thuật | Next.js + three.js + R3F | Một tệp HTML, SVG 2D, không phụ thuộc gì |
| Realtime | Colyseus | Không có |
| Dữ liệu | Bóc từ kho học liệu | Viết cứng — 8 bào quan |
| AI | Mô hình thật | Thoại viết sẵn |
| Tài khoản, lưu tiến độ, thị trấn của lớp | Có | Bỏ |
| Kiểm thử | 5 tầng | Bỏ |

Bản dựng thử là **đồ bỏ đi sau khi demo xong**. Nhưng nó vẫn giữ đúng hai thứ quan trọng nhất của thiết kế, nên nó chứng minh được luận điểm: **động cơ lan truyền trạng thái** (đúng thuật toán ở mục 6, kể cả ngưỡng vòng lặp tỉ lệ số đỉnh) và **nguyên tắc thấy hậu quả chứ không thấy chữ "sai"**.

Chọn Xưởng lắp tế bào vì nó là game duy nhất trong ba cái vừa chơi được một mình, vừa cho thấy hậu quả bằng hình ảnh trong vài giây. *Truy tìm sự cố* cần hai người và một máy chủ. *Đoàn khảo sát* tốn ngày chuẩn bị dữ liệu bản đồ hơn là làm game.

### Câu đố trong bản dựng thử

Sáu ô trong tế bào, tám bào quan trong khay. Phải chọn đúng sáu.

```
Nhân ──mARN──▶ Ribosome ──chuỗi thô──▶ Lưới nội chất hạt ──đã gấp──▶ Golgi ──đã gói──▶ Túi tiết ──▶ ra ngoài
                    ▲                                                    ▲
                    └──────────────── ATP ───────────────────────────────┘
                                       │
                                    Ti thể
```

Chỗ khó nằm ở **Ti thể** — nó không nằm trên dòng chảy nên rất dễ bỏ quên, nhưng thiếu nó thì Ribosome và Golgi đứng im. Người chơi nhìn thấy dòng chảy tắt đúng tại Ribosome và tự suy ra.

Hai bào quan còn lại là bẫy: **Lysosome** đặt vào ô sát nhân thì enzyme tiêu mất nhân, cả dây chuyền chết từ gốc. **Lục lạp** vô hại nhưng chiếm chỗ — tế bào động vật không có nó.

## 2c. Mầm — linh vật đi cùng người chơi

Dùng lại đúng linh vật đang làm gương mặt chatbot trong hệ THS
([prj-gkebook-shadcn-frontend/public/chatbot-mascot.svg](../../../../prj-gkebook-shadcn-frontend/public/chatbot-mascot.svg)),
đặt tên là **Mầm**. Cái khăn quàng đỏ trong thiết kế gốc quyết định luôn vai của nó:
**đội viên cùng lứa với người chơi, không phải người dạy.**

### Ba luật cứng
1. **Mầm chỉ được hỏi, không được khẳng định.** Mọi phán đoán về kiến thức phải kết thúc
   bằng dấu hỏi. Được nói *"hay là thiếu cái gì ở giữa nhỉ?"*, không được nói *"tại thiếu Golgi"*.
2. **Mầm không bao giờ phán xử.** Mô phỏng phán xử. Mầm chỉ phản ứng như người bạn đứng cạnh cùng nhìn.
3. **Mầm không được biết trước thứ người chơi chưa thấy**, kể cả khi hệ thống đã biết.

Giọng kế thừa nguyên từ bộ câu chào có sẵn trong kho (`GREDDING_CHATBOT_MESSAGES`):
tự gọi **"mình"**, gọi người chơi là **"bạn"**, câu ngắn, không lên gân.

### Tam giác ba vai trong một chặng

| Vai | Biết gì | Nói kiểu gì | Ví dụ |
|---|---|---|---|
| **Bác trưởng xưởng** | Biết nghề, biết đáp án nhưng không nói | Giao việc, gỡ bí khi tắc lâu, tổng kết | *"Hôm nay xưởng phải giao 8 kiện mà máy móc chưa đặt gì cả."* |
| **Mầm** | Không biết gì hơn bạn | Thắc mắc, đoán bằng câu hỏi, reo/xịu | *"Ơ, hàng dồn cục trước trạm 1 kìa. Chỗ đó thiếu máy gì nhỉ?"* |
| **Mô phỏng** | Là sự thật | Không nói câu nào, chỉ diễn ra | Hàng ứ, đèn đỏ, nhân xám dần |

**Thứ tự lời trong một chặng:** bác mở màn → trong lúc chơi **chỉ Mầm nói** → tắc quá 40 giây
không thao tác thì bác mới gỡ bí một câu → xong chặng bác chốt, Mầm nói câu học sinh.
Nếu cả hai cùng nói lúc chơi thì thành ồn và người chơi không biết tin ai.

### Mầm ở đâu

| Màn hình | Mầm ở đâu | Làm gì |
|---|---|---|
| Cổng thế giới | Đứng cạnh bạn | Chào, nhắc chuyện lần trước |
| Bản đồ thế giới | Đứng dưới gốc cây của chính nó, giữa thị trấn | Cây lớn theo tiến bộ |
| Trong chặng | Góc phải dưới, **nhỏ hơn bác trưởng xưởng** | Thắc mắc, đoán bằng câu hỏi |
| Bảng lý thuyết cuối chặng | Một dòng *"à, hoá ra…"* | Ghi lại điều học được bằng giọng học sinh |
| Chơi nhanh từ kho cũ | Vẫn là bong bóng chatbot như hiện tại | Thêm câu mời chơi — cầu nối kho → game |

### Cây của Mầm — năm giai đoạn

| Giai đoạn | Mở khi | Trên đầu Mầm | Cây giữa thị trấn |
|---|---|---|---|
| 1. Hai lá | ngay từ đầu | mầm hai lá | chồi trong chậu |
| 2. Ba lá | qua 1 chặng | thêm một lá | cây con có gốc |
| 3. Ra cành | qua 3 chặng | có cành | cây cao, tán ba chùm |
| 4. Ra hoa | qua 8 chặng | có hoa | cây có hoa |
| 5. Có quả | qua 15 chặng | có quả | cây cổ thụ có quả |

Cây **cùng một giai đoạn ở mọi thế giới** — đây là thứ duy nhất trong thị trấn thuộc riêng
người chơi chứ không thuộc lớp. Và vì cây đứng *trong* thị trấn nên nó không thành thanh
tiến độ thứ hai: nó là một phần của cái bản đồ vốn đã là thanh tiến độ.

## 2d. Cách trình bày lý thuyết — không dùng popup

Khi đủ đơn hàng, **không bật hộp thoại che màn**. Bảng lý thuyết mở ra ngay cạnh dây chuyền,
và **dây chuyền vẫn chạy** để người học vừa đọc vừa nhìn hệ thống làm việc.

Cụ thể: khay máy ở dưới ẩn đi, một cột lý thuyết hiện bên phải (màn hẹp thì xuống dưới),
gồm: lời chốt của bác trưởng xưởng · đường đi của một kiện hàng đánh số 1–6 với hai lớp tên ·
giải thích riêng vì sao máy phát điện không đứng trên băng chuyền mà thiếu nó thì hai máy
kia đứng im · trích đoạn sách có ghi số trang · một dòng của Mầm · thông báo mầm ra thêm lá.

Hệ quả trong lõi mô phỏng: đủ đơn thì **không dừng băng chuyền**, chỉ ngừng đếm đơn
(để không hiện "13/8") và đóng băng đồng hồ ca làm.

## 2e. Cách viết chữ trong trang — hai lớp tên

Mọi máy móc và mọi loại hàng đều có **tên nghề** (chữ to, hiểu ngay phải làm gì) và
**tên trong sách** (chữ nhỏ in nghiêng ngay dưới). Học sinh hiểu việc trước, nhớ từ đúng sau.

| Tên nghề | Tên trong sách |
|---|---|
| Phòng bản thiết kế | nhân tế bào |
| Máy đọc bản thiết kế | ribosome |
| Xưởng gấp hàng | lưới nội chất hạt |
| Xưởng đóng gói | bộ máy Golgi |
| Xe chở hàng | túi tiết |
| Máy phát điện | ti thể |
| Thùng enzyme | lysosome |
| Máy hứng nắng | lục lạp |
| bản thiết kế → hàng thô → hàng đã gấp → kiện đã đóng | mARN → chuỗi protein thô → protein đã gấp → protein đã đóng gói |

Nhãn các ô cũng viết theo việc phải làm: *"đặt máy vào đây"*, *"cắm máy phát điện"*,
*"sát vách nhân"* — thay vì thuật ngữ.

## 3. Các quyết định đã chốt

| # | Quyết định | Chốt |
|---|---|---|
| 1 | Bối cảnh | Hub mở kiểu Roblox |
| 2 | Điều hướng | Sảnh chọn thế giới → mỗi thế giới là bản đồ 2.5D có chặng |
| 3 | Triết lý | Có tầng trung gian giữa học liệu và game |
| 4 | Nguyên liệu v1 | Không gian (điểm nóng, bản đồ, hình học 3D) + Cấu trúc (bộ phận–chức năng, nhân–quả, phân loại, thuật ngữ) |
| 5 | Nguồn nội dung | Hai tốc độ: "Chơi nhanh" trên mọi học liệu + hàng tuyển lên bản đồ |
| 6 | Thiết bị | Máy tính bảng, điện thoại, desktop đời mới |
| 7 | Hình ảnh | Thế giới 2.5D nhìn chéo; học liệu chiếm màn khi vào chặng |
| 8 | Đối tượng | Trung tính, dùng được cả ba cấp |
| 9 | Động lực | Sưu tầm vật liệu → xây thị trấn; bản đồ chính là thanh tiến độ |
| 10 | Xã hội | Thị trấn chung của lớp + dấu vết async + đúng một game realtime |
| 11 | Khi sai | Thấy hậu quả mô phỏng, không thấy chữ "sai" |
| 12 | Demo | Xưởng lắp tế bào · Truy tìm sự cố · Đoàn khảo sát |
| 13 | AI | Nhân vật trong thế giới, không phải trợ lý |
| 14 | Giáo viên | Không có mặt ở v1 |
| 15 | Cách dựng | Một khung chơi chung + ba khuôn game cắm vào |
| 16 | Vị trí mô phỏng | Lai: solo chạy trong máy, realtime chạy trên máy chủ |

## 4. Kiến trúc ba lớp

```
┌─────────────────────────────────────────────────────────┐
│ LỚP 1 — KHO HỌC LIỆU            (đã có, không sửa)      │
│ 11 định dạng · metadata · file · từ khoá AI             │
└───────────────────────┬─────────────────────────────────┘
                        │ đọc
┌───────────────────────▼─────────────────────────────────┐
│ LỚP 2 — TẦNG NGUYÊN LIỆU              (mới, lõi)        │
│ Mỗi học liệu → 0..n "bản trích"                          │
│ 7 loại nguyên liệu · có nguồn gốc · có độ tin cậy        │
└───────────────────────┬─────────────────────────────────┘
                        │ nạp
┌───────────────────────▼─────────────────────────────────┐
│ LỚP 3 — KHUNG CHƠI                    (mới)             │
│ Khung chung + động cơ mô phỏng + 3 khuôn game            │
│ + Thế giới 2.5D + Thị trấn + Nhân vật AI                 │
└─────────────────────────────────────────────────────────┘
```

**Lớp 2 là tài sản thật của dự án.** Game có thể bỏ đi làm lại; một khi kho học liệu đã được bóc thành nguyên liệu có cấu trúc thì nó dùng được cho mọi thứ về sau — game mới, đề thi, ôn tập, tra cứu, trợ giảng AI.

## 5. Tầng nguyên liệu

Mỗi **bản trích** là một mẩu dữ liệu nhỏ, **luôn trỏ ngược về chỗ nó được lấy ra** (học liệu nào, trang mấy, toạ độ nào). Không có nguồn gốc thì giáo viên không tin, và người chơi không quay lại học liệu gốc được.

Bảy loại của v1:

| Loại | Nội dung một bản trích | Ví dụ |
|---|---|---|
| **Điểm nóng** | mặt phẳng · hình dạng vùng · tên · vai trò | Vùng "tâm thất trái" trên ảnh giải phẫu, toạ độ đa giác |
| **Bản đồ** | lớp bản đồ · vùng · toạ độ · thuộc tính | Vùng trũng phía nam thị xã, cao độ dưới 5m |
| **Hình học 3D** | bộ phận trong mô hình · trục xoay · mặt cắt · góc nhìn chuẩn | Lát cắt dọc quả tim theo mặt phẳng đứng |
| **Bộ phận – chức năng** | tên · chức năng · **cần gì để chạy** · **tạo ra gì** | Ribosome: cần mARN, tạo ra chuỗi protein |
| **Nhân – quả** | từ đâu · tới đâu · thuận/nghịch · mạnh yếu · điều kiện | Đứt cầu chì → mất điện toàn nhánh |
| **Phân loại** | thực thể · thuộc tính quan sát được · thuộc nhóm nào | Lá kim, hạt trần → ngành Thông |
| **Thuật ngữ** | từ · định nghĩa · tên gọi khác | Ribosome = ribôxôm = hạt ribonucleoprotein |

Hai cột **cần gì** / **tạo ra gì** ở hàng *Bộ phận – chức năng* là chỗ quan trọng nhất trong toàn bộ thiết kế. Chỉ cần biết mỗi bộ phận cần gì và tạo ra gì, ta đã có sẵn một đồ thị chạy được — không cần khai báo thêm luật nào.

**Ở v1, bản trích cho ba thế giới demo được làm sẵn một lần** bằng script (AI bóc rồi người rà tay 100%), không có giao diện. Studio chỉ là cái áo mặc lên việc đó về sau.

**Năm nhóm nguyên liệu còn lại** (mốc thời gian, chuỗi quy trình, dấu hiệu âm thanh, số liệu đo được, bằng chứng văn bản) đã được xác định trong brainstorm và để dành cho v2.

## 6. Động cơ mô phỏng

Nhỏ, dùng chung cho cả ba game, và là thứ thay thế hoàn toàn cho việc chấm đúng/sai.

```
Đồ thị trạng thái
  Đỉnh = thực thể      (bộ phận · vùng đất · nhánh mạch)
  Cạnh = quan hệ       (cần–tạo ra, nhân–quả, kề nhau)

Người chơi làm một hành động
        ↓
  đổi trạng thái một đỉnh
        ↓
  lan truyền theo cạnh   ← toàn bộ "hậu quả" nằm ở đây
        ↓
  giao diện diễn tả bằng hình ảnh, không bằng chữ
```

### Kiểu dữ liệu

```ts
type NodeId = string
type Fact = string          // 'power' | 'mrna' | 'ribosome' | 'water'… do màn chơi định nghĩa

type NodeDef = {
  id: NodeId
  kind: string              // 'switch' | 'organelle' | 'lamp'… → chọn hình ảnh, hiệu ứng
  sources?: Fact[]          // fact node tự sinh ra (nguồn điện, gene…)
  rule?: Rule               // ghi đè luật mặc định cho node đặc biệt
}

type EdgeDef = {
  from: NodeId
  to: NodeId
  carries: Fact             // cạnh này truyền cái gì
  mode?: 'all' | 'any'      // 'all' = cần TẤT CẢ nguồn · 'any' = chỉ cần MỘT (có dự phòng)
}

type WorldState = Map<NodeId, Set<Fact>>
type Rule = (node: NodeDef, incoming: EdgeDef[], state: WorldState) => Set<Fact>
```

`mode: 'all' | 'any'` chính là toàn bộ ngữ nghĩa trò chơi. `all` = "cần đầu vào từ" (thiếu ribosome thì dây chuyền đứng). `any` = "cấp điện cho, có nguồn dự phòng". Hai chữ này phủ hết cả ba game demo.

### Thuật toán lan truyền

Worklist + điểm bất động có chặn, phủ được cả đồ thị có chu trình lẫn không có:

```
hàng_đợi ← tất cả các đỉnh
lặp:
  với mỗi đỉnh trong hàng đợi: tính lại tập fact
  nếu KHÔNG đỉnh nào đổi → hội tụ, dừng          ← điều kiện dừng thật
  ngược lại: ghi trạng thái mới, đẩy các đỉnh kế tiếp vào vòng sau
  nếu số vòng > ngưỡng → dừng, trả converged = false ← van an toàn
```

**Ngưỡng chống lặp bắt buộc phải tỉ lệ với kích thước đồ thị**, không được là hằng số:

```ts
const maxRounds = (g: Graph) => g.nodes.length * 2 + 16
```

Lý do: một chuỗi N đỉnh cần đúng N vòng để đẩy thay đổi từ đầu đến cuối. Ngưỡng cố định sẽ **âm thầm cắt cụt** quá trình lan truyền — trạng thái trả về sai mà không ném lỗi. Lỗi này đã xảy ra thật trong bản dựng thử: đỉnh thứ 99 vẫn sáng đèn trong khi cầu dao đã ngắt. Ở chế độ phát triển, `converged === false` phải **ném lỗi**, không được nuốt im lặng.

Ngoài ra, kiểm tra chu trình ngay lúc build màn chơi để cảnh báo người thiết kế trước khi vào game.

### Ràng buộc kiến trúc

- Động cơ là **hàm thuần**: `runScript(graph, actions) → WorldState`. Không DOM, không React, không async, không timer.
- **Không được import React.** Nhận JSON, trả JSON. Nhờ vậy nó chạy được cả trong trình duyệt lẫn trên máy chủ mà không phải viết hai lần.
- Đặt tại `lib/simulation/` — `graph.ts`, `propagate.ts`, `rules.ts`, `types.ts`.

### Hiệu năng đã đo

Đồ thị 100 đỉnh nối chuỗi (trường hợp xấu nhất về độ sâu), lan truyền lại toàn bộ: **2,12 ms**. Có thể chạy lại cả thế giới sau mỗi thao tác mà vẫn dư sức giữ 60 khung hình/giây. Không cần tối ưu tăng dần.

## 7. Khung chơi chung

Mọi chặng đều đi qua đúng luồng này, bất kể game nào:

```
vào chặng
   ↓
① MỞ MÀN      nhân vật AI nói 1–2 câu, đặt tình huống
   ↓
② SÂN KHẤU    nạp học liệu + bản trích, dựng đồ thị mô phỏng
   ↓
③ CHƠI        thao tác → đồ thị lan truyền → hình ảnh đổi
   ↓           (vòng lặp này là toàn bộ trò chơi)
④ CHỐT        đạt điều kiện, hoặc hết tài nguyên
   ↓
⑤ CHIẾN LỢI PHẨM   vật liệu rơi ra, kéo về thị trấn
   ↓
⑥ MỔ XẺ       nhân vật AI phân tích lại điều vừa xảy ra,
   ↓           kèm nút mở học liệu gốc đúng chỗ vừa nhắc
về bản đồ
```

### Hợp đồng khuôn game

Mỗi khuôn khi cắm vào khung phải khai báo đủ bảy thứ, thiếu một là không cắm được:

1. Ăn nguyên liệu nào
2. Cần định dạng học liệu nào
3. Sân khấu dựng ra sao
4. Cho phép thao tác gì
5. Dựng đồ thị mô phỏng từ bản trích thế nào
6. Điều kiện chốt
7. Bảng vật liệu rơi

Đây là thứ khiến game thứ tư chỉ tốn một phần nhỏ công sức so với game đầu.

### Bố cục màn chặng

Một bố cục cho cả ba game, ba loại thiết bị:

```
MÁY TÍNH BẢNG / DESKTOP           ĐIỆN THOẠI DỌC
┌──────┬──────────────────┬────┐  ┌──────────────────┐
│ khay │                  │nhật│  │                  │
│ công │   SÂN KHẤU       │ ký │  │   SÂN KHẤU       │
│ cụ   │   (học liệu)     │    │  │   (học liệu)     │
│      │                  │    │  ├──────────────────┤
└──────┴──────────────────┴────┘  │ khay trượt lên ▲ │
   ~15%       ~65%          ~20%  └──────────────────┘
```

Học liệu luôn là thứ to nhất trên màn hình. Không có ngoại lệ.

### Nhịp

Mỗi chặng 3–6 phút. Đủ ngắn để chơi lúc chờ, đủ dài để thấy hậu quả lan ra.

## 8. Ba khuôn game

### 🧬 Xưởng lắp tế bào — async, solo

| | |
|---|---|
| Ăn nguyên liệu | Bộ phận–chức năng · Thuật ngữ · Điểm nóng |
| Học liệu vào | Sơ đồ/ảnh tế bào + tài liệu mô tả bào quan |
| Sân khấu | Mặt cắt tế bào còn trống, các bào quan nằm rời trong khay |
| Thao tác | Kéo bào quan vào chỗ · nối luồng vật chất · bật dây chuyền |
| Mô phỏng | Mỗi bào quan *cần* đầu vào và *tạo ra* đầu ra — ghép xong là có dây chuyền chạy được hoặc không |
| Hậu quả | Thiếu ribosome → dòng protein tắt, tế bào nhạt màu dần, đồng hồ sản lượng đứng im. Đặt lysosome cạnh nhân → nhân bị tiêu, tế bào chết |
| Chốt | Dây chuyền chạy đủ một chu kỳ |
| Rơi ra | Mẫu vật → dựng **Viện Sinh học** trên bản đồ |
| Mô phỏng chạy ở | Trình duyệt |

### ⚡ Truy tìm sự cố — realtime, hai người

| | |
|---|---|
| Ăn nguyên liệu | Điểm nóng trên sơ đồ · Nhân–quả · Thuật ngữ |
| Học liệu vào | Sơ đồ mạch điện / sơ đồ hệ thống (ảnh hoặc trang PDF) |
| Sân khấu | Chính sơ đồ đó. **Mỗi người chỉ thấy một nửa** |
| Thao tác | Dò bằng đồng hồ đo · đóng/ngắt cầu dao · thay linh kiện · nói với nhau |
| Mô phỏng | Mất điện lan theo cạnh nhân–quả. Ngắt nhầm nhánh → thêm khu mất điện |
| Hậu quả | Đèn cả tầng tắt, số hộ mất điện tăng. Không ai nói bạn sai |
| Chốt | Khôi phục toàn nhà trong giới hạn số lần ngắt |
| Rơi ra | Linh kiện → dựng **Nhà máy điện** của thị trấn |
| Chơi một mình | Nửa còn lại do **bác thợ cả (AI)** cầm — phải hỏi bác mới biết, bác không tự khai |
| Mô phỏng chạy ở | **Máy chủ** (bắt buộc — xem mục 11) |

Vì mỗi người chỉ thấy một nửa, họ buộc phải **gọi tên đúng thứ mình thấy** mới mô tả được cho người kia. Học thuật ngữ xảy ra trong lúc chơi, không phải trong lúc kiểm tra.

### 🗺 Đoàn khảo sát — async, solo

| | |
|---|---|
| Ăn nguyên liệu | Bản đồ · Điểm nóng · Phân loại |
| Học liệu vào | Ảnh thực địa + bản đồ nhiều lớp (địa hình, sông, dân cư) |
| Sân khấu | Ảnh thực địa một bên, bản đồ vùng một bên |
| Thao tác | Mở manh mối *(tốn ngày công)* · bật/tắt lớp bản đồ · cắm cờ · ghi lý do chọn |
| Mô phỏng | Đoàn khảo sát **di chuyển thật** trên bản đồ, ăn ngày công theo quãng đường và địa hình |
| Hậu quả | Cắm sai → đoàn lặn lội tới nơi, không thấy gì, mất mấy ngày công, phải vòng lại. Ngày công cạn thì mùa khảo sát kết thúc |
| Chốt | Xác định đúng vùng khi ngày công còn |
| Rơi ra | Vùng đất mở khoá → **mở rộng ranh giới thị trấn** |
| Mô phỏng chạy ở | Trình duyệt |

Ngân sách ngày công là thứ biến trò đoán mò thành trò suy luận: đoán bừa vẫn được phép, nhưng đắt.

## 9. Thế giới, thị trấn và người khác

**Bản đồ là thanh tiến độ.** Không có thanh tiến độ nào khác trong sản phẩm.

| Trạng thái chặng | Trên bản đồ |
|---|---|
| Chưa mở | Nền móng mờ, cỏ mọc |
| Đang mở | Biển công trường, có ánh sáng |
| Đã qua | Công trình dựng xong, gắn tên người dựng |
| Có người đang kẹt | Ngọn đèn nhấp nháy — ghé vào giúp được |

### Cấu trúc sở hữu

Một lớp = một thị trấn chung cho mỗi thế giới. Trong thị trấn đó **mỗi người có một khu đất riêng** để dựng thứ mình kiếm được. Nhưng những công trình lớn — Viện Sinh học, Nhà máy điện, Ranh giới thị trấn — là **công trình chung, cần vật liệu của nhiều người mới dựng xong**.

Nếu tất cả đều chung thì người chăm chỉ thấy công sức tan vào đám đông; nếu tất cả đều riêng thì mất hẳn lý do chọn hub. Chia đôi giữ được cả hai, và tạo ra một câu nói rất tự nhiên trong lớp: *"còn thiếu ba linh kiện nữa là xong nhà máy, ai đánh nốt chặng 5 đi."*

### Ghép đôi cho Truy tìm sự cố

Mời một bạn cùng lớp → hoặc ghép ngẫu nhiên trong lớp → hoặc chơi với bác thợ cả. Ba đường, luôn có đường đi, không bao giờ đứng chờ.

## 10. Bảy màn hình của v1

| # | Màn hình | Vai trò |
|---|---|---|
| 1 | **Cổng thế giới** | Chọn một trong ba thế giới; thấy thế giới nào đang có bạn bè chơi |
| 2 | **Bản đồ thế giới** | Thị trấn 2.5D; chặng là công trình |
| 3 | **Màn chặng** | Khung chơi; học liệu chiếm gần hết màn hình |
| 4 | **Màn chốt chặng** | Chiến lợi phẩm + nhân vật AI mổ xẻ lại |
| 5 | **Chơi nhanh** | Vào thẳng từ trang một học liệu bất kỳ trong kho |
| 6 | **Thị trấn của lớp** | Xem công trình ai dựng, ghé thăm thị trấn bạn bè |
| 7 | **Hồ sơ người chơi** | Rất nhẹ: bộ sưu tập vật liệu, chặng đã qua, kỷ lục |

**Chơi nhanh** dùng cùng ba khuôn nhưng bỏ mở màn, bỏ vật liệu, bỏ thị trấn — vào thẳng sân khấu, chơi xong hiện đúng một câu mổ xẻ và nút "đưa vào thế giới". Đây là cửa ngõ kéo người từ kho học liệu cũ sang sản phẩm mới.

## 11. Ngăn xếp công nghệ

Khảo sát ngày 11/08/2026. Mọi phiên bản và giấy phép đều đã tra cứu trực tiếp từ npm registry, GitHub API và trang chính chủ.

| Lớp | Chọn | Phiên bản | Giấy phép |
|---|---|---|---|
| Bản đồ 2.5D **và** trình xem 3D | three.js + @react-three/fiber + drei | r185 / 9.7.0 / 10.7.8 | MIT |
| Mô phỏng | Tự viết (~90 dòng) | — | của dự án |
| Realtime | Colyseus, tự host | 0.17 | MIT |
| Mỹ thuật | Kenney 3D Kits + Quaternius + Low Poly Construction | — | CC0 |

### Vì sao một engine 3D cho cả bản đồ lẫn mô hình

Phương án thay thế là PixiJS cho bản đồ 2D + three.js cho mô hình 3D. Bị loại vì ba lý do:

1. **Trạng thái "đang xây" chỉ tồn tại ở 3D.** Quét toàn bộ 66 gói Kenney và 83 gói Quaternius: giàn giáo, cần cẩu, móng nhà, công trường không có bản 2D isometric miễn phí nào. Ở 2D phải vẽ tay từng giai đoạn xây × từng công trình.
2. **Ghép công trình mới rẻ ở 3D, đắt ở 2D.** Không kho CC0 nào có "viện nghiên cứu" — buộc phải ghép. Ở 3D ghép một lần, nhìn mọi góc đều đúng; ở 2D phải vẽ lại cho từng hướng xoay × từng giai đoạn.
3. **Đội đã chạy đúng ngăn xếp này trong sản phẩm thật.** [prj-ths-slide-frontend](../../../../prj-ths-slide-frontend/package.json): React 19.2.3 · Next 16.1.6 · R3F 9.5.0 · drei 10.7.7.

Bản đồ 2.5D được tạo bằng **camera trực giao** đặt ở góc nhìn chéo trên các mô hình low-poly thật. Chiều sâu do GPU lo, không phải tự sắp xếp thứ tự vẽ — đây là chỗ các dự án isometric hay sa lầy.

Đường lui vẫn còn: Kenney Nature Kit kèm sẵn 1.316 tệp PNG isometric 512×512 theo 4 hướng, và mọi mô hình đều render ra sprite 2:1 được bất cứ lúc nào.

### Thành phần cụ thể

| Việc | Dùng gì | Ghi chú |
|---|---|---|
| Chọn bộ phận trong mô hình | `onClick` của R3F + `<Bvh firstHitOnly>` | Nhanh hơn raycast thường nhiều bậc |
| Nhãn neo 3D, ẩn khi bị che | `<Html occlude={[modelRef]} onOcclude={…}>` | DOM thật → tiếng Việt có dấu chuẩn tuyệt đối |
| Tô sáng bộ phận | `<Outlines thickness screenspace>` | Tài liệu drei: "rất rẻ, hợp cả thiết bị di động" |
| Cắt lát | `gl.localClippingEnabled` + `material.clippingPlanes` | `ClippingGroup` của r185 chỉ chạy WebGPU — không dùng |
| Kéo bộ phận bằng cảm ứng | `<DragControls>` | Có `axisLock`, `dragLimits` |
| **Tháo rời bộ phận** | **Tự viết ~40 dòng** | Không tồn tại gói npm nào. Tham chiếu: `three-cad-viewer` (MIT) và `MeshExploder` của Babylon (Apache-2.0, ~110 dòng) |

Điểm phải cẩn thận khi tự viết tháo rời: **không được cộng thẳng vào `mesh.position`** — đó là toạ độ cục bộ so với node cha trong glTF. Phải quy đổi qua `mesh.parent.worldToLocal()`, nếu không mô hình có phân cấp sẽ bung sai.

### Bộ tài sản mỹ thuật

Tất cả CC0, một phong cách low-poly phẳng, không nghĩa vụ ghi công:

| Vai trò | Bộ | Số model |
|---|---|---|
| Địa hình, núi, sông, cây, ruộng | Kenney Nature Kit | 329 |
| Nhà dân | Kenney City Kit (Suburban) | 40 |
| Đường sá + rào công trường | Kenney City Kit (Roads) | 72 |
| Công trình lớn để ghép | Kenney City Kit (Commercial) | 41 |
| Nhà máy, tháp giải nhiệt | Kenney City Kit (Industrial) | 25 |
| Máy móc, cần cẩu, băng chuyền | Kenney Factory Kit | 143 |
| Giàn giáo, gạch, dây điện | Kenney Retro Urban Kit | 124 |
| Nhà ghép module | Kenney Modular Buildings + Building Kit | 187 |
| Cây trồng 5 giai đoạn (Sinh học) | Quaternius Ultimate Crops Pack | 102 |
| Công trường thật sự | Low Poly Construction Pack | 80 |

Tổng khoảng **1.060 model**. Phải tự ghép ba công trình: **Viện nghiên cứu** (từ Modular Buildings + mái vòm), **Nhà máy điện** (lõi là `chimney-large` — đúng hình tháp giải nhiệt hyperboloid — ghép với bồn và ống của Factory Kit), **Xưởng sửa chữa** (Factory Kit + Retro Urban Kit).

### Bẫy giấy phép — cấm dùng

| Bộ | Lý do |
|---|---|
| Max Parata "Isometric Science Lab" (175 sprite) | **CC BY-ND** — cấm phái sinh; đóng gói vào texture atlas đã có thể coi là phái sinh. Đây là bộ hợp chủ đề nhất mà lại không dùng được |
| ramtam Isometric Electric Tower | CC-BY-SA, không có nhánh thay thế — copyleft |
| Darkmoonfire Isometric Pipes | CC-BY-SA |
| Synty | EULA cấm chia sẻ lại; web game phục vụ `.glb` công khai là xung đột trực tiếp |
| CraftPix bậc miễn phí | Điều khoản xếp *"Offline use of graphics in educational institutions (schools, colleges, universities)"* vào gói trả phí — đúng lĩnh vực của dự án |
| xeokit-sdk | AGPL-3.0 — chỉ được học UX, không được đụng mã |
| PhET | GPL-3.0 |

Lưu ý về **Poly Pizza**: đây là kho **trộn**, không phải kho CC0. 2.292 model "Poly by Google" là CC-BY bắt buộc ghi công; Kenney/Quaternius/Kay Lousberg mới là CC0. Dùng tham số `?lic=1` để lọc chỉ CC0.

Lưu ý về **OpenGameArt**: giấy phép theo từng bài đăng. Nguy hiểm không phải NC mà là CC-BY-SA và GPL. Nhiều bài có nhiều giấy phép cho chọn — chọn CC-BY 3.0 và **ghi lại nhánh đã chọn** vào tài liệu dự án.

**Quy trình bắt buộc:** lưu ảnh chụp trang giấy phép kèm ngày, đặt cạnh tệp tải về. Trang itch.io và OpenGameArt do tác giả tự sửa được, giấy phép đổi không báo trước.

### Bẫy kỹ thuật

- **Next.js**: `ssr: false` của `next/dynamic` chỉ hợp lệ **bên trong** Client Component. App Router mặc định là Server Component → cần một lớp bọc mỏng `'use client'`.
- **React StrictMode**: mount → unmount → mount lại, mỗi lần tạo một WebGL context mới. **iOS/iPad giới hạn khoảng 16 context** — vượt là tab tự refresh. Giữ instance trong `useRef`, cleanup gọi `dispose` đầy đủ, và cân nhắc giữ một canvas duy nhất sống suốt vòng đời app thay vì mount/unmount theo route.
- **Nhiệt độ máy tính bảng**: thao tác 8 ms lúc đầu có thể thành 25 ms sau ~30 giây tải GPU liên tục. Bản đồ thường mở lâu → đúng kịch bản xấu. Giới hạn `resolution` ở `min(devicePixelRatio, 2)` và **dừng vòng lặp render khi không có tương tác**.
- **Số lệnh vẽ**: dưới ~50 cho thiết bị di động. Mâu thuẫn cần biết trước: tối ưu kinh điển là gộp geometry, nhưng geometry đã gộp thì **không tách rời hay chọn riêng lẻ được**. Giữ số bộ phận tương tác ở mức 30–60; chi tiết nền không tương tác thì gộp.
- **`<Html>` là nút cổ chai lớn nhất**: mỗi cái là một node DOM thật biến đổi mỗi khung hình. Quá ~12 nhãn hiện đồng thời thì chuyển sang `<Text>` + `<Billboard>`, hoặc chỉ hiện nhãn của bộ phận đang chọn.
- **`<Text>` của drei tải font từ CDN Google mặc định** — trường mạng yếu hoặc chặn CDN sẽ ra ô vuông. Tự host một tệp font đủ glyph tiếng Việt và truyền `font="/fonts/…"`. Troika đọc `.ttf`/`.otf`/`.woff`, **không đọc `.woff2`**.
- **Nén Draco có thể làm mất tên node** — mà tên node chính là thứ dùng để nhận diện bộ phận. Kiểm tra lại `mesh.name` sau khi nén.
- **Colyseus**: bắt buộc đặt `autoDispose = false`, nếu không phòng tự huỷ khi client cuối rời đi và AI không có chỗ tiếp quản. Ghim phiên bản `0.17.x` — dự án này có thay đổi phá vỡ giữa các bản minor.

## 12. Luồng dữ liệu và vị trí mô phỏng

```
Kho học liệu ──(script bóc tách, chạy 1 lần, rà tay 100%)──▶ Bộ bản trích
                                                                  │
người chơi mở thế giới ──▶ tải bản đồ + tiến độ ──▶ chọn chặng ───┤
                                                                  ▼
                              tải học liệu + bản trích của riêng chặng đó
                                                                  ▼
                                          [ chạy mô phỏng — xem bảng dưới ]
                                                                  ▼
                                      chốt ──▶ gửi kết quả + vật liệu lên
```

### Mô phỏng chạy ở đâu

| Game | Chạy ở | Vì sao |
|---|---|---|
| Xưởng lắp tế bào | Trình duyệt | Không có bí mật gì. Phản hồi tức thì, chơi được khi mạng chập chờn |
| Đoàn khảo sát | Trình duyệt | Như trên |
| **Truy tìm sự cố** | **Máy chủ** | **Bắt buộc** — xem dưới |

**Vì sao Truy tìm sự cố phải chạy trên máy chủ:** luật chơi dựa trên việc mỗi người chỉ thấy một nửa sơ đồ. Nếu mô phỏng chạy ở trình duyệt thì trình duyệt **phải có dữ liệu để mô phỏng** — nghĩa là nửa "bị giấu" vẫn nằm trong bộ nhớ máy người chơi. Mở công cụ nhà phát triển là thấy hết. Che ở tầng giao diện không phải là che, và toàn bộ luật chơi sụp đổ.

Colyseus giải quyết bằng `StateView`: máy chủ chỉ đóng gói và gửi đi những trường mà client đó được phép thấy. Nửa kia không bao giờ rời khỏi máy chủ. Đây chính là cơ chế các game bài dùng để giấu bài trên tay.

Vì động cơ mô phỏng là **hàm thuần không import React**, cùng một tệp mã chạy được ở cả hai nơi. Không phải viết hai lần.

### Chi phí realtime

Colyseus tự host, ước tính 500 phòng đồng thời: **~$20–60/tháng** (1–2 máy chủ ảo + Redis). Đặt máy tại Việt Nam hoặc Singapore.

Để so sánh, Liveblocks cho cùng tải là **~$3.600/tháng** — họ tính tiền theo "phút có từ 2 người trở lên trong cùng một phòng", trùng khít 100% thời lượng ván của game này.

## 13. Xử lý hỏng hóc

| Chuyện xảy ra | Hệ xử lý thế nào |
|---|---|
| Ảnh/mô hình học liệu tải chậm hoặc hỏng | Sân khấu **vẫn dựng được** từ bản trích; chỗ ảnh là khung xám có nút thử lại. Một cái ảnh không được quyền chặn cả chặng |
| Bản trích thiếu hoặc mâu thuẫn | Chặng **không lên bản đồ**. Thà thiếu chặng còn hơn để người chơi vào rồi kẹt |
| Mất mạng giữa chặng (game solo) | Chơi tiếp bình thường. Kết quả xếp hàng, gửi lại khi có mạng |
| Mất mạng giữa chặng (Truy tìm sự cố) | Colyseus tự kết nối lại với thời gian chờ tăng dần; tin nhắn gửi lúc mất mạng được đệm lại. Lưu `reconnectionToken` vào `sessionStorage` để sống sót qua F5 |
| Bạn cùng chơi rớt | `onDrop` → giữ chỗ **30 giây** (mạng di động Việt Nam rớt 5–15 giây là bình thường) → về kịp thì `onReconnect` giữ nguyên phiên; quá hạn thì `onLeave(4003)` và bác thợ cả tiếp quản. **Không huỷ ván** |
| AI chậm hoặc lỗi | Nhân vật có **thoại dựng sẵn cho mọi tình huống chính**. AI chỉ làm phong phú thêm, không bao giờ là điều kiện để chơi được |

## 14. Kiểm thử

Thứ tự ưu tiên đúng bằng thứ tự rủi ro.

1. **Động cơ mô phỏng** — cho một đồ thị và một chuỗi hành động, trạng thái ra phải đúng. Test thuần, đồng bộ, không mock, không DOM. Vừa là phần rủi ro nhất vừa là phần dễ test nhất → phải phủ kín. Mỗi màn chơi một tệp test, mỗi kịch bản sư phạm một ca. Đây cũng là **đặc tả nghiệm thu cho người làm giáo dục** — họ đọc được tên ca kiểm thử.
   Các ca bắt buộc có: lan truyền xuôi · ngắt nguồn · đóng lại (idempotent) · cổng "cần tất cả" (thiếu ribosome) · cổng "cần một" (nguồn dự phòng) · đồ thị có chu trình vẫn hội tụ · cạnh trỏ vào đỉnh không tồn tại · chuỗi dài 100 đỉnh (ca bắt lỗi ngưỡng cắt cụt).
2. **Bộ bản trích** — mọi thứ "cần" đều phải có nguồn cấp; không có vòng phụ thuộc vô lý; mọi bản trích đều trỏ được về học liệu gốc.
3. **Từng khuôn game** — kịch bản chơi tự động: đi đúng thì thắng, đi sai thì ra **đúng cái hậu quả đã thiết kế**, không phải chỉ "thua".
4. **Realtime** — hai phiên giả lập, có mô phỏng rớt mạng và AI tiếp quản. Kiểm tra riêng rằng client **không nhận được** dữ liệu nửa sơ đồ của người kia.
5. **Cảm ứng trên máy thật** — bắt buộc chạy tay, không thay thế được bằng test tự động.

## 15. Rủi ro

| Rủi ro | Chặn bằng |
|---|---|
| AI bóc sai → mô phỏng sai → **dạy sai** | Rà tay 100% bản trích của demo. Rủi ro nghiêm trọng nhất, không có đường tắt |
| Realtime nuốt tiến độ | Giới hạn đúng một game; luôn có đường chơi một mình |
| "Không có chữ sai" khiến người chơi không biết mình học được gì | Màn **Mổ xẻ** là bắt buộc, không được cắt để tiết kiệm |
| Mỹ thuật ngốn công hơn dự tính | Dùng bộ CC0 đã khảo sát; chỉ ghép ba công trình thiếu |
| Tháo rời 3D không có thư viện sẵn | Đã có hai bản tham chiếu mã nguồn mở để chép thuật toán; dựng thử ngay tuần đầu |
| Rủi ro một người bảo trì (Colyseus, Yjs) | Colyseus là MIT và toàn bộ mã là Node/TypeScript — xấu nhất thì fork và tự bảo trì. Đã né được Hathora (đóng cửa 05/05/2026) và Liveblocks (server AGPL) |

## 16. Câu hỏi mở

1. Số chặng mỗi thế giới ở demo — dự kiến 6–8, chốt lại khi biết có bao nhiêu học liệu đủ chất lượng cho mỗi môn.
2. Học liệu nguồn cụ thể cho từng thế giới chưa chọn. Cần một buổi rà kho để chốt danh sách trước khi chạy script bóc tách.
3. Cơ chế lớp học (lấy danh sách lớp từ đâu, ai gán) — v1 chưa có màn hình giáo viên nhưng vẫn cần biết "lớp" là gì để dựng thị trấn chung.
4. Vấn đề chưa có lời giải đã xác minh: nạp tệp `.wasm` (Draco, KTX2) dưới Turbopack của Next.js 16 chưa có công thức nào được kiểm chứng. Nếu dùng nén Draco cho mô hình thì phải dựng thử sớm.

---

## Phụ lục A — Mười hai nguyên liệu và các game mọc lên từ chúng

Ghi lại đầy đủ để v2 không phải nghĩ lại. Bảy loại đầu thuộc phạm vi v1.

| # | Nguyên liệu | Bóc ra từ | Game mọc lên | v1 |
|---|---|---|---|---|
| 1 | Điểm nóng không gian | ảnh, sơ đồ, bản đồ, trang PDF, slide | truy tìm bằng kính lúp, dán nhãn ngược, bắn đúng vùng, tìm điểm khác nhau, khoanh vùng nguy hiểm | ✅ |
| 2 | Mốc thời gian | video, audio | bấm đúng khoảnh khắc, dừng video đoán tiếp diễn, lồng tiếng, tua tìm bằng chứng, chỉ huy dàn nhạc | — |
| 3 | Bộ phận – chức năng | 3D, ảnh cắt lớp, sơ đồ, bài giảng | tháo lắp vật thể, sửa máy hỏng, ghép cơ thể, "thiếu bộ phận nào thì hệ ngừng chạy" | ✅ |
| 4 | Chuỗi / quy trình | tài liệu, bài giảng, video | dây chuyền sản xuất, sắp xếp lại, sửa quy trình lỗi, hồi tưởng ngược | — |
| 5 | Nhân – quả | tài liệu, sơ đồ, bài giảng | mô phỏng "nếu tôi kéo cái này", điều tra nguyên nhân, xây hệ sinh thái, hiệu ứng domino | ✅ |
| 6 | Số liệu & luật đo được | tài liệu, bảng, bài giảng | kéo thanh trượt đạt mục tiêu, tối ưu chi phí, cân bằng ngân sách | — |
| 7 | Phân loại & thuộc tính | mọi loại | phân loại tốc độ cao, thẻ đối kháng, xếp bàn theo nhóm | ✅ |
| 8 | Bản đồ & địa lý | ảnh bản đồ, dữ liệu địa lý | đoán vị trí, vẽ tuyến đường, quy hoạch thị xã | ✅ |
| 9 | Bằng chứng văn bản | PDF, DOC, sách | điều tra hồ sơ, phản biện, tìm câu sai, truy nguồn | — |
| 10 | Thuật ngữ – định nghĩa | mọi loại | nối cặp, đấu từ, giải mật thư | ✅ |
| 11 | Hình học & không gian 3D | 3D/VR | cắt lát tìm mặt phẳng, dựng lại vật thể từ ba hình chiếu, tìm góc nhìn đúng | ✅ |
| 12 | Dấu hiệu âm thanh | audio, video | nghe đoán, chép chính tả, luyện phát âm, tách lớp âm | — |

## Phụ lục B — Các game đã cân nhắc nhưng không chọn cho demo

Giữ lại vì đây là hàng chờ cho các chặng tiếp theo, không phải ý tưởng bị loại.

**Sinh học:** Bàn mổ (xoay mô hình 3D, tách lớp, gắp bộ phận ra khay) · Ca cấp cứu (suy luận ngược từ triệu chứng) · Vườn phân loại.

**Vật lý / Công nghệ:** Xưởng sửa chữa (tháo, đo, thay, nối; nối sai thì nổ) · Nhà máy nhân–quả (kéo thả khối quan hệ dựng dây chuyền) · Bàn điều khiển (cần nhóm nguyên liệu định lượng của v2).

**Địa lý:** Đội quy hoạch thị xã (đặt công trình lên địa hình thật; sai thì lụt, tắc, dân bỏ đi) · Truy tìm trên bản đồ (kính lúp + chồng lớp) · Ứng phó thiên tai (phân bổ nguồn lực theo thời gian — ứng viên realtime mạnh cho v2).
