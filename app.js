(() => {
'use strict';

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const el = (tag, props = {}, ...kids) => {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v === false || v == null) continue;
    if (k === 'class') n.className = v;
    else if (k === 'text') n.textContent = v;
    else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat()) if (kid != null && kid !== false) n.append(kid);
  return n;
};
const uid = () => Math.random().toString(36).slice(2, 9);
const rand = arr => arr[Math.floor(Math.random() * arr.length)];
const shuffle = arr => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

/* line icons (static markup, never user text) */
const ICONS = {
  slides: '<rect x="3" y="4" width="18" height="12" rx="2.5"/><path d="M8 20h8M12 16v4"/>',
  picker: '<path d="M12 3.5l2.5 5.3 5.8.8-4.2 4 1 5.8-5.1-2.8-5.1 2.8 1-5.8-4.2-4 5.8-.8z"/>',
  groups: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M16.5 14.2c2.6.5 4.5 2.9 4.5 5.8"/>',
  dice: '<rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="9" cy="9" r="1.1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none"/><circle cx="15" cy="15" r="1.1" fill="currentColor" stroke="none"/>',
  counter: '<rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><path d="M7 9h4M9 7v4M13 15h4"/>',
  timer: '<circle cx="12" cy="13.5" r="7"/><path d="M12 13.5V10M10 3.5h4"/>',
  note: '<path d="M5 4.5h14v9.5l-5 5H5z"/><path d="M19 14h-5v5"/>',
  hush: '<path d="M4.5 19.5c0-8.3 6.2-14.5 15-15 0 8.8-6.2 15-15 15z"/><path d="M4.5 19.5l8-8"/>',
  jewels: '<path d="M7.5 4h9l4.5 5.5L12 20.5 3 9.5z"/><path d="M3 9.5h18M9.5 4 8 9.5l4 11 4-11L14.5 4"/>',
  mixup: '<path d="M8 8.5a3 3 0 0 1 4.5-1.8 3 3 0 0 1 4.8 1.3 3 3 0 0 1 .7 5.6 3 3 0 0 1-3.8 2.4H10a3 3 0 0 1-2.4-1.3"/><ellipse cx="6.3" cy="12" rx="2.8" ry="3.2"/><path d="M10.5 16v3.5M15.5 16v3.5"/>',
  sleigh: '<path d="M4 6.5h4l2.5 6H20"/><path d="M4 6.5v5a4 4 0 0 0 4 4h9.5a2.5 2.5 0 0 0 2.5-2.5v-3"/><path d="M3 19.5h15a3 3 0 0 0 3-3M8 15.5v4M16 15.5v4"/>',
  install: '<rect x="3" y="4" width="18" height="12" rx="2.5"/><path d="M12 7v6M9 10.5l3 3 3-3M8 20h8"/>',
  gbg: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5.5a2.5 2.5 0 0 0 2.6 3.6M16 6h2.5a2.5 2.5 0 0 1-2.6 3.6M12 13v3.5M8.5 20h7M10 16.5h4l.5 3.5h-5z"/>',
  pip: '<ellipse cx="10.5" cy="14" rx="7" ry="4.5"/><path d="M16.5 12.2c2-1.2 4.8-.7 4.8.9s-2.6 2.2-4.8 1.6M3.8 14.5c-1.8.3-2 2.3-.6 3.2"/><path d="M14.6 11.4h.01" stroke-width="2.4"/>',
  whiteboard: '<rect x="3.5" y="4.5" width="17" height="12" rx="2.5"/><path d="M7 10.5c1.5-2 3 2 4.5 0s3 2 4.5 0M9 20.5l3-4 3 4"/>',
  list: '<path d="M9 7h10M9 12h10M9 17h10"/><path d="M5 7h.01M5 12h.01M5 17h.01" stroke-width="2.6"/>',
  full: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  hide: '<path d="M11 7l-5 5 5 5M18 7l-5 5 5 5"/>',
};
const icon = name => {
  const s = el('span', { class: 'ico', 'aria-hidden': 'true' });
  const pic = colourIcon(name);
  s.innerHTML = pic || `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;
  if (pic) s.classList.add('ico-colour');
  return s;
};
/* a few tools get a little colour picture instead of a line icon (a function, so it's ready before the drawings below) */
function colourIcon(name) {
  if (name !== 'whiteboard') return '';
  /* Pip peeking over a small whiteboard */
  return '<svg viewBox="0 0 30 26">'
    + `<rect x="9" y="1" width="20" height="13" rx="1.2" fill="#fff" stroke="${WBC.navy}" stroke-width="1.5"/>`
    + `<path d="M15 7.5q1.7-2 3.4 0t3.4 0t3.4 0" stroke="${WBC.blue}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`
    + `<g transform="scale(.8)">${wbPip(12, 20, 'happy')}</g>`
    + '</svg>';
}
document.querySelectorAll('[data-icon]').forEach(n => n.replaceWith(icon(n.dataset.icon)));

/* muted pastel tones; each name always gets the same one */
const TONES = ['blue', 'rose', 'pistachio', 'mauve', 'stone'];
const toneOf = text => {
  let h = 0;
  for (const ch of text) h = (h * 31 + ch.codePointAt(0)) >>> 0;
  return 'tone-' + TONES[h % TONES.length];
};

/* ---------- saved state (this browser only) ---------- */
const KEY = 'classroom-board-v1';
const fresh = () => ({
  decks: [], activeDeck: null, pdfPages: {}, classDeck: {},
  classes: [{ id: 'c1', name: 'My class', students: [] }], activeClass: 'c1',
  widgets: {}, railHidden: false,
});
let state = fresh();
try { Object.assign(state, JSON.parse(localStorage.getItem(KEY)) || {}); } catch {}
if (!state.classes.length) state.classes = fresh().classes;
state.classDeck ||= {};
const writeNow = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} };
let saveTimer;
const save = () => { clearTimeout(saveTimer); saveTimer = setTimeout(writeNow, 150); };
addEventListener('pagehide', writeNow);

const activeClass = () =>
  state.classes.find(c => c.id === state.activeClass) || state.classes[0];

/* per-class extras: boy/girl, keep-apart and keep-together pairs, who's away today */
const rulesOf = cls => { cls.gender ||= {}; cls.apart ||= []; cls.together ||= []; return cls; };
const today = () => new Date().toLocaleDateString('en-CA');
const awayToday = cls => cls.away && cls.away.date === today()
  ? cls.away.names.filter(n => cls.students.includes(n)) : [];
const present = cls => { const a = awayToday(cls); return cls.students.filter(n => !a.includes(n)); };
const setAway = (cls, names) => { cls.away = { date: today(), names }; save(); };

/* Split names into n groups. Keep-apart pairs are separated, keep-together pairs stay
   joined, boys and girls are spread evenly, and sizes are as even as possible.
   It tries a few hundred shuffles and keeps the best, so each click is still random. */
function makeGroups(names, n, { gender = {}, apart = [], together = [], balance = true } = {}) {
  const N = names.length;
  n = clamp(n, 1, N);
  const inClass = new Set(names);
  const valid = list => list.filter(([a, b]) => a !== b && inClass.has(a) && inClass.has(b));

  const parent = new Map(names.map(x => [x, x]));
  const root = x => { while (parent.get(x) !== x) x = parent.get(x); return x; };
  valid(together).forEach(([a, b]) => { const ra = root(a), rb = root(b); if (ra !== rb) parent.set(ra, rb); });
  const unitOf = new Map();
  names.forEach(x => { const r = root(x); unitOf.set(r, [...(unitOf.get(r) || []), x]); });
  const units = [...unitOf.values()];

  const enemies = new Map(names.map(x => [x, new Set()]));
  valid(apart).forEach(([a, b]) => { enemies.get(a).add(b); enemies.get(b).add(a); });
  const clashes = grp => {
    let c = 0;
    for (let i = 0; i < grp.length; i++)
      for (let j = i + 1; j < grp.length; j++) if (enemies.get(grp[i]).has(grp[j])) c++;
    return c;
  };
  const G = names.filter(x => gender[x] === 'g').length;
  const B = names.filter(x => gender[x] === 'b').length;
  const mixCost = grp => {
    if (!balance || !grp.length) return 0;
    const g = grp.filter(x => gender[x] === 'g').length;
    const b = grp.filter(x => gender[x] === 'b').length;
    return Math.abs(g - G * grp.length / N) + Math.abs(b - B * grp.length / N);
  };
  const baseCap = Array.from({ length: n }, (_, i) => Math.floor(N / n) + (i < N % n ? 1 : 0));

  let best = null, bestScore = Infinity, bestClash = 0;
  for (let t = 0; t < 300; t++) {
    const caps = shuffle(baseCap);
    const groups = caps.map(() => []);
    for (const u of shuffle(units).sort((a, b) => b.length - a.length)) {
      let pick = 0, pickCost = Infinity;
      groups.forEach((g, i) => {
        const trial = g.concat(u);
        const cost = Math.max(0, trial.length - caps[i]) * 500
          + (clashes(trial) - clashes(g)) * 1000
          + mixCost(trial) - mixCost(g)
          + Math.random() * 0.25;
        if (cost < pickCost) { pickCost = cost; pick = i; }
      });
      groups[pick].push(...u);
    }
    const clash = groups.reduce((c, g) => c + clashes(g), 0);
    const score = clash * 1000
      + groups.reduce((s, g, i) => s + Math.max(0, g.length - caps[i]) * 500 + mixCost(g), 0);
    if (score < bestScore) { bestScore = score; best = groups; bestClash = clash; }
  }
  return { groups: best.map(shuffle), clashes: bestClash };
}

/* uploaded PDFs live in IndexedDB so they survive a refresh */
const idb = {
  run(mode, fn) {
    return new Promise((res, rej) => {
      const open = indexedDB.open('classroom-board', 1);
      open.onupgradeneeded = () => open.result.createObjectStore('pdfs');
      open.onerror = () => rej(open.error);
      open.onsuccess = () => {
        const tx = open.result.transaction('pdfs', mode);
        const rq = fn(tx.objectStore('pdfs'));
        tx.oncomplete = () => res(rq.result);
        tx.onerror = () => rej(tx.error);
      };
    });
  },
  put: (k, v) => idb.run('readwrite', s => s.put(v, k)),
  get: k => idb.run('readonly', s => s.get(k)),
  del: k => idb.run('readwrite', s => s.delete(k)),
};

/* ---------- slides ---------- */
const stage = $('#stage');
const PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
let pdf = null;      // { doc, deck, canvas, label, wrap, task }
let showToken = 0;

/* Turn whatever the teacher pasted into something that can sit in an iframe. */
function toEmbed(input) {
  let raw = input.trim();
  const m = raw.match(/<iframe[^>]*\ssrc\s*=\s*["']([^"']+)["']/i);
  if (m) raw = m[1].replace(/&amp;/g, '&');
  let u;
  try { u = new URL(raw); } catch { return null; }
  if (u.protocol !== 'https:') return null;

  if (u.hostname === 'docs.google.com') {
    const g = u.pathname.match(/^\/presentation\/d\/(e\/)?([^/]+)/);
    if (g) return {
      src: `https://docs.google.com/presentation/d/${g[1] || ''}${g[2]}/embed?start=false&loop=false&delayms=60000`,
      label: 'Google Slides',
    };
  }
  if (u.hostname.endsWith('canva.com')) {
    const c = u.pathname.match(/^\/design\/([^/]+)\/([^/]+)/);
    if (c) return { src: `https://www.canva.com/design/${c[1]}/${c[2]}/view?embed`, label: 'Canva' };
  }
  const ms = /onedrive\.live\.com|1drv\.ms|sharepoint\.com|officeapps\.live\.com/.test(u.hostname);
  return { src: u.href, label: ms ? 'PowerPoint' : u.hostname.replace(/^www\./, '') };
}

async function showDeck() {
  const token = ++showToken;
  const deck = state.decks.find(d => d.id === state.activeDeck);
  pdf = null;
  stage.replaceChildren();
  if (!deck) {
    stage.append(el('div', { class: 'empty' },
      el('h1', { text: 'Put your slides here' }),
      el('p', { text: 'Add a Google Slides, Canva or PowerPoint link (or a PDF) and it fills this space. Your tools float on top, so there are no tabs to switch.' }),
      el('button', { class: 'btn primary', text: 'Add slides', onclick: openSlidesDialog })));
    return;
  }
  if (deck.kind === 'embed') {
    stage.append(el('iframe', {
      class: 'slides-frame', src: deck.src, title: deck.name,
      allow: 'fullscreen; autoplay', allowfullscreen: true,
    }));
    return;
  }
  const msg = el('div', { class: 'stage-msg', text: 'Opening PDF…' });
  stage.append(msg);
  try {
    if (!window.pdfjsLib) {
      await new Promise((res, rej) => {
        const s = el('script', { src: PDFJS + 'pdf.min.js' });
        s.onload = res; s.onerror = rej; document.head.append(s);
      });
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS + 'pdf.worker.min.js';
    }
    const data = await idb.get(deck.id);
    if (!data) throw new Error('missing');
    const doc = await window.pdfjsLib.getDocument({ data: data.slice(0) }).promise;
    if (token !== showToken) return;
    const canvas = el('canvas');
    const label = el('span');
    const wrap = el('div', { class: 'pdf-wrap' }, canvas,
      el('div', { class: 'pdf-nav' },
        el('button', { text: '‹', 'aria-label': 'Previous slide', onclick: () => pdfGo(-1) }),
        label,
        el('button', { text: '›', 'aria-label': 'Next slide', onclick: () => pdfGo(1) })));
    wrap.addEventListener('click', e => { if (e.target === canvas) pdfGo(1); });
    stage.replaceChildren(wrap);
    pdf = { doc, deck, canvas, label, wrap, task: null };
    renderPdf();
  } catch {
    if (token === showToken) msg.textContent =
      'Couldn’t open this PDF. Check the internet connection, or upload the file again.';
  }
}

async function renderPdf() {
  const p = pdf;
  if (!p) return;
  const n = clamp(state.pdfPages[p.deck.id] || 1, 1, p.doc.numPages);
  state.pdfPages[p.deck.id] = n;
  p.label.textContent = `${n} / ${p.doc.numPages}`;
  if (p.task) { p.task.cancel(); try { await p.task.promise; } catch {} }
  const page = await p.doc.getPage(n);
  if (p !== pdf) return;
  const base = page.getViewport({ scale: 1 });
  const box = p.wrap.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const fit = Math.min(box.width / base.width, box.height / base.height);
  const vp = page.getViewport({ scale: fit * dpr });
  p.canvas.width = vp.width; p.canvas.height = vp.height;
  p.canvas.style.width = vp.width / dpr + 'px';
  p.canvas.style.height = vp.height / dpr + 'px';
  p.task = page.render({ canvasContext: p.canvas.getContext('2d'), viewport: vp });
  try { await p.task.promise; } catch {}
}
function pdfGo(delta) {
  if (!pdf) return;
  state.pdfPages[pdf.deck.id] = (state.pdfPages[pdf.deck.id] || 1) + delta;
  save(); renderPdf();
}
let resizeTimer;
new ResizeObserver(() => { clearTimeout(resizeTimer); resizeTimer = setTimeout(renderPdf, 120); }).observe(stage);
addEventListener('keydown', e => {
  if (!pdf || e.target.closest('input, textarea, select, dialog')) return;
  if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); pdfGo(1); }
  if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); pdfGo(-1); }
});

/* slides dialog */
const dlgSlides = $('#dlg-slides');
const slideErr = $('#slide-err');
function openSlidesDialog() {
  slideErr.hidden = true;
  renderDeckList();
  dlgSlides.showModal();
}
function renderDeckList() {
  const list = $('#deck-list');
  list.replaceChildren();
  if (!state.decks.length) {
    list.append(el('li', { class: 'none', text: 'Nothing saved yet.' }));
    return;
  }
  for (const d of state.decks) {
    const active = d.id === state.activeDeck;
    list.append(el('li', { class: active ? 'active' : '' },
      el('span', { class: 'name', text: d.name }),
      el('span', { class: 'kind', text: d.label }),
      el('button', { class: 'btn small', text: active ? 'Showing' : 'Show', onclick: () => {
        useDeck(d.id); dlgSlides.close();
      } }),
      el('button', { class: 'btn small danger', text: 'Remove', 'aria-label': `Remove ${d.name}`, onclick: () => {
        state.decks = state.decks.filter(x => x.id !== d.id);
        delete state.pdfPages[d.id];
        if (d.kind === 'pdf') idb.del(d.id).catch(() => {});
        if (active) { state.activeDeck = null; showDeck(); }
        save(); renderDeckList();
      } })));
  }
}
/* show a deck and remember it as this class's lesson */
function useDeck(id) {
  state.activeDeck = id;
  state.classDeck[activeClass().id] = id;
  save(); showDeck();
}
function addDeck(deck) {
  state.decks.unshift(deck);
  useDeck(deck.id);
  $('#slide-link').value = ''; $('#slide-name').value = '';
  dlgSlides.close();
}
$('#slide-add').addEventListener('click', () => {
  const found = toEmbed($('#slide-link').value);
  if (!found) {
    slideErr.textContent = 'That doesn’t look like a link. Paste the full address starting with https://';
    slideErr.hidden = false;
    return;
  }
  addDeck({ id: uid(), kind: 'embed', src: found.src, label: found.label,
    name: $('#slide-name').value.trim() || found.label });
});
$('#slide-pdf').addEventListener('change', async e => {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  const id = uid();
  try {
    await idb.put(id, await file.arrayBuffer());
  } catch {
    slideErr.textContent = 'Couldn’t save that PDF in this browser.';
    slideErr.hidden = false;
    return;
  }
  addDeck({ id, kind: 'pdf', label: 'PDF',
    name: $('#slide-name').value.trim() || file.name.replace(/\.pdf$/i, '') });
});
$('#btn-slides').addEventListener('click', openSlidesDialog);

/* ---------- class list dialog ---------- */
const dlgClass = $('#dlg-class');
const classSelect = $('#class-select');
function fillClassDialog() {
  const cls = activeClass();
  classSelect.replaceChildren(...state.classes.map(c =>
    el('option', { value: c.id, text: c.name || 'Untitled class', selected: c.id === cls.id })));
  $('#class-name').value = cls.name;
  $('#class-students').value = cls.students.join('\n');
  $('#class-count').textContent = cls.students.length;
  renderDetails();
}

/* boy/girl and keep-apart/together (only ever shown in this dialog, never on the board) */
function renderDetails() {
  const cls = rulesOf(activeClass());
  const names = cls.students;
  const has = new Set(names);
  cls.apart = cls.apart.filter(([a, b]) => has.has(a) && has.has(b));
  cls.together = cls.together.filter(([a, b]) => has.has(a) && has.has(b));
  $('#class-details').hidden = names.length < 2;
  $('#class-mix').checked = cls.mix !== false;

  const tally = () => {
    const g = names.filter(n => cls.gender[n] === 'g').length;
    const b = names.filter(n => cls.gender[n] === 'b').length;
    const unset = names.length - g - b;
    $('#gender-tally').textContent = `${b} boys · ${g} girls` + (unset ? ` · ${unset} not set` : '');
  };
  $('#gender-list').replaceChildren(...names.map(n => {
    const seg = (val, label) => el('button', {
      class: 'seg', type: 'button', text: label, 'aria-pressed': String(cls.gender[n] === val),
      'aria-label': `${n}: ${label}`,
      onclick: e => {
        cls.gender[n] = cls.gender[n] === val ? '' : val;
        e.target.parentElement.querySelectorAll('.seg').forEach(s => s.setAttribute('aria-pressed', 'false'));
        if (cls.gender[n]) e.target.setAttribute('aria-pressed', 'true');
        tally(); save();
      },
    });
    return el('div', { class: 'g-row' }, el('span', { class: 'g-name', text: n }), seg('b', 'Boy'), seg('g', 'Girl'));
  }));
  tally();

  for (const kind of ['apart', 'together']) {
    const opts = () => names.map(n => el('option', { value: n, text: n }));
    const a = $(`#${kind}-a`), b = $(`#${kind}-b`);
    a.replaceChildren(...opts()); b.replaceChildren(...opts());
    if (names.length > 1) b.selectedIndex = 1;
    $(`#${kind}-list`).replaceChildren(...(cls[kind].length ? cls[kind].map(([x, y], i) =>
      el('li', {}, el('span', { class: 'pair-names', text: `${x}  &  ${y}` }),
        el('button', { class: 'btn small', type: 'button', text: 'Remove', 'aria-label': `Remove ${x} and ${y}`, onclick: () => {
          cls[kind].splice(i, 1); save(); renderDetails();
        } })))
      : [el('li', { class: 'none', text: 'None yet' })]));
  }
}
for (const kind of ['apart', 'together']) {
  $(`#${kind}-add`).addEventListener('click', () => {
    const cls = rulesOf(activeClass());
    const x = $(`#${kind}-a`).value, y = $(`#${kind}-b`).value;
    if (!x || !y || x === y) return;
    const same = ([p, q]) => (p === x && q === y) || (p === y && q === x);
    if (cls[kind].some(same)) return;
    const other = kind === 'apart' ? 'together' : 'apart';
    cls[other] = cls[other].filter(pq => !same(pq));
    cls[kind].push([x, y]); save(); renderDetails();
  });
}
$('#class-mix').addEventListener('change', e => { activeClass().mix = e.target.checked; save(); });
let detailsTimer;
function openClassDialog() { fillClassDialog(); dlgClass.showModal(); }
classSelect.addEventListener('change', () => { switchClass(classSelect.value); fillClassDialog(); });
$('#class-name').addEventListener('input', e => {
  const cls = activeClass();
  cls.name = e.target.value;
  classSelect.selectedOptions[0].textContent = cls.name || 'Untitled class';
  save();
});
$('#class-students').addEventListener('input', e => {
  const cls = activeClass();
  cls.students = e.target.value.split('\n').map(s => s.trim()).filter(Boolean);
  $('#class-count').textContent = cls.students.length;
  save();
  clearTimeout(detailsTimer); detailsTimer = setTimeout(renderDetails, 400);
});
$('#class-new').addEventListener('click', () => {
  const c = { id: uid(), name: `Class ${state.classes.length + 1}`, students: [] };
  state.classes.push(c); state.activeClass = c.id; save(); fillClassDialog();
  $('#class-name').select();
});
$('#class-del').addEventListener('click', () => {
  const cls = activeClass();
  if (!confirm(`Delete “${cls.name}” and its ${cls.students.length} names?`)) return;
  state.classes = state.classes.filter(c => c.id !== cls.id);
  if (!state.classes.length) state.classes = fresh().classes;
  state.activeClass = state.classes[0].id; save(); fillClassDialog();
});
dlgClass.addEventListener('close', refreshClass);
$('#btn-class').addEventListener('click', openClassDialog);

