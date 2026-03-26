// =============================================
//  ui.js  —  Portfolio UI layer
//  Nav · Cards · Modal · Skills · Ink meter
//  Mobile drawer · Keyboard shortcuts
//  Card hover sparks · Eraser wipe transition
//  Clear canvas · Stamp pool
// =============================================

// ---- STATE ----
let inkLevel    = 0;
let inkRewarded = false;
const MAX_INK   = 100;
const SECTIONS  = ['home','animation','gamedesign','gameart','illustration','about'];

// ---- FOOTER YEAR ----
const fyEl = document.getElementById('footer-year');
if (fyEl) fyEl.textContent = new Date().getFullYear();

// =============================================
//  ERASER WIPE + SECTION SWITCHING
// =============================================
let isWiping = false;

function switchSection(name) {
  if (isWiping || !SECTIONS.includes(name)) return;
  const target = document.getElementById('section-' + name);
  const current = document.querySelector('.section.active');
  if (!target || target === current) return;

  isWiping = true;
  closeMobileDrawer();

  const wipe = document.getElementById('eraser-wipe');
  wipe.classList.add('wiping');

  setTimeout(() => {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    target.classList.add('active');
    document.querySelectorAll(`.nav-btn[data-section="${name}"]`).forEach(b => b.classList.add('active'));
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (name === 'about') setTimeout(animateSkillBars, 300);
  }, 200);

  setTimeout(() => {
    wipe.classList.remove('wiping');
    isWiping = false;
  }, 450);
}

// =============================================
//  NAV — desktop buttons
// =============================================
document.querySelectorAll('.nav-btn:not(.mobile)').forEach(btn => {
  btn.addEventListener('click', () => switchSection(btn.dataset.section));
});

// =============================================
//  MOBILE HAMBURGER DRAWER
// =============================================
const hamburger    = document.getElementById('hamburger');
const mobileDrawer = document.getElementById('mobile-drawer');

function openMobileDrawer() {
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  mobileDrawer.classList.add('open');
  mobileDrawer.setAttribute('aria-hidden', 'false');
}

function closeMobileDrawer() {
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileDrawer.classList.remove('open');
  mobileDrawer.setAttribute('aria-hidden', 'true');
}

hamburger.addEventListener('click', e => {
  e.stopPropagation();
  mobileDrawer.classList.contains('open') ? closeMobileDrawer() : openMobileDrawer();
});

document.querySelectorAll('.nav-btn.mobile').forEach(btn => {
  btn.addEventListener('click', () => switchSection(btn.dataset.section));
});

document.addEventListener('click', e => {
  if (!mobileDrawer.contains(e.target) && !hamburger.contains(e.target)) {
    closeMobileDrawer();
  }
});

// =============================================
//  KEYBOARD SHORTCUTS
// =============================================
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  const map = {'1':'home','2':'animation','3':'gamedesign','4':'gameart','5':'illustration','6':'about'};
  if (map[e.key]) { switchSection(map[e.key]); return; }
  if (e.key === 'c' || e.key === 'C') { clearCanvas(); return; }
  if (e.key === 'Escape') { closeModal(); closeMobileDrawer(); }
});

// =============================================
//  CLEAR CANVAS  (proxies into sketch.js)
// =============================================
function clearCanvas() {
  if (typeof window.clearPencilTrail === 'function') window.clearPencilTrail();
  const btn = document.getElementById('clear-canvas-btn');
  if (!btn) return;
  btn.textContent = '✓ cleared';
  setTimeout(() => { btn.textContent = '⌫ clear canvas'; }, 1300);
}

document.getElementById('clear-canvas-btn')?.addEventListener('click', clearCanvas);

// =============================================
//  BUILD PROJECT GRIDS
// =============================================
function buildGrids() {
  Object.keys(PROJECTS).forEach(category => {
    const grid = document.getElementById('grid-' + category);
    if (!grid) return;
    PROJECTS[category].forEach(p => grid.appendChild(makeCard(p)));
  });
}

