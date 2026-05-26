"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

export const Navigation = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    } else {
      window.location.href = `/#${id}`;
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 h-[52px] z-40 transition-all duration-200 ${
          isScrolled
            ? "bg-bg/85 backdrop-blur-3xl border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="relative h-full flex items-center justify-between px-5 md:px-10 max-w-7xl mx-auto">
          {/* Logo/Name placeholder */}
          <div className="flex-1 hidden md:block">
            {/* PM removed as requested */}
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {pathname === '/work' && (
              <Link
                href="/"
                className="font-bold text-lg md:text-xl tracking-wider text-muted hover:text-ink"
                style={{ transition: "color 0s" }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                HOME
              </Link>
            )}
            <button
              onClick={() => scrollToSection("about")}
              className="font-bold text-lg md:text-xl tracking-wider text-muted hover:text-ink cursor-pointer"
              style={{ transition: "color 0s" }}
            >
              ABOUT
            </button>
            <Link
              href="/work"
              className="font-bold text-lg md:text-xl tracking-wider text-muted hover:text-ink"
              style={{ transition: "color 0s" }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              WORK
            </Link>
            <button
              onClick={() => scrollToSection("stack")}
              className="font-bold text-lg md:text-xl tracking-wider text-muted hover:text-ink cursor-pointer"
              style={{ transition: "color 0s" }}
            >
              STACK
            </button>
            <button
              onClick={() => scrollToSection("experience")}
              className="font-bold text-lg md:text-xl tracking-wider text-muted hover:text-ink cursor-pointer"
              style={{ transition: "color 0s" }}
            >
              EXPERIENCE
            </button>
          </div>

          {/* Actions */}
          <div className="flex-1 flex justify-end items-center gap-4">
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex flex-col gap-1.5 w-6 h-6 justify-center"
              aria-label="Toggle menu"
            >
              <div
                className={`w-full h-px bg-ink transition-transform ${isMobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""}`}
              ></div>
              <div
                className={`w-full h-px bg-ink transition-opacity ${isMobileMenuOpen ? "opacity-0" : ""}`}
              ></div>
              <div
                className={`w-full h-px bg-ink transition-transform ${isMobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}
              ></div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-bg/95 z-30 md:hidden pt-20">
          <div className="flex flex-col gap-8 px-5 py-8">
            {pathname === '/work' && (
              <Link
                href="/"
                className="font-label text-base text-accent uppercase tracking-widest"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                HOME
              </Link>
            )}
            <button
              onClick={() => scrollToSection("about")}
              className="font-label text-base text-accent uppercase tracking-widest"
            >
              ABOUT
            </button>
            <Link
              href="/work"
              className="font-label text-base text-accent uppercase tracking-widest"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              WORK
            </Link>
            <button
              onClick={() => scrollToSection("stack")}
              className="font-label text-base text-accent uppercase tracking-widest"
            >
              STACK
            </button>
            <button
              onClick={() => scrollToSection("experience")}
              className="font-label text-base text-accent uppercase tracking-widest"
            >
              EXPERIENCE
            </button>
          </div>
        </div>
      )}
    </>
  );
};
