const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.04 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const typingWord = document.querySelector('.typing-word');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typingWord && !reduceMotion) {
  const words = (typingWord.dataset.typingWords || '')
    .split(',')
    .map((word) => word.trim())
    .filter(Boolean);
  let wordIndex = 0;
  let charIndex = typingWord.textContent.length;
  let deleting = false;

  const typeNextFrame = () => {
    const currentWord = words[wordIndex] || '';
    typingWord.textContent = currentWord.slice(0, charIndex);

    if (!deleting && charIndex === currentWord.length) {
      deleting = true;
      window.setTimeout(typeNextFrame, 1200);
      return;
    }

    if (deleting && charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      window.setTimeout(typeNextFrame, 220);
      return;
    }

    charIndex += deleting ? -1 : 1;
    window.setTimeout(typeNextFrame, deleting ? 46 : 78);
  };

  window.setTimeout(typeNextFrame, 900);
}

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

const backToTop = document.querySelector('.back-to-top');
let backToTopTicking = false;

const syncBackToTopVisibility = () => {
  if (!backToTop) return;

  const isVisible = window.scrollY > 220;
  backToTop.classList.toggle('is-visible', isVisible);
  backToTopTicking = false;
};

if (backToTop) {
  syncBackToTopVisibility();

  backToTop.addEventListener('click', (event) => {
    event.preventDefault();
    backToTop.blur();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    if (!backToTopTicking) {
      window.requestAnimationFrame(syncBackToTopVisibility);
      backToTopTicking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (!backToTopTicking) {
      window.requestAnimationFrame(syncBackToTopVisibility);
      backToTopTicking = true;
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
