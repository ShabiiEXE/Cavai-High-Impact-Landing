const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const header = document.querySelector('.site-header');
const headerRevealTarget = document.querySelector('.hero h1');
let headerTicking = false;

const syncHeaderVisibility = () => {
  const headerTop = parseFloat(window.getComputedStyle(header).top) || 0;
  const revealPoint = headerRevealTarget
    ? headerRevealTarget.getBoundingClientRect().top + window.scrollY - header.offsetHeight - headerTop
    : 0;

  header.classList.toggle('header-scrolled', window.scrollY >= revealPoint);
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

  window.addEventListener('resize', () => {
    if (!headerTicking) {
      window.requestAnimationFrame(syncHeaderVisibility);
      headerTicking = true;
    }
  }, { passive: true });
}

const parallaxGrids = document.querySelectorAll('.hero, .format.soft');
const canUsePointerParallax = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (canUsePointerParallax && parallaxGrids.length) {
  parallaxGrids.forEach((section) => {
    let parallaxTicking = false;

    const syncGridParallax = (event) => {
      const rect = section.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - .5) || 0;
      const y = ((event.clientY - rect.top) / rect.height - .5) || 0;

      section.style.setProperty('--grid-x', `${x * 18}px`);
      section.style.setProperty('--grid-y', `${y * 18}px`);
      section.style.setProperty('--grid-shift-x', `${x * 8}px`);
      section.style.setProperty('--grid-shift-y', `${y * 8}px`);
      parallaxTicking = false;
    };

    section.addEventListener('pointermove', (event) => {
      if (!parallaxTicking) {
        window.requestAnimationFrame(() => syncGridParallax(event));
        parallaxTicking = true;
      }
    }, { passive: true });

    section.addEventListener('pointerleave', () => {
      section.style.setProperty('--grid-x', '0px');
      section.style.setProperty('--grid-y', '0px');
      section.style.setProperty('--grid-shift-x', '0px');
      section.style.setProperty('--grid-shift-y', '0px');
    });
  });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((error) => {
      console.warn('Service worker registration failed:', error);
    });
  });
}
