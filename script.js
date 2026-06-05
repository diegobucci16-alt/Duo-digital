/* ================================
   DUO-DIGITAL — SCRIPT JS
   ================================ */

// ===== NAV SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ===== MOBILE MENU =====
function toggleMenu() {
  const menu   = document.getElementById('mobile-menu');
  const burger = document.getElementById('nav-burger');
  const open   = menu.classList.toggle('open');
  burger.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}
function closeMenu() {
  document.getElementById('mobile-menu').classList.remove('open');
  document.getElementById('nav-burger').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

// ===== IMAGE CAROUSEL =====
let currentSlide = 0;
const slides  = document.querySelectorAll('.video-slide');
const dots    = document.querySelectorAll('.vdot');
const counter = document.getElementById('videoCounter');
let autoplayInterval;

function goSlide(n) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide]?.classList.remove('active');

  currentSlide = (n + slides.length) % slides.length;

  slides[currentSlide].classList.add('active');
  dots[currentSlide]?.classList.add('active');

  if (counter)
    counter.textContent = `${String(currentSlide + 1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;

  resetAutoplay();
}

function nextSlide() { goSlide(currentSlide + 1); }

function resetAutoplay() {
  clearInterval(autoplayInterval);
  autoplayInterval = setInterval(nextSlide, 5000);
}

// Swipe support
let touchStartX = 0;
const carousel = document.getElementById('videoCarousel');
if (carousel) {
  carousel.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 40) goSlide(currentSlide + (dx < 0 ? 1 : -1));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  resetAutoplay();
});

// ===== REVEAL ON SCROLL =====
// Seleziona tutti i tipi di reveal
const revealClasses = ['.reveal', '.reveal-left', '.reveal-right'];
const allRevealEls  = document.querySelectorAll(revealClasses.join(','));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Stagger: ritarda in base alla posizione nell'elenco dei sibling
      const parent   = entry.target.parentElement;
      const siblings = [...parent.children].filter(c =>
        revealClasses.some(cls => c.matches(cls))
      );
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${Math.min(idx * 90, 360)}ms`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

allRevealEls.forEach(el => revealObserver.observe(el));

// ===== NUMBER COUNTER =====
const numberEls = document.querySelectorAll('.number-val');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateNumber(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

numberEls.forEach(el => counterObserver.observe(el));

function animateNumber(el) {
  const target   = parseInt(el.dataset.target, 10);
  const suffix   = el.dataset.target === '100' ? '' : '';
  const duration = 1800;
  const start    = performance.now();

  const update = (now) => {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(update);
}

// ===== CARD TILT EFFECT (desktop only) =====
function initTilt() {
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.service-card, .work-card, .process-step').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect   = card.getBoundingClientRect();
        const x      = (e.clientX - rect.left) / rect.width  - 0.5;
        const y      = (e.clientY - rect.top)  / rect.height - 0.5;
        const tiltX  = y * 6;
        const tiltY  = -x * 6;
        card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
}
document.addEventListener('DOMContentLoaded', initTilt);

// ===== CONTACT FORM → EMAIL =====
function sendEmail(e) {
  e.preventDefault();
  const btn     = document.getElementById('form-submit-btn');
  const success = document.getElementById('form-success');

  const name  = document.getElementById('f-name').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const type  = document.getElementById('f-type').value;
  const msg   = document.getElementById('f-msg').value.trim();

  if (!name || !email || !msg) return;

  btn.disabled    = true;
  btn.textContent = 'Invio…';

  const subject = encodeURIComponent(`[Duo-Digital] ${type || 'Richiesta'} da ${name}`);
  const body    = encodeURIComponent(
    `Nome: ${name}\nEmail: ${email}\nServizio: ${type || 'Non specificato'}\n\n${msg}`
  );

  window.location.href = `mailto:tua@email.it?subject=${subject}&body=${body}`;

  setTimeout(() => {
    btn.disabled    = false;
    btn.textContent = 'Invia messaggio →';
    success.classList.remove('hidden');
    document.getElementById('contact-form').reset();
    setTimeout(() => success.classList.add('hidden'), 5000);
  }, 1500);
}

// ===== SMOOTH ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--white)' : '';
  });
}, { passive: true });