function makeCard(project) {
  const card = document.createElement('div');
  card.className = 'project-card';
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', 'View project: ' + project.title);

  const rot = (Math.random() * 1.4 - 0.7).toFixed(2);
  const tx  = (Math.random() * 6 - 3).toFixed(1);
  const ty  = (Math.random() * 4 - 2).toFixed(1);
  card.style.transform = `rotate(${rot}deg) translate(${tx}px,${ty}px)`;

  card.innerHTML =
    makeSketchBorderSVG() +
    `<div class="card-img-wrap">
      ${project.image
        ? `<img src="${project.image}" alt="${project.title}" loading="lazy"/>`
        : `<div class="card-img-placeholder">[ add image in projects.js ]</div>`}
      <div class="card-tag">${project.tag}</div>
    </div>
    <div class="card-body">
      <div class="card-title">${project.title}</div>
      <div class="card-desc">${project.desc}</div>
      <div class="card-tools">
        ${project.tools.map(t => `<span class="card-tool-tag">${t}</span>`).join('')}
      </div>
    </div>`;

  card.addEventListener('mouseenter', () => emitCardSparks(card));
  card.addEventListener('click',   () => openModal(project));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(project); }
  });
  return card;
}

function makeSketchBorderSVG() {
  const W = 320, H = 290;
  const j = () => (Math.random() * 6 - 3).toFixed(1);
  const c = [[+j(),+j()],[W+(+j()),+j()],[W+(+j()),H+(+j())],[+j(),H+(+j())]];
  const poly  = c.map(p => p.join(',')).join(' ');
  const shift = [[1.5,1],[-1,1.5],[-1.5,-1],[1,-1.5]];
  const poly2 = c.map(([x,y],i) => [(+x+shift[i][0]).toFixed(1),(+y+shift[i][1]).toFixed(1)].join(',')).join(' ');
  return `<svg class="sketch-border" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"
     xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <polygon points="${poly}" fill="none" stroke="rgba(10,10,10,0.62)"
      stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    <polygon points="${poly2}" fill="none" stroke="rgba(10,10,10,0.17)"
      stroke-width="1" stroke-linejoin="round" stroke-linecap="round"
      stroke-dasharray="9 5 13 3 7 9"/>
  </svg>`;
}

// =============================================
//  CARD HOVER SPARKS
// =============================================
const sparkCanvas = document.getElementById('spark-canvas');
const sparkCtx    = sparkCanvas ? sparkCanvas.getContext('2d') : null;
let   sparks = [];
let   sparkRAF = null;

function resizeSparkCanvas() {
  if (!sparkCanvas) return;
  sparkCanvas.width  = window.innerWidth;
  sparkCanvas.height = window.innerHeight;
}
resizeSparkCanvas();
window.addEventListener('resize', resizeSparkCanvas);

function emitCardSparks(cardEl) {
  if (!sparkCtx) return;
  const r  = cardEl.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + 8;
  const n  = 12 + Math.floor(Math.random() * 10);
  for (let i = 0; i < n; i++) {
    const angle = -Math.PI + Math.random() * Math.PI;
    const speed = 1.0 + Math.random() * 3.0;
    sparks.push({
      x: cx + (Math.random() - 0.5) * r.width * 0.65,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.2,
      size:  1.2 + Math.random() * 2.4,
      alpha: 0.65 + Math.random() * 0.35,
      g: Math.floor(Math.random() * 90 + 10),
      life: 0.955 + Math.random() * 0.03,
    });
  }
  if (!sparkRAF) tickSparks();
}

function tickSparks() {
  sparkCtx.clearRect(0, 0, sparkCanvas.width, sparkCanvas.height);
  sparks.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    p.vy += 0.11; p.vx *= 0.975;
    p.alpha *= p.life;
    sparkCtx.globalAlpha = p.alpha;
    sparkCtx.fillStyle = `rgb(${p.g},${p.g},${p.g})`;
    sparkCtx.beginPath();
    sparkCtx.ellipse(p.x, p.y, p.size, p.size * 0.5, p.vx * 0.25, 0, Math.PI * 2);
    sparkCtx.fill();
  });
  sparkCtx.globalAlpha = 1;
  sparks = sparks.filter(p => p.alpha > 0.012);
  if (sparks.length > 0) {
    sparkRAF = requestAnimationFrame(tickSparks);
  } else {
    sparkRAF = null;
    sparkCtx.clearRect(0, 0, sparkCanvas.width, sparkCanvas.height);
  }
}

// =============================================
//  MODAL
// =============================================
function openModal(project) {
  const modal = document.getElementById('project-modal');
  const inner = document.getElementById('modal-inner');
  inner.innerHTML =
    `<span class="modal-tag">${project.tag}</span>
    <h2>${project.title}</h2>
    ${project.image
      ? `<img src="${project.image}" alt="${project.title}"/>`
      : `<div class="modal-placeholder-img">[ ${project.title} — add image in projects.js ]</div>`}
    <p>${project.longDesc}</p>
    <div class="modal-tools">
      ${project.tools.map(t => `<span class="modal-tool">${t}</span>`).join('')}
    </div>
    ${project.link ? `<a href="${project.link}" target="_blank" rel="noopener" class="modal-link">view project ↗</a>` : ''}`;

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('modal-close')?.focus(), 60);
}

