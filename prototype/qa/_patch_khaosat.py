# -*- coding: utf-8 -*-
import io
p = 'xuong-lap-te-bao.html'
s = io.open(p, encoding='utf-8').read()

# ═══ 1. Thẻ chủ đề mới (Địa lý, mở) ═══
s = s.replace("{ mon:'Địa lý',   hoi:'Núi lửa phun vì cái gì?',                lop:'Địa lý 10' },",
"""{ mon:'Địa lý',   hoi:'Đặt trạm đo mưa ở đâu mới chuẩn?',       lop:'Địa lý 6', game:'khaosat' },
    { mon:'Địa lý',   hoi:'Núi lửa phun vì cái gì?',                lop:'Địa lý 10' },""")

# ═══ 2. Lều khảo sát trong vườn + cửa thứ ba ═══
s = s.replace("""      <!-- Mầm đi bộ -->
      <g id="gardenHero"></g>""",
"""      <!-- LỀU ĐOÀN KHẢO SÁT (mở) -->
      <g class="plot" tabindex="0" role="button" aria-label="Vào bài Đoàn khảo sát" onclick="UI.gardenGo('khaosat')"
         onkeydown="if(event.key==='Enter'){event.preventDefault();UI.gardenGo('khaosat')}">
        <ellipse class="ring" cx="770" cy="468" rx="80" ry="46" fill="rgba(255,255,255,.55)" opacity="0" style="transition:opacity .2s"/>
        <ellipse cx="770" cy="492" rx="56" ry="11" fill="rgba(58,46,36,.15)"/>
        <path d="M714 492 770 408l56 84Z" fill="#f0862c" stroke="#3a2e24" stroke-width="4"/>
        <path d="M746 492 770 448l24 44Z" fill="#7a4a1c" stroke="#3a2e24" stroke-width="3.5"/>
        <path d="M770 408v-22M770 386l24 8-24 8" fill="#e4453c" stroke="#3a2e24" stroke-width="3"/>
        <g class="bobber">
          <circle cx="770" cy="376" r="13" fill="#3fae6b" stroke="#3a2e24" stroke-width="3.2"/>
          <path d="M764.5 376l4 4 8.5-9" stroke="#fff" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <text class="maplbl" x="770" y="520" text-anchor="middle" font-size="16">Lều đoàn khảo sát</text>
        <text class="mapsub" x="770" y="538" text-anchor="middle">đi tới cửa là vào</text>
      </g>

      <!-- Mầm đi bộ -->
      <g id="gardenHero"></g>""")
s = s.replace("const DOORS = { lab: { x: 255, y: 418 }, dien: { x: 452, y: 500 } };",
              "const DOORS = { lab: { x: 255, y: 418 }, dien: { x: 452, y: 500 }, khaosat: { x: 770, y: 496 } };")
s = s.replace("const nm = { lab:'Xưởng lắp tế bào', dien:'Trạm điện khu phố' }[chonGame] || 'Xưởng lắp tế bào';",
              "const nm = { lab:'Xưởng lắp tế bào', dien:'Trạm điện khu phố', khaosat:'Lều đoàn khảo sát' }[chonGame] || 'Xưởng lắp tế bào';")
s = s.replace("gardenWalkTo(d.x, d.y, () => which === 'dien' ? goDien() : goPlay());",
              "gardenWalkTo(d.x, d.y, () => which === 'dien' ? goDien() : which === 'khaosat' ? goKhaoSat() : goPlay());")
s = s.replace("w === 'dien' ? goDien() : goPlay();",
              "w === 'dien' ? goDien() : w === 'khaosat' ? goKhaoSat() : goPlay();")

# ═══ 3. CSS ═══
s = s.replace("  /* bảng lý thuyết của trạm điện",
"""  /* ───── 4 · ĐOÀN KHẢO SÁT ───── */
  #scr-khaosat{gap:8px;padding:10px 12px 12px}
  #scr-khaosat .stagebox{flex:1;min-height:0;display:flex;gap:10px;position:relative}
  #kleft{flex:none;width:330px;overflow-y:auto;display:flex;flex-direction:column;gap:10px}
  .kcard{background:var(--card);border:2.5px solid var(--ink);border-radius:14px;box-shadow:var(--sh);padding:12px 14px}
  .kcard h4{margin:0 0 8px;font-size:12.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--muted)}
  .klayer{display:flex;align-items:center;gap:9px;width:100%;font:inherit;font-weight:700;font-size:14px;
    background:#f6f1e4;border:2.5px solid var(--line);border-radius:10px;padding:8px 11px;cursor:pointer;
    margin-bottom:7px;text-align:left;color:var(--ink);transition:.15s}
  .klayer[aria-pressed="true"]{background:#eef6ff;border-color:#2f6fbf}
  .klayer .dot{width:16px;height:16px;border-radius:5px;flex:none;border:2px solid var(--ink)}
  .kclue{width:100%;font:inherit;text-align:left;background:#fff8ec;border:2.5px dashed #c9a86a;
    border-radius:10px;padding:10px 12px;margin-bottom:7px;cursor:pointer;font-weight:700;font-size:13.5px;color:var(--ink)}
  .kclue.open{border-style:solid;background:#fffdf6;cursor:default;font-weight:600}
  .kclue.open b{display:block;font-size:12px;color:#a2792a;letter-spacing:.05em;margin-bottom:2px}
  #kmapwrap{flex:1;min-width:0;display:grid;place-items:center}
  #kmap{width:100%;height:100%;max-width:1100px}
  .kcell{cursor:pointer}
  .kcell:hover .kcell-bg{stroke:#2f6fbf;stroke-width:3.5}
  #ktheory{display:none;flex:none;width:360px;overflow-y:auto;background:var(--card);
    border:3px solid var(--ink);border-radius:16px;box-shadow:var(--sh);padding:14px 16px 16px}
  #scr-khaosat.done-mode #ktheory{display:block;animation:slidein .35s ease}
  #scr-khaosat.done-mode #kleft{display:none}
  @media (max-width:760px){
    #scr-khaosat .stagebox{flex-direction:column}
    #kleft{width:auto;max-height:34vh}
    #ktheory{width:auto;max-height:50vh}
  }
  /* bảng lý thuyết của trạm điện""")

