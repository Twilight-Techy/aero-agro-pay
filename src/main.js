import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initHeroScene } from './heroScene.js';
import { initDroneScene } from './droneScene.js';
import { initSprayScene } from './sprayScene.js';
import { initCtaScene } from './ctaScene.js';

gsap.registerPlugin(ScrollTrigger);

// ════════════════════════════════════════════
// NAVIGATION
// ════════════════════════════════════════════
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ════════════════════════════════════════════
// HERO CANVAS
// ════════════════════════════════════════════
const heroCanvas = document.getElementById('hero-canvas');
if (heroCanvas) {
  heroCanvas.width = heroCanvas.offsetWidth;
  heroCanvas.height = heroCanvas.offsetHeight;
  initHeroScene(heroCanvas);
}

// ════════════════════════════════════════════
// SCROLL REVEAL — Generic
// ════════════════════════════════════════════
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => revealObserver.observe(el));

// ════════════════════════════════════════════
// PROBLEM CARDS — staggered reveal
// ════════════════════════════════════════════
const probCards = document.querySelectorAll('.problem__card');
const probObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const idx = [...probCards].indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), idx * 120);
        probObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);
probCards.forEach((c) => probObserver.observe(c));

// ════════════════════════════════════════════
// STEPS — slide in on scroll
// ════════════════════════════════════════════
const steps = document.querySelectorAll('.step');
const stepObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const idx = [...steps].indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), idx * 150);
        stepObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);
steps.forEach((s) => stepObserver.observe(s));

// ════════════════════════════════════════════
// NETWORK BENEFITS — staggered reveal
// ════════════════════════════════════════════
const benefits = document.querySelectorAll('.network__benefit');
const benefitObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const idx = [...benefits].indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), idx * 100);
        benefitObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
benefits.forEach((b) => benefitObserver.observe(b));

// ════════════════════════════════════════════
// IMPACT CARDS — counter animation
// ════════════════════════════════════════════
const impactCards = document.querySelectorAll('.impact__card');
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        const numEl = entry.target.querySelector('.impact__card-number');
        if (numEl) {
          const target = parseFloat(numEl.dataset.target);
          const isDecimal = target % 1 !== 0;
          const duration = 2000;
          const start = performance.now();
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = target * eased;
            numEl.textContent = isDecimal
              ? value.toFixed(1)
              : Math.floor(value).toLocaleString();
            if (progress < 1) requestAnimationFrame(tick);
            else numEl.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString();
          };
          requestAnimationFrame(tick);
        }
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);
impactCards.forEach((c) => counterObserver.observe(c));

// ════════════════════════════════════════════
// NETWORK MAP — animated nodes
// ════════════════════════════════════════════
const networkMap = document.getElementById('network-map');
const nodesContainer = document.getElementById('network-nodes');

if (networkMap && nodesContainer) {
  const nodeData = [
    { x: 20, y: 30, type: 'aero', label: 'Lagos Hub' },
    { x: 45, y: 15, type: 'aero', label: 'Abuja Node' },
    { x: 70, y: 40, type: 'aero', label: 'Kano Hub' },
    { x: 30, y: 60, type: 'opay', label: 'OPay Agent' },
    { x: 60, y: 70, type: 'opay', label: 'OPay Agent' },
    { x: 15, y: 55, type: 'opay', label: 'OPay Agent' },
    { x: 80, y: 20, type: 'opay', label: 'OPay Agent' },
    { x: 50, y: 50, type: 'aero', label: 'Ibadan Node' },
    { x: 85, y: 65, type: 'opay', label: 'OPay Agent' },
    { x: 35, y: 80, type: 'opay', label: 'OPay Agent' },
    { x: 65, y: 85, type: 'aero', label: 'Port Harcourt' },
    { x: 10, y: 25, type: 'opay', label: 'OPay Agent' },
  ];

  nodeData.forEach((node, i) => {
    const el = document.createElement('div');
    el.className = `network-node network-node--${node.type}`;
    el.style.left = `${node.x}%`;
    el.style.top = `${node.y}%`;
    el.style.animationDelay = `${i * 0.4}s`;
    el.style.opacity = '0';
    el.title = node.label;

    setTimeout(() => {
      el.style.transition = 'opacity 0.5s ease';
      el.style.opacity = '1';
    }, 500 + i * 200);

    nodesContainer.appendChild(el);
  });

  // Draw SVG connection lines
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
  networkMap.insertBefore(svg, nodesContainer);

  const connections = [[0,3],[0,5],[1,6],[2,7],[4,8],[3,7],[7,4],[10,8],[10,9]];
  connections.forEach(([a, b], i) => {
    const na = nodeData[a];
    const nb = nodeData[b];
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', `${na.x}%`);
    line.setAttribute('y1', `${na.y}%`);
    line.setAttribute('x2', `${nb.x}%`);
    line.setAttribute('y2', `${nb.y}%`);
    line.setAttribute('stroke', na.type === 'aero' ? 'rgba(0,255,136,0.2)' : 'rgba(255,184,48,0.15)');
    line.setAttribute('stroke-width', '1');
    line.setAttribute('stroke-dasharray', '4,4');
    svg.appendChild(line);
  });
}

// ════════════════════════════════════════════
// CTA CANVAS
// ════════════════════════════════════════════
const ctaCanvas = document.getElementById('cta-canvas');
if (ctaCanvas) {
  initCtaScene(ctaCanvas);
}

// ════════════════════════════════════════════
// INTERACTIVE DEMO
// ════════════════════════════════════════════
let droneController = null;
let sprayController = null;
let demoPlaying = false;

