# -*- coding: utf-8 -*-
import io
p='xuong-lap-te-bao.html'
s=io.open(p,encoding='utf-8').read()
s=s.replace("""      const snap = CIRCUIT.snapshot(dSim);
      if (held === snap.br[b]){ CIRCUIT.toggleBranch(dSim, b); dHandleEvents(); }""",
"""      const snap = CIRCUIT.snapshot(dSim);
      if (held === snap.br[b]){
        (window.__blog = window.__blog || []).push({ t: Math.round(performance.now()), b, held,
          brWas: snap.br[b], npc: { x: Math.round(dNpc.x), y: Math.round(dNpc.y), holdB: dNpc.holdB },
          p1: { x: Math.round(dHero.x), y: Math.round(dHero.y) } });
        CIRCUIT.toggleBranch(dSim, b); dHandleEvents();
      }""")
io.open(p,'w',encoding='utf-8').write(s)
print('blog in')
