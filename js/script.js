/**
 * MATYAS ABRAHAM — Portfolio Logic
 * Premium Cyber Edition
 */

// --- CUSTOM CURSOR ---
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");

window.addEventListener("mousemove", (e) => {
  const posX = e.clientX;
  const posY = e.clientY;

  cursorDot.style.left = `${posX}px`;
  cursorDot.style.top = `${posY}px`;

  // Outline with slight lag
  cursorOutline.animate({
    left: `${posX}px`,
    top: `${posY}px`
  }, { duration: 500, fill: "forwards" });
});

// Cursor scales on interactables
const interactables = document.querySelectorAll("a, button, input, textarea, .project-card");
interactables.forEach(el => {
  el.addEventListener("mouseenter", () => {
    cursorOutline.style.transform = "translate(-50%, -50%) scale(1.5)";
    cursorOutline.style.backgroundColor = "rgba(0, 242, 255, 0.1)";
  });
  el.addEventListener("mouseleave", () => {
    cursorOutline.style.transform = "translate(-50%, -50%) scale(1)";
    cursorOutline.style.backgroundColor = "transparent";
  });
});

// --- REVEAL ON SCROLL ---
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // staggered children if any
      const staggered = e.target.querySelectorAll('.stagger');
      staggered.forEach((s, i) => {
        setTimeout(() => s.classList.add('visible'), i * 100);
      });
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

// --- NAVBAR SCROLL EFFECT ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// --- MOBILE NAV TOGGLE ---
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.querySelector('i').classList.toggle('fa-bars');
    navToggle.querySelector('i').classList.toggle('fa-xmark');
  });
  
  // Close on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.querySelector('i').classList.add('fa-bars');
      navToggle.querySelector('i').classList.remove('fa-xmark');
    });
  });
}

// Close mobile nav when clicking outside or pressing Escape
document.addEventListener('click', (e) => {
  try {
    if (!navLinks || !navToggle) return;
    if (!navLinks.classList.contains('open')) return;
    const target = e.target;
    if (!navLinks.contains(target) && !navToggle.contains(target)) {
      navLinks.classList.remove('open');
      const icon = navToggle.querySelector('i');
      if (icon) { icon.classList.add('fa-bars'); icon.classList.remove('fa-xmark'); }
    }
  } catch (err) { /* noop */ }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' || e.key === 'Esc') {
    try {
      if (navLinks && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        const icon = navToggle && navToggle.querySelector('i');
        if (icon) { icon.classList.add('fa-bars'); icon.classList.remove('fa-xmark'); }
      }
    } catch (err) { /* noop */ }
  }
});

// --- HERO TERMINAL TYPEWRITER ---
const typeArea = document.getElementById('typeArea');
if (typeArea) {
  const lines = [
    { text: '$ whoami', cls: 'cmd', delay: 500 },
    { text: 'matyas_abraham', cls: 'out', delay: 1200 },
    { text: '$ cat skills.json', cls: 'cmd', delay: 2000 },
    { text: '{ "focus": ["Sec", "Dev", "Ops"], "OS": "Arch Linux" }', cls: 'out', delay: 2800 },
    { text: '$ ls projects/featured', cls: 'cmd', delay: 3800 },
    { text: 'masu-hypr-rice  masu-cyber-academy', cls: 'out', delay: 4500 },
    { text: '$ echo $STATUS', cls: 'cmd', delay: 5500 },
    { text: '"Ready for new challenges."', cls: 'out', delay: 6200 },
  ];

  function addLine(text, cls) {
    const div = document.createElement('div');
    div.className = cls;
    div.innerHTML = text.replace('$ ', '<span class="dim">$ </span>');
    typeArea.appendChild(div);
    typeArea.scrollTop = typeArea.scrollHeight;
  }

  lines.forEach(({ text, cls, delay }) => {
    setTimeout(() => addLine(text, cls), delay);
  });

  // Add blinking cursor after lines
  setTimeout(() => {
    const cursor = document.createElement('span');
    cursor.className = 'cursor-blink';
    typeArea.appendChild(cursor);
  }, 7000);
}

// --- CONTACT FORM (Formspree) ---
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;

    btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;

    try {
      const data = new FormData(contactForm);
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        formStatus.textContent = '✓ Message transmitted successfully.';
        formStatus.style.color = '#00ffaa';
        contactForm.reset();
      } else {
        const json = await res.json();
        formStatus.textContent = json.errors ? json.errors.map(e => e.message).join(', ') : '✗ Something went wrong. Try again.';
        formStatus.style.color = '#ff6b6b';
      }
    } catch (err) {
      formStatus.textContent = '✗ Network error. Please try again.';
      formStatus.style.color = '#ff6b6b';
    }

    btn.innerHTML = originalHTML;
    btn.disabled = false;
    setTimeout(() => { formStatus.textContent = ''; }, 6000);
  });
}

// --- KONAMI CODE EASTER EGG ---
const konamiSequence = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
  'b','a'
];
let konamiProgress = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === konamiSequence[konamiProgress]) {
    konamiProgress++;
    if (konamiProgress === konamiSequence.length) {
      document.getElementById('easter-egg').classList.add('active');
      konamiProgress = 0;
    }
  } else {
    konamiProgress = e.key === konamiSequence[0] ? 1 : 0;
  }
});

// Close Easter egg on backdrop click
document.getElementById('easter-egg')?.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) e.currentTarget.classList.remove('active');
});

// --- ACTIVE LINK OBSERVER ---
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
}, { threshold: 0.5 });

sections.forEach(s => activeObserver.observe(s));
