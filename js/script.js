// =============================================
//   MATYAS ABRAHAM — Portfolio JS
// =============================================

// --- REVEAL ON SCROLL ---
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

// --- NAVBAR SCROLL SHADOW ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 20
    ? '0 8px 32px rgba(0,0,0,0.4)'
    : 'none';
});

// --- MOBILE NAV TOGGLE ---
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  // Close on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// --- HERO TERMINAL TYPEWRITER ---
const typeArea = document.getElementById('typeArea');

const lines = [
  { text: '$ whoami', cls: 'cmd', delay: 400 },
  { text: 'matyas_abraham', cls: 'out', delay: 900 },
  { text: '$ cat skills.txt', cls: 'cmd', delay: 1600 },
  { text: 'arch_linux  bash  hyprland  git', cls: 'out', delay: 2200 },
  { text: 'web_security  nodejs  mongodb', cls: 'out', delay: 2700 },
  { text: '$ ls projects/', cls: 'cmd', delay: 3400 },
  { text: 'masu-hyprland/  masu-terminal/  cyber-academy/', cls: 'out', delay: 4000 },
  { text: '$ echo $GOAL', cls: 'cmd', delay: 4800 },
  { text: '"Build, teach, secure."', cls: 'out', delay: 5400 },
];

function addLine(text, cls) {
  const div = document.createElement('div');
  div.className = cls;
  div.textContent = text;
  typeArea.appendChild(div);
  typeArea.scrollTop = typeArea.scrollHeight;
}

lines.forEach(({ text, cls, delay }) => {
  setTimeout(() => addLine(text, cls), delay);
});

// Add blinking cursor after all lines
setTimeout(() => {
  const cursor = document.createElement('span');
  cursor.className = 'cursor-blink';
  typeArea.appendChild(cursor);
}, 6000);

// --- CONTACT FORM ---
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    // Simulate send (replace with real EmailJS/Formspree later)
    setTimeout(() => {
      formStatus.textContent = '✓ Message sent! I\'ll get back to you soon.';
      contactForm.reset();
      btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
      btn.disabled = false;
    }, 1200);
  });
}

// --- SMOOTH NAV ACTIVE STATE ---
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => activeObserver.observe(s));
