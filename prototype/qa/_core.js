
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

  const KINDS = { marn:'mARN', tho:'chuỗi protein thô', gap:'protein đã gấp', goi:'kiện protein đóng gói' };

  const ORGS = {
    ribo : { ten:'Ribosome',          lam:'Đọc mARN, lắp thành chuỗi protein',      vao:'marn', ra:'tho', atp:true  },
    lnc  : { ten:'Lưới nội chất hạt', lam:'Gấp chuỗi protein cho đúng hình dạng',   vao:'tho',  ra:'gap', atp:false },
    golgi: { ten:'Bộ máy Golgi',      lam:'Đóng gói protein thành kiện',            vao:'gap',  ra:'goi', atp:true  },
    tuiti: { ten:'Túi tiết',          lam:'Chở kiện protein ra cửa xuất',           vao:'goi',  ra:'goi', atp:false },
    tithe: { ten:'Ti thể',            lam:'Nhà máy điện — phát năng lượng ATP',     vao:null,   ra:null,  atp:false, power:true,
             hint:'Cắm vào Ô NGUỒN có dây điện thì mới cấp điện được.' },
    lyso : { ten:'Lysosome',          lam:'Túi enzyme tiêu hoá, dọn rác trong tế bào', vao:null, ra:null, atp:false,
             hint:'Kê sát nhân là enzyme tiêu luôn cái nhân.' },
    lucla: { ten:'Lục lạp',           lam:'Quang hợp — chỉ tế bào thực vật mới có', vao:null,   ra:null,  atp:false,
             hint:'Xưởng mình là tế bào động vật, nó không giúp gì đâu.' }
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
    s.runT += dt;                 // thời gian ca làm việc thật (nguồn cho màn chốt)

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
      for (const _ of exiting){
        s.out += 1;
        s.events.push({ type:'exit', out: s.out });
        if (s.out >= WIN && !s.done){
          s.done = true;
          s.running = false;               // hết ca: dừng cả dây chuyền, không đếm lố đơn
          s.events.push({ type:'win' });
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
           ORGS, KINDS, PADS, BELT, POWER_PAD, NEAR_NUCLEUS, WIN, SUB,
           SPAWN_PERIOD, SEG_DUR, TRANSFORM_T };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = SIM;
