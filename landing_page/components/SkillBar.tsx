'use client';

import { useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface SkillBarProps {
  name: string;
  percentage: number;
}

export const SkillBar = ({ name, percentage }: SkillBarProps) => {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });
  const [fillPercentage, setFillPercentage] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setFillPercentage(percentage);
    }
  }, [isVisible, percentage]);

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-body text-sm text-ink">{name}</span>
        <span className="font-label text-xs text-muted uppercase tracking-widest">
          {percentage}%
        </span>
      </div>
      <div className="w-full h-1 bg-border overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-800 ease-out"
          style={{ width: `${fillPercentage}%` }}
          role="progressbar"
          aria-valuenow={fillPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};
