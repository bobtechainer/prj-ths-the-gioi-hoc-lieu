# -*- coding: utf-8 -*-
import io
p = 'xuong-lap-te-bao.html'
s = io.open(p, encoding='utf-8').read()

js = r'''  /* ═══════════ ĐOÀN KHẢO SÁT — game 3, thuần suy luận ═══════════
     Không đi lại điều khiển gì cả: đọc manh mối, bật lớp bản đồ, cắm cờ.
     Hậu quả: đi tới đâu tốn ngày công tới đó — cắm bừa thì đoàn tới nơi
     đo thử thấy không đạt, ngày công mất thật, đoàn phải đóng trại ở đó. */
  const KS = (function(){
    // bản đồ 6×4: loai = nui/doi/dong; song, rung là cờ riêng từng ô
    function lamBanDo(attempt){
      const G = [];
      for (let r = 0; r < 4; r++){ G[r] = []; for (let c = 0; c < 6; c++) G[r][c] = { loai:'dong', song:false, rung:false }; }
      [[0,0],[1,0],[0,1]].forEach(([c,r]) => G[r][c].loai = 'nui');
      [[3,0],[5,0],[2,1],[4,1],[2,2]].forEach(([c,r]) => G[r][c].loai = 'doi');
      [[3,1],[3,2],[3,3]].forEach(([c,r]) => G[r][c].song = true);
      const rung = (attempt % 2 === 0)
        ? [[4,0],[1,2],[4,2],[5,1]]          // mùa chẵn → đáp án đồi (2,1)
        : [[1,1],[4,2],[5,1],[2,3]];         // mùa lẻ  → đáp án đồi (3,0)
      rung.forEach(([c,r]) => G[r][c].rung = true);
      return G;
    }
    const ke = (G, c, r, f) => [[c-1,r],[c+1,r],[c,r-1],[c,r+1]]
      .some(([x,y]) => G[y] && G[y][x] && f(G[y][x]));
    function doTaiCho(G, c, r){
      return {
        doi:  G[r][c].loai === 'doi',
        song: ke(G, c, r, o => o.song),
        rung: !ke(G, c, r, o => o.rung) && !G[r][c].rung
      };
    }
    function create(attempt){
      return {
        G: lamBanDo(attempt), days: 12, doan: { c: 0, r: 3 },
        opened: 0, tried: {}, win: false, het: false, events: []
      };
    }
    const CLUES = [
      'Trạm phải dựng trên ĐỒI — cao hơn đồng bằng cho thoáng, nhưng đừng leo lên núi.',
      'Phải KỀ Ô CÓ SÔNG — người trực trạm cần nước dùng quanh năm.',
      'KHÔNG kề rừng rậm — tán cây hứng bớt mưa, số đo bị lệch.'
    ];
    function moManhMoi(st){
      if (st.opened >= 3 || st.days < 2) return false;
      st.days -= 2; st.opened += 1;
      st.events.push({ type:'clue', n: st.opened });
      return true;
    }
    function camCo(st, c, r){
      if (st.win || st.het) return;
      const cost = Math.max(1, Math.abs(st.doan.c - c) + Math.abs(st.doan.r - r));
      if (cost > st.days){ st.events.push({ type:'far', cost }); return; }
      st.days -= cost; st.doan = { c, r };
      const kq = doTaiCho(st.G, c, r);
      st.tried[c + ',' + r] = kq;
      if (kq.doi && kq.song && kq.rung){ st.win = true; st.events.push({ type:'win' }); }
      else {
        st.events.push({ type:'khong-dat', c, r, kq });
        if (st.days <= 0){ st.het = true; st.events.push({ type:'het-mua' }); }
      }
    }
    return { create, moManhMoi, camCo, doTaiCho, CLUES };
  })();

  let kSt = null, kAttempt = 0, kEver = false;
  const kLayers = { diahinh: true, song: false, rung: false };
  const kSaid = new Set();

  function kSpeak(text, key){
    if (key){ if (kSaid.has(key)) return; kSaid.add(key); }
    const b = $('#kbubble');
    $('#kbubbleTxt').textContent = text;
    b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
    document.body.classList.add('spk-bac'); document.body.classList.remove('spk-mam');
  }
  function kMamSay(text, mood, key){
    if (key){ if (kSaid.has('m:' + key)) return; kSaid.add('m:' + key); }
    const b = $('#kmamBubble');
    $('#kmamTxt').textContent = text;
    b.classList.remove('quiet', 'pop'); void b.offsetWidth; b.classList.add('pop');
    document.body.classList.add('spk-mam'); document.body.classList.remove('spk-bac');
    const f = $('#kmamFace2'); if (f) f.innerHTML = mamGlyph(mamStage, mood || 'calm');
  }

  const K_CELL = 138, K_OX = 34, K_OY = 40;
  function kRender(){
    if (!kSt) return;
    $('#kdays').textContent = kSt.days;
    // lớp bản đồ
    const LDEF = [
      { id:'diahinh', ten:'Địa hình (núi · đồi · đồng bằng)', mau:'#cbb88a' },
      { id:'song',    ten:'Sông ngòi',                        mau:'#7db8e8' },
      { id:'rung',    ten:'Rừng cây',                          mau:'#5a9e4c' }
    ];
    $('#klayers').innerHTML = LDEF.map(l =>
      '<button type="button" class="klayer" aria-pressed="' + kLayers[l.id] + '" onclick="UI.kLayer(\'' + l.id + '\')">' +
      '<span class="dot" style="background:' + l.mau + '"></span>' + l.ten +
      (kLayers[l.id] ? ' — đang bật' : '') + '</button>').join('');
    // manh mối
    $('#kclues').innerHTML = KS.CLUES.map((c, i) =>
      i < kSt.opened
        ? '<div class="kclue open"><b>MANH MỐI ' + (i + 1) + '</b>' + c + '</div>'
        : (i === kSt.opened
          ? '<button type="button" class="kclue" onclick="UI.kClue()">❓ Mở manh mối ' + (i + 1) + ' — tốn 2 ngày công</button>'
          : '<div class="kclue" style="opacity:.45">❓ Manh mối ' + (i + 1) + ' (mở cái trước đã)</div>')
    ).join('');

    // bản đồ
    const svg = $('#kmap'); svg.innerHTML = '';
    E('rect', { x:8, y:8, width:884, height:624, rx:20, fill:'#efe7d0', stroke:'#3a2e24', 'stroke-width':4 }, svg);
    const tt = E('text', { x:450, y:34, 'text-anchor':'middle', class:'biglbl' }, svg);
    tt.textContent = 'VÙNG KHẢO SÁT — chạm ô để đoàn đi tới cắm cờ';
    for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++){
      const o = kSt.G[r][c];
      const x = K_OX + c * K_CELL, y = K_OY + r * K_CELL;
      const g = E('g', { class:'kcell', 'data-c':c, 'data-r':r }, svg);
      const mau = !kLayers.diahinh ? '#e8dfc8'
        : o.loai === 'nui' ? '#b8a888' : o.loai === 'doi' ? '#d8c893' : '#e9dfb9';
      E('rect', { class:'kcell-bg', x, y, width:K_CELL - 8, height:K_CELL - 8, rx:13,
        fill:mau, stroke:'#b9a67e', 'stroke-width':2.5 }, g);
      if (kLayers.diahinh){
        if (o.loai === 'nui'){
          E('path', { d:'M' + (x+24) + ' ' + (y+96) + 'l30-52 18 26 12-16 22 42Z', fill:'#8f7f5e', stroke:'#3a2e24', 'stroke-width':2.6, 'pointer-events':'none' }, g);
          E('path', { d:'M' + (x+46) + ' ' + (y+58) + 'l8 12 8-8', fill:'#fdfbf4', 'pointer-events':'none' }, g);
        } else if (o.loai === 'doi'){
          E('path', { d:'M' + (x+22) + ' ' + (y+92) + 'q28-40 56 0Z', fill:'#c2a86a', stroke:'#3a2e24', 'stroke-width':2.4, 'pointer-events':'none' }, g);
          E('path', { d:'M' + (x+62) + ' ' + (y+96) + 'q22-30 44 0Z', fill:'#cdb87e', stroke:'#3a2e24', 'stroke-width':2.2, 'pointer-events':'none' }, g);
        }
      }
      if (kLayers.song && o.song)
        E('path', { d:'M' + (x+18) + ' ' + (y+30) + 'q30 14 0 34t0 40', fill:'none', stroke:'#5aa2e0', 'stroke-width':11, 'stroke-linecap':'round', 'pointer-events':'none', opacity:.9 }, g);
      if (kLayers.rung && o.rung)
        for (const [dx, dy] of [[38,46],[72,34],[96,66],[56,84]]){
          E('path', { d:'M' + (x+dx) + ' ' + (y+dy) + 'l9-17 9 17Z', fill:'#4c8a3f', stroke:'#2c5a24', 'stroke-width':2, 'pointer-events':'none' }, g);
          E('rect', { x:x+dx+6, y:y+dy, width:5, height:8, fill:'#7a4a1c', 'pointer-events':'none' }, g);
        }
      // kết quả đo ở ô đã cắm thử
      const t = kSt.tried[c + ',' + r];
      if (t && !(kSt.win && kSt.doan.c === c && kSt.doan.r === r)){
        const icons = [[t.doi,'đồi'],[t.song,'sông'],[t.rung,'xa rừng']];
        icons.forEach(([ok, nhan], i) => {
          const ix = x + 16, iy = y + 18 + i * 17;
          const txt = E('text', { x:ix, y:iy, 'font-size':'12', 'font-weight':'700',
            fill: ok ? '#0f8a4d' : '#c0392b', 'paint-order':'stroke', stroke:'#fdf8ec', 'stroke-width':'3.5', 'pointer-events':'none' }, g);
          txt.textContent = (ok ? '✓ ' : '✕ ') + nhan;
        });
      }
      g.addEventListener('click', () => kCam(c, r));
    }
    // lều trại + đoàn
    const dx = K_OX + kSt.doan.c * K_CELL + K_CELL / 2 - 4, dy = K_OY + kSt.doan.r * K_CELL + K_CELL / 2;
    const doan = E('g', { 'pointer-events':'none' }, svg);
    E('ellipse', { cx:dx, cy:dy + 30, rx:34, ry:8, fill:'rgba(58,46,36,.18)' }, doan);
    E('path', { d:'M' + (dx-30) + ' ' + (dy+28) + ' l30-44 30 44Z', fill:'#f0862c', stroke:'#3a2e24', 'stroke-width':3.4 }, doan);
    E('path', { d:'M' + (dx-13) + ' ' + (dy+28) + ' l13-22 13 22Z', fill:'#7a4a1c', stroke:'#3a2e24', 'stroke-width':2.8 }, doan);
    if (kSt.win){
      E('path', { d:'M' + dx + ' ' + (dy-46) + 'v-26M' + dx + ' ' + (dy-72) + 'l22 8-22 8', fill:'#e4453c', stroke:'#3a2e24', 'stroke-width':3 }, doan);
      E('rect', { x:dx-38, y:dy-46, width:76, height:16, rx:5, fill:'#fffdf6', stroke:'#3a2e24', 'stroke-width':2.4 }, doan);
      const wt = E('text', { x:dx, y:dy-34, 'text-anchor':'middle', 'font-size':'11', 'font-weight':'800', fill:'#0f8a4d' }, doan);
      wt.textContent = 'TRẠM ĐO MƯA';
    }
  }

  function kLayer(id){
    kLayers[id] = !kLayers[id];
    if (id !== 'diahinh' && kLayers[id])
      kMamSay(id === 'song' ? 'Bật lớp sông lên thấy liền ha — nước chảy dọc giữa vùng luôn.' : 'Ra là rừng nằm mấy chỗ đó. Trạm mà kề rừng thì đo mưa có chuẩn không ta?', 'oh', 'layer-' + id);
    kRender();
  }
  function kClue(){
    if (!KS.moManhMoi(kSt)){ kSpeak('Ngày công không đủ để mở thêm manh mối nữa rồi.'); return; }
    kHandle(); kRender();
  }
  function kCam(c, r){
    KS.camCo(kSt, c, r);
    kHandle(); kRender();
  }
  function kHandle(){
    for (const ev of kSt.events.splice(0)){
      switch (ev.type){
        case 'clue':
          if (ev.n === 1) kMamSay('Trên đồi… vậy mấy ô có hai ụ tròn tròn đó hả bạn?', 'oh');
          if (ev.n === 2) kMamSay('Kề sông nữa… mình bật lớp sông lên xem nó chảy qua đâu nha?', 'oh');
          if (ev.n === 3) kMamSay('Và phải xa rừng. Ba điều kiện ghép lại chắc chỉ còn một hai ô thôi nhỉ?', 'yay');
          break;
        case 'khong-dat': {
          const thieu = [];
          if (!ev.kq.doi) thieu.push('không phải đồi');
          if (!ev.kq.song) thieu.push('không kề sông');
          if (!ev.kq.rung) thieu.push('kề rừng rậm');
          kSpeak('Đoàn tới nơi đo thử rồi — chỗ này ' + thieu.join(', ') + '. Đóng trại ở đây, mai tính tiếp.');
          kMamSay('Lặn lội tới mà không đạt… mỏi chân ghê. Hay mình dò kỹ trên bản đồ trước rồi hẵng đi?', 'oh', 'moi-chan');
          break;
        }
        case 'far': kSpeak('Chỗ đó xa quá, ngày công còn lại không đủ đi tới nơi. Chọn chỗ gần hơn.'); break;
        case 'het-mua': kSpeak('Hết ngày công — mùa khảo sát năm nay khép lại. Bấm "Mùa mới" làm lại, lần này đọc bản đồ trước nhé.'); break;
        case 'win': {
          if (mamStage < 5) mamStage += 1;
          $('#kthDays').textContent = 12 - kSt.days;
          $('#kthStage').textContent = MAM_STAGE_NAME[mamStage];
          $('#kmamFace').innerHTML = mamGlyph(mamStage, 'yay');
          $('#kmamGrow').innerHTML = mamGlyph(mamStage, 'yay');
          kSpeak('Chuẩn chỗ này! Đồi thoáng, sông ngay cạnh, không cây che. Dựng trạm!');
          kMamSay('Cắm cờ rồiii! Bạn đọc bảng bên cạnh đi, mình phụ cô dựng trạm.', 'yay');
          setTimeout(() => { $('#scr-khaosat').classList.add('done-mode'); $('#ktheory').scrollTop = 0; }, 900);
          break;
        }
      }
    }
  }

  function kReset(){
    kSt = KS.create(kAttempt++);
    kSaid.clear();
    kLayers.diahinh = true; kLayers.song = false; kLayers.rung = false;
    $('#scr-khaosat').classList.remove('done-mode');
    kRender();
    kSpeak('Huyện nhờ mình tìm chỗ dựng trạm đo mưa. Manh mối nằm trong phong bì — mở cái nào tốn ngày công cái đó, mà đi bừa còn tốn hơn.');
    kMamSay('Cả vùng rộng vậy… mình mở manh mối trước hay đi đại một chỗ trước ta?', 'oh');
  }
  function goKhaoSat(){
    showScreen('scr-khaosat');
    if (!kEver || (kSt && (kSt.win || kSt.het))) kReset();
    kEver = true;
  }
  function kReplay(){ kReset(); }
  function kToMap(){ $('#scr-khaosat').classList.remove('done-mode'); goGarden(); }
  $('#kbtnReset').addEventListener('click', kReset);

'''
s = s.replace("  /* ---------- vòng lặp ---------- */", js + "  /* ---------- vòng lặp ---------- */")

