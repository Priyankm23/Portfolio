"use client";

import React, { useState, useEffect, useRef } from "react";
import { Terminal, Workflow } from "lucide-react";
import { fetchPortfolioApi } from "@/lib/api";
import { CoverflowCarousel } from "@/components/ui/coverflow-carousel";
import { AnimatedMetric } from "@/components/ui/animated-metric";
import { MenuHorizontal } from "@/components/ui/menu-horizontal";
import { Component as TechStackCard } from "@/components/ui/tech-stack";
import { NotificationList } from "@/components/ui/components-community-notification-list";
import { ContainerScroll, CardSticky } from "@/components/ui/cards-stack";
import AboutSection3 from "@/components/ui/about-section";
import { motion, AnimatePresence } from "motion/react";
import { ShaderBackground } from "@/components/ui/shader-background";
import { PixelCrosshair, PixelDiamond, PixelChecker, PixelArrow, PixelChip, PixelDatabase, PixelDevOps } from "@/components/ui/pixel-icons";
import Lenis from "lenis";

// Project Interface
interface Project {
  title: string;
  dates: string;
  tech: string;
  description: React.ReactNode;
  tags: string[];
  githubUrl: string;
  liveUrl?: string;
  image?: string;
  logoUrl?: string;
  screenshot?: string;
  metrics?: { label: string; value: string }[];
}

// ExperienceHighlight component to animate underlines on scroll
const ExperienceHighlight = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="relative inline-block font-semibold text-zinc-100 whitespace-nowrap">
      {children}
      <motion.span
        className="absolute bottom-[-0.12em] left-0 right-0 h-[0.08em] bg-[#D9D3C7] origin-left"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
    </span>
  );
};

// BrandIcon component using simpleicons mask
const BrandIcon = ({
  slug,
  fallback,
}: {
  slug?: string;
  fallback?: React.ReactNode;
}) => {
  if (!slug)
    return (
      <span className="flex items-center justify-center w-5 h-5">
        {fallback || <Terminal className="w-4.5 h-4.5" />}
      </span>
    );

  return (
    <div
      className="w-5 h-5 bg-current transition-colors"
      style={{
        maskImage: `url(https://cdn.simpleicons.org/${slug})`,
        maskRepeat: "no-repeat",
        maskSize: "contain",
        maskPosition: "center",
        WebkitMaskImage: `url(https://cdn.simpleicons.org/${slug})`,
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        WebkitMaskPosition: "center",
      }}
    />
  );
};

