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

(function () {
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/')
    ;
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
  }

  async function subscribeToPushNotifications(registration) {
    if ('pushManager' in registration) {
      const options = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array('BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'),
      };

      const status = await pushStatus;

      if (status) {
        try {
          const subscription = await registration.pushManager.subscribe(options);
          //Received subscription
        } catch (e) {
          console.error('Push registration failed', e);
        }
      }
    }
  }
  
  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('sw.js');
      subscribeToPushNotifications(registration);
    } catch (e) {
      console.error('ServiceWorker failed', e);
    }
  }

  const pushStatus = new Promise(resolve => {
    Notification.requestPermission(result => {
      const el = document.createElement('div');
      el.classList.add('push-info');
    
      if (result !== 'granted') {
        el.classList.add('inactive');
        el.textContent = 'Push blocked';
        resolve(false);
      } else {
        el.classList.add('active');
        el.textContent = 'Push active';
        resolve(true);
      }
    
      document.body.appendChild(el);
    });
  });
  
  if ('serviceWorker' in navigator) {
    try {
      registerServiceWorker();
    } catch (e) {
      console.error(e);
    }
  }
})();
