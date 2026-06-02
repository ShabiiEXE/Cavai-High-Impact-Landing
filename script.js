const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const header = document.querySelector('.site-header');
let headerTicking = false;

const syncHeaderVisibility = () => {
  header.classList.toggle('header-scrolled', window.scrollY > 0);
  headerTicking = false;
};

if (header) {
  syncHeaderVisibility();

  window.addEventListener('scroll', () => {
    if (!headerTicking) {
      window.requestAnimationFrame(syncHeaderVisibility);
      headerTicking = true;
    }
  }, { passive: true });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((error) => {
      console.warn('Service worker registration failed:', error);
    });
  });
}
