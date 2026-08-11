
'use strict';
const SIM = (function(){
  const SUB = 1/120;              // bước con cố định
  const SPAWN_PERIOD = 1.6;       // nhân sinh kiện mỗi 1,6s
  const SEG_DUR = 1.7;            // thời gian đi hết một đoạn băng
  const TRANSFORM_T = 0.6;        // thời gian trạm biến đổi một kiện
  const ATP_PERIOD = 0.9;         // nhịp tia chớp (chỉ để vẽ)
  const LYSO_KILL = 1.5;          // lysosome sát nhân → nhân chết sau 1,5s
  const LYSO_HEAL = 1.0;          // gỡ ra → nhân hồi sau 1s
  const MAX_LIVE = 9;             // trần kiện đang sống (ứ tới tận nguồn)
  const WIN = 8;                  // đơn hàng: 8 kiện xuất xưởng

  const PADS = ['P1','P2','P3','P4','S1','S2'];
  const BELT = ['P1','P2','P3','P4'];        // node 1..4; node 0 = NHÂN, node 5 = CỬA
  const POWER_PAD = 'S1';
  const NEAR_NUCLEUS = 'S2';

  // HAI LỚP TÊN: `ten` là tên nghề trong xưởng (chữ to, hiểu ngay phải làm gì),
  // `sach` là tên trong sách Sinh học (chữ nhỏ, để vẫn nhớ được từ đúng).
  const KINDS = {
    marn: 'bản thiết kế',  tho: 'hàng thô',
    gap : 'hàng đã gấp',   goi: 'kiện đã đóng'
  };
  const KINDS_SACH = {
    marn: 'mARN',              tho: 'chuỗi protein thô',
    gap : 'protein đã gấp',    goi: 'protein đã đóng gói'
  };

  const ORGS = {
    ribo : { ten:'Máy đọc bản thiết kế', sach:'Ribosome',
             lam:'Đọc bản thiết kế từ nhân, làm ra hàng thô.',
             vao:'marn', ra:'tho', atp:true  },
    lnc  : { ten:'Xưởng gấp hàng',       sach:'Lưới nội chất hạt',
             lam:'Gấp hàng thô lại cho đúng hình.',
             vao:'tho',  ra:'gap', atp:false },
    golgi: { ten:'Xưởng đóng gói',       sach:'Bộ máy Golgi',
             lam:'Đóng hàng đã gấp thành kiện.',
             vao:'gap',  ra:'goi', atp:true  },
    tuiti: { ten:'Xe chở hàng',          sach:'Túi tiết',
             lam:'Chở kiện ra cửa xuất hàng.',
             vao:'goi',  ra:'goi', atp:false },
    tithe: { ten:'Máy phát điện',        sach:'Ti thể',
             lam:'Làm ra điện cho những máy cần điện.',
             vao:null,   ra:null,  atp:false, power:true,
             hint:'Máy này phải cắm vào ổ điện, để chỗ khác thì không ra điện.' },
    lyso : { ten:'Thùng enzyme',         sach:'Lysosome',
             lam:'Đựng nước tiêu hoá, dùng để dọn rác trong tế bào.',
             vao:null,   ra:null,  atp:false,
             hint:'Đặt sát vách nhân thì nước trong thùng ăn mất cái nhân.' },
    lucla: { ten:'Máy hứng nắng',        sach:'Lục lạp',
             lam:'Hứng nắng làm ra đường. Chỉ nhà cây mới có máy này.',
             vao:null,   ra:null,  atp:false,
             hint:'Xưởng mình là tế bào động vật nên máy này để đó cũng không chạy.' }
  };

  function create(){
    return {
      t: 0, runT: 0, running: false, done: false,
      pads: { P1:null, P2:null, P3:null, P4:null, S1:null, S2:null },
      parcels: [],                // {id, kind, seg, pos, phase:'move'|'queue'|'transform', tt}
      nextId: 1,
      spawnTimer: 0, atpTimer: 0,
      out: 0,
      nucleusAlive: true, lysoTimer: 0, healTimer: 0,
      events: []                  // sự kiện 1 lần cho UI: {type, ...}
    };
  }

  const powered = s => s.pads[POWER_PAD] === 'tithe';

  // Trạm ở node cuối đoạn seg (seg 0→pad P1 ... seg 3→pad P4; seg 4 → CỬA)
  const padAtSeg = seg => seg < 4 ? BELT[seg] : null;

  function canProcess(s, pad, kind){
    const org = ORGS[s.pads[pad]];
    if (!org || org.vao !== kind) return false;
    if (org.atp && !powered(s)) return false;
    return true;
  }
  const busy = (s, pad) => s.parcels.some(p => p.phase === 'transform' && padAtSeg(p.seg) === pad);
  const queueAt = (s, pad) => s.parcels.filter(p => p.phase === 'queue' && padAtSeg(p.seg) === pad);

  function place(s, pad, org){
    if (!PADS.includes(pad) || !ORGS[org] || s.pads[pad]) return false;
    if (Object.values(s.pads).includes(org)) return false;
    s.pads[pad] = org;
    s.events.push({ type:'place', pad, org });
    if (org === 'lyso' && pad === NEAR_NUCLEUS){ s.lysoTimer = 0; s.events.push({ type:'lyso-warn' }); }
    if (org === 'lucla') s.events.push({ type:'lucla' });
    if (org === 'tithe' && pad !== POWER_PAD) s.events.push({ type:'tithe-misplug', pad });
    return true;
  }

  function remove(s, pad){
    const org = s.pads[pad];
    if (!org) return null;
    s.pads[pad] = null;
    // kiện đang biến đổi tại trạm vừa gỡ → trả về hàng chờ, tuyệt đối không
    // để nhánh transform đọc ORGS[null] (sập vòng mô phỏng)
    for (const p of s.parcels){
      if (p.phase === 'transform' && padAtSeg(p.seg) === pad){ p.phase = 'queue'; p.tt = 0; }
    }
    s.events.push({ type:'remove', pad, org });
    if (org === 'lyso' && pad === NEAR_NUCLEUS && !s.nucleusAlive) s.healTimer = 0;
    return org;
  }

  function setRun(s, on){ s.running = !!on; }

  function substep(s){
    const dt = SUB;
    s.t += dt;

    // nhân: chết / hồi
    if (s.pads[NEAR_NUCLEUS] === 'lyso' && s.nucleusAlive){
      s.lysoTimer += dt;
      if (s.lysoTimer >= LYSO_KILL){ s.nucleusAlive = false; s.events.push({ type:'nucleus-dead' }); }
    }
    if (s.pads[NEAR_NUCLEUS] !== 'lyso' && !s.nucleusAlive){
      s.healTimer += dt;
      if (s.healTimer >= LYSO_HEAL){ s.nucleusAlive = true; s.events.push({ type:'nucleus-heal' }); }
    }

    if (!s.running) return;
    if (!s.done) s.runT += dt;    // thời gian ca làm việc; đủ đơn thì đồng hồ đứng lại

    // sinh kiện
    if (s.nucleusAlive && !s.done){
      s.spawnTimer += dt;
      if (s.spawnTimer >= SPAWN_PERIOD){
        if (s.parcels.length < MAX_LIVE){
          s.spawnTimer -= SPAWN_PERIOD;
          s.parcels.push({ id: s.nextId++, kind:'marn', seg:0, pos:0, phase:'move', tt:0 });
          s.events.push({ type:'spawn' });
        } else s.spawnTimer = SPAWN_PERIOD;   // ứ tới nguồn: chờ, không dồn xung
      }
    }

    // nhịp ATP (để vẽ tia)
    if (powered(s)){ s.atpTimer += dt; if (s.atpTimer >= ATP_PERIOD){ s.atpTimer -= ATP_PERIOD; s.events.push({ type:'atp' }); } }

    // kiện chuyển động / biến đổi
    for (const p of s.parcels){
      if (p.phase === 'move'){
        p.pos += dt / SEG_DUR;
        if (p.pos >= 1){
          p.pos = 1;
          const pad = padAtSeg(p.seg);
          if (pad === null){                        // tới CỬA
            p.phase = 'exit';
          } else if (canProcess(s, pad, p.kind) && !busy(s, pad) && queueAt(s, pad).length === 0){
            p.phase = 'transform'; p.tt = TRANSFORM_T;
          } else {
            p.phase = 'queue';
            s.events.push({ type:'jam', pad, n: queueAt(s, pad).length });
          }
        }
      } else if (p.phase === 'transform'){
        const pad = padAtSeg(p.seg);
        const org = ORGS[s.pads[pad]];
        if (!org){ p.phase = 'queue'; p.tt = 0; continue; }   // trạm biến mất giữa chừng
        if (org.atp && !powered(s)) continue;                  // mất điện: máy đứng, kiện chờ trong máy
        p.tt -= dt;
        if (p.tt <= 0){
          p.kind = org.ra;
          p.phase = 'move'; p.seg += 1; p.pos = 0;
        }
      }
    }

    // xuất xưởng
    const exiting = s.parcels.filter(p => p.phase === 'exit');
    if (exiting.length){
      s.parcels = s.parcels.filter(p => p.phase !== 'exit');
      // Đủ đơn rồi thì KHÔNG dừng băng chuyền — người học cần vừa đọc lý thuyết
      // vừa nhìn dây chuyền chạy. Chỉ ngừng đếm đơn để không hiện "13/8".
      for (const _ of exiting){
        if (!s.done){
          s.out += 1;
          s.events.push({ type:'exit', out: s.out });
          if (s.out >= WIN){ s.done = true; s.events.push({ type:'win' }); }
        } else {
          s.events.push({ type:'exit-extra' });
        }
      }
    }

    // giải phóng hàng chờ: mỗi pad cho kiện đầu hàng vào máy nếu rảnh
    for (const pad of BELT){
      if (busy(s, pad)) continue;
      const q = queueAt(s, pad);
      if (q.length && canProcess(s, pad, q[0].kind)){
        q[0].phase = 'transform'; q[0].tt = TRANSFORM_T;
      }
    }
  }

  function step(s, secs){
    // __step(0) phải là "vẽ lại, không tiến thời gian" theo contract
    const n = Math.round(secs / SUB);
    for (let i = 0; i < n; i++) substep(s);
  }

  function snapshot(s){
    const queues = {};
    for (const pad of BELT) queues[pad] = queueAt(s, pad).length;
    return {
      t: +s.t.toFixed(4), runT: +s.runT.toFixed(4), running: s.running, done: s.done, out: s.out,
      pads: { ...s.pads }, powered: powered(s), nucleusAlive: s.nucleusAlive,
      parcels: s.parcels.map(p => ({ id:p.id, kind:p.kind, seg:p.seg, pos:+p.pos.toFixed(4), phase:p.phase, tt:+(p.tt||0).toFixed(4) })),
      queues, win: WIN
    };
  }

  const drainEvents = s => s.events.splice(0);

  return { create, place, remove, setRun, step, snapshot, drainEvents,
           ORGS, KINDS, KINDS_SACH, PADS, BELT, POWER_PAD, NEAR_NUCLEUS, WIN, SUB,
           SPAWN_PERIOD, SEG_DUR, TRANSFORM_T };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = SIM;

/* ─────────────────────────────────────────────────────────────
   SIM MẠCH ĐIỆN — thuần, không DOM. Dùng cho game Trạm điện khu phố.
   Nguồn → cầu dao tổng → 3 nhánh (cầu dao nhánh → cầu chì → mối nối → 2 nhà).
   Mỗi ca hỏng đúng MỘT linh kiện (cầu chì hoặc mối nối), xoay vòng theo số ca.
   Không có khái niệm "sai": mọi thao tác chỉ đổi trạng thái, điện tự lan.
   ───────────────────────────────────────────────────────────── */
const CIRCUIT = (function(){
  const BRANCHES = ['A', 'B', 'C'];
  // các linh kiện có thể hỏng, xoay vòng để mỗi lần chơi lại một bệnh khác
  const FAULTS = ['fuseB', 'jointC', 'fuseA', 'jointA', 'fuseC', 'jointB'];
  const SPARES0 = { fuse: 2, wire: 2 };   // đồ dự phòng mang theo

  function create(attempt){
    const fault = FAULTS[(attempt || 0) % FAULTS.length];
    const s = {
      fault,                                   // linh kiện đang hỏng (giấu với người chơi)
      main: true,                              // cầu dao tổng
      br: { A: true, B: true, C: true },       // cầu dao nhánh
      ok: {},                                  // tình trạng linh kiện
      spares: { ...SPARES0 },
      zaps: 0,                                 // số lần quên ngắt điện bị giật
      probes: 0, swaps: 0,
      events: []
    };
    for (const b of BRANCHES){ s.ok['fuse' + b] = true; s.ok['joint' + b] = true; }
    s.ok[fault] = false;
    return s;
  }

  // điện có tới ĐIỂM ĐO không — các điểm: 'nguon', 'sauMain', 'sauBr:X', 'sauFuse:X', 'sauJoint:X'
  function powered(s, point){
    if (point === 'nguon') return true;
    if (!s.main) return false;
    if (point === 'sauMain') return true;
    const [k, b] = point.split(':');
    if (!s.br[b]) return false;
    if (k === 'sauBr') return true;
    if (!s.ok['fuse' + b]) return false;
    if (k === 'sauFuse') return true;
    if (!s.ok['joint' + b]) return false;
    return true;                              // sauJoint — tới tận nhà
  }
  const houseLit = (s, b) => powered(s, 'sauJoint:' + b);
  const litCount = s => BRANCHES.reduce((n, b) => n + (houseLit(s, b) ? 2 : 0), 0);

  function toggleMain(s){ s.main = !s.main; s.events.push({ type:'main', on: s.main }); }
  function toggleBranch(s, b){ s.br[b] = !s.br[b]; s.events.push({ type:'branch', b, on: s.br[b] }); }

  function probe(s, point){
    s.probes += 1;
    const on = powered(s, point);
    s.events.push({ type:'probe', point, on });
    return on;
  }

  // thay linh kiện: PHẢI ngắt cầu dao nhánh trước — còn điện là bị giật (không hỏng gì thêm,
  // nhưng người chơi thấy hậu quả và bác thợ nhắc an toàn)
  function swap(s, comp){
    const b = comp.slice(-1);
    const kind = comp.startsWith('fuse') ? 'fuse' : 'wire';
    if (s.br[b] && s.main){ s.zaps += 1; s.events.push({ type:'zap', comp }); return { zap:true }; }
    if (s.spares[kind] <= 0){ s.events.push({ type:'no-spare', kind }); return { empty:true }; }
    s.spares[kind] -= 1; s.swaps += 1;
    const wasBroken = !s.ok[comp];
    s.ok[comp] = true;                        // đồ mới thì lành — thay nhầm chỗ chỉ tốn đồ
    s.events.push({ type:'swap', comp, fixed: wasBroken });
    return { fixed: wasBroken };
  }

  const win = s => s.main && BRANCHES.every(b => s.br[b] && houseLit(s, b));

  function snapshot(s){
    const houses = {};
    for (const b of BRANCHES) houses[b] = houseLit(s, b);
    return {
      main: s.main, br: { ...s.br }, houses, lit: litCount(s),
      spares: { ...s.spares }, zaps: s.zaps, probes: s.probes, swaps: s.swaps,
      win: win(s)
    };
  }
  const drainEvents = s => s.events.splice(0);

  return { create, powered, probe, swap, toggleMain, toggleBranch, snapshot, drainEvents,
           BRANCHES, FAULTS };
})();
if (typeof module !== 'undefined' && module.exports) module.exports.CIRCUIT = CIRCUIT;

