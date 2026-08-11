# Bản deploy — Xưởng lắp tế bào

Thư mục này là thứ đưa lên Vercel. Chỉ có đúng trang game.

| Tệp | Là gì |
|---|---|
| `index.html` | Bản game, sao y `../prototype/xuong-lap-te-bao.html` |
| `vercel.json` | Chặn Google thu thập, khoá đoán kiểu tệp, không gửi địa chỉ tham chiếu |

Không đưa lên: `../qc/` (sổ lỗi, ma trận kiểm tra) và `../docs/` (bản thiết kế) — ghi chép nội bộ.

## Cập nhật khi sửa game

```
cp ../prototype/xuong-lap-te-bao.html index.html
npx vercel deploy --prod --yes
```

Link không đổi sau mỗi lần deploy: https://ths-xuong-lap-te-bao.vercel.app
