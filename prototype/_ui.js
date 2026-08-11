
'use strict';
const UI = (function(){
  const NSVG = 'http://www.w3.org/2000/svg';
  const $ = s => document.querySelector(s);
  const E = (t, a = {}, parent) => {
    const n = document.createElementNS(NSVG, t);
    for (const k in a) n.setAttribute(k, a[k]);
    if (parent) parent.appendChild(n);
    return n;
  };

  /* ---------- hình học băng chuyền (chỉ UI biết pixel) ---------- */
  const NODES = [
    { x: 268, y: 352 },   // 0 NHÂN (cửa xuất kiện của nhân)
    { x: 468, y: 236 },   // 1 P1
    { x: 668, y: 452 },   // 2 P2
    { x: 872, y: 236 },   // 3 P3
    { x: 1042, y: 420 },  // 4 P4
    { x: 1196, y: 352 }   // 5 CỬA XUẤT
  ];
  const PAD_XY = {
    P1: NODES[1], P2: NODES[2], P3: NODES[3], P4: NODES[4],
    S1: { x: 560, y: 592 }, S2: { x: 262, y: 138 }
  };
  // cubic bezier từng đoạn, control uốn chữ S
  const SEGS = [];
  for (let i = 0; i < 5; i++){
    const a = NODES[i], b = NODES[i+1];
    const dx = b.x - a.x, dy = b.y - a.y;
    const k = (i % 2 === 0 ? 1 : -1) * 0.24;
    SEGS.push({
      a, b,
      c1: { x: a.x + dx*0.34 - dy*k, y: a.y + dy*0.34 + dx*k },
      c2: { x: b.x - dx*0.34 - dy*k, y: b.y - dy*0.34 + dx*k }
    });
  }
  const bez = (s, t) => {
    const u = 1 - t;
    return {
      x: u*u*u*s.a.x + 3*u*u*t*s.c1.x + 3*u*t*t*s.c2.x + t*t*t*s.b.x,
      y: u*u*u*s.a.y + 3*u*u*t*s.c1.y + 3*u*t*t*s.c2.y + t*t*t*s.b.y
    };
  };
  const segPoint = (seg, t) => bez(SEGS[seg], Math.min(1, Math.max(0, t)));

  /* ---------- màu & glyph ---------- */
  const KIND_STYLE = {
    marn: { fill:'#dcecff', edge:'#3f8fe8' },
    tho : { fill:'#eceff2', edge:'#8b98a6' },
    gap : { fill:'#dcf5e6', edge:'#3fae6b' },
    goi : { fill:'#fde3f1', edge:'#ea5fae' }
  };
  const ORG_COLOR = { ribo:'#3fae6b', lnc:'#3f8fe8', golgi:'#ea5fae', tuiti:'#2fa8b8', tithe:'#f0862c', lyso:'#e05648', lucla:'#4f9e46' };

  function kindGlyph(kind, s){
    const k = s / 24;
    const g = b => `<g transform="scale(${k})">${b}</g>`;
    switch (kind){
      case 'marn': return g(`<path d="M4 8q8-6 16 0v9q-8-6-16 0Z" fill="#3f8fe8" opacity=".85"/><path d="M6 11h12M6 14h9" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>`);
      case 'tho' : return g(`<path d="M5 14q2-8 8-7t6 6q1 6-6 6-7 1-8-5Z" fill="none" stroke="#66727f" stroke-width="2.6" stroke-linecap="round"/><path d="M8 12q4-3 8 1" stroke="#66727f" stroke-width="2.2" fill="none" stroke-linecap="round"/>`);
      case 'gap' : return g(`<path d="M6 16q0-9 6-10t6 10q-2 4-6 4t-6-4Z" fill="#3fae6b"/><path d="M9 12q3-4 6 0" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/>`);
      case 'goi' : return g(`<rect x="5" y="7" width="14" height="12" rx="2.5" fill="#ea5fae"/><path d="M12 7v12M5 12h14" stroke="#fff" stroke-width="1.8"/><path d="M9 7q3-4 3 0 0-4 3 0" fill="none" stroke="#fff" stroke-width="1.6"/>`);
    }
    return '';
  }

  function orgGlyph(id, s){
    const k = s / 48, c = ORG_COLOR[id];
    const g = b => `<g transform="scale(${k})">${b}</g>`;
    switch (id){
      case 'ribo': return g(`<circle cx="18" cy="21" r="10" fill="${c}"/><circle cx="31" cy="27" r="7.5" fill="${c}" opacity=".7"/><circle cx="15" cy="35" r="4" fill="${c}" opacity=".5"/>`);
      case 'lnc': return g(`<path d="M7 13h34M9 22h32M7 31h34M9 40h30" fill="none" stroke="${c}" stroke-width="3.4" stroke-linecap="round"/><g fill="${c}"><circle cx="14" cy="9" r="2.3"/><circle cx="25" cy="9" r="2.3"/><circle cx="36" cy="9" r="2.3"/><circle cx="17" cy="27" r="2.3"/><circle cx="31" cy="27" r="2.3"/></g>`);
      case 'golgi': return g(`<g fill="none" stroke="${c}" stroke-width="3.4" stroke-linecap="round"><path d="M10 13q14-6 28 0"/><path d="M9 22q15-6 30 0"/><path d="M11 31q13-6 26 0"/><path d="M14 39q10-5 20 0"/></g><circle cx="8" cy="42" r="3" fill="${c}" opacity=".7"/>`);
      case 'tuiti': return g(`<circle cx="24" cy="24" r="17" fill="${c}" opacity=".2"/><circle cx="24" cy="24" r="17" fill="none" stroke="${c}" stroke-width="3" stroke-dasharray="5 4"/><circle cx="20" cy="21" r="3.6" fill="${c}"/><circle cx="29" cy="27" r="3" fill="${c}"/>`);
      case 'tithe': return g(`<ellipse cx="24" cy="24" rx="20" ry="13" fill="${c}" opacity=".2"/><ellipse cx="24" cy="24" rx="20" ry="13" fill="none" stroke="${c}" stroke-width="3"/><path d="M9 24c4-7 6 7 10 0s6 7 10 0 6 7 10 0" fill="none" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/>`);
      case 'lyso': return g(`<circle cx="24" cy="24" r="17" fill="${c}" opacity=".22"/><circle cx="24" cy="24" r="17" fill="none" stroke="${c}" stroke-width="3"/><g fill="${c}"><circle cx="19" cy="20" r="2.8"/><circle cx="29" cy="22" r="2.4"/><circle cx="24" cy="30" r="3"/></g>`);
      case 'lucla': return g(`<ellipse cx="24" cy="24" rx="20" ry="13.5" fill="${c}" opacity=".2"/><ellipse cx="24" cy="24" rx="20" ry="13.5" fill="none" stroke="${c}" stroke-width="3"/><g fill="${c}"><rect x="13" y="19" width="8" height="10" rx="2.5"/><rect x="25" y="16" width="8" height="10" rx="2.5" opacity=".75"/></g>`);
    }
    return '';
  }

  /* ---------- trạng thái UI ---------- */
  let sim = SIM.create();
  let auto = true;                // false sau khi __step được gọi (chế độ máy review)
  let picked = null;
  let raf = null, lastTs = 0, playT0 = 0;
  let layerSt, layerParcel, layerFx, layerCable;
  const saidOnce = new Set();

  /* ---------- dựng cảnh tĩnh ---------- */
  function buildScene(){
    const svg = $('#stage'); svg.innerHTML = '';

    // sàn + tường tế bào
    E('rect', { x:34, y:26, width:1212, height:608, rx:56, fill:'#efc478', stroke:'#3a2e24', 'stroke-width':5 }, svg);
    E('rect', { x:58, y:50, width:1164, height:560, rx:40, fill:'#fdf8ec', stroke:'#3a2e24', 'stroke-width':4 }, svg);
    const dots = E('g', { fill:'#ead9b8' }, svg);
    for (let gx = 110; gx < 1180; gx += 62)
      for (let gy = 100; gy < 580; gy += 62) E('circle', { cx:gx, cy:gy, r:2.5 }, dots);

    // nhãn khu
    const tag = E('g', {}, svg);
    E('rect', { x:498, y:36, width:284, height:34, rx:10, fill:'#fffdf6', stroke:'#3a2e24', 'stroke-width':3 }, tag);
    const tagT = E('text', { x:640, y:59, 'text-anchor':'middle', class:'biglbl' }, tag);
    tagT.textContent = 'TẾ BÀO — KHU SẢN XUẤT';

    // CỬA XUẤT (khoét tường phải)
    E('rect', { x:1206, y:300, width:44, height:104, rx:10, fill:'#fdf8ec', stroke:'#3a2e24', 'stroke-width':4 }, svg);
    const aw = E('g', {}, svg);
    E('path', { d:'M1188 296h72l-8 26h-56Z', fill:'#e05648', stroke:'#3a2e24', 'stroke-width':3.5 }, aw);
    E('path', { d:'M1206 296l-6 26M1224 296l0 26M1242 296l6 26', stroke:'#fff', 'stroke-width':5, opacity:.85 }, aw);
    const doorT = E('text', { x:1224, y:428, 'text-anchor':'middle', class:'stlbl' }, svg);
    doorT.textContent = 'CỬA XUẤT';
    // chồng kiện đã xuất (ngoài cửa)
    window.__doneStack = E('g', { id:'donestack' }, svg);

    // BĂNG CHUYỀN
    let d = `M${NODES[0].x} ${NODES[0].y}`;
    for (const s of SEGS) d += `C${s.c1.x} ${s.c1.y} ${s.c2.x} ${s.c2.y} ${s.b.x} ${s.b.y}`;
    E('path', { d, fill:'none', stroke:'#e2d2ae', 'stroke-width':34, 'stroke-linecap':'round' }, svg);
    E('path', { d, fill:'none', stroke:'#b9a67e', 'stroke-width':2.5, 'stroke-dasharray':'2 20', 'stroke-linecap':'round' }, svg);
    // mũi tên chiều chạy
    for (let i = 0; i < 5; i++){
      const p = segPoint(i, 0.5), q = segPoint(i, 0.56);
      const ang = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI;
      E('path', { d:'M-7 -6 L7 0 L-7 6 Z', fill:'#a5906a',
        transform:`translate(${p.x},${p.y}) rotate(${ang})` }, svg);
    }

    // dây cáp điện S1 → P1, S1 → P3
    layerCable = E('g', {}, svg);
    drawCable(PAD_XY.S1, PAD_XY.P1);
    drawCable(PAD_XY.S1, PAD_XY.P3);

    // NHÂN (dựng sẵn)
    const nuc = E('g', { id:'nucleus' }, svg);
    E('ellipse', { cx:190, cy:435, rx:98, ry:16, fill:'rgba(58,46,36,.12)' }, nuc);
    E('path', { d:'M96 430q0-118 96-118t96 118Z', fill:'#c9b6f7', stroke:'#3a2e24', 'stroke-width':4.5 }, nuc);
    E('path', { d:'M120 430q0-95 72-95', fill:'none', stroke:'#fff', 'stroke-width':7, opacity:.5, 'stroke-linecap':'round' }, nuc);
    E('rect', { x:236, y:236, width:22, height:52, rx:6, fill:'#8a6cf0', stroke:'#3a2e24', 'stroke-width':3.5, transform:'rotate(14 247 262)' }, nuc);
    // cửa sổ ADN
    E('circle', { cx:176, cy:378, r:30, fill:'#f3edff', stroke:'#3a2e24', 'stroke-width':3.5 }, nuc);
    E('path', { d:'M162 366q14 8 0 16t0 16M190 366q-14 8 0 16t0 16', fill:'none', stroke:'#8a6cf0', 'stroke-width':3, 'stroke-linecap':'round' }, nuc);
    E('path', { d:'M165 372h22M165 382h22M165 392h22', stroke:'#c9b6f7', 'stroke-width':2.4 }, nuc);
    // cổng xuất kiện
    E('rect', { x:252, y:334, width:34, height:36, rx:7, fill:'#3a2e24' }, nuc);
    E('rect', { x:258, y:340, width:22, height:24, rx:4, fill:'#8a6cf0' }, nuc);
    const nucTag = E('g', {}, nuc);
    E('rect', { x:142, y:440, width:96, height:30, rx:9, fill:'#fffdf6', stroke:'#3a2e24', 'stroke-width':3 }, nucTag);
    const nt = E('text', { x:190, y:461, 'text-anchor':'middle', class:'stlbl' }, nucTag);
    nt.textContent = 'NHÂN';

    // pad
    for (const pid of SIM.PADS) buildPad(pid, svg);

    layerSt = E('g', {}, svg);      // trạm đã đặt
    layerParcel = E('g', {}, svg);  // kiện hàng
    layerFx = E('g', {}, svg);      // tia chớp, pháo giấy, bọt enzyme
  }

  function drawCable(a, b){
    const mx = (a.x + b.x) / 2, my = Math.max(a.y, b.y) + 26;
    E('path', { d:`M${a.x} ${a.y - 20}Q${mx} ${my} ${b.x} ${b.y + 46}`,
      fill:'none', stroke:'#e8b64a', 'stroke-width':6, 'stroke-dasharray':'10 7', 'stroke-linecap':'round', opacity:.9 }, layerCable);
    E('circle', { cx:b.x, cy:b.y + 46, r:6, fill:'#e8b64a', stroke:'#3a2e24', 'stroke-width':2.5 }, layerCable);
  }

  function buildPad(pid, svg){
    const p = PAD_XY[pid];
    const g = E('g', { class:'pad-hit', 'data-pad':pid, tabindex:0, role:'button' }, svg);
    E('rect', { class:'pad-ring', x:p.x-62, y:p.y-56, width:124, height:112, rx:18,
      fill:'rgba(255,255,255,.45)', stroke:'#c9b389', 'stroke-width':3, 'stroke-dasharray':'9 8' }, g);
    const num = E('text', { class:'padnum', x:p.x, y:p.y - 66, 'text-anchor':'middle' }, g);
    const hint = E('text', { class:'padhint', x:p.x, y:p.y + 4, 'text-anchor':'middle' }, g);
    if (pid === 'S1'){ num.textContent = 'Ô NGUỒN ⚡'; hint.textContent = 'cần máy phát điện'; }
    else if (pid === 'S2'){ num.textContent = 'Ô KHO'; hint.textContent = 'ô trống cạnh nhân'; }
    else { num.textContent = 'TRẠM ' + pid[1]; hint.textContent = 'kéo bào quan vào'; }
    g.addEventListener('pointerup', () => tryDrop(pid));
    g.addEventListener('click', () => { if (!picked) removeStation(pid); });
    g.addEventListener('keydown', ev => { if (ev.key === 'Enter') removeStation(pid); });
  }

  /* ---------- vẽ động theo snapshot ---------- */
  function render(){
    const s = SIM.snapshot(sim);

    // trạm
    layerSt.innerHTML = '';
    for (const pid of SIM.PADS){
      const org = s.pads[pid];
      const p = PAD_XY[pid];
      const padG = document.querySelector(`[data-pad="${pid}"]`);
      padG.classList.toggle('filled', !!org);
      padG.querySelector('.padhint').style.display = org ? 'none' : '';
      if (!org) continue;
      const info = SIM.ORGS[org];
      const g = E('g', { class:'stgroup bang', 'data-stpad':pid }, layerSt);
      // nhà máy giấy
      E('ellipse', { cx:p.x, cy:p.y + 46, rx:56, ry:10, fill:'rgba(58,46,36,.12)' }, g);
      E('rect', { x:p.x-52, y:p.y-30, width:104, height:74, rx:12, fill:'#fffdf6', stroke:'#3a2e24', 'stroke-width':4 }, g);
      E('path', { d:`M${p.x-60} ${p.y-24}q60-38 120 0l-6 12h-108Z`, fill:ORG_COLOR[org], stroke:'#3a2e24', 'stroke-width':4 }, g);
      const ic = E('g', { transform:`translate(${p.x-24},${p.y-16})` }, g);
      ic.innerHTML = orgGlyph(org, 48);
      const tagW = Math.max(74, info.ten.length * 7.4 + 18);
      E('rect', { x:p.x - tagW/2, y:p.y + 48, width:tagW, height:26, rx:8, fill:'#fffdf6', stroke:'#3a2e24', 'stroke-width':2.5 }, g);
      const t = E('text', { x:p.x, y:p.y + 66, 'text-anchor':'middle', class:'stlbl', 'font-size':'12' }, g);
      t.textContent = info.ten;
      // pin cho trạm cần ATP
      if (info.atp){
        const ok = s.powered;
        E('rect', { x:p.x+28, y:p.y-46, width:30, height:17, rx:4, fill: ok ? '#3fae6b' : '#e05648', stroke:'#3a2e24', 'stroke-width':2.5 }, g);
        E('rect', { x:p.x+58, y:p.y-42, width:5, height:9, rx:2, fill:'#3a2e24' }, g);
        if (ok) E('path', { d:`M${p.x+40} ${p.y-44}l-5 8h6l-5 8`, stroke:'#fff', 'stroke-width':2.4, fill:'none', 'stroke-linecap':'round' }, g);
        else { const tx = E('text', { x:p.x+43, y:p.y-33, 'text-anchor':'middle', 'font-size':'11', 'font-weight':'800', fill:'#fff' }, g); tx.textContent = '!'; }
      }
      // trạm nằm im (không xử lý được / mất điện): mờ
      const idleBelt = SIM.BELT.includes(pid) && sim.running &&
        ((info.atp && !s.powered) || (info.vao === null));
      if (idleBelt) g.style.opacity = .55;
      g.addEventListener('click', () => removeStation(pid));
    }

    // nhân chết / sống
    const nuc = $('#nucleus');
    if (nuc){
      nuc.style.filter = s.nucleusAlive ? '' : 'grayscale(1) brightness(.85)';
      nuc.style.opacity = s.nucleusAlive ? 1 : .75;
    }

    // kiện hàng
    layerParcel.innerHTML = '';
    const queueCount = {};
    for (const p of s.parcels){
      let pt, rot = 0, scale = 1;
      if (p.phase === 'queue'){
        const pad = p.seg < 4 ? SIM.BELT[p.seg] : null;
        const qi = queueCount[pad] = (queueCount[pad] ?? -1) + 1;
        pt = segPoint(p.seg, 1 - 0.085 * (qi + 1));
        rot = (qi % 2 ? -8 : 8);
      } else if (p.phase === 'transform'){
        pt = segPoint(p.seg, 1);
        scale = 1 + 0.18 * Math.sin((1 - p.tt / SIM.TRANSFORM_T) * Math.PI);
      } else {
        pt = segPoint(p.seg, p.pos);
      }
      const st = KIND_STYLE[p.kind];
      const g = E('g', { transform:`translate(${pt.x},${pt.y - 12}) rotate(${rot}) scale(${scale})` }, layerParcel);
      E('ellipse', { cx:0, cy:15, rx:14, ry:4, fill:'rgba(58,46,36,.15)' }, g);
      E('rect', { x:-14, y:-14, width:28, height:28, rx:7, fill:st.fill, stroke:st.edge, 'stroke-width':3 }, g);
      const ic = E('g', { transform:'translate(-12,-12)' }, g);
      ic.innerHTML = kindGlyph(p.kind, 24);
    }
    // bong bóng "!" trên hàng ứ ≥3
    for (const pad in queueCount){
      if (queueCount[pad] + 1 >= 3){
        const p = PAD_XY[pad];
        const g = E('g', { class:'bang', transform:`translate(${p.x - 74},${p.y - 66})` }, layerParcel);
        E('circle', { cx:0, cy:0, r:15, fill:'#fff', stroke:'#e05648', 'stroke-width':3.5 }, g);
        const t = E('text', { x:0, y:6, 'text-anchor':'middle', 'font-size':'18', 'font-weight':'900', fill:'#e05648' }, g);
        t.textContent = '!';
      }
    }

    // tally
    $('#out').textContent = s.out + '/' + s.win;
    const crates = $('#crates');
    if (crates.childElementCount !== s.win){
      crates.innerHTML = '';
      for (let i = 0; i < s.win; i++) crates.appendChild(document.createElement('i'));
    }
    [...crates.children].forEach((c, i) => c.classList.toggle('f', i < s.out));

    // chồng kiện ngoài cửa
    const ds = document.getElementById('donestack');
    if (ds && ds.childElementCount !== s.out){
      ds.innerHTML = '';
      for (let i = 0; i < s.out; i++){
        const col = Math.floor(i / 4), row = i % 4;
        E('rect', { x:1216 + col*20 - 10, y:392 - row*15, width:17, height:13, rx:3,
          fill:'#fde3f1', stroke:'#ea5fae', 'stroke-width':2.5 }, ds);
      }
    }
  }

  /* ---------- sự kiện từ sim → thoại + hiệu ứng ---------- */
  function speak(text, key){
    if (key){ if (saidOnce.has(key)) return; saidOnce.add(key); }
    const b = $('#bubble');
    b.textContent = text;
    b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
  }

  function handleEvents(){
    for (const ev of SIM.drainEvents(sim)){
      switch (ev.type){
        case 'jam':
          if (ev.n + 1 >= 2){
            const nm = ev.pad === 'S1' ? 'ô nguồn' : 'trạm ' + ev.pad[1];
            speak(`Kiện dồn cục trước ${nm} kìa. Chỗ đó đang thiếu đúng cái máy xử lý được nó.`, 'jam-' + ev.pad);
          }
          break;
        case 'lyso-warn': speak('Ối! Túi enzyme mà kê sát nhân là nó tiêu luôn cái nhân đấy!!'); break;
        case 'nucleus-dead': speak('Đấy! Nhân bị tiêu rồi — cả xưởng hết nguồn đơn hàng. Gỡ nó ra mau!'); break;
        case 'nucleus-heal': speak('May quá, nhân hồi lại rồi. Tiếp tục nào.'); break;
        case 'lucla': speak('Cái đó của nhà cây. Xưởng mình là tế bào động vật, nó đứng chơi thôi.', 'lucla'); break;
        case 'tithe-misplug': speak('Máy phát điện phải cắm vào Ô NGUỒN có dây ấy, để đây không ra điện đâu.', 'misplug'); break;
        case 'atp': fxBolt(); break;
        case 'exit': fxConfetti(); break;
        case 'win': setTimeout(showDone, 900); break;
      }
    }
    // nhắc thiếu điện (kiểm tra trạng thái, 1 lần)
    const s = SIM.snapshot(sim);
    if (sim.running && !s.powered){
      for (const pid of SIM.BELT){
        const org = s.pads[pid];
        if (org && SIM.ORGS[org].atp && s.queues[pid] >= 1){
          speak('Trạm có rồi mà im re — nhìn cái pin đỏ với dây điện xem. Chưa có nguồn ⚡ kìa.', 'nopower');
        }
      }
    }
  }

  function fxBolt(){
    for (const target of ['P1','P3']){
      const a = PAD_XY.S1, b = PAD_XY[target];
      const bolt = E('g', {}, layerFx);
      bolt.innerHTML = `<path d="M0 -9l-6 10h7l-6 10" stroke="#f2b722" stroke-width="4" fill="none" stroke-linecap="round"/>`;
      const t0 = performance.now(), dur = 620;
      const mx = (a.x + b.x)/2, my = Math.max(a.y, b.y) + 26;
      (function anim(now){
        const t = Math.min(1, (now - t0) / dur);
        const u = 1 - t;
        const x = u*u*(a.x) + 2*u*t*mx + t*t*(b.x);
        const y = u*u*(a.y - 20) + 2*u*t*my + t*t*(b.y + 46);
        bolt.setAttribute('transform', `translate(${x},${y})`);
        bolt.setAttribute('opacity', 1 - t*0.4);
        if (t < 1 && bolt.parentNode) requestAnimationFrame(anim); else bolt.remove();
      })(t0);
    }
  }

  function fxConfetti(){
    const door = NODES[5];
    const cols = ['#f2b722','#ea5fae','#3f8fe8','#3fae6b','#f0862c'];
    for (let i = 0; i < 14; i++){
      const r = E('rect', { x:-4, y:-4, width:8, height:8, rx:2, fill:cols[i % cols.length] }, layerFx);
      const ang = (i / 14) * Math.PI * 2, sp = 60 + (i % 5) * 22;
      const t0 = performance.now(), dur = 700;
      (function anim(now){
        const t = Math.min(1, (now - t0) / dur);
        const x = door.x + Math.cos(ang) * sp * t;
        const y = door.y - 20 + Math.sin(ang) * sp * t + 70 * t * t;
        r.setAttribute('transform', `translate(${x},${y}) rotate(${t * 260})`);
        r.setAttribute('opacity', 1 - t);
        if (t < 1 && r.parentNode) requestAnimationFrame(anim); else r.remove();
      })(t0);
    }
  }

  /* ---------- khay & kéo thả ---------- */
  function buildTray(){
    const board = $('#board'); board.innerHTML = '';
    for (const id in SIM.ORGS){
      const o = SIM.ORGS[id];
      const c = document.createElement('div');
      c.className = 'chip'; c.dataset.org = id;
      c.innerHTML = `<svg width="40" height="40" viewBox="0 0 40 40"><g>${orgGlyph(id, 40)}</g></svg><b>${o.ten}</b><small>${o.power ? 'máy phát điện' : (o.vao ? 'máy chế biến' : 'đồ phụ')}</small>`;
      c.addEventListener('pointerdown', e => startDrag(e, id));
      board.appendChild(c);
    }
    refreshTray();
  }
  function refreshTray(){
    const s = SIM.snapshot(sim);
    const used = Object.values(s.pads);
    document.querySelectorAll('.chip').forEach(c => {
      c.classList.toggle('used', used.includes(c.dataset.org));
      c.classList.toggle('sel', picked === c.dataset.org);
    });
  }

  function showInfo(id){
    const o = SIM.ORGS[id];
    $('#ic-nm').textContent = o.ten;
    $('#ic-nm').style.color = ORG_COLOR[id];
    $('#ic-what').textContent = o.lam;
    $('#ic-in').textContent = o.vao ? SIM.KINDS[o.vao] : (o.power ? '—' : '—');
    $('#ic-out').textContent = o.ra ? SIM.KINDS[o.ra] : (o.power ? 'điện ATP ⚡' : '—');
    const w = $('#ic-warn');
    if (o.hint){ w.textContent = '💡 ' + o.hint; w.style.display = ''; } else w.style.display = 'none';
    $('#infocard').classList.add('on');
  }
  const hideInfo = () => $('#infocard').classList.remove('on');

  function startDrag(e, id){
    const s = SIM.snapshot(sim);
    if (Object.values(s.pads).includes(id)) return;
    e.preventDefault();
    picked = id; showInfo(id); refreshTray();
    const gh = $('#ghost');
    gh.innerHTML = `<g transform="translate(19,19)">${orgGlyph(id, 48)}</g>`;
    gh.style.display = 'block';
    moveGhost(e);
    window.addEventListener('pointermove', moveGhost);
    window.addEventListener('pointerup', endDrag, { once:true });
  }
  function moveGhost(e){
    const gh = $('#ghost');
    gh.style.left = e.clientX + 'px'; gh.style.top = e.clientY + 'px';
    document.querySelectorAll('.pad-hit').forEach(p => p.classList.remove('hot'));
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const pad = el && el.closest && el.closest('.pad-hit');
    const s = SIM.snapshot(sim);
    if (pad && !s.pads[pad.dataset.pad]) pad.classList.add('hot');
  }
  function endDrag(e){
    window.removeEventListener('pointermove', moveGhost);
    $('#ghost').style.display = 'none';
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const pad = el && el.closest && el.closest('.pad-hit');
    if (pad) tryDrop(pad.dataset.pad);
    picked = null; refreshTray();
    document.querySelectorAll('.pad-hit').forEach(p => p.classList.remove('hot'));
  }
  function tryDrop(pid){
    if (!picked) return;
    if (SIM.place(sim, pid, picked)){ hideInfo(); }
    picked = null; refreshTray(); handleEvents(); render();
  }
  function removeStation(pid){
    const org = SIM.remove(sim, pid);
    if (org){ refreshTray(); handleEvents(); render(); }
  }

  /* ---------- vòng lặp ---------- */
  function loop(ts){
    raf = requestAnimationFrame(loop);
    if (!auto){ return; }
    if (!lastTs) lastTs = ts;
    let dt = Math.min(0.1, (ts - lastTs) / 1000);
    lastTs = ts;
    if (dt > 0){ SIM.step(sim, dt); handleEvents(); render(); }
  }

  /* ---------- điều hướng & nút ---------- */
  function goPlay(){
    $('#scr-map').classList.remove('on');
    $('#scr-play').classList.add('on');
    resetShift();
  }
  function goMap(){
    SIM.setRun(sim, false); syncRunBtn();
    $('#scr-play').classList.remove('on');
    $('#scr-map').classList.add('on');
  }
  function resetShift(){
    sim = SIM.create();
    saidOnce.clear(); picked = null; playT0 = performance.now();
    buildScene(); buildTray(); hideInfo(); syncRunBtn(); render();
    speak('Ca sáng đây! Đơn hàng: 8 kiện protein mà xưởng còn trống trơn. Kéo máy vào các trạm rồi bấm Mở ca nhé.');
  }
  function syncRunBtn(){
    $('#btnRun').textContent = sim.running ? '⏸ Tạm dừng' : '▶ Mở ca sáng';
  }
  function toggleRun(){
    SIM.setRun(sim, !sim.running);
    if (sim.running) speak('Băng chuyền chạy! Nhìn kiện mARN từ nhân bò ra kìa.', 'run1');
    syncRunBtn();
  }
  function showDone(){
    SIM.setRun(sim, false); syncRunBtn();
    const secs = Math.round((performance.now() - playT0) / 1000);
    $('#doneTime').textContent = secs >= 60 ? Math.round(secs/60) + ' phút' : secs + ' giây';
    $('#debrief').textContent =
      'Thấy chưa — lúc kiện dồn cục là dây chuyền đang kể cho mình nghe nó thiếu gì. ' +
      'Đủ Ribosome, Lưới nội chất, Golgi, Túi tiết và máy điện Ti thể là hàng chạy một mạch từ nhân ra cửa. ' +
      'Ti thể là chỗ hay quên nhất: nó không đứng trên băng chuyền, nhưng thiếu nó thì hai trạm ngốn điện đứng im.';
    $('#scr-done').classList.add('on');
  }
  function closeDone(){ $('#scr-done').classList.remove('on'); $('#src').classList.remove('open'); }
  function replay(){ closeDone(); resetShift(); }
  function doneToMap(){ closeDone(); goMap(); }

  /* ---------- hooks review (giữ vĩnh viễn, contract) ---------- */
  window.__step = secs => { auto = false; SIM.step(sim, secs); handleEvents(); render(); };
  window.__place = (pad, org) => { const ok = SIM.place(sim, pad, org); handleEvents(); refreshTray(); render(); return ok; };
  window.__remove = pad => { const org = SIM.remove(sim, pad); handleEvents(); refreshTray(); render(); return org; };
  window.__setRun = on => { SIM.setRun(sim, on); syncRunBtn(); };
  window.__state = () => ({ screen: $('#scr-map').classList.contains('on') ? 'map' : ($('#scr-done').classList.contains('on') ? 'done' : 'play'), ...SIM.snapshot(sim) });
  window.__goScreen = name => {
    if (name === 'play') goPlay();
    else if (name === 'map'){ closeDone(); goMap(); }
    else if (name === 'done') showDone();
  };
  window.__screenPos = id => {
    const svg = $('#stage');
    const pt = PAD_XY[id] || (id === 'NUC' ? NODES[0] : id === 'DOOR' ? NODES[5] : null);
    if (!pt) return null;
    const m = svg.getScreenCTM();
    const p = new DOMPoint(pt.x, pt.y).matrixTransform(m);
    return { x: p.x, y: p.y };
  };
  window.__sim = () => sim;   // cho probe sâu

  /* ---------- khởi động ---------- */
  $('#btnRun').addEventListener('click', toggleRun);
  $('#btnReset').addEventListener('click', resetShift);
  window.addEventListener('keydown', e => { if (e.key === 'Escape'){ picked = null; refreshTray(); hideInfo(); } });
  buildScene(); buildTray();
  raf = requestAnimationFrame(loop);

  return { goPlay, goMap, replay, doneToMap, hideInfo };
})();