/* ---------- switching class (a new class every lesson) ---------- */
function refreshClass() {
  $('#rail-class-name').textContent = activeClass().name || 'Untitled class';
  ['picker', 'groups', 'counter', 'whiteboard', 'gbg', 'jewels'].forEach(rebuild);
}
function switchClass(id) {
  state.activeClass = id;
  const deckId = state.classDeck[id];
  if (deckId && deckId !== state.activeDeck && state.decks.some(d => d.id === deckId)) {
    state.activeDeck = deckId; showDeck();
  }
  save(); refreshClass();
}
const dlgSwitch = $('#dlg-switch');
$('#btn-switch').addEventListener('click', () => {
  $('#switch-list').replaceChildren(...state.classes.map(c => {
    const deck = state.decks.find(d => d.id === state.classDeck[c.id]);
    return el('button', {
      class: 'switch-card ' + toneOf(c.name || c.id) + (c.id === activeClass().id ? ' current' : ''),
      onclick: () => { switchClass(c.id); dlgSwitch.close(); },
    },
      el('span', { class: 'switch-name', text: c.name || 'Untitled class' }),
      el('span', { class: 'switch-meta', text: `${c.students.length} students${deck ? ' · ' + deck.name : ''}` }));
  }));
  dlgSwitch.showModal();
});
$('#switch-edit').addEventListener('click', () => { dlgSwitch.close(); openClassDialog(); });

/* ---------- class lists kept on the website, locked with a passcode (classes.locked.js) ---------- */
const dlgUnlock = $('#dlg-unlock');
async function unlockClassLists(pass) {
  const box = window.LOCKED_CLASSES;
  if (!box) throw new Error('missing');
  const bytes = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pass.normalize('NFC').trim().toLowerCase()),
    'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: bytes(box.salt), iterations: box.iter, hash: 'SHA-256' },
    base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
  let plain;
  try { plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes(box.iv) }, key, bytes(box.data)); }
  catch { throw new Error('wrong'); }
  return JSON.parse(new TextDecoder().decode(plain)).classes;
}
function mergeClassLists(list) {
  const same = (a, b) => a.trim().toLowerCase().replace(/\s+/g, '') === b.trim().toLowerCase().replace(/\s+/g, '');
  let added = 0, updated = 0;
  for (const { name, students } of list) {
    const c = state.classes.find(x => same(x.name || '', name));
    if (c) { c.students = students.slice(); updated++; }
    else { state.classes.push({ id: uid(), name, students: students.slice() }); added++; }
  }
  // the empty starter class isn't needed once real classes arrive
  state.classes = state.classes.filter(c => !(c.id === 'c1' && c.name === 'My class' && !c.students.length));
  if (!state.classes.some(c => c.id === state.activeClass)) state.activeClass = state.classes[0].id;
  writeNow(); refreshClass();
  return { added, updated };
}
function openUnlock() {
  $('#unlock-err').hidden = true;
  $('#unlock-pass').value = '';
  dlgUnlock.showModal();
}
$('#switch-unlock').addEventListener('click', () => { dlgSwitch.close(); openUnlock(); });
$('#class-unlock').addEventListener('click', () => { $('#dlg-class').close(); openUnlock(); });
$('#unlock-form').addEventListener('submit', async e => {
  e.preventDefault();
  const err = $('#unlock-err'), go = $('#unlock-go');
  err.hidden = true; go.disabled = true; go.textContent = 'Unlocking…';
  try {
    mergeClassLists(await unlockClassLists($('#unlock-pass').value));
    dlgUnlock.close();
    $('#btn-switch').click(); // show the classes so the right one can be picked straight away
  } catch (x) {
    err.textContent = x.message === 'wrong' ? 'That passcode isn’t right. Check the spelling and try again.'
      : x.message === 'missing' ? 'The class lists couldn’t be found. Reload the page and try again.'
      : 'Something went wrong unlocking the lists. Try again.';
    err.hidden = false;
  } finally { go.disabled = false; go.textContent = 'Load classes'; }
});

/* ---------- widget parts ---------- */
const stepper = (value, min, max, onchange, label) => {
  const out = el('b', { text: value });
  const bump = d => { value = clamp(value + d, min, max); out.textContent = value; onchange(value); };
  return el('span', { class: 'step' },
    el('button', { class: 'w-btn round', text: '−', 'aria-label': `Fewer ${label}`, onclick: () => bump(-1) }),
    out,
    el('button', { class: 'w-btn round', text: '+', 'aria-label': `More ${label}`, onclick: () => bump(1) }));
};
/* quick class switch, so an RFF can change class between lessons in one click */
const classSwitch = () => {
  if (state.classes.length < 2) return el('span', { class: 'w-meta', text: activeClass().name });
  return el('select', { class: 'w-select', 'aria-label': 'Class', onchange: e => {
    switchClass(e.target.value);
  } }, state.classes.map(c => el('option', { value: c.id, text: c.name || 'Untitled class', selected: c.id === activeClass().id })));
};
const needClass = () => el('div', { class: 'w-fill' }, el('div', {},
  el('p', { class: 'w-meta', text: 'No names in this class yet.' }),
  el('div', { class: 'w-row' },
    el('button', { class: 'w-btn go', text: 'Add class list', onclick: openClassDialog }),
    state.classes.length > 1 && classSwitch())));

function beep() {
  try {
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.35, 0.7].forEach(t => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.frequency.value = 880; o.connect(g); g.connect(ac.destination);
      g.gain.setValueAtTime(0.25, ac.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + t + 0.3);
      o.start(ac.currentTime + t); o.stop(ac.currentTime + t + 0.3);
    });
    setTimeout(() => ac.close(), 1500);
  } catch {}
}

/* ---------- Good Behaviour Game: per-class data + set-up window ---------- */
const OLD_TEAM_NAMES = ['Koalas', 'Wombats', 'Echidnas', 'Possums', 'Kookaburras', 'Platypuses'];
const GBG_RULES = ['Eyes and ears on the speaker', 'Hands and feet to ourselves', 'Kind words and actions', 'Try our best'];
const newTeam = i => ({ id: uid(), name: `Team ${i + 1}`, members: [], score: 0, stars: 0, wins: 0 });
const gbgFor = (d, cls) => {
  d.byClass ||= {};
  const g = d.byClass[cls.id] ||= {
    teams: [0, 1, 2, 3].map(newTeam), rules: GBG_RULES.slice(), mode: 'stars', limit: 4,
    minutes: 10, goal: 50, reward: '', showNames: true, showRules: false,
    running: false, endAt: 0, left: 10 * 60000, result: null,
  };
  /* earlier versions used animal team names; switch those to plain numbered teams */
  g.teams.forEach((t, i) => { if (OLD_TEAM_NAMES.includes(t.name)) t.name = `Team ${i + 1}`; });
  return g;
};
const gbgNow = () => gbgFor(state.widgets.gbg.data, rulesOf(activeClass()));

const dlgGbg = $('#dlg-gbg');
let gbgPick = null; // name tapped in the team editor, waiting to be swapped or moved
function gbgEdit(fn) { fn(gbgNow()); gbgPick = null; save(); fillGbgDialog(); rebuild('gbg'); }
const gbgWhere = (g, n) => g.teams.findIndex(t => t.members.includes(n));
function gbgTapName(n) {
  if (!gbgPick || gbgPick === n) { gbgPick = gbgPick === n ? null : n; fillGbgDialog(); return; }
  const a = gbgPick;
  gbgEdit(g => {
    const ta = gbgWhere(g, a), tb = gbgWhere(g, n);
    if (ta < 0 && tb < 0) return;
    if (ta >= 0) g.teams[ta].members.splice(g.teams[ta].members.indexOf(a), 1, n);
    if (tb >= 0) g.teams[tb].members.splice(g.teams[tb].members.indexOf(n), 1, a);
  });
}
function gbgMoveTo(i) { // i = team index, or -1 for "not in a team"
  const n = gbgPick;
  if (!n) return;
  gbgEdit(g => {
    g.teams.forEach(t => { t.members = t.members.filter(m => m !== n); });
    if (i >= 0) g.teams[i].members.push(n);
  });
}
function fillGbgDialog() {
  const g = gbgNow();
  const cls = activeClass();
  const away = new Set(awayToday(cls));
  $('#gbg-class').textContent = cls.name || 'this class';
  const chip = n => el('button', {
    type: 'button', class: 'gbg-chip' + (n === gbgPick ? ' picked' : '') + (away.has(n) ? ' away' : ''),
    text: n, 'aria-pressed': String(n === gbgPick), title: away.has(n) ? 'Away today' : '',
    onclick: e => { e.stopPropagation(); gbgTapName(n); },
  });
  const moveBtn = (i, here) => gbgPick && !here && el('button', {
    type: 'button', class: 'btn small gbg-move', text: 'Move here',
    onclick: e => { e.stopPropagation(); gbgMoveTo(i); },
  });
  const rows = g.teams.map((t, i) => {
    const members = t.members.filter(n => cls.students.includes(n));
    return el('div', { class: 'gbg-team-row tone-' + TONES[i % TONES.length] + (gbgPick ? ' can-drop' : ''), onclick: () => gbgMoveTo(i) },
      el('input', { value: t.name, 'aria-label': `Team ${i + 1} name`, onclick: e => e.stopPropagation(), oninput: e => { t.name = e.target.value; save(); rebuild('gbg'); } }),
      el('div', { class: 'gbg-chips' },
        members.length ? members.map(chip) : el('span', { class: 'gbg-empty', text: 'No one yet' })),
      moveBtn(i, members.includes(gbgPick)),
      g.teams.length > 2 && el('button', { class: 'btn small danger', type: 'button', text: 'Remove', 'aria-label': `Remove ${t.name}`, onclick: e => {
        e.stopPropagation(); gbgEdit(g2 => g2.teams.splice(i, 1));
      } }));
  });
  const bench = cls.students.filter(n => gbgWhere(g, n) < 0);
  if (bench.length || gbgPick) {
    rows.push(el('div', { class: 'gbg-team-row gbg-bench' + (gbgPick ? ' can-drop' : ''), onclick: () => gbgMoveTo(-1) },
      el('span', { class: 'gbg-bench-label', text: 'Not in a team' }),
      el('div', { class: 'gbg-chips' }, bench.length ? bench.map(chip) : el('span', { class: 'gbg-empty', text: 'Everyone’s in a team' })),
      moveBtn(-1, bench.includes(gbgPick))));
  }
  $('#gbg-team-list').replaceChildren(...rows);
  $('#gbg-pick-hint').textContent = gbgPick
    ? `Now tap a name to swap with ${gbgPick}, or tap a team to move them there.`
    : 'Tap a name, then tap another name to swap them, or tap a team to move them there.';
  $('#gbg-team-add').disabled = g.teams.length >= 6;
  $('#gbg-shuffle').disabled = !cls.students.length;
  $('#gbg-clear').disabled = !g.teams.some(t => t.members.length);
  $('#gbg-names').checked = g.showNames !== false;
  $('#gbg-show-rules').checked = !!g.showRules;
  $('#gbg-rules').value = g.rules.join('\n');
  $('#gbg-mode').value = g.mode;
  $('#gbg-limit').value = g.limit;
  $('#gbg-limit-wrap').hidden = g.mode !== 'classic';
  $('#gbg-minutes').value = g.minutes;
  $('#gbg-goal').value = g.goal;
  $('#gbg-reward').value = g.reward;
}
function openGbgDialog() { gbgPick = null; fillGbgDialog(); dlgGbg.showModal(); }
const gbgSet = (fn, refill) => e => { fn(gbgNow(), e.target); save(); if (refill) fillGbgDialog(); rebuild('gbg'); };
const num = (v, lo, hi, fallback) => { const n = parseInt(v, 10); return Number.isFinite(n) ? clamp(n, lo, hi) : fallback; };
$('#gbg-team-add').addEventListener('click', gbgSet(g => { if (g.teams.length < 6) g.teams.push(newTeam(g.teams.length)); }, true));
$('#gbg-shuffle').addEventListener('click', gbgSet(g => {
  const cls = rulesOf(activeClass());
  const { groups } = makeGroups(present(cls), g.teams.length,
    { gender: cls.gender, apart: cls.apart, together: cls.together, balance: cls.mix !== false });
  g.teams.forEach((t, i) => { t.members = groups[i] || []; });
  gbgPick = null;
}, true));
$('#gbg-clear').addEventListener('click', () => {
  if (confirm('Take everyone out of their teams so you can choose by hand?')) gbgEdit(g => g.teams.forEach(t => { t.members = []; }));
});
$('#gbg-names').addEventListener('change', gbgSet((g, t) => { g.showNames = t.checked; }));
$('#gbg-show-rules').addEventListener('change', gbgSet((g, t) => { g.showRules = t.checked; }));
$('#gbg-rules').addEventListener('input', gbgSet((g, t) => { g.rules = t.value.split('\n').map(s => s.trim()).filter(Boolean); }));
$('#gbg-mode').addEventListener('change', gbgSet((g, t) => { g.mode = t.value; }, true));
$('#gbg-limit').addEventListener('input', gbgSet((g, t) => { g.limit = num(t.value, 1, 20, g.limit); }));
$('#gbg-minutes').addEventListener('input', gbgSet((g, t) => {
  g.minutes = num(t.value, 0, 90, g.minutes);
  if (!g.running) g.left = g.minutes * 60000;
}));
$('#gbg-goal').addEventListener('input', gbgSet((g, t) => { g.goal = num(t.value, 1, 999, g.goal); }));
$('#gbg-reward').addEventListener('input', gbgSet((g, t) => { g.reward = t.value.trim(); }));
$('#gbg-reset').addEventListener('click', () => {
  const g = gbgNow();
  if (!confirm(`Reset the term totals for ${activeClass().name || 'this class'}? Team names and members stay.`)) return;
  g.teams.forEach(t => { t.stars = 0; t.wins = 0; t.score = 0; });
  g.result = null; save(); rebuild('gbg');
});

/* ---------- the widgets ---------- */
/* whiteboard expectations card: a framed picture per step, with Pip the platypus in each one
   (static markup, drawn on a 100 x 100 grid) */
const WB_TONES = ['mauve', 'stone', 'pistachio', 'blue'];
const WBC = { navy: '#2f3a5c', blue: '#3f6fb3', board: '#fff', green: '#7f9e5c', soil: '#8a6a4f', yellow: '#e9cf6b', peach: '#efc6a4', cloud: '#a3acb7', orange: '#cf7048' };
const wbBoard = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.5" fill="${WBC.board}" stroke="${WBC.navy}" stroke-width="2.5"/>`;
/* Pip's head, bill to the right; mood: sleep | busy | proud | happy */
const wbPip = (x, y, mood) => {
  const eye = mood === 'sleep' ? `<path d="M.5 -2.5q2.2 1.8 4.4 0" stroke="${WBC.navy}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`
    : mood === 'happy' ? `<path d="M.5 -1.5q2.2 -2.6 4.4 0" stroke="${WBC.navy}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`
    : `<circle cx="2.8" cy="-2.2" r="2" fill="${WBC.navy}"/><circle cx="3.5" cy="-2.9" r=".7" fill="#fff"/>`;
  return `<g transform="translate(${x} ${y})">`
    + '<circle r="9" fill="#c4ae9b"/>'
    + '<path d="M6 -1.5c6-4.5 15.5-3.5 16.5 1.2s-7.5 7.5-15.5 5.3z" fill="#7d8a96"/>'
    + eye + '<circle cx="-2.6" cy="3.2" r="2.1" fill="#d7b6c2" opacity=".9"/>'
    + '<path d="M-4 -8.5l-5-3v6zM-4 -8.5l5-3v6z" fill="#d7b6c2"/><circle cx="-4" cy="-8.5" r="1.6" fill="#9c4e6a"/>'
    + '</g>';
};
const WB_PICS = {
  /* board lying flat, marker capped, a seed asleep in the soil; Pip dozing beside it */
  seed: `<path d="M24 74h52l9 14H15z" fill="${WBC.board}" stroke="${WBC.navy}" stroke-width="2.5" stroke-linejoin="round"/>`
    + `<rect x="34" y="78.5" width="28" height="5" rx="2.5" fill="${WBC.blue}"/><rect x="34" y="78.5" width="9" height="5" rx="2.5" fill="${WBC.navy}"/>`
    + `<ellipse cx="56" cy="62" rx="13" ry="4" fill="${WBC.soil}"/><path d="M56 61V45" stroke="${WBC.green}" stroke-width="3" stroke-linecap="round"/>`
    + `<path d="M56 48c-4-8-13-9-15-6 2 5 9 7 15 6zM56 48c4-8 13-9 15-6-2 5-9 7-15 6z" fill="${WBC.green}"/>`
    + wbPip(20, 56, 'sleep') + `<path d="M24 38h5l-5 5h5M31 30h4l-4 4h4" stroke="${WBC.navy}" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  /* board up, careful wavy writing, marker working, a bee buzzing; Pip concentrating */
  bee: wbBoard(24, 24, 54, 38)
    + `<path d="M32 38q5-6 10 0t10 0t10 0M32 50q5-6 10 0t10 0" stroke="${WBC.blue}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`
    + `<path d="M76 74l-10 -9" stroke="${WBC.orange}" stroke-width="5.5" stroke-linecap="round"/><path d="M66.5 65.5l-3 -2.6" stroke="${WBC.navy}" stroke-width="3" stroke-linecap="round"/>`
    + `<ellipse cx="79" cy="11" rx="4" ry="5.5" fill="#fff" stroke="${WBC.navy}" stroke-width="1.3" transform="rotate(-20 79 11)"/><ellipse cx="86" cy="11" rx="4" ry="5.5" fill="#fff" stroke="${WBC.navy}" stroke-width="1.3" transform="rotate(20 86 11)"/>`
    + `<ellipse cx="83" cy="19" rx="8" ry="6" fill="${WBC.yellow}" stroke="${WBC.navy}" stroke-width="1.5"/><path d="M80 13.6v10.8M85 13.4v11.2" stroke="${WBC.navy}" stroke-width="1.8"/>`
    + wbPip(20, 82, 'busy'),
  /* board held up high (Pip is holding it), three dots for "show me", the sun out */
  sun: wbBoard(22, 16, 56, 38)
    + `<circle cx="38" cy="35" r="4" fill="${WBC.blue}"/><circle cx="50" cy="35" r="4" fill="${WBC.blue}"/><circle cx="62" cy="35" r="4" fill="${WBC.blue}"/>`
    + `<path d="M33 54l-5 32M67 54l5 32" stroke="${WBC.peach}" stroke-width="6" stroke-linecap="round"/>`
    + `<circle cx="88" cy="11" r="6" fill="${WBC.yellow}"/>`
    + wbPip(46, 78, 'proud'),
  /* rain falls, the board is wiped clean (arrow), Pip happy and ready to start again */
  rain: `<path d="M38 26a6.5 6.5 0 0 1 1.5-12.8 9.5 9.5 0 0 1 18.3-2.4 7.5 7.5 0 0 1 4.2 15.2z" fill="${WBC.cloud}"/>`
    + `<path d="M43 31l-1.5 5M50 31l-1.5 5M57 31l-1.5 5" stroke="${WBC.navy}" stroke-width="2" stroke-linecap="round"/>`
    + wbBoard(24, 42, 54, 34)
    + `<path d="M34 66q16-17 32-2" stroke="${WBC.orange}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M60 59.5l6.5 4.8-7.6 2.6z" fill="${WBC.orange}"/>`
    + wbPip(17, 86, 'happy'),
};

/* Pip the platypus speaks in the Ruby Roo voice from recorded clips in audio/pip/.
   Until a clip is there (or for a step the teacher has renamed) the browser's own voice reads the line. */
const PIP_PRAISE = ['Wow, beautiful work!', 'You’re a superstar!', 'Great listening!', 'Fantastic effort!', 'Look at that neat writing!', 'Ripper job, well done!'];
const PIP_SVG = '<svg viewBox="0 0 160 118">'
  + '<ellipse cx="82" cy="111" rx="58" ry="6" fill="#ebebef"/>'
  + '<path d="M38 74c-24-2-32 14-24 23 8 7 26 0 36-11z" fill="#a8927f"/>'
  + '<ellipse cx="78" cy="78" rx="44" ry="28" fill="#c4ae9b"/><ellipse cx="84" cy="89" rx="28" ry="13" fill="#e8dccf"/>'
  + '<path d="M56 100c-7 3-7 9 0 9h13c2-4 0-9-5-9zM94 100c-7 3-7 9 0 9h13c2-4 0-9-5-9z" fill="#7d8a96"/>'
  + '<circle cx="112" cy="58" r="22" fill="#c4ae9b"/>'
  + '<path d="M124 55c11-7 29-5 31 3s-14 15-29 11z" fill="#7d8a96"/><circle cx="146" cy="57" r="1.4" fill="#4f5963"/><circle cx="150" cy="58.5" r="1.4" fill="#4f5963"/>'
  + '<circle cx="114" cy="51" r="4.4" fill="#2f2e35"/><circle cx="115.6" cy="49.4" r="1.5" fill="#fff"/><circle cx="106" cy="61" r="4" fill="#d7b6c2" opacity=".85"/>'
  + '<path d="M103 37l-11-6v12zM103 37l11-6v12z" fill="#d7b6c2"/><circle cx="103" cy="37" r="3.2" fill="#9c4e6a"/>'
  + '</svg>';
let pipAudio = null, pipBubble = null;
function pipSpeak(text) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const vs = speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang));
  const v = vs.find(v => /en-AU/i.test(v.lang) && /female|karen|catherine|natasha/i.test(v.name)) || vs.find(v => /en-AU/i.test(v.lang)) || vs[0];
  if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'en-AU';
  u.pitch = 1.3; u.rate = 1.05;
  speechSynthesis.speak(u);
}
/* clip: a recording name, or a list to try in order; if none plays, the browser voice reads the text */
function pipSay(clip, text) {
  pipAudio?.pause();
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  pipBubble?.(text);
  const tryClip = list => {
    if (!list.length) { pipSpeak(text); return; }
    const a = pipAudio = new Audio(`audio/pip/${list[0]}.mp3`);
    let fell = false;
    const next = () => { if (fell || pipAudio !== a) return; fell = true; tryClip(list.slice(1)); };
    a.addEventListener('error', next, { once: true });
    a.play().catch(next);
  };
  tryClip(clip ? [].concat(clip) : []);
}

const PIPS = { 1: [4],2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };

