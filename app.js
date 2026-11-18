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
  install: '<rect x="3" y="4" width="18" height="12" rx="2.5"/><path d="M12 7v6M9 10.5l3 3 3-3M8 20h8"/>',
  gbg: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5.5a2.5 2.5 0 0 0 2.6 3.6M16 6h2.5a2.5 2.5 0 0 1-2.6 3.6M12 13v3.5M8.5 20h7M10 16.5h4l.5 3.5h-5z"/>',
  list: '<path d="M9 7h10M9 12h10M9 17h10"/><path d="M5 7h.01M5 12h.01M5 17h.01" stroke-width="2.6"/>',
  full: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  hide: '<path d="M11 7l-5 5 5 5M18 7l-5 5 5 5"/>',
};
const icon = name => {
  const s = el('span', { class: 'ico', 'aria-hidden': 'true' });
  s.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;
  return s;
};
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
  ['picker', 'groups', 'counter', 'gbg'].forEach(rebuild);
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
const PIPS = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };

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

  gbg: {
    title: 'Class Champions', icon: 'gbg', tone: 'pistachio', w: 760, h: 128, minH: 100, slim: true,
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
          card.append(
            el('span', { class: 'gbg-label' },
              el('span', { class: 'gbg-name', text: name }),
              members.length > 0 && el('span', { class: 'gbg-members', text: members.join(', ') })),
            el('span', { class: 'gbg-num' }, num, el('small', { text: stars ? ' ★' : ` / ${g.limit}` })),
            el('button', { class: 'gbg-minus', text: '−', disabled: done, 'aria-label': `Take one off ${name}`,
              onclick: e => { e.stopPropagation(); bump(-1); } }));
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
  const head = el('div', { class: 'w-head' },
    icon(def.icon), el('span', { class: 'title', text: def.title }),
    el('button', { text: '✕', 'aria-label': `Close ${def.title}`, onclick: () => closeWidget(id) }));
  const grip = el('div', { class: 'w-resize' });
  const node = el('section', { class: 'widget', 'aria-label': def.title }, head, el('div', { class: 'w-body' }, inner), grip);
  node.classList.add('tone-' + def.tone);
  if (def.slim) node.classList.add('slim');

  const place = () => {
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
    const start = { px: e.clientX, py: e.clientY, x: ws.x, y: ws.y, w: ws.w, h: ws.h };
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
  track(head, (s, dx, dy) => { ws.x = s.x + dx; ws.y = s.y + dy; });
  track(grip, (s, dx, dy) => { ws.w = s.w + dx; ws.h = s.h + dy; });

  live[id] = { node, inner, place, cleanup: null };
  place(); front();
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
}
$('#rail-class-name').textContent = activeClass().name || 'Untitled class';
document.body.classList.toggle('rail-hidden', !!state.railHidden);
showDeck();
for (const [id, ws] of Object.entries(state.widgets)) if (ws.open && WIDGETS[id]) openWidget(id);

})();
