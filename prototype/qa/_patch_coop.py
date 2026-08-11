# -*- coding: utf-8 -*-
import io

p = 'xuong-lap-te-bao.html'
s = io.open(p, encoding='utf-8').read()
n0 = len(s)

# ═══ trạng thái co-op ═══
s = s.replace("""  let dSim = null, dAttempt = 0, dDone = false, dEverStarted = false;
  let dCarry = null, dLastAction = 0;
  const dSaid = new Set();
  const dHero = { x: 640, y: 560, tx: 640, ty: 560, face: 1, onArrive: null };
  let dLayerFx = null, dHeroLayer = null;""",
"""  let dSim = null, dAttempt = 0, dDone = false, dEverStarted = false;
  let dCarry = null, dLastAction = 0, dPlayers = 1, dJoined = false;
  const dSaid = new Set();
  const dHero = { x: 640, y: 560, tx: 640, ty: 560, face: 1, onArrive: null };
  // nguoi choi 2 (phim mui ten) + bac tho (dung giu cau dao giup khi choi mot minh)
  const dHero2 = { x: 200, y: 560, face: 1, active: false };
  const dNpc = { x: 170, y: 590, tx: 170, ty: 590, holdB: null, home: { x: 170, y: 590 } };
  let dLayerFx = null, dHeroLayer = null, dHero2Layer = null, dNpcLayer = null;""")