const WIDGETS = {
  picker: {
    title: 'Student picker', icon: 'picker', tone: 'rose', w: 340, h: 280,
    build(root, d) {
      const cls = activeClass();
      if (!cls.students.length) { root.append(needClass()); return; }
      d.picked ||= {};
      d.noRepeat ??= true;
      const here = present(cls);
      const done = () => (d.picked[cls.id] || []).filter(n => here.includes(n));
      const name = el('div', { class: 'big-name', text: '?' });
      const fill = el('div', { class: 'w-fill' }, name);
      const meta = el('span', { class: 'w-meta' });
      const show = text => {
        name.textContent = text;
        name.className = 'big-name' + (text === '?' ? ' blank' : '');
        fill.className = 'w-fill' + (text === '?' ? '' : ' ' + toneOf(text));
        name.style.fontSize = `min(${Math.round(125 / Math.max(text.length, 5))}cqw, 34cqh)`;
      };
      const count = () => {
        meta.textContent = d.noRepeat
          ? `${here.length - done().length} of ${here.length} left`
          : `${here.length} here`;
      };
      let spin;
      const pick = () => {
        clearInterval(spin);
        if (!here.length) return;
        let pool = d.noRepeat ? here.filter(n => !done().includes(n)) : here;
        if (!pool.length) { d.picked[cls.id] = []; pool = here; }
        const winner = rand(pool);
        name.classList.remove('pop');
        let ticks = 0;
        spin = setInterval(() => {
          if (++ticks < 16) { show(rand(here)); return; }
          clearInterval(spin);
          show(winner); name.classList.add('pop');
          if (d.noRepeat) d.picked[cls.id] = [...done(), winner];
          count(); save();
        }, 70);
      };
      const check = el('input', { type: 'checkbox', checked: d.noRepeat, onchange: e => { d.noRepeat = e.target.checked; count(); save(); } });
      show('?'); count();
      root.append(
        fill,
        el('div', { class: 'w-row' },
          el('button', { class: 'w-btn go', text: 'Pick a student', onclick: pick }),
          el('button', { class: 'w-btn', text: 'Start over', onclick: () => { d.picked[cls.id] = []; show('?'); name.classList.remove('pop'); count(); save(); } })),
        el('div', { class: 'w-row' }, el('label', { class: 'w-check' }, check, 'No repeats'), meta, classSwitch()));
      return () => clearInterval(spin);
    },
  },

  groups: {
    title: 'Group maker', icon: 'groups', tone: 'mauve', w: 460, h: 380,
    build(root, d) {
      const cls = rulesOf(activeClass());
      if (!cls.students.length) { root.append(needClass()); return; }
      d.count ||= 4;
      d.by ||= 'groups';          // 'groups' = how many groups, 'size' = how many in each
      if (d.resultClass !== cls.id) d.result = null;

      const grid = el('div', { class: 'groups' });
      const warn = el('p', { class: 'w-warn', hidden: true });
      const status = el('span', { class: 'w-meta' });
      const awayBtn = el('button', { class: 'w-btn' });
      let picking = false;

      const showStatus = () => {
        const away = awayToday(cls).length;
        status.textContent = `${present(cls).length} here` + (away ? ` · ${away} away` : '');
      };
      const draw = () => {
        awayBtn.textContent = picking ? 'Done' : 'Who’s away?';
        awayBtn.classList.toggle('on', picking);
        warn.hidden = picking || !d.result || !d.clash;
        warn.textContent = 'Couldn’t keep every pair apart this time. Try more groups.';
        if (picking) {
          const away = new Set(awayToday(cls));
          grid.className = 'chips';
          grid.replaceChildren(
            el('p', { class: 'w-meta chips-help', text: 'Tap anyone who’s away today' }),
            ...cls.students.map(n => el('button', {
              class: 'chip' + (away.has(n) ? ' away' : ''), text: n, 'aria-pressed': String(away.has(n)),
              onclick: e => {
                away.has(n) ? away.delete(n) : away.add(n);
                e.target.classList.toggle('away', away.has(n));
                e.target.setAttribute('aria-pressed', String(away.has(n)));
                setAway(cls, [...away]); showStatus();
              },
            })));
          return;
        }
        grid.className = 'groups';
        grid.replaceChildren(...(d.result || []).map((g, i) =>
          el('div', { class: 'group tone-' + TONES[i % TONES.length] }, el('h4', { text: `Group ${i + 1}` }),
            el('ul', {}, g.map(n => el('li', { text: n }))))));
      };
      const make = () => {
        picking = false;
        const names = present(cls);
        if (!names.length) return;
        const n = d.by === 'groups' ? d.count : Math.max(1, Math.floor(names.length / d.count));   // leftovers join groups, never a group short
        const { groups, clashes } = makeGroups(names, n,
          { gender: cls.gender, apart: cls.apart, together: cls.together, balance: cls.mix !== false });
        d.result = groups; d.resultClass = cls.id; d.clash = clashes; save(); draw();
      };
      awayBtn.addEventListener('click', () => {
        picking = !picking; draw();
        if (!picking) rebuild('picker');
      });

      const by = el('select', { class: 'w-select', 'aria-label': 'Group by', onchange: e => { d.by = e.target.value; save(); } },
        el('option', { value: 'groups', text: 'groups', selected: d.by === 'groups' }),
        el('option', { value: 'size', text: 'in each group', selected: d.by === 'size' }));

      showStatus(); draw();
      root.append(
        el('div', { class: 'w-row' },
          stepper(d.count, 2, 12, v => { d.count = v; save(); }, 'groups'), by,
          el('button', { class: 'w-btn go', text: 'Make groups', onclick: make })),
        el('div', { class: 'w-row' }, awayBtn, status, classSwitch()),
        warn,
        grid);
    },
  },

  dice: {
    title: 'Dice', icon: 'dice', tone: 'blue', w: 320, h: 300,
    build(root, d) {
      d.count ||= 1; d.sides ||= 6;
      const tray = el('div', { class: 'dice' });
      const total = el('span', { class: 'total' });
      const roll1 = () => 1 + Math.floor(Math.random() * d.sides);
      const draw = (values, rolling) => {
        tray.style.setProperty('--cols', d.count <= 3 ? d.count : Math.ceil(d.count / 2));
        tray.style.setProperty('--rows', d.count <= 3 ? 1 : 2);
        tray.replaceChildren(...values.map(v => d.sides === 6
          ? el('div', { class: 'die' + (rolling ? ' roll' : ''), role: 'img', 'aria-label': String(v) },
              Array.from({ length: 9 }, (_, i) => el('i', { class: PIPS[v].includes(i) ? 'p' : '' })))
          : el('div', { class: 'die num' + (rolling ? ' roll' : ''), text: v })));
        total.textContent = rolling || d.count < 2 ? '' : `Total ${values.reduce((a, b) => a + b, 0)}`;
      };
      const fit = () => {
        d.values = Array.from({ length: d.count }, (_, i) => clamp(d.values?.[i] || 1, 1, d.sides));
        draw(d.values); save();
      };
      let spin;
      const roll = () => {
        clearInterval(spin);
        let ticks = 0;
        spin = setInterval(() => {
          const vals = Array.from({ length: d.count }, roll1);
          if (++ticks < 10) { draw(vals, true); return; }
          clearInterval(spin);
          d.values = vals; draw(vals); save();
        }, 70);
      };
      const sides = el('select', { class: 'w-btn', 'aria-label': 'Sides', onchange: e => { d.sides = +e.target.value; fit(); } },
        [4, 6, 8, 10, 12, 20].map(s => el('option', { value: s, text: `${s}-sided`, selected: s === d.sides })));
      fit();
      tray.addEventListener('click', roll);
      root.append(
        el('div', { class: 'w-fill' }, tray),
        el('div', { class: 'w-row' }, el('button', { class: 'w-btn go', text: 'Roll', onclick: roll }), total),
        el('div', { class: 'w-row' }, stepper(d.count, 1, 6, v => { d.count = v; fit(); }, 'dice'), sides));
      return () => clearInterval(spin);
    },
  },

  counter: {
    title: 'Counter', icon: 'counter', tone: 'blue', w: 320, h: 240,
    build(root, d) {
      /* scores are kept per class; a new class starts with the same counter names at 0 */
      d.byClass ||= {};
      const template = Object.values(d.byClass)[0] || d.rows || [{ name: 'Count' }];
      const rows = d.byClass[activeClass().id] ||= template.map(r => ({ name: r.name, n: 0 }));
      const list = el('div', { class: 'counters' });
      const draw = () => {
        list.style.setProperty('--rows', rows.length);
        list.replaceChildren(...rows.map((r, i) => {
          const n = el('span', { class: 'n', text: r.n });
          const bump = by => { r.n += by; n.textContent = r.n; save(); };
          return el('div', { class: 'counter' },
            el('input', { value: r.name, 'aria-label': 'Counter name', oninput: e => { r.name = e.target.value; save(); } }),
            el('button', { class: 'pm minus', text: '−', 'aria-label': 'Take one away', onclick: () => bump(-1) }),
            n,
            el('button', { class: 'pm', text: '+', 'aria-label': 'Add one', onclick: () => bump(1) }),
            rows.length > 1 && el('button', { class: 'del', text: '✕', 'aria-label': `Remove ${r.name}`, onclick: () => { rows.splice(i, 1); save(); draw(); } }));
        }));
      };
      draw();
      root.append(list, el('div', { class: 'w-row' },
        el('button', { class: 'w-btn', text: '+ Add counter', onclick: () => {
          if (rows.length < 6) { rows.push({ name: `Team ${rows.length + 1}`, n: 0 }); save(); draw(); }
        } }),
        el('button', { class: 'w-btn', text: 'Reset to 0', onclick: () => { rows.forEach(r => r.n = 0); save(); draw(); } })));
    },
  },

  whiteboard: {
    title: 'Whiteboards', icon: 'whiteboard', tone: 'pistachio', w: 780, h: 380,
    /* the whiteboard expectations card; in number formation it stays up while each picked child
       goes Sleepy Seed → Busy Bee → Sunflower → Rain to Rub Out before the next child is picked */
    build(root, d) {
      const WB = window.WhiteboardSteps;
      const cls = activeClass();
      const here = present(cls);
      d.mode ||= 'card';
      d.step = clamp(d.step | 0, 0, WB.LAST);
      d.form ||= {};
      d.steps ||= [];
      const formation = d.mode === 'formation';
      const form = () => {
        const f = d.form[cls.id] ||= WB.start();
        f.done = f.done.filter(n => here.includes(n));
        if (f.child && !here.includes(f.child)) Object.assign(f, { child: null, step: 0 });   // marked away mid-turn
        return f;
      };

      /* ---- the card ---- */
      const card = el('div', { class: 'wb' });
      const hint = el('p', { class: 'wb-hint', text: 'Tap any picture to jump to that step.' });
      const drawCard = () => {
        const now = formation ? form().step : d.step;
        card.replaceChildren(...WB.stepsWith(d.steps).map((s, i) => {
          const pic = el('span', { class: 'wb-pic', 'aria-hidden': 'true' });
          pic.innerHTML = `<svg viewBox="0 0 100 100">${WB_PICS[s.key]}</svg>`;
          /* tap any step to jump straight to it, in either mode (no need to go through Next) */
          const jump = () => {
            if (formation) d.form[cls.id] = { ...form(), step: i };
            else d.step = i;
            save(); draw(); callStep();
          };
          return el('button', { type: 'button', class: 'wb-step' + (i === now ? ' now' : ''), 'aria-current': i === now && 'step', title: `Show ${s.label}`, onclick: jump },
            pic, el('span', { class: 'wb-label', text: s.label }), el('span', { class: 'wb-text', text: s.text }));
        }));
      };

      /* ---- the go button: next step, or pick the next child ---- */
      const nameBox = el('div', { class: 'wb-name', role: 'status', 'aria-live': 'polite' });
      const goBtn = el('button', { class: 'w-btn go', onclick: () => go() });
      const meta = el('span', { class: 'w-meta' });
      let spin = null;
      const drawBar = () => {
        const st = WB.stepsWith(d.steps);
        if (!formation) { goBtn.textContent = `Next: ${st[WB.nextStep(d.step)].label}`; return; }
        const f = form();
        nameBox.textContent = f.child || (f.done.length ? 'Ready for the next child' : 'Pick a child to start');
        nameBox.classList.toggle('blank', !f.child);
        goBtn.textContent = !f.child ? (f.done.length ? 'Pick the next child' : 'Pick a child')
          : f.step === WB.LAST ? `Back to ${st[0].label}` : `Next: ${st[f.step + 1].label}`;
        goBtn.disabled = !!spin || !here.length;
        meta.textContent = `${here.length - f.done.length} of ${here.length} left`;
      };
      const draw = () => { drawCard(); drawBar(); };
      /* Pip reads each step out in her own voice (name and line). Words the teacher has changed
         have no recording, so the browser voice reads those. */
      const callStep = () => {
        if (d.sound === false) return;
        const i = formation ? form().step : d.step;
        const s = WB.stepsWith(d.steps)[i], def = WB.DEFAULT_STEPS[i];
        const mine = s.label !== def.label || s.text !== def.text;
        pipSay(mine ? null : [`line-${s.key}`, `step-${s.key}`], `${s.label}! ${s.text}`);
      };
      const soundBtn = el('button', { class: 'w-btn round', title: 'Pip reads each step', onclick: () => {
        d.sound = d.sound === false; save(); showSound();
        if (d.sound) callStep(); else { pipAudio?.pause(); if ('speechSynthesis' in window) speechSynthesis.cancel(); }
      } });
      const showSound = () => {
        const on = d.sound !== false;
        soundBtn.textContent = on ? '🔊' : '🔈';
        soundBtn.setAttribute('aria-label', on ? 'Pip’s voice is on. Turn it off' : 'Pip’s voice is off. Turn it on');
        soundBtn.setAttribute('aria-pressed', String(on));
      };
      showSound();
      const go = () => {
        if (!formation) { d.step = WB.nextStep(d.step); save(); draw(); callStep(); return; }
        const f = form();
        if (f.child) { d.form[cls.id] = WB.advance(f); save(); draw(); if (d.form[cls.id].child) callStep(); return; }
        const next = WB.pick(f, here);
        if (!next.child || spin) return;
        goBtn.disabled = true;
        nameBox.classList.remove('blank', 'pop');
        let ticks = 0;
        spin = setInterval(() => {
          if (++ticks < 14) { nameBox.textContent = rand(here); return; }
          clearInterval(spin); spin = null;
          d.form[cls.id] = next; save(); draw(); callStep();
          nameBox.classList.add('pop');
        }, 70);
      };

      /* ---- settings: the school's own words ---- */
      const panel = el('div', { class: 'wb-set', hidden: true });
      const setBtn = el('button', { class: 'w-btn round', text: '⋯', title: 'Change the words', 'aria-label': 'Change the step names and words', 'aria-expanded': 'false' });
      const showSet = on => {
        panel.hidden = !on; card.hidden = on; hint.hidden = on;
        setBtn.setAttribute('aria-expanded', String(on));
        if (on) fillSet(); else draw();
      };
      setBtn.addEventListener('click', () => showSet(panel.hidden));
      const fillSet = () => {
        const st = WB.stepsWith(d.steps);
        panel.replaceChildren(
          el('p', { class: 'w-meta', text: 'Use your school’s own words. An empty box goes back to the usual words.' }),
          ...WB.DEFAULT_STEPS.map((def, i) => {
            const mine = d.steps[i] ||= {};
            const name = el('input', { class: 'wb-in', value: st[i].label, placeholder: def.label, 'aria-label': `Step ${i + 1} name`,
              oninput: e => { mine.label = e.target.value; save(); } });
            const words = el('textarea', { class: 'wb-in', rows: 2, placeholder: def.text, 'aria-label': `Step ${i + 1} words`,
              oninput: e => { mine.text = e.target.value; save(); } });
            words.value = st[i].text;
            return el('div', { class: `wb-set-row tone-${WB_TONES[i]}` }, el('span', { class: 'wb-num', text: i + 1 }), name, words);
          }),
          el('div', { class: 'w-row' },
            el('button', { class: 'w-btn', text: 'Use the usual words', onclick: () => { d.steps = []; save(); fillSet(); } }),
            el('button', { class: 'w-btn go', text: 'Done', onclick: () => showSet(false) })));
      };

      const modeSel = el('select', { class: 'w-select', 'aria-label': 'Mode', onchange: e => { d.mode = e.target.value; save(); rebuild('whiteboard'); } },
        el('option', { value: 'card', text: 'Card only', selected: !formation }),
        el('option', { value: 'formation', text: 'Number formation', selected: formation }));

      let top = null, bottom;
      if (!formation) bottom = el('div', { class: 'w-row' }, goBtn, soundBtn, modeSel, setBtn);
      else {
        top = cls.students.length
          ? el('div', { class: 'w-row wb-bar' }, nameBox, goBtn)
          : el('div', { class: 'w-row wb-bar' }, el('span', { class: 'w-meta', text: 'No names in this class yet.' }),
              el('button', { class: 'w-btn go', text: 'Add class list', onclick: openClassDialog }));
        bottom = el('div', { class: 'w-row' }, meta,
          el('button', { class: 'w-btn', text: 'Start over', onclick: () => { d.form[cls.id] = WB.start(); save(); draw(); } }),
          classSwitch(), soundBtn, modeSel, setBtn);
      }
      draw();
      root.append(...[top, card, hint, panel, bottom].filter(Boolean));
      return () => clearInterval(spin);
    },
  },

  pip: {
    title: 'Pip the platypus', icon: 'pip', tone: 'blue', w: 380, h: 500,
    build(root) {
      const bubble = el('div', { class: 'pip-bubble', role: 'status', 'aria-live': 'polite', text: 'G’day! I’m Pip.' });
      const art = el('div', { class: 'pip-art', 'aria-hidden': 'true' });
      art.innerHTML = PIP_SVG;
      pipBubble = text => { bubble.textContent = text; art.classList.remove('talk'); void art.offsetWidth; art.classList.add('talk'); };
      let last = -1;
      const cheer = () => {
        let i;
        do i = Math.floor(Math.random() * PIP_PRAISE.length); while (i === last);
        last = i;
        pipSay(`praise-${i + 1}`, PIP_PRAISE[i]);
      };
      root.append(
        el('div', { class: 'w-fill pip-stage' }, bubble, art),
        el('div', { class: 'w-row' }, el('button', { class: 'w-btn go', text: 'Cheer!', onclick: cheer })),
        el('div', { class: 'w-row pip-lines' }, PIP_PRAISE.map((t, i) =>
          el('button', { class: 'w-btn', text: t, onclick: () => pipSay(`praise-${i + 1}`, t) }))),
        el('p', { class: 'w-meta pip-note', text: 'Pip also reads each step on the Whiteboards card.' }));
      return () => { pipBubble = null; pipAudio?.pause(); };
    },
  },

  gbg: {
    title: 'Class Champions', icon: 'gbg', tone: 'pistachio', w: 760, h: 128, minH: 96, slim: true, dockable: true,
    /* starts as a strip along the bottom of the screen, out of the way of the slides */
    pos: () => ({ x: Math.max(100, Math.round((innerWidth - 760) / 2)), y: Math.max(0, innerHeight - 128 - 16) }),
    build(root, d) {
      const cls = rulesOf(activeClass());
      const g = gbgFor(d, cls);
      const stars = g.mode === 'stars';
      let tick = null, clock = null, goBtn = null, goalText = null, goalFill = null;

      const leftNow = () => g.running ? Math.max(0, g.endAt - Date.now()) : g.left;
      const fmt = ms => { const s = Math.ceil(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
      const showClock = () => {
        if (!clock) return;
        const ms = leftNow();
        clock.textContent = fmt(ms);
        clock.classList.toggle('low', g.running && ms <= 60000);
        goBtn.textContent = g.running ? '❚❚' : '▶';
        goBtn.setAttribute('aria-label', g.running ? 'Pause timer' : 'Start timer');
      };
      const stopTick = () => { clearInterval(tick); tick = null; };
      const startTick = () => {
        stopTick();
        tick = setInterval(() => {
          if (g.running && leftNow() <= 0) { beep(); finish(); return; }
          showClock();
        }, 250);
      };
      const showGoal = () => {
        if (!goalText) return;
        const banked = g.teams.reduce((s, t) => s + (stars ? t.stars : t.wins), 0);
        const live = stars && !g.result ? g.teams.reduce((s, t) => s + t.score, 0) : 0;
        const have = banked + live;
        goalFill.style.width = Math.min(100, Math.round(have / g.goal * 100)) + '%';
        goalText.textContent = `${g.reward || 'Class goal'} · ${have}/${g.goal}${stars ? ' ★' : ' wins'}`;
        goalText.parentElement.classList.toggle('reached', have >= g.goal);
      };

      const finish = () => {
        stopTick();
        g.left = leftNow(); g.running = false;
        let winners;
        if (stars) {
          const top = Math.max(...g.teams.map(t => t.score));
          winners = top > 0 ? g.teams.filter(t => t.score === top) : [];
          g.teams.forEach(t => { t.stars += t.score; });
        } else {
          winners = g.teams.filter(t => t.score <= g.limit);
          winners.forEach(t => { t.wins += 1; });
        }
        g.result = { winners: winners.map(t => t.id) };
        save(); draw();
      };
      const newGame = () => {
        stopTick();
        g.teams.forEach(t => { t.score = 0; });
        g.result = null; g.running = false; g.left = g.minutes * 60000;
        save(); draw();
      };
      const toggleClock = () => {
        if (g.running) { g.left = leftNow(); g.running = false; stopTick(); }
        else {
          if (g.left <= 0) g.left = g.minutes * 60000;
          g.endAt = Date.now() + g.left; g.running = true; startTick();
        }
        save(); showClock();
      };

      const draw = () => {
        const winners = new Set(g.result?.winners || []);
        const done = !!g.result;

        /* each team is an outlined box: tap the box to add, tap − to take one off */
        const teams = el('div', { class: 'gbg-teams' }, g.teams.map((t, i) => {
          const name = t.name || `Team ${i + 1}`;
          const members = g.showNames !== false ? t.members.filter(n => cls.students.includes(n)) : [];
          const num = el('span', { text: String(t.score) });
          const card = el('div', {
            class: 'gbg-team tone-' + TONES[i % TONES.length] + (winners.has(t.id) ? ' win' : '') + (!stars && t.score > g.limit ? ' over' : ''),
            role: 'button', tabindex: done ? '-1' : '0', 'aria-disabled': done ? 'true' : 'false',
          });
          const label = () => card.setAttribute('aria-label', `${name}: ${t.score}. Tap to give ${stars ? 'a star' : 'a mark'}.`);
          const bump = by => {
            if (g.result) return;
            t.score = Math.max(0, t.score + by); save();
            num.textContent = String(t.score); label();
            card.classList.toggle('over', !stars && t.score > g.limit);
            card.classList.remove('bump'); void card.offsetWidth; card.classList.add('bump');
            showGoal();
          };
          card.addEventListener('click', () => bump(1));
          card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); bump(1); } });
          /* name and score on the top line, members underneath across the whole card */
          card.append(
            el('span', { class: 'gbg-name', text: name }),
            el('span', { class: 'gbg-num' }, num, el('small', { text: stars ? ' ★' : ` / ${g.limit}` })),
            el('button', { class: 'gbg-minus', text: '−', disabled: done, 'aria-label': `Take one off ${name}`,
              onclick: e => { e.stopPropagation(); bump(-1); } }),
            members.length > 0 && el('span', { class: 'gbg-members', text: members.join(', ') }));
          label();
          return card;
        }));
        teams.style.setProperty('--n', g.teams.length);

        clock = g.minutes ? el('span', { class: 'gbg-clock', role: 'timer' }) : null;
        goBtn = g.minutes ? el('button', { class: 'w-btn round go', onclick: toggleClock, disabled: done }) : null;
        const ctrl = el('div', { class: 'gbg-ctrl' },
          g.minutes ? el('div', { class: 'gbg-ctrl-row' }, clock, goBtn) : null,
          el('div', { class: 'gbg-ctrl-row' },
            el('button', { class: 'w-btn', text: done ? 'New game' : 'Finish', onclick: done ? newGame : finish }),
            el('button', { class: 'w-btn round', text: '⋯', title: 'Set up', 'aria-label': 'Set up the game', onclick: openGbgDialog })));

        goalFill = el('i');
        goalText = el('span', { class: 'gbg-goal-text' });
        const goal = el('div', { class: 'gbg-goal' }, el('span', { class: 'gbg-bar' }, goalFill), goalText);

        let result = null;
        if (done) {
          const names = g.teams.filter(t => winners.has(t.id)).map(t => t.name);
          const all = names.length === g.teams.length && names.length > 1;
          const headline = !names.length ? 'Not this time!'
            : all ? 'Every team wins!'
            : names.length === 1 ? `${names[0]} wins!`
            : `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]} win!`;
          result = el('div', { class: 'gbg-result', role: 'status' },
            el('h3', { text: headline }),
            el('div', { class: 'gbg-ctrl-row' },
              el('button', { class: 'w-btn go', text: 'New game', onclick: newGame }),
              el('button', { class: 'w-btn', text: 'Show scores', onclick: e => e.target.closest('.gbg-result').remove() })));
        }

        root.replaceChildren(...[
          g.showRules && g.rules.length ? el('p', { class: 'gbg-rules-line', text: g.rules.join('   ·   ') }) : null,
          el('div', { class: 'gbg-main' }, teams, ctrl),
          goal,
          result,
        ].filter(Boolean));
        showGoal(); showClock();
      };

      if (g.running && leftNow() <= 0 && !g.result) finish();
      else { draw(); if (g.running) startTick(); }
      return stopTick;
    },
  },

  timer: {
    title: 'Timer', icon: 'timer', tone: 'rose', w: 290, h: 140, minH: 112, slim: true,
    /* a small pocket in the top-right corner, clear of the slides */
    pos: () => ({ x: Math.max(100, innerWidth - 290 - 16), y: 16 }),
    build(root, d) {
      d.total ||= 300;
      d.mode ||= 'down';
      let ms = d.mode === 'down' ? d.total * 1000 : 0;   // what's on the clock
      let anchor = 0, tick = null;
      const clock = el('div', { class: 'clock tclock', role: 'timer' });
      const go = el('button', { class: 'w-btn round go' });
      const now = () => {
        if (!tick) return ms;
        const gone = Date.now() - anchor;
        return d.mode === 'down' ? Math.max(0, ms - gone) : ms + gone;
      };
      const draw = () => {
        const t = now();
        const secs = d.mode === 'down' ? Math.ceil(t / 1000) : Math.floor(t / 1000);
        clock.textContent = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
        clock.classList.toggle('low', d.mode === 'down' && !!tick && secs <= 10 && secs > 0);
        go.textContent = tick ? '❚❚' : '▶';
        go.setAttribute('aria-label', tick ? 'Pause' : 'Start');
      };
      const stop = () => { ms = now(); clearInterval(tick); tick = null; draw(); };
      const start = () => {
        clock.classList.remove('done');
        if (d.mode === 'down' && ms <= 0) ms = d.total * 1000;
        anchor = Date.now();
        tick = setInterval(() => {
          if (d.mode === 'down' && now() <= 0) { stop(); clock.classList.add('done'); beep(); }
          else draw();
        }, 200);
        draw();
      };
      const reset = () => {
        clearInterval(tick); tick = null;
        clock.classList.remove('done');
        ms = d.mode === 'down' ? d.total * 1000 : 0;
        draw();
      };
      const setTotal = s => { d.total = clamp(s, 10, 5999); save(); reset(); };
      go.addEventListener('click', () => tick ? stop() : start());
      const presets = el('span', { class: 'tpresets-set' },
        [[60, '1'], [120, '2'], [300, '5'], [600, '10']].map(([s, t]) =>
          el('button', { class: 'w-btn', text: t, 'aria-label': `${t} minute${s > 60 ? 's' : ''}`, onclick: () => setTotal(s) })),
        el('button', { class: 'w-btn round', text: '−', 'aria-label': 'One minute less', onclick: () => setTotal(d.total - 60) }),
        el('button', { class: 'w-btn round', text: '+', 'aria-label': 'One minute more', onclick: () => setTotal(d.total + 60) }));
      const modeBtn = el('button', { class: 'w-btn', onclick: () => {
        d.mode = d.mode === 'down' ? 'up' : 'down'; save(); sync(); reset();
      } });
      const sync = () => {
        modeBtn.textContent = d.mode === 'down' ? 'Stopwatch' : 'Countdown';
        presets.hidden = d.mode !== 'down';
      };
      sync(); draw();
      root.append(
        el('div', { class: 'tmain' }, clock,
          el('div', { class: 'tbtns' }, go, el('button', { class: 'w-btn round', text: '↺', 'aria-label': 'Reset', onclick: reset }))),
        el('div', { class: 'w-row tpresets' }, presets, modeBtn));
      return () => clearInterval(tick);
    },
  },

  hush: {
    title: 'Hush Bush', icon: 'hush', tone: 'stone', w: 520, h: 340, minH: 220, slim: true,
    pos: () => ({ x: Math.max(100, Math.round((innerWidth - 520) / 2)), y: Math.max(16, innerHeight - 340 - 120) }),
    build(root, d) {
      const H = window.HUSH;
      if (!H) { root.append(el('p', { class: 'note', text: 'Hush Bush couldn’t load. Reload the page to try again.' })); return; }
      d.goal ??= H.goals.whisper; d.preset ??= 'whisper';
      d.pace ||= 2; d.mode ||= 'hide';
      if (!H.scenes[d.scene]) d.scene = 'bush';
      d.out ||= [];
      d.seenBy ||= {};
      if (Array.isArray(d.seen)) {   // older single-scene list: give it to the current class
        ((d.seenBy[activeClass().id] ||= {}).bush ||= []).push(...d.seen); delete d.seen;
      }
      const sc = () => H.scenes[d.scene];
      const seenList = (scene = d.scene) => ((d.seenBy[activeClass().id] ||= {})[scene] ||= []);
      const rarity = c => c.weight <= 2 ? 'Rare' : c.weight <= 5 ? 'Uncommon' : 'Common';

      const stage = el('div', { class: 'hb-stage' });
      const scene = el('div', { class: 'hb-scene' });
      const bgHost = el('div', { class: 'hb-bg-host' });
      const critters = el('div', { class: 'hb-critters' });
      const hazeText = el('span');
      const haze = el('div', { class: 'hb-haze', 'aria-hidden': 'true' }, hazeText);
      const msg = el('p', { class: 'hb-msg', role: 'status' });
      const startTitle = el('p', { class: 'hb-start-title' });
      const sceneChips = el('div', { class: 'hb-scenes', role: 'group', 'aria-label': 'Choose a scene' });
      const startCard = el('div', { class: 'hb-start' },
        startTitle,
        sceneChips,
        el('div', { class: 'hb-start-btns' },
          el('button', { class: 'w-btn go', text: 'Start listening', onclick: () => start() }),
          el('button', { class: 'w-btn', text: 'Meet the animals', onclick: () => openGallery(d.scene) })),
        msg,
        el('p', { class: 'hb-start-note', text: 'Uses the microphone only to measure how loud the room is. Nothing is recorded or sent anywhere.' }));
      scene.append(bgHost, critters, haze, startCard);
      stage.append(scene);

      /* ---- animals on screen ---- */
      const drawCritter = (o, isNew) => {
        const c = sc().critters[o.k], s = sc().slots[o.slot];
        const node = el('div', { class: 'hb-critter hb-' + s.type + (isNew ? ' new' : ''), title: c.name,
          style: `left:${s.x}%;top:${s.y}%;width:${(c.size * (s.s || 1)).toFixed(2)}%;--d:${(Math.random() * 2).toFixed(2)}s` });
        node.innerHTML = `<svg viewBox="0 0 60 60" role="img" aria-label="${c.name}">${c.art}</svg>`;
        node.dataset.slot = o.slot;
        critters.append(node);
      };
      const paintScene = () => {
        const S = sc();
        bgHost.innerHTML = `<svg class="hb-bg" viewBox="0 0 400 225" preserveAspectRatio="none" aria-hidden="true">${S.bg}</svg>`;
        scene.style.setProperty('--hz', S.haze);
        scene.style.setProperty('--hz-ink', S.hazeInk);
        hazeText.textContent = S.hazeText;
        startTitle.textContent = `Shh… ${S.title} are shy`;
        d.out = d.out.filter(o => S.critters[o.k] && S.slots[o.slot]);
        critters.replaceChildren();
        d.out.forEach(o => drawCritter(o, false));
        sceneChips.replaceChildren(...Object.entries(H.scenes).map(([k, s]) =>
          el('button', { class: 'hb-scene-chip tone-' + s.tone + (k === d.scene ? ' on' : ''), text: s.name,
            'aria-pressed': String(k === d.scene), onclick: () => setScene(k) })));
      };
      const setScene = k => {
        if (k === d.scene) return;
        d.scene = k; d.out = []; save();
        quiet = 0; due = firstDue(); setLoud(false);
        paintScene(); syncSet();
      };

      const arrive = () => {
        const S = sc();
        const used = new Set(d.out.map(o => o.slot));
        const onScreen = new Set(d.out.map(o => o.k));
        const options = Object.entries(S.critters).flatMap(([k, c]) => {
          const slots = Object.keys(S.slots).filter(id => !used.has(id) && c.spots.includes(S.slots[id].type));
          return slots.length ? [{ k, slots, w: c.weight * (onScreen.has(k) ? 0.15 : 1) }] : [];
        });
        if (!options.length) return;   // every spot is taken
        let r = Math.random() * options.reduce((t, o) => t + o.w, 0);
        const pick = options.find(o => (r -= o.w) <= 0) || options[options.length - 1];
        const o = { k: pick.k, slot: pick.slots[Math.floor(Math.random() * pick.slots.length)] };
        d.out.push(o);
        const seen = seenList();
        if (!seen.includes(o.k)) seen.push(o.k);
        save(); drawCritter(o, true); syncSet();
      };
      const leaveOne = () => {
        if (!d.out.length) return;
        const o = d.out.splice(Math.floor(Math.random() * d.out.length), 1)[0];
        save();
        const node = critters.querySelector(`[data-slot="${o.slot}"]:not(.leave)`);
        if (!node) return;
        node.style.setProperty('--away', sc().slots[o.slot].x < 50 ? '-60vw' : '60vw');
        node.classList.add('leave');
        setTimeout(() => node.remove(), 1500);
      };

      /* ---- meet the animals ---- */
      const gallery = el('div', { class: 'hb-gallery', hidden: true, role: 'dialog', 'aria-label': 'Meet the animals' });
      const openGallery = k => {
        const S = H.scenes[k], seen = seenList(k);
        const list = Object.entries(S.critters).sort((a, b) => b[1].weight - a[1].weight);
        gallery.replaceChildren(
          el('div', { class: 'hb-gal-head' },
            el('div', { class: 'hb-scenes' }, Object.entries(H.scenes).map(([sk, s]) =>
              el('button', { class: 'hb-scene-chip tone-' + s.tone + (sk === k ? ' on' : ''), text: s.name, onclick: () => openGallery(sk) }))),
            el('button', { class: 'w-btn round', text: '✕', 'aria-label': 'Close', onclick: () => { gallery.hidden = true; } })),
          el('p', { class: 'hb-gal-sub', text: `${S.name}: ${list.length} animals · ${activeClass().name || 'This class'} has spotted ${seen.length}` }),
          el('div', { class: 'hb-gal-grid' }, list.map(([ck, c]) => {
            const card = el('div', { class: 'hb-card' + (seen.includes(ck) ? ' seen' : '') + (c.weight <= 2 ? ' rare' : '') });
            const pic = el('div', { class: 'hb-card-pic', style: `background:${S.card || '#f4f4f7'}` });
            pic.innerHTML = `<svg viewBox="0 0 60 60" aria-hidden="true">${c.art}</svg>`;
            card.append(pic, el('span', { class: 'hb-card-name', text: c.name }),
              el('span', { class: 'hb-card-tag', text: (c.weight <= 2 ? '★ ' : '') + rarity(c) + (seen.includes(ck) ? ' · spotted' : '') }));
            return card;
          })),
          ...(k !== d.scene ? [el('div', { class: 'hb-gal-foot' },
            el('button', { class: 'w-btn go', text: `Use the ${S.name.toLowerCase()} scene`, onclick: () => { setScene(k); gallery.hidden = true; } }))] : []));
        gallery.hidden = false;
      };

      /* ---- listening ---- */
      let stream = null, ctx = null, an = null, buf = null, timer = null, last = 0;
      let level = 0, pressure = 0, loud = false, calmFor = 0, quiet = 0, leaveIn = 0;
      let due = 0;
      const firstDue = () => 10 + Math.random() * 10;
      const setLoud = on => { loud = on; scene.classList.toggle('loud', on); };
      const tick = () => {
        const t = performance.now(), dt = Math.min(0.5, (t - last) / 1000); last = t;
        an.getFloatTimeDomainData(buf);
        let sum = 0; for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
        const db = 20 * Math.log10(Math.sqrt(sum / buf.length) + 1e-9);
        const raw = clamp((db + 70) / 60 * 100, 0, 100);
        level = raw > level ? level * 0.6 + raw * 0.4 : level * 0.92 + raw * 0.08;
        const over = level > d.goal, big = level > d.goal + 15;
        if (!loud) {
          pressure = over ? pressure + dt / (big ? 1 : 5) : Math.max(0, pressure - dt / 2);
          if (pressure >= 1) { setLoud(true); calmFor = 0; leaveIn = 1; }
        } else {
          calmFor = over ? 0 : calmFor + dt;
          if (calmFor >= 2.5) { setLoud(false); pressure = 0; if (!d.out.length) { quiet = 0; due = firstDue(); } }
        }
        if (loud) {
          if (d.mode === 'hide' && (leaveIn -= dt) <= 0) { leaveOne(); leaveIn = 5; }
        } else if ((quiet += dt) >= due) {
          quiet = 0; due = d.pace * 60; arrive();
        }
        meterFill.style.width = level.toFixed(1) + '%';
        meter.classList.toggle('over', over);
      };
      const start = async () => {
        msg.textContent = '';
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
        } catch (e) {
          msg.textContent = e && e.name === 'NotFoundError' ? 'No microphone was found on this computer.'
            : 'The microphone is blocked. Allow it from the icon in the address bar, then try again.';
          return;
        }
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        an = ctx.createAnalyser(); an.fftSize = 2048;
        buf = new Float32Array(an.fftSize);
        ctx.createMediaStreamSource(stream).connect(an);
        level = 0; pressure = 0; quiet = 0; due = d.out.length ? d.pace * 60 : firstDue();
        last = performance.now();
        timer = setInterval(tick, 100);
        scene.classList.add('on'); gallery.hidden = true;
        go.textContent = 'Stop'; go.setAttribute('aria-label', 'Stop listening');
      };
      const stop = () => {
        clearInterval(timer); timer = null;
        stream?.getTracks().forEach(t => t.stop()); stream = null;
        ctx?.close().catch(() => {}); ctx = null;
        setLoud(false); scene.classList.remove('on');
        meterFill.style.width = '0%';
        go.textContent = 'Start'; go.setAttribute('aria-label', 'Start listening');
      };

      /* ---- teacher controls ---- */
      const go = el('button', { class: 'w-btn go', text: 'Start', 'aria-label': 'Start listening', onclick: () => timer ? stop() : start() });
      const goalMark = el('i', { class: 'hb-goal' });
      const meterFill = el('b');
      const meter = el('span', { class: 'hb-meter', title: 'Room loudness and the quiet goal' }, meterFill, goalMark);
      const presetBtns = Object.entries({ silent: 'Silent', whisper: 'Whisper', partner: 'Partners' }).map(([k, t]) =>
        el('button', { class: 'w-btn', text: t, onclick: () => { d.preset = k; d.goal = H.goals[k]; save(); syncSet(); } }));
      const set = el('div', { class: 'hb-set', hidden: true });
      const moreBtn = el('button', { class: 'w-btn round', text: '⋯', 'aria-label': 'Hush Bush settings', 'aria-expanded': 'false',
        onclick: () => { set.hidden = !set.hidden; moreBtn.setAttribute('aria-expanded', String(!set.hidden)); } });
      const choice = (label, opts, get, put) => el('div', { class: 'hb-set-row' }, el('span', { text: label }),
        el('span', { class: 'hb-set-opts' }, opts.map(([v, t]) =>
          el('button', { class: 'w-btn' + (get() === v ? ' on' : ''), text: t, onclick: () => { put(v); save(); syncSet(); } }))));
      const syncSet = () => {
        presetBtns.forEach((b, i) => b.classList.toggle('on', d.preset === ['silent', 'whisper', 'partner'][i]));
        goalMark.style.left = d.goal + '%';
        const total = Object.keys(sc().critters).length;
        set.replaceChildren(
          el('div', { class: 'hb-set-row' }, el('span', { text: 'Scene' }),
            el('select', { class: 'hb-select', 'aria-label': 'Scene', onchange: e => setScene(e.target.value) },
              Object.entries(H.scenes).map(([k, s]) => el('option', { value: k, text: s.name, selected: k === d.scene })))),
          choice('New animal every', [[1, '1 min'], [2, '2 min'], [5, '5 min']], () => d.pace, v => { d.pace = v; if (due > v * 60) due = v * 60; }),
          choice('When it’s too loud', [['hide', 'They hide'], ['pause', 'Just pause']], () => d.mode, v => { d.mode = v; }),
          el('div', { class: 'hb-set-row' }, el('span', { text: 'Fine-tune the goal' }),
            el('span', { class: 'hb-set-opts' },
              el('button', { class: 'w-btn round', text: '−', 'aria-label': 'Stricter (quieter)', onclick: () => { d.goal = clamp(d.goal - 4, 5, 95); d.preset = ''; save(); syncSet(); } }),
              el('button', { class: 'w-btn round', text: '+', 'aria-label': 'Looser (louder)', onclick: () => { d.goal = clamp(d.goal + 4, 5, 95); d.preset = ''; save(); syncSet(); } }))),
          el('div', { class: 'hb-set-row' }, el('span', { text: `Spotted here: ${seenList().length} of ${total}` }),
            el('span', { class: 'hb-set-opts' },
              el('button', { class: 'w-btn', text: 'Meet the animals', onclick: () => { set.hidden = true; openGallery(d.scene); } }),
              el('button', { class: 'w-btn', text: 'Send home', title: 'Clear the scene for the next class', onclick: () => {
                d.out = []; save(); critters.replaceChildren(); quiet = 0; due = firstDue();
              } }))),
          el('p', { class: 'hb-set-note', text: 'The line on the meter is the quiet goal. 10–20 quiet seconds bring the first animal out. Each class keeps its own spotted list.' }));
      };
      paintScene(); syncSet();
      root.append(stage, el('div', { class: 'w-row hb-ctrl' }, go, el('span', { class: 'hb-presets' }, presetBtns), meter, moreBtn));
      stage.append(gallery, set);
      return stop;
    },
  },

  /* Magic Jewels: whole-class counting game. Tiles, palettes, item shapes and the
     characters come from jewels-data.js. Names and results stay in this browser. */
  jewels: {
    title: 'Magic Jewels', icon: 'jewels', tone: 'mauve', w: 1000, h: 600, minH: 380,
    pos: () => {
      const w = Math.min(1000, innerWidth - 120), h = Math.min(600, innerHeight - 32);
      return { w, h, x: Math.max(100, Math.round((innerWidth - w) / 2)), y: Math.max(16, Math.round((innerHeight - h) / 2)) };
    },
    build(root, d) {
      const J = window.JEWELS;
      if (!J) { root.append(el('p', { class: 'note', text: 'Magic Jewels couldn’t load. Reload the page to try again.' })); return; }
      root.classList.add('mj-root');
      const node = root.closest('.widget');
      node?.classList.toggle('mj-max', !!d.max);
      const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
      d.byClass ||= {};
      if (!J.themes[d.theme]) d.theme = 'jewels';
      const cls = activeClass();
      const S = d.byClass[d.test ? 'test' : cls.id] ||= {};
      S.pool ||= []; S.chars ||= []; S.history ||= [];
      const roster = () => d.test ? J.testNames.slice() : present(cls);
      const total = J.tiles.length;
      const tileOf = n => J.tiles.find(t => t.n === n);
      const themeKey = () => (S.game && J.themes[S.game.theme]) ? S.game.theme : d.theme;
      const themeOf = () => J.themes[themeKey()];
      const word = n => n === 1 ? themeOf().one : themeOf().noun;
      const palKeys = Object.keys(J.palettes);
      const paint = (art, pal) => art.replace(/\{(\d)\}/g, (_, i) => pal[+i] || pal[0]);

      const timers = new Set();
      const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); return t; };
      let idle = null, overlay = null, cur = null, inkCtl = null, busy = false, spinning = false, autoOn = false;

      /* ---- the picture and its 20 covers ---- */
      const pic = el('div', { class: 'mj-pic' });
      const covers = el('div', { class: 'mj-covers' });
      const fx = el('div', { class: 'mj-fx' });
      const stage = el('div', { class: 'mj-stage' }, pic, covers, fx);
      const host = el('div', { class: 'mj-host' }, stage);
      const syncCovers = () => {
        const done = S.game?.cleared || 0;
        [...covers.children].forEach(c => {
          const n = +c.dataset.n;
          c.classList.toggle('gone', n <= done);
          c.classList.toggle('next', !!S.game && !S.game.done && n === done + 1);
        });
      };
      const paintPic = () => {
        const g = S.game, ch = g && J.characters[g.char];
        pic.className = 'mj-pic' + (ch ? ' k-' + g.char : '');
        pic.innerHTML = `<svg viewBox="0 0 700 300" aria-hidden="true">${J.background}${ch ? `<g class="mj-char">${ch.art}</g>` : ''}</svg>`;
        covers.replaceChildren(...J.tiles.map(t => el('div', {
          class: 'mj-cover', 'data-n': t.n, style: `grid-column:${t.col};grid-row:${t.row} / span ${t.rows || 1}`,
        }, el('span', { text: String(t.n) }))));
        fx.replaceChildren();
        syncCovers();
      };
      const anim = (name, ms) => {
        if (reduce()) return;
        pic.classList.remove('quirk', 'cheer', 'tilt', 'welcome');
        void pic.offsetWidth;
        pic.classList.add(name);
        later(() => pic.classList.remove(name), ms);
      };
      const cellStyle = t => `left:${(t.col - 1) / J.grid.cols * 100}%;top:${(t.row - 1) / J.grid.rows * 100}%;` +
        `width:${100 / J.grid.cols}%;height:${(t.rows || 1) * 100 / J.grid.rows}%`;
      const burst = t => {
        if (reduce()) return;
        const b = el('div', { class: 'mj-burst', style: cellStyle(t) });
        const cols = ['#EF9F27', '#D4537E', '#7F77DD'];
        b.innerHTML = '<svg viewBox="0 0 100 100">' + [[22, 22, 11], [80, 18, 8], [50, 50, 15], [16, 78, 8], [82, 76, 12], [52, 8, 6], [48, 92, 7]]
          .map(([x, y, r], i) => `<g style="animation-delay:${(i * 0.07).toFixed(2)}s">${J.star(x, y, r, cols[i % 3])}</g>`).join('') + '</svg>';
        fx.append(b); later(() => b.remove(), 1900);
      };
      const toast = text => { const t = el('div', { class: 'mj-toast', role: 'status', text }); fx.append(t); later(() => t.remove(), 2100); };

      /* ---- a counting array: scattered at random, never in a set pattern ---- */
      const AW = 160, AH = 100;
      const sparkles = items => {
        const [lo, hi] = J.sparklesPerArray;
        const want = lo + Math.floor(Math.random() * (hi - lo + 1));
        const out = [];
        for (let t = 0; out.length < want && t < 800; t++) {
          const r = 2.6 + Math.random() * 2.6, x = 5 + Math.random() * (AW - 10), y = 5 + Math.random() * (AH - 10);
          if (items.some(o => Math.hypot(o.x - x, o.y - y) < o.k / 2 + r + 1.5)) continue;
          if (out.some(o => Math.hypot(o.x - x, o.y - y) < 12)) continue;
          out.push({ x, y, r, c: rand(J.sparkleColours), dl: Math.random() * 2.4 });
        }
        return out;
      };
      const layout = count => {
        let s = Math.min(32, Math.sqrt(AW * AH * 0.4 / count));
        for (let attempt = 0; attempt < 60; attempt++, s *= 0.95) {
          const items = [];
          for (let tries = 0; items.length < count && tries < 4000; tries++) {
            const k = s * (0.88 + Math.random() * 0.24);
            const x = k / 2 + 3 + Math.random() * (AW - k - 6), y = k / 2 + 3 + Math.random() * (AH - k - 6);
            if (items.some(o => Math.hypot(o.x - x, o.y - y) < (o.k + k) / 2 * 1.06)) continue;
            items.push({ x, y, k, r: Math.random() * 36 - 18, p: rand(palKeys) });
          }
          if (items.length === count) return { items, sparkles: sparkles(items) };
        }
        return { items: [], sparkles: [] };
      };
      const arraySvg = lay => {
        const art = themeOf().art;
        const items = lay.items.map(o => `<g transform="translate(${o.x.toFixed(1)} ${o.y.toFixed(1)}) rotate(${o.r.toFixed(0)}) scale(${(o.k / 40).toFixed(3)}) translate(-20 -20)">${paint(art, J.palettes[o.p])}</g>`).join('');
        const sp = lay.sparkles.map(o => `<g class="mj-spark" style="animation-delay:${o.dl.toFixed(2)}s">${J.star(+o.x.toFixed(1), +o.y.toFixed(1), +o.r.toFixed(1), o.c)}</g>`).join('');
        return `<svg viewBox="0 0 ${AW} ${AH}" role="img" aria-label="A group of ${themeOf().noun} to count">${sp}${items}</svg>`;
      };
      const itemIcon = k => {
        const s = el('span', { class: 'mj-theme-ico', 'aria-hidden': 'true' });
        s.innerHTML = `<svg viewBox="0 0 40 40">${paint(J.themes[k].art, J.palettes[palKeys[Object.keys(J.themes).indexOf(k) % palKeys.length]])}</svg>`;
        return s;
      };

      /* ---- writing pad over the array ---- */
      const ink = canvas => {
        const ctx = canvas.getContext('2d');
        let last = null;
        const pen = () => {
          ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = ctx.fillStyle = '#ffffff';
          ctx.lineWidth = clamp(canvas.clientHeight / 32, 6, 16);
          ctx.shadowColor = 'rgba(25, 20, 50, .9)'; ctx.shadowBlur = 5;
        };
        const fit = () => {
          const dpr = devicePixelRatio || 1;
          canvas.width = Math.round(canvas.clientWidth * dpr); canvas.height = Math.round(canvas.clientHeight * dpr);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0); pen();
        };
        const at = e => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
        canvas.addEventListener('pointerdown', e => {
          e.preventDefault(); canvas.setPointerCapture(e.pointerId); last = at(e);
          ctx.beginPath(); ctx.arc(last[0], last[1], ctx.lineWidth / 2, 0, 7); ctx.fill();
        });
        canvas.addEventListener('pointermove', e => {
          if (!last) return;
          const p = at(e);
          ctx.beginPath(); ctx.moveTo(...last); ctx.lineTo(...p); ctx.stroke(); last = p;
        });
        const up = () => { last = null; };
        canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
        const ro = new ResizeObserver(fit); ro.observe(canvas);
        return { clear: () => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.restore(); }, stop: () => ro.disconnect() };
      };

      /* ---- bar: spinner, progress, controls ---- */
      const nameBox = el('div', { class: 'mj-name-box', role: 'status', 'aria-live': 'polite' });
      const spinBtn = el('button', { class: 'w-btn go', text: 'Spin', onclick: () => spin() });
      const info = el('span', { class: 'mj-info' });
      const fullBtn = el('button', { class: 'w-btn', onclick: () => setMax(!d.max) });
      const endBtn = el('button', { class: 'w-btn', text: 'End game', onclick: () => endGame() });
      const setPanel = el('div', { class: 'mj-set', hidden: true });
      const bar = el('div', { class: 'mj-bar' }, nameBox, spinBtn, info, el('span', { class: 'mj-grow' }),
        el('button', { class: 'w-btn round', text: '⋯', title: 'Settings', 'aria-label': 'Game settings', onclick: () => toggleSet() }),
        fullBtn, endBtn);
      const showName = t => {
        nameBox.textContent = t || 'Spin to choose a counter';
        nameBox.classList.toggle('blank', !t);
      };
      const syncBar = () => {
        const g = S.game, live = !!g && !g.done && g.cleared < total;
        spinBtn.disabled = !live || !!g.turn || spinning || !roster().length;
        endBtn.disabled = !live;
        fullBtn.textContent = d.max ? 'Exit full screen' : 'Full screen';
        if (!live) { info.textContent = ''; showName(''); return; }
        info.textContent = g.turn ? `Tile ${g.cleared + 1}` : `Next: tile ${g.cleared + 1} of ${total}`;
        if (!spinning) showName(g.turn ? (g.turn.phase === 'class' ? 'The class' : g.turn.name) : '');
      };
      const setMax = on => {
        d.max = on; node?.classList.toggle('mj-max', on); save(); syncBar();
        if (on) document.documentElement.requestFullscreen?.().catch(() => {});
        else if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      };

      /* ---- spinners: each name (and each character) once before any repeats ---- */
      const takeName = () => {
        const here = roster();
        S.pool = S.pool.filter(n => here.includes(n));
        if (!S.pool.length) S.pool = here.slice();
        const name = rand(S.pool);
        S.pool = S.pool.filter(n => n !== name);
        return name;
      };
      const takeChar = () => {
        const all = Object.keys(J.characters);
        S.chars = S.chars.filter(k => all.includes(k));
        if (!S.chars.length) S.chars = all.slice();
        const k = rand(S.chars);
        S.chars = S.chars.filter(x => x !== k);
        return k;
      };
      const pickCount = n => { const t = tileOf(n); return t.min + Math.floor(Math.random() * (t.max - t.min + 1)); };

      const spin = () => {
        const g = S.game;
        if (!g || g.done || g.cleared >= total || g.turn || spinning || overlay) return;
        const here = roster();
        if (!here.length) return;
        const winner = takeName();
        save();
        spinning = true; setPanel.hidden = true; syncBar();
        nameBox.classList.remove('pop');
        const land = () => {
          spinning = false;
          showName(winner);
          g.turn = { name: winner, count: pickCount(g.cleared + 1), phase: 'child' };
          g.turns++; save(); syncBar();
          if (!reduce()) { void nameBox.offsetWidth; nameBox.classList.add('pop'); }
          later(openTurn, reduce() ? 300 : 900);
        };
        if (reduce() || here.length < 2) { land(); return; }
        let i = 0, wait = 45;
        const step = () => {
          if (++i > 20) { land(); return; }
          let n;
          do n = rand(here); while (n === nameBox.textContent);
          showName(n); wait *= 1.13; later(step, wait);
        };
        step();
      };

      /* ---- one turn: show the next tile's array big, write, then tap the number ---- */
      const closeTurn = () => { inkCtl?.stop(); inkCtl = null; overlay?.remove(); overlay = null; cur = null; busy = false; };
      const openTurn = () => {
        const g = S.game, t = g?.turn;
        if (!t || overlay || g.done) return;
        const n = g.cleared + 1;
        const ask = el('h3', { class: 'mj-ask' });
        const sub = el('p', { class: 'mj-sub' });
        const art = el('div', { class: 'mj-art' });
        art.innerHTML = arraySvg(layout(t.count));       // a fresh layout every time the tile is shown
        const canvas = el('canvas', { class: 'mj-ink', 'aria-label': 'Write the number here' });
        const keys = el('div', { class: 'mj-keys', role: 'group', 'aria-label': 'Tap the number' },
          Array.from({ length: 20 }, (_, i) => el('button', { class: 'mj-key', text: String(i + 1), onclick: () => answer(i + 1) })));
        const passBtn = el('button', { class: 'w-btn', text: 'Pass to the class', onclick: () => pass() });
        overlay = el('div', { class: 'mj-turn', role: 'dialog', 'aria-label': `Tile ${n}` },
          el('div', { class: 'mj-turn-head' }, el('span', { class: 'mj-tile-no', text: `Tile ${n}` }), ask, sub),
          el('div', { class: 'mj-board' }, art, canvas),
          keys,
          el('div', { class: 'mj-turn-foot' },
            el('button', { class: 'w-btn', text: 'Rub out', onclick: () => inkCtl?.clear() }),
            passBtn,
            d.test ? el('span', { class: 'mj-peek', text: `Test answer: ${t.count}` }) : null,
            el('span', { class: 'mj-grow' }),
            el('button', { class: 'w-btn', text: 'Skip this turn', title: 'Close without an answer', onclick: () => {
              closeTurn(); g.turn = null; save(); syncBar();
            } })));
        const words = () => {
          const cl = t.phase === 'class';
          overlay.classList.toggle('class', cl);
          ask.textContent = cl ? `Class, how many ${themeOf().noun}?` : `${t.name}, how many ${themeOf().noun}?`;
          sub.textContent = cl ? 'Count together, then tap the number.' : `Write the number over the ${themeOf().noun}, then tap it below.`;
          passBtn.hidden = cl;
        };
        cur = { ask, sub, keys, words };
        words();
        root.append(overlay);
        inkCtl = ink(canvas);
        syncBar();
      };
      const answer = v => {
        const g = S.game, t = g?.turn;
        if (!t || busy || !cur) return;
        busy = true;
        cur.keys.querySelectorAll('button').forEach(b => { b.disabled = true; b.classList.toggle('picked', +b.textContent === v); });
        if (v === t.count) {
          overlay.classList.add('right');
          cur.ask.textContent = `Yes! ${t.count} ${word(t.count)}!`;
          cur.sub.textContent = t.phase === 'class' ? 'Well counted, everyone!' : `Well counted, ${t.name}!`;
          later(() => { closeTurn(); clearTile(); }, reduce() ? 1000 : 1700);
        } else {
          overlay.classList.add('wrong');
          cur.ask.textContent = 'Not this time.';
          cur.sub.textContent = 'The tile stays where it is. Spin for the next counter.';
          later(() => { closeTurn(); g.turn = null; save(); syncBar(); anim('tilt', 1600); autoNext(); }, 2000);
        }
      };
      const pass = () => {
        const t = S.game?.turn;
        if (!t || busy || !cur || t.phase === 'class') return;
        t.phase = 'class'; S.game.passes++; save();
        inkCtl?.clear(); cur.words(); syncBar();
      };
      const clearTile = () => {
        const g = S.game;
        g.cleared++; g.turn = null; save();
        const n = g.cleared;
        syncCovers(); burst(tileOf(n));
        if (n >= total) { welcome(); return; }
        anim('cheer', 1500);
        toast(`Tile ${n} uncovered!`);
        syncBar(); autoNext();
      };
      const welcome = () => {
        const ch = J.characters[S.game.char];
        beep(); syncBar();
        if (!reduce()) { pic.classList.remove('quirk', 'cheer', 'tilt'); void pic.offsetWidth; pic.classList.add('welcome'); }
        fx.append(el('div', { class: 'mj-welcome', role: 'status' }, el('span', { text: 'Meet' }), el('strong', { text: ch.title })));
        later(() => finish(true), reduce() ? 3500 : 5200);
      };

      /* ---- start, end and results ---- */
      const startGame = () => {
        if (!roster().length) return;
        S.game = { char: takeChar(), theme: d.theme, cleared: 0, turn: null, turns: 0, passes: 0, started: today(), done: false };
        save(); render();
      };
      const finish = found => {
        const g = S.game;
        if (!g || g.done) return;
        closeTurn();
        Object.assign(g, { done: true, found, turn: null });
        S.history.unshift({ date: today(), char: g.char, found, cleared: g.cleared, turns: g.turns, passes: g.passes });
        S.history.length = Math.min(S.history.length, 40);
        if (!found && !S.chars.includes(g.char)) S.chars.push(g.char);   // not met yet, so it can come back
        if (!found) beep();
        save(); render();
      };
      const endGame = () => {
        if (!S.game || S.game.done || S.game.cleared >= total) return;
        if (confirm('End this game now? The mystery friend stays hidden for another day.')) finish(false);
      };
      const setTest = on => { d.test = on; save(); rebuild('jewels'); };

      const startCard = () => {
        const here = roster();
        return el('div', { class: 'mj-start' },
          el('h3', { class: 'mj-title', text: 'Magic Jewels' }),
          el('p', { class: 'mj-lead', text: 'Count what’s on each tile to uncover a mystery friend.' }),
          el('div', { class: 'mj-themes', role: 'group', 'aria-label': 'Choose what to count' },
            Object.entries(J.themes).map(([k, th]) => el('button', {
              class: 'mj-theme' + (k === d.theme ? ' on' : ''), 'aria-pressed': String(k === d.theme),
              onclick: () => { d.theme = k; save(); render(); },
            }, itemIcon(k), el('span', { text: th.name })))),
          here.length ? null : el('p', { class: 'mj-lead', text: 'There are no names in this class yet. Add a class list, or try test mode.' }),
          el('div', { class: 'w-row' },
            el('button', { class: 'w-btn go', text: 'Start game', disabled: !here.length, onclick: startGame }),
            here.length ? null : el('button', { class: 'w-btn', text: 'Add class list', onclick: openClassDialog }),
            el('button', { class: 'w-btn', text: d.test ? 'Leave test mode' : 'Test mode', onclick: () => setTest(!d.test) })),
          el('p', { class: 'mj-small', text: d.test
            ? 'Test mode uses made-up names and shows the answer on each tile.'
            : `For ${cls.name || 'this class'}. Names and games are saved only on this device.` }));
      };
      const results = () => {
        const g = S.game, ch = J.characters[g.char];
        const met = [...new Set(S.history.filter(h => h.found).map(h => J.characters[h.char]?.name).filter(Boolean))];
        const helped = g.passes === 1 ? 'once' : `${g.passes} times`;
        return el('div', { class: 'mj-results', role: 'status' },
          el('div', { class: 'mj-res-text' },
            el('h3', { text: g.found ? `You found ${ch.title}!` : 'That’s the end of this game' }),
            el('p', { text: g.found
              ? `All ${total} tiles uncovered in ${g.turns} turns.` + (g.passes ? ` The class helped ${helped}.` : '')
              : `${g.cleared} of ${total} tiles uncovered. The mystery friend stays hidden for another day.` }),
            met.length ? el('p', { class: 'mj-met', text: `Friends ${d.test ? 'found in test mode' : `${cls.name || 'this class'} has met`}: ${met.join(', ')}` }) : null),
          el('div', { class: 'w-row' },
            el('button', { class: 'w-btn go', text: 'New game', onclick: () => { S.game = null; save(); render(); } }),
            fullBtn));
      };
      const toggleSet = () => {
        if (!setPanel.hidden) { setPanel.hidden = true; return; }
        const here = roster();
        const left = S.pool.filter(n => here.includes(n)).length || here.length;
        setPanel.replaceChildren(...[
          el('div', { class: 'mj-set-row' }, el('span', { text: 'Count' }),
            el('span', { class: 'mj-set-opts' }, Object.entries(J.themes).map(([k, th]) => el('button', {
              class: 'w-btn' + (k === themeKey() ? ' on' : ''), text: th.name, onclick: () => {
                d.theme = k; if (S.game) S.game.theme = k; save(); setPanel.hidden = true;
                if (overlay && !busy) { closeTurn(); openTurn(); }
              } })))),
          el('div', { class: 'mj-set-row' }, el('span', { text: `Spinner: ${left} of ${here.length} names left` }),
            el('button', { class: 'w-btn', text: 'Start the names again', onclick: () => { S.pool = []; save(); setPanel.hidden = true; } })),
          !d.test && state.classes.length > 1 ? el('div', { class: 'mj-set-row' }, el('span', { text: 'Class' }), classSwitch()) : null,
          el('div', { class: 'mj-set-row' }, el('span', { text: 'Test mode (made-up names)' }),
            el('button', { class: 'w-btn', text: d.test ? 'Turn off' : 'Turn on', onclick: () => setTest(!d.test) })),
          d.test ? el('div', { class: 'mj-set-row' }, el('span', { text: 'Play the whole game by itself' }),
            el('button', { class: 'w-btn', text: autoOn ? 'Stop' : 'Play it for me', onclick: () => {
              autoOn = !autoOn; setPanel.hidden = true; if (autoOn) autoNext();
            } })) : null,
          el('p', { class: 'mj-set-note', text: 'Games save as you go, so you can close Magic Jewels or switch class and carry on later. Names and results stay on this device.' }),
        ].filter(Boolean));
        setPanel.hidden = false;
      };

      /* test mode: plays turns by itself (mostly right, some wrong, some passes) */
      const autoNext = () => {
        if (!autoOn || !d.test) return;
        later(() => {
          if (!autoOn) return;
          const g = S.game;
          if (!g) { startGame(); autoNext(); return; }
          if (g.done) { autoOn = false; return; }
          if (!g.turn && !spinning) spin();
          else if (overlay && !busy) {
            const t = g.turn, r = Math.random();
            if (t.phase === 'child' && r < 0.15) { pass(); autoNext(); return; }
            answer(r < 0.85 ? t.count : t.count % 20 + 1);
            return;
          }
          autoNext();
        }, 900);
      };

      const render = () => {
        closeTurn(); setPanel.hidden = true;
        paintPic();
        const g = S.game;
        root.replaceChildren(...[
          d.test ? el('p', { class: 'mj-test-flag', text: 'Test mode: made-up names, and the answer shows on each tile' }) : null,
          host,
          g?.done ? results() : bar,
          g ? null : startCard(),
          setPanel,
        ].filter(Boolean));
        syncBar();
        if (g && !g.done && g.cleared >= total) later(() => finish(true), 300);   // closed during the welcome
        else if (g?.turn && !g.done) openTurn();
      };
      render();
      idle = setInterval(() => {
        if (S.game && !S.game.done && !overlay && !spinning && document.visibilityState === 'visible') anim('quirk', 2400);
      }, 11000);
      return () => { timers.forEach(clearTimeout); timers.clear(); clearInterval(idle); closeTurn(); };
    },
  },

  /* Santa's Sleigh: a word-hunt warm-up. The spinner calls a child up to find a word in the
     snowy picture; each word found goes into Santa's sack, then the sleigh takes off and the
     class reads the sack together. The picture and word spots come from sleigh-data.js. */
  sleigh: {
    title: 'Santa’s Sleigh', icon: 'sleigh', tone: 'rose', w: 1000, h: 660, minH: 400,
    pos: () => {
      const w = Math.min(1000, innerWidth - 120), h = Math.min(660, innerHeight - 32);
      return { w, h, x: Math.max(100, Math.round((innerWidth - w) / 2)), y: Math.max(16, Math.round((innerHeight - h) / 2)) };
    },
    build(root, d) {
      const Z = window.SLEIGH;
      if (!Z) { root.append(el('p', { class: 'note', text: 'Santa’s Sleigh couldn’t load. Reload the page to try again.' })); return; }
      root.classList.add('mj-root', 'ss-root');
      const node = root.closest('.widget');
      node?.classList.toggle('mj-max', !!d.max);
      const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
      const cleanWords = list => [...new Set((list || []).map(w => String(w).toLowerCase().trim())
        .filter(w => /^[a-z]{1,12}$/.test(w)))].slice(0, 80);
      d.words = cleanWords(d.words);
      if (!d.words.length) d.words = Z.words.slice();
      d.sound ??= true; d.listen ??= false; d.byClass ||= {};
      const cls = activeClass();
      const S = d.byClass[d.test ? 'test' : cls.id] ||= {};
      S.pool ||= []; S.history ||= []; S.carry ||= [];
      const roster = () => d.test ? Z.testNames.slice() : present(cls);
      const spotOf = id => Z.spots.find(s => s.id === id);
      const homeOf = w => Z.spots.find(s => s.home === w)?.id;

      let dead = false, busy = false, spinning = false, autoOn = false, hintT = null;
      const timers = new Set();
      const later = (fn, ms) => {
        if (dead) return null;
        const t = setTimeout(() => { timers.delete(t); if (!dead) fn(); }, ms);
        timers.add(t); return t;
      };
      const stop = t => { if (t) { clearTimeout(t); timers.delete(t); } };

      /* ---- voice and sounds ---- */
      const canTalk = 'speechSynthesis' in window;
      const LETTER = { a: 'ay', e: 'ee', i: 'eye', o: 'oh', u: 'you' };
      /* The plain built-in voices sound robotic. Edge's "Natural" voices (Natasha and William are
         Australian) and Chrome's Google voices sound far more human, so they're tried first.
         Natural voices need the internet; if one fails, that line is said again with a local voice. */
      let voice = null, englishVoices = [];
      const voiceScore = v => (/natural|neural/i.test(v.name) ? 100 : /online/i.test(v.name) ? 80 : /google/i.test(v.name) ? 60 : 0)
        + (/en[-_]AU/i.test(v.lang) ? 30 : /en[-_](GB|NZ|IE)/i.test(v.lang) ? 18 : /en[-_]US/i.test(v.lang) ? 10 : 0)
        + (/natasha|libby|sonia|maisie|ava|jenny|aria|emma|female/i.test(v.name) ? 6 : 0);
      const pickVoice = () => {
        englishVoices = speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang))
          .sort((a, b) => voiceScore(b) - voiceScore(a) || a.name.localeCompare(b.name));
        voice = englishVoices.find(v => v.name === d.voice) || englishVoices[0] || null;
      };
      if (canTalk) { pickVoice(); speechSynthesis.addEventListener('voiceschanged', pickVoice); }
      const isLocal = v => v.localService !== false;
      const speakWith = (text, v, retry) => {
        const u = new SpeechSynthesisUtterance(text);
        if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'en-AU';
        const natural = v && /natural|neural|online|google/i.test(v.name);
        u.rate = natural ? 1.42 : 1.36; u.pitch = natural ? 1 : 1.05;
        if (retry && v && !isLocal(v)) u.onerror = e => {
          if (e.error === 'interrupted' || e.error === 'canceled') return;
          const local = englishVoices.find(isLocal);
          if (local && local !== v) speakWith(text, local, false);
        };
        speechSynthesis.speak(u);
      };
      const say = (text, { queue = false } = {}) => {
        if (!canTalk || !d.sound) return;
        if (!queue) speechSynthesis.cancel();
        speakWith(text, voice, true);
      };
      const tones = notes => {
        if (!d.sound) return;
        try {
          const ac = new (window.AudioContext || window.webkitAudioContext)();
          notes.forEach(([f, t, len = 0.35, vol = 0.16]) => {
            const o = ac.createOscillator(), g = ac.createGain();
            o.type = 'triangle'; o.frequency.value = f; o.connect(g); g.connect(ac.destination);
            const at = ac.currentTime + t;
            g.gain.setValueAtTime(0.0001, at);
            g.gain.exponentialRampToValueAtTime(vol, at + 0.02);
            g.gain.exponentialRampToValueAtTime(0.0001, at + len);
            o.start(at); o.stop(at + len + 0.05);
          });
          setTimeout(() => ac.close(), 3000);
        } catch {}
      };
      const jingle = () => tones([[1047, 0], [1319, 0.12], [1568, 0.24, 0.5]]);
      const goldJingle = () => tones([[1047, 0], [1319, 0.1], [1568, 0.2], [2093, 0.32, 0.8]]);
      const boop = () => tones([[330, 0, 0.22, 0.1], [262, 0.14, 0.3, 0.1]]);
      const fanfare = () => tones([[784, 0], [988, 0.16], [1175, 0.32], [1568, 0.5, 0.9]]);

      /* ---- the picture ---- */
      const pic = el('div', { class: 'ss-pic' });
      /* the still picture and the moving front layer are separate, so the grained picture is
         painted once and never repainted while things animate */
      pic.innerHTML = `<svg class="ss-back" viewBox="0 0 1000 560" aria-hidden="true">${Z.scene}</svg>` +
        `<svg class="ss-front" viewBox="0 0 1000 560">${Z.front || ''}</svg>`;
      const bulbs = [...pic.querySelectorAll('.ss-bulb')].sort((a, b) => a.dataset.i - b.dataset.i);
      /* tap a character for a little surprise (any time, never counted as a wrong answer) */
      const TAP_SOUND = {
        wave: [[660, 0, 0.18], [880, 0.12, 0.25]], hop: [[523, 0, 0.12], [784, 0.1, 0.2]], slide: [[880, 0, 0.1], [660, 0.1, 0.1], [440, 0.2, 0.25]],
        nod: [[392, 0, 0.2], [523, 0.15, 0.25]], purr: [[196, 0, 0.35, 0.08], [220, 0.2, 0.35, 0.08]], hat: [[659, 0, 0.12], [988, 0.12, 0.25]],
        puff: [[262, 0, 0.3, 0.08]], flare: [[330, 0, 0.12, 0.08], [494, 0.08, 0.3, 0.1]],
      };
      pic.addEventListener('click', e => {
        const t = e.target.closest('.ss-tap');
        if (!t || t.classList.contains('go')) return;
        const kind = t.dataset.tap;
        tones(TAP_SOUND[kind] || TAP_SOUND.hop);
        if (reduce()) return;
        t.classList.add('go');
        if (kind === 'puff') pic.classList.add('puffing');
        if (kind === 'flare') pic.classList.add('flaring');
        later(() => { t.classList.remove('go'); pic.classList.remove('puffing', 'flaring'); }, 1300);
      });
      const snow = el('div', { class: 'ss-snow', 'aria-hidden': 'true' });
      const words = el('div', { class: 'ss-words', role: 'group', 'aria-label': 'Words in the picture' });
      const sackN = el('div', { class: 'ss-sack-n', 'aria-hidden': 'true', style: `left:${Z.sack.x / 10}%;top:${Z.sack.y / 5.6}%` });
      const fx = el('div', { class: 'ss-fx' });
      const stage = el('div', { class: 'ss-stage' }, pic, snow, words, sackN, fx);
      const host = el('div', { class: 'mj-host' }, stage);

      const wordBtn = (id, w, isNew) => {
        const s = spotOf(id);
        const b = el('button', {
          class: `ss-word k-${s.kind} c${s.c || 0}` + (w === S.game.golden ? ' gold' : '') + (isNew ? ' new' : ''),
          style: `left:${s.x / 10}%;top:${s.y / 5.6}%`, 'data-spot': id, text: w,
          onclick: () => tapWord(id, b),
        });
        return b;
      };
      const btnAt = id => words.querySelector(`[data-spot="${id}"]`);
      const drawWords = () => {
        const g = S.game;
        words.replaceChildren(...(g && !g.done ? Object.entries(g.board).filter(([id]) => spotOf(id)).map(([id, w]) => wordBtn(id, w)) : []));
      };
      const syncSack = () => {
        const n = S.game?.found.length || 0;
        pic.style.setProperty('--fill', String(Math.min(1, n / 25)));
        sackN.textContent = String(n);
        sackN.hidden = !S.game || S.game.done;
        /* every word found switches on more fairy lights; about 22 words lights the whole village */
        const lit = S.game?.done ? bulbs.length : Math.round(Math.min(1, n / 22) * bulbs.length);
        bulbs.forEach((b, i) => b.classList.toggle('on', i < lit));
      };
      /* more snow falls as the sack fills */
      const drawSnow = () => {
        const want = reduce() ? 0 : clamp(8 + (S.game?.found.length || 0) * 2, 8, 64);
        while (snow.children.length < want) {
          const sz = (0.35 + Math.random() * 0.6).toFixed(2);
          snow.append(el('i', { style: `left:${(Math.random() * 100).toFixed(1)}%;width:${sz}cqw;height:${sz}cqw;` +
            `--d:${(7 + Math.random() * 7).toFixed(1)}s;--dl:-${(Math.random() * 14).toFixed(1)}s;--x:${(Math.random() * 6 - 3).toFixed(1)}cqw` }));
        }
        while (snow.children.length > want) snow.lastChild.remove();
      };
      const bump = () => {
        if (reduce()) return;
        pic.classList.remove('bump'); void pic.offsetWidth; pic.classList.add('bump');
        later(() => pic.classList.remove('bump'), 700);
      };
      const toast = (text, kind = '') => {
        fx.querySelectorAll('.ss-toast').forEach(t => t.remove());
        const t = el('div', { class: 'ss-toast ' + kind, role: 'status', text });
        fx.append(t); later(() => t.remove(), 2400);
      };

      /* ---- bar under the picture ---- */
      const nameBox = el('div', { class: 'mj-name-box ss-name', role: 'status', 'aria-live': 'polite' });
      const findWord = el('span', { class: 'ss-find-word' });
      const sayBtn = el('button', { class: 'ss-say', title: 'Say it again', 'aria-label': 'Say the word again', onclick: () => askAloud() });
      sayBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>';
      const findBox = el('div', { class: 'ss-find' }, el('span', { class: 'ss-find-label', text: 'Find' }), findWord, sayBtn);
      const spinBtn = el('button', { class: 'w-btn go', text: 'Next elf', onclick: () => spin() });
      const hintBtn = el('button', { class: 'w-btn', text: 'Hint', title: 'Rudolph lights up the word', onclick: () => showHint() });
      const skipBtn = el('button', { class: 'w-btn', text: 'Skip', title: 'End this turn without the word', onclick: () => skipTurn() });
      const info = el('span', { class: 'mj-info' });
      const fullBtn = el('button', { class: 'w-btn', onclick: () => setMax(!d.max) });
      const flyBtn = el('button', { class: 'w-btn ss-takeoff', text: 'Takeoff!', title: 'Finish: the sleigh flies off and the class reads the sack', onclick: () => takeoff() });
      const setPanel = el('div', { class: 'mj-set', hidden: true });
      const bar = el('div', { class: 'mj-bar' }, nameBox, findBox, spinBtn, hintBtn, skipBtn, info, el('span', { class: 'mj-grow' }),
        el('button', { class: 'w-btn round', text: '⋯', title: 'Settings', 'aria-label': 'Game settings', onclick: () => toggleSet() }),
        fullBtn, flyBtn);
      const syncBar = () => {
        const g = S.game, live = !!g && !g.done, t = live ? g.turn : null;
        const left = live ? Object.keys(g.board).length : 0;
        spinBtn.disabled = !live || !!t || spinning || busy || !left || !roster().length;
        spinBtn.classList.toggle('ss-ready', !spinBtn.disabled);
        hintBtn.hidden = skipBtn.hidden = findBox.hidden = !t;
        findWord.textContent = t ? (d.listen ? '👂' : t.word) : '';
        flyBtn.disabled = !live || !g.found.length || busy;
        fullBtn.textContent = d.max ? 'Exit full screen' : 'Full screen';
        info.textContent = live ? `${g.found.length} in the sack` : '';
        if (!spinning) {
          nameBox.textContent = t ? t.name : 'Tap Next elf';
          nameBox.classList.toggle('blank', !t);
        }
      };
      const setMax = on => {
        d.max = on; node?.classList.toggle('mj-max', on); save(); syncBar();
        if (on) document.documentElement.requestFullscreen?.().catch(() => {});
        else if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      };

      /* ---- a game ---- */
      const startGame = () => {
        if (!roster().length) return;
        const list = d.words.slice();
        const carry = S.carry.filter(w => list.includes(w));
        let order = [...shuffle(carry), ...shuffle(list.filter(w => !carry.includes(w)))];
        const board = {};
        Z.spots.forEach(s => { if (s.home && order.includes(s.home)) board[s.id] = s.home; });
        order = order.filter(w => !Object.values(board).includes(w));
        shuffle(Z.spots.filter(s => !board[s.id])).forEach(s => { if (order.length) board[s.id] = order.shift(); });
        S.game = { board, queue: order, found: [], golden: rand(Object.values(board)), turn: null, turns: 0, started: today(), done: false };
        save(); render();
        say('Oh no! Santa’s sleigh is stuck in the snow. Let’s find the magic words!');
      };
      const takeName = () => {
        const here = roster();
        S.pool = S.pool.filter(n => here.includes(n));
        if (!S.pool.length) S.pool = here.slice();
        const name = rand(S.pool);
        S.pool = S.pool.filter(n => n !== name);
        return name;
      };
      const askAloud = () => { const t = S.game?.turn; if (t) say(`${t.name}, can you find… ${t.word}?`); };
      const spin = () => {
        const g = S.game;
        if (!g || g.done || g.turn || spinning || busy) return;
        const here = roster(), onBoard = Object.values(g.board);
        if (!here.length || !onBoard.length) return;
        const winner = takeName();
        save();
        spinning = true; setPanel.hidden = true; syncBar();
        nameBox.classList.remove('blank', 'pop');
        const land = () => {
          spinning = false;
          const choices = onBoard.length > 1 ? onBoard.filter(w => w !== g.lastWord) : onBoard;
          g.turn = { name: winner, word: rand(choices), misses: 0 };
          g.lastWord = g.turn.word; g.turns++;
          save(); syncBar();
          if (!reduce()) { void nameBox.offsetWidth; nameBox.classList.add('pop'); }
          askAloud();
          stop(hintT); hintT = later(showHint, 30000);   // Rudolph helps if it's taking a while
          autoNext();
        };
        if (reduce() || here.length < 2) { land(); return; }
        let i = 0, wait = 45;
        const step = () => {
          if (++i > 18) { land(); return; }
          let n;
          do n = rand(here); while (n === nameBox.textContent);
          nameBox.textContent = n; wait *= 1.13; later(step, wait);
        };
        step();
      };
      const showHint = () => {
        const g = S.game, t = g?.turn;
        if (!t || busy) return;
        const id = Object.keys(g.board).find(k => g.board[k] === t.word);
        words.querySelectorAll('.hint').forEach(b => b.classList.remove('hint'));
        btnAt(id)?.classList.add('hint');
        pic.classList.add('nose');
      };
      const clearHint = () => {
        stop(hintT); hintT = null;
        words.querySelectorAll('.hint').forEach(b => b.classList.remove('hint'));
        pic.classList.remove('nose');
      };
      const skipTurn = () => {
        if (!S.game?.turn || busy) return;
        clearHint(); S.game.turn = null; save(); syncBar();
        if (canTalk) speechSynthesis.cancel();
      };

      /* a found word goes back to the spot it belongs in when it can (cake in the gingerbread house) */
      const refill = id => {
        const q = S.game.queue;
        if (!q.length) return null;
        let i = q.findIndex(w => homeOf(w) === id);
        if (i < 0) i = 0;
        const w = q.splice(i, 1)[0];
        S.game.board[id] = w;
        return w;
      };
      const tapWord = (id, b) => {
        const g = S.game;
        if (!g || g.done || busy || b.classList.contains('got')) return;
        if (!g.turn) { if (!spinning) toast('Tap “Next elf” first', 'soft'); return; }
        const w = g.board[id];
        if (w === g.turn.word) right(id, b); else wrong(b, w);
      };
      const wrong = (b, w) => {
        const t = S.game.turn;
        t.misses++; save();
        b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong');
        boop();
        say(`That says ${w}. Try again!`);
        toast(`That says “${w}”. Try again!`, 'soft');
        if (t.misses >= 2) showHint();
        autoNext();
      };
      const right = (id, b) => {
        const g = S.game, t = g.turn, w = t.word, gold = w === g.golden;
        busy = true; clearHint();
        g.found.push(w); delete g.board[id]; g.turn = null;
        const nw = refill(id);
        save(); syncBar();
        b.classList.add('got');
        gold ? goldJingle() : jingle();
        magic(w, t.name, gold, () => fly(b, w, () => {
          b.remove();
          syncSack(); drawSnow(); bump();
          if (nw) later(() => { if (S.game?.board[id] === nw && !btnAt(id)) words.append(wordBtn(id, nw, true)); }, 500);
          busy = false; syncBar();
          if (!Object.keys(g.board).length) {
            toast('Every word is in the sack!', 'big');
            say('Every word is in the sack! Time for takeoff!', { queue: true });
            later(takeoff, 2600);
          } else autoNext();
        }));
      };

      /* the word big in the middle: the magic e jumps over and the vowel says its name */
      const magic = (w, name, gold, next) => {
        const vi = /[aeiou][^aeiou]e$/.test(w) ? w.length - 3 : -1;
        const V = vi >= 0 ? w[vi] : '';
        const letters = [...w].map((ch, i) => el('span', { class: 'ss-l' + (i === vi ? ' v' : '') + (vi >= 0 && i === w.length - 1 ? ' e' : ''), text: ch }));
        const arc = el('div', { class: 'ss-arc' });
        const big = el('div', { class: 'ss-big' }, arc, letters);
        const card = el('div', { class: 'ss-magic' + (gold ? ' gold' : ''), role: 'status' },
          gold ? el('p', { class: 'ss-gold-flag', text: '★ Golden bauble! ★' }) : null,
          big,
          vi >= 0 ? el('p', { class: 'ss-magic-sub' }, 'Magic ', el('b', { text: 'e' }), ' makes ', el('b', { class: 'v', text: V }), ' say its name!') : null,
          el('p', { class: 'ss-magic-name', text: `Well done, ${name}!` }));
        fx.querySelectorAll('.ss-toast').forEach(t => t.remove());
        fx.append(card);
        /* offsets ignore the card's zoom-in, so the arc lands on the letters whatever the timing */
        const drawArc = () => {
          const W = big.offsetWidth, H = big.offsetHeight, a = letters[vi], e = letters[w.length - 1];
          if (!W) return;
          const ax = a.offsetLeft + a.offsetWidth / 2, ex = e.offsetLeft + e.offsetWidth / 2;
          const top = a.offsetTop + a.offsetHeight * 0.18, h = Math.max(H * 0.3, (ex - ax) * 0.4);
          arc.innerHTML = `<svg viewBox="0 0 ${W} ${H}"><path pathLength="1" d="M${ex.toFixed(1)},${top.toFixed(1)} Q${((ax + ex) / 2).toFixed(1)},${(top - h).toFixed(1)} ${ax.toFixed(1)},${top.toFixed(1)}"/></svg>`;
        };
        if (vi >= 0) drawArc();
        say(`${w}!`);
        if (vi >= 0) say(`The magic E makes ${LETTER[V]} say its name.`, { queue: true });
        say(gold ? `Golden bauble! Well done, ${name}!` : `Well done, ${name}!`, { queue: true });
        later(() => { if (vi >= 0) drawArc(); card.classList.add('zap'); }, reduce() ? 0 : 650);
        later(() => {
          card.classList.add('out');
          later(() => { card.remove(); next(); }, 300);
        }, gold ? 4400 : 3600);
      };
      /* the word flies up into Santa's sack */
      const fly = (b, w, done) => {
        const sr = stage.getBoundingClientRect(), br = b.getBoundingClientRect();
        b.classList.add('gone');
        if (reduce() || !sr.width || !b.isConnected) { done(); return; }
        const x0 = br.left - sr.left + br.width / 2, y0 = br.top - sr.top + br.height / 2;
        const dx = sr.width * Z.sack.x / 1000 - x0, dy = sr.height * Z.sack.y / 560 - y0;
        const copy = el('span', { class: b.className.replace(/\b(got|gone|wrong|hint|new)\b/g, ''), text: w });
        const f = el('div', { class: 'ss-flyer', style: `left:${x0}px;top:${y0}px` }, copy);
        fx.append(f);
        let landed = false;
        const land = () => { if (landed) return; landed = true; f.remove(); if (!dead) done(); };
        later(land, 1600);   // in case the animation never finishes (a hidden tab)
        f.animate([
          { transform: 'translate(0, 0) scale(1.15)' },
          { transform: `translate(${dx * 0.45}px, ${dy * 0.45 - sr.height * 0.12}px) scale(.9)`, offset: 0.45 },
          { transform: `translate(${dx}px, ${dy}px) scale(.15)`, opacity: 0.4 },
        ], { duration: 1100, easing: 'ease-in-out' }).onfinish = land;
      };

      /* ---- takeoff and reading the sack ---- */
      const takeoff = () => {
        const g = S.game;
        if (!g || g.done || !g.found.length) return;
        if (busy && Object.keys(g.board).length) return;
        busy = true; clearHint(); setPanel.hidden = true;
        g.turn = null; g.done = true;
        S.carry = [...Object.values(g.board), ...g.queue];   // not found yet: first in the next game
        S.history.unshift({ date: today(), found: g.found.length, turns: g.turns });
        S.history.length = Math.min(S.history.length, 40);
        save(); syncBar();
        fanfare(); say('Ho ho ho! Up, up and away!');
        stage.classList.add('leaving'); pic.classList.add('takeoff'); sackN.hidden = true;
        later(readback, reduce() ? 400 : 3300);
      };
      const readback = () => {
        const list = S.game.found;
        let i = 0, t = null;
        const big = el('div', { class: 'ss-read-word' });
        const n = el('p', { class: 'ss-read-n' });
        const end = () => { stop(t); card.remove(); busy = false; render(); };
        const card = el('div', { class: 'ss-read', title: 'Tap for the next word' },
          el('p', { class: 'ss-read-head', text: 'Read Santa’s sack together!' }), big, n,
          el('div', { class: 'w-row' }, el('button', { class: 'w-btn', text: 'Skip to the end', onclick: end })));
        const show = () => {
          if (i >= list.length) { end(); return; }
          big.textContent = list[i];
          n.textContent = `${i + 1} of ${list.length}`;
          big.classList.remove('pop'); void big.offsetWidth; big.classList.add('pop');
          i++; t = later(show, 2400);
        };
        card.addEventListener('click', e => { if (e.target.closest('button')) return; stop(t); show(); });
        pic.classList.add('flown');
        fx.append(card); show();
      };
      const results = () => {
        const g = S.game, n = g.found.length, left = S.carry.length;
        return el('div', { class: 'mj-results ss-results', role: 'status' },
          el('div', { class: 'mj-res-text' },
            el('h3', { text: `The sleigh flew off with ${n} magic ${n === 1 ? 'word' : 'words'}!` }),
            el('p', { class: 'mj-met', text: g.found.join(', ') }),
            el('p', { text: left ? `${left} ${left === 1 ? 'word is' : 'words are'} still in the snow. They come first next game.` : 'Every word was found!' })),
          el('div', { class: 'w-row' },
            el('button', { class: 'w-btn', text: 'Read the sack again', onclick: () => { busy = true; fx.replaceChildren(); readback(); } }),
            el('button', { class: 'w-btn go', text: 'New game', onclick: () => { S.game = null; save(); render(); } }),
            el('button', { class: 'w-btn', text: d.max ? 'Exit full screen' : 'Full screen', onclick: e => {
              setMax(!d.max); e.target.textContent = d.max ? 'Exit full screen' : 'Full screen';
            } })));
      };

      /* ---- start card and settings ---- */
      const setTest = on => { d.test = on; autoOn = false; save(); rebuild('sleigh'); };
      const startCard = () => {
        const here = roster();
        const modeBtn = (on, text) => el('button', {
          class: 'w-btn' + (d.listen === on ? ' on' : ''), 'aria-pressed': String(d.listen === on), text,
          onclick: () => { d.listen = on; save(); render(); },
        });
        return el('div', { class: 'ss-start' },
          el('h3', { class: 'ss-title', text: 'Fill Santa’s Sleigh' }),
          el('p', { class: 'ss-lead', text: 'Santa’s sleigh is stuck in the snow! Find the magic words to fill his sack so it can fly.' }),
          el('div', { class: 'w-row' }, modeBtn(false, 'See and hear the word'), modeBtn(true, 'Hear it only')),
          here.length ? null : el('p', { class: 'ss-small', text: 'There are no names in this class yet. Add a class list, or try test mode.' }),
          el('div', { class: 'w-row' },
            el('button', { class: 'w-btn go', text: 'Start', disabled: !here.length, onclick: startGame }),
            here.length ? null : el('button', { class: 'w-btn', text: 'Add class list', onclick: openClassDialog }),
            el('button', { class: 'w-btn', text: 'Change words', onclick: () => toggleSet() }),
            el('button', { class: 'w-btn', text: d.test ? 'Leave test mode' : 'Test mode', onclick: () => setTest(!d.test) })),
          el('p', { class: 'ss-small', text: `${d.words.length} words · ` + (d.test
            ? 'Test mode uses made-up names.'
            : `For ${cls.name || 'this class'}. Names and games stay on this device.`) }));
      };
      const toggleSet = () => {
        if (!setPanel.hidden) { setPanel.hidden = true; return; }
        const here = roster();
        const left = S.pool.filter(n => here.includes(n)).length || here.length;
        const ta = el('textarea', { class: 'ss-words-edit', rows: '3', 'aria-label': 'Words for the game', spellcheck: 'false' });
        ta.value = d.words.join(', ');
        const note = el('p', { class: 'mj-set-note', text: 'Separate words with commas or spaces. Changes start with the next game.' });
        const opt = (label, on, fn) => el('button', { class: 'w-btn' + (on ? ' on' : ''), text: label, onclick: fn });
        setPanel.replaceChildren(...[
          el('div', { class: 'mj-set-row' }, el('span', { text: `Words (${d.words.length})` }),
            el('span', { class: 'mj-set-opts' },
              el('button', { class: 'w-btn', text: 'Magic e list', title: 'Put back the a_e words', onclick: () => { ta.value = Z.words.join(', '); } }),
              el('button', { class: 'w-btn on', text: 'Save words', onclick: () => {
                const list = cleanWords(ta.value.split(/[\s,;]+/));
                if (!list.length) { note.textContent = 'Add at least one word.'; return; }
                d.words = list; save(); setPanel.hidden = true;
                if (!S.game) render();
              } }))),
          ta, note,
          el('div', { class: 'mj-set-row' }, el('span', { text: 'The word' }), el('span', { class: 'mj-set-opts' },
            opt('See and hear', !d.listen, () => { d.listen = false; save(); setPanel.hidden = true; syncBar(); }),
            opt('Hear only', d.listen, () => { d.listen = true; save(); setPanel.hidden = true; syncBar(); }))),
          el('div', { class: 'mj-set-row' }, el('span', { text: canTalk ? 'Voice and sounds' : 'Sounds (this browser can’t read aloud)' }),
            el('button', { class: 'w-btn', text: d.sound ? 'Turn off' : 'Turn on', onclick: () => {
              d.sound = !d.sound; if (!d.sound && canTalk) speechSynthesis.cancel(); save(); setPanel.hidden = true;
            } })),
          canTalk && englishVoices.length ? el('div', { class: 'mj-set-row' }, el('span', { text: 'Voice' }),
            el('span', { class: 'mj-set-opts' },
              el('select', { class: 'w-select ss-voice', 'aria-label': 'Voice', onchange: e => {
                d.voice = e.target.value; save(); pickVoice(); say('Hello! Can you find… cake?');
              } }, englishVoices.map(v => el('option', { value: v.name, selected: v === voice,
                text: v.name.replace(/^Microsoft |^Google /, '').replace(/ - English.*| \(.*?\)$/g, m => /natural/i.test(m) ? ' (natural)' : '') +
                  (/en[-_]AU/i.test(v.lang) ? ' · Aus' : /en[-_]GB/i.test(v.lang) ? ' · UK' : /en[-_]US/i.test(v.lang) ? ' · US' : '') }))),
              el('button', { class: 'w-btn', text: 'Try it', onclick: () => say('Hello! Can you find… cake?') }))) : null,
          canTalk && voice && !/natural|neural|online|google/i.test(voice.name) ? el('p', { class: 'mj-set-note',
            text: 'Tip: this browser only has robotic voices. Open the board in Microsoft Edge for natural-sounding voices like Natasha (Australian).' }) : null,
          el('div', { class: 'mj-set-row' }, el('span', { text: `Spinner: ${left} of ${here.length} names left` }),
            el('button', { class: 'w-btn', text: 'Start the names again', onclick: () => { S.pool = []; save(); setPanel.hidden = true; } })),
          !d.test && state.classes.length > 1 ? el('div', { class: 'mj-set-row' }, el('span', { text: 'Class' }), classSwitch()) : null,
          el('div', { class: 'mj-set-row' }, el('span', { text: 'Test mode (made-up names)' }),
            el('button', { class: 'w-btn', text: d.test ? 'Turn off' : 'Turn on', onclick: () => setTest(!d.test) })),
          d.test ? el('div', { class: 'mj-set-row' }, el('span', { text: 'Play turns by itself' }),
            el('button', { class: 'w-btn', text: autoOn ? 'Stop' : 'Play it for me', onclick: () => {
              autoOn = !autoOn; setPanel.hidden = true; if (autoOn) autoNext();
            } })) : null,
          el('p', { class: 'mj-set-note', text: 'Games save as you go. Words nobody found come first in the next game.' }),
        ].filter(Boolean));
        setPanel.hidden = false;
      };

      /* test mode: plays turns by itself (mostly right, sometimes a wrong tap) */
      const autoNext = () => {
        if (!autoOn || !d.test) return;
        later(() => {
          if (!autoOn) return;
          const g = S.game;
          if (!g) { startGame(); autoNext(); return; }
          if (g.done) { autoOn = false; return; }
          if (busy || spinning) return;
          if (!g.turn) { spin(); return; }
          const ids = Object.keys(g.board);
          const id = ids.find(k => g.board[k] === g.turn.word);
          const pick = Math.random() < 0.75 ? id : rand(ids);
          const b = btnAt(pick);
          if (b) tapWord(pick, b); else autoNext();
        }, 1400);
      };

      const render = () => {
        setPanel.hidden = true; clearHint();
        fx.replaceChildren();
        const g = S.game;
        stage.classList.remove('leaving');
        pic.classList.remove('takeoff', 'bump');
        pic.classList.toggle('flown', !!g?.done);
        drawWords(); syncSack(); drawSnow();
        root.replaceChildren(...[
          d.test ? el('p', { class: 'mj-test-flag', text: 'Test mode: made-up names' }) : null,
          host,
          g ? (g.done ? results() : bar) : null,
          setPanel,
        ].filter(Boolean));
        if (!g) fx.append(startCard());
        syncBar();
      };
      render();
      return () => {
        dead = true; autoOn = false;
        timers.forEach(clearTimeout); timers.clear();
        if (canTalk) { speechSynthesis.cancel(); speechSynthesis.removeEventListener('voiceschanged', pickVoice); }
      };
    },
  },

  /* Mr MixUp: a maths warm-up. A silly sheep makes deliberate mistakes and the class catches
     and fixes them. Words and presets live in mixup-data.js, the rules in mixup-logic.js.
     Names and exit-check marks stay in this browser on this device. */
  mixup: {
    title: 'Mr MixUp', icon: 'mixup', tone: 'pistachio', w: 1000, h: 620, minH: 420,
    pos: () => {
      const w = Math.min(1000, innerWidth - 120), h = Math.min(620, innerHeight - 32);
      return { w, h, x: Math.max(100, Math.round((innerWidth - w) / 2)), y: Math.max(16, Math.round((innerHeight - h) / 2)) };
    },
    build(root, d) {
      const M = window.MIXUP, L = window.MIXUP_LOGIC;
      if (!M || !L) { root.append(el('p', { class: 'note', text: 'Mr MixUp couldn’t load. Reload the page to try again.' })); return; }
      root.classList.add('mx-root');
      const node = root.closest('.widget');
      node?.classList.toggle('mj-max', !!d.max);
      const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
      d.byClass ||= {};
      d.relief ||= { on: false, week: 'w7' };
      const cls = activeClass();
      const S = d.byClass[d.test ? 'test' : cls.id] ||= {};
      S.pool ||= []; S.results ||= []; S.defaults ||= {}; S.custom ||= [];
      S.tplExit ||= { question: 'Show me fourteen on your board.', key: '14' };
      const roster = () => d.test ? M.testNames.slice() : present(cls);
      const WEEKS = [...Object.keys(M.presets), 'tpl'];
      const presetOf = w => M.presets[w] || M.template;

      /* session settings: a week preset fills them all; the class's usual pace goes on top.
         They last until the teacher starts a new lesson. */
      const PACE = { countMs: 700, pause: 3, minutes: 5, threshold: 80 };
      const newSession = week => {
        const p = presetOf(week);
        const listed = week === 'tpl' ? M.template.types : p.items.map(it => it.type);
        return {
          week, range: p.range, cue: p.cue, rate: 'normal',
          types: Object.fromEntries(Object.keys(M.types).map(t => [t, listed.includes(t)])),
          wool: 'cream', size: 'md', wobble: true, voice: false, exitMix: false, music: p.music || '',
          ...PACE, ...S.defaults,
        };
      };
      const relief = () => !!d.relief.on;
      if (!S.session || !WEEKS.includes(S.session.week)) S.session = newSession('w7');
      if (relief() && S.session.week !== d.relief.week) S.session = newSession(d.relief.week);
      const ses = () => S.session;

      const timers = new Set();
      const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); return t; };
      let holdT = null, run = null, setOpen = false, group = null, lineToken = 0;

      /* Mr MixUp's voice: clips recorded in ElevenLabs (mixup-audio/, listed in mixup-voice.js),
         one per fixed line, so they play offline. Off unless the teacher turns it on, and only
         after a tap. A line with no clip (Weeks 11+) is speech bubble only. He giggles before a
         mix-up and bleats after it. Only the sound changes; the words on screen don't. */
      const CLIPS = new Set(window.MIXUP_VOICE || []);
      const GIGGLES = ['Hee hee!', 'Tee hee!'];
      const BLEATS = ['Baa-aa!', 'Meh-eh-eh!'];
      let talkToken = 0, audio = null;
      const stopTalk = () => { talkToken++; if (audio) { audio.onended = audio.onerror = null; audio.pause(); audio = null; } };
      const hasClip = text => CLIPS.has(L.clipId(text));
      const speak = (text, { mix = false, parts = null, force = false } = {}) => {
        if ((!ses().voice && !force) || !text) return;
        stopTalk();
        const my = talkToken;
        const lines = [...(mix ? [rand(GIGGLES)] : []), ...(parts || [text]), ...(mix ? [rand(BLEATS)] : [])];
        const ids = lines.filter(hasClip).map(L.clipId);
        const next = () => {
          if (my !== talkToken || !ids.length) { if (my === talkToken) audio = null; return; }
          const a = audio = new Audio(`mixup-audio/${ids.shift()}.mp3`);
          let moved = false;
          const on = () => { if (!moved) { moved = true; next(); } };   // ended, failed or blocked: next clip
          a.onended = a.onerror = on;
          a.play().catch(on);
        };
        next();
      };

      /* ---- what's on the board: numerals, dots to take away, ten frames ---- */
      const dotsSvg = ({ n, cross = 0 }) => {
        const per = 5, rows = Math.ceil(n / per), g = 44;
        let s = '';
        for (let i = 0; i < n; i++) {
          const x = 22 + (i % per) * g, y = 22 + Math.floor(i / per) * g, gone = i >= n - cross;
          s += `<circle cx="${x}" cy="${y}" r="16" fill="${gone ? '#E5DDE5' : '#B69FB4'}"/>`;
          if (gone) s += `<path d="M${x - 12} ${y - 12}L${x + 12} ${y + 12}M${x + 12} ${y - 12}L${x - 12} ${y + 12}" stroke="#765673" stroke-width="5" stroke-linecap="round"/>`;
        }
        return `<svg viewBox="0 0 ${per * g} ${rows * g}" role="img" aria-label="${n} dots${cross ? `, ${cross} crossed out` : ''}">${s}</svg>`;
      };
      const frameSvg = ({ a, b = 0 }) => {
        const total = a + b, frames = Math.max(1, Math.ceil(total / 10)), c = 40, fw = 5 * c, gap = 18;
        let s = '';
        for (let f = 0; f < frames; f++) {
          const ox = f * (fw + gap);
          s += `<rect x="${ox + 2}" y="2" width="${fw - 4}" height="${2 * c - 4}" rx="8" fill="#fff" stroke="#6f6d78" stroke-width="3"/>`;
          for (let k = 1; k < 5; k++) s += `<path d="M${ox + k * c} 3V${2 * c - 3}" stroke="#aeacb7" stroke-width="2"/>`;
          s += `<path d="M${ox + 3} ${c}H${ox + fw - 3}" stroke="#aeacb7" stroke-width="2"/>`;
        }
        for (let i = 0; i < total; i++) {
          const f = Math.floor(i / 10), k = i % 10, x = f * (fw + gap) + (k % 5) * c + c / 2, y = Math.floor(k / 5) * c + c / 2;
          s += `<circle cx="${x}" cy="${y}" r="${c * 0.34}" fill="${i < a ? '#A3BFC7' : '#D7B6C2'}" stroke="${i < a ? '#426a75' : '#9c4e6a'}" stroke-width="2.5"/>`;
        }
        return `<svg viewBox="0 0 ${frames * fw + (frames - 1) * gap} ${2 * c}" role="img" aria-label="Ten frame showing ${b ? `${a} and ${b}` : a}">${s}</svg>`;
      };
      const boardView = (b, ...extra) => {
        const box = el('div', { class: 'mx-board' });
        if (b?.text) box.append(el('div', { class: 'mx-num' + (b.mirror ? ' mirror' : ''), text: b.text }));
        const pic = b?.dots ? dotsSvg(b.dots) : b?.frame ? frameSvg(b.frame) : '';
        if (pic) { const p = el('div', { class: 'mx-pic' }); p.innerHTML = pic; box.append(p); }
        box.append(...extra.filter(Boolean));
        return box;
      };
      const fixBox = (k, text) => el('div', { class: 'mx-fix' }, el('span', { class: 'mx-fix-k', text: k }), el('strong', { text }));
      const cueBox = () => el('div', { class: 'mx-cue', text: M.cues[ses().cue]?.say || '' });

      /* ---- Mr MixUp and his speech bubble ---- */
      const sheepBox = () => {
        const s = el('div', { class: `mx-sheep mx-${ses().size || 'md'}` });
        s.innerHTML = M.sheep(ses().wool);
        return s;
      };
      /* the wool wobble comes first, then the line. A count appears one number at a time. */
      const sayLine = (bubble, sheep, text, { wobble = false, count = false, parts = null, done } = {}) => {
        const my = ++lineToken;
        bubble.textContent = ''; bubble.classList.add('quiet');
        const show = () => {
          if (my !== lineToken) return;
          bubble.classList.remove('quiet');
          speak(text, { mix: wobble && ses().wobble, parts });
          if (!count) { bubble.textContent = text; done?.(); return; }
          const bits = text.split(/(?<=,)\s+/);      // a count, one number at a time
          let i = 0;
          const next = () => {
            if (my !== lineToken) return;
            bubble.textContent = bits.slice(0, ++i).join(' ');
            if (i < bits.length) later(next, ses().countMs); else done?.();
          };
          next();
        };
        if (wobble && ses().wobble) {
          sheep.classList.remove('wobble'); void sheep.offsetWidth; sheep.classList.add('wobble');
          if (reduce()) { show(); return; }     // a still "Wool wobble!" tag shows instead of the shake
          later(() => { sheep.classList.remove('wobble'); show(); }, 1300);
        } else show();
      };

      /* ---- step timer: a gentle countdown for each step; the teacher moves on ---- */
      const clock = el('span', { class: 'mx-clock', 'aria-label': 'Time left for this step' });
      const setGroup = (key, secs) => { if (group?.key !== key) group = { key, ends: Date.now() + secs * 1000 }; };
      const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
      const syncClock = () => {
        clock.hidden = !group;
        if (!group) return;
        const left = Math.round((group.ends - Date.now()) / 1000);
        clock.textContent = left >= 0 ? fmt(left) : '+' + fmt(-left);
        clock.classList.toggle('over', left < 0);
      };
      const tick = setInterval(syncClock, 500);

      /* ---- name spinner: same rule as Magic Jewels, everyone once before any repeats ---- */
      const spinName = (box, done) => {
        const here = roster();
        if (!here.length) { box.textContent = 'Add a class list to pick names'; box.classList.add('blank'); done(); return; }
        const { name, pool } = L.takeName(S.pool, here);
        S.pool = pool; run.name = name; save();
        const land = () => { box.textContent = name; if (!reduce()) { void box.offsetWidth; box.classList.add('pop'); } done(); };
        if (reduce() || here.length < 2) { land(); return; }
        let i = 0, wait = 45;
        const step = () => {
          if (++i > 18) { land(); return; }
          let x;
          do x = rand(here); while (x === box.textContent);
          box.textContent = x; wait *= 1.13; later(step, wait);
        };
        step();
      };

      const setMax = on => {
        d.max = on; node?.classList.toggle('mj-max', on); save();
        if (on) document.documentElement.requestFullscreen?.().catch(() => {});
        else if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
        paint();
      };
      const fullBtn = () => el('button', { class: 'w-btn', text: d.max ? 'Exit full screen' : 'Full screen', onclick: () => setMax(!d.max) });

      const ROUTINE = () => ['Watch for the wool wobble', `${M.cues[ses().cue]?.label || 'Boards'}: everyone answers`,
        'Wait, then tap Reveal', 'Say the fix together', 'Mr MixUp tries again', 'Spin: one child says it alone'];
      const routineList = (now = -1) => el('ol', { class: 'mx-routine', 'aria-label': 'The correction routine' },
        ROUTINE().map((t, i) => el('li', { class: i === now ? 'now' : '', text: t })));

      /* ---- a warm-up run (kept in memory: closing it goes back to the start card) ---- */
      const start = () => {
        const s = ses(), p = presetOf(s.week);
        const items = s.week === 'tpl'
          ? L.buildTemplate({ types: Object.keys(s.types).filter(t => s.types[t]), range: s.range, rate: s.rate, custom: S.custom })
          : L.presetItems(p, s.types);
        const exit = s.week === 'tpl'
          ? { question: S.tplExit.question, key: S.tplExit.key, board: null, wrongLine: '' }
          : p.exit;
        run = { p, items, exit, i: 0, phase: 'hook', marks: {}, name: null, saved: false, times: L.stepTimes(s.minutes, items.length) };
        group = null; setOpen = false;
        paint();
      };
      const go = (phase, i) => { if (i != null) run.i = i; run.phase = phase; paint(); };
      const stop = () => {
        if (run.phase !== 'music' && !confirm('Stop this warm-up and go back to the start?')) return;
        run = null; group = null; paint();
      };
      const newLesson = () => {
        if (!confirm('Start a new lesson? Settings go back to the week’s preset and this class’s usual pace.')) return;
        S.session = newSession(ses().week); setOpen = false; save(); paint();
      };

      const runScreen = () => {
        const s = ses(), r = run, it = r.items[r.i], n = r.items.length;
        const bubble = el('div', { class: 'mx-bubble', role: 'status', 'aria-live': 'polite' });
        const sheep = sheepBox();
        const label = el('span', { class: 'mx-step' });
        const foot = el('div', { class: 'mx-foot' });
        const big = (text, onclick, kind = '') => el('button', { class: 'mx-btn ' + kind, text, onclick });
        let board, now = -1;

        if (r.phase === 'hook') {
          setGroup('hook', r.times.hook);
          label.textContent = `${r.p.label}: ${r.p.title}`;
          board = el('div', { class: 'mx-board' }, el('p', { class: 'mx-li', text: r.p.intention }), el('p', { class: 'mx-why', text: r.p.why }));
          sayLine(bubble, sheep, s.wobble
            ? 'Watch me! When I do my wool wobble, I might mix something up. Can you catch me?'
            : 'Watch me carefully. I might mix something up. Can you catch me?', { wobble: true });
          foot.append(big('Start the mix-ups', () => go('mix', 0), 'go'));
        } else if (r.phase === 'mix') {
          setGroup('item' + r.i, r.times.item); now = 1;
          label.textContent = `Mix-up ${r.i + 1} of ${n}`;
          board = boardView(it.board, cueBox());
          const reveal = big('Reveal', () => go('fix'), 'go');
          reveal.disabled = true;
          const countdown = () => {
            let left = s.pause;
            const step = () => {
              if (left <= 0) { reveal.disabled = false; reveal.textContent = 'Reveal'; return; }
              reveal.textContent = `Reveal in ${left}`; left--; later(step, 1000);
            };
            step();
          };
          foot.append(reveal);
          sayLine(bubble, sheep, it.say, { wobble: !it.correct, count: it.count, done: countdown });
        } else if (r.phase === 'fix') {
          now = 3;
          label.textContent = `Fix ${r.i + 1} of ${n}`;
          if (it.correct) {
            board = boardView(it.fixed || it.board, fixBox('Say it together:', 'Yes, that’s right!'));
            sayLine(bubble, sheep, 'I got that one right! Did you check?');
            foot.append(big('Spin for a name', () => go('pick'), 'go'));
          } else {
            board = boardView(it.fixed, fixBox('Say it together:', it.fix));
            sayLine(bubble, sheep, 'Oops! Can you say it the right way?');
            foot.append(big('Mr MixUp tries again', () => go('again'), 'go'));
          }
        } else if (r.phase === 'again') {
          now = 4;
          label.textContent = `Mr MixUp tries again (${r.i + 1} of ${n})`;
          board = boardView(it.fixed);
          sayLine(bubble, sheep, it.right, { count: it.count });
          foot.append(big('Spin for a name', () => go('pick'), 'go'));
        } else if (r.phase === 'pick') {
          now = 5;
          label.textContent = `Your turn (${r.i + 1} of ${n})`;
          const nameBox = el('div', { class: 'mx-name', 'aria-live': 'polite' });
          board = boardView(it.fixed, el('div', { class: 'mx-pick' }, nameBox, el('p', { class: 'mx-why', text: 'Say it on your own.' })));
          sayLine(bubble, sheep, 'Your turn! Say it the right way.');
          const last = r.i + 1 >= n;
          const next = big(last ? 'Exit check' : 'Next mix-up', () => last ? go('exit') : go('mix', r.i + 1), 'go');
          const again = big('Spin again', () => { next.disabled = again.disabled = true; nameBox.classList.remove('pop', 'blank'); spinName(nameBox, () => { next.disabled = again.disabled = false; }); });
          next.disabled = again.disabled = true;
          foot.append(again, next);
          spinName(nameBox, () => { next.disabled = again.disabled = false; });
        } else if (r.phase === 'exit') {
          setGroup('exit', r.times.exit);
          label.textContent = 'Exit check';
          const mixIt = s.exitMix && r.exit.wrongLine;
          board = boardView(r.exit.board, el('div', { class: 'mx-num small', text: r.exit.question }), cueBox());
          sayLine(bubble, sheep, mixIt ? `${r.exit.question} ${r.exit.wrongLine}` : r.exit.question,
            { wobble: !!mixIt, parts: mixIt ? [r.exit.question, r.exit.wrongLine] : null });
          foot.append(big('Mark answers', () => go('mark'), 'go'));
        } else if (r.phase === 'mark') {
          setGroup('exit', r.times.exit);
          label.textContent = 'Exit check: tap each child';
          const here = roster();
          const tally = el('span', { class: 'mx-small' });
          const done = big('Done marking', () => go('result'), 'go');
          const sync = () => {
            const m = Object.values(r.marks).filter(Boolean).length;
            tally.textContent = `${m} of ${here.length} marked`;
            done.disabled = !m;
          };
          const VAL = { right: '✓ Right', wrong: '– Not yet' };
          const btns = here.map(nm => {
            const v = el('span', { class: 'mx-mark-val' });
            const b = el('button', { class: 'mx-mark', onclick: () => {
              r.marks[nm] = r.marks[nm] === 'right' ? 'wrong' : r.marks[nm] === 'wrong' ? undefined : 'right';
              paintMark(); sync();
            } }, el('span', { class: 'mx-mark-name', text: nm }), v);
            const paintMark = () => { v.textContent = VAL[r.marks[nm]] || ''; b.classList.toggle('set', !!r.marks[nm]); };
            paintMark();
            return b;
          });
          board = el('div', { class: 'mx-board mx-marking' },
            el('p', { class: 'mx-key', text: `Question: ${r.exit.question}   Right answer: ${r.exit.key}` }),
            here.length ? el('div', { class: 'mx-marks' }, btns) : el('p', { class: 'mx-why', text: 'There are no names to mark. Add a class list first.' }),
            el('div', { class: 'mx-row' }, tally,
              el('button', { class: 'w-btn', text: 'Mark everyone else right', onclick: () => {
                here.forEach(nm => { r.marks[nm] ||= 'right'; });
                paint();
              } })));
          sync();
          sayLine(bubble, sheep, 'Tap each name once for right, twice for not yet.');
          foot.append(done);
        } else if (r.phase === 'result') {
          group = null;
          const res = L.eightyEighty(r.marks, s.threshold);
          if (!r.saved) {
            S.results.unshift({ date: today(), week: s.week, weekLabel: r.p.label, question: r.exit.question,
              marks: { ...r.marks }, pct: res.pct, moveOn: res.moveOn, threshold: s.threshold });
            S.results.length = Math.min(S.results.length, 300);
            r.saved = true; save();
          }
          label.textContent = 'Exit check: how did the class go?';
          board = el('div', { class: 'mx-board' },
            el('div', { class: 'mx-pct', text: `${res.pct}%` }),
            el('p', { class: 'mx-why', text: `of the class got it right (${res.right} of ${res.total})` }),
            el('div', { class: 'mx-verdict ' + (res.moveOn ? 'on' : 're'), text: res.moveOn ? 'Move on' : 'Reteach' }),
            el('p', { class: 'mx-small', text: `80/80 rule: move on when ${s.threshold}% or more are right.` }));
          sayLine(bubble, sheep, 'Thanks for catching my mix-ups!');
          foot.append(big('Music finish', () => go('music'), 'go'));
        } else {
          group = null;
          label.textContent = 'Finished';
          board = el('div', { class: 'mx-board' },
            el('p', { class: 'mx-why', text: 'Music finish' }),
            el('p', { class: 'mx-li', text: s.music || r.p.music || 'Your music game' }));
          sayLine(bubble, sheep, 'Great catching today. See you next time!');
          foot.append(big('Back to the start', () => { run = null; paint(); }, 'go'));
        }

        syncClock();
        const top = el('div', { class: 'mx-top' }, label, el('span', { class: 'mj-grow' }), clock,
          el('button', { class: 'mx-btn quiet', text: 'Stop', onclick: stop }));
        const main = el('div', { class: 'mx-main' + (r.phase === 'mark' ? ' marking' : '') },
          el('div', { class: 'mx-char' }, bubble, sheep), board);
        return [top, main, foot, relief() ? routineList(now) : null].filter(Boolean);
      };

      /* ---- start card ---- */
      const holdUnlock = () => {
        const b = el('button', { class: 'mx-hold', text: 'Teacher: press and hold for 3 seconds to unlock settings' });
        const up = () => { clearTimeout(holdT); b.classList.remove('holding'); };
        b.addEventListener('pointerdown', e => {
          e.preventDefault(); b.classList.add('holding');
          holdT = setTimeout(() => { d.relief.on = false; save(); paint(); }, 3000);
        });
        ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => b.addEventListener(ev, up));
        return b;
      };
      const startCard = () => {
        const s = ses(), p = presetOf(s.week), here = roster();
        const weeks = el('div', { class: 'mx-weeks', role: 'group', 'aria-label': 'Choose the week' },
          WEEKS.map(w => el('button', {
            class: 'mx-week' + (w === s.week ? ' on' : ''), 'aria-pressed': String(w === s.week),
            onclick: () => { if (w !== s.week) { S.session = newSession(w); save(); paint(); } },
          }, el('strong', { text: presetOf(w).label }), el('span', { text: presetOf(w).title }))));
        return el('div', { class: 'mx-start' },
          el('div', { class: 'mx-start-head' }, sheepBox(),
            el('div', {}, el('h3', { class: 'mx-title', text: 'Mr MixUp' }),
              el('p', { class: 'mx-lead', text: 'Catch Mr MixUp’s maths mix-ups and fix them together.' }))),
          relief()
            ? el('div', { class: 'mx-relief' },
              el('p', { class: 'mx-relief-flag', text: 'Relief lesson: everything is set up. Just tap Start.' }),
              el('p', { class: 'mx-relief-week', text: `${p.label}: ${p.title}` }),
              routineList())
            : weeks,
          el('p', { class: 'mx-small', text: `${p.intention}   ·   ${M.ranges[s.range]?.label}   ·   ${s.minutes} minutes` }),
          here.length ? null : el('p', { class: 'mx-small', text: 'There are no names in this class yet. Add a class list, or try test mode in Settings.' }),
          el('div', { class: 'mx-row' },
            el('button', { class: 'mx-btn go', text: 'Start warm-up', onclick: start }),
            relief() ? null : el('button', { class: 'w-btn', text: 'Settings', 'aria-expanded': String(setOpen), onclick: () => { setOpen = !setOpen; paint(); } }),
            relief() ? null : el('button', { class: 'w-btn', text: 'New lesson', onclick: newLesson }),
            fullBtn()),
          relief() ? holdUnlock() : el('p', { class: 'mx-small', text: d.test
            ? 'Test mode: made-up names. Nothing is saved for a real class.'
            : `For ${cls.name || 'this class'}. Names and marks are saved only on this device.` }));
      };

      /* ---- settings (start card only: no small controls during the warm-up) ---- */
      const setS = (k, v) => { ses()[k] = v; save(); paint(); };
      const opts = (cur, list, onpick, disabled = false) => el('span', { class: 'mj-set-opts' },
        list.map(([k, text]) => el('button', { class: 'w-btn' + (k === cur ? ' on' : ''), 'aria-pressed': String(k === cur), text, disabled, onclick: () => onpick(k) })));
      const row = (label, ...kids) => el('div', { class: 'mj-set-row' }, el('span', { text: label }), ...kids);
      const input = (value, placeholder, oninput) => el('input', { class: 'mx-input', type: 'text', value, placeholder, oninput: e => { oninput(e.target.value); save(); } });
      const exportCsv = () => {
        const s = ses(), rows = S.results.filter(r => r.week === s.week).slice().reverse();
        const csv = L.resultsCsv(rows, d.test ? 'Test' : (cls.name || ''));
        const file = new Blob(['﻿' + csv], { type: 'text/csv' });
        const a = el('a', { href: URL.createObjectURL(file), download: `mr-mixup-${presetOf(s.week).label.replace(/\W+/g, '-').toLowerCase()}-${today()}.csv` });
        document.body.append(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 5000);
      };
      const settingsPanel = () => {
        const s = ses(), tpl = s.week === 'tpl', here = roster();
        const left = S.pool.filter(n => here.includes(n)).length || here.length;
        const saved = S.results.filter(r => r.week === s.week).length;
        const onOff = (k, labels = ['On', 'Off']) => opts(s[k], [[true, labels[0]], [false, labels[1]]], v => setS(k, v));
        const draft = { say: '', fix: '', text: '', correct: false };
        return el('div', { class: 'mj-set mx-set', role: 'dialog', 'aria-label': 'Mr MixUp settings' },
          el('div', { class: 'mj-set-row' }, el('strong', { text: 'Settings for this lesson' }),
            el('button', { class: 'w-btn', text: 'Close', onclick: () => { setOpen = false; paint(); } })),
          el('h4', { text: 'Week' }),
          row('Week preset', opts(s.week, WEEKS.map(w => [w, presetOf(w).label]), w => { S.session = newSession(w); save(); paint(); })),
          row('Number range', opts(s.range, Object.entries(M.ranges).map(([k, r]) => [k, r.label]), v => setS('range', v))),
          el('h4', { text: 'Mix-ups' }),
          el('p', { class: 'mj-set-note', text: tpl
            ? 'Weeks 11+ makes new items from the types switched on here.'
            : 'This week’s items are fixed. Switching a type off makes Mr MixUp say that item correctly.' }),
          el('div', { class: 'mx-types' }, Object.entries(M.types).map(([k, label]) => el('button', {
            class: 'w-btn' + (s.types[k] ? ' on' : ''), 'aria-pressed': String(!!s.types[k]), text: label,
            title: L.typeFits(k, s.range) ? '' : 'Doesn’t fit this number range',
            onclick: () => { s.types[k] = !s.types[k]; save(); paint(); } }))),
          row('Mix-up rate' + (tpl ? '' : ' (Weeks 11+ only)'), opts(s.rate, Object.entries(L.rates).map(([k, r]) => [k, r.label]), v => setS('rate', v), !tpl)),
          row('Mr MixUp can mix up the exit check', onOff('exitMix')),
          el('h4', { text: 'Pace' }),
          row('Count speed', opts(s.countMs, [[1000, 'Slow'], [700, 'Medium'], [450, 'Fast']], v => setS('countMs', v))),
          row('Pause before Reveal (seconds)', stepper(s.pause, 1, 10, v => { s.pause = v; save(); }, 'seconds')),
          row('Response cue', opts(s.cue, Object.entries(M.cues).map(([k, c]) => [k, c.label]), v => setS('cue', v))),
          row('Warm-up length', opts(s.minutes, [[5, '5 minutes'], [10, '10 minutes']], v => setS('minutes', v))),
          row('Move on at (80/80 rule, %)', stepper(s.threshold, 70, 90, v => { s.threshold = v; save(); }, 'percent')),
          row('This class’s usual pace', el('button', { class: 'w-btn', text: 'Save pace for this class', onclick: () => {
            S.defaults = { countMs: s.countMs, pause: s.pause, minutes: s.minutes, threshold: s.threshold };
            save(); alert('Saved. New lessons for this class will start with this pace.');
          } })),
          el('h4', { text: 'Mr MixUp' }),
          row('Wool colour', opts(s.wool, Object.entries(M.wools).map(([k, w]) => [k, w.label]), v => setS('wool', v))),
          row('Size', opts(s.size, [['sm', 'Small'], ['md', 'Medium'], ['lg', 'Large']], v => setS('size', v))),
          row('Wool wobble', onOff('wobble')),
          row(`Voice (plays only after you tap; ${CLIPS.size} lines recorded)`, onOff('voice'),
            el('button', { class: 'w-btn', text: 'Hear him', onclick: () => speak('Nine take away four is six.', { mix: true, force: true }) })),
          tpl ? el('h4', { text: 'Weeks 11+' }) : null,
          tpl ? row('Exit check question', input(S.tplExit.question, 'e.g. Show me fourteen on your board.', v => { S.tplExit.question = v; })) : null,
          tpl ? row('Answer to look for', input(S.tplExit.key, 'e.g. 14', v => { S.tplExit.key = v; })) : null,
          tpl ? row('Music finish', input(s.music, 'e.g. Teen or Ty', v => { s.music = v; })) : null,
          tpl ? el('div', { class: 'mx-custom' },
            el('span', { class: 'mj-set-note', text: 'Your own items run first. Made-up items fill the rest of the five.' }),
            S.custom.map((c, i) => el('div', { class: 'mj-set-row' },
              el('span', { text: `${c.correct ? 'CORRECT: ' : ''}${c.say}` }),
              el('button', { class: 'w-btn', text: 'Remove', onclick: () => { S.custom.splice(i, 1); save(); paint(); } }))),
            input('', 'Mr MixUp says… e.g. Five and six make ten.', v => { draft.say = v.trim(); }),
            input('', 'The fix… e.g. Five and five make ten.', v => { draft.fix = v.trim(); }),
            input('', 'On screen (optional)… e.g. 5 and 6 make 10', v => { draft.text = v.trim(); }),
            el('label', { class: 'w-check' }, el('input', { type: 'checkbox', onchange: e => { draft.correct = e.target.checked; } }), 'He says it correctly (no fix)'),
            el('button', { class: 'w-btn', text: 'Add item', onclick: () => {
              if (!draft.say || (!draft.correct && !draft.fix)) { alert('Type what Mr MixUp says, and the fix.'); return; }
              S.custom.push({ ...draft }); save(); paint();
            } })) : null,
          el('h4', { text: 'Class' }),
          row(`Spinner: ${left} of ${here.length} names left`, el('button', { class: 'w-btn', text: 'Start the names again', onclick: () => { S.pool = []; save(); paint(); } })),
          !d.test && state.classes.length > 1 ? row('Class', classSwitch()) : null,
          row(`Results: ${saved} exit check${saved === 1 ? '' : 's'} saved for ${presetOf(s.week).label}`,
            el('button', { class: 'w-btn', text: 'Export CSV', disabled: !saved, onclick: exportCsv })),
          row('Relief mode (locks everything but Start)', el('button', { class: 'w-btn', text: `Lock on ${presetOf(s.week).label}`, onclick: () => {
            d.relief = { on: true, week: s.week }; setOpen = false; save(); paint();
          } })),
          row('Test mode (made-up names)', el('button', { class: 'w-btn', text: d.test ? 'Turn off' : 'Turn on', onclick: () => { d.test = !d.test; save(); rebuild('mixup'); } })),
          el('p', { class: 'mj-set-note', text: 'Settings last for this lesson. “New lesson” puts back the week’s preset and the class’s usual pace. Exit-check marks are saved only on this device.' }),
        );
      };

      const paint = () => {
        lineToken++; stopTalk(); timers.forEach(clearTimeout); timers.clear();
        const keep = root.querySelector('.mx-set')?.scrollTop || 0;
        if (relief()) setOpen = false;
        root.replaceChildren(...(run ? runScreen() : [startCard(), setOpen ? settingsPanel() : null].filter(Boolean)));
        const panel = root.querySelector('.mx-set');
        if (panel) panel.scrollTop = keep;
      };
      paint();
      return () => {
        lineToken++; timers.forEach(clearTimeout); timers.clear();
        clearInterval(tick); clearTimeout(holdT); stopTalk();
      };
    },
  },
  note: {
    title: 'Note', icon: 'note', tone: 'stone', w: 300, h: 240,
    build(root, d) {
      d.size ||= 28;
      const area = el('textarea', { class: 'note-area', placeholder: 'Type a reminder, instruction or learning goal…',
        'aria-label': 'Note', oninput: e => { d.text = e.target.value; save(); } });
      area.value = d.text || '';
      const size = by => { d.size = clamp(d.size + by, 14, 96); area.style.fontSize = d.size + 'px'; save(); };
      size(0);
      root.append(area, el('div', { class: 'w-row' },
        el('button', { class: 'w-btn', text: 'A −', 'aria-label': 'Smaller text', onclick: () => size(-4) }),
        el('button', { class: 'w-btn', text: 'A +', 'aria-label': 'Bigger text', onclick: () => size(4) }),
        el('button', { class: 'w-btn', text: 'Clear', onclick: () => { area.value = ''; d.text = ''; save(); } })));
    },
  },
};

