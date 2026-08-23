"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type MenuItem = {
  label: React.ReactNode;
  href: string;
};

interface MenuHorizontalProps {
  menuItems: MenuItem[];
  activeSection?: string;
  color?: string;
  onItemClick?: (href: string) => void;
}

export const MenuHorizontal = ({
  menuItems = [],
  activeSection = "",
  color = "#b02600",
  onItemClick,
}: MenuHorizontalProps) => {
  return (
    <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto whitespace-nowrap scrollbar-none h-full">
      {menuItems.map((item, index) => {
        const isActive = activeSection === item.href;
        return (
          <motion.div
            key={`${item.href}-${index}`}
            className={cn(
              "group/nav flex items-center cursor-pointer transition-colors duration-200 py-1.5 font-semibold text-base sm:text-[17px] md:text-[18px] no-underline relative select-none",
              isActive ? "text-[#b02600]" : "text-[#D9D3C7] hover:text-[#b02600]"
            )}
            initial="initial"
            whileHover="hover"
            animate={isActive ? "hover" : "initial"}
            onClick={() => onItemClick?.(item.href)}
          >
            {/* Arrow slides in from the left on hover or active */}
            <motion.div
              variants={{
                initial: { x: "-100%", opacity: 0, width: 0, marginRight: 0 },
                hover: { x: 0, opacity: 1, width: "auto", marginRight: 8 },
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex items-center overflow-hidden"
            >
              <ArrowRight strokeWidth={3} className="size-4" />
            </motion.div>

            {/* Text */}
            <span className="relative z-10">
              {item.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MenuHorizontal;