// Init demo canvases
const droneCanvas = document.getElementById('drone-canvas');
const sprayCanvas = document.getElementById('spray-canvas');

if (droneCanvas) {
  droneController = initDroneScene(droneCanvas);
}
if (sprayCanvas) {
  sprayController = initSprayScene(sprayCanvas);
}

// Status element references
const phonePayBtn = document.getElementById('phone-pay-btn');
const phoneStatusMsg = document.getElementById('phone-status-msg');
const connPulse = document.getElementById('conn-pulse');
const connLabel = document.getElementById('conn-label');
const statusVal = document.getElementById('status-val');
const motorsVal = document.getElementById('motors-val');
const payloadVal = document.getElementById('payload-val');
const missionVal = document.getElementById('mission-val');
const rpmBars = [
  document.getElementById('rpm-1'),
  document.getElementById('rpm-2'),
  document.getElementById('rpm-3'),
  document.getElementById('rpm-4'),
];
const pumpIcon = document.getElementById('pump-icon');
const pumpLabel = document.getElementById('pump-label');
const psiVal = document.getElementById('psi-val');
const demoHint = document.getElementById('demo-hint');
const demoResetBtn = document.getElementById('demo-reset');

function setStatus(el, text, cls) {
  if (!el) return;
  el.textContent = text;
  el.className = 'drone-status__val';
  if (cls) el.classList.add(cls);
}

function animatePressure(targetPsi, duration) {
  if (!psiVal) return;
  const start = parseInt(psiVal.textContent) || 0;
  const startTime = performance.now();
  const tick = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 2);
    psiVal.textContent = Math.round(start + (targetPsi - start) * eased);
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

async function runDemoSequence() {
  if (demoPlaying) return;
  demoPlaying = true;
  phonePayBtn.disabled = true;
  if (demoHint) demoHint.textContent = 'Demo in progress...';

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  // ── Step 1: Payment processing ──
  phoneStatusMsg.textContent = '⏳ Processing payment...';
  await delay(800);
  phoneStatusMsg.textContent = '✅ Payment confirmed! ₦2,500.00';
  phoneStatusMsg.style.color = '#00ff88';

  // Trigger connection animation
  await delay(300);
  if (connPulse) {
    connPulse.classList.add('active');
    setTimeout(() => connPulse.classList.remove('active'), 600);
  }
  if (connLabel) connLabel.textContent = '⚡ Triggering webhook';

  await delay(700);
  if (connPulse) {
    connPulse.classList.add('active');
    setTimeout(() => connPulse.classList.remove('active'), 600);
  }
  if (connLabel) connLabel.textContent = 'Mission dispatched';

  // ── Step 2: Drone arms ──
  await delay(600);
  setStatus(statusVal, 'ARMED', 'active');
  setStatus(motorsVal, 'SPINNING UP', 'warn');

  // Spin up RPM bars with stagger
  rpmBars.forEach((bar, i) => {
    setTimeout(() => {
      if (bar) bar.classList.add('spinning');
    }, i * 200);
  });

  // Drive motor speed gradually
  let speed = 0;
  const speedInterval = setInterval(() => {
    speed = Math.min(speed + 0.06, 1);
    if (droneController) droneController.setMotorSpeed(speed);
    if (speed >= 1) clearInterval(speedInterval);
  }, 80);

  await delay(1600);
  setStatus(motorsVal, 'NOMINAL', 'active');
  setStatus(missionVal, 'EXECUTING', 'active');

  // ── Step 3: Payload fires ──
  await delay(400);
  setStatus(payloadVal, 'FIRING', 'warn');
  if (pumpIcon) pumpIcon.classList.add('active');
  if (pumpLabel) pumpLabel.textContent = 'PUMP ACTIVE';
  if (sprayController) sprayController.setActive(true);
  animatePressure(87, 1200);

  await delay(1500);
  setStatus(payloadVal, 'SPRAYING', 'active');
  if (pumpLabel) pumpLabel.textContent = 'SPRAYING FIELD';

  await delay(2000);

  // ── Complete ──
  setStatus(statusVal, 'MISSION OK', 'active');
  setStatus(missionVal, 'COMPLETE ✓', 'active');
  if (connLabel) connLabel.textContent = '✅ Mission complete';
  if (demoHint) demoHint.textContent = 'Mission complete! Click Reset to run again.';
}

function resetDemo() {
  demoPlaying = false;
  if (phonePayBtn) {
    phonePayBtn.disabled = false;
    phonePayBtn.querySelector('.phone-pay-btn__text').textContent = 'Pay Now';
  }
  if (phoneStatusMsg) { phoneStatusMsg.textContent = ''; phoneStatusMsg.style.color = ''; }
  if (connPulse) connPulse.classList.remove('active');
  if (connLabel) connLabel.textContent = 'Webhook trigger';

  setStatus(statusVal, 'STANDBY', '');
  setStatus(motorsVal, 'IDLE', '');
  setStatus(payloadVal, 'ARMED', '');
  setStatus(missionVal, 'AWAITING', '');

  rpmBars.forEach(bar => { if (bar) bar.classList.remove('spinning'); });
  if (droneController) droneController.setMotorSpeed(0);

  if (pumpIcon) pumpIcon.classList.remove('active');
  if (pumpLabel) pumpLabel.textContent = 'PUMP STANDBY';
  if (psiVal) psiVal.textContent = '0';
  if (sprayController) sprayController.setActive(false);

  if (demoHint) demoHint.textContent = 'Click "Pay Now" on the phone to trigger the sequence';
}

if (phonePayBtn) phonePayBtn.addEventListener('click', runDemoSequence);
if (demoResetBtn) demoResetBtn.addEventListener('click', resetDemo);

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
