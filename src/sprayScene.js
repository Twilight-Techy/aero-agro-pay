// Spray particle canvas — 2D canvas-based water mist simulation
export function initSprayScene(canvas) {
  const ctx = canvas.getContext('2d');
  let W = canvas.offsetWidth || 180;
  let H = canvas.offsetHeight || 320;
  canvas.width = W;
  canvas.height = H;

  let isActive = false;
  let animId;
  let particles = [];
  let pressure = 0; // 0-100

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = W / 2 + (Math.random() - 0.5) * 20;
      this.y = H * 0.15;
      this.vx = (Math.random() - 0.5) * 2.5;
      this.vy = 1 + Math.random() * 2;
      this.life = 0;
      this.maxLife = 60 + Math.random() * 40;
      this.radius = 1 + Math.random() * 2;
      this.alpha = 0.5 + Math.random() * 0.5;
    }
    update() {
      this.x += this.vx;
      this.vy += 0.06;
      this.y += this.vy;
      this.vx *= 0.98;
      this.life++;
      if (this.life > this.maxLife || this.y > H) this.reset();
    }
    draw() {
      const progress = this.life / this.maxLife;
      const alpha = this.alpha * (1 - progress) * (isActive ? 1 : 0);
      if (alpha <= 0) return;
      ctx.beginPath();
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
      grad.addColorStop(0, `rgba(150, 220, 255, ${alpha})`);
      grad.addColorStop(1, `rgba(80, 160, 230, 0)`);
      ctx.fillStyle = grad;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Create particles
  for (let i = 0; i < 120; i++) {
    const p = new Particle();
    p.life = Math.random() * p.maxLife; // stagger
    particles.push(p);
  }

  const animate = () => {
    animId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, W, H);

    // Background
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#060914');
    bg.addColorStop(1, '#0a1020');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    if (isActive) {
      // Nozzle glow
      const nozzleGrad = ctx.createRadialGradient(W / 2, H * 0.15, 0, W / 2, H * 0.15, 30);
      nozzleGrad.addColorStop(0, 'rgba(100, 200, 255, 0.3)');
      nozzleGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = nozzleGrad;
      ctx.fillRect(0, 0, W, H);
    }

    particles.forEach(p => { p.update(); p.draw(); });

    // Nozzle indicator
    ctx.beginPath();
    ctx.arc(W / 2, H * 0.13, 6, 0, Math.PI * 2);
    ctx.fillStyle = isActive ? '#4daaff' : '#334455';
    ctx.fill();
    if (isActive) {
      ctx.beginPath();
      ctx.arc(W / 2, H * 0.13, 10, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(77, 170, 255, 0.2)';
      ctx.fill();
    }
  };
  animate();

  const handleResize = () => {
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;
  };
  window.addEventListener('resize', handleResize);

  return {
    setActive: (active) => { isActive = active; },
    setPressure: (p) => { pressure = p; },
    dispose: () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    },
  };
}
