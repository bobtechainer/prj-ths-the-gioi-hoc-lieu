
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