function closeModal() {
  const modal = document.getElementById('project-modal');
  if (!modal || modal.style.display === 'none') return;
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

document.getElementById('modal-close')?.addEventListener('click', closeModal);
document.getElementById('project-modal')?.addEventListener('click', e => {
  if (e.target === document.getElementById('project-modal')) closeModal();
});

// =============================================
//  SKILLS BARS
// =============================================
function buildSkills() {
  const list = document.getElementById('skills-list');
  if (!list) return;
  SKILLS.forEach(skill => {
    const item = document.createElement('div');
    item.className = 'skill-item';
    item.innerHTML =
      `<span class="skill-name">${skill.name}</span>
      <div class="skill-bar-track">
        <div class="skill-bar-fill" data-level="${skill.level}" style="width:0%"></div>
      </div>
      <span class="skill-pct">${skill.level}%</span>`;
    list.appendChild(item);
  });
}

function animateSkillBars() {
  document.querySelectorAll('.skill-bar-fill').forEach(bar => {
    bar.style.width = bar.dataset.level + '%';
  });
}

// =============================================
//  INK METER  (called from sketch.js)
// =============================================
function addInk(amount) {
  if (inkRewarded) return;
  inkLevel = Math.min(MAX_INK, inkLevel + amount);
  const fill = document.getElementById('ink-fill');
  const hint = document.getElementById('ink-hint');
  if (fill) fill.style.width = inkLevel + '%';
  if (inkLevel >= MAX_INK && !inkRewarded) {
    inkRewarded = true;
    if (hint) hint.textContent = '✦ ink full!';
    triggerInkReward();
  } else if (inkLevel > 65 && hint) {
    hint.textContent = 'almost there...';
  } else if (inkLevel > 30 && hint) {
    hint.textContent = 'keep going!';
  }
}

function triggerInkReward() {
  const reward = document.getElementById('ink-reward');
  if (!reward) return;
  reward.style.display = 'block';
  setTimeout(() => { reward.style.display = 'none'; }, 3200);
  for (let i = 0; i < 10; i++) {
    setTimeout(() => spawnStamp(
      80 + Math.random() * (window.innerWidth  - 160),
      80 + Math.random() * (window.innerHeight - 160),
      ['★','✦','✿','◆','❋'][Math.floor(Math.random()*5)]
    ), i * 110);
  }
}

// =============================================
//  STAMP BURST — pooled so multiples coexist
// =============================================
const STAMP_GLYPHS = ['★','✦','✿','◆','❋','✸','❄','✪','◉','⬡'];
const STAMP_GREYS  = ['#0d0d0d','#2a2a2a','#555555','#888888'];
const POOL_SIZE    = 8;
const stampPool    = [];

for (let i = 0; i < POOL_SIZE; i++) {
  const el = document.createElement('div');
  el.className = 'stamp-burst';
  document.body.appendChild(el);
  stampPool.push({ el, free: true, t: null });
}

function spawnStamp(x, y, glyph) {
  const slot = stampPool.find(s => s.free) || stampPool[0];
  slot.free  = false;
  clearTimeout(slot.t);
  const el = slot.el;
  el.textContent = glyph || STAMP_GLYPHS[Math.floor(Math.random() * STAMP_GLYPHS.length)];
  el.style.left      = (x - 20) + 'px';
  el.style.top       = (y - 20) + 'px';
  el.style.color     = STAMP_GREYS[Math.floor(Math.random() * STAMP_GREYS.length)];
  el.style.fontSize  = (22 + Math.random() * 26) + 'px';
  el.style.transform = `rotate(${(Math.random()*32-16).toFixed(1)}deg) scale(0.15)`;
  el.style.opacity   = '0';
  void el.offsetWidth;
  el.classList.add('pop');
  slot.t = setTimeout(() => { el.classList.remove('pop'); slot.free = true; }, 780);
}

document.addEventListener('contextmenu', e => { e.preventDefault(); spawnStamp(e.clientX, e.clientY); });

// =============================================
//  INIT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  buildGrids();
  buildSkills();
});
