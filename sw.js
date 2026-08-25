const CACHE_VERSION = 'pokedex-v11-3';
const SHELL_CACHE = `shell-${CACHE_VERSION}`;
const DATA_CACHE = `data-${CACHE_VERSION}`;

const SHELL_FILES = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then(cache => cache.addAll(SHELL_FILES))
      .catch(() => {})
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== SHELL_CACHE && k !== DATA_CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

function isShellRequest(url) {
  return SHELL_FILES.some(f => url.endsWith(f.replace('./', '')));
}

function isCacheableRemote(url) {
  const host = url.hostname;
  // A rota de detalhe de uma carta (/v2/{lang}/cards/{id}) passa direto pela rede,
  // sem passar pelo service worker: é a chamada mais sensível a timing e não
  // precisa de cache — evita que o SW seja um ponto extra de falha nela.
  if (host.includes('tcgdex') && /\/cards\/[^/]+$/.test(url.pathname)) return false;
  return host.includes('tcgdex')
    || host.includes('fonts.googleapis.com')
    || host.includes('fonts.gstatic.com')
    || host.includes('cdnjs.cloudflare.com')
    || host.includes('unpkg.com');
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  if (url.origin === self.location.origin && isShellRequest(url.href)) {
    event.respondWith(
      fetch(req)
        .then(fresh => {
          caches.open(SHELL_CACHE).then(cache => cache.put(req, fresh.clone()));
          return fresh;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  if (isCacheableRemote(url)) {
    event.respondWith(
      caches.open(DATA_CACHE).then(async cache => {
        try {
          const fresh = await fetch(req);
          if (fresh && fresh.ok) cache.put(req, fresh.clone());
          return fresh;
        } catch (err) {
          const cached = await cache.match(req);
          if (cached) return cached;
          throw err;
        }
      })
    );
  }
});
