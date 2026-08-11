# -*- coding: utf-8 -*-
import io
p='xuong-lap-te-bao.html'
s=io.open(p,encoding='utf-8').read()
s=s.replace("  window.__dstate = () =>","  window.__p2 = () => ({ x: dHero2.x, y: dHero2.y, active: dHero2.active });\n  window.__dstate = () =>")
io.open(p,'w',encoding='utf-8').write(s)
print('p2 hook in')
