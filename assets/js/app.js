// Custom Vanilla JS router, made by Jockooo
// Supports static routes, 404 page and caching

const routes = {
  '/': {
    url: '/pages/home.html',
    title: 'SSSNK'
  },
  '/o-nama': {
    url: '/pages/about.html',
    title: 'O nama - SSSNK'
  }
};

const app = document.getElementById('app');
const cache = {};

async function navigate(url) {
    const path = new URL(url, location.origin).pathname;

    if (!routes[path]) {
        app.innerHTML = `<h1>404 - Stranica nije pronađena</h1>`;
        history.pushState(null, '', path);
        document.title = '404 - Stranica nije pronađena';
        return;
    }

    const route = routes[path];

    if (cache[path]) {
        app.innerHTML = cache[path];
        history.pushState(null, '', path);
        document.title = route.title;
        return;
    }

    try {
        const res = await fetch(route.url);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const html = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const main = doc.querySelector('.page');

        if (!main) throw new Error('Main element nije pronađen u stranici.');

        cache[path] = main.innerHTML;
        app.innerHTML = main.innerHTML;
        history.pushState(null, '', path);
        document.title = route.title;
    } catch (err) {
        console.error(err);
        app.innerHTML = `<h1>Greška pri učitavanju stranice</h1>
                         <p>${err.message}</p>`;
        document.title = 'Greška pri učitavanju stranice';
    }
}

function updateTitle(path) {
    if (metaData[path] && metaData[path].title) {
        document.title = metaData[path].title;
    }
}

document.addEventListener('click', e => {
    const link = e.target.closest('a[data-link]');
    if (!link) return;

    e.preventDefault();
    navigate(link.href);
});

window.addEventListener('popstate', () => {
    navigate(location.pathname);
});

navigate(location.pathname);
