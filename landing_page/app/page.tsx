"use client";

import React, { useState, useEffect, useRef } from "react";
import { Terminal, Workflow } from "lucide-react";
import { fetchPortfolioApi } from "@/lib/api";
import { CoverflowCarousel } from "@/components/ui/coverflow-carousel";
import { AnimatedMetric } from "@/components/ui/animated-metric";
import { MenuHorizontal } from "@/components/ui/menu-horizontal";
import { NotificationList } from "@/components/ui/components-community-notification-list";
import { ContainerScroll, CardSticky } from "@/components/ui/cards-stack";
import AboutSection3 from "@/components/ui/about-section";
import { motion, AnimatePresence } from "motion/react";
import { ShaderBackground } from "@/components/ui/shader-background";
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
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
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

  // States and fetching for visitor count & contact form
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

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
            if (typeof data.repos === "number") {
              setGithubRepos(data.repos);
            }
            if (typeof data.prs === "number") {
              setGithubPRs(data.prs);
            }
            if (typeof data.streak === "number") {
              setGithubStreak(data.streak);
            }

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
        console.error("Error fetching GitHub contributions:", err);
      }

      // Fallback
      const mockDays = [];
      const today = new Date();
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      const diffTime = Math.abs(today.getTime() - startOfYear.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      for (let i = diffDays - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const dateStr = String(d.getDate()).padStart(2, "0");

        const rand = Math.random();
        let count = 0;
        if (rand > 0.9) count = 10;
        else if (rand > 0.75) count = 7;
        else if (rand > 0.5) count = 5;
        else if (rand > 0.3) count = 2;

        mockDays.push({
          date: `${y}-${m}-${dateStr}`,
          count: count,
          level: getLevel(count),
        });
      }
      setGithubDays(mockDays);
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

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setStatusMessage("");

    try {
      const apiBaseUrl = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      ).replace(/\/+$/, "");
      
      const response = await fetch(`${apiBaseUrl}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          message: contactMessage,
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
      } else {
        const errorData = await response.json().catch(() => ({}));
        setSubmitStatus("error");
        setStatusMessage(errorData.error || "Server returned an error status.");
      }
    } catch (err) {
      console.error("Error submitting contact form:", err);
      setSubmitStatus("error");
      setStatusMessage("Failed to reach connection server.");
    } finally {
      setIsSubmitting(false);
    }
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
      image: "/cadence_graphic.png",
      logoUrl: "/cadence_logo.png",
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
      image: "/markivo_graphic.png",
      logoUrl: "/markivo_logo.png",
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
      image: "/safetrail_graphic.png",
      logoUrl: "/safetrail_logo.png",
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
    <div className="bg-surface text-on-surface font-body-md antialiased pt-16 pb-0 min-h-screen">
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
      <main className="min-h-screen flex flex-col relative bg-surface">
        {/* Hero Section */}
        <section
          id="hero"
          className="relative pt-12 pb-12 md:py-8 flex flex-col justify-center items-center min-h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] z-10 text-[#D9D3C7] bg-[#0a0a0a] overflow-hidden"
        >
          {/* WebGL Shader Background */}
          <ShaderBackground className="absolute inset-0 z-0 pointer-events-none opacity-25" />

          {/* Bottom fade overlay for smooth section transition */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none z-10" />

          {/* Hero Content Container */}
          <div className="w-full max-w-full mx-auto px-8 md:px-20 lg:px-28 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-24 items-center relative z-10 h-full">
            {/* Left Column: Text Content */}
            <div className="md:col-span-8 flex flex-col items-start text-left gap-6 w-full md:pl-10">
              {/* Greeting + Name */}
              <div className="flex flex-col gap-2 items-start select-none">
                <span className="text-[18px] sm:text-[22px] md:text-[24px] text-zinc-400 font-sans font-medium tracking-widest uppercase">
                  HI, I'M
                </span>
                <h1
                  className="text-[38px] xs:text-[48px] sm:text-[68px] md:text-[80px] leading-tight text-[#D9D3C7] tracking-wider uppercase font-bold pr-4 md:pr-0"
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

              <div className="flex flex-row flex-wrap gap-4 mt-6 relative z-10 justify-start w-full">
                {/* GitHub */}
                <a
                  href="https://github.com/Priyankm23"
                  target="_blank"
                  rel="noreferrer"
                  title="GitHub"
                  className="w-14 h-14 border border-1px border-[#D9D3C7] bg-transparent text-[#D9D3C7] flex items-center justify-center transition-all duration-150 cursor-pointer shadow-[3px_3px_0px_0px_rgba(217,211,199,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-[#D9D3C7] hover:text-[#1B1C1C]"
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
                  className="w-14 h-14 border border-1px border-[#D9D3C7] bg-transparent text-[#D9D3C7] flex items-center justify-center transition-all duration-150 cursor-pointer shadow-[3px_3px_0px_0px_rgba(217,211,199,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-[#D9D3C7] hover:text-[#1B1C1C]"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                {/* Email */}
                <a
                  href="mailto:priyankmoradiya41@gmail.com"
                  title="Email"
                  className="w-14 h-14 border border-1px border-[#D9D3C7] bg-transparent text-[#D9D3C7] flex items-center justify-center transition-all duration-150 cursor-pointer shadow-[3px_3px_0px_0px_rgba(217,211,199,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-[#D9D3C7] hover:text-[#1B1C1C]"
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
                  className="h-14 px-5 border border-1px border-[#D9D3C7] bg-transparent text-[#b02600] flex items-center gap-2 font-mono-code font-extrabold text-[13px] sm:text-[14px] uppercase tracking-wider transition-all duration-150 cursor-pointer shadow-[3px_3px_0px_0px_rgba(217,211,199,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-[#b02600] hover:text-white hover:border-[#b02600]"
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
            <div className="md:col-span-4 flex justify-center md:justify-center items-center relative z-10 w-full mt-6 md:mt-0 animate-reveal">
              <div className="relative w-full max-w-[300px] sm:max-w-[340px] md:max-w-[390px] lg:max-w-[440px] aspect-[4/5] overflow-hidden shadow-[5px_5px_0px_0px_rgba(217,211,199,0.15)] bg-[#0a0a0a] md:-translate-x-6">
                <img
                  src="/full_portrait1.png"
                  alt="Priyank Moradiya - Hero Portrait"
                  className="w-full h-full object-cover filter contrast-[1.02] brightness-[0.98]"
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
          className="relative px-margin-mobile md:px-margin-desktop pt-8 pb-16 z-10 bg-[#0a0a0a] text-zinc-100"
        >
          {/* Lined Grid Overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none grid grid-cols-4 md:grid-cols-12 gap-0 border-r border-1px border-[#222222] opacity-10 z-0"
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
            <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-[54px] !leading-[110%] font-bold text-zinc-100 uppercase tracking-wide relative z-10">
              FEATURED BUILDS
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

        {/* Tech Stack Section 03 - Tools I Trust */}
        <section
          id="stack"
          className="relative px-margin-mobile md:px-margin-desktop pt-10 pb-16 z-10 bg-[#0a0a0a] text-zinc-100"
        >
          <div className="max-w-7xl mx-auto w-full relative z-10">
            <div className="relative z-10 mt-10">
              <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-[54px] !leading-[110%] font-bold text-zinc-100 uppercase tracking-wide">
                TOOLS I TRUST
              </h2>
              <div className="h-px w-full bg-[#222222] my-4"></div>
              <p className="font-sans text-[#D9D3C7]/80 text-sm sm:text-base leading-relaxed max-w-xl mb-12">
                A curated set of technologies and developer tools I use to design, build, and deploy backend architectures.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {techStack.map((cat, catIdx) => (
                  <motion.div
                    key={catIdx}
                    initial={{ opacity: 0, y: 45, scale: 0.97 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{
                      type: "spring",
                      stiffness: 110,
                      damping: 12,
                      mass: 1.1,
                      delay: catIdx * 0.15
                    }}
                    className="border border-[#2a2a2a] hover:border-[#D9D3C7] p-6 bg-[#151515] shadow-[4px_4px_0px_0px_rgba(217,211,199,0.1)] hover:shadow-[10px_10px_0px_0px_rgba(217,211,199,0.25)] transition-all duration-300 hover:-translate-y-2.5 text-[#D9D3C7] rounded-none flex flex-col justify-start relative overflow-hidden group"
                  >
                    {/* Background Icon Watermark */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
                      whileInView={{ opacity: 0.12, scale: 1, rotate: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{
                        type: "spring",
                        stiffness: 90,
                        damping: 14,
                        delay: catIdx * 0.15 + 0.25
                      }}
                      className="absolute right-[-10px] bottom-[-10px] pointer-events-none group-hover:opacity-[0.25] group-hover:scale-105 transition-all duration-300 z-0"
                    >
                      {cat.category === "Frameworks" && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-28 h-28 text-[#b02600]">
                          <polyline points="16 18 22 12 16 6" />
                          <polyline points="8 6 2 12 8 18" />
                        </svg>
                      )}
                      {cat.category === "Databases" && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-28 h-28 text-[#b02600]">
                          <ellipse cx="12" cy="5" rx="9" ry="3" />
                          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                          <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
                        </svg>
                      )}
                      {cat.category === "DevOps & Tools" && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-28 h-28 text-[#b02600]">
                          <polyline points="4 17 10 11 4 5" />
                          <line x1="12" y1="19" x2="20" y2="19" />
                        </svg>
                      )}
                    </motion.div>

                    <h3 className="font-mono-code text-[14px] sm:text-[15px] font-bold text-zinc-100 uppercase border-b border-[#D9D3C7]/20 pb-2 mb-4 tracking-wider relative z-10">
                      {cat.category}
                    </h3>
                    <div className={`relative z-10 ${cat.category === "DevOps & Tools" ? "grid grid-cols-2 gap-x-4 gap-y-3" : "flex flex-col gap-3"}`}>
                      {cat.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="group/stack flex items-center gap-3.5 py-1.5 text-[#D9D3C7] hover:text-[#FF3800] transition-colors duration-200 cursor-pointer"
                        >
                          <span className="text-[#D9D3C7]/60 group-hover/stack:text-[#FF3800] group-hover/stack:scale-110 group-hover/stack:rotate-[5deg] transition-all duration-200 flex items-center justify-center">
                            <BrandIcon
                              slug={item.slug}
                              fallback={item.fallback}
                            />
                          </span>
                          <span className="font-sans text-base sm:text-[17px] font-semibold tracking-wide group-hover/stack:translate-x-1 transition-transform duration-200">
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 04: GitHub Contributions */}
        <section
          id="contributions"
          className="bg-black text-white relative overflow-hidden px-margin-mobile md:px-margin-desktop py-8 z-10"
        >
          <div className="max-w-7xl mx-auto w-full relative z-10">
            <div className="relative z-10 flex flex-col md:grid md:grid-cols-12 gap-gutter mt-16">
              {/* Heading Area */}
              <div className="scroll-reveal-left md:col-span-3 mb-8 md:mb-0">
                <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-[54px] !leading-[110%] font-bold text-zinc-100 uppercase tracking-wide flex items-center drop-shadow-sm">
                  COMMIT HISTORY
                  <span className="text-primary ml-1 blink">_</span>
                </h2>
                <div className="h-px w-full bg-white/30 my-4"></div>
                <p className="font-sans text-[#D9D3C7]/80 text-sm sm:text-base leading-relaxed max-w-sm">
                  Tracking daily commits, open-source contributions, and repository activity.
                </p>
              </div>

              {/* Heatmap Area */}
              <div
                className="scroll-reveal-right md:col-span-8 md:col-start-5 flex flex-col gap-6"
                style={{ transitionDelay: "150ms" }}
              >
                {/* Stats Row */}
                <div className="flex flex-wrap gap-4 border-l border-white/40 pl-4">
                  <div className="flex flex-col">
                    <span className="font-headline-md text-primary">
                      {githubCommits}
                    </span>
                    <span className="font-label-sm text-[#D9D3C7] uppercase">
                      COMMITS
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="font-headline-md text-primary">
                      {githubRepos}
                    </span>
                    <span className="font-label-sm text-[#D9D3C7] uppercase">
                      REPOS
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="font-headline-md text-primary">
                      {githubPRs < 10 ? `0${githubPRs}` : githubPRs}
                    </span>
                    <span className="font-label-sm text-[#D9D3C7] uppercase">
                      PRs
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="font-headline-md text-primary">
                      {githubStreak < 10 ? `0${githubStreak}` : githubStreak}
                    </span>
                    <span className="font-label-sm text-[#D9D3C7] uppercase">
                      STREAK
                    </span>
                  </div>
                </div>

                {/* Heatmap Grid Wrapper */}
                <div className="w-full overflow-x-auto pb-2">
                  <div className="flex gap-2 w-max">
                  {/* Weekdays column */}
                  <div className="flex flex-col gap-[5px] mt-[25px] select-none text-left">
                    <div className="h-3.5 w-5 text-[9px] leading-3 text-secondary-fixed-dim font-mono"></div>{" "}
                    {/* Sun */}
                    <div className="h-3.5 w-5 text-[9px] leading-[14px] text-secondary-fixed-dim font-mono">
                      Mon
                    </div>{" "}
                    {/* Mon */}
                    <div className="h-3.5 w-5 text-[9px] leading-3 text-secondary-fixed-dim font-mono"></div>{" "}
                    {/* Tue */}
                    <div className="h-3.5 w-5 text-[9px] leading-[14px] text-secondary-fixed-dim font-mono">
                      Wed
                    </div>{" "}
                    {/* Wed */}
                    <div className="h-3.5 w-5 text-[9px] leading-3 text-secondary-fixed-dim font-mono"></div>{" "}
                    {/* Thu */}
                    <div className="h-3.5 w-5 text-[9px] leading-[14px] text-secondary-fixed-dim font-mono">
                      Fri
                    </div>{" "}
                    {/* Fri */}
                    <div className="h-3.5 w-5 text-[9px] leading-3 text-secondary-fixed-dim font-mono"></div>{" "}
                    {/* Sat */}
                  </div>

                  <div className="flex flex-col">
                    {/* Months header */}
                    <div className="flex gap-[5px] h-5 select-none text-left mb-1.5">
                      {weeks.map((week, weekIdx) => {
                        if (week.length === 0) return null;
                        const dateParts = week[0].date.split("-").map(Number);
                        const year = dateParts[0];
                        const month = dateParts[1] - 1;

                        const targetYear = parseDate(
                          githubDays[githubDays.length - 1].date,
                        ).getFullYear();

                        const isFirstWeekOfMonth =
                          (weekIdx === 0 ||
                            weeks[weekIdx - 1][0].date
                              .split("-")
                              .map(Number)[1] -
                              1 !==
                              month) &&
                          year === targetYear;

                        return (
                          <div
                            key={weekIdx}
                            className="w-3.5 text-[10px] font-mono text-secondary-fixed-dim relative uppercase"
                          >
                            {isFirstWeekOfMonth && (
                              <span className="absolute left-0 bottom-0 whitespace-nowrap">
                                {monthNames[month]}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Matrix cells */}
                    <div className="flex gap-[5px]">
                      {weeks.map((week, weekIdx) => (
                        <div key={weekIdx} className="flex flex-col gap-[5px]">
                          {week.map((day, dayIdx) => (
                            <div
                              key={dayIdx}
                              title={`${day.date}: ${day.count} commits`}
                              className="w-3.5 h-3.5 rounded-sm transition-all duration-100 hover:scale-[1.25] hover:z-20 cursor-pointer"
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
              </div>
            </div>
            <div className="flex justify-end w-full mt-6 pr-4">
              <a
                className="inline-flex items-center gap-2 border border-[#D9D3C7] px-4 py-2 w-max text-[#D9D3C7] font-label-sm hover:bg-primary hover:text-white hover:border-primary transition-colors duration-200 uppercase cursor-pointer"
                href="https://github.com/Priyankm23"
                target="_blank"
                rel="noreferrer"
              >
                <span className="material-symbols-outlined text-[16px]">
                  open_in_new
                </span>
                <span>VIEW FULL LOG</span>
              </a>
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
                <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-[54px] !leading-[110%] font-bold text-zinc-100 uppercase tracking-wide">
                  WHERE I'VE WORKED
                </h2>
                <div className="h-px w-full bg-[#222222] my-4"></div>
                <p className="font-sans text-[#D9D3C7]/80 text-sm sm:text-base leading-relaxed max-w-sm">
                  Backend developer internships focusing on building services, database optimizations, and distributed APIs.
                </p>

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
                    className="w-full bg-transparent backdrop-blur-sm border-b-2 border-[#D9D3C7] p-5 sm:p-6 rounded-none shadow-[4px_4px_0px_0px_rgba(217,211,199,0.15)] transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 border-b border-[#222222] pb-4 mb-4">
                      <div>
                        <div className="inline-block bg-[#D9D3C7] text-[#0a0a0a] px-2.5 py-0.5 font-sans text-[11px] font-bold uppercase tracking-wider mb-2 rounded-xs">
                          MICROSERVICES & DISTRIBUTED SYSTEMS
                        </div>
                        <h3 className="font-sans text-[20px] sm:text-[24px] leading-tight text-zinc-100 font-bold uppercase tracking-wide">
                          BACKEND DEVELOPER INTERN
                        </h3>
                        <div className="font-sans text-primary font-bold uppercase text-[14px] md:text-[15px] tracking-wider mt-1 flex items-center gap-2">
                          PRELAX INFOTECH
                        </div>
                      </div>
                      <div className="font-sans text-[#D9D3C7] font-semibold text-[12px] md:text-[13px] bg-[#222222] border border-[#2a2a2a] px-3 py-1.5 inline-block w-max rounded-xs tracking-wider shadow-xs">
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
                          Engineered synchronous inter-service RPC calls using{" "}
                          <ExperienceHighlight>
                            gRPC & API Gateway
                          </ExperienceHighlight>
                          , with RabbitMQ topic exchanges for asynchronous event-driven logging.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span>
                          Eliminated N+1 query bottlenecks on job browsing endpoints using{" "}
                          <ExperienceHighlight>
                            Redis caching
                          </ExperienceHighlight>
                          , sustaining throughput of{" "}
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
                    className="w-full bg-transparent backdrop-blur-sm border-b-2 border-[#D9D3C7] p-5 sm:p-6 rounded-none shadow-[4px_4px_0px_0px_rgba(217,211,199,0.15)] transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 border-b border-[#222222] pb-4 mb-4">
                      <div>
                        <div className="inline-block bg-[#D9D3C7] text-[#0a0a0a] px-2.5 py-0.5 font-sans text-[11px] font-bold uppercase tracking-wider mb-2 rounded-xs">
                          DATA PIPELINES & PREDICTIVE APIS
                        </div>
                        <h3 className="font-sans text-[20px] sm:text-[24px] leading-tight text-zinc-100 font-bold uppercase tracking-wide">
                          PYTHON BACKEND INTERN
                        </h3>
                        <div className="font-sans text-primary font-bold uppercase text-[14px] md:text-[15px] tracking-wider mt-1 flex items-center gap-2">
                          INFOSYS SPRINGBOARD
                        </div>
                      </div>
                      <div className="font-sans text-[#D9D3C7] font-semibold text-[12px] md:text-[13px] bg-[#222222] border border-[#2a2a2a] px-3 py-1.5 inline-block w-max rounded-xs tracking-wider shadow-xs">
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
                          Collaborated in a{" "}
                          <ExperienceHighlight>
                            25+ member Agile/Scrum team
                          </ExperienceHighlight>{" "}
                          across 4 sprints, managing automated testing suites and API documentation.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span>
                          Built a time-series crypto pipeline using{" "}
                          <ExperienceHighlight>
                            SQLite, Pandas & NumPy
                          </ExperienceHighlight>{" "}
                          with Ridge Regression return prediction models.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span>
                          Integrated stress testing across market volatility scenarios, exposing endpoints via{" "}
                          <ExperienceHighlight>
                            FastAPI
                          </ExperienceHighlight>{" "}
                          and an interactive Streamlit dashboard.
                        </span>
                      </li>
                    </ul>


                    {/* Certificate Verification Button */}
                    <div className="pt-4 flex justify-end">
                      <a
                        href="https://bit.ly/Priyank-InfosysCert"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 border border-[#2a2a2a] bg-[#222222] text-[#D9D3C7] hover:bg-[#b02600] hover:text-white hover:border-[#b02600] transition-colors duration-200 px-4 py-2 font-sans text-[12px] font-bold uppercase cursor-pointer rounded-xs shadow-xs"
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

        {/* Section 06: Contact Form - Tailored to match new dark/beige theme */}
        <section
          id="play"
          className="relative px-margin-mobile md:px-margin-desktop py-16 z-10 bg-[#0a0a0a] text-zinc-100"
        >
          <div className="max-w-7xl mx-auto w-full relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mt-8 relative z-10">
              
              {/* Left Column: Heading & Context */}
              <div className="md:col-span-5 mb-10 md:mb-0 flex flex-col justify-start">
                <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-[54px] !leading-[110%] font-bold text-zinc-100 uppercase tracking-wide">
                  LET'S CONNECT
                </h2>
                <div className="h-px w-full bg-[#222222] my-4"></div>
                <p className="font-sans text-[#D9D3C7]/80 text-sm sm:text-base leading-relaxed max-w-sm mb-4">
                  Have a question, a project proposal, or just want to talk backend architecture and distributed systems? Drop a line and I'll get back to you shortly.
                </p>

                <a
                  href="mailto:priyankmoradiya41@gmail.com"
                  className="font-sans text-base sm:text-[17px] font-bold text-[#D9D3C7] hover:text-[#FF3800] transition-colors duration-200 block mb-6 w-fit"
                >
                  priyankmoradiya41@gmail.com
                </a>

                {/* Social Links */}
                <div className="flex gap-4 mb-6">
                  {/* GitHub */}
                  <a
                    href="https://github.com/Priyankm23"
                    target="_blank"
                    rel="noreferrer"
                    title="GitHub"
                    className="w-12 h-12 border border-[#2a2a2a] bg-[#151515] text-[#D9D3C7] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-[3px_3px_0px_0px_rgba(217,211,199,0.15)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-[#D9D3C7] hover:text-[#0a0a0a] hover:border-[#D9D3C7]"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  </a>
                  {/* LinkedIn */}
                  <a
                    href="https://linkedin.com/in/priyank-moradiya"
                    target="_blank"
                    rel="noreferrer"
                    title="LinkedIn"
                    className="w-12 h-12 border border-[#2a2a2a] bg-[#151515] text-[#D9D3C7] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-[3px_3px_0px_0px_rgba(217,211,199,0.15)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-[#D9D3C7] hover:text-[#0a0a0a] hover:border-[#D9D3C7]"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  {/* Twitter / X */}
                  <a
                    href="https://x.com/priyank_m_23"
                    target="_blank"
                    rel="noreferrer"
                    title="X (Twitter)"
                    className="w-12 h-12 border border-[#2a2a2a] bg-[#151515] text-[#D9D3C7] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-[3px_3px_0px_0px_rgba(217,211,199,0.15)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-[#D9D3C7] hover:text-[#0a0a0a] hover:border-[#D9D3C7]"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Right Column: Contact Form Card */}
              <div className="md:col-span-7">
                <div className="w-full bg-[#151515] border border-[#2a2a2a] p-6 sm:p-8 rounded-none shadow-[4px_4px_0px_0px_rgba(217,211,199,0.1)] transition-all duration-200 relative overflow-hidden">
                  {/* WebGL Shader Background inside Card */}
                  <ShaderBackground className="absolute inset-0 z-0 pointer-events-none opacity-30" />
                  <form onSubmit={handleContactSubmit} className="flex flex-col gap-6 font-sans relative z-10">
                    {submitStatus === "success" ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-8 flex flex-col items-center gap-4"
                      >
                        <div className="w-16 h-16 rounded-full bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-zinc-100 uppercase tracking-wider">
                          MESSAGE SENT
                        </h3>
                        <p className="text-[#D9D3C7]/80 text-sm max-w-md">
                          Thank you! Your message has been sent successfully. I will get in touch with you shortly.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setSubmitStatus("idle");
                            setContactName("");
                            setContactEmail("");
                            setContactMessage("");
                          }}
                          className="mt-4 px-5 py-2 border border-[#D9D3C7] bg-[#D9D3C7] text-[#0a0a0a] text-xs font-bold uppercase tracking-wider hover:bg-transparent hover:text-[#D9D3C7] transition-colors"
                        >
                          Send Another Message
                        </button>
                      </motion.div>
                    ) : (
                      <>
                        <div className="flex flex-col gap-2">
                          <label htmlFor="contact-name" className="text-xs uppercase tracking-widest text-[#D9D3C7] font-semibold">
                            Name
                          </label>
                          <input
                            type="text"
                            id="contact-name"
                            required
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            placeholder="Enter your name"
                            disabled={isSubmitting}
                            className="bg-black border border-[#2a2a2a] focus:border-[#D9D3C7] outline-none px-4 py-3 text-zinc-100 text-sm focus:ring-0 w-full rounded-none transition-colors duration-250 placeholder-zinc-600"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label htmlFor="contact-email" className="text-xs uppercase tracking-widest text-[#D9D3C7] font-semibold">
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="contact-email"
                            required
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="your.email@domain.com"
                            disabled={isSubmitting}
                            className="bg-black border border-[#2a2a2a] focus:border-[#D9D3C7] outline-none px-4 py-3 text-zinc-100 text-sm focus:ring-0 w-full rounded-none transition-colors duration-250 placeholder-zinc-600"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label htmlFor="contact-message" className="text-xs uppercase tracking-widest text-[#D9D3C7] font-semibold">
                            Message
                          </label>
                          <textarea
                            id="contact-message"
                            required
                            rows={5}
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value)}
                            placeholder="Write your message here..."
                            disabled={isSubmitting}
                            className="bg-black border border-[#2a2a2a] focus:border-[#D9D3C7] outline-none px-4 py-3 text-zinc-100 text-sm focus:ring-0 w-full rounded-none resize-none transition-colors duration-250 placeholder-zinc-600"
                          />
                        </div>

                        {submitStatus === "error" && (
                          <div className="text-red-500 font-mono text-xs p-3 bg-red-950/20 border border-red-500/20">
                            {statusMessage || "Failed to submit. Please try again."}
                          </div>
                        )}

                        <div className="flex justify-end mt-2">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 px-6 py-3 border border-[#D9D3C7] bg-[#D9D3C7] text-[#0a0a0a] font-bold tracking-wider hover:bg-transparent hover:text-[#D9D3C7] transition-all uppercase cursor-pointer rounded-none shadow-[3px_3px_0px_0px_rgba(217,211,199,0.15)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
                          </button>
                        </div>
                      </>
                    )}
                  </form>
                </div>
              </div>

            </div>
          </div>
        </section>
        {/* Footer */}
        <footer className="w-full bg-[#0a0a0a] py-8 px-margin-mobile md:px-margin-desktop z-10">
          <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center gap-4 font-sans text-xs tracking-widest text-zinc-500 uppercase font-semibold">
            <div>
              THANKS FOR VISITING.
            </div>
            <div>
              © {new Date().getFullYear()} PRIYANK MORADIYA. ALL RIGHTS RESERVED.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
