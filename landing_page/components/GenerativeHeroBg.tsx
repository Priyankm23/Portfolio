"use client";

import React, { useEffect, useRef } from "react";

export const GenerativeHeroBg: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let intervalId: NodeJS.Timeout;

    // Helper functions for random range
    const randomRange = (min: number, max: number) => min + Math.random() * (max - min);

    // Spline evaluator for Catmull-Rom curve
    const drawCatmullRom = (ctx: CanvasRenderingContext2D, points: { x: number; y: number }[]) => {
      if (points.length < 4) return;
      ctx.beginPath();
      
      // Move to the first point of the spline segment
      ctx.moveTo(points[1].x, points[1].y);
      
      // Interpolate between points
      for (let i = 1; i < points.length - 2; i++) {
        const p0 = points[i - 1];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2];
        
        for (let t = 0; t <= 1; t += 0.05) {
          const t2 = t * t;
          const t3 = t2 * t;
          
          const f1 = -0.5 * t3 + t2 - 0.5 * t;
          const f2 = 1.5 * t3 - 2.5 * t2 + 1.0;
          const f3 = -1.5 * t3 + 2.0 * t2 + 0.5 * t;
          const f4 = 0.5 * t3 - 0.5 * t2;
          
          const x = p0.x * f1 + p1.x * f2 + p2.x * f3 + p3.x * f4;
          const y = p0.y * f1 + p1.y * f2 + p2.y * f3 + p3.y * f4;
          
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    };

    // Main line drawing logic matching p5.js setup
    const drawLine2 = (
      ctx: CanvasRenderingContext2D,
      x0: number,
      y0: number,
      x1: number,
      y1: number,
      a: number
    ) => {
      // Deterministic hash based on coordinates to mimic p5.js consistent randomness
      const h = Math.round(Math.sin(x0 * y1 * 21911 + y0 * 17.3 + x1 * 0.012) * 1000) / 1000;
      const s = h > 0 ? -1 : 1;
      const s2 = Math.abs(h) > 0.5 ? -1 : 1;
      
      const r = Math.abs(h) * 0.3 + 0.1;
      const rn = 1 - r;
      const r1 = (h / 2 + 0.5) * 0.3 + 0.1;
      const r1n = 1 - r1;

      // Construct the 6 control points matching p5.js curveVertex sequence
      const points = [
        { x: x0, y: y0 },
        { x: x0 - s / 2, y: y0 + s / 2 },
        { x: x0 * rn + x1 * r - a * s, y: y0 * rn + y1 * r + a * (s2 / 2) },
        { x: x0 * r1 + x1 * r1n - a * s2, y: y0 * r1 + y1 * r1n - a * (s / 2) },
        { x: x1 + (a / 3) * s, y: y1 },
        { x: x1 - (a / 2) * s, y: y1 + (a / 2) * s }
      ];

      drawCatmullRom(ctx, points);
    };

    const drawLines = (
      ctx: CanvasRenderingContext2D,
      x0: number,
      y0: number,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      x3: number,
      y3: number,
      n: number,
      width: number
    ) => {
      const dx01 = x1 - x0;
      const sx01 = dx01 / n;
      const dy01 = y1 - y0;
      const sy01 = dy01 / n;
      const dx23 = x3 - x2;
      const sx23 = dx23 / n;
      const dy23 = y3 - y2;
      const sy23 = dy23 / n;

      for (let i = 0; i < n; i++) {
        const io = i + 0.5;
        const $x0 = x0 + io * sx01;
        const $y0 = y0 + io * sy01;
        const $x1 = x2 + io * sx23;
        const $y1 = y2 + io * sy23;
        
        // Draw double lines
        drawLine2(ctx, $x0, $y0, $x1, $y1, width * 0.004);
        drawLine2(ctx, $x0, $y0, $x1, $y1, width * 0.003);
      }
    };

    let width = 0;
    let height = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      ctx.scale(dpr, dpr);
      render();
    };

    let pts: { x: number; y: number }[] = [];

    const generatePoints = () => {
      pts = [
        { x: width * randomRange(0.2, 0.45), y: height * randomRange(0.2, 0.45) },
        { x: width * randomRange(0.55, 0.85), y: height * randomRange(0.15, 0.45) },
        { x: width * randomRange(0.2, 0.45), y: height * randomRange(0.55, 0.85) },
        { x: width * randomRange(0.55, 0.85), y: height * randomRange(0.55, 0.85) }
      ];
    };

    const render = () => {
      if (width === 0 || height === 0 || pts.length === 0) return;
      
      ctx.clearRect(0, 0, width, height);

      // Save context state for clipping boundary
      ctx.save();
      
      ctx.beginPath();
      if (width >= 768) {
        ctx.rect(0, 0, width * 0.48, height);
      } else {
        ctx.rect(0, 0, width, height * 0.54);
      }
      ctx.clip();

      // Stroke color is beige matching the background color of the other half but transparent
      ctx.strokeStyle = "rgba(217, 211, 199, 0.08)";
      ctx.lineWidth = 0.6;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const mw = 0.05 * width;
      const mh = 0.05 * height;
      const d = Math.max(10, Math.floor(width / 45));

      // Segment 1
      drawLines(ctx, -mw, -mh, -mw, pts[0].y, pts[0].x - mw / 2, -mh, pts[0].x, pts[0].y, d, width);
      
      // Segment 2
      drawLines(ctx, pts[0].x - mw / 2, -mh, pts[1].x + mw / 2, -mh, pts[0].x, pts[0].y, pts[1].x, pts[1].y, d, width);
      
      // Segment 3
      drawLines(ctx, pts[1].x + mw / 2, -mh, pts[1].x, pts[1].y, width + mw, -mh, width + mw, pts[1].y - mh / 4, d, width);
      
      // Segment 4
      drawLines(ctx, -mw, pts[0].y, pts[0].x, pts[0].y, -mw, pts[2].y, pts[2].x, pts[2].y, d, width);
      
      // Segment 5
      drawLines(ctx, pts[0].x, pts[0].y, pts[2].x, pts[2].y, pts[1].x, pts[1].y, pts[3].x, pts[3].y, d, width);
      
      // Segment 6
      drawLines(ctx, pts[1].x, pts[1].y, width + mw, pts[1].y - mh / 4, pts[3].x, pts[3].y, width + mw, pts[3].y - mh / 2, d, width);
      
      // Segment 7
      drawLines(ctx, -mw, pts[2].y, -mw, height + mh, pts[2].x, pts[2].y, pts[2].x - mw / 3, height + mh / 2, d, width);
      
      // Segment 8
      drawLines(ctx, pts[2].x, pts[2].y, pts[3].x, pts[3].y, pts[2].x - mw / 3, height + mh / 2, pts[3].x + mw / 2, height + mh / 5, d, width);
      
      // Segment 9
      drawLines(ctx, pts[3].x, pts[3].y, pts[3].x + mw / 2, height + mh / 5, width + mw, pts[3].y - mh / 2, width + mw * 1.5, height + mh, d, width);

      // Restore context to remove clipping path
      ctx.restore();
    };

    const updateDesign = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const rect = parent.getBoundingClientRect();
        if (rect.width !== width || rect.height !== height) {
          resize();
          return;
        }
      }
      generatePoints();
      render();
    };

    // Initial setup
    resize();
    generatePoints();
    render();

    // Set interval for morphing matching the 250ms interval from user
    intervalId = setInterval(updateDesign, 250);
    window.addEventListener("resize", resize);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
};
