// CTA background canvas — particle field with green glow
export function initCtaScene(canvas) {
  const ctx = canvas.getContext('2d');
  let W, H;

  const resize = () => {
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;
  };
  resize();

  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * 1000,
    y: Math.random() * 400,
    r: 1 + Math.random() * 2,
    vx: (Math.random() - 0.5) * 0.3,
    vy: -0.2 - Math.random() * 0.3,
    alpha: 0.2 + Math.random() * 0.4,
    color: Math.random() > 0.5 ? '0, 255, 136' : '77, 170, 255',
  }));

  let animId;
  const animate = () => {
    animId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, W, H);

    // Radial glow
    const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.6);
    grad.addColorStop(0, 'rgba(0, 80, 40, 0.15)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
      ctx.fill();
    });
  };
  animate();

  window.addEventListener('resize', resize);
  return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
}
