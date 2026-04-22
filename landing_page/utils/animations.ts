/**
 * Animation utilities for the portfolio
 */

export const triggerGlitch = (element: HTMLElement) => {
  if (!element) return;
  element.style.animation = 'none';
  // Force reflow
  void element.offsetWidth;
  element.style.animation = 'glitch 0.4s steps(1)';
};

export const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return function (...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const staggerReveal = (
  elements: HTMLElement[],
  duration: number = 600,
  staggerDelay: number = 60
) => {
  elements.forEach((el, index) => {
    el.style.animation = 'none';
    el.style.opacity = '0';
    el.style.transform = 'translateY(60px)';
    
    // Force reflow
    void el.offsetWidth;
    
    const delay = index * staggerDelay;
    el.style.animation = `fadeUp ${duration}ms ease forwards`;
    el.style.animationDelay = `${delay}ms`;
  });
};

export const shouldReduceMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
