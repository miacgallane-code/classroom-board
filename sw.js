/* Classroom Board offline support.
   After the first visit everything the board needs is kept on this device, so it opens
   with no internet, and even if a network filter later blocks the site.
   Bump VERSION whenever the app files change so devices pick up the update. */
const VERSION = 'v32';
const CACHE = `classroom-board-${VERSION}`;
importScripts('./mixup-voice.js');   // the list of Mr MixUp's recorded lines (self.MIXUP_VOICE)
const CORE = [
  './', './index.html', './styles.css', './app.js', './manifest.webmanifest', './classes.locked.js', './hush-data.js', './hush-xmas.js', './jewels-data.js', './sleigh-data.js', './whiteboard-steps.js',
  './mixup-data.js', './mixup-logic.js', './mixup-voice.js',
  ...(self.MIXUP_VOICE || []).map(id => `./mixup-audio/${id}.mp3`),
  ...['line-seed', 'line-bee', 'line-sun', 'line-rain', 'step-seed', 'step-bee', 'step-sun', 'step-rain', 'praise-1', 'praise-2', 'praise-3', 'praise-4', 'praise-5', 'praise-6'].map(c => `./audio/pip/${c}.mp3`),
  './icon.svg', './icon-192.png', './icon-512.png',
  './fonts/EduNSWACTFoundation-VariableFont_wght.ttf',
];
const OUTSIDE = [
  'https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
];
const OUTSIDE_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdnjs.cloudflare.com'];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // cache: 'reload' skips the browser's own short-term cache, so a new version never stores old files
    await cache.addAll(CORE.map(url => new Request(url, { cache: 'reload' })));
    await Promise.all(OUTSIDE.map(async url => {
      try { const res = await fetch(url, { mode: 'cors', cache: 'reload' }); if (res.ok) await cache.put(url, res); } catch {}
    }));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});

/* Only keep a fresh copy if it's genuinely ours: a filter's "blocked" page must never
   replace the real app in the cache. */
async function looksRight(req, res) {
  if (!res || !res.ok || res.redirected) return false;
  const type = res.headers.get('content-type') || '';
  const path = new URL(req.url).pathname;
  if (path.endsWith('/') || path.endsWith('.html')) {
    if (!type.includes('text/html')) return false;
    return (await res.clone().text()).includes('<title>Classroom Board</title>');
  }
  if (path.endsWith('.js')) return type.includes('javascript');
  if (path.endsWith('.css')) return type.includes('css');
  return true;
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const ours = url.origin === self.location.origin;
  if (!ours && !OUTSIDE_HOSTS.includes(url.hostname)) return;   // slides etc. go straight to the internet

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const key = ours && req.mode === 'navigate' ? './index.html' : req;
    const cached = await cache.match(key, { ignoreSearch: ours });
    const fresh = ours ? fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' }) : fetch(req);
    const refresh = fresh.then(async res => {
      if (ours ? await looksRight(req, res) : res.ok) await cache.put(key, res.clone());
      return res;
    }).catch(() => null);
    if (cached) { event.waitUntil(refresh); return cached; }
    return (await refresh) || new Response('Offline', { status: 503, statusText: 'Offline' });
  })());
});
