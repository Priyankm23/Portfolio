"use client";

import { useState } from "react";

const SMILEY_INDICES = [
  // Eyes
  64, 65, 79, 80, // Left eye
  69, 70, 84, 85, // Right eye
  
  // Smile
  123, 131,       // Smile edges
  139, 145,       // Smile transition
  155, 156, 157, 158, 159, // Smile bottom

  // Head Outline
  20, 21, 22, 23, 24, // Row 1
  33, 34, 40, 41,     // Row 2
  47, 57,             // Row 3
  61, 73,             // Row 4
  76, 88,             // Row 5
  91, 103,            // Row 6
  106, 118,           // Row 7
  121, 133,           // Row 8
  136, 148,           // Row 9
  152, 162,           // Row 10
  167, 177,           // Row 11
  183, 184, 190, 191, // Row 12
  200, 201, 202, 203, 204 // Row 13
];

const GridCell = ({ isSmiley, onInteract }: { isSmiley: boolean; onInteract: () => void }) => {
  const [active, setActive] = useState(false);

  const handleHover = () => {
    onInteract();
    setActive(true);
    setTimeout(() => {
      setActive(false);
    }, 800); // Fade out duration
  };

  const isLit = active || isSmiley;

  return (
    <div
      onMouseEnter={handleHover}
      onTouchMove={handleHover} // For mobile interaction
      className="w-full aspect-square rounded-[2px]"
      style={{
        backgroundColor: isLit ? "var(--accent)" : "var(--border)",
        opacity: isLit ? 1 : 0.2,
        transition: active 
          ? "background-color 50ms ease-out, opacity 50ms ease-out" 
          : "background-color 800ms ease-in, opacity 800ms ease-in",
        cursor: "crosshair"
      }}
    />
  );
};

export const InteractiveGrid = ({ className }: { className?: string }) => {
  const [hasInteracted, setHasInteracted] = useState(false);

  // A 15x15 grid offers a nice density for interaction
  const cols = 15;
  const rows = 15;
  const total = cols * rows;

  return (
    <div className={`flex flex-col items-center justify-center ${className || ""}`}>
      <div 
        className="w-full max-w-[400px] aspect-square grid gap-[2px] md:gap-1 p-4 bg-surface/50 border border-border backdrop-blur-md rounded-xl shadow-lg"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`
        }}
      >
        {Array.from({ length: total }).map((_, i) => (
          <GridCell 
            key={i} 
            isSmiley={!hasInteracted && SMILEY_INDICES.includes(i)}
            onInteract={() => {
              if (!hasInteracted) setHasInteracted(true);
            }}
          />
        ))}
      </div>
      <p className="mt-4 font-mono text-[10px] text-muted uppercase tracking-widest text-center">
        Move cursor over grid
      </p>
    </div>
  );
};
