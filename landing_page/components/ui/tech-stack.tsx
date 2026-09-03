'use client'
import Image from 'next/image';
import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Terminal } from 'lucide-react';

export interface Tech {
  name: string;
  url?: string;
  color?: string;
  slug?: string;
  fallback?: React.ReactNode;
}

export interface ComponentProps {
  title?: string;
  icon?: React.ReactNode;
  bgImage?: string;
  techStack: Tech[];
}

const BrandIcon = ({ slug, fallback }: { slug?: string; fallback?: React.ReactNode }) => {
  if (!slug) return <span className="flex items-center justify-center w-4 h-4 sm:w-4.5 sm:h-4.5 mr-2 sm:mr-2.5">{fallback || <Terminal className="w-4 h-4 sm:w-4.5 sm:h-4.5" />}</span>;
  
  return (
    <div 
      className="w-4 h-4 sm:w-4.5 sm:h-4.5 bg-current mr-2 sm:mr-2.5 transition-colors flex-shrink-0"
      style={{
        maskImage: `url(https://cdn.simpleicons.org/${slug})`,
        maskRepeat: 'no-repeat',
        maskSize: 'contain',
        maskPosition: 'center',
        WebkitMaskImage: `url(https://cdn.simpleicons.org/${slug})`,
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
        WebkitMaskPosition: 'center',
      }}
    />
  );
};

export const Component: React.FC<ComponentProps> = ({ 
  title = "Techstack", 
  icon,
  bgImage = "https://images.unsplash.com/photo-1695883701435-7bd88f796e05?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDQ4NHxDRHd1d1hKQWJFd3x8ZW58MHx8fHx8",
  techStack 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const lightSize = 85; 

  const lightX = useTransform(x, (value) => value - lightSize / 2);
  const lightY = useTransform(y, (value) => value - lightSize / 2);

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  };

  const defaultIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4.5 text-zinc-400 shrink-0"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
      <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
      <path d="m10 13-2 2 2 2"></path>
      <path d="m14 17 2-2-2-2"></path>
    </svg>
  );

  return (
    <div
      className="relative overflow-hidden w-full rounded-lg border border-white/10 bg-[#111111]/80 backdrop-blur-xs p-4.5 sm:p-5 md:p-5.5 transition-all duration-300 hover:border-[#b02600]/40 shadow-lg"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={bgImage}
        alt=""
        className="absolute inset-0 w-full h-full object-cover filter blur-3xl opacity-20 pointer-events-none"
        width={400}
        height={200}
        unoptimized
      />

      {isHovered && (
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: lightSize,
            height: lightSize,
            background: 'rgba(255, 255, 255, 0.12)',
            filter: 'blur(20px)',
            x: lightX,
            y: lightY,
          }}
        />
      )}

      <div className="relative z-10 flex flex-col">
        <div className="flex items-center gap-2.5 text-white border-b border-white/10 pb-3 mb-4 sm:mb-4.5">
          {icon || defaultIcon}
          <p className="font-semibold text-xs sm:text-sm tracking-wider uppercase text-zinc-200 leading-none">{title}</p>
        </div>
        
        <div className="flex flex-wrap gap-2 sm:gap-2.5">
          {techStack.map((tech, index) => {
            const tagContent = (
              <div 
                className="inline-flex items-center rounded-full border border-white/10 bg-black/40 px-3 sm:px-3.5 py-1.5 text-xs sm:text-[13px] font-medium transition-colors focus:outline-none text-zinc-300 hover:text-white hover:border-zinc-500 hover:bg-white/10"
                style={tech.color ? { borderColor: `${tech.color}15` } : {}}
              >
                <BrandIcon slug={tech.slug} fallback={tech.fallback} />
                {tech.name}
              </div>
            );

            if (tech.url) {
              return (
                <a 
                  key={index} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  href={tech.url}
                  className="cursor-pointer"
                >
                  {tagContent}
                </a>
              );
            }

            return <div key={index}>{tagContent}</div>;
          })}
        </div>
      </div>
    </div>
  );
};
