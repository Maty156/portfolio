/* =============================================
   MASU PORTFOLIO — script.js
   ============================================= */

// ── MATRIX EFFECT ──────────────────────────────
const canvas = document.getElementById("matrix");
if (canvas) {
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const letters = "01MASU$#☣>_";
  const fontSize = 14;
  let columns = Math.floor(canvas.width / fontSize);
  let drops = Array(columns).fill(1);

  function drawMatrix() {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00ff9c";
    ctx.font = fontSize + "px monospace";

    drops.forEach((y, i) => {
      const text = letters[Math.floor(Math.random() * letters.length)];
      ctx.fillText(text, i * fontSize, y * fontSize);
      if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }

  setInterval(drawMatrix, 50);
}

// ── SKILL RINGS ─────────────────────────────────
const skillSection = document.querySelector("#skills");
if (skillSection) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".skill-ring").forEach(ring => {
          const percent = ring.getAttribute("data-percent");
          const circle = ring.querySelector(".ring-fill");
          const counter = ring.querySelector(".counter");
          
          if (percent && circle) {
            const circumference = 283;
            const offset = circumference - (circumference * percent) / 100;
            circle.style.strokeDashoffset = offset;
            
            if (counter && counter.textContent === "0") {
              let count = 0;
              const target = parseInt(percent, 10);
              const duration = 1500;
              const interval = 30;
              const step = Math.max(1, Math.floor(target / (duration / interval)));
              
              const updateCounter = setInterval(() => {
                count += step;
                if (count >= target) {
                  count = target;
                  clearInterval(updateCounter);
                }
                counter.textContent = count;
              }, interval);
            }
          }
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(skillSection);
}

// ── REVEAL ON SCROLL ───────────────────────────
const revealEls = document.querySelectorAll(".reveal");
if (revealEls.length) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => revealObserver.observe(el));
}

// ── TERMINAL ───────────────────────────────────
const terminalInput = document.getElementById("terminalInput");
const terminalBox = document.getElementById("terminalBox");

function typeIntro(text) {
  let i = 0;
  const interval = setInterval(() => {
    if (i < text.length) {
      terminalBox.innerHTML += text[i];
      i++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

if (terminalInput && terminalBox) {
  // auto focus when clicking inside the terminal section
  const terminalSection = document.getElementById("terminal");
  if (terminalSection) {
    terminalSection.addEventListener("click", () => terminalInput.focus());
  }

  function printLine(text, cls = "") {
    const p = document.createElement("p");
    p.innerHTML = text;
    if (cls) p.className = cls;
    terminalBox.appendChild(p);
    terminalBox.scrollTop = terminalBox.scrollHeight;
  }

  const commands = {
    help: () => printLine(
      '<span style="color:#00ff9c">Available:</span> help, about, skills, projects, whoami, contact, clear, courses, github'
    ),
    about: () => printLine(
      "Matyas Abraham — Cybersecurity student from Addis Ababa, Ethiopia. Founder of MASU Cyber Academy."
    ),
    skills: () => printLine(
      "Arch Linux 88% | Bash 80% | Frontend 78% | Web Security 65% | Networking 60% | Python 35%"
    ),
    projects: () => printLine(
      "MASU Hyprland Installer v2.3 | MASU Terminal Installer v7 | MASU Cyber Academy"
    ),
    whoami: () => printLine('<span style="color:#ff4444">root</span>'),
    contact: () => printLine(
      'GitHub: <a href="https://github.com/Maty156" style="color:#00ff9c" target="_blank">github.com/Maty156</a>'
    ),
    courses: () => {
      printLine('Opening courses... <a href="courses.html" style="color:#00ff9c" target="_blank">courses.html</a>');
    },
    clear: () => { terminalBox.innerHTML = ""; },
    github: async () => {
      printLine('Establishing secure connection to GitHub...');
      try {
        const res = await fetch('https://api.github.com/users/Maty156/repos?sort=updated&per_page=3');
        const data = await res.json();
        if (data && data.length > 0) {
          data.forEach(repo => {
            printLine(`> <a href="${repo.html_url}" style="color:#00ff9c" target="_blank">${repo.name}</a> - ⭐${repo.stargazers_count} [${repo.language || 'N/A'}]`);
          });
        } else {
          printLine('No repositories found.');
        }
      } catch (e) {
        printLine('<span style="color:#ff4444">Connection refused. Target host unreachable.</span>');
      }
    },
  };

  let history = [];
  let historyIndex = -1;

  terminalInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const raw = this.value.trim();
      printLine(`<span class="prompt">masu@root:~$</span> ${raw}`);

      if (raw !== "") {
        history.push(raw);
        historyIndex = history.length;
      }

      const cmd = raw.toLowerCase();
      if (cmd === "") { this.value = ""; return; }

      if (commands[cmd]) {
        commands[cmd]();
      } else {
        printLine(`<span style="color:#444">command not found:</span> ${raw}`);
      }

      this.value = "";
    }

    // ⬆️ UP ARROW (history)
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        this.value = history[historyIndex];
      }
    }

    // ⬇️ DOWN ARROW
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        this.value = history[historyIndex];
      } else if (historyIndex === history.length - 1) {
        historyIndex++;
        this.value = "";
      }
    }
  });
}

// ── DB STATUS ──────────────────────────────────
window.addEventListener("load", () => {
  const status = document.getElementById("db-status");
  if (status) {
    setTimeout(() => {
      status.textContent = "✓ Database loaded — " + new Date().toLocaleTimeString();
      status.style.color = "#00ff9c";
    }, 1200);
  }
});

