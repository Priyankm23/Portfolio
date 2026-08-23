"use client";

import * as React from "react";
import { Award, ArrowUpRight } from "lucide-react";
import { motion, type Transition } from "motion/react";

interface NotificationListProps {
  visitorCount?: string | number | null;
}

const transition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 26,
};

const getCardVariants = (i: number) => ({
  collapsed: {
    marginTop: i === 0 ? 0 : -54,
    scaleX: 1 - i * 0.03,
    opacity: i === 0 ? 1 : 0.7,
  },
  expanded: {
    marginTop: i === 0 ? 0 : 10,
    scaleX: 1,
    opacity: 1,
  },
});

const textSwitchTransition: Transition = {
  duration: 0.22,
  ease: "easeInOut",
};

const notificationTextVariants = {
  collapsed: { opacity: 1, y: 0, pointerEvents: "auto" },
  expanded: { opacity: 0, y: -16, pointerEvents: "none" },
};

const viewAllTextVariants = {
  collapsed: { opacity: 0, y: 16, pointerEvents: "none" },
  expanded: { opacity: 1, y: 0, pointerEvents: "auto" },
};

export function NotificationList({ visitorCount = null }: NotificationListProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const hasUnpackedRef = React.useRef(false);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasUnpackedRef.current) {
            hasUnpackedRef.current = true;
            setIsExpanded(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const notifications = [
    {
      id: 1,
      title: "Priyank Moradiya",
      subtitle: "Software Developer",
    },
    {
      id: 2,
      title: "B.Tech (IT) · 4th Year",
      subtitle: "GCET, Anand, Gujarat",
      count: "9.40",
    },
    {
      id: 3,
      title: "Finding internship & doing open source contribution",
      subtitle: "Open to opportunities",
    },
    {
      id: 4,
      title: "Anand, Gujarat, IN",
      subtitle: "Open to relocation / remote",
    },
    {
      id: 5,
      title: visitorCount !== null ? `${visitorCount} visits` : "Syncing...",
      subtitle: "",
    },
  ];

  return (
    <motion.div
      ref={containerRef}
      /* Outer brutalist container — matches Tools card style */
      className="bg-[#D9D3C7] p-5 w-full max-w-md border border-on-surface shadow-[4px_4px_0px_0px_rgba(27,28,28,1)]"
      initial="collapsed"
      animate={isExpanded ? "expanded" : "collapsed"}
      whileHover="expanded"
    >
      <div>
        {notifications.map((notification, i) => (
          <motion.div
            key={notification.id}
            /* Inner brutalist cards — thick border + offset shadow (unlike Tools which uses thin borders) */
            className="bg-surface border border-on-surface shadow-[3px_3px_0px_0px_rgba(27,28,28,1)] px-4 py-3 relative"
            variants={getCardVariants(i)}
            transition={transition}
            style={{ zIndex: notifications.length - i }}
          >
            <div className="flex justify-between items-start gap-2">
              <h1 className="font-mono-code text-[13.5px] sm:text-[14.5px] font-bold text-on-surface uppercase tracking-wide leading-snug">
                {notification.title}
              </h1>
              {notification.count && (
                <div className="flex items-center text-[12px] gap-0.5 font-bold text-primary whitespace-nowrap border border-primary px-1.5 py-0.5">
                  <Award className="size-3.5" />
                  <span>{notification.count}</span>
                </div>
              )}
            </div>
            {notification.subtitle && (
              <div className="font-mono-code text-[12.5px] text-on-surface/85 mt-1.5">
                {notification.subtitle}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 select-none mt-3 px-0.5">
        <div className="size-6 rounded-full bg-[#b02600] text-white text-xs flex items-center justify-center font-bold shrink-0">
          {notifications.length}
        </div>
        <span className="grid flex-1">
          <motion.span
            className="font-mono-code text-[13px] font-bold text-on-surface uppercase tracking-wider row-start-1 col-start-1"
            variants={notificationTextVariants}
            transition={textSwitchTransition}
          >
            Specifications
          </motion.span>
          <motion.a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono-code text-[13px] font-bold text-on-surface uppercase tracking-wider flex items-center gap-1 cursor-pointer row-start-1 col-start-1 hover:text-primary transition-colors"
            variants={viewAllTextVariants}
            transition={textSwitchTransition}
          >
            View Resume <ArrowUpRight className="size-3.5" />
          </motion.a>
        </span>
      </div>
    </motion.div>
  );
}

export default NotificationList;
