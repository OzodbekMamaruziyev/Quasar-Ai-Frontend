"use client";

import { useEffect, useRef } from "react";

export default function AuthBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── Resize ────────────────────────────────────────────────
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // ── Orb definitions ───────────────────────────────────────
    // Each orb: position (%), radius, color, speed, phase offset
    const orbs = [
      { x: 0.25, y: 0.30, r: 0.55, color: "#3b82f6", sx: 0.00012, sy: 0.00009, phase: 0.0 },
      { x: 0.72, y: 0.20, r: 0.50, color: "#6366f1", sx: 0.00009, sy: 0.00014, phase: 1.2 },
      { x: 0.80, y: 0.75, r: 0.60, color: "#4338ca", sx: 0.00011, sy: 0.00008, phase: 2.4 },
      { x: 0.20, y: 0.80, r: 0.45, color: "#818cf8", sx: 0.00008, sy: 0.00012, phase: 3.6 },
      { x: 0.50, y: 0.50, r: 0.40, color: "#2563eb", sx: 0.00010, sy: 0.00010, phase: 0.8 },
    ];

    // ── Animation ─────────────────────────────────────────────
    const startTime = performance.now();
    // Throttle: ~30fps is enough for a slow mesh bg
    let lastFrame = 0;
    const INTERVAL = 1000 / 30;

    const draw = (now: number) => {
      rafRef.current = requestAnimationFrame(draw);
      if (now - lastFrame < INTERVAL) return;
      lastFrame = now;

      const elapsed = now - startTime;
      const W = canvas.width, H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      // Dark base
      ctx.fillStyle = "#020408";
      ctx.fillRect(0, 0, W, H);

      // Draw each orb as a radial gradient blob
      for (const orb of orbs) {
        // Slow sinusoidal drift
        const dx = Math.sin(elapsed * orb.sx + orb.phase) * 0.18;
        const dy = Math.cos(elapsed * orb.sy + orb.phase) * 0.14;

        const cx = (orb.x + dx) * W;
        const cy = (orb.y + dy) * H;
        const radius = orb.r * Math.max(W, H);

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);

        // Parse hex → rgba with opacity ~22-28%
        const hex = orb.color;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        grad.addColorStop(0,   `rgba(${r},${g},${b},0.26)`);
        grad.addColorStop(0.4, `rgba(${r},${g},${b},0.12)`);
        grad.addColorStop(1,   `rgba(${r},${g},${b},0.00)`);

        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      }

      // Reset composite
      ctx.globalCompositeOperation = "source-over";

      // Subtle noise grain overlay (static, just drawn once per frame lightly)
      // We use a very faint dark vignette to keep edges dark
      const vignette = ctx.createRadialGradient(
        W * 0.5, H * 0.5, H * 0.1,
        W * 0.5, H * 0.5, H * 0.9,
      );
      vignette.addColorStop(0,   "rgba(2,4,8,0.00)");
      vignette.addColorStop(0.6, "rgba(2,4,8,0.25)");
      vignette.addColorStop(1,   "rgba(2,4,8,0.75)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, W, H);

      // Top + bottom edge darkening
      const topGrad = ctx.createLinearGradient(0, 0, 0, H * 0.35);
      topGrad.addColorStop(0, "rgba(2,4,8,0.60)");
      topGrad.addColorStop(1, "rgba(2,4,8,0.00)");
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, W, H * 0.35);

      const botGrad = ctx.createLinearGradient(0, H * 0.65, 0, H);
      botGrad.addColorStop(0, "rgba(2,4,8,0.00)");
      botGrad.addColorStop(1, "rgba(2,4,8,0.65)");
      ctx.fillStyle = botGrad;
      ctx.fillRect(0, H * 0.65, W, H * 0.35);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none", zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
