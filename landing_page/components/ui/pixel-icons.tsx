import React from 'react';

interface PixelIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

/**
 * Pixel Crosshair / Flower Cluster icon (10.5 x 10.5 grid)
 */
export function PixelCrosshair({ className = "size-[12px] text-primary", size, ...props }: PixelIconProps) {
  return (
    <svg
      viewBox="0 0 10.5 10.5"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect width="1.5" height="1.5" rx="0.3" />
      <rect x="9" width="1.5" height="1.5" rx="0.3" />
      <rect y="9" width="1.5" height="1.5" rx="0.3" />
      <rect x="9" y="9" width="1.5" height="1.5" rx="0.3" />
      <rect x="1.5" y="1.5" width="1.5" height="1.5" rx="0.3" />
      <rect x="7.5" y="1.5" width="1.5" height="1.5" rx="0.3" />
      <rect x="1.5" y="7.5" width="1.5" height="1.5" rx="0.3" />
      <rect x="7.5" y="7.5" width="1.5" height="1.5" rx="0.3" />
      <rect y="4.5" width="3" height="1.5" rx="0.3" />
      <rect x="4.5" width="1.5" height="3" rx="0.3" />
      <rect x="4.5" y="4.5" width="1.5" height="1.5" rx="0.3" />
      <rect x="7.5" y="4.5" width="3" height="1.5" rx="0.3" />
      <rect x="4.5" y="7.5" width="1.5" height="3" rx="0.3" />
    </svg>
  );
}

/**
 * Pixel Diamond / Lozenge frame icon (18 x 18 grid)
 */
export function PixelDiamond({ className = "size-[16px] text-primary", size, ...props }: PixelIconProps) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect x="0" y="3" width="3" height="3" rx="0.75" />
      <rect x="9" y="0" width="3" height="3" rx="0.75" />
      <rect x="3" y="0" width="3" height="3" rx="0.75" />
      <rect x="15" y="0" width="3" height="3" rx="0.75" />
      <rect x="0" y="15" width="3" height="3" rx="0.75" />
      <rect x="3" y="12" width="3" height="3" rx="0.75" />
      <rect x="9" y="6" width="3" height="3" rx="0.75" />
      <rect x="9" y="12" width="3" height="3" rx="0.75" />
      <rect x="6" y="15" width="3" height="3" rx="0.75" />
      <rect x="12" y="9" width="3" height="3" rx="0.75" />
      <rect x="15" y="6" width="3" height="3" rx="0.75" />
      <rect x="12" y="3" width="3" height="3" rx="0.75" />
      <rect x="3" y="6" width="3" height="3" rx="0.75" />
      <rect x="6" y="3" width="3" height="3" rx="0.75" />
      <rect x="0" y="9" width="3" height="3" rx="0.75" />
      <rect x="6" y="9" width="3" height="3" rx="0.75" />
      <rect x="15" y="12" width="3" height="3" rx="0.75" />
      <rect x="12" y="15" width="3" height="3" rx="0.75" />
    </svg>
  );
}

/**
 * Pixel Checkerboard Dither icon (99 x 99 matrix)
 */
export function PixelChecker({ className = "size-[14px] text-primary", size, ...props }: PixelIconProps) {
  return (
    <svg
      viewBox="0 0 99 99"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect x="0" width="14.14" height="14.14" rx="1.41" />
      <rect x="98.99" y="98.99" width="14.14" height="14.14" rx="1.41" transform="rotate(180 98.99 98.99)" />
      <rect x="14.15" y="14.14" width="14.14" height="14.14" rx="1.41" />
      <rect x="84.86" y="84.85" width="14.14" height="14.14" rx="1.41" transform="rotate(180 84.86 84.85)" />
      <rect x="28.29" y="28.28" width="14.14" height="14.14" rx="1.41" />
      <rect x="70.73" y="70.71" width="14.14" height="14.14" rx="1.41" transform="rotate(180 70.73 70.71)" />
      <rect x="56.57" y="28.28" width="14.14" height="14.14" rx="1.41" />
      <rect x="42.44" y="70.71" width="14.14" height="14.14" rx="1.41" transform="rotate(180 42.44 70.71)" />
      <path d="M25.46 42.43C27.02 42.43 28.29 43.69 28.29 45.26V53.74C28.29 55.3 27.02 56.56 25.46 56.56H2.83C1.27 56.56 0 55.3 0 53.74V45.26C0 43.69 1.27 42.43 2.83 42.43H25.46Z" />
      <path d="M96.17 42.43C97.73 42.43 99 43.69 99 45.26V53.74C99 55.3 97.73 56.56 96.17 56.56H73.55C71.99 56.56 70.73 55.3 70.73 53.74V45.26C70.73 43.69 71.99 42.43 73.55 42.43H96.17Z" />
      <rect x="56.57" y="56.56" width="14.14" height="14.14" rx="1.41" transform="rotate(180 56.57 56.56)" />
      <rect x="70.73" y="14.14" width="14.14" height="14.14" rx="1.41" />
      <rect x="28.29" y="84.85" width="14.14" height="14.14" rx="1.41" transform="rotate(180 28.29 84.85)" />
      <rect x="84.86" width="14.14" height="14.14" rx="1.41" />
      <rect x="14.15" y="98.99" width="14.14" height="14.14" rx="1.41" transform="rotate(180 14.15 98.99)" />
      <path d="M56.56 25.45C56.56 27.01 55.3 28.28 53.74 28.28H45.26C43.69 28.28 42.43 27.01 42.43 25.45V2.83C42.43 1.27 43.69 0 45.26 0H53.74C55.3 0 56.56 1.27 56.56 2.83V25.45Z" />
      <path d="M56.56 96.16C56.56 97.72 55.3 98.99 53.74 98.99H45.25C43.69 98.99 42.43 97.72 42.43 96.16V87.68C42.43 86.12 43.69 84.85 45.25 84.85H53.74C55.3 84.85 56.56 86.12 56.56 87.68V96.16ZM56.56 82.02C56.56 83.58 55.3 84.85 53.74 84.85H45.25C43.69 84.85 42.43 83.58 42.43 82.02V73.54C42.43 71.97 43.69 70.71 45.25 70.71H53.74C55.3 70.71 56.56 71.97 56.56 73.54V82.02Z" />
    </svg>
  );
}

/**
 * Pixel Step Arrow ↗ icon (12 x 12 grid)
 */
export function PixelArrow({ className = "size-[12px]", size, ...props }: PixelIconProps) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect x="0" y="5" width="2" height="2" rx="0.5" />
      <rect x="5" y="0" width="2" height="2" rx="0.5" />
      <rect x="5" y="5" width="2" height="2" rx="0.5" />
      <rect x="5" y="10" width="2" height="2" rx="0.5" />
      <rect x="10" y="5" width="2" height="2" rx="0.5" />
    </svg>
  );
}
