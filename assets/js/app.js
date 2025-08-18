// Custom Vanilla JS router, made by Jockooo
// Supports static routes, 404 page and caching

const routes = {
  "/": {
    url: "/pages/home.html",
    title: "SSSNK"
  },
  "/o-nama": {
    url: "/pages/about.html",
    title: "O nama - SSSNK"
  },
  "/smjerovi": {
    url: "/pages/programs.html",
    title: "Smjerovi - SSSNK"
  },
  "/dokumenta": {
    url: "/pages/documents.html",
    title: "Dokumenta - SSSNK"
  },
  "/takmicenja": {
    url: "/pages/competitions.html",
    title: "Takmičenja - SSSNK"
  },
  "/kontakt": {
    url: "/pages/contact.html",
    title: "Kontakt - SSSNK"
  },
  "/vijesti": {
    url: "/pages/news.html",
    title: "Vijesti - SSSNK"
  },
  "/galerija": {
    url: "/pages/gallery.html",
    title: "Galerija - SSSNK"
  }
};

const app = document.getElementById('app');
const cache = {};
let currentSlideIndex = 0;
const totalSlides = 3;

async function navigate(url) {
  const path = new URL(url, location.origin).pathname;

  home = path === "/";
  updateNavScroll();

  if (!routes[path]) {
    app.innerHTML = `<h1>404 - Stranica nije pronađena</h1>`;
    history.pushState(null, '', path);
    document.title = '404 - Stranica nije pronađena';
    return;
  }

  const route = routes[path];

  if (cache[path]) {
    app.innerHTML = cache[path].html;
    executeJS(cache[path].js);
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
    const script = doc.querySelector('script');
    const jsCode = script ? script.textContent : '';

    if (!main) throw new Error('Main element nije pronađen u stranici.');

    cache[path] = {
      html: main.innerHTML,
      js: jsCode
    };

    app.innerHTML = main.innerHTML;
    executeJS(jsCode);
    history.pushState(null, '', path);
    document.title = route.title;

  } catch (err) {
    console.error(err);
    app.innerHTML = `<h1>Greška pri učitavanju stranice</h1>
    <p>${err.message}</p>`;
    document.title = 'Greška pri učitavanju stranice';
  }
}

function executeJS(code) {
  if (!code) return;
  const script = document.createElement('script');
  script.textContent = code;
  document.body.appendChild(script);
  script.remove();
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

function updateNavScroll() {
  const nav = document.querySelector('.sticky-nav');
  const backToTop = document.querySelector('.back-to-top');

  if (!home || window.scrollY > 20) {
    nav.classList.add('scrolled');
    backToTop.classList.add('visible');
  } else {
    nav.classList.remove('scrolled');
    backToTop.classList.remove('visible');
  }
}

window.addEventListener('scroll', updateNavScroll);

function changeSlide(direction) {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');

  if (!slides[currentSlideIndex]) return;

  slides[currentSlideIndex].classList.remove('active');
  dots[currentSlideIndex].classList.remove('active');

  currentSlideIndex += direction;

  if (currentSlideIndex >= totalSlides) {
    currentSlideIndex = 0;
  } else if (currentSlideIndex < 0) {
    currentSlideIndex = totalSlides - 1;
  }

  slides[currentSlideIndex].classList.add('active');
  dots[currentSlideIndex].classList.add('active');
}

function currentSlide(n) {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');

  slides[currentSlideIndex].classList.remove('active');
  dots[currentSlideIndex].classList.remove('active');

  currentSlideIndex = n - 1;

  slides[currentSlideIndex].classList.add('active');
  dots[currentSlideIndex].classList.add('active');
}

setInterval(() => {
  changeSlide(1);
}, 5000);

function animateCounters() {
  const counters = document.querySelectorAll('.stats-counter');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    const increment = target / 100;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        counter.textContent = target;
        clearInterval(timer);
      } else {
        counter.textContent = Math.floor(current);
      }
    }, 20);
  });
}
