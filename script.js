/* ================================
   WEBCRAFT STUDIO — SCRIPT JS
   ================================ */

// ===== NAV SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ===== MOBILE MENU =====
function toggleMenu() {
  const links = document.getElementById('nav-links');
  const burger = document.getElementById('nav-burger');
  const open = links.classList.toggle('open');
  burger.style.opacity = open ? '0.6' : '1';
}
function closeMenu() {
  document.getElementById('nav-links').classList.remove('open');
}

// ===== VIDEO CAROUSEL =====
let currentSlide = 0;
const slides = document.querySelectorAll('.video-slide');
const dots = document.querySelectorAll('.vdot');
const counter = document.getElementById('videoCounter');
let autoplayInterval;

function goSlide(n) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide]?.classList.remove('active');

  currentSlide = (n + slides.length) % slides.length;

  slides[currentSlide].classList.add('active');
  dots[currentSlide]?.classList.add('active');

  if (counter) counter.textContent = `${String(currentSlide + 1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;

  resetAutoplay();
}

function nextSlide() { goSlide(currentSlide + 1); }

function resetAutoplay() {
  clearInterval(autoplayInterval);
  autoplayInterval = setInterval(nextSlide, 6000);
}

// Swipe support
let touchStartX = 0;
const carousel = document.getElementById('videoCarousel');
if (carousel) {
  carousel.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 40) goSlide(currentSlide + (dx < 0 ? 1 : -1));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  resetAutoplay();
});

// ===== REVEAL ON SCROLL =====
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger leggermente gli elementi vicini
      const siblings = [...entry.target.parentElement.children].filter(c => c.classList.contains('reveal'));
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${Math.min(idx * 80, 300)}ms`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

// ===== NUMBER COUNTER =====
const numberEls = document.querySelectorAll('.number-val');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateNumber(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

numberEls.forEach(el => counterObserver.observe(el));

function animateNumber(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

// ===== CONTACT FORM → EMAIL =====
// Usa mailto: (zero server required). Per un vero backend usa EmailJS o Formspree.
function sendEmail(e) {
  e.preventDefault();
  const btn = document.getElementById('form-submit-btn');
  const success = document.getElementById('form-success');

  const name  = document.getElementById('f-name').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const type  = document.getElementById('f-type').value;
  const msg   = document.getElementById('f-msg').value.trim();

  if (!name || !email || !msg) return;

  btn.disabled = true;
  btn.textContent = 'Invio…';

  // Costruisce il mailto
  const subject = encodeURIComponent(`[Duo-Digital] ${type || 'Richiesta'} da ${name}`);
  const body = encodeURIComponent(
    `Nome: ${name}\nEmail: ${email}\nServizio: ${type || 'Non specificato'}\n\n${msg}`
  );

  // Apre il client email
  window.location.href = `mailto:tua@email.it?subject=${subject}&body=${body}`;

  // Mostra successo dopo 1.5s
  setTimeout(() => {
    btn.disabled = false;
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