# ═══ dTick: P2 + NPC + dong bo cau dao lo xo ═══
s = s.replace("""  function dTick(dt){
    const dx = dHero.tx - dHero.x, dy = dHero.ty - dHero.y;
    const d = Math.hypot(dx, dy);
    if (d > 2){
      const step = Math.min(d, WALK_SPEED * dt);
      dHero.x += dx / d * step; dHero.y += dy / d * step;
    } else if (dHero.onArrive){ const f = dHero.onArrive; dHero.onArrive = null; f(); }
    dDrawHero(d > 2);
  }""",
"""  function dTick(dt){
    const dx = dHero.tx - dHero.x, dy = dHero.ty - dHero.y;
    const d = Math.hypot(dx, dy);
    if (d > 2){
      const step = Math.min(d, WALK_SPEED * dt);
      dHero.x += dx / d * step; dHero.y += dy / d * step;
    } else if (dHero.onArrive){ const f = dHero.onArrive; dHero.onArrive = null; f(); }
    dDrawHero(d > 2);

    // nguoi choi 2 di bang phim mui ten
    let moved2 = false;
    if (dHero2.active){
      let kx = 0, ky = 0;
      if (keys.has('ArrowLeft')) kx -= 1;
      if (keys.has('ArrowRight')) kx += 1;
      if (keys.has('ArrowUp')) ky -= 1;
      if (keys.has('ArrowDown')) ky += 1;
      if (kx || ky){
        const l = Math.hypot(kx, ky);
        dHero2.x = Math.min(1200, Math.max(160, dHero2.x + kx / l * WALK_SPEED * dt));
        dHero2.y = Math.min(590, Math.max(120, dHero2.y + ky / l * WALK_SPEED * dt));
        if (kx) dHero2.face = kx > 0 ? 1 : -1;
        moved2 = true;
      }
      dDrawHero2(moved2);
    }
    // bac tho di toi cho duoc nho giu
    const ndx = dNpc.tx - dNpc.x, ndy = dNpc.ty - dNpc.y;
    const nd = Math.hypot(ndx, ndy);
    if (nd > 2){
      const step = Math.min(nd, WALK_SPEED * 0.8 * dt);
      dNpc.x += ndx / nd * step; dNpc.y += ndy / nd * step;
    }
    dDrawNpc(nd > 2);
    dSyncHolds();
  }

  // CAU DAO LO XO: buong tay la tu dong. Ai dung trong vong giu thi nhanh do NGAT.
  function dSyncHolds(){
    if (!dSim || dDone) return;
    const HOLD_R = 62;
    const bodies = [{ x: dHero.x, y: dHero.y }];
    if (dHero2.active) bodies.push({ x: dHero2.x, y: dHero2.y });
    for (const b of ['A','B','C']){
      const p = DPOS.sw(b);
      let held = bodies.some(o => Math.hypot(o.x - p.x, o.y - (p.y + 46)) < HOLD_R);
      if (dNpc.holdB === b && Math.hypot(dNpc.x - p.x, dNpc.y - (p.y + 46)) < HOLD_R) held = true;
      const snap = CIRCUIT.snapshot(dSim);
      if (held === snap.br[b]){ CIRCUIT.toggleBranch(dSim, b); dHandleEvents(); }
    }
  }

  function dDrawHero2(moving){
    if (!dHero2.active){ if (dHero2Layer) dHero2Layer.innerHTML = ''; return; }
    if (!dHero2Layer || !dHero2Layer.isConnected){
      const svg = $('#dstage'); if (!svg) return;
      dHero2Layer = E('g', {}, svg);
    }
    const bob = moving ? Math.sin(performance.now() / 70) * 4 : 0;
    dHero2Layer.innerHTML =
      '<g transform="translate(' + dHero2.x + ',' + (dHero2.y - 34 + bob) + ')">' +
      '<ellipse cx="0" cy="36" rx="17" ry="5" fill="rgba(58,46,36,.2)"/>' +
      '<g transform="scale(' + (1.35 * dHero2.face) + ',1.35)"><g transform="translate(-23,-26)">' +
      mamGlyph(1, 'calm').split('#4a9df0').join('#f0862c') + '</g></g>' +
      '<text y="-52" text-anchor="middle" font-size="13" font-weight="800" fill="#b4551a" paint-order="stroke" stroke="#fdf8ec" stroke-width="4">P2</text>' +
      '</g>';
  }
  function dDrawNpc(moving){
    if (!dNpcLayer || !dNpcLayer.isConnected){
      const svg = $('#dstage'); if (!svg) return;
      dNpcLayer = E('g', {}, svg);
    }
    const bob = moving ? Math.sin(performance.now() / 80) * 3 : 0;
    dNpcLayer.innerHTML =
      '<g transform="translate(' + dNpc.x + ',' + (dNpc.y - 30 + bob) + ')">' +
      '<ellipse cx="0" cy="32" rx="16" ry="5" fill="rgba(58,46,36,.2)"/>' +
      '<path d="M-11 6h22l4 24h-30Z" fill="#4a6b86" stroke="#12324f" stroke-width="2.8"/>' +
      '<circle cx="0" cy="-6" r="15" fill="#ffd9b0" stroke="#3a2e24" stroke-width="2.8"/>' +
      '<path d="M-15 -11q1-12 15-12t15 12l-3 3h-24Z" fill="#f2b722" stroke="#3a2e24" stroke-width="2.8"/>' +
      '<circle cx="-5" cy="-6" r="2" fill="#3a2e24"/><circle cx="5" cy="-6" r="2" fill="#3a2e24"/>' +
      (dNpc.holdB ? '<text y="-34" text-anchor="middle" font-size="12" font-weight="800" fill="#2b62a8" paint-order="stroke" stroke="#fdf8ec" stroke-width="4">dang giu giup</text>' : '') +
      '</g>';
  }

  function dJoin(n){
    dPlayers = n; dJoined = true;
    dHero2.active = (n === 2);
    $('#scr-dien').classList.remove('joining');
    if (n === 2){
      dSpeak('Hai nguoi thi chia viec: mot dua DUNG GIU cau dao cho ngat han, dua kia thay do. Giu chac vao day.');
      dMamSay('Ban cam phim mui ten chay toi dung de len cau dao nha. Minh lo phan do nghe!', 'yay');
    } else {
      dSpeak('Mot minh thi cu CHAM vao cau dao nhanh - toi ra giu cho. Xong viec cham lai la toi buong.');
      dMamSay('Co bac giu cau dao roi, minh chi viec do voi thay thoi ha?', 'oh');
    }
  }""")

