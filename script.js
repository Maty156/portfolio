/* =============================================
   MASU PORTFOLIO — script.js
   ============================================= */

// ── MATRIX EFFECT ──────────────────────────────
const canvas = document.getElementById("matrix");
if (canvas) {
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const letters  = "01MASU$#☣>_";
  const fontSize = 14;
  let columns = Math.floor(canvas.width / fontSize);
  let drops   = Array(columns).fill(1);

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

// ── SKILL BARS ─────────────────────────────────
const skillSection = document.querySelector("#skills");
if (skillSection) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".bar-fill").forEach(bar => {
          const w = bar.getAttribute("data-width");
          if (w) bar.style.width = w + "%";
        });
      }
    });
  }, { threshold: 0.2 });

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
const terminalBox   = document.getElementById("terminalBox");

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
  // auto focus on click anywhere
  document.addEventListener("click", () => terminalInput.focus());
  setTimeout(() => terminalInput.focus(), 200);

  function printLine(text, cls = "") {
    const p = document.createElement("p");
    p.innerHTML = text;
    if (cls) p.className = cls;
    terminalBox.appendChild(p);
    terminalBox.scrollTop = terminalBox.scrollHeight;
  }

  const commands = {
    help: () => printLine(
      '<span style="color:#00ff9c">Available:</span> help, about, skills, projects, whoami, contact, clear, courses'
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
  };

  terminalInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const raw = this.value.trim();
      printLine(`<span class="prompt">masu@root:~$</span> ${raw}`);
      const cmd = raw.toLowerCase();
      if (cmd === "") { this.value = ""; return; }
      if (commands[cmd]) {
        commands[cmd]();
      } else {
        printLine(`<span style="color:#444">command not found:</span> ${raw}`);
      }
      this.value = "";
    }
  });
}

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

    if (commands[cmd]) {
      commands[cmd]();
    } else if (cmd !== "") {
      printLine(`<span style="color:#444">command not found:</span> ${raw}`);
    }

    this.value = "";
  }

  // ⬆️ UP ARROW (history)
  if (e.key === "ArrowUp") {
    if (historyIndex > 0) {
      historyIndex--;
      this.value = history[historyIndex];
    }
  }

  // ⬇️ DOWN ARROW
  if (e.key === "ArrowDown") {
    if (historyIndex < history.length - 1) {
      historyIndex++;
      this.value = history[historyIndex];
    } else {
      this.value = "";
    }
  }
});

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
  const input   = document.getElementById("courseSearch");
  const noRes   = document.getElementById("no-results");
  const noTerm  = document.getElementById("no-results-term");
  const countEl = document.getElementById("search-count");
  if (!input) return;

  const q     = input.value.toLowerCase().trim();
  const cards = document.querySelectorAll(".course-card");
  let   shown = 0;

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

function setFilter(type) {
  document.querySelectorAll(".course-section").forEach(sec => {
    if (type === "all") {
      sec.style.display = "";
    } else {
      sec.style.display = sec.dataset.section === type ? "" : "none";
    }
  });
}

function setFilter(type) {
  const buttons = document.querySelectorAll(".course-filters button");

  buttons.forEach(btn => {
    btn.classList.remove("active");
  });

  event.target.classList.add("active");

  document.querySelectorAll(".course-section").forEach(sec => {
    if (type === "all") {
      sec.style.display = "";
    } else {
      sec.style.display = sec.dataset.section === type ? "" : "none";
    }
  });
}