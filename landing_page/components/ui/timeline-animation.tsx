"use client";
import * as React from "react";
import { motion, useInView } from "motion/react";

interface TimelineContentProps {
  children?: React.ReactNode;
  animationNum?: number;
  timelineRef?: React.RefObject<HTMLElement | null>;
  customVariants?: any;
  as?: keyof JSX.IntrinsicElements | any;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
}

export const TimelineContent = ({
  children,
  animationNum = 0,
  timelineRef,
  customVariants,
  as = "div",
  className,
  ...props
}: TimelineContentProps) => {
  const localRef = React.useRef<HTMLElement>(null);
  const triggerRef = timelineRef || localRef;
  const isInView = useInView(triggerRef as any, { once: true, amount: 0.1 });

  const defaultVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: animationNum * 0.2,
        duration: 0.5,
      },
    },
  };

  const variants = customVariants || defaultVariants;
  const MotionComponent = motion[as as keyof typeof motion] || motion.div;

  return (
    <MotionComponent
      ref={localRef as any}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      custom={animationNum}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};