/* ---------- widget windows ---------- */
const layer = $('#widgets');
const live = {};   // id -> { node, inner, cleanup }
let topZ = 10;

function rebuild(id) {
  const w = live[id];
  if (!w) return;
  w.cleanup?.();
  w.inner.replaceChildren();
  w.cleanup = WIDGETS[id].build(w.inner, state.widgets[id].data);
}

function openWidget(id) {
  if (live[id]) return;
  const def = WIDGETS[id];
  const order = Object.keys(WIDGETS).indexOf(id);
  const ws = state.widgets[id] ||= { x: 120 + order * 36, y: 40 + order * 36, w: def.w, h: def.h, data: {}, ...(def.pos?.() || {}) };
  if (def.slim && !ws.slim) { Object.assign(ws, { w: def.w, h: def.h, ...def.pos() }); ws.slim = true; }
  ws.open = true;

  const inner = el('div', { class: 'w-inner' });
  /* dockable tools can sit in their own strip along the bottom, with the slides lifted above */
  const dockBtn = def.dockable ? el('button', { class: 'w-dock', onclick: () => { ws.dock = !ws.dock; applyDock(); place(); save(); } }) : null;
  if (dockBtn) dockBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="4" width="17" height="16" rx="3"/><path d="M3.5 14.5h17"/></svg>';
  const head = el('div', { class: 'w-head' },
    icon(def.icon), el('span', { class: 'title', text: def.title }),
    dockBtn,
    el('button', { text: '✕', 'aria-label': `Close ${def.title}`, onclick: () => closeWidget(id) }));
  const grip = el('div', { class: 'w-resize' });
  const node = el('section', { class: 'widget', 'aria-label': def.title }, head, el('div', { class: 'w-body' }, inner), grip);
  node.classList.add('tone-' + def.tone);
  if (def.slim) node.classList.add('slim');

  const applyDock = () => {
    const on = !!(def.dockable && ws.dock);
    node.classList.toggle('docked', on);
    document.body.classList.toggle('dock-bottom', on);
    if (dockBtn) {
      dockBtn.setAttribute('aria-pressed', String(on));
      dockBtn.title = on ? 'Float it again' : 'Dock along the bottom (the slides move up to make room)';
      dockBtn.setAttribute('aria-label', dockBtn.title);
    }
  };
  const place = () => {
    if (def.dockable && ws.dock) {
      ws.dockH = clamp(ws.dockH || 110, def.minH || 72, Math.round(innerHeight * 0.45));
      document.documentElement.style.setProperty('--dock-h', ws.dockH + 'px');
      return;
    }
    ws.w = clamp(ws.w, 190, innerWidth); ws.h = clamp(ws.h, def.minH || 150, innerHeight);
    ws.x = clamp(ws.x, 0, Math.max(0, innerWidth - 90));
    ws.y = clamp(ws.y, 0, Math.max(0, innerHeight - 44));
    Object.assign(node.style, { left: ws.x + 'px', top: ws.y + 'px', width: ws.w + 'px', height: ws.h + 'px' });
  };
  const front = () => { node.style.zIndex = ++topZ; };
  node.addEventListener('pointerdown', front);

  /* drag by the title bar, resize by the corner */
  const track = (handle, onmove) => handle.addEventListener('pointerdown', e => {
    if (e.target.closest('button')) return;
    e.preventDefault();
    handle.setPointerCapture(e.pointerId);
    document.body.classList.add('dragging');
    const start = { px: e.clientX, py: e.clientY, x: ws.x, y: ws.y, w: ws.w, h: ws.h, dh: ws.dockH || 110 };
    const move = ev => { onmove(start, ev.clientX - start.px, ev.clientY - start.py); place(); };
    const end = () => {
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', end);
      handle.removeEventListener('pointercancel', end);
      document.body.classList.remove('dragging');
      save();
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
  });
  /* floating: drag the title bar to move it. Docked: drag it up or down to make the strip taller or shorter */
  track(head, (s, dx, dy) => {
    if (def.dockable && ws.dock) ws.dockH = s.dh - dy;
    else { ws.x = s.x + dx; ws.y = s.y + dy; }
  });
  track(grip, (s, dx, dy) => { ws.w = s.w + dx; ws.h = s.h + dy; });

  live[id] = { node, inner, place, cleanup: null };
  applyDock(); place(); front();
  layer.append(node);
  rebuild(id);
  railButtons[id].setAttribute('aria-pressed', 'true');
  save();
}

function closeWidget(id) {
  const w = live[id];
  if (!w) return;
  w.cleanup?.();
  w.node.remove();
  if (w.node.classList.contains('docked')) document.body.classList.remove('dock-bottom');
  delete live[id];
  state.widgets[id].open = false;
  railButtons[id].setAttribute('aria-pressed', 'false');
  save();
}

addEventListener('resize', () => Object.values(live).forEach(w => w.place()));

/* ---------- rail ---------- */
const railButtons = {};
for (const [id, def] of Object.entries(WIDGETS)) {
  railButtons[id] = el('button', { class: 'rail-btn tone-' + def.tone, 'aria-pressed': 'false',
    onclick: () => live[id] ? closeWidget(id) : openWidget(id) },
    icon(def.icon), el('span', { text: def.title }));
  $('#rail-widgets').append(railButtons[id]);
}
$('#btn-full').addEventListener('click', () => {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen?.().catch(() => {});
});
const setRail = hidden => {
  state.railHidden = hidden;
  document.body.classList.toggle('rail-hidden', hidden);
  save();
};
$('#btn-hide').addEventListener('click', () => setRail(true));
$('#rail-show').addEventListener('click', () => setRail(false));

/* ---------- back up / restore (moving to another computer) ---------- */
const toBase64 = buf => {
  const bytes = new Uint8Array(buf);
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
};
const fromBase64 = b64 => Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer;
const backupErr = $('#backup-err');
$('#backup-save').addEventListener('click', async () => {
  writeNow();
  const pdfs = {};
  for (const d of state.decks.filter(x => x.kind === 'pdf')) {
    try { const buf = await idb.get(d.id); if (buf) pdfs[d.id] = toBase64(buf); } catch {}
  }
  const file = new Blob([JSON.stringify({ app: 'classroom-board', version: 1, saved: new Date().toISOString(), state, pdfs })],
    { type: 'application/json' });
  const a = el('a', { href: URL.createObjectURL(file), download: `classroom-board-backup-${today()}.json` });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
});
$('#backup-load').addEventListener('change', async e => {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  backupErr.hidden = true;
  let data;
  try { data = JSON.parse(await file.text()); } catch { data = null; }
  if (!data || data.app !== 'classroom-board' || !Array.isArray(data.state?.classes)) {
    backupErr.textContent = 'That file isn’t a Classroom Board backup.';
    backupErr.hidden = false;
    return;
  }
  const when = new Date(data.saved).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' });
  const n = data.state.classes.length;
  if (!confirm(`Replace everything on this computer with the backup from ${when} (${n} ${n === 1 ? 'class' : 'classes'})?`)) return;
  try {
    for (const [id, b64] of Object.entries(data.pdfs || {})) await idb.put(id, fromBase64(b64));
  } catch {}
  state = Object.assign(fresh(), data.state);
  writeNow();
  location.reload();
});

/* ---------- install as an app (Edge / Chrome) ---------- */
let installPrompt = null;
const installBtn = $('#btn-install');
addEventListener('beforeinstallprompt', e => { e.preventDefault(); installPrompt = e; installBtn.hidden = false; });
addEventListener('appinstalled', () => { installPrompt = null; installBtn.hidden = true; });
installBtn.addEventListener('click', async () => {
  if (!installPrompt) return;
  installPrompt.prompt();
  try { await installPrompt.userChoice; } catch {}
  installPrompt = null; installBtn.hidden = true;
});

/* ---------- go ---------- */
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
  /* when a new version takes over, reload once so it's used straight away
     (otherwise the board keeps running the old version until it's closed and reopened) */
  const hadVersion = !!navigator.serviceWorker.controller;
  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadVersion || reloading) return;
    reloading = true; writeNow(); location.reload();
  });
}
$('#rail-class-name').textContent = activeClass().name || 'Untitled class';
document.body.classList.toggle('rail-hidden', !!state.railHidden);
showDeck();
for (const [id, ws] of Object.entries(state.widgets)) if (ws.open && WIDGETS[id]) openWidget(id);

})();
