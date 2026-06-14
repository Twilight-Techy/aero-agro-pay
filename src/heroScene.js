// Hero Three.js Scene — Drone flying over glowing field
import * as THREE from 'three';

export function initHeroScene(canvas) {
  const W = canvas.offsetWidth;
  const H = canvas.offsetHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x060914, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 200);
  // Offset camera left so drone action sits in the right visual half
  camera.position.set(-4, 7, 18);
  camera.lookAt(3, 0, 0);

  // ── Starfield ──
  const starGeom = new THREE.BufferGeometry();
  const starCount = 800;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i++) {
    starPos[i * 3] = (Math.random() - 0.5) * 200;
    starPos[i * 3 + 1] = Math.random() * 80 - 10;
    starPos[i * 3 + 2] = (Math.random() - 0.5) * 200 - 20;
  }
  starGeom.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0xaabbdd,
    size: 0.15,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.7,
  });
  scene.add(new THREE.Points(starGeom, starMat));

  // ── Field grid (glowing ground) ──
  const gridHelper = new THREE.GridHelper(60, 30, 0x00ff88, 0x0a2a1a);
  gridHelper.position.y = -4;
  gridHelper.material.opacity = 0.3;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);

  // ── Crop rows (glowing lines) ──
  const cropGroup = new THREE.Group();
  for (let i = -10; i <= 10; i += 2) {
    const lineGeom = new THREE.PlaneGeometry(20, 0.15);
    const lineMat = new THREE.MeshBasicMaterial({
      color: 0x004422,
      transparent: true,
      opacity: 0.6,
    });
    const line = new THREE.Mesh(lineGeom, lineMat);
    line.rotation.x = -Math.PI / 2;
    line.position.set(i, -3.95, 0);
    cropGroup.add(line);
  }
  scene.add(cropGroup);

  // ── Ambient glow plane ──
  const glowGeom = new THREE.PlaneGeometry(40, 40);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x003311,
    transparent: true,
    opacity: 0.15,
  });
  const glowPlane = new THREE.Mesh(glowGeom, glowMat);
  glowPlane.rotation.x = -Math.PI / 2;
  glowPlane.position.y = -4;
  scene.add(glowPlane);

  // ── Drone body ──
  const droneGroup = new THREE.Group();

  // Central body
  const bodyGeom = new THREE.BoxGeometry(0.8, 0.2, 0.8);
  const bodyMat = new THREE.MeshPhongMaterial({ color: 0x1a2a3a, shininess: 100 });
  const body = new THREE.Mesh(bodyGeom, bodyMat);
  droneGroup.add(body);

  // Arms
  const armGeom = new THREE.BoxGeometry(2.2, 0.08, 0.08);
  const armMat = new THREE.MeshPhongMaterial({ color: 0x111a22 });

  const arm1 = new THREE.Mesh(armGeom, armMat);
  droneGroup.add(arm1);
  const arm2 = new THREE.Mesh(armGeom, armMat);
  arm2.rotation.y = Math.PI / 2;
  droneGroup.add(arm2);

  // Motor pods
  const motorPositions = [
    [1.1, 0, 0],
    [-1.1, 0, 0],
    [0, 0, 1.1],
    [0, 0, -1.1],
  ];

  const rotorGroups = [];
  motorPositions.forEach((pos) => {
    const motorGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 8);
    const motorMat = new THREE.MeshPhongMaterial({ color: 0x00cc66 });
    const motor = new THREE.Mesh(motorGeom, motorMat);
    motor.position.set(...pos);
    droneGroup.add(motor);

    // Propellers
    const rotorGroup = new THREE.Group();
    for (let b = 0; b < 2; b++) {
      const bladeGeom = new THREE.PlaneGeometry(0.7, 0.1);
      const bladeMat = new THREE.MeshBasicMaterial({
        color: 0x334455,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const blade = new THREE.Mesh(bladeGeom, bladeMat);
      blade.rotation.y = (b * Math.PI) / 2;
      rotorGroup.add(blade);
    }
    rotorGroup.position.set(...pos);
    rotorGroup.position.y += 0.1;
    droneGroup.add(rotorGroup);
    rotorGroups.push(rotorGroup);
  });

  // Drone LED light (green)
  const droneLED = new THREE.PointLight(0x00ff88, 1.5, 8);
  droneLED.position.set(0, -0.3, 0);
  droneGroup.add(droneLED);

  droneGroup.position.set(0, 3, -2);
  scene.add(droneGroup);

  // ── Spray particle system ──
  const sprayCount = 300;
  const sprayGeom = new THREE.BufferGeometry();
  const sprayPos = new Float32Array(sprayCount * 3);
  const sprayVel = [];

  for (let i = 0; i < sprayCount; i++) {
    sprayPos[i * 3] = 0;
    sprayPos[i * 3 + 1] = 0;
    sprayPos[i * 3 + 2] = 0;
    sprayVel.push({
      x: (Math.random() - 0.5) * 0.04,
      y: -0.04 - Math.random() * 0.03,
      z: (Math.random() - 0.5) * 0.04,
      life: Math.random(),
      maxLife: 0.5 + Math.random() * 1.5,
    });
  }

  sprayGeom.setAttribute('position', new THREE.BufferAttribute(sprayPos, 3));
  const sprayMat = new THREE.PointsMaterial({
    color: 0x88ddff,
    size: 0.06,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true,
  });
  const sprayParticles = new THREE.Points(sprayGeom, sprayMat);
  scene.add(sprayParticles);

  // ── Lights ──
  scene.add(new THREE.AmbientLight(0x223344, 1.5));
  const dirLight = new THREE.DirectionalLight(0x6699ff, 1);
  dirLight.position.set(5, 10, 5);
  scene.add(dirLight);
  const greenLight = new THREE.PointLight(0x00ff88, 1, 30);
  greenLight.position.set(-5, 5, -5);
  scene.add(greenLight);

  // ── Flight path ──
  let droneTime = 0;
  const flightRadius = 5;

  // ── Resize ──
  const handleResize = () => {
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', handleResize);

  // ── Animation loop ──
  let animId;
  const animate = () => {
    animId = requestAnimationFrame(animate);
    droneTime += 0.004;

    // Drone orbital flight
    droneGroup.position.x = Math.sin(droneTime) * flightRadius;
    droneGroup.position.z = Math.cos(droneTime) * flightRadius * 0.6 - 3;
    droneGroup.position.y = 2.5 + Math.sin(droneTime * 2.3) * 0.4;
    droneGroup.rotation.y = -droneTime + Math.PI;

    // Body tilt
    droneGroup.rotation.x = Math.sin(droneTime * 2) * 0.08;
    droneGroup.rotation.z = Math.cos(droneTime) * 0.05;

    // Rotor spin
    rotorGroups.forEach((r, i) => {
      r.rotation.y += 0.3 * (i % 2 === 0 ? 1 : -1);
    });

    // LED pulse
    droneLED.intensity = 1.2 + Math.sin(droneTime * 8) * 0.4;

    // Spray particles
    const sprayPositions = sprayGeom.attributes.position.array;
    for (let i = 0; i < sprayCount; i++) {
      const v = sprayVel[i];
      v.life += 0.016;
      if (v.life > v.maxLife) {
        // Reset to drone position
        sprayPositions[i * 3] = droneGroup.position.x + (Math.random() - 0.5) * 0.3;
        sprayPositions[i * 3 + 1] = droneGroup.position.y - 0.3;
        sprayPositions[i * 3 + 2] = droneGroup.position.z + (Math.random() - 0.5) * 0.3;
        v.life = 0;
        v.x = (Math.random() - 0.5) * 0.04;
        v.z = (Math.random() - 0.5) * 0.04;
      } else {
        sprayPositions[i * 3] += v.x;
        sprayPositions[i * 3 + 1] += v.y;
        sprayPositions[i * 3 + 2] += v.z;
      }
    }
    sprayGeom.attributes.position.needsUpdate = true;

    // Camera gentle sway — stays focused on right side where drone flies
    camera.position.x = -4 + Math.sin(droneTime * 0.15) * 1.2;
    camera.lookAt(3, 0, -2);

    renderer.render(scene, camera);
  };
  animate();

  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener('resize', handleResize);
    renderer.dispose();
  };
}
