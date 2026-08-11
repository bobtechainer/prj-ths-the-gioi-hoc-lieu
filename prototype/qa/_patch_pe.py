# -*- coding: utf-8 -*-
import io
p='xuong-lap-te-bao.html'
s=io.open(p,encoding='utf-8').read()
# nhãn không được nuốt click của cầu dao/linh kiện bên dưới
s=s.replace("""  function dLabel(parent, x, y, ten, sach){
    const w = Math.max(84, ten.length * 7.6 + 18);
    E('rect', { x:x - w/2, y:y - 13, width:w, height:32, rx:8, fill:'#fffdf6', stroke:'#3a2e24', 'stroke-width':2.4 }, parent);""",
"""  function dLabel(parent, x, y, ten, sach){
    const w = Math.max(84, ten.length * 7.6 + 18);
    parent = E('g', { 'pointer-events':'none' }, parent);   // nhãn chỉ để đọc, không ăn chuột
    E('rect', { x:x - w/2, y:y - 13, width:w, height:32, rx:8, fill:'#fffdf6', stroke:'#3a2e24', 'stroke-width':2.4 }, parent);""")
# dây + kết quả đo cũng không ăn chuột
s=s.replace("    E('g', { id:'dwires' }, svg);","    E('g', { id:'dwires', 'pointer-events':'none' }, svg);")
s=s.replace("    E('g', { id:'dmarks' }, svg);","    E('g', { id:'dmarks', 'pointer-events':'none' }, svg);")
io.open(p,'w',encoding='utf-8').write(s)
print('pointer-events fixed')
