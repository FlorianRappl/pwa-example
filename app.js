(function () {
  const app = document.querySelector('#app');
  const container = app.querySelector('.entry-container');
  const loadMore = app.querySelector('.load-more');
  
  async function getPosts(page = 1) {
    const result = await fetch('https://jsonplaceholder.typicode.com/posts?_page=' + page);
    return await result.json();
  }
  
  async function getUsers() {
    const result = await fetch('https://jsonplaceholder.typicode.com/users');
    return await result.json();
  }
  
  async function loadEntries(page = 1) {
    const [users, posts] = await Promise.all([getUsers(), getPosts(page)]);
    return posts.map(post => {
      const user = users.filter(u => u.id === post.userId)[0];
      return `<section class="entry"><h2 class="entry-title">${post.title}</h2><article class="entry-body">${post.body}</article><div class="entry-author"><a href="mailto:${user.email}">${user.name}</a></div></section>`;
    }).join('');
  }

  function appendEntries(entries) {
    const output = container.querySelector('output') || container.appendChild(document.createElement('output'));
    output.outerHTML = entries + '<output></output>';
  }

  (async function() {
    let page = 1;

    async function loadMoreEntries() {
      loadMore.disabled = true;
      const entries = await loadEntries(page++);
      appendEntries(entries);
      loadMore.disabled = false;
    }
  
    loadMore.addEventListener('click', loadMoreEntries, false);
    loadMoreEntries();
  })();
})();

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  e.prompt();
});

async function registerServiceWorker() {
  try {
    const registration = await navigator.serviceWorker.register('sw.js');
  } catch (e) {
    console.error('ServiceWorker failed', e);
  }
}

if ('serviceWorker' in navigator) {
  try {
    registerServiceWorker();
  } catch (e) {
    console.error(e);
  }
}

