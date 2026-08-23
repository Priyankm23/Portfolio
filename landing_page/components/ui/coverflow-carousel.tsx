"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { AnimatedLink } from "./animated-link";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

// Keep measurement-like results visually distinct without requiring every
// project description to be authored as JSX.
const metricPattern =
  /\b\d+(?:\.\d+)?\s+(?:to|→)\s+\d+(?:\.\d+)?\+?\s*RPS\b|\b(?:sub-)?\d+(?:\.\d+)?(?:ms|s)(?:\s+(?:to|→)\s+\d+(?:\.\d+)?(?:ms|s))?\b|\b\d+(?:\.\d+)?%\b|\bzero stock drift\b|\bevery \d+ minutes\b|\bAES-\d+\b|\bPolygon L\d+\b/gi;

function DescriptionWithMetrics({ description }: { description: string }) {
  const parts = description.split(metricPattern);
  const metrics = description.match(metricPattern) ?? [];

  return (
    <>
      {parts.map((part, index) => (
        <React.Fragment key={`${part}-${index}`}>
          {part}
          {metrics[index] && (
            <span className="metric-highlight">{metrics[index]}</span>
          )}
        </React.Fragment>
      ))}
    </>
  );
}

export interface CoverflowSlide {
  src: string;
  alt: string;
  title?: string;
  subtitle?: React.ReactNode;
  meta?: { label: string; value: string }[];
  tags?: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export interface CoverflowCarouselProps {
  slides: CoverflowSlide[];
  /** Degrees the first neighbour tilts. */
  rotate?: number;
  /** How far the first neighbour recedes, as a fraction of card width. */
  depth?: number;
  /** Viewer distance as a multiple of card width — smaller is a wider lens. */
  perspective?: number;
  /** Exponent on distance. Below 1 the rake eases off as cards travel out. */
  falloff?: number;
  /** Opacity lost per step from the centre. */
  fade?: number;
  /** Any CSS length. Everything else is derived from it, so the rake scales. */
  cardWidth?: string;
  /** Space between cards, as a fraction of card width. */
  gap?: number;
  loop?: boolean;
  showCaption?: boolean;
  showPagination?: boolean;
  showNavigation?: boolean;
  /** Names the carousel for assistive tech. */
  label?: string;
  className?: string;
  cardClassName?: string;
}

export function CoverflowCarousel({
  slides,
  rotate = 44,
  depth = 0.6,
  perspective = 3,
  falloff = 0.56,
  fade = 0.1,
  cardWidth = "clamp(260px, 42vw, 520px)",
  gap = 0.05,
  loop = true,
  showCaption = false,
  showPagination = false,
  showNavigation = false,
  label = "Cover carousel",
  className,
  cardClassName,
}: CoverflowCarouselProps) {
  const count = slides.length;

  const frameRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  /** Fractional card index at the centre. The single source of truth. */
  const posRef = React.useRef(0);
  /** Track whether the carousel has spun once since page load. */
  const hasSpunRef = React.useRef(false);
  /** Where the current settle is headed. Stepping off `pos` instead would
      swallow a keypress that lands mid-flight, before the round-off moves. */
  const targetRef = React.useRef(0);
  const widthRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const dragRef = React.useRef<{
    id: number;
    x: number;
    pos: number;
    v: number;
    t: number;
  } | null>(null);

  const [selected, setSelected] = React.useState(0);
  const [isSpinning, setIsSpinning] = React.useState(true);

  /** Nearest whole card, folded back into 0..count-1. */
  const indexAt = React.useCallback(
    (pos: number) => ((Math.round(pos) % count) + count) % count,
    [count],
  );

  // Paint straight to the DOM. Sixty state updates a second would re-render
  // every card for numbers React never needs to see.
  const paint = React.useCallback(() => {
    const width = widthRef.current;
    if (!width) return;
    const pitch = width * (1 + gap);
    const pos = posRef.current;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      // Fold the distance into the shorter way round the ring. This is the
      // whole looping mechanism — no cloned nodes, no shuffling the DOM.
      let offset = index - pos;
      if (loop) {
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;
      }

      const distance = Math.abs(offset);
      // Both the tilt and the recession ease off as cards travel out —
      // doubling the distance adds only about half again as much of each.
      // A linear ramp folds the second card shut; this keeps it readable.
      const ramp = Math.pow(distance, falloff);
      // Capped short of edge-on so a far card never turns its back.
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);

      card.style.transform =
        `translateX(calc(-50% + ${offset * pitch}px)) ` +
        `translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;

      // A card is teleported across the ring at exactly half a turn out, so it
      // has to be gone by then or the jump is visible.
      const edge = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
      card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
      card.style.zIndex = String(100 - Math.round(distance));

      // Blur non-centered cards
      const blurAmount = Math.min(6, distance * 3.5);
      card.style.filter = blurAmount > 0.1 ? `blur(${blurAmount}px)` : 'none';
    });
  }, [count, depth, fade, falloff, gap, loop, rotate]);

  const settle = React.useCallback(
    (target: number) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      setIsSpinning(false);
      targetRef.current = target;
      setSelected(indexAt(target));

      const step = () => {
        const remaining = target - posRef.current;
        if (Math.abs(remaining) < 0.0004) {
          posRef.current = target;
          paint();
          rafRef.current = null;
          return;
        }
        // ponytail: exponential ease-out, not a spring. Swap in a spring only
        // if the settle needs overshoot.
        posRef.current += remaining * 0.16;
        paint();
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [indexAt, paint],
  );

  const triggerSpin = React.useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    setIsSpinning(true);

    // Pick a random target index (0, 1, or 2)
    const randomIndex = Math.floor(Math.random() * count);

    // Start offset relative to the random index (reduced to 12 for a gentler speed)
    posRef.current = randomIndex - 12;
    paint();

    const startTime = performance.now();
    const spinDuration = 600; // spin for 600ms
    const spinSpeed = 0.25;    // reduced speed per frame for a gentler spin

    const spinStep = (now: number) => {
      const elapsed = now - startTime;
      if (elapsed >= spinDuration) {
        // Transition to settle phase targeting the random index
        targetRef.current = randomIndex;
        setSelected(randomIndex);

        const settleStep = () => {
          const remaining = randomIndex - posRef.current;
          if (Math.abs(remaining) < 0.0004) {
            posRef.current = randomIndex;
            paint();
            setIsSpinning(false);
            rafRef.current = null;
            return;
          }
          posRef.current += remaining * 0.12; // Decelerate smoothly
          paint();
          rafRef.current = requestAnimationFrame(settleStep);
        };
        rafRef.current = requestAnimationFrame(settleStep);
        return;
      }

      posRef.current += spinSpeed;
      paint();
      rafRef.current = requestAnimationFrame(spinStep);
    };

    rafRef.current = requestAnimationFrame(spinStep);
  }, [count, paint]);

  const clamp = React.useCallback(
    (pos: number) => (loop ? pos : Math.max(0, Math.min(count - 1, pos))),
    [count, loop],
  );

  const goTo = React.useCallback(
    (index: number) => {
      // Take the shorter way round rather than unwinding the whole ring.
      const target = loop
        ? index + Math.round((targetRef.current - index) / count) * count
        : index;
      settle(clamp(target));
    },
    [clamp, count, loop, settle],
  );

  const nudge = React.useCallback(
    (by: number) => settle(clamp(Math.round(targetRef.current) + by)),
    [clamp, settle],
  );

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setIsSpinning(false);
    event.currentTarget.setPointerCapture(event.pointerId);
    targetRef.current = posRef.current;
    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      pos: posRef.current,
      v: 0,
      t: performance.now(),
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;

    const pitch = widthRef.current * (1 + gap);
    if (!pitch) return;

    const now = performance.now();
    const previous = posRef.current;
    posRef.current = clamp(drag.pos - (event.clientX - drag.x) / pitch);
    // Cards per second, for the throw.
    drag.v = ((posRef.current - previous) / Math.max(now - drag.t, 1)) * 1000;
    drag.t = now;

    const index = indexAt(posRef.current);
    if (index !== selected) setSelected(index);
    paint();
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    // Let a flick carry, but never more than two cards.
    const carried = Math.max(-2, Math.min(2, drag.v * 0.18));
    settle(clamp(Math.round(posRef.current + carried)));
  };

  // Card width drives pitch, depth and perspective, so it is the only thing
  // worth measuring — and only when the box actually changes.
  useIsoLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => {
      const card = cardRefs.current[0];
      if (!card) return;
      widthRef.current = card.offsetWidth;
      paint();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [paint]);

  React.useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasSpunRef.current) {
            hasSpunRef.current = true;
            triggerSpin();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(frame);
    return () => observer.disconnect();
  }, [triggerSpin]);

  React.useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const active = slides[selected];

  return (
    <div
      className={cn("w-full", className)}
      style={{ ["--cf-card" as string]: cardWidth }}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="relative">
        <div
          ref={frameRef}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              nudge(-1);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              nudge(1);
            }
          }}
          // Vertical padding keeps the drop shadows clear of the overflow clip.
          className="cursor-grab overflow-hidden py-6 outline-none ring-accent/30 focus-visible:ring-2 active:cursor-grabbing"
          style={{
            perspective: `calc(var(--cf-card) * ${perspective})`,
            // Horizontal drag is ours; the page keeps vertical scrolling.
            touchAction: "pan-y",
          }}
        >
          <div
            className="relative select-none"
            style={{
              height: "calc(var(--cf-card) * 9 / 16)",
              transformStyle: "preserve-3d",
            }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${count}`}
                className={cn(
                  "absolute left-1/2 top-0 aspect-video overflow-hidden rounded-2xl bg-[#111111] border border-[#2a2a2a] shadow-2xl will-change-transform",
                  cardClassName,
                )}
                style={{ width: "var(--cf-card)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.src}
                  alt={slide.alt}
                  draggable={false}
                  className="h-full w-full select-none object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {showNavigation && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => nudge(-1)}
              className="absolute left-3 top-1/2 z-[200] -translate-y-1/2 rounded-full bg-[#111111]/70 p-2 text-zinc-100 backdrop-blur border border-[#2a2a2a] transition hover:bg-[#111111] hover:text-[#b02600]"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => nudge(1)}
              className="absolute right-3 top-1/2 z-[200] -translate-y-1/2 rounded-full bg-[#111111]/70 p-2 text-zinc-100 backdrop-blur border border-[#2a2a2a] transition hover:bg-[#111111] hover:text-[#b02600]"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>

      {showCaption && active?.title && (
        <div
          key={selected}
          data-settled={!isSpinning}
          className={cn(
            "group/caption mx-auto mt-12 w-full max-w-5xl px-6 transition-all duration-700 ease-out flex flex-col items-center min-h-[480px] md:min-h-[250px]",
            isSpinning ? "opacity-0 translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"
          )}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-10 w-full text-center md:text-left">
            {/* Left Column: Title, Description, Links */}
            <div className="md:col-span-7 flex flex-col items-center md:items-start justify-between h-full min-w-0">
              <div>
                {/* Main Title - size matching 15px font-semibold */}
                <p className="text-[15px] font-semibold tracking-tight text-zinc-100 font-sans uppercase">
                  {active.title}
                </p>
                {/* Subtitle / Description - size slightly increased to 15px/16px */}
                {active.subtitle && (
                  <div className="mt-10 text-[15px] md:text-[16px] text-[#D9D3C7] font-sans leading-relaxed">
                    {typeof active.subtitle === "string" ? (
                      <DescriptionWithMetrics description={active.subtitle} />
                    ) : (
                      active.subtitle
                    )}
                  </div>
                )}
              </div>

              {/* Links - using AnimatedLink and brand red/beige colors */}
              {(active.githubUrl || active.liveUrl) && (
                <div className="flex gap-6 mt-4 text-[15px] sm:text-[16px] font-mono justify-center md:justify-start">
                  {active.githubUrl && (
                    <AnimatedLink
                      href={active.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      variant="left"
                      showArrow={true}
                      className="font-bold text-[#b02600]"
                    >
                      SOURCE_CODE
                    </AnimatedLink>
                  )}
                  {active.liveUrl && (
                    <AnimatedLink
                      href={active.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      variant="left"
                      showArrow={true}
                      className="font-bold text-zinc-100"
                    >
                      DEMO_LINK
                    </AnimatedLink>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Metadata and Tags */}
            <div className="md:col-span-5 flex flex-col items-center md:items-start w-full">
              {/* Metadata - size matching 14px */}
              {active.meta && active.meta.length > 0 && (
                <dl className="w-full text-[13px] sm:text-[14px] font-mono border-t border-[#2a2a2a]/60 pt-2">
                  {active.meta.map((row) => (
                    <div key={row.label} className="flex justify-between py-[5px] border-b border-[#2a2a2a]/30 last:border-b-0">
                      <dt className="text-[#D9D3C7]/60 uppercase tracking-wider">{row.label}</dt>
                      <dd className="font-sans font-semibold text-[#D9D3C7]">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {/* Tags */}
              {active.tags && active.tags.length > 0 && (
                <div className="border border-[#222222] rounded-xl p-4 mt-4 w-full bg-[#111111]/10">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {active.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#222222] text-[#D9D3C7] px-2 py-1.5 text-[13px] sm:text-[14px] font-sans rounded-full font-medium shadow-sm transition-colors hover:bg-[#2e2e2e] text-center flex items-center justify-center whitespace-nowrap h-[34px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showPagination && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === selected}
              onClick={() => goTo(index)}
              className={cn(
                "size-2 rounded-full transition-all duration-300",
                index === selected ? "bg-[#b02600] opacity-100 scale-125" : "bg-zinc-600 opacity-30 hover:opacity-60"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