const techStack = [
  {
    category: "Frameworks",
    icon: <PixelChip className="size-3.5 text-primary shrink-0" />,
    items: [
      { name: "Node.js", slug: "nodedotjs" },
      { name: "Express.js", slug: "express" },
      { name: "FastAPI", slug: "fastapi" },
      { name: "Python", slug: "python" },
      { name: "TypeScript", slug: "typescript" },
    ],
  },
  {
    category: "Databases",
    icon: <PixelDatabase className="size-3.5 text-primary shrink-0" />,
    items: [
      { name: "PostgreSQL", slug: "postgresql" },
      { name: "MongoDB", slug: "mongodb" },
      { name: "Redis", slug: "redis" },
      { name: "SQLite", slug: "sqlite" },
      { name: "Prisma ORM", slug: "prisma" },
    ],
  },
  {
    category: "DevOps & Tools",
    icon: <PixelDevOps className="size-3.5 text-primary shrink-0" />,
    items: [
      { name: "Docker", slug: "docker" },
      { name: "Git / GitHub", slug: "git" },
      { name: "PM2", slug: "pm2" },
      { name: "Postman", slug: "postman" },
      { name: "gRPC" },
      { name: "RabbitMQ", slug: "rabbitmq" },
      { name: "Zod", slug: "zod" },
      { name: "BullMQ", fallback: <Workflow className="w-3.5 h-3.5" /> },
    ],
  },
];

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");
  const [showScreenshot, setShowScreenshot] = useState(false);
  const [prelaxExpanded, setPrelaxExpanded] = useState(false);
  const [infosysExpanded, setInfosysExpanded] = useState(false);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Interval for toggling screenshots or similar
  useEffect(() => {
    const interval = setInterval(() => {
      setShowScreenshot((prev) => !prev);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const [dynamicWordIndex, setDynamicWordIndex] = useState(0);
  const words = ["FUN", "INNOVATION", "LEARNING", "COLLABORATION"];

  useEffect(() => {
    const interval = setInterval(() => {
      setDynamicWordIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [words.length]);

  // States for visitor count
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  // Fetch real GitHub contribution data
  const [githubCommits, setGithubCommits] = useState<number>(234);
  const [githubRepos, setGithubRepos] = useState<number>(18);
  const [githubPRs, setGithubPRs] = useState<number>(7);
  const [githubStreak, setGithubStreak] = useState<number>(0);
  const [githubDays, setGithubDays] = useState<
    { date: string; count: number; level: number }[]
  >([]);

  useEffect(() => {
    const fetchGithubData = async () => {
      const getLevel = (count: number) => {
        if (count === 0) return 0;
        if (count < 3) return 1;
        if (count < 6) return 2;
        if (count < 9) return 3;
        return 4;
      };

      try {
        const response = await fetchPortfolioApi("/api/github/contributions");

        if (response.ok) {
          const data = await response.json();
          if (
            data &&
            typeof data.total === "number" &&
            Array.isArray(data.days)
          ) {
            setGithubCommits(data.total);
            if (typeof data.repos === "number") setGithubRepos(data.repos);
            if (typeof data.prs === "number") setGithubPRs(data.prs);
            if (typeof data.streak === "number") setGithubStreak(data.streak);

            const processed = data.days.map((d: any) => ({
              date: d.date,
              count: d.count,
              level: getLevel(d.count),
            }));
            setGithubDays(processed);
            return;
          }
        }
      } catch (err) {
        console.warn("Backend API unavailable, fetching live contributions directly from public GitHub endpoints:", err);
      }

      // Direct Live Public GitHub Fallback (100% Real Contributions)
      try {
        const contribRes = await fetch("https://github-contributions-api.jogruber.de/v4/Priyankm23?y=last");
        if (contribRes.ok) {
          const contribData = await contribRes.json();
          const currentYear = new Date().getFullYear().toString();
          const daysList: { date: string; count: number; level: number }[] = contribData.contributions || [];
          const currentYearDays = daysList.filter((c: any) => c.date.startsWith(currentYear));

          const totalForYear = currentYearDays.reduce((acc, curr) => acc + curr.count, 0);
          setGithubCommits(totalForYear || contribData.total?.lastYear || 387);

          // Compute active streak
          let streakCount = 0;
          for (let i = currentYearDays.length - 1; i >= 0; i--) {
            if (currentYearDays[i].count > 0) streakCount++;
            else if (i < currentYearDays.length - 1) break;
          }
          setGithubStreak(streakCount);

          const processed = currentYearDays.map((d: any) => ({
            date: d.date,
            count: d.count,
            level: d.level !== undefined ? d.level : getLevel(d.count),
          }));
          setGithubDays(processed);
        }

        // Fetch real public repository count
        const userRes = await fetch("https://api.github.com/users/Priyankm23");
        if (userRes.ok) {
          const userData = await userRes.json();
          if (typeof userData.public_repos === "number") {
            setGithubRepos(userData.public_repos);
          }
        }

        // Fetch real PR count
        const prRes = await fetch("https://api.github.com/search/issues?q=author:Priyankm23+type:pr");
        if (prRes.ok) {
          const prData = await prRes.json();
          if (typeof prData.total_count === "number") {
            setGithubPRs(prData.total_count);
          }
        }
      } catch (directErr) {
        console.error("Error fetching direct GitHub contributions:", directErr);
      }
    };
    fetchGithubData();
  }, []);

  // Fetch real visitor count from the backend API
  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const apiBaseUrl = (
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        ).replace(/\/+$/, "");
        const primaryUrl = `${apiBaseUrl}/api/visitor-count`;

        let response = await fetch(primaryUrl);

        // If primary call fails, try fetching from the Vercel deployed API as a live backup
        if (
          !response.ok &&
          apiBaseUrl !== "https://portfolio-backend-api-seven.vercel.app"
        ) {
          response = await fetch(
            "https://portfolio-backend-api-seven.vercel.app/api/visitor-count",
          );
        }

        if (response.ok) {
          const data = await response.json();
          if (data && typeof data.visit_count === "number") {
            setVisitorCount(data.visit_count);
            return;
          }
        }
      } catch (err) {
        console.error(
          "Error fetching visitor count from primary endpoint:",
          err,
        );

        // Active backup fetch if localhost fails
        try {
          const backupResponse = await fetch(
            "https://portfolio-tvyp.vercel.app/api/visitor-count",
          );
          if (backupResponse.ok) {
            const data = await backupResponse.json();
            if (data && typeof data.visit_count === "number") {
              setVisitorCount(data.visit_count);
              return;
            }
          }
        } catch (backupErr) {
          console.error("Backup Vercel API fetch failed:", backupErr);
        }
      }

      // Fallback
      setVisitorCount(1243);
    };
    fetchVisits();
  }, []);

  // Scroll reveal IntersectionObserver setup
  useEffect(() => {
    const revealCallback = (
      entries: IntersectionObserverEntry[],
      observer: IntersectionObserver,
    ) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.05,
    };

    const observer = new IntersectionObserver(revealCallback, observerOptions);
    const revealElements = document.querySelectorAll(
      ".scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .project-card-reveal",
    );
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [githubDays]);

  // Helper to parse YYYY-MM-DD date safely
  const parseDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const projects: Project[] = [
    {
      title: "Cadence",
      dates: "May 2026 – Present",
      tech: "Python · FastAPI",
      description: (
        <>
          A real-time meeting transcription and intelligence platform. Built a
          Deepgram Nova-2 transcription pipeline cutting audio bandwidth by{" "}
          <AnimatedMetric>83.3%</AnimatedMetric> and enabling{" "}
          <AnimatedMetric>sub-150ms</AnimatedMetric> transcription latency via
          Redis Pub/Sub. Integrates a local Silero VAD model to discard
          low-confidence speech frames, reducing database report retrieval time
          from <AnimatedMetric>1.25s</AnimatedMetric> to{" "}
          <AnimatedMetric>50ms</AnimatedMetric> (
          <AnimatedMetric>35%</AnimatedMetric> total reduction). Uses a
          leaky-bucket rate limiter to pace summary generation with a{" "}
          <AnimatedMetric>100%</AnimatedMetric> success rate.
        </>
      ),
      tags: ["Python", "FastAPI", "LiveKit", "WebRTC", "Deepgram", "Groq"],
      githubUrl: "https://github.com/Priyankm23/Cadence-backend",
      liveUrl: "https://cadence-meeting-intelligence.vercel.app/",
      screenshot: "/cadence.png",
      metrics: [
        { label: "Audio Bandwidth", value: "-83.3%" },
        { label: "Transcription Latency", value: "Sub-150ms" },
        { label: "Report Retrieval", value: "1.25s → 50ms" },
        { label: "Report Gen Time", value: "-35%" },
        { label: "Summary Success", value: "100%" },
      ],
    },
    {
      title: "Markivo",
      dates: "Mar – Apr 2026",
      tech: "TypeScript · Express",
      description: (
        <>
          A high-throughput multi-vendor e-commerce API. Implemented Stripe
          checkout with idempotency keys to prevent duplicate payments under
          concurrent checkouts, and used database row-level locking inside
          transactions to guarantee <AnimatedMetric>zero</AnimatedMetric> stock
          drift. Configured a TTL caching layer for the product catalog that
          scaled read throughput from{" "}
          <AnimatedMetric>199 to 565+ RPS</AnimatedMetric> and cut p95 latency
          from <AnimatedMetric>871ms</AnimatedMetric> to{" "}
          <AnimatedMetric>83ms</AnimatedMetric>.
        </>
      ),
      tags: [
        "TypeScript",
        "Express.js",
        "PostgreSQL",
        "Prisma ORM",
        "Redis",
        "Stripe",
      ],
      githubUrl: "https://github.com/Priyankm23/marketflow",
      liveUrl: "https://marketflow-your-one-stop-shop.vercel.app/",
      screenshot: "/marketflow.png",
      metrics: [
        { label: "Read Throughput", value: "199 → 565+ RPS" },
        { label: "p95 Latency", value: "871ms → 83ms" },
        { label: "Stock Drift", value: "0% (Zero)" },
      ],
    },
    {
      title: "SafeTrail",
      dates: "Jan – Feb 2026",
      tech: "JavaScript · Node.js",
      description: (
        <>
          A smart tourist safety backend with JWT role-based access, real-time
          SOS alerts, and live location streaming via Socket.IO. Features a
          background risk engine that scores geographic grid cells{" "}
          <AnimatedMetric>every 30 minutes</AnimatedMetric> with time-decay
          weighting, and auto-generates TTL-bound geofences from itineraries.
          Enforces tamper-proof event auditing using{" "}
          <AnimatedMetric>Polygon L2</AnimatedMetric> blockchain and encrypts
          PII via <AnimatedMetric>AES-256</AnimatedMetric>.
        </>
      ),
      tags: [
        "Node.js",
        "Express.js",
        "MongoDB",
        "Socket.IO",
        "Ethers.js",
        "Polygon",
      ],
      githubUrl: "https://github.com/Priyankm23/safetrail",
      liveUrl: "https://safetrail-your-safety-in-your-mobile.vercel.app/",
      screenshot: "/safetrail.png",
      metrics: [
        { label: "Risk Update", value: "Every 30 Mins" },
        { label: "PII Security", value: "AES-256" },
        { label: "Blockchain Ledger", value: "Polygon L2" },
      ],
    },
    /* Bandit CLI - Commented out for now
    {
      title: "Bandit CLI",
      dates: "Jan 2026",
      tech: "TypeScript · Node.js",
      description: (
        <>
          An interactive CLI audit tool validating project health. Scans dependencies, runs test coverage audits, packages configuration validations, and outputs interactive brutalist dashboards built with raw terminal strings.
          <span className="block text-[11.5px] text-on-surface-variant/75 mt-1.5 font-mono-code">
            * Created with zero understanding of code but trying to understand it for improvement.
          </span>
        </>
      ),
      tags: [
        "TypeScript",
        "Node.js",
        "Commander",
        "Clack Prompts",
        "CLI",
        "NPM Package",
      ],
      githubUrl: "https://github.com/Priyankm23/Backend-Audit-CLI-Tool---Bandit",
      liveUrl: "https://bandit-cli.vercel.app/",
      image: "/bandit_graphic.png",
      logoUrl: "/bandit_logo.png",
      screenshot: "/bandit.png",
    }
    */
  ];

  // Align days to Sunday-Saturday weeks
  let weeks: {
    date: string;
    count: number;
    level: number;
    isPlaceholder?: boolean;
  }[][] = [];
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  if (githubDays.length > 0) {
    const firstDate = parseDate(githubDays[0].date);
    const firstDayOfWeek = firstDate.getDay(); // 0 is Sunday, 1 is Monday...

    // Prepend placeholders
    const startPlaceholders = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      const prevDate = new Date(firstDate);
      prevDate.setDate(firstDate.getDate() - (firstDayOfWeek - i));
      const y = prevDate.getFullYear();
      const m = String(prevDate.getMonth() + 1).padStart(2, "0");
      const d = String(prevDate.getDate()).padStart(2, "0");
      startPlaceholders.push({
        date: `${y}-${m}-${d}`,
        count: 0,
        level: 0,
        isPlaceholder: true,
      });
    }

    const lastDate = parseDate(githubDays[githubDays.length - 1].date);
    const lastDayOfWeek = lastDate.getDay(); // 0 is Sunday, 6 is Saturday

    // Append placeholders to reach Saturday
    const endPlaceholders = [];
    const daysToSaturday = 6 - lastDayOfWeek;
    for (let i = 1; i <= daysToSaturday; i++) {
      const nextDate = new Date(lastDate);
      nextDate.setDate(lastDate.getDate() + i);
      const y = nextDate.getFullYear();
      const m = String(nextDate.getMonth() + 1).padStart(2, "0");
      const d = String(nextDate.getDate()).padStart(2, "0");
      endPlaceholders.push({
        date: `${y}-${m}-${d}`,
        count: 0,
        level: 0,
        isPlaceholder: true,
      });
    }

    const allDays = [...startPlaceholders, ...githubDays, ...endPlaceholders];

    for (let i = 0; i < allDays.length; i += 7) {
      weeks.push(allDays.slice(i, i + 7));
    }
  }

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 64; // header height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "about",
        "projects",
        "stack",
        "contributions",
        "experience",
        "play",
      ];
      const scrollPos = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[#0a0a0a] text-[#D9D3C7] font-body-md antialiased pt-16 pb-0 min-h-screen">
      {/* TopAppBar - Responsive Horizontal Navigation Header */}
      <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-center border-b border-outline bg-black px-4 md:px-6 lg:px-8">
        <nav className="flex h-full w-full items-center justify-center overflow-x-auto whitespace-nowrap scrollbar-none">
          <MenuHorizontal
            menuItems={[
              { label: "ABOUT", href: "about" },
              { label: "PROJECTS", href: "projects" },
              { label: "STACK", href: "stack" },
              { label: "COMMITS", href: "contributions" },
              { label: <><span className="hidden sm:inline">EXPERIENCE</span><span className="sm:hidden">EXP</span></>, href: "experience" },
            ]}
            activeSection={activeSection}
            onItemClick={scrollTo}
            skew={-8}
          />
        </nav>
      </header>

      {/* Main Content Area - Full width without left sidebar margins */}
      <main className="min-h-screen flex flex-col relative bg-[#0a0a0a]">
        {/* Hero Section */}
        <section
          id="hero"
          className="relative pt-12 pb-12 md:py-8 flex flex-col justify-center items-center min-h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] z-10 text-[#D9D3C7] bg-[#0a0a0a] overflow-hidden isolate"
        >
          {/* WebGL Shader Background with bottom fade */}
          <div className="absolute inset-0 z-0 pointer-events-none [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]">
            <ShaderBackground className="w-full h-full opacity-20" />
          </div>

          {/* Hoplite ASCII Hero Art Texture Layer with smooth bottom fade */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 bg-[url(/landing/hero-art-dark.webp)] bg-cover bg-center opacity-20 mix-blend-screen [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]"
          />

          {/* Hero Content Container */}
          <div className="w-full max-w-full mx-auto px-6 sm:px-8 md:px-20 lg:px-28 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-24 items-center relative z-10 h-full">
            {/* Left Column: Text Content */}
            <div className="md:col-span-8 flex flex-col items-start text-left gap-6 w-full">
              {/* Greeting + Name */}
              <div className="flex flex-col gap-2 items-start select-none">
                <div className="flex items-center gap-2">
                  <PixelCrosshair className="size-3.5 text-primary" />
                  <span className="text-[14px] sm:text-[18px] md:text-[20px] text-zinc-400 font-sans font-medium tracking-widest uppercase">
                    HI, I'M
                  </span>
                </div>
                <h1
                  className="text-[36px] sm:text-[52px] md:text-[80px] leading-tight text-[#D9D3C7] tracking-wider uppercase font-bold"
                  style={{ fontFamily: '"BBH Bartle", "Bebas Neue", sans-serif' }}
                >
                  Priyank
                </h1>
              </div>

              <h2
                className="text-[clamp(30px,3.8vw,60px)] uppercase text-[#D9D3C7] tracking-wider relative z-10 text-left leading-none font-bold"
                style={{ fontFamily: '"Bebas Neue", sans-serif' }}
              >
                BUILDING SYSTEMS FOR
                <br />
                <span
                  className="relative inline-block overflow-hidden min-w-[15ch] h-[1.15em] align-bottom text-center bg-[#D9D3C7] px-3 rounded-sm mt-3"
                >
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={dynamicWordIndex}
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: "-100%", opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.32, 0.94, 0.6, 1] }}
                      className="text-primary font-bold absolute left-0 right-0 bottom-0 text-center whitespace-nowrap"
                      style={{ fontFamily: '"Bebas Neue", sans-serif' }}
                    >
                      {words[dynamicWordIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </h2>

              <p className="font-body-md text-body-md text-[#D9D3C7]/90 max-w-xl border-l-2 border-primary pl-4 relative z-10 text-left text-[15px] sm:text-[17px] leading-relaxed">
                Full-stack thinking. Backend obsession. From raw APIs to
                distributed systems — <span className="whitespace-nowrap">I build</span> what holds
                everything together.
              </p>

              <div className="flex flex-row flex-wrap gap-3 sm:gap-4 mt-4 sm:mt-6 relative z-10 justify-start w-full">
                {/* GitHub */}
                <a
                  href="https://github.com/Priyankm23"
                  target="_blank"
                  rel="noreferrer"
                  title="GitHub"
                  className="w-12 h-12 sm:w-14 sm:h-14 border border-1px border-[#D9D3C7] bg-transparent text-[#D9D3C7] flex items-center justify-center transition-all duration-150 cursor-pointer shadow-[3px_3px_0px_0px_rgba(217,211,199,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-[#D9D3C7] hover:text-[#1B1C1C]"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/in/priyank-moradiya"
                  target="_blank"
                  rel="noreferrer"
                  title="LinkedIn"
                  className="w-12 h-12 sm:w-14 sm:h-14 border border-1px border-[#D9D3C7] bg-transparent text-[#D9D3C7] flex items-center justify-center transition-all duration-150 cursor-pointer shadow-[3px_3px_0px_0px_rgba(217,211,199,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-[#D9D3C7] hover:text-[#1B1C1C]"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                {/* Email */}
                <a
                  href="mailto:priyankmoradiya41@gmail.com"
                  title="Email"
                  className="w-12 h-12 sm:w-14 sm:h-14 border border-1px border-[#D9D3C7] bg-transparent text-[#D9D3C7] flex items-center justify-center transition-all duration-150 cursor-pointer shadow-[3px_3px_0px_0px_rgba(217,211,199,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-[#D9D3C7] hover:text-[#1B1C1C]"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M2 7l10 7 10-7" />
                  </svg>
                </a>
                {/* Resume Download */}
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  title="Download Resume"
                  className="h-12 sm:h-14 px-4 sm:px-5 border border-1px border-[#D9D3C7] bg-transparent text-[#b02600] flex items-center gap-2 font-mono-code font-extrabold text-[12px] sm:text-[14px] uppercase tracking-wider transition-all duration-150 cursor-pointer shadow-[3px_3px_0px_0px_rgba(217,211,199,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-[#b02600] hover:text-white hover:border-[#b02600]"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>RESUME</span>
                </a>
              </div>
            </div>

            {/* Right Column: Hero Portrait Image */}
            <div className="md:col-span-4 flex justify-center md:justify-center items-center relative z-20 w-full mt-6 md:mt-0 animate-reveal">
              <div className="relative isolate z-20 w-full max-w-[260px] sm:max-w-[300px] md:max-w-[390px] lg:max-w-[440px] aspect-[4/5] overflow-hidden shadow-[5px_5px_0px_0px_rgba(217,211,199,0.15)] bg-[#D9D3C7] md:-translate-x-6">
                <img
                  src="/full_portrait1.png"
                  alt="Priyank Moradiya - Hero Portrait"
                  className="w-full h-full object-cover filter contrast-[1.02] brightness-[0.98] relative z-10"
                />
              </div>
            </div>
          </div>
        </section>

        {/* About Section 01 - Custom Bento Grid */}
        <AboutSection3 visitorCount={visitorCount} />

        {/* Projects Section 02 - Coverflow Carousel */}
        <section
          id="projects"
          className="relative px-margin-mobile md:px-margin-desktop pt-20 pb-20 md:pt-28 md:pb-28 z-10 bg-[#0a0a0a] text-zinc-100"
        >
          {/* Lined Grid Overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none hidden md:grid md:grid-cols-12 gap-0 border-r border-1px border-[#222222] opacity-10 z-0"
          >
            <div className="border-l border-1px border-on-surface h-full"></div>
            <div className="border-l border-1px border-on-surface h-full"></div>
            <div className="border-l border-1px border-on-surface h-full"></div>
            <div className="border-l border-1px border-on-surface h-full hidden md:block"></div>
            <div className="border-l border-1px border-on-surface h-full hidden md:block"></div>
            <div className="border-l border-1px border-on-surface h-full hidden md:block"></div>
            <div className="border-l border-1px border-on-surface h-full hidden md:block"></div>
            <div className="border-l border-1px border-on-surface h-full hidden md:block"></div>
            <div className="border-l border-1px border-on-surface h-full hidden md:block"></div>
            <div className="border-l border-1px border-on-surface h-full hidden md:block"></div>
            <div className="border-l border-1px border-on-surface h-full hidden md:block"></div>
            <div className="border-l border-1px border-on-surface h-full hidden md:block"></div>
          </div>

          <div className="max-w-7xl mx-auto w-full relative z-10 mt-6">
            <div className="flex items-center gap-2 mb-2">
              <PixelDiamond className="size-3.5 text-primary" />
              <span className="text-xs font-semibold tracking-widest text-zinc-400 font-sans uppercase">
                PROJECTS
              </span>
            </div>
            <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-[54px] !leading-[110%] font-bold text-zinc-100 uppercase tracking-wide relative z-10">
              <span className="relative inline-block">
                FEATURED <span className="font-redaction italic text-primary font-normal">BUILDS</span>
                <motion.span
                  className="absolute left-[-4px] -bottom-1 h-[1.5px] bg-[#b02600]"
                  initial={{ width: 0 }}
                  whileInView={{ width: "calc(100% + 8px)" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
                />
              </span>
            </h2>
            <div className="h-px w-full bg-[#222222] my-4 relative z-10"></div>
            <p className="font-sans text-[#D9D3C7]/80 text-sm sm:text-base leading-relaxed max-w-xl mb-12 relative z-10">
              A curated collection of backend systems, distributed architectures, and developer tools built with a focus on performance, reliability, and optimization.
            </p>

            {/* Coverflow Carousel */}
            <div className="w-full mt-8">
              <CoverflowCarousel
                slides={projects.map((project) => ({
                  src: project.screenshot || project.image || "",
                  alt: project.title,
                  title: project.title,
                  subtitle: project.description,
                  meta: [
                    { label: "Timeline", value: project.dates },
                    { label: "Tech Stack", value: project.tech },
                  ],
                  tags: project.tags,
                  githubUrl: project.githubUrl,
                  liveUrl: project.liveUrl,
                }))}
                showCaption={true}
                showPagination={true}
                showNavigation={true}
                loop={true}
              />
            </div>
          </div>
        </section>

        {/* Unified Technical Stack & Commit Activity Dashboard */}
        <section
          id="stack"
          className="relative px-margin-mobile md:px-margin-desktop pt-24 pb-16 md:pt-36 md:pb-24 z-10 bg-[#0a0a0a] text-zinc-100 overflow-hidden isolate"
        >
          {/* Hoplite ASCII Art Texture Layer */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 bg-[url(/landing/pricing-band-dark.webp)] bg-cover bg-center opacity-100 mix-blend-screen contrast-150 brightness-125 [mask-image:linear-gradient(to_bottom,transparent_0%,black_5%,black_95%,transparent_100%)]"
          />

          <div className="max-w-7xl mx-auto w-full relative z-10">
            {/* 50 / 50 Responsive Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-stretch">
              
              {/* Left Column (50%): Tools I Trust */}
              <div className="flex flex-col gap-6 w-full h-full justify-between">
                <div className="flex flex-col justify-start">
                  <div className="h-6 flex items-center gap-2 mb-2">
                    <PixelCrosshair className="size-3.5 text-primary" />
                    <span className="text-xs font-semibold tracking-widest text-zinc-400 font-sans uppercase">
                      TECH STACK
                    </span>
                  </div>
                  <h2 className="font-sans text-2xl sm:text-3xl md:text-4xl lg:text-[42px] !leading-[110%] font-bold text-zinc-100 uppercase tracking-wide relative min-h-[52px] flex items-center">
                    <span className="relative inline-block">
                      TOOLS I <span className="font-redaction italic text-primary font-normal">WORK WITH</span>
                      <motion.span
                        className="absolute left-[-4px] -bottom-1 h-[1.5px] bg-[#b02600]"
                        initial={{ width: 0 }}
                        whileInView={{ width: "calc(100% + 8px)" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
                      />
                    </span>
                  </h2>
                  <div className="h-px w-full bg-[#222222] my-4"></div>
                  <p className="font-sans text-[#D9D3C7]/80 text-sm sm:text-base leading-relaxed min-h-[48px]">
                    Technologies and developer tools I use to design, benchmark, and deploy reliable backend architectures.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:gap-3.5 w-full flex-1 justify-between">
                  {techStack.map((cat, catIdx) => (
                    <motion.div
                      key={catIdx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 14,
                        delay: catIdx * 0.1,
                      }}
                      className="w-full"
                    >
                      <TechStackCard
                        title={cat.category}
                        icon={cat.icon}
                        techStack={cat.items.map((item) => ({
                          name: item.name,
                          slug: item.slug,
                          fallback: item.fallback,
                        }))}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right Column (50%): GitHub Commit History */}
              <div id="contributions" className="flex flex-col gap-6 w-full h-full justify-between">
                <div className="flex flex-col justify-start">
                  <div className="h-6 flex items-center gap-2 mb-2">
                    <PixelChecker className="size-3.5 text-primary" />
                    <span className="text-xs font-semibold tracking-widest text-zinc-400 font-sans uppercase">
                      ACTIVITY
                    </span>
                  </div>
                  <h2 className="font-sans text-2xl sm:text-3xl md:text-4xl lg:text-[42px] !leading-[110%] font-bold text-zinc-100 uppercase tracking-wide relative min-h-[52px] flex items-center">
                    <span className="relative inline-block">
                      COMMIT <span className="font-redaction italic text-primary font-normal">HISTORY</span>
                      <span className="text-primary ml-1 blink">_</span>
                      <motion.span
                        className="absolute left-[-4px] -bottom-1 h-[1.5px] bg-[#b02600]"
                        initial={{ width: 0 }}
                        whileInView={{ width: "calc(100% + 8px)" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
                      />
                    </span>
                  </h2>
                  <div className="h-px w-full bg-[#222222] my-4"></div>
                  <p className="font-sans text-[#D9D3C7]/80 text-sm sm:text-base leading-relaxed min-h-[48px]">
                    Tracking daily commits, open-source pull requests, and repository activity.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:gap-3.5 w-full flex-1 justify-between">
                  {/* Git Activity Card (Desktop: Twin Vertical Columns | Mobile: Horizontal Matrix) */}
                  <div className="rounded-lg border border-white/10 bg-[#111111]/80 backdrop-blur-xs p-5 sm:p-6 shadow-xl">
                  {/* --- DESKTOP VIEW (sm: and up): Side-by-side Metrics (Left) & Twin Vertical Columns (Right) --- */}
                  <div className="hidden sm:grid sm:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Sub-Column (sm:col-span-4): Vertical Metrics + Legend + Button */}
                    <div className="sm:col-span-4 flex flex-col justify-between h-full gap-6 sm:border-r border-white/10 sm:pr-5">
                      {/* Vertical Metrics */}
                      <div className="flex flex-col gap-5 sm:gap-6">
                        <div className="flex flex-col">
                          <span className="font-syncopate text-2xl sm:text-3xl lg:text-[32px] font-normal text-primary leading-none tracking-wider">
                            {githubCommits}
                          </span>
                          <span className="font-label-sm text-[#D9D3C7] text-xs sm:text-[13px] font-semibold uppercase tracking-widest mt-1.5">
                            COMMITS
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="font-syncopate text-2xl sm:text-3xl lg:text-[32px] font-normal text-primary leading-none tracking-wider">
                            {githubRepos}
                          </span>
                          <span className="font-label-sm text-[#D9D3C7] text-xs sm:text-[13px] font-semibold uppercase tracking-widest mt-1.5">
                            REPOS
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="font-syncopate text-2xl sm:text-3xl lg:text-[32px] font-normal text-primary leading-none tracking-wider">
                            {githubPRs < 10 ? `0${githubPRs}` : githubPRs}
                          </span>
                          <span className="font-label-sm text-[#D9D3C7] text-xs sm:text-[13px] font-semibold uppercase tracking-widest mt-1.5">
                            PRs
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="font-syncopate text-2xl sm:text-3xl lg:text-[32px] font-normal text-primary leading-none tracking-wider">
                            {githubStreak < 10 ? `0${githubStreak}` : githubStreak}
                          </span>
                          <span className="font-label-sm text-[#D9D3C7] text-xs sm:text-[13px] font-semibold uppercase tracking-widest mt-1.5">
                            STREAK
                          </span>
                        </div>
                      </div>

                      {/* Legend + View Full Log Button on Left */}
                      <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
                          <span>Less</span>
                          <span className="w-2.5 h-2.5 rounded-[1px] bg-[rgba(217,211,199,0.08)] inline-block" />
                          <span className="w-2.5 h-2.5 rounded-[1px] bg-[rgba(217,211,199,0.25)] inline-block" />
                          <span className="w-2.5 h-2.5 rounded-[1px] bg-[rgba(217,211,199,0.5)] inline-block" />
                          <span className="w-2.5 h-2.5 rounded-[1px] bg-[rgba(217,211,199,0.75)] inline-block" />
                          <span className="w-2.5 h-2.5 rounded-[1px] bg-[#D9D3C7] inline-block" />
                          <span>More</span>
                        </div>

                        <a
                          className="inline-flex items-center gap-1.5 border border-[#D9D3C7] px-4 py-2 text-[#D9D3C7] font-label-sm text-xs hover:bg-primary hover:text-white hover:border-primary transition-colors duration-200 uppercase cursor-pointer w-fit font-semibold"
                          href="https://github.com/Priyankm23"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            open_in_new
                          </span>
                          <span>VIEW FULL LOG</span>
                        </a>
                      </div>
                    </div>

                    {/* Right Sub-Column (sm:col-span-8): Twin Vertical Columns Side-by-Side */}
                    <div className="sm:col-span-8 flex flex-col sm:flex-row gap-5 sm:gap-6 items-start w-full pl-0 sm:pl-3">
                      {/* Column 1: First Half (~Jan – Jun) */}
                      <div className="flex flex-col items-start w-full sm:w-1/2">
                        {/* Days Header Across Top */}
                        <div className="flex items-center gap-[3px] pl-7 sm:pl-8 mb-1.5 pb-1 border-b border-white/5 select-none w-fit">
                          {["S", "M", "T", "W", "T", "F", "S"].map((dayName, dIdx) => (
                            <div
                              key={dIdx}
                              className="w-3 sm:w-3.5 text-center text-[9px] sm:text-[10px] font-mono font-semibold text-zinc-400"
                            >
                              {dayName}
                            </div>
                          ))}
                        </div>

                        {/* First Half Weeks Matrix */}
                        <div className="flex flex-col gap-[3px] w-full">
                          {weeks.slice(0, Math.ceil(weeks.length / 2)).map((week, weekIdx, arr) => {
                            if (week.length === 0) return null;
                            const dateParts = week[0].date.split("-").map(Number);
                            const month = dateParts[1] - 1;

                            const isFirstWeekOfMonth =
                              weekIdx === 0 ||
                              arr[weekIdx - 1][0].date.split("-").map(Number)[1] - 1 !== month;

                            return (
                              <div key={weekIdx} className="flex items-center gap-1.5">
                                {/* Month Label on Left */}
                                <div className="w-5.5 sm:w-6 text-right text-[8px] sm:text-[9.5px] font-mono font-semibold text-zinc-400 select-none pr-0.5 uppercase leading-none">
                                  {isFirstWeekOfMonth ? monthNames[month] : ""}
                                </div>

                                {/* 7 Day Matrix Cells */}
                                <div className="flex gap-[3px]">
                                  {week.map((day, dayIdx) => (
                                    <div
                                      key={dayIdx}
                                      title={`${day.date}: ${day.count} commits`}
                                      className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[1.5px] transition-transform duration-100 hover:scale-150 hover:z-20 cursor-pointer"
                                      style={{
                                        backgroundColor: day.isPlaceholder
                                          ? "transparent"
                                          : day.level === 4
                                          ? "#D9D3C7"
                                          : day.level === 3
                                          ? "rgba(217, 211, 199, 0.75)"
                                          : day.level === 2
                                          ? "rgba(217, 211, 199, 0.5)"
                                          : day.level === 1
                                          ? "rgba(217, 211, 199, 0.25)"
                                          : "rgba(217, 211, 199, 0.08)",
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Column 2: Second Half (~Jul – Dec) */}
                      <div className="flex flex-col items-start w-full sm:w-1/2">
                        {/* Days Header Across Top */}
                        <div className="flex items-center gap-[3px] pl-7 sm:pl-8 mb-1.5 pb-1 border-b border-white/5 select-none w-fit">
                          {["S", "M", "T", "W", "T", "F", "S"].map((dayName, dIdx) => (
                            <div
                              key={dIdx}
                              className="w-3 sm:w-3.5 text-center text-[9px] sm:text-[10px] font-mono font-semibold text-zinc-400"
                            >
                              {dayName}
                            </div>
                          ))}
                        </div>

                        {/* Second Half Weeks Matrix */}
                        <div className="flex flex-col gap-[3px] w-full">
                          {weeks.slice(Math.ceil(weeks.length / 2)).map((week, weekIdx, arr) => {
                            if (week.length === 0) return null;
                            const dateParts = week[0].date.split("-").map(Number);
                            const month = dateParts[1] - 1;

                            const isFirstWeekOfMonth =
                              weekIdx === 0 ||
                              arr[weekIdx - 1][0].date.split("-").map(Number)[1] - 1 !== month;

                            return (
                              <div key={weekIdx} className="flex items-center gap-1.5">
                                {/* Month Label on Left */}
                                <div className="w-5.5 sm:w-6 text-right text-[8px] sm:text-[9.5px] font-mono font-semibold text-zinc-400 select-none pr-0.5 uppercase leading-none">
                                  {isFirstWeekOfMonth ? monthNames[month] : ""}
                                </div>

                                {/* 7 Day Matrix Cells */}
                                <div className="flex gap-[3px]">
                                  {week.map((day, dayIdx) => (
                                    <div
                                      key={dayIdx}
                                      title={`${day.date}: ${day.count} commits`}
                                      className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[1.5px] transition-transform duration-100 hover:scale-150 hover:z-20 cursor-pointer"
                                      style={{
                                        backgroundColor: day.isPlaceholder
                                          ? "transparent"
                                          : day.level === 4
                                          ? "#D9D3C7"
                                          : day.level === 3
                                          ? "rgba(217, 211, 199, 0.75)"
                                          : day.level === 2
                                          ? "rgba(217, 211, 199, 0.5)"
                                          : day.level === 1
                                          ? "rgba(217, 211, 199, 0.25)"
                                          : "rgba(217, 211, 199, 0.08)",
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* --- MOBILE VIEW (< sm): Horizontal Matrix Layout --- */}
                  <div className="block sm:hidden flex flex-col gap-5">
                    {/* Metrics 2x2 Grid */}
                    <div className="grid grid-cols-2 gap-4 border-b border-white/10 pb-4">
                      <div className="flex flex-col">
                        <span className="font-syncopate text-2xl font-normal text-primary leading-tight tracking-wider">
                          {githubCommits}
                        </span>
                        <span className="font-label-sm text-[#D9D3C7] text-[10px] uppercase tracking-wider mt-0.5">
                          COMMITS
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="font-syncopate text-2xl font-normal text-primary leading-tight tracking-wider">
                          {githubRepos}
                        </span>
                        <span className="font-label-sm text-[#D9D3C7] text-[10px] uppercase tracking-wider mt-0.5">
                          REPOS
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="font-syncopate text-2xl font-normal text-primary leading-tight tracking-wider">
                          {githubPRs < 10 ? `0${githubPRs}` : githubPRs}
                        </span>
                        <span className="font-label-sm text-[#D9D3C7] text-[10px] uppercase tracking-wider mt-0.5">
                          PRs
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="font-syncopate text-2xl font-normal text-primary leading-tight tracking-wider">
                          {githubStreak < 10 ? `0${githubStreak}` : githubStreak}
                        </span>
                        <span className="font-label-sm text-[#D9D3C7] text-[10px] uppercase tracking-wider mt-0.5">
                          STREAK
                        </span>
                      </div>
                    </div>

                    {/* Horizontal Scrolling Heatmap */}
                    <div className="w-full overflow-x-auto pb-2">
                      <div className="flex gap-2 w-max">
                        {/* Weekdays Column */}
                        <div className="flex flex-col gap-[4px] mt-[20px] select-none text-left">
                          <div className="h-3 w-4 text-[8px] text-zinc-500 font-mono"></div>
                          <div className="h-3 w-4 text-[8px] text-zinc-400 font-mono leading-none">Mon</div>
                          <div className="h-3 w-4 text-[8px] text-zinc-500 font-mono"></div>
                          <div className="h-3 w-4 text-[8px] text-zinc-400 font-mono leading-none">Wed</div>
                          <div className="h-3 w-4 text-[8px] text-zinc-500 font-mono"></div>
                          <div className="h-3 w-4 text-[8px] text-zinc-400 font-mono leading-none">Fri</div>
                          <div className="h-3 w-4 text-[8px] text-zinc-500 font-mono"></div>
                        </div>

                        <div className="flex flex-col">
                          {/* Months Header */}
                          <div className="flex gap-[4px] h-4 select-none text-left mb-1">
                            {weeks.map((week, weekIdx) => {
                              if (week.length === 0) return null;
                              const dateParts = week[0].date.split("-").map(Number);
                              const year = dateParts[0];
                              const month = dateParts[1] - 1;
                              const targetYear = parseDate(githubDays[githubDays.length - 1].date).getFullYear();
                              const isFirstWeekOfMonth =
                                (weekIdx === 0 || weeks[weekIdx - 1][0].date.split("-").map(Number)[1] - 1 !== month) &&
                                year === targetYear;

                              return (
                                <div key={weekIdx} className="w-3 text-[9px] font-mono text-zinc-400 relative uppercase">
                                  {isFirstWeekOfMonth && (
                                    <span className="absolute left-0 bottom-0 whitespace-nowrap">
                                      {monthNames[month]}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Matrix Cells */}
                          <div className="flex gap-[4px]">
                            {weeks.map((week, weekIdx) => (
                              <div key={weekIdx} className="flex flex-col gap-[4px]">
                                {week.map((day, dayIdx) => (
                                  <div
                                    key={dayIdx}
                                    title={`${day.date}: ${day.count} commits`}
                                    className="w-3 h-3 rounded-[1px] transition-transform duration-100"
                                    style={{
                                      backgroundColor: day.isPlaceholder
                                        ? "transparent"
                                        : day.level === 4
                                        ? "#D9D3C7"
                                        : day.level === 3
                                        ? "rgba(217, 211, 199, 0.75)"
                                        : day.level === 2
                                        ? "rgba(217, 211, 199, 0.5)"
                                        : day.level === 1
                                        ? "rgba(217, 211, 199, 0.25)"
                                        : "rgba(217, 211, 199, 0.08)",
                                    }}
                                  />
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Legend & View Full Log Row */}
                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10 w-full">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
                        <span>Less</span>
                        <span className="w-2 h-2 rounded-[1px] bg-[rgba(217,211,199,0.08)] inline-block" />
                        <span className="w-2 h-2 rounded-[1px] bg-[rgba(217,211,199,0.25)] inline-block" />
                        <span className="w-2 h-2 rounded-[1px] bg-[rgba(217,211,199,0.5)] inline-block" />
                        <span className="w-2 h-2 rounded-[1px] bg-[rgba(217,211,199,0.75)] inline-block" />
                        <span className="w-2 h-2 rounded-[1px] bg-[#D9D3C7] inline-block" />
                        <span>More</span>
                      </div>

                      <a
                        className="inline-flex items-center gap-1.5 border border-[#D9D3C7] px-3.5 py-1.5 text-[#D9D3C7] font-label-sm text-[11px] hover:bg-primary hover:text-white hover:border-primary transition-colors duration-200 uppercase cursor-pointer"
                        href="https://github.com/Priyankm23"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          open_in_new
                        </span>
                        <span>VIEW FULL LOG</span>
                      </a>
                      </div>
                    </div>
                  </div>

                  {/* Lightweight Open Source Card - perfectly leveling the columns */}
                  <div className="rounded-lg border border-white/10 bg-[#111111]/80 backdrop-blur-xs p-4 sm:p-5 flex flex-col justify-center gap-2 shadow-lg transition-colors hover:border-[#b02600]/40">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4 text-primary shrink-0">
                        <circle cx="18" cy="18" r="3" />
                        <circle cx="6" cy="6" r="3" />
                        <path d="M13 6h3a2 2 0 0 1 2 2v7" />
                        <line x1="6" y1="9" x2="6" y2="21" />
                      </svg>
                      <span className="font-semibold text-xs tracking-wider uppercase text-zinc-200 leading-none">
                        OPEN SOURCE
                      </span>
                    </div>
                    <p className="text-[13px] sm:text-[14px] text-[#D9D3C7]/90 font-sans leading-relaxed">
                      Actively working on open-source contributions — currently working on <strong className="text-zinc-100 font-semibold">BullMQ</strong>.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section 05: Experience - Timeline */}
        <section
          id="experience"
          className="relative px-margin-mobile md:px-margin-desktop py-16 z-10 bg-[#0a0a0a] text-zinc-100"
        >
          <div className="max-w-7xl mx-auto w-full relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mt-16 relative z-10">
              {/* Heading */}
              <div className="md:col-span-4 mb-10 md:mb-0 relative md:sticky md:top-24 md:h-fit">
                <div className="flex items-center gap-2 mb-2">
                  <PixelDiamond className="size-3.5 text-primary" />
                  <span className="text-xs font-semibold tracking-widest text-zinc-400 font-sans uppercase">
                    EXPERIENCE
                  </span>
                </div>
                <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-[54px] !leading-[110%] font-bold text-zinc-100 uppercase tracking-wide relative">
                  <span className="relative inline-block">
                    WHERE I'VE <span className="font-redaction italic text-primary font-normal">WORKED</span>
                    <motion.span
                      className="absolute left-[-4px] -bottom-1 h-[1.5px] bg-[#b02600]"
                      initial={{ width: 0 }}
                      whileInView={{ width: "calc(100% + 8px)" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
                    />
                  </span>
                </h2>
                <div className="h-px w-full bg-[#222222] my-4"></div>
                <p className="font-sans text-[#D9D3C7]/80 text-sm sm:text-base leading-relaxed max-w-sm">
                  Backend developer internships focusing on building services, database optimizations, and distributed APIs.
                </p>

                {/* Ambient Video Player Container - Borderless & Desktop Only */}
                <div className="hidden md:block mt-6 overflow-hidden aspect-[2.4/1] w-full max-w-sm relative bg-[#0a0a0a]">
                  <video
                    src="/video2.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Stacked Cards Container */}
              <div className="md:col-span-8 relative">
                <ContainerScroll className="min-h-[135vh] space-y-10 pt-0 pb-4">
                  {/* Job 1: Prelax Infotech */}
                  <CardSticky
                    index={0}
                    incrementY={40}
                    incrementZ={8}
                    topOffset={96}
                    className="w-full rounded-lg border border-white/10 bg-[#111111]/90 backdrop-blur-md p-6 sm:p-7 shadow-2xl transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 border-b border-white/10 pb-4 mb-5">
                      <div>
                        <div className="inline-block bg-[#D9D3C7] text-[#0a0a0a] px-2.5 py-0.5 font-sans text-[11px] font-bold uppercase tracking-wider mb-2 rounded-sm">
                          MICROSERVICES & DISTRIBUTED SYSTEMS
                        </div>
                        <h3 className="font-sans text-[20px] sm:text-[24px] leading-tight text-zinc-100 font-bold uppercase tracking-wide">
                          BACKEND DEVELOPER INTERN
                        </h3>
                        <div className="font-sans text-primary font-bold uppercase text-[14px] md:text-[15px] tracking-wider mt-1 flex items-center gap-2">
                          PRELAX INFOTECH
                        </div>
                      </div>
                      <div className="font-sans text-zinc-300 font-semibold text-[12px] md:text-[13px] bg-white/5 border border-white/10 px-3 py-1.5 inline-block w-max rounded-md tracking-wider shadow-xs">
                        MAY 2026 — JUN 2026
                      </div>
                    </div>

                    {/* Location */}
                    <div className="font-sans text-[#D9D3C7]/90 text-[13px] md:text-[14px] font-semibold flex items-center gap-2 mb-4">
                      <span className="material-symbols-outlined text-[16px] text-[#D9D3C7]/60">
                        location_on
                      </span>
                      Surat, Gujarat, India · On-Site
                    </div>

                    {/* Content List */}
                    <ul className="font-sans text-[#D9D3C7]/90 text-[15px] md:text-[16px] space-y-3 leading-relaxed font-normal">
                      <li className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span>
                          Architected a microservices backend with{" "}
                          <ExperienceHighlight>
                            8–10 Node.js/Express services
                          </ExperienceHighlight>
                          , each operating on an isolated PostgreSQL database instance.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span>
                          Engineered synchronous inter-service RPC calls using gRPC & API Gateway, with RabbitMQ topic exchanges for asynchronous event-driven logging.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span>
                          Eliminated{" "}
                          <ExperienceHighlight>
                            N+1 query bottlenecks
                          </ExperienceHighlight>{" "}
                          on job browsing endpoints using Redis caching, sustaining throughput of{" "}
                          <ExperienceHighlight>
                            400–600 RPS
                          </ExperienceHighlight>{" "}
                          under load tests with Autocannon.
                        </span>
                      </li>
                    </ul>

                  </CardSticky>

                  {/* Job 2: Infosys Springboard */}
                  <CardSticky
                    index={1}
                    incrementY={40}
                    incrementZ={8}
                    topOffset={96}
                    className="w-full rounded-lg border border-white/10 bg-[#111111]/90 backdrop-blur-md p-6 sm:p-7 shadow-2xl transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 border-b border-white/10 pb-4 mb-5">
                      <div>
                        <div className="inline-block bg-[#D9D3C7] text-[#0a0a0a] px-2.5 py-0.5 font-sans text-[11px] font-bold uppercase tracking-wider mb-2 rounded-sm">
                          DATA PIPELINES & PREDICTIVE APIS
                        </div>
                        <h3 className="font-sans text-[20px] sm:text-[24px] leading-tight text-zinc-100 font-bold uppercase tracking-wide">
                          PYTHON BACKEND INTERN
                        </h3>
                        <div className="font-sans text-primary font-bold uppercase text-[14px] md:text-[15px] tracking-wider mt-1 flex items-center gap-2">
                          INFOSYS SPRINGBOARD
                        </div>
                      </div>
                      <div className="font-sans text-zinc-300 font-semibold text-[12px] md:text-[13px] bg-white/5 border border-white/10 px-3 py-1.5 inline-block w-max rounded-md tracking-wider shadow-xs">
                        AUG 2025 — OCT 2025
                      </div>
                    </div>

                    {/* Location */}
                    <div className="font-sans text-[#D9D3C7]/90 text-[13px] md:text-[14px] font-semibold flex items-center gap-2 mb-4">
                      <span className="material-symbols-outlined text-[16px] text-[#D9D3C7]/60">
                        location_on
                      </span>
                      Remote · Anand, Gujarat, India
                    </div>

                    {/* Content List */}
                    <ul className="font-sans text-[#D9D3C7]/90 text-[15px] md:text-[16px] space-y-3 leading-relaxed font-normal">
                      <li className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span>
                          Collaborated in a 25+ member Agile/Scrum team across 4 sprints, managing automated testing suites and API documentation.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span>
                          Built a time-series{" "}
                          <ExperienceHighlight>
                            crypto pipeline
                          </ExperienceHighlight>{" "}
                          using SQLite, Pandas & NumPy with{" "}
                          <ExperienceHighlight>
                            Ridge Regression
                          </ExperienceHighlight>{" "}
                          return prediction models.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span>
                          Integrated{" "}
                          <ExperienceHighlight>
                            stress testing
                          </ExperienceHighlight>{" "}
                          across market volatility scenarios, exposing endpoints via FastAPI and an interactive Streamlit dashboard.
                        </span>
                      </li>
                    </ul>

                    {/* Certificate Verification Button */}
                    <div className="pt-4 flex justify-end">
                      <a
                        href="https://bit.ly/Priyank-InfosysCert"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 border border-white/10 bg-white/5 text-zinc-200 hover:bg-primary hover:text-white hover:border-primary transition-colors duration-200 px-4 py-2 font-sans text-[12px] font-bold uppercase cursor-pointer rounded-md shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          verified_user
                        </span>
                        VIEW VERIFIED CREDENTIAL{" "}
                        <span className="text-xs">→</span>
                      </a>
                    </div>
                  </CardSticky>
                </ContainerScroll>
              </div>
            </div>
          </div>
        </section>

        {/* Section 06: Connect & Footer — Joint closing section with panoramic ASCII backdrop */}
        <footer
          id="play"
          className="relative px-margin-mobile md:px-margin-desktop pt-20 pb-10 z-10 bg-[#0a0a0a] text-zinc-100 overflow-hidden isolate"
        >
          {/* Hoplite Panoramic Halftone Landscape Art spanning the entire joint section */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[url(/landing/temple-art-dark.webp)] bg-cover bg-[center_bottom] opacity-40 [mask-image:linear-gradient(to_bottom,transparent_0%,black_30%,black_100%)]"
          />

          {/* Prominent Corner Acropolis Temple Art - visible on mobile & desktop */}
          <img
            src="/landing/footer-acropolis.webp"
            loading="lazy"
            width={1048}
            height={646}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute right-[-10%] sm:right-0 bottom-0 -z-10 block h-[48%] sm:h-[75%] max-h-[440px] w-auto opacity-30 sm:opacity-35 invert object-contain object-right-bottom select-none [mask-image:linear-gradient(to_top,black_60%,transparent_100%)] sm:[mask-image:linear-gradient(to_left,black_65%,transparent)]"
          />

          <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col justify-between min-h-[460px]">
            {/* Top Row: Connect Heading & Social Actions */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mt-4">

              {/* Heading & Description */}
              <div className="flex flex-col justify-start max-w-lg">
                <div className="flex items-center gap-2 mb-2">
                  <PixelCrosshair className="size-3.5 text-primary" />
                  <span className="text-xs font-semibold tracking-widest text-zinc-400 font-sans uppercase">
                    CONTACT
                  </span>
                </div>
                <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-[54px] !leading-[110%] font-bold text-zinc-100 uppercase tracking-wide relative">
                  <span className="relative inline-block">
                    LET'S <span className="font-redaction italic text-primary font-normal">CONNECT</span>
                    <motion.span
                      className="absolute left-[-4px] -bottom-1 h-[1.5px] bg-[#b02600]"
                      initial={{ width: 0 }}
                      whileInView={{ width: "calc(100% + 8px)" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
                    />
                  </span>
                </h2>
                <div className="h-px w-full bg-[#222222] my-4"></div>
                <p className="font-sans text-[#D9D3C7]/80 text-sm sm:text-base leading-relaxed max-w-sm">
                  Have a question, a project idea, or just want to talk backend architecture? Reach out via email or any of these platforms — I respond within 24 hours.
                </p>
              </div>

              {/* Contact Links */}
              <div className="flex flex-col gap-5 items-start md:items-end">
                {/* Email */}
                <a
                  href="mailto:priyankmoradiya41@gmail.com"
                  className="font-sans text-xl sm:text-[22px] md:text-2xl font-bold text-[#D9D3C7] hover:text-primary transition-colors duration-200 w-fit"
                >
                  priyankmoradiya41@gmail.com
                </a>

                {/* Social Icons Row */}
                <div className="flex gap-4">
                  {/* GitHub */}
                  <a
                    href="https://github.com/Priyankm23"
                    target="_blank"
                    rel="noreferrer"
                    title="GitHub"
                    className="w-13 h-13 border border-[#2a2a2a] bg-[#151515]/90 backdrop-blur-xs text-[#D9D3C7] flex items-center justify-center transition-colors duration-200 cursor-pointer hover:bg-[#D9D3C7] hover:text-[#0a0a0a] hover:border-[#D9D3C7]"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  </a>
                  {/* LinkedIn */}
                  <a
                    href="https://linkedin.com/in/priyank-moradiya"
                    target="_blank"
                    rel="noreferrer"
                    title="LinkedIn"
                    className="w-13 h-13 border border-[#2a2a2a] bg-[#151515]/90 backdrop-blur-xs text-[#D9D3C7] flex items-center justify-center transition-colors duration-200 cursor-pointer hover:bg-[#D9D3C7] hover:text-[#0a0a0a] hover:border-[#D9D3C7]"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  {/* Twitter / X */}
                  <a
                    href="https://x.com/priyank_m_23"
                    target="_blank"
                    rel="noreferrer"
                    title="X (Twitter)"
                    className="w-13 h-13 border border-[#2a2a2a] bg-[#151515]/90 backdrop-blur-xs text-[#D9D3C7] flex items-center justify-center transition-colors duration-200 cursor-pointer hover:bg-[#D9D3C7] hover:text-[#0a0a0a] hover:border-[#D9D3C7]"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  {/* Email Icon */}
                  <a
                    href="mailto:priyankmoradiya41@gmail.com"
                    title="Email"
                    className="w-13 h-13 border border-[#2a2a2a] bg-[#151515]/90 backdrop-blur-xs text-[#D9D3C7] flex items-center justify-center transition-colors duration-200 cursor-pointer hover:bg-[#D9D3C7] hover:text-[#0a0a0a] hover:border-[#D9D3C7]"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M2 7l10 7 10-7" />
                    </svg>
                  </a>
                </div>

                {/* Portfolio Visits Counter */}
                <div className="flex items-center gap-1.5 text-xs font-sans font-semibold text-[#D9D3C7]/60 tracking-wider select-none mt-1">
                  <span className="text-primary font-bold text-sm leading-none">
                    {visitorCount !== null ? `${visitorCount}` : "1,200+"}
                  </span>
                  <span className="uppercase text-[10px] tracking-widest text-zinc-500">portfolio visits</span>
                </div>
              </div>

            </div>

            {/* Bottom Footer Credits Row */}
            <div className="mt-20 pt-8 border-t border-white/10 w-full flex flex-col sm:flex-row justify-between items-center gap-4 font-sans text-xs tracking-widest text-zinc-400 uppercase font-semibold">
              <div>
                THANKS FOR VISITING.
              </div>
              <div>
                © {new Date().getFullYear()} PRIYANK MORADIYA. ALL RIGHTS RESERVED.
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
