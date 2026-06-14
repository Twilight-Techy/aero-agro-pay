// Drone Panel — Three.js animated drone with GSAP-driven motor spin-up
import * as THREE from 'three';

export function initDroneScene(canvas) {
  const W = canvas.offsetWidth || 280;
  const H = canvas.offsetHeight || 320;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x060914, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
  camera.position.set(0, 3, 7);
  camera.lookAt(0, 0, 0);

  // ── Drone Body ──
  const group = new THREE.Group();

  const bodyGeom = new THREE.BoxGeometry(1.0, 0.25, 1.0);
  const bodyMat = new THREE.MeshPhongMaterial({ color: 0x1a2a3a, shininess: 120 });
  group.add(new THREE.Mesh(bodyGeom, bodyMat));

  // Arms
  [[2.6, 0, 0], [0, 0, 2.6]].forEach((scale, i) => {
    const arm = new THREE.Mesh(
      new THREE.BoxGeometry(scale[0] || 0.1, 0.08, scale[2] || 0.1),
      new THREE.MeshPhongMaterial({ color: 0x0d1c2a })
    );
    group.add(arm);
  });

  // Motor hubs + propeller groups
  const motorPos = [[1.3, 0, 0], [-1.3, 0, 0], [0, 0, 1.3], [0, 0, -1.3]];
  const rotors = [];
  const motorLights = [];

  motorPos.forEach((pos, idx) => {
    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.12, 12),
      new THREE.MeshPhongMaterial({ color: 0x00aa44 })
    );
    hub.position.set(...pos);
    group.add(hub);

    const rotorGroup = new THREE.Group();
    [-1, 1].forEach((dir) => {
      const blade = new THREE.Mesh(
        new THREE.PlaneGeometry(0.85, 0.12),
        new THREE.MeshBasicMaterial({ color: 0x223344, side: THREE.DoubleSide, transparent: true, opacity: 0.8 })
      );
      blade.position.x = dir * 0.4;
      rotorGroup.add(blade);
    });
    rotorGroup.position.set(...pos);
    rotorGroup.position.y += 0.12;
    group.add(rotorGroup);
    rotors.push(rotorGroup);

    // LED per motor
    const led = new THREE.PointLight(idx < 2 ? 0x00ff88 : 0xff4444, 0.3, 3);
    led.position.set(...pos);
    group.add(led);
    motorLights.push(led);
  });

  // Camera top mount
  const camMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 8, 8),
    new THREE.MeshPhongMaterial({ color: 0x334455 })
  );
  camMesh.position.set(0, -0.2, 0);
  group.add(camMesh);

  scene.add(group);

  // ── Ground glow ──
  const glowMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 6),
    new THREE.MeshBasicMaterial({ color: 0x002211, transparent: true, opacity: 0.5 })
  );
  glowMesh.rotation.x = -Math.PI / 2;
  glowMesh.position.y = -2.5;
  scene.add(glowMesh);

  // ── Lights ──
  scene.add(new THREE.AmbientLight(0x223344, 2));
  const topLight = new THREE.DirectionalLight(0x88aaff, 1.5);
  topLight.position.set(3, 8, 5);
  scene.add(topLight);
  const greenFill = new THREE.PointLight(0x00ff88, 0.5, 15);
  greenFill.position.set(-3, 4, -3);
  scene.add(greenFill);

  // ── State ──
  let motorSpeed = 0; // 0 to 1
  let isSpinning = false;
  let animId;
  let t = 0;

  const animate = () => {
    animId = requestAnimationFrame(animate);
    t += 0.016;

    // Gentle hover
    group.position.y = Math.sin(t * 1.2) * 0.1;
    group.rotation.y += 0.005;

    // Rotor spin based on motorSpeed
    const spinRate = motorSpeed * 0.6;
    rotors.forEach((r, i) => {
      r.rotation.y += spinRate * (i % 2 === 0 ? 1 : -1);
    });

    // Motor LED intensity
    motorLights.forEach((light) => {
      light.intensity = motorSpeed * 1.5 + Math.sin(t * 10) * motorSpeed * 0.2;
    });

    renderer.render(scene, camera);
  };
  animate();

  const handleResize = () => {
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', handleResize);

  return {
    setMotorSpeed: (speed) => { motorSpeed = speed; isSpinning = speed > 0.1; },
    dispose: () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    },
  };
}