# ═══ 4. HTML section (chèn trước #ghost) ═══
s = s.replace('<svg id="ghost"', '''<!-- ════════ 4 · ĐOÀN KHẢO SÁT ════════ -->
<section id="scr-khaosat" class="screen">
  <div class="topbar">
    <button class="btn ghost" onclick="UI.goGarden()">← Khu vườn</button>
    <h1 class="stick" style="transform:rotate(-1deg)">🗺️ Đoàn khảo sát</h1>
    <div class="sp"></div>
    <div class="tally" title="Ngày công còn lại của mùa khảo sát">
      <span style="font-weight:700;font-size:13px;color:var(--muted)">NGÀY CÔNG</span>
      <b id="kdays">12</b>
    </div>
    <button class="btn warn" id="kbtnReset">Mùa mới</button>
  </div>

  <div class="stagebox">
    <div id="kleft">
      <div class="kcard">
        <h4>Nhiệm vụ</h4>
        <p style="margin:0;font-size:14px;line-height:1.55">Tìm đúng <b>một ô đất</b> để dựng trạm đo mưa.
        Mở manh mối để biết trạm cần gì, bật lớp bản đồ để nhìn, rồi <b>chạm vào ô</b> cho đoàn đi tới cắm cờ.
        Đi tới đâu tốn ngày công tới đó — cắm bừa là đoàn lặn lội công cốc.</p>
      </div>
      <div class="kcard">
        <h4>Lớp bản đồ — bật để nhìn</h4>
        <div id="klayers"></div>
      </div>
      <div class="kcard">
        <h4>Manh mối — mở một cái tốn 2 ngày công</h4>
        <div id="kclues"></div>
      </div>
    </div>

    <div id="kmapwrap">
      <svg id="kmap" viewBox="0 0 900 640" preserveAspectRatio="xMidYMid meet" aria-label="Bản đồ vùng khảo sát"></svg>
    </div>

    <aside id="ktheory">
      <div class="hd" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px">
        <span style="background:var(--green);color:#fff;border:2.5px solid var(--ink);border-radius:9px;padding:2px 9px;font-size:12.5px;font-weight:800">✓ Trạm đã dựng</span>
        <h3 style="margin:0;font-size:18px">Vừa rồi là chuyện gì</h3>
      </div>
      <p style="color:var(--muted);font-size:13.5px;margin-bottom:12px">Đoàn dùng hết <b id="kthDays">—</b> ngày công cho mùa này.</p>
      <div style="display:flex;gap:9px;align-items:flex-start;background:#fff8ec;border:2.5px solid var(--ink);border-radius:12px;padding:10px 12px;margin-bottom:10px">
        <svg width="34" height="34" viewBox="0 0 52 52"><circle cx="26" cy="30" r="17" fill="#ffd9b0" stroke="#3a2e24" stroke-width="3"/><ellipse cx="26" cy="15" rx="19" ry="7" fill="#7ea45c" stroke="#3a2e24" stroke-width="3"/><path d="M14 15q2-10 12-10t12 10Z" fill="#8fb56d" stroke="#3a2e24" stroke-width="3"/><circle cx="20" cy="30" r="2.4" fill="#3a2e24"/><circle cx="32" cy="30" r="2.4" fill="#3a2e24"/><path d="M18 38q8 6 16 0" stroke="#3a2e24" stroke-width="2.6" fill="none" stroke-linecap="round"/></svg>
        <p style="margin:0;font-size:14px"><b style="display:block;font-size:11.5px;letter-spacing:.04em;color:#5f7a3f;margin-bottom:1px">CÔ TRƯỞNG ĐOÀN</b>
        Bản đồ không vẽ mọi thứ chồng lên nhau — nó tách thành từng <b>lớp</b>: địa hình một lớp, sông một lớp, rừng một lớp.
        Đọc từng lớp rồi ghép lại trong đầu, mình khoanh được chỗ cần tìm mà chưa tốn một bước chân.</p>
      </div>
      <h4 style="margin:14px 0 6px;font-size:13px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--muted)">Vì sao trạm đo mưa kén chỗ</h4>
      <div style="display:flex;flex-direction:column;gap:5px;margin-bottom:10px">
        <div style="display:flex;gap:7px;font-size:13.5px;padding:6px 9px;border-radius:9px;background:#f6f1e4"><b>Trên đồi</b>&nbsp;— thoáng gió, không bị ngập như đồng bằng, không khuất như chân núi</div>
        <div style="display:flex;gap:7px;font-size:13.5px;padding:6px 9px;border-radius:9px;background:#f6f1e4"><b>Kề sông</b>&nbsp;— người trực trạm cần nước dùng quanh năm</div>
        <div style="display:flex;gap:7px;font-size:13.5px;padding:6px 9px;border-radius:9px;background:#f6f1e4"><b>Xa rừng rậm</b>&nbsp;— tán cây hứng bớt mưa, số đo bị lệch</div>
      </div>
      <h4 style="margin:14px 0 6px;font-size:13px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--muted)">Trong sách viết thế nào</h4>
      <div style="border:2.5px solid var(--ink);border-radius:12px;padding:11px 13px;background:#fdfaf1">
        <p style="margin:0 0 8px;font-size:14px;line-height:1.6">… Muốn đọc được bản đồ, trước hết phải đọc <mark style="background:#ffe9a8;padding:0 3px;border-radius:4px;font-weight:700">bảng chú giải</mark> để biết từng
        <mark style="background:#ffe9a8;padding:0 3px;border-radius:4px;font-weight:700">kí hiệu</mark> thể hiện đối tượng nào: vùng núi, đồi, đồng bằng, sông ngòi, rừng cây …
        Cùng một vùng đất có thể được thể hiện bằng nhiều <mark style="background:#ffe9a8;padding:0 3px;border-radius:4px;font-weight:700">lớp thông tin</mark> khác nhau …</p>
        <p style="margin:0;font-size:12px;color:var(--muted);font-weight:600">Địa lý 6 — Bài Kí hiệu và bảng chú giải bản đồ, trang 108</p>
      </div>
      <div style="display:flex;gap:9px;align-items:flex-start;background:#eef6ff;border:2.5px solid #2f6fbf;border-radius:12px;padding:10px 12px;margin-top:12px">
        <svg width="34" height="38" viewBox="0 0 46 52" id="kmamFace"></svg>
        <p style="margin:0;font-size:14px"><b style="display:block;font-size:11.5px;letter-spacing:.04em;color:#2f6fbf;margin-bottom:1px">MẦM</b><span id="kthMam">À, hoá ra dò trên bản đồ trước rẻ hơn đi bộ ngoài đời nhiều. Lần này mình hết bị mỏi chân!</span></p>
      </div>
      <div style="display:flex;align-items:center;gap:10px;background:#eef9f1;border:2.5px solid var(--green);border-radius:12px;padding:10px 12px;margin-top:12px;font-size:13.5px;font-weight:600">
        <svg width="30" height="34" viewBox="0 0 46 52" id="kmamGrow"></svg>
        <span>Mầm ra thêm một lá — giờ đang ở mức <b id="kthStage">—</b>.</span>
      </div>
      <div style="display:flex;gap:9px;margin-top:14px;flex-wrap:wrap">
        <button class="btn" style="flex:1;min-width:120px" onclick="UI.kReplay()">Mùa mới (chỗ khác)</button>
        <button class="btn go" style="flex:1;min-width:120px" onclick="UI.kToMap()">Về khu vườn →</button>
      </div>
    </aside>
  </div>

  <div class="stagewrap" style="position:absolute;left:0;right:0;bottom:0;height:0">
    <div class="foreman" style="bottom:14px">
      <svg class="face" width="52" height="52" viewBox="0 0 52 52">
        <circle cx="26" cy="30" r="17" fill="#ffd9b0" stroke="#3a2e24" stroke-width="3"/>
        <ellipse cx="26" cy="15" rx="19" ry="7" fill="#7ea45c" stroke="#3a2e24" stroke-width="3"/>
        <path d="M14 15q2-10 12-10t12 10Z" fill="#8fb56d" stroke="#3a2e24" stroke-width="3"/>
        <circle cx="20" cy="30" r="2.4" fill="#3a2e24"/><circle cx="32" cy="30" r="2.4" fill="#3a2e24"/>
        <path d="M18 38q8 6 16 0" stroke="#3a2e24" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      </svg>
      <div class="bubble" id="kbubble"><span class="who" style="color:#5f7a3f">CÔ TRƯỞNG ĐOÀN</span><span id="kbubbleTxt">…</span></div>
    </div>
    <div class="mam" style="bottom:14px">
      <svg class="face" id="kmamFace2" width="46" height="52" viewBox="0 0 46 52"></svg>
      <div class="bubble quiet" id="kmamBubble"><span class="who">MẦM</span><span id="kmamTxt"></span></div>
    </div>
  </div>
</section>

<svg id="ghost"''')

io.open(p, 'w', encoding='utf-8').write(s)
print('khaosat markup+css in, size', len(s))
