/* Mr MixUp: the rules, kept apart from the screen so they can be tested with
   `node --test tests/*.test.mjs` (no installs needed). Used by app.js as window.MIXUP_LOGIC. */
(() => {
  const root = typeof window !== 'undefined' ? window : globalThis;

  /* ---- number words ---- */
  const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const word = n => n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : '');
  const Word = n => { const w = word(n); return w[0].toUpperCase() + w.slice(1); };
  const countLine = seq => seq.map((n, i) => i ? word(n) : Word(n)).join(', ') + '.';

  /* ---- the name spinner: same rule as Magic Jewels. Each name once before any repeats,
     and anyone not here today is skipped. Returns the name and the pool that's left. ---- */
  const takeName = (pool, roster, rng = Math.random) => {
    if (!roster.length) return { name: null, pool: [] };
    let left = (pool || []).filter(n => roster.includes(n));
    if (!left.length) left = roster.slice();
    const name = left[Math.floor(rng() * left.length)];
    return { name, pool: left.filter(n => n !== name) };
  };

  /* ---- how often Mr MixUp is wrong (Weeks 11+ template only) ---- */
  const rates = {
    rarely: { label: 'Rarely', p: 1 / 5 },
    normal: { label: 'One in three', p: 1 / 3 },
    often:  { label: 'Often', p: 2 / 3 },
  };
  const mixCount = (rate, n) => n ? Math.min(n, Math.max(1, Math.round(n * (rates[rate] || rates.normal).p))) : 0;

  /* ---- making template items ---- */
  const RANGES = { '1-10': [1, 10], '1-20': [1, 20], '1-30': [1, 30], 'teens': [11, 19] };
  const span = key => { const [lo, hi] = RANGES[key] || RANGES['1-20']; return { lo, hi }; };
  const between = (rng, lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));
  const pickFrom = (rng, list) => list[Math.floor(rng() * list.length)];
  const teens = (r, from = 13) => { const out = []; for (let n = Math.max(from, r.lo); n <= Math.min(19, r.hi); n++) out.push(n); return out; };
  const nearMiss = (rng, truth, lo, hi) => {
    const opts = [truth - 1, truth + 1].filter(v => v >= lo && v <= hi);
    return pickFrom(rng, opts);
  };

  /* each maker returns the item with its mix-up, or null if it can't fit the range.
     claim = what Mr MixUp's mix-up says, truth = what's really right (they never match) */
  const MAKERS = {
    countOrder(r, rng) {
      if (r.hi - r.lo < 3) return null;
      const s = between(rng, r.lo, r.hi - 3), truth = [s, s + 1, s + 2, s + 3];
      const claim = [s, s + 2, s + 1, s + 3];
      return { kind: 'Counting order', count: true, say: countLine(claim),
        fix: `${countLine(truth).slice(0, -1)}. ${Word(s + 1)} comes before ${word(s + 2)}.`,
        right: countLine(truth), board: { text: claim.join(', ') }, fixed: { text: truth.join(', ') }, claim, truth };
    },
    skipRepeat(r, rng) {
      if (r.hi - r.lo < 4) return null;
      const s = between(rng, r.lo, r.hi - 4), truth = [s, s + 1, s + 2, s + 3, s + 4];
      const skip = rng() < 0.5;
      const claim = skip ? [s, s + 1, s + 3, s + 4] : [s, s + 1, s + 2, s + 2, s + 3];
      return { kind: skip ? 'Skipped number' : 'Repeated number', count: true, say: countLine(claim),
        fix: `${countLine(truth).slice(0, -1)}. ${Word(s + 2)} ${skip ? 'was missing' : 'only comes once'}.`,
        right: countLine(truth), board: { text: claim.join(', ') }, fixed: { text: truth.join(', ') }, claim, truth };
    },
    teenTy(r, rng) {
      const t = teens(r); if (!t.length) return null;
      const n = pickFrom(rng, t), k = n - 10, ty = k * 10;
      return { kind: 'Teen or ty', say: `${Word(ty)}.`, fix: `${Word(n)}. Ten and ${word(k)}.`, right: `${Word(n)}.`,
        board: { text: String(n) }, fixed: { text: `${n} = 10 and ${k}`, frame: { a: n } }, claim: ty, truth: n };
    },
    digitOrder(r, rng) {
      const t = teens(r, 12); if (!t.length) return null;
      const n = pickFrom(rng, t), k = n - 10, flipped = k * 10 + 1;
      return { kind: 'Digit order', say: `${Word(n)}. I write it like this.`,
        fix: `${Word(n)} is written 1 then ${k}. The 1 means one ten, so it comes first.`,
        right: `${Word(n)}. I write it 1 then ${k}.`,
        board: { text: String(flipped) }, fixed: { text: String(n), frame: { a: n } }, claim: flipped, truth: n };
    },
    reversal(r, rng) {
      const opts = [2, 3, 4, 5, 6, 7, 9].filter(n => n >= r.lo && n <= r.hi); if (!opts.length) return null;
      const n = pickFrom(rng, opts), swap = n === 6 ? 9 : n === 9 ? 6 : null;
      return { kind: 'Numeral reversal', say: `Here are ${word(n)} dots. I write ${word(n)} like this.`,
        fix: `${Word(n)} is written like this. Check which way it faces.`,
        right: `Here are ${word(n)} dots. I write ${word(n)} the right way round.`,
        board: { text: String(swap || n), mirror: !swap, dots: { n } }, fixed: { text: String(n), dots: { n } },
        claim: swap || `mirrored ${n}`, truth: n };
    },
    makeTen(r, rng) {
      const a = between(rng, 1, 9), b = 10 - a, wrongB = nearMiss(rng, b, 0, 10);
      return { kind: 'Partners to 10', say: `${Word(a)} and ${word(wrongB)} make ten.`,
        fix: `${Word(a)} and ${word(b)} make ten.`, right: `${Word(a)} and ${word(b)} make ten.`,
        board: { text: `${a} and ${wrongB} make 10`, frame: { a, b: wrongB } }, fixed: { text: `${a} + ${b} = 10`, frame: { a, b } },
        claim: a + wrongB, truth: 10 };
    },
    takeAway(r, rng) {
      const top = Math.min(r.hi, 20); if (top < 3) return null;
      const a = between(rng, Math.max(3, Math.min(r.lo, top)), top), b = between(rng, 1, a - 1), ans = a - b;
      const wrong = nearMiss(rng, ans, 0, a);
      const dots = a <= 20 ? { n: a, cross: b } : undefined;
      return { kind: 'Take away', say: `${Word(a)} take away ${word(b)} is ${word(wrong)}.`,
        fix: `${Word(a)} take away ${word(b)} is ${word(ans)}.`, right: `${Word(a)} take away ${word(b)} is ${word(ans)}.`,
        board: { text: `${a} − ${b} = ${wrong}`, dots }, fixed: { text: `${a} − ${b} = ${ans}`, dots }, claim: wrong, truth: ans };
    },
    factFamily(r, rng) {
      const top = Math.min(r.hi, 20); if (top < 3) return null;
      const sum = between(rng, 3, top), a = between(rng, 1, sum - 1), b = sum - a;
      const wrong = nearMiss(rng, sum, 2, top + 1);
      const frame = sum <= 20 ? { a, b } : undefined;
      return { kind: 'Plus fact', say: `${Word(a)} plus ${word(b)} is ${word(wrong)}.`,
        fix: `${Word(a)} plus ${word(b)} is ${word(sum)}.`, right: `${Word(a)} plus ${word(b)} is ${word(sum)}.`,
        board: { text: `${a} + ${b} = ${wrong}`, frame }, fixed: { text: `${a} + ${b} = ${sum}`, frame }, claim: wrong, truth: sum };
    },
    smallerFirst(r, rng) {
      const top = Math.min(r.hi, 20); if (top < 4) return null;
      const a = between(rng, Math.max(4, Math.min(r.lo, top)), top), b = between(rng, 1, Math.min(a - 2, 9));
      return { kind: 'Start at the bigger number', say: `${Word(a)} take away ${word(b)}. I start with the ${word(b)}.`,
        fix: `Start with the bigger number, ${word(a)}. ${Word(a)} take away ${word(b)} is ${word(a - b)}.`,
        right: `${Word(a)} take away ${word(b)}. I start with the ${word(a)}. ${Word(a)} take away ${word(b)} is ${word(a - b)}.`,
        board: { text: `${a} − ${b}` }, fixed: { text: `${a} − ${b} = ${a - b}`, dots: a <= 20 ? { n: a, cross: b } : undefined },
        claim: b, truth: a };
    },
    breakApart(r, rng) {
      const t = teens(r); if (!t.length) return null;
      const n = pickFrom(rng, t), k = n - 10, tens = rng() < 0.5;
      const k2 = nearMiss(rng, k, 1, 9);
      return { kind: 'Break apart', say: tens ? `${Word(n)} is one and ${word(k)}.` : `${Word(n)} is ten and ${word(k2)}.`,
        fix: tens ? `${Word(n)} is ten and ${word(k)}. The 1 means one ten.` : `${Word(n)} is ten and ${word(k)}.`,
        right: `${Word(n)} is ten and ${word(k)}.`,
        board: { text: String(n), frame: { a: n } }, fixed: { text: `${n} = 10 and ${k}`, frame: { a: n } },
        claim: tens ? 1 + k : 10 + k2, truth: n };
    },
    countFrom(r, rng) {
      const c = between(rng, 2, 3); if (r.hi - r.lo < c + 1) return null;
      const s = between(rng, r.lo, r.hi - c);
      const wrongSeq = Array.from({ length: c }, (_, i) => s + i), rightSeq = Array.from({ length: c }, (_, i) => s + 1 + i);
      const said = seq => seq.map(word).join(', ');
      return { kind: 'Counting on', count: true,
        say: `Count on ${word(c)} from ${word(s)}: ${said(wrongSeq)}. It’s ${word(s + c - 1)}.`,
        fix: `Say ${word(s)} in your head, then count on: ${said(rightSeq)}. It’s ${word(s + c)}.`,
        right: `Count on ${word(c)} from ${word(s)}: ${said(rightSeq)}. It’s ${word(s + c)}.`,
        board: { text: `${s} + ${c} = ${s + c - 1}` }, fixed: { text: `${s} + ${c} = ${s + c}` }, claim: s + c - 1, truth: s + c };
    },
  };

  const typeFits = (type, rangeKey) => !!MAKERS[type] && MAKERS[type](span(rangeKey), () => 0.5) !== null;

  /* the same item said correctly: no wobble, no fix, the class says "yes, that's right" */
  const asCorrect = item => ({ ...item, say: item.right, fix: null, correct: true, board: item.fixed || item.board });

  const makeItem = (type, rangeKey, wrong = true, rng = Math.random) => {
    const made = MAKERS[type] && MAKERS[type](span(rangeKey), rng);
    if (!made) return null;
    const item = { type, correct: false, ...made };
    return wrong ? item : asCorrect(item);
  };

  /* Weeks 11+: the teacher's own items run first, then made-up items fill the warm-up to five.
     Only switched-on types that fit the range are used. */
  const buildTemplate = ({ types = [], range = '1-20', rate = 'normal', custom = [], size = 5, rng = Math.random } = {}) => {
    const own = custom.map(c => c.correct
      ? { type: 'custom', kind: 'Your item', correct: true, say: c.say, fix: null, right: c.say, board: { text: c.text || '' }, fixed: { text: c.text || '' } }
      : { type: 'custom', kind: 'Your item', correct: false, say: c.say, fix: c.fix, right: c.right || c.fix, board: { text: c.text || '' }, fixed: { text: c.fixedText || c.text || '' } });
    const n = Math.max(0, size - own.length);
    let usable = types.filter(t => typeFits(t, range));
    if (!usable.length) usable = ['makeTen'];
    const order = [];
    while (order.length < n) order.push(...shuffle(usable, rng));
    const wrongAt = new Set(shuffle([...Array(n).keys()], rng).slice(0, mixCount(rate, n)));
    const made = order.slice(0, n).map((t, i) => makeItem(t, range, wrongAt.has(i), rng));
    return [...own, ...made];
  };

  /* a preset's fixed items, in order. A switched-off mix-up type is said correctly instead. */
  const presetItems = (preset, typesOn = null) => preset.items.map(it =>
    typesOn && typesOn[it.type] === false && !it.correct ? asCorrect(it) : { correct: false, ...it });

  const shuffle = (arr, rng = Math.random) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };

  /* ---- exit checks: is this answer one of the right ones? ---- */
  const tidy = s => String(s).toLowerCase().replace(/[“”"'.!?,]/g, ' ').replace(/\s+/g, ' ').trim();
  const sentence = s => String(s).replace(/\s+/g, '').replace(/[-–]/g, '−');
  const checkExit = (exit, answer) => {
    if (answer == null) return false;
    if (exit.kind === 'number') {
      const a = tidy(answer);
      return exit.accept.some(v => a === v || a === word(+v));
    }
    if (exit.kind === 'family') {
      const given = (Array.isArray(answer) ? answer : String(answer).split(/[\n;,]+/)).map(sentence).filter(Boolean);
      const want = exit.accept.map(sentence);
      const set = new Set(given);
      return want.every(w => set.has(w)) && [...set].every(g => want.includes(g));
    }
    return exit.accept.map(tidy).includes(tidy(answer));
  };

  /* ---- the 80/80 rule: move on when at least the threshold share of the class is right ---- */
  const eightyEighty = (marks, threshold = 80) => {
    const vals = Object.values(marks || {}).filter(v => v === 'right' || v === 'wrong');
    const right = vals.filter(v => v === 'right').length, total = vals.length;
    return { right, total, pct: total ? Math.round(right / total * 100) : 0,
      moveOn: total > 0 && right * 100 >= threshold * total, threshold };
  };

  /* ---- timers: 10% hook, 15% exit check, the rest shared by the items ---- */
  const stepTimes = (minutes = 5, items = 5) => {
    const total = minutes * 60, hook = Math.round(total * 0.1), exit = Math.round(total * 0.15);
    return { total, hook, exit, item: Math.floor((total - hook - exit) / Math.max(1, items)) };
  };

  /* ---- CSV export: one row per child per exit check ---- */
  const cell = v => {
    let s = String(v ?? '');
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;      // stop spreadsheets reading it as a formula
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const resultsCsv = (results, className = '') => {
    const rows = [['Date', 'Class', 'Week', 'Exit check', 'Name', 'Result', 'Class %', '80/80']];
    for (const r of results) {
      for (const [name, mark] of Object.entries(r.marks || {})) {
        if (mark !== 'right' && mark !== 'wrong') continue;
        rows.push([r.date, className, r.weekLabel, r.question, name, mark === 'right' ? 'Right' : 'Not yet',
          r.pct + '%', r.moveOn ? 'Move on' : 'Reteach']);
      }
    }
    return rows.map(row => row.map(cell).join(',')).join('\r\n') + '\r\n';
  };

  /* ---- recorded voice: each line's clip is named from its exact words ---- */
  const clipId = text => {
    let h = 0x811c9dc5;
    for (const ch of String(text).trim()) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; }
    return 'mx-' + h.toString(16).padStart(8, '0');
  };

  const api = { clipId, word, Word, takeName, rates, mixCount, MAKERS, typeFits, makeItem, asCorrect, buildTemplate,
    presetItems, checkExit, eightyEighty, stepTimes, resultsCsv, shuffle };
  root.MIXUP_LOGIC = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})();
