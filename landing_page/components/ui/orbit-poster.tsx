"use client";

import React, { useRef, useEffect } from "react";

// Image 2: Pink/Salmon Lily (Default Visible)
const DEFAULT_LILY =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260808_151324_bf318a5f-5525-4fc7-aab5-e9a341018828.png&w=1280&q=85";

// Image 3: Purple/Violet Lily (Revealed on Hover/Touch)
const HOVER_LILY =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260808_192942_e1086505-d7da-433b-a59b-8220f4e6c808.png&w=1280&q=85";

// Cursor brush constants tuned for balanced, highly-interactive painting
const TRAIL_MAX_POINTS = 85;
const TRAIL_HEAD_R = 52;
const TRAIL_NOISE_AMP = 15;
const TRAIL_BLOB_PTS = 20;
const TRAIL_FADE_SPEED = 0.94;
const TRAIL_SAMPLE_DIST = 5;

export function OrbitPoster() {
  const stageRef = useRef<HTMLDivElement>(null);
  const flowerRef = useRef<HTMLDivElement>(null);
  const topLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const flower = flowerRef.current;
    const topLayer = topLayerRef.current;
    if (!stage || !flower || !topLayer) return;

    const topCanvas = document.createElement("canvas");
    const topCtx = topCanvas.getContext("2d");
    if (!topCtx) return;

    let hovering = false;
    let headRadius = 0;
    let mouseX = 0;
    let mouseY = 0;
    let lastSampleX = -9999;
    let lastSampleY = -9999;
    let points: { x: number; y: number; r: number; alpha: number; seed: number }[] = [];
    let time = 0;
    let animId: number;

    function drawMorphBlob(
      ctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      r: number,
      t: number,
      seed: number,
      alpha: number
    ) {
      if (r < 1.5 || alpha <= 0) return;
      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i < TRAIL_BLOB_PTS; i++) {
        const angle = (i / TRAIL_BLOB_PTS) * Math.PI * 2;
        const n1 = Math.sin(angle * 3 + t * 1.4 + seed) * 0.45;
        const n2 = Math.sin(angle * 5 - t * 0.9 + seed * 2.3) * 0.3;
        const n3 = Math.cos(angle * 2 + t * 1.8 + seed * 0.7) * 0.25;
        const noise = (n1 + n2 + n3) * TRAIL_NOISE_AMP * (r / TRAIL_HEAD_R);
        const rad = Math.max(0, r + noise);
        pts.push({
          x: cx + Math.cos(angle) * rad,
          y: cy + Math.sin(angle) * rad,
        });
      }

      ctx.beginPath();
      const n = pts.length;
      const midX = (pts[n - 1].x + pts[0].x) / 2;
      const midY = (pts[n - 1].y + pts[0].y) / 2;
      ctx.moveTo(midX, midY);

      for (let i = 0; i < n; i++) {
        const next = pts[(i + 1) % n];
        const mx = (pts[i].x + next.x) / 2;
        const my = (pts[i].y + next.y) / 2;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
      }
      ctx.closePath();
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, Math.max(0, alpha))})`;
      ctx.fill();
    }

    const updateCoords = (clientX: number, clientY: number) => {
      const rect = flower.getBoundingClientRect();
      mouseX = clientX - rect.left;
      mouseY = clientY - rect.top;
    };

    const handleMouseMove = (e: MouseEvent) => {
      hovering = true;
      updateCoords(e.clientX, e.clientY);
    };

    const handleMouseEnter = () => {
      hovering = true;
    };

    const handleMouseLeave = () => {
      hovering = false;
    };

    // Enhanced touch handlers for seamless mobile interactivity
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        hovering = true;
        const touch = e.touches[0];
        updateCoords(touch.clientX, touch.clientY);
        headRadius = TRAIL_HEAD_R * 0.8;
        points.push({
          x: mouseX,
          y: mouseY,
          r: headRadius,
          alpha: 1,
          seed: Math.random() * 100,
        });
        lastSampleX = mouseX;
        lastSampleY = mouseY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        hovering = true;
        const touch = e.touches[0];
        updateCoords(touch.clientX, touch.clientY);
      }
    };

    const handleTouchEnd = () => {
      hovering = false;
    };

    const handleTouchCancel = () => {
      hovering = false;
    };

    stage.addEventListener("mousemove", handleMouseMove);
    stage.addEventListener("mouseenter", handleMouseEnter);
    stage.addEventListener("mouseleave", handleMouseLeave);
    stage.addEventListener("touchstart", handleTouchStart, { passive: true });
    stage.addEventListener("touchmove", handleTouchMove, { passive: true });
    stage.addEventListener("touchend", handleTouchEnd);
    stage.addEventListener("touchcancel", handleTouchCancel);

    function render() {
      const rect = flower.getBoundingClientRect();
      const W = Math.max(1, Math.round(rect.width));
      const H = Math.max(1, Math.round(rect.height));

      if (topCanvas.width !== W || topCanvas.height !== H) {
        topCanvas.width = W;
        topCanvas.height = H;
      }

      const targetR = hovering ? TRAIL_HEAD_R : 0;
      headRadius += (targetR - headRadius) * (hovering ? 0.22 : 0.08);

      if (hovering && headRadius > 3) {
        const dx = mouseX - lastSampleX;
        const dy = mouseY - lastSampleY;
        if (Math.hypot(dx, dy) >= TRAIL_SAMPLE_DIST) {
          points.push({
            x: mouseX,
            y: mouseY,
            r: headRadius,
            alpha: 1,
            seed: Math.random() * 100,
          });
          if (points.length > TRAIL_MAX_POINTS) {
            points.shift();
          }
          lastSampleX = mouseX;
          lastSampleY = mouseY;
        }
      }

      for (let i = points.length - 1; i >= 0; i--) {
        points[i].alpha *= TRAIL_FADE_SPEED;
        points[i].r *= 0.996;
        if (points[i].alpha < 0.01) {
          points.splice(i, 1);
        }
      }
      time += 0.016;

      // Draw reveal mask for purple lily
      topCtx.clearRect(0, 0, W, H);
      topCtx.globalCompositeOperation = "source-over";

      if (headRadius > 1.5) {
        drawMorphBlob(topCtx, mouseX, mouseY, headRadius, time, 42, 1);
      }
      for (let i = 0; i < points.length; i++) {
        drawMorphBlob(
          topCtx,
          points[i].x,
          points[i].y,
          points[i].r,
          time,
          points[i].seed,
          points[i].alpha
        );
      }

      const topData = topCanvas.toDataURL();
      topLayer.style.maskImage = `url(${topData})`;
      topLayer.style.webkitMaskImage = `url(${topData})`;

      animId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animId);
      stage.removeEventListener("mousemove", handleMouseMove);
      stage.removeEventListener("mouseenter", handleMouseEnter);
      stage.removeEventListener("mouseleave", handleMouseLeave);
      stage.removeEventListener("touchstart", handleTouchStart);
      stage.removeEventListener("touchmove", handleTouchMove);
      stage.removeEventListener("touchend", handleTouchEnd);
      stage.removeEventListener("touchcancel", handleTouchCancel);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className="relative w-full aspect-[2.4/1] sm:aspect-[2.6/1] bg-[#111111]/80 backdrop-blur-xs select-none border border-white/10 group cursor-crosshair isolate overflow-hidden rounded-lg shadow-lg touch-manipulation"
    >
      {/* Top Left: Brand Asterisk + "BACKEND" */}
      <div className="absolute top-3.5 left-4 z-20 flex items-center gap-2 pointer-events-none">
        <svg
          className="w-4 h-4 text-[#D9D3C7] shrink-0"
          viewBox="0 0 66 62"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="33"
            y1="1"
            x2="33"
            y2="61"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="square"
          />
          <line
            x1="3"
            y1="31"
            x2="63"
            y2="31"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="square"
          />
          <line
            x1="11.8"
            y1="9.8"
            x2="54.2"
            y2="52.2"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="square"
          />
          <line
            x1="54.2"
            y1="9.8"
            x2="11.8"
            y2="52.2"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="square"
          />
        </svg>
        <span className="font-mono text-[10px] sm:text-[11px] font-semibold tracking-widest uppercase text-zinc-400">
          BACKEND
        </span>
      </div>

      {/* Top Right: Clean Unboxed Responsive Hover / Touch Hint */}
      <div className="absolute top-3.5 right-4 z-20 flex items-center gap-1.5 font-sans text-[10px] sm:text-[11px] text-zinc-400 select-none pointer-events-none transition-opacity duration-300 group-hover:text-zinc-300">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#fd86db] animate-pulse" />
        <span className="sm:hidden">Touch to morph</span>
        <span className="hidden sm:inline">Hover to morph</span>
      </div>

      {/* Wordmark: Clean Static DEVELOPER */}
      <h2
        className="absolute left-4 top-9 sm:top-10 z-10 font-bold uppercase leading-none tracking-wider pointer-events-none select-none text-[clamp(22px,3.5vw,38px)] opacity-95"
        style={{ fontFamily: '"Bebas Neue", "Times New Roman", serif' }}
      >
        <span className="text-[#D9D3C7]">DEV</span>
        <span className="bg-gradient-to-b from-[#ffc5dc] to-[#fd86db] bg-clip-text text-transparent">
          ELOPER
        </span>
      </h2>

      {/* Centered Flower Stack - Cleanly enclosed inside card bounds */}
      <div
        ref={flowerRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] sm:w-[170px] md:w-[190px] h-[92%] z-20 pointer-events-none flex items-center justify-center"
      >
        {/* Layer 1: Default Pink Lily (Always visible) */}
        <img
          src={DEFAULT_LILY}
          alt="Pixel-art pink lily"
          className="w-full h-full object-contain filter contrast-[1.05]"
        />

        {/* Layer 2: Hover/Touch Purple Lily (Revealed dynamically along cursor/finger trail) */}
        <div
          ref={topLayerRef}
          className="absolute inset-0 mask-cover bg-no-repeat bg-center"
          style={{
            maskSize: "100% 100%",
            WebkitMaskSize: "100% 100%",
            maskImage: "linear-gradient(#0000, #0000)",
            WebkitMaskImage: "linear-gradient(#0000, #0000)",
          }}
        >
          <img
            src={HOVER_LILY}
            alt="Pixel-art purple lily"
            className="w-full h-full object-contain filter contrast-[1.08]"
          />
        </div>
      </div>

      {/* Personal About-Me Philosophy Corner Copy */}
      <div className="absolute bottom-3 left-4 z-30 text-[10px] sm:text-[11px] font-sans text-zinc-400 leading-tight pointer-events-none">
        <div style={{ transform: "scaleX(1.02)", transformOrigin: "left bottom" }}>
          Curious by design,<br />building with intent.
        </div>
      </div>

      <div className="absolute bottom-3 right-4 z-30 text-[10px] sm:text-[11px] font-sans text-zinc-400 leading-tight text-right pointer-events-none">
        <div style={{ transform: "scaleX(1.02)", transformOrigin: "right bottom" }}>
          Driven by fundamentals.<br />Honest about failures.
        </div>
      </div>
    </div>
  );
}
