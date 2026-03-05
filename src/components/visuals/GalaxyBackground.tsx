"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ShootingStar {
  mesh: THREE.Line;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  active: boolean;
}

interface Ripple {
  mesh: THREE.Points;
  life: number;
  active: boolean;
}

export default function GalaxyBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 768px)").matches;

    // ── Renderer ──────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: false, alpha: true, powerPreference: "low-power",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.25));
    container.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60, container.clientWidth / container.clientHeight, 0.1, 1000
    );
    camera.position.set(0, 2.5, 9);
    camera.lookAt(0, 0, 0);

    // ── Palette ───────────────────────────────────────────────────
    const cCore  = new THREE.Color("#e0f2ff");
    const cMid   = new THREE.Color("#6366f1");
    const cOuter = new THREE.Color("#a855f7");

    // ════════════════════════════════════════════════════════════
    //  GALAXY ARMS
    // ════════════════════════════════════════════════════════════
    const N      = isMobile ? 2800 : 6000;
    const RADIUS = isMobile ? 5.0  : 6.5;
    const gPos   = new Float32Array(N * 3);
    const gCol   = new Float32Array(N * 3);
    const gOrig  = new Float32Array(N * 3);  // original positions for gravity snap-back

    for (let i = 0; i < N; i++) {
      const r  = Math.pow(Math.random(), 0.55) * RADIUS;
      const ba = ((i % 3) / 3) * Math.PI * 2;
      const sa = r * 1.3;
      const rx = (Math.random() - 0.5) * 0.28 * r;
      const ry = (Math.random() - 0.5) * 0.15 * r;
      const rz = (Math.random() - 0.5) * 0.28 * r;
      const i3 = i * 3;
      const x  = Math.cos(ba + sa) * r + rx;
      const y  = ry * 0.5;
      const z  = Math.sin(ba + sa) * r + rz;

      gPos[i3] = gOrig[i3] = x;
      gPos[i3+1] = gOrig[i3+1] = y;
      gPos[i3+2] = gOrig[i3+2] = z;

      const t   = r / RADIUS;
      const col = t < 0.5
        ? cCore.clone().lerp(cMid,  t * 2)
        : cMid.clone().lerp(cOuter, (t - 0.5) * 2);
      gCol[i3] = col.r; gCol[i3+1] = col.g; gCol[i3+2] = col.b;
    }

    const galaxyGeo = new THREE.BufferGeometry();
    galaxyGeo.setAttribute("position", new THREE.BufferAttribute(gPos, 3));
    galaxyGeo.setAttribute("color",    new THREE.BufferAttribute(gCol, 3));
    const galaxyMat = new THREE.PointsMaterial({
      size: isMobile ? 0.022 : 0.014, sizeAttenuation: true,
      vertexColors: true, depthWrite: false,
      transparent: true, opacity: 0.92,
      blending: THREE.AdditiveBlending,
    });
    const galaxy = new THREE.Points(galaxyGeo, galaxyMat);
    scene.add(galaxy);

    // ════════════════════════════════════════════════════════════
    //  CORE GLOW
    // ════════════════════════════════════════════════════════════
    const CN    = isMobile ? 300 : 700;
    const cpPos = new Float32Array(CN * 3);
    const cpCol = new Float32Array(CN * 3);
    const coreC = new THREE.Color("#bfdbfe");
    for (let i = 0; i < CN; i++) {
      const r  = Math.pow(Math.random(), 1.8) * 1.2;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(Math.random() * 2 - 1);
      const i3 = i * 3;
      cpPos[i3]   = r * Math.sin(ph) * Math.cos(th);
      cpPos[i3+1] = r * Math.sin(ph) * Math.sin(th) * 0.35;
      cpPos[i3+2] = r * Math.cos(ph);
      cpCol[i3] = coreC.r; cpCol[i3+1] = coreC.g; cpCol[i3+2] = coreC.b;
    }
    const coreGeo = new THREE.BufferGeometry();
    coreGeo.setAttribute("position", new THREE.BufferAttribute(cpPos, 3));
    coreGeo.setAttribute("color",    new THREE.BufferAttribute(cpCol, 3));
    const coreMat = new THREE.PointsMaterial({
      size: isMobile ? 0.04 : 0.026, sizeAttenuation: true,
      vertexColors: true, depthWrite: false,
      transparent: true, opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const coreStars = new THREE.Points(coreGeo, coreMat);
    scene.add(coreStars);

    // ════════════════════════════════════════════════════════════
    //  BACKGROUND STARFIELD
    // ════════════════════════════════════════════════════════════
    const BN   = isMobile ? 900 : 1800;
    const bPos = new Float32Array(BN * 3);
    for (let i = 0; i < BN; i++) {
      const pr = Math.random() * 38 + 10;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(Math.random() * 2 - 1);
      const i3 = i * 3;
      bPos[i3]   = pr * Math.sin(ph) * Math.cos(th);
      bPos[i3+1] = pr * Math.sin(ph) * Math.sin(th);
      bPos[i3+2] = pr * Math.cos(ph);
    }
    const bgGeo = new THREE.BufferGeometry();
    bgGeo.setAttribute("position", new THREE.BufferAttribute(bPos, 3));
    const bgMat = new THREE.PointsMaterial({
      color: new THREE.Color("#d4e8ff"), size: 0.007, sizeAttenuation: true,
      depthWrite: false, opacity: 0.55, transparent: true,
    });
    const bgStars = new THREE.Points(bgGeo, bgMat);
    scene.add(bgStars);

    // ════════════════════════════════════════════════════════════
    //  DUST CLOUD
    // ════════════════════════════════════════════════════════════
    const DN   = isMobile ? 400 : 900;
    const dPos = new Float32Array(DN * 3);
    const dCol = new Float32Array(DN * 3);
    const dA   = new THREE.Color("#818cf8");
    const dB   = new THREE.Color("#c084fc");
    for (let i = 0; i < DN; i++) {
      const r  = Math.random() * RADIUS * 1.1;
      const th = Math.random() * Math.PI * 2;
      const i3 = i * 3;
      dPos[i3]   = Math.cos(th) * r + (Math.random() - 0.5) * 2;
      dPos[i3+1] = (Math.random() - 0.5) * 1.8;
      dPos[i3+2] = Math.sin(th) * r + (Math.random() - 0.5) * 2;
      const col = dA.clone().lerp(dB, Math.random());
      dCol[i3] = col.r; dCol[i3+1] = col.g; dCol[i3+2] = col.b;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dPos, 3));
    dustGeo.setAttribute("color",    new THREE.BufferAttribute(dCol, 3));
    const dustMat = new THREE.PointsMaterial({
      size: isMobile ? 0.035 : 0.022, sizeAttenuation: true,
      vertexColors: true, depthWrite: false,
      transparent: true, opacity: 0.18,
      blending: THREE.AdditiveBlending,
    });
    const dustCloud = new THREE.Points(dustGeo, dustMat);
    scene.add(dustCloud);

    // ════════════════════════════════════════════════════════════
    //  SHOOTING STARS  ✦
    // ════════════════════════════════════════════════════════════
    const MAX_SHOOT = isMobile ? 2 : 3;
    const shoots: ShootingStar[] = [];

    const makeShoot = (): ShootingStar => {
      const pts = [new THREE.Vector3(), new THREE.Vector3()];
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: "#e0f2ff", transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const mesh = new THREE.Line(geo, mat);
      scene.add(mesh);
      return { mesh, velocity: new THREE.Vector3(), life: 1, maxLife: 1, active: false };
    };

    const spawnShoot = (s: ShootingStar) => {
      const sx   = (Math.random() - 0.5) * 14;
      const sy   = Math.random() * 3 + 2;
      const sz   = (Math.random() - 0.5) * 6;
      const spd  = 0.08 + Math.random() * 0.06;
      s.velocity.set(
        (Math.random() - 0.5) * spd * 0.6,
        -(spd * 0.7 + Math.random() * 0.04),
        (Math.random() - 0.5) * spd * 0.3,
      );
      const tl   = 0.6 + Math.random() * 0.8;
      const pa   = s.mesh.geometry.getAttribute("position") as THREE.BufferAttribute;
      pa.setXYZ(0, sx, sy, sz);
      pa.setXYZ(1, sx - s.velocity.x * tl * 8, sy - s.velocity.y * tl * 8, sz - s.velocity.z * tl * 8);
      pa.needsUpdate = true;
      s.life = 0;
      s.maxLife = 0.7 + Math.random() * 0.5;
      s.active  = true;
      const mat = s.mesh.material as THREE.LineBasicMaterial;
      mat.opacity = 0;
      mat.color.set(Math.random() > 0.5 ? "#c7d2fe" : "#e0f2ff");
    };

    for (let i = 0; i < MAX_SHOOT; i++) shoots.push(makeShoot());
    let nextShoot = 2 + Math.random() * 3;

    // ════════════════════════════════════════════════════════════
    //  COMET  ☄
    // ════════════════════════════════════════════════════════════
    const COMET_N   = 20;
    const cometPos  = new Float32Array(COMET_N * 3);
    const cometCol  = new Float32Array(COMET_N * 3);
    for (let i = 0; i < COMET_N; i++) {
      const t  = i / (COMET_N - 1);
      const i3 = i * 3;
      cometPos[i3] = -t * 2.2; cometPos[i3+1] = 0; cometPos[i3+2] = 0;
      const c = new THREE.Color().lerpColors(
        new THREE.Color("#ffffff"), new THREE.Color("#6366f1"), t,
      );
      cometCol[i3] = c.r; cometCol[i3+1] = c.g; cometCol[i3+2] = c.b;
    }
    const cometGeo = new THREE.BufferGeometry();
    cometGeo.setAttribute("position", new THREE.BufferAttribute(cometPos, 3));
    cometGeo.setAttribute("color",    new THREE.BufferAttribute(cometCol, 3));
    const cometMat = new THREE.PointsMaterial({
      size: 0.055, sizeAttenuation: true, vertexColors: true,
      depthWrite: false, transparent: true, opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const comet = new THREE.Points(cometGeo, cometMat);
    scene.add(comet);

    const CA = RADIUS * 1.25, CB = RADIUS * 0.65;
    const C_SPEED = 0.09, C_TILT = 0.38;
    let cometAngle = 0;

    const updateComet = (hx: number, hy: number, hz: number, dx: number, dz: number) => {
      const pa  = cometGeo.getAttribute("position") as THREE.BufferAttribute;
      const len = Math.sqrt(dx*dx + dz*dz) || 1;
      const nx  = dx/len, nz = dz/len;
      for (let i = 0; i < COMET_N; i++) {
        const t = i / (COMET_N - 1);
        pa.setXYZ(i, hx - nx*t*2.0, hy + Math.sin(t*Math.PI)*0.05, hz - nz*t*2.0);
      }
      pa.needsUpdate = true;
    };

    // ════════════════════════════════════════════════════════════
    //  CLICK RIPPLE  ◎
    // ════════════════════════════════════════════════════════════
    const MAX_RIP  = isMobile ? 2 : 4;
    const RIP_PTS  = 60;
    const ripples: Ripple[] = [];

    const makeRipple = (): Ripple => {
      const pts = new Float32Array(RIP_PTS * 3);
      for (let i = 0; i < RIP_PTS; i++) {
        const a  = (i / RIP_PTS) * Math.PI * 2;
        const i3 = i * 3;
        pts[i3] = Math.cos(a); pts[i3+1] = 0; pts[i3+2] = Math.sin(a);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
      const mat = new THREE.PointsMaterial({
        color: new THREE.Color("#93c5fd"), size: 0.04, sizeAttenuation: true,
        depthWrite: false, transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Points(geo, mat);
      scene.add(mesh);
      return { mesh, life: 1, active: false };
    };

    const spawnRipple = (x: number, y: number, z: number) => {
      const r = ripples.find((r) => !r.active);
      if (!r) return;
      r.mesh.position.set(x, y, z);
      r.mesh.scale.setScalar(0.05);
      r.life   = 0;
      r.active = true;
      (r.mesh.material as THREE.PointsMaterial).opacity = 0.9;
    };

    for (let i = 0; i < MAX_RIP; i++) ripples.push(makeRipple());

    // ════════════════════════════════════════════════════════════
    //  CURSOR GRAVITY  ✦
    // ════════════════════════════════════════════════════════════
    const mouse3D    = new THREE.Vector3();
    const raycaster  = new THREE.Raycaster();
    const mousePlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const mouseNDC   = new THREE.Vector2();
    const G_RADIUS   = 2.2;
    const G_STR      = 0.18;
    const gravOff    = new Float32Array(N * 3);

    // ── Input ─────────────────────────────────────────────────
    let targetMx = 0, targetMy = 0, smoothMx = 0, smoothMy = 0;
    let rawNdcX  = 0, rawNdcY  = 0;

    const onPointer = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      targetMx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      targetMy = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
      rawNdcX  =  targetMx;
      rawNdcY  = -targetMy;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const onClick = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouseNDC.set(
        ((e.clientX - rect.left) / rect.width)  * 2 - 1,
        -((e.clientY - rect.top)  / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(mouseNDC, camera);
      const hit = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(mousePlane, hit)) spawnRipple(hit.x, 0, hit.z);
    };
    window.addEventListener("pointerdown", onClick, { passive: true });

    // ── Resize ────────────────────────────────────────────────
    const onResize = () => {
      const w = container.clientWidth, h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    // ════════════════════════════════════════════════════════════
    //  ANIMATION LOOP
    // ════════════════════════════════════════════════════════════
    const clock   = new THREE.Clock();
    let lastFrame = 0, lastT = 0;
    const FPS_INT = 1 / (isMobile ? 38 : 48);
    const invMtx  = new THREE.Matrix4();
    const lMouse  = new THREE.Vector3();

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      const t  = clock.getElapsedTime();
      const dt = Math.min(t - lastT, 0.05);
      lastT = t;
      if (t - lastFrame < FPS_INT) return;
      lastFrame = t;

      // Smooth mouse
      const lf = Math.min(1, 0.06 * 60 * dt);
      smoothMx += (targetMx - smoothMx) * lf;
      smoothMy += (targetMy - smoothMy) * lf;

      // Galaxy rotation + tilt
      galaxy.rotation.y     = t * 0.045;
      galaxy.rotation.x     = Math.sin(t * 0.08) * 0.018 + smoothMy * 0.045;
      galaxy.rotation.z     = smoothMx * 0.04;
      coreStars.rotation.y  = t * 0.065;
      coreStars.rotation.x  = galaxy.rotation.x * 0.8;
      dustCloud.rotation.y  = -t * 0.018;
      bgStars.rotation.y    = t * 0.008;
      bgStars.rotation.x    = smoothMy * 0.012;
      camera.position.y     = 2.5 + Math.sin(t * 0.12) * 0.12;

      // ── Cursor Gravity ────────────────────────────────────
      mouseNDC.set(rawNdcX, rawNdcY);
      raycaster.setFromCamera(mouseNDC, camera);
      raycaster.ray.intersectPlane(mousePlane, mouse3D);
      galaxy.updateMatrixWorld();
      invMtx.copy(galaxy.matrixWorld).invert();
      lMouse.copy(mouse3D).applyMatrix4(invMtx);

      const posAttr = galaxyGeo.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < N; i++) {
        const i3  = i * 3;
        const ox  = gOrig[i3], oy = gOrig[i3+1], oz = gOrig[i3+2];
        const dx  = ox - lMouse.x, dz = oz - lMouse.z;
        const d   = Math.sqrt(dx*dx + dz*dz);
        if (d < G_RADIUS && d > 0.01) {
          const pull = (1 - d / G_RADIUS) * G_STR;
          gravOff[i3]   += (-(dx/d) * pull - gravOff[i3])   * 0.09;
          gravOff[i3+2] += (-(dz/d) * pull - gravOff[i3+2]) * 0.09;
        } else {
          gravOff[i3]   *= 0.93;
          gravOff[i3+2] *= 0.93;
        }
        posAttr.setXYZ(i, ox + gravOff[i3], oy, oz + gravOff[i3+2]);
      }
      posAttr.needsUpdate = true;

      // ── Comet ─────────────────────────────────────────────
      cometAngle += C_SPEED * dt;
      const prevA = cometAngle - C_SPEED * dt;
      const hx    = CA * Math.cos(cometAngle);
      const hy    = Math.sin(cometAngle * 0.5) * Math.sin(C_TILT) * 1.5;
      const hz    = CB * Math.sin(cometAngle);
      updateComet(hx, hy, hz, hx - CA * Math.cos(prevA), hz - CB * Math.sin(prevA));
      cometMat.opacity = 0.7 + Math.sin(t * 3.5) * 0.2;

      // ── Shooting Stars ────────────────────────────────────
      nextShoot -= dt;
      if (nextShoot <= 0) {
        const free = shoots.find((s) => !s.active);
        if (free) spawnShoot(free);
        nextShoot = (isMobile ? 3.5 : 2.2) + Math.random() * 3;
      }
      for (const s of shoots) {
        if (!s.active) continue;
        s.life += dt / s.maxLife;
        const pa = s.mesh.geometry.getAttribute("position") as THREE.BufferAttribute;
        pa.setXYZ(0, pa.getX(0)+s.velocity.x, pa.getY(0)+s.velocity.y, pa.getZ(0)+s.velocity.z);
        pa.setXYZ(1, pa.getX(1)+s.velocity.x, pa.getY(1)+s.velocity.y, pa.getZ(1)+s.velocity.z);
        pa.needsUpdate = true;
        const mat = s.mesh.material as THREE.LineBasicMaterial;
        if      (s.life < 0.15) mat.opacity = s.life / 0.15;
        else if (s.life < 0.75) mat.opacity = 1;
        else                    mat.opacity = 1 - (s.life - 0.75) / 0.25;
        if (s.life >= 1) { s.active = false; mat.opacity = 0; }
      }

      // ── Ripples ───────────────────────────────────────────
      for (const r of ripples) {
        if (!r.active) continue;
        r.life += dt / 1.4;
        r.mesh.scale.setScalar(0.1 + r.life * 5.5);
        const mat = r.mesh.material as THREE.PointsMaterial;
        mat.opacity = Math.max(0, 0.85 * (1 - r.life));
        (mat.color as THREE.Color).lerpColors(
          new THREE.Color("#93c5fd"), new THREE.Color("#a78bfa"), r.life,
        );
        if (r.life >= 1) { r.active = false; mat.opacity = 0; }
      }

      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup ───────────────────────────────────────────────
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onClick);
      ro.disconnect();
      scene.clear();
      [
        galaxyGeo, galaxyMat, coreGeo, coreMat,
        bgGeo, bgMat, dustGeo, dustMat, cometGeo, cometMat,
        ...shoots.map((s) => s.mesh.geometry),
        ...shoots.map((s) => s.mesh.material as THREE.Material),
        ...ripples.map((r) => r.mesh.geometry),
        ...ripples.map((r) => r.mesh.material as THREE.Material),
      ].forEach((o) => o.dispose());
      renderer.dispose();
      renderer.domElement.parentElement?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      style={{ cursor: "crosshair" }}
      aria-hidden="true"
    />
  );
}