# ═══ tap cau dao nhanh ═══
s = s.replace("""    const sw = e.target.closest('.dswitch');
    if (sw){
      const p = sw.dataset.act === 'main' ? DPOS.main : DPOS.sw(sw.dataset.b);
      const act = sw.dataset.act, b = sw.dataset.b;
      dWalkTo(p.x, p.y + 78, () => {
        act === 'main' ? CIRCUIT.toggleMain(dSim) : CIRCUIT.toggleBranch(dSim, b);
        dHandleEvents();
      });
      return;
    }""",
"""    const sw = e.target.closest('.dswitch');
    if (sw){
      if (sw.dataset.act === 'main'){
        dWalkTo(DPOS.main.x, DPOS.main.y + 78, () => { CIRCUIT.toggleMain(dSim); dHandleEvents(); });
        return;
      }
      const b = sw.dataset.b, p = DPOS.sw(b);
      if (dPlayers === 2){
        dMamSay('Cau dao lo xo ma - keu ban chay toi DUNG GIU no di, buong ra la no dong lai do?', 'oh', 'coop-hold');
        return;
      }
      if (dNpc.holdB === b){
        dNpc.holdB = null; dNpc.tx = dNpc.home.x; dNpc.ty = dNpc.home.y;
      } else {
        dNpc.holdB = b; dNpc.tx = p.x; dNpc.ty = p.y + 46;
        dMamSay('Bac oi giu giup cau dao ' + b + ' voi a!', 'oh');
      }
      return;
    }""")

# ═══ reset ve man ghep ═══
s = s.replace("""  function dReset(){
    dSim = CIRCUIT.create(dAttempt++);
    dDone = false; dCarry = null; dSaid.clear();""",
"""  function dReset(){
    dSim = CIRCUIT.create(dAttempt++);
    dDone = false; dCarry = null; dSaid.clear();
    dJoined = false; dHero2.active = false;
    dHero2.x = 200; dHero2.y = 560;
    dNpc.holdB = null; dNpc.x = dNpc.tx = dNpc.home.x; dNpc.y = dNpc.ty = dNpc.home.y;
    $('#scr-dien').classList.add('joining');
    const j1 = $('#dj1'), j2 = $('#dj2');
    if (j1) j1.innerHTML = mamGlyph(1, 'calm');
    if (j2) j2.innerHTML = mamGlyph(1, 'yay').split('#4a9df0').join('#f0862c');""")

# ═══ phim: man ghep = nguoi 2 nhay vao; trong game = P2 di chuyen ═══
s = s.replace("""    const playOn = $('#scr-play').classList.contains('on');
    const mapOn = $('#scr-map').classList.contains('on');
    if (e.key.startsWith('Arrow') && (playOn || mapOn)){ keys.add(e.key); e.preventDefault(); return; }""",
"""    if ($('#scr-dien').classList.contains('on')){
      if ($('#scr-dien').classList.contains('joining')){ if (!e.key.startsWith('F')) dJoin(2); return; }
      if (e.key.startsWith('Arrow')){ keys.add(e.key); e.preventDefault(); }
      return;
    }
    const playOn = $('#scr-play').classList.contains('on');
    const mapOn = $('#scr-map').classList.contains('on');
    if (e.key.startsWith('Arrow') && (playOn || mapOn)){ keys.add(e.key); e.preventDefault(); return; }""")

# ═══ vong giu quanh cau dao nhanh ═══
s = s.replace("""      dLabel(N, DPOS.sw(b).x, y + 48, 'CẦU DAO ' + b, s.br[b] ? 'đóng' : 'ngắt');""",
"""      E('circle', { class:'dholdring', cx:DPOS.sw(b).x, cy:y + 46, r:56 }, sg);
      dLabel(N, DPOS.sw(b).x, y + 48, 'CẦU DAO ' + b, s.br[b] ? 'đang đóng' : 'đang được giữ ngắt');""")

# ═══ xuat dJoin ═══
s = s.replace("dReplay, dToMap, dHideInfo };", "dReplay, dToMap, dHideInfo, dJoin };")

io.open(p, 'w', encoding='utf-8').write(s)
print('patched, delta', len(s) - n0)
