"use client";

import { useEffect, useRef, useState } from "react";
import { triggerGlitch, shouldReduceMotion } from "@/utils/animations";
import { HeroPanel } from "./HeroPanel";

// Social links
const socials = [
  {
    label: "GitHub",
    href: "https://github.com/Priyankm23",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        width="22"
        height="22"
        aria-hidden="true"
      >
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/priyankmoradiya",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        width="22"
        height="22"
        aria-hidden="true"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:priyankmoradiya41@gmail.com",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        width="22"
        height="22"
        aria-hidden="true"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 7l10 7 10-7" />
      </svg>
    ),
  },
  {
    label: "X (Twitter)",
    href: "#", // placeholder — to be added later
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        width="22"
        height="22"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export const Hero = () => {
  const priyankRef = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Glitch loop: first at 1.1s, then every 6s
  useEffect(() => {
    if (!animated || shouldReduceMotion()) return;
    const first = setTimeout(() => {
      if (priyankRef.current) triggerGlitch(priyankRef.current);
    }, 1100);
    const loop = setInterval(() => {
      if (priyankRef.current) triggerGlitch(priyankRef.current);
    }, 6000);
    return () => {
      clearTimeout(first);
      clearInterval(loop);
    };
  }, [animated]);

  const handleGlitchHover = () => {
    if (priyankRef.current && !shouldReduceMotion())
      triggerGlitch(priyankRef.current);
  };

  const priyankLetters = "PRIYANK".split("");
  const moradiyaLetters = "MORADIYA".split("");

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden bg-bg"
      style={{ minHeight: "100svh" }}
    >
      {/* ── Layer 1: NODE.JS Bleed ── */}
      <div
        className="absolute top-[-2%] left-[-2%] pointer-events-none select-none font-bold leading-none"
        style={{
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: "28vw",
          color: "#1a1612",
          opacity: 0.06,
          zIndex: 0,
        }}
      >
        NODE.JS
      </div>

      {/* ── Layer 2: BACKEND Bleed ── */}
      <div
        className="absolute bottom-[-5%] right-[-3%] pointer-events-none select-none font-bold leading-none"
        style={{
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: "22vw",
          color: "#1a1612",
          opacity: 0.06,
          zIndex: 0,
        }}
      >
        BACKEND
      </div>

      {/* ── Layer 3: Scattered Symbols ── */}
      <div
        className="absolute top-[12%] right-[8%] pointer-events-none select-none font-mono whitespace-nowrap"
        style={{
          fontSize: "clamp(1.2rem, 5vw, 3.5vw)",
          color: "var(--accent)",
          opacity: 0.1,
        }}
      >
        {"( ) => { }"}
      </div>

      <div
        className="absolute top-[48%] left-[3%] pointer-events-none select-none font-mono whitespace-nowrap"
        style={{
          fontSize: "clamp(1.2rem, 5vw, 3.5vw)",
          color: "var(--accent)",
          opacity: 0.1,
        }}
      >
        {"[ ...args ]"}
      </div>

      <div
        className="absolute bottom-[0%] md:bottom-[4%] left-[2%] md:left-[4%] pointer-events-none select-none font-mono whitespace-nowrap"
        style={{
          fontSize: "clamp(1.2rem, 5vw, 3.5vw)",
          color: "var(--accent)",
          opacity: 0.1,
        }}
      >
        {"await fetch"}
      </div>

      <div
        className="absolute top-[42%] right-[4%] pointer-events-none select-none font-mono whitespace-nowrap"
        style={{
          fontSize: "clamp(1.2rem, 5vw, 3.5vw)",
          color: "var(--accent)",
          opacity: 0.1,
        }}
      >
        typeof NaN
      </div>

      {/* ── Main content grid ── */}
      <div
        className="relative z-10 flex flex-col md:flex-row max-w-6xl mx-auto w-full"
        style={{ minHeight: "100svh" }}
      >
        {/* LEFT — content */}
        <div
          className="flex-1 flex flex-col px-5 sm:px-8 md:px-10"
          style={{
            paddingTop: "clamp(88px, 14vw, 120px)" /* below nav on mobile */,
            paddingBottom: "clamp(48px, 8vw, 96px)",
            justifyContent: "center" /* vertically center on mobile */,
          }}
        >
          <div style={{ maxWidth: "700px" }}>
            {/* Role label — acid green */}
            <div
              style={{
                fontFamily: '"Bebas Neue", sans-serif',
                fontSize: "clamp(1.5rem, 4vw, 2.4rem)",
                letterSpacing: "0.15em",
                color: "var(--accent)",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              BACKEND ENGINEER
            </div>

            {/* PRIYANK */}
            <div
              ref={priyankRef}
              onMouseEnter={handleGlitchHover}
              aria-label="Priyank"
              style={{
                fontSize: "clamp(3rem, 11vw, 7rem)",
                lineHeight: 0.95,
                cursor: "pointer",
                marginBottom: "4px",
                whiteSpace: "nowrap",
              }}
            >
              {priyankLetters.map((letter, idx) => (
                <span
                  key={idx}
                  className="inline-block font-bold"
                  style={{
                    fontFamily: '"Space Mono", monospace',
                    color: "var(--ink)",
                    opacity: animated ? 1 : 0,
                    transform: animated ? "translateY(0)" : "translateY(60px)",
                    transition: shouldReduceMotion()
                      ? "none"
                      : `opacity 0.55s ease ${idx * 55}ms, transform 0.55s ease ${idx * 55}ms`,
                  }}
                >
                  {letter}
                </span>
              ))}
            </div>

            {/* MORADIYA */}
            <div
              style={{
                fontSize: "clamp(3rem, 11vw, 7rem)",
                lineHeight: 0.95,
                position: "relative",
                marginBottom: "20px",
                whiteSpace: "nowrap",
              }}
            >
              {/* Ghost echo */}
              <div
                className="absolute top-0 pointer-events-none select-none font-bold"
                style={{
                  left: "2px",
                  fontFamily: '"Space Mono", monospace',
                  fontSize: "inherit",
                  lineHeight: "inherit",
                  color: "var(--border)",
                }}
              >
                MORADIYA
              </div>
              {moradiyaLetters.map((letter, idx) => (
                <span
                  key={idx}
                  className="inline-block font-bold"
                  style={{
                    fontFamily: '"Space Mono", monospace',
                    color: "var(--ink)",
                    opacity: animated ? 1 : 0,
                    transform: animated ? "translateY(0)" : "translateY(60px)",
                    transition: shouldReduceMotion()
                      ? "none"
                      : `opacity 0.55s ease ${priyankLetters.length * 55 + 80 + idx * 55}ms, transform 0.55s ease ${priyankLetters.length * 55 + 80 + idx * 55}ms`,
                  }}
                >
                  {letter}
                </span>
              ))}
            </div>

            {/* Distressed HR */}
            <div style={{ width: "40%", marginBottom: "18px" }}>
              <hr />
            </div>

            {/* Description */}
            <p
              style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: "clamp(0.78rem, 1.5vw, 0.875rem)",
                color: "var(--muted)",
                lineHeight: 1.75,
                maxWidth: "650px",
                marginBottom: "20px",
              }}
            >
              A backend developer building APIs for modular systems like apps
              and dashboards. From system optimization to load handling,
              everything learned rightly to make systems scalable.
            </p>

            {/* Social icons */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={
                    s.href.startsWith("mailto") || s.href === "#"
                      ? undefined
                      : "_blank"
                  }
                  rel={
                    s.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  aria-label={s.label}
                  title={s.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "44px",
                    height: "44px",
                    border: "1px solid var(--border)",
                    color: "var(--muted)",
                    transition: "color 0s, border-color 0s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--accent)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      "var(--accent)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--muted)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      "var(--border)";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — live API panel (desktop only) */}
        <HeroPanel animated={animated} />
      </div>
    </section>
  );
};
