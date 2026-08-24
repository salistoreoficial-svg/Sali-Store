const CACHE_NAME = "sali-store-v2";

const ARQUIVOS = [
  "./",
  "./index.html",
  "./produtos.js",
  "./manifest.json",
"./2FB4D351-BB4F-4790-8933-22B8592A6EEC.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ARQUIVOS))
  );

  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(chaves => {
      return Promise.all(
        chaves
          .filter(chave => chave !== CACHE_NAME)
          .map(chave => caches.delete(chave))
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(resposta => {
        const copia = resposta.clone();

        caches.open(CACHE_NAME)
          .then(cache => cache.put(event.request, copia));

        return resposta;
      })
      .catch(() => caches.match(event.request))
  );
});