// ── COURSE SEARCH ──────────────────────────────
function filterCourses() {
  const input = document.getElementById("courseSearch");
  const noRes = document.getElementById("no-results");
  const noTerm = document.getElementById("no-results-term");
  const countEl = document.getElementById("search-count");
  if (!input) return;

  const q = input.value.toLowerCase().trim();
  const cards = document.querySelectorAll(".course-card");
  let shown = 0;

  cards.forEach(card => {
    const name = (card.dataset.name || "").toLowerCase();
    const title = (card.querySelector(".course-title")?.textContent || "").toLowerCase();
    const match = !q || name.includes(q) || title.includes(q);
    card.style.display = match ? "flex" : "none";
    if (match) shown++;
  });

  // Show/hide sections if all cards hidden
  document.querySelectorAll(".course-section").forEach(sec => {
    const visible = [...sec.querySelectorAll(".course-card")]
      .some(c => c.style.display !== "none");
    sec.style.display = visible ? "" : "none";
  });

  if (noRes) {
    noRes.style.display = (q && shown === 0) ? "block" : "none";
    if (noTerm) noTerm.textContent = q;
  }

  if (countEl) {
    countEl.textContent = q ? `${shown} result${shown !== 1 ? "s" : ""}` : "";
  }
}

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const top = section.offsetTop - 100;
    if (scrollY >= top) current = section.getAttribute("id");
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href").includes(current)) {
      link.classList.add("active");
    }
  });
});

function setFilter(type, btnElement) {
  if (btnElement) {
    const buttons = document.querySelectorAll(".course-filters button");
    buttons.forEach(btn => btn.classList.remove("active"));
    btnElement.classList.add("active");
  }

  document.querySelectorAll(".course-section").forEach(sec => {
    if (type === "all") {
      sec.style.display = "";
    } else {
      sec.style.display = sec.dataset.section === type ? "" : "none";
    }
  });
}

// ── BOOT SEQUENCE ─────────────────────────────
const bootScreen = document.getElementById("boot-screen");
const bootLog = document.getElementById("boot-log");
const mainContent = document.getElementById("main-content");

if (bootScreen && bootLog && mainContent) {
  // Check if we already booted this session to avoid annoyance
  if (!sessionStorage.getItem("booted")) {
    const logs = [
      "BIOS Date 04/03/26 21:24:55 Ver 08.00.15",
      "CPU: AuthenticAMD Ryzen 9 Processor",
      "Memory Test: 32768K OK",
      "[ OK ] Starting udev Kernel Device Manager...",
      "[ OK ] Started Network Manager.",
      "Mounting /home/matyas/portfolio...",
      "[ OK ] Mounted Portfolio Directory.",
      "Initializing MASU Security Protocols...",
      "Generating RSA Keys... Done.",
      "Establishing link to root server...",
      "[ OK ] Connection Established.",
      "Loading GUI Framework..."
    ];

    let delay = 0;
    logs.forEach((log, i) => {
      delay += Math.random() * 200 + 100;
      setTimeout(() => {
        const p = document.createElement("p");
        p.textContent = log;
        bootLog.appendChild(p);
        if (i === logs.length - 1) {
          setTimeout(() => {
            bootScreen.style.display = "none";
            mainContent.style.display = "block";
            void mainContent.offsetWidth;
            mainContent.style.opacity = 1;
            sessionStorage.setItem("booted", "true");
          }, 600);
        }
      }, delay);
    });
  } else {
    bootScreen.style.display = "none";
    mainContent.style.display = "block";
    mainContent.style.opacity = 1;
  }
}

// ── WEB AUDIO BEEP ─────────────────────────────
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function playHoverBeep() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.05);

  gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.05);
}

document.querySelectorAll('a, button, .project, .tool-item, .btn-glow').forEach(el => {
  el.addEventListener('mouseenter', playHoverBeep);
});

// ── GLITCHING TEXT ─────────────────────────────
const glitchElements = document.querySelectorAll('.glitch-target');
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';

glitchElements.forEach(el => {
  // Save original if it has text, else fallback to picking from parent
  const original = el.textContent || el.parentElement.childNodes[0].textContent.trim();
  if(!el.textContent) el.textContent = original; // initialize

  setInterval(() => {
    let scrambled = '';
    for (let i = 0; i < original.length; i++) {
      scrambled += original[i] === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)];
    }
    el.textContent = scrambled;
    setTimeout(() => {
      el.textContent = original;
    }, 150);
  }, Math.random() * 5000 + 5000); 
});

// ── ENCRYPTED SECURE FORM ──────────────────────
const secureForm = document.getElementById('secure-form');
const btnEncrypt = document.getElementById('btn-encrypt');
const encryptStatus = document.getElementById('encrypt-status');

if (secureForm) {
  secureForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const alias = document.getElementById('contact-alias').value;
    const msg = document.getElementById('contact-msg').value;
    
    if(!alias || !msg) return;
    
    btnEncrypt.disabled = true;
    let iterations = 0;
    const maxIterations = 20;
    
    const encryptInterval = setInterval(() => {
      encryptStatus.textContent = "ENCRYPTING OUTBOUND PKT... " + Math.random().toString(36).substring(2, 12).toUpperCase();
      iterations++;
      
      if (iterations >= maxIterations) {
        clearInterval(encryptInterval);
        encryptStatus.textContent = "TRANSMITTED SUCCESSFULLY.";
        encryptStatus.style.color = "var(--cyan)";
        
        setTimeout(() => {
          const mailto = `mailto:matyasabreham7@gmail.com?subject=Secure Proxy from ${encodeURIComponent(alias)}&body=${encodeURIComponent(msg)}`;
          window.location.href = mailto;
          
          secureForm.reset();
          btnEncrypt.disabled = false;
          setTimeout(() => encryptStatus.textContent = "", 3000);
        }, 800);
      }
    }, 80);
  });
}