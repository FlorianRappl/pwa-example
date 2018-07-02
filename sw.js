const files = [
  './',
  './app.js',
  './style.css',
  './fallback/posts.json',
  './fallback/users.json',
];

self.addEventListener('install', async e => {
  const cache = await caches.open('files');
  cache.addAll(files);
});

const apiUrl = 'https://jsonplaceholder.typicode.com';

function isApiCall(req) {
  return req.url.startsWith(apiUrl);
}

async function getFromCache(req) {
  const res = await caches.match(req);

  if (!res) {
    return fetch(req);
  }

  return res;
}

async function getFallback(req) {
  const path = req.url.substr(apiUrl.length);

  if (path.startsWith('/posts')) {
    return caches.match('./fallback/posts.json');
  } else if (path.startsWith('/users')) {
    return caches.match('./fallback/users.json');
  }
}

async function getFromNetwork(req) {
  const cache = await caches.open('data');

  try {
    const res = await fetch(req);
    cache.put(req, res.clone());
    return res;
  } catch (e) {
    const res = await cache.match(req);
    return res || getFallback(req);
  }
}

self.addEventListener('fetch', async e => {
  const req = e.request;
  const res = isApiCall(req) ? getFromNetwork(req) : getFromCache(req);
  await e.respondWith(res);
});