# wiring
s = s.replace("const SCREENS = ['scr-topic', 'scr-map', 'scr-play', 'scr-dien'];",
              "const SCREENS = ['scr-topic', 'scr-map', 'scr-play', 'scr-dien', 'scr-khaosat'];")
s = s.replace("    else if (name === 'dien') goDien();",
              "    else if (name === 'dien') goDien();\n    else if (name === 'khaosat') goKhaoSat();")
s = s.replace("""    screen: $('#scr-topic').classList.contains('on') ? 'topic'
          : $('#scr-dien').classList.contains('on') ? 'dien'""",
"""    screen: $('#scr-topic').classList.contains('on') ? 'topic'
          : $('#scr-khaosat').classList.contains('on') ? 'khaosat'
          : $('#scr-dien').classList.contains('on') ? 'dien'""")
s = s.replace("dReplay, dToMap, dHideInfo, dJoin };",
              "dReplay, dToMap, dHideInfo, dJoin, kLayer, kClue, kReplay, kToMap };")
s = s.replace("  window.__dstate = () =>",
              "  window.__kstate = () => kSt ? { days: kSt.days, opened: kSt.opened, doan: kSt.doan, win: kSt.win, het: kSt.het } : null;\n  window.__dstate = () =>")

io.open(p, 'w', encoding='utf-8').write(s)
print('khaosat js in, size', len(s))
