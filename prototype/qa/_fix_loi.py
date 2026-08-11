# -*- coding: utf-8 -*-
import io
p='xuong-lap-te-bao.html'
s=io.open(p,encoding='utf-8').read()
fixes = [
 ("Hai nguoi thi chia viec: mot dua DUNG GIU cau dao cho ngat han, dua kia thay do. Giu chac vao day.",
  "Hai người thì chia việc: một đứa ĐỨNG GIỮ cầu dao cho ngắt hẳn, đứa kia thay đồ. Giữ chắc vào đấy."),
 ("Ban cam phim mui ten chay toi dung de len cau dao nha. Minh lo phan do nghe!",
  "Bạn cầm phím mũi tên chạy tới đứng giữ cầu dao nha. Mình lo phần đồ nghề!"),
 ("Mot minh thi cu CHAM vao cau dao nhanh - toi ra giu cho. Xong viec cham lai la toi buong.",
  "Một mình thì cứ chạm vào cầu dao nhánh — tôi ra giữ cho. Xong việc chạm lại là tôi buông."),
 ("Co bac giu cau dao roi, minh chi viec do voi thay thoi ha?",
  "Có bác giữ cầu dao rồi, mình chỉ việc đo với thay thôi ha?"),
 ("Cau dao lo xo ma - keu ban chay toi DUNG GIU no di, buong ra la no dong lai do?",
  "Cầu dao lò xo mà — kêu bạn chạy tới đứng giữ nó đi, buông ra là nó tự đóng lại đó?"),
 ("'Bac oi giu giup cau dao ' + b + ' voi a!'",
  "'Bác ơi giữ giúp cầu dao ' + b + ' với ạ!'"),
 (">dang giu giup<", ">đang giữ giúp<"),
 # thoại cũ nói "ngắt cầu dao" — giờ là "nhờ người giữ"
 ("Ấy chết! Còn điện mà đã đụng vào — may là giật nhẹ. NGẮT CẦU DAO nhánh đó trước đã cậu ơi.",
  "Ấy chết! Còn điện mà đã đụng vào — may là giật nhẹ. Phải có người GIỮ CẦU DAO nhánh đó rồi mới thay chứ."),
 ("Tê hết cả tay… ra là phải ngắt điện rồi mới được thay đồ hả?",
  "Tê hết cả tay… ra là phải có người giữ cầu dao rồi mới được đụng vào dây hả?"),
 ("lam:'Thay cho hộp cầu chì. Nhớ ngắt cầu dao nhánh trước rồi hẵng thay.'",
  "lam:'Thay cho hộp cầu chì. Phải có người giữ cầu dao nhánh rồi mới thay được.'"),
 ("lam:'Nối lại mối nối bị đứt ngầm. Cũng phải ngắt điện trước.'",
  "lam:'Nối lại mối nối bị đứt ngầm. Cũng phải có người giữ cầu dao trước.'"),
]
n=0
for a,b in fixes:
    if a in s: s=s.replace(a,b); n+=1
io.open(p,'w',encoding='utf-8').write(s)
print('fixed', n, '/', len(fixes))
