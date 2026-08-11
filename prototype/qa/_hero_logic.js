  /* ── Kho câu hỏi: 4 môn, thẻ nào có game thì vào được ── */
  const TOPICS = [
    { mon:'Sinh học', hoi:'Làm sao tế bào biết phải làm việc gì?', lop:'Sinh học 10', game:true },
    { mon:'Sinh học', hoi:'Cây ăn gì để sống?',                    lop:'Sinh học 11' },
    { mon:'Sinh học', hoi:'Vì sao tim đập cả đời không nghỉ?',      lop:'Sinh học 8' },
    { mon:'Sinh học', hoi:'Vi khuẩn bé cỡ nào mà làm mình ốm?',     lop:'Sinh học 10' },
    { mon:'Vật lý',   hoi:'Điện trong nhà chạy từ đâu tới?',        lop:'KHTN 8' },
    { mon:'Vật lý',   hoi:'Nam châm hút được những thứ gì?',        lop:'KHTN 7' },
    { mon:'Vật lý',   hoi:'Cầu vồng từ đâu ra?',                    lop:'KHTN 9' },
    { mon:'Hóa học',  hoi:'Muối tan đi đâu trong cốc nước?',        lop:'KHTN 8' },
    { mon:'Hóa học',  hoi:'Lửa ăn gì mà cháy mãi?',                 lop:'KHTN 8' },
    { mon:'Địa lý',   hoi:'Núi lửa phun vì cái gì?',                lop:'Địa lý 10' },
    { mon:'Địa lý',   hoi:'Mưa từ đâu rơi xuống?',                  lop:'Địa lý 6' }
  ];
  // mỗi môn một bộ đồ cho Mầm + một màu nền
  const MON_KIT = {
    'Sinh học': { bg:'#3d9e6b', ghost:'SINH HỌC', do:'blouse' },
    'Vật lý'  : { bg:'#3a7fd0', ghost:'VẬT LÝ',   do:'mubaoho' },
    'Hóa học' : { bg:'#c9508f', ghost:'HÓA HỌC',  do:'kinhbaoho' },
    'Địa lý'  : { bg:'#d1701f', ghost:'ĐỊA LÝ',   do:'muco' }
  };

  /* Mầm cỡ lớn cho màn chọn — có thân người, đổi trang phục theo môn.
     Vẽ trong hộp 100×160, giữ đúng nét paper-craft của Mầm nhỏ trong game. */
  const OUTFIT = {
    blouse:
      '<path d="M28 96h44l7 46H21Z" fill="#fdfbf4" stroke="#12324f" stroke-width="3.4"/>' +
      '<path d="M50 96v46" stroke="#12324f" stroke-width="2.6"/>' +
      '<rect x="59" y="116" width="14" height="11" rx="2.6" fill="#cfe7ee" stroke="#12324f" stroke-width="2.6"/>',
    mubaoho:
      '<path d="M28 96h44l7 46H21Z" fill="#ffd97a" stroke="#12324f" stroke-width="3.4"/>' +
      '<path d="M22 26q28-20 56 0l-4 7H26Z" fill="#f2b722" stroke="#12324f" stroke-width="3.4"/>' +
      '<rect x="44" y="15" width="12" height="10" rx="3" fill="#f2b722" stroke="#12324f" stroke-width="3"/>',
    kinhbaoho:
      '<path d="M28 96h44l7 46H21Z" fill="#fdfbf4" stroke="#12324f" stroke-width="3.4"/>' +
      '<rect x="25" y="51" width="50" height="20" rx="9" fill="#bfe8f5" opacity=".72" stroke="#12324f" stroke-width="3"/>' +
      '<path d="M25 61h-6M75 61h6" stroke="#12324f" stroke-width="3" stroke-linecap="round"/>',
    muco:
      '<path d="M28 96h44l7 46H21Z" fill="#e8dcc0" stroke="#12324f" stroke-width="3.4"/>' +
      '<ellipse cx="50" cy="30" rx="39" ry="11" fill="#e3c98d" stroke="#12324f" stroke-width="3.4"/>' +
      '<path d="M32 30q4-18 18-18t18 18Z" fill="#eed9a6" stroke="#12324f" stroke-width="3.4"/>'
  };

  function mamBig(kit){
    return '<svg viewBox="0 0 100 160" aria-hidden="true">' +
      '<ellipse cx="50" cy="152" rx="30" ry="7" fill="rgba(20,14,8,.22)"/>' +
      '<path d="M44 132h5v20h-5ZM53 132h5v20h-5Z" fill="#4a6b86" stroke="#12324f" stroke-width="3"/>' +
      '<path d="M35 147h18v7H35ZM48 147h18v7H48Z" fill="#2a4a63" stroke="#12324f" stroke-width="3"/>' +
      OUTFIT[kit.do] +
      '<path d="M28 100q-11 12-9 27" fill="none" stroke="#12324f" stroke-width="3.4" stroke-linecap="round"/>' +
      '<path d="M72 100q11 12 9 27" fill="none" stroke="#12324f" stroke-width="3.4" stroke-linecap="round"/>' +
      '<path d="M50 40q-19-2-23-17 17-6 23 8Z" fill="#7ec96a" stroke="#1d5a2e" stroke-width="3"/>' +
      '<path d="M50 40q19-2 23-17-17-6-23 8Z" fill="#7ec96a" stroke="#1d5a2e" stroke-width="3"/>' +
      '<circle cx="50" cy="70" r="31" fill="#4a9df0" stroke="#12324f" stroke-width="3.6"/>' +
      '<ellipse cx="50" cy="72" rx="22" ry="23" fill="#fdfbf4" stroke="#12324f" stroke-width="3"/>' +
      '<circle cx="40" cy="68" r="10" fill="none" stroke="#12324f" stroke-width="2.8"/>' +
      '<circle cx="60" cy="68" r="10" fill="none" stroke="#12324f" stroke-width="2.8"/>' +
      '<circle cx="40" cy="68" r="4.4" fill="#12324f"/><circle cx="60" cy="68" r="4.4" fill="#12324f"/>' +
      '<path d="M42 85q8 8 16 0q-8 5-16 0Z" fill="#e8657f" stroke="#12324f" stroke-width="2.6"/>' +
      '<path d="M38 96l12 12 12-12q-12 6-24 0Z" fill="#e4453c" stroke="#12324f" stroke-width="2.8"/>' +
      '</svg>';
  }

  let curMon = 'Tất cả', heroIdx = 0, heroBusy = false;
  const heroList = () => TOPICS.map((t, i) => ({ ...t, i }))
    .filter(t => curMon === 'Tất cả' || t.mon === curMon);

  function pickSubject(mon){ curMon = mon; heroIdx = 0; renderTopics(); }

  function heroNav(dir){
    if (heroBusy) return;
    const n = heroList().length;
    if (n < 2) return;
    heroBusy = true;
    heroIdx = (heroIdx + (dir === 'next' ? 1 : n - 1)) % n;
    paintHero();
    setTimeout(function(){ heroBusy = false; }, 660);
  }
  function heroJump(k){ if (heroBusy || k === heroIdx) return; heroIdx = k; paintHero(); }

  function renderTopics(){
    const list = heroList();
    const subs = ['Tất cả'].concat([...new Set(TOPICS.map(t => t.mon))]);
    $('#hero-subs').innerHTML = subs.map(m =>
      '<button type="button" aria-pressed="' + (m === curMon) + '" onclick="UI.pickSubject(\'' + m + '\')">' + m + '</button>'
    ).join('');
    $('#hero-stage').innerHTML = list.map((t, k) =>
      '<div class="figure" data-k="' + k + '">' + mamBig(MON_KIT[t.mon]) + '</div>').join('');
    $('#hero-strip').innerHTML = list.map((t, k) =>
      '<button type="button" role="tab" aria-current="' + (k === heroIdx) + '"' +
      ' aria-label="' + t.hoi + (t.game ? '' : ' — chưa mở') + '" onclick="UI.heroJump(' + k + ')">' +
      mamBig(MON_KIT[t.mon]) + '<small>' + (t.game ? t.mon : '🔒 ' + t.mon) + '</small></button>').join('');
    paintHero();
  }

  function paintHero(){
    const list = heroList();
    if (!list.length) return;
    const n = list.length;
    if (heroIdx >= n) heroIdx = 0;
    const cur = list[heroIdx], kit = MON_KIT[cur.mon];
    $('#scr-topic').style.setProperty('--hero-bg', kit.bg);
    $('#hero-ghost').textContent = kit.ghost;
    $('#hero-mon').textContent = cur.mon;
    $('#hero-hoi').textContent = cur.hoi;
    $('#hero-lop').textContent = cur.lop;
    $('#hero-lock').textContent = cur.game ? '' : 'Bài này chưa mở — chọn câu khác nhé';
    const go = $('#hero-go');
    go.disabled = !cur.game;
    $('#hero-go-txt').textContent = cur.game ? 'Đi thôi' : 'Chưa mở';
    go.onclick = cur.game ? function(){ goGarden(); } : null;
    const L = (heroIdx + n - 1) % n, R = (heroIdx + 1) % n, B = (heroIdx + 2) % n;
    document.querySelectorAll('#hero-stage .figure').forEach(function(el){
      const k = +el.dataset.k;
      const role = k === heroIdx ? 'center' : k === L ? 'side left' : k === R ? 'side right' : 'back';
      el.className = 'figure ' + role;
      const shown = (k === heroIdx || k === L || k === R || (n > 3 && k === B));
      el.style.opacity = shown ? '' : '0';
      el.style.visibility = shown ? '' : 'hidden';
    });
    const btns = document.querySelectorAll('#hero-strip button');
    btns.forEach(function(b, k){ b.setAttribute('aria-current', k === heroIdx); });
    if (btns[heroIdx]) btns[heroIdx].scrollIntoView({ block:'nearest', inline:'center', behavior:'smooth' });
  }

