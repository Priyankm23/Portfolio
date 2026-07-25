"use client";

import React, { useState, useEffect, useRef } from "react";
import { Terminal, Workflow } from "lucide-react";
import { GenerativeHeroBg } from "@/components/GenerativeHeroBg";
import { fetchPortfolioApi } from "@/lib/api";

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
}

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
      <span className="flex items-center justify-center w-4 h-4">
        {fallback || <Terminal className="w-3.5 h-3.5" />}
      </span>
    );

  return (
    <div
      className="w-4 h-4 bg-current transition-colors"
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

// Accurate Tech Stack Categories from previous commit
const techStack = [
  {
    category: "Backend Runtime",
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

  const HELP_LINES = [
    "Available commands (OS-style shortcuts):",
    "  h        - Display this help menu",
    "  faq      - View common questions pool (e.g., 'faq 1')",
    "  lib      - View my reading recommendations (library)",
    "  net      - View tech friends from my network",
    "  yt       - View favorite developer channels",
    "  cur      - View my active personal project",
    "  ls       - List my recent deployments",
    "  cat      - Initiate communication protocol (contact)",
    "  cls      - Purge terminal output",
  ];

  // States and fetching for visitor count & interactive terminal
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [playInput, setPlayInput] = useState("");
  const [playHistory, setPlayHistory] = useState<string[]>([
    "[SYSTEM BOOT SUCCESSFUL]",
    "Welcome visitor! Established secure terminal session.",
    "",
    ...HELP_LINES,
  ]);
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  // Fetch real GitHub contribution data
  const [githubCommits, setGithubCommits] = useState<number>(234);
  const [githubRepos, setGithubRepos] = useState<number>(18);
  const [githubPRs, setGithubPRs] = useState<number>(7);
  const [githubStreak, setGithubStreak] = useState<number>(0);
  const [githubDays, setGithubDays] = useState<{ date: string; count: number; level: number }[]>([]);

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
          apiBaseUrl !== "https://portfolio-vq3d.vercel.app"
        ) {
          response = await fetch(
            "https://portfolio-vq3d.vercel.app/api/visitor-count",
          );
        }

        if (response.ok) {
          const data = await response.json();
          if (data && typeof data.visit_count === "number") {
            setVisitorCount(data.visit_count);
            setPlayHistory([
              "[SYSTEM BOOT SUCCESSFUL]",
              `Welcome visitor #${data.visit_count}! Established secure terminal session.`,
              "",
              ...HELP_LINES,
            ]);
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
              setPlayHistory([
                "[SYSTEM BOOT SUCCESSFUL]",
                `Welcome visitor #${data.visit_count}! Established secure terminal session.`,
                "",
                ...HELP_LINES,
              ]);
              return;
            }
          }
        } catch (backupErr) {
          console.error("Backup Vercel API fetch failed:", backupErr);
        }
      }

      // Fallback
      setVisitorCount(1243);
      setPlayHistory([
        "[SYSTEM BOOT SUCCESSFUL]",
        "Welcome visitor #1243! Established secure terminal session.",
        "",
        ...HELP_LINES,
      ]);
    };
    fetchVisits();
  }, []);


  // Scroll reveal IntersectionObserver setup
  useEffect(() => {
    const revealCallback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
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
      ".scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .project-card-reveal"
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

  // Align days to Sunday-Saturday weeks
  let weeks: { date: string; count: number; level: number; isPlaceholder?: boolean }[][] = [];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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

  const projects: Project[] = [
    {
      title: "Cadence",
      dates: "May 2026 – Present",
      tech: "Python · FastAPI",
      description:
        "A real-time microservices platform capturing and analyzing meeting audio. Streams audio seamlessly via Socket.IO, transcribes speech using Whisper v3 via Groq API, and automatically extracts summaries and action items with Llama 3.3.",
      tags: [
        "FastAPI",
        "Socket.IO",
        "Groq API",
        "Redis",
        "PostgreSQL",
        "Docker",
      ],
      githubUrl: "https://github.com/Priyankm23/Cadence-backend",
      liveUrl: "https://cadence-meeting-intelligence.vercel.app/",
      image: "/cadence_graphic.png",
      logoUrl: "/cadence_logo.png",
      screenshot: "/cadence.png",
    },
    {
      title: "Markivo",
      dates: "Mar 2026 – Present",
      tech: "TypeScript · Express",
      description:
        "A high-throughput multi-vendor e-commerce API managing complex order lifecycles and idempotent Stripe payments. Uses PostgreSQL row-level locking to prevent inventory overselling, offloading intensive tasks to Redis and BullMQ queues.",
      tags: ["Express", "PostgreSQL", "Redis", "BullMQ", "Prisma", "Zod"],
      githubUrl: "https://github.com/Priyankm23/marketflow",
      liveUrl: "https://marketflow-your-one-stop-shop.vercel.app/",
      image: "/markivo_graphic.png",
      logoUrl: "/markivo_logo.png",
      screenshot: "/marketflow.png",
    },
    {
      title: "SafeTrail",
      dates: "Jan – Feb 2026",
      tech: "JavaScript · Node.js",
      description:
        "A tourist safety API featuring decentralized identity on Polygon. Dynamically computes proximity-based safety scores using Haversine distance, operates auto-expiring itinerary geofences, and streams live SOS alerts via WebSockets.",
      tags: ["Express", "MongoDB", "Socket.IO", "Ethers.js", "Redis"],
      githubUrl: "https://github.com/Priyankm23/safetrail",
      liveUrl: "https://safetrail-your-safety-in-your-mobile.vercel.app/",
      image: "/safetrail_graphic.png",
      logoUrl: "/safetrail_logo.png",
      screenshot: "/safetrail.png",
    },
    /* Bandit CLI - Commented out for now
    {
      title: "Bandit CLI",
      dates: "Jun 2026 – Present (Beta)",
      tech: "TypeScript · Node.js",
      description: (
        <>
          An interactive terminal workspace companion and auditor for backend
          developers. Automates codebase scans for route discovery, benchmarks
          endpoints under load with live latency percentiles, manages port
          processes, and audits env setups.{" "}
          <span className="inline-block bg-primary/10 border border-primary text-primary px-1.5 py-0.5 text-[10px] font-mono-code uppercase font-bold tracking-wider rounded-sm ml-1 select-none">
            Vibe Coded
          </span>
          <span className="block text-[11.5px] text-on-surface-variant/75 mt-1.5 font-mono-code">
            * Created with zero understanding of code but trying to understand
            it for improvement.
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
      githubUrl:
        "https://github.com/Priyankm23/Backend-Audit-CLI-Tool---Bandit",
      liveUrl: "https://bandit-cli.vercel.app/",
      image: "/bandit_graphic.png",
      logoUrl: "/bandit_logo.png",
      screenshot: "/bandit.png",
    },
    */
  ];

  // Command input handler for the Section 06 Play terminal
  const handlePlaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = playInput.trim().toLowerCase();
    if (!input) return;

    const parts = input.split(" ");
    const command = parts[0];
    const argument = parts[1];

    let lines: string[] = [];
    switch (command) {
      case "help":
      case "h":
        lines = HELP_LINES;
        break;
      case "faq":
        if (!argument) {
          lines = [
            "FAQ Pool (Select a question by typing 'faq <number>'):",
            "  1. What is your career goal as a developer?",
            "  2. Why do you specialize in backend engineering?",
            "  3. Are you open to relocation or remote opportunities?",
            "",
            "Example: Type 'faq 1' to view the answer.",
          ];
        } else if (argument === "1") {
          lines = [
            "Q1: What is your career goal as a developer?",
            "A1: To build highly optimized backend architectures that handle heavy traffic under load while ensuring 99.9% uptime, clean APIs, and robust security.",
          ];
        } else if (argument === "2") {
          lines = [
            "Q2: Why do you specialize in backend engineering?",
            "A2: Backend is the brain of the system. I love working with database schemas, optimizing queries, row-level locks, pub-sub architectures, and job queues like BullMQ.",
          ];
        } else if (argument === "3") {
          lines = [
            "Q3: Are you open to relocation or remote opportunities?",
            "A3: Absolutely. I am ready to relocate for high-impact backend engineering roles and am also comfortable working in fully remote setups.",
          ];
        } else {
          lines = [
            `Invalid question number. Type 'faq' to see the list of questions.`,
          ];
        }
        break;
      case "books":
      case "lib":
        lines = [
          "Reading list for developers & backend engineers:",
          "  - 'Designing Data-Intensive Applications' by Martin Kleppmann (Must-read for distributed systems)",
          "  - 'Clean Code' by Robert C. Martin (Core software craftsmanship)",
          "  - 'System Design Interview' by Alex Xu (Scalability strategies)",
        ];
        break;
      case "friends":
      case "net":
        lines = [
          "Tech friends in my circle:",
          "  - Meet Patel (AI Engineer)   : If a solution is doable by any means, it will be done by him. Currently at ISRO.",
          "  - Utsav Bhalani (ML Systems) : True ML system optimizer and my roommate. Keeps track of the AI industry at its tip.",
          "  - Dhir Agarwal / RYUK (ML)   : Learning and improving for what can make him better as ML engineer. Makes crazy edits.",
          "  - Yajush Gorasiya (Full Stack) : Aspiring full-stack engineer and my high-throughput movie recommendation engine.",
        ];
        break;
      case "youtubers":
      case "yt":
        lines = [
          "Favorite developer channels I learn from:",
          "  - Piyush Garg : Master of modern Javascript, system design, and production-grade full-stack patterns.",
          "  - Manu Arora  : Premium UI builder, interactive animations, and Next.js crafting.",
          "  - Coder's Gyan: Excellent structural tutorials in Node.js, API design, and clean backend systems.",
        ];
        break;
      case "project":
      case "cur":
        lines = [
          "What I'm building right now:",
          "  - Cadence (Active)",
          "  - Description: Working on RAG (Retrieval-Augmented Generation) to get answers across the meetings and making it compatible for scalable use as well as for Hindi voice meetings to get accurate transcript for Hindi voice.",
          "  - Current Progress: ~60% complete",
        ];
        break;
      case "projects":
      case "ls":
        lines = [
          "Deployments matrix:",
          "  - Markivo: High-throughput e-commerce backend built with TypeScript, Express, PostgreSQL, Redis, and BullMQ.",
          "  - SafeTrail: Tourist safety engine utilizing blockchain identity, Express, and WebSockets.",
          "  - Cadence: Real-time FastAPI meeting audio capture and AI intelligence platform streaming via Socket.IO.",
        ];
        break;
      case "contact":
      case "cat":
        lines = [
          "Comms protocol initiated:",
          "  - Email   : priyankmoradiya41@gmail.com",
          "  - GitHub  : github.com/Priyankm23",
          "  - Status  : READY_FOR_HIRE",
        ];
        break;
      case "clear":
      case "cls":
        setPlayHistory([]);
        setPlayInput("");
        return;
      default:
        lines = [
          `sh: command not found: '${command}'. Type 'h' or 'help' for options.`,
        ];
    }

    setPlayHistory((prev) => [
      ...prev,
      `visitor@portfolio:~$ ${playInput}`,
      ...lines,
    ]);
    setPlayInput("");
  };

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [playHistory]);

  // Smooth scroll logic
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
    }
  };

  // Section Observer on Scroll
  useEffect(() => {
    const sections = [
      "hero",
      "about",
      "projects",
      "stack",
      "contributions",
      "experience",
      "play",
    ];
    const handleScroll = () => {
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
    <div className="bg-surface text-on-surface font-body-md antialiased pt-24 lg:pt-16 pb-0 min-h-screen">
      {/* TopAppBar - Responsive Horizontal Navigation Header */}
      <header className="fixed top-0 w-full z-50 flex flex-col lg:flex-row justify-between items-stretch lg:items-center bg-inverse-surface border-b border-outline h-24 lg:h-16">
        {/* Row 1: Logo & Status (on mobile) / Left Brand Column (on desktop) */}
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-12 lg:h-full border-b border-outline/30 lg:border-b-0 lg:flex-1 lg:justify-start lg:gap-8">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-primary animate-pulse"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              terminal
            </span>
            <span className="font-headline-md text-[20px] md:text-[24px] leading-none text-on-primary-fixed-variant dark:text-primary tracking-widest mt-1 uppercase whitespace-nowrap">
              Priyank Moradiya
            </span>
          </div>

          {/* Mobile-only status badge */}
          <div className="lg:hidden font-mono-code text-[10px] uppercase tracking-widest text-primary truncate">
            READY_FOR_HIRE
          </div>
        </div>

        {/* Row 2 on mobile: Horizontal Navigation Track (Desktop: middle aligned nav) */}
        <nav className="flex items-center justify-center sm:justify-start overflow-x-auto whitespace-nowrap scrollbar-none gap-0.5 min-[360px]:gap-1 sm:gap-2 font-bold text-[10px] min-[360px]:text-[11px] min-[390px]:text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px] uppercase tracking-wide h-12 lg:h-full px-2 lg:px-0 lg:flex-none w-full lg:w-auto">
          <button
            onClick={() => scrollTo("about")}
            suppressHydrationWarning
            className={`px-1 min-[360px]:px-1.5 min-[390px]:px-2.5 sm:px-4 py-1 sm:py-1.5 text-center transition-colors duration-0 h-fit cursor-pointer flex-shrink-0 ${
              activeSection === "about"
                ? "bg-primary text-on-primary"
                : "text-[#D9D3C7] hover:text-primary hover:bg-surface-dim/10"
            }`}
          >
            ABOUT
          </button>
          <button
            onClick={() => scrollTo("projects")}
            suppressHydrationWarning
            className={`px-1 min-[360px]:px-1.5 min-[390px]:px-2.5 sm:px-4 py-1 sm:py-1.5 text-center transition-colors duration-0 h-fit cursor-pointer flex-shrink-0 ${
              activeSection === "projects"
                ? "bg-primary text-on-primary"
                : "text-[#D9D3C7] hover:text-primary hover:bg-surface-dim/10"
            }`}
          >
            PROJECTS
          </button>
          <button
            onClick={() => scrollTo("stack")}
            suppressHydrationWarning
            className={`px-1 min-[360px]:px-1.5 min-[390px]:px-2.5 sm:px-4 py-1 sm:py-1.5 text-center transition-colors duration-0 h-fit cursor-pointer flex-shrink-0 ${
              activeSection === "stack"
                ? "bg-primary text-on-primary"
                : "text-[#D9D3C7] hover:text-primary hover:bg-surface-dim/10"
            }`}
          >
            STACK
          </button>
          <button
            onClick={() => scrollTo("contributions")}
            suppressHydrationWarning
            className={`px-1 min-[360px]:px-1.5 min-[390px]:px-2.5 sm:px-4 py-1 sm:py-1.5 text-center transition-colors duration-0 h-fit cursor-pointer flex-shrink-0 ${
              activeSection === "contributions"
                ? "bg-primary text-on-primary"
                : "text-[#D9D3C7] hover:text-primary hover:bg-surface-dim/10"
            }`}
          >
            COMMITS
          </button>
          <button
            onClick={() => scrollTo("experience")}
            suppressHydrationWarning
            className={`px-1 min-[360px]:px-1.5 min-[390px]:px-2.5 sm:px-4 py-1 sm:py-1.5 text-center transition-colors duration-0 h-fit cursor-pointer flex-shrink-0 ${
              activeSection === "experience"
                ? "bg-primary text-on-primary"
                : "text-[#D9D3C7] hover:text-primary hover:bg-surface-dim/10"
            }`}
          >
            EXPERIENCE
          </button>
        </nav>

        {/* Desktop-only status column (right aligned) */}
        <div className="hidden lg:block font-mono-code text-[11px] md:text-mono-code uppercase tracking-widest text-primary truncate px-margin-desktop lg:flex-1 lg:text-right">
          STATUS: READY_FOR_HIRE
        </div>
      </header>

      {/* Main Content Area - Full width without left sidebar margins */}
      <main className="min-h-screen flex flex-col relative overflow-hidden bg-surface">
        {/* Hero Section */}
        <section
          id="hero"
          className="relative pt-8 pb-8 md:pt-8 md:pb-12 border-b border-1px border-outline flex flex-col md:flex-row justify-center items-center min-h-[95vh] md:min-h-[92vh] overflow-hidden z-10 text-[#D9D3C7] bg-hero-split"
        >
          {/* Lined Grid Overlay - Locally inside Hero */}
          <div
            aria-hidden="true"
            className="absolute top-[54%] bottom-0 left-0 right-0 md:inset-0 pointer-events-none grid grid-cols-4 md:grid-cols-12 gap-0 border-r border-1px border-outline opacity-10 z-0"
          >
            <div className="h-full"></div>
            <div className="h-full max-md:border-l max-md:border-1px max-md:border-on-surface"></div>
            <div className="h-full max-md:border-l max-md:border-1px max-md:border-on-surface md:border-l md:border-1px md:border-on-surface"></div>
            <div className="h-full max-md:border-l max-md:border-1px max-md:border-on-surface"></div>
            <div className="h-full hidden md:block"></div>
            <div className="h-full hidden md:block"></div>
            <div className="border-l border-1px border-on-surface h-full hidden md:block"></div>
            <div className="border-l border-1px border-on-surface h-full hidden md:block"></div>
            <div className="border-l border-1px border-on-surface h-full hidden md:block"></div>
            <div className="border-l border-1px border-on-surface h-full hidden md:block"></div>
            <div className="border-l border-1px border-on-surface h-full hidden md:block"></div>
            <div className="border-l border-1px border-on-surface h-full hidden md:block"></div>
          </div>

          <GenerativeHeroBg />

          {/* Left Column (Text & Actions) */}
          <div className="w-full md:w-[48%] flex-1 md:flex-none flex flex-col justify-center px-margin-mobile md:px-0 md:pl-[calc(max(40px,(100vw-1280px)/2))] md:pr-12 relative z-10 pb-8 md:pb-0">
            <div className="flex flex-col gap-6 w-full max-w-[500px]">
              <div className="inline-block border border-1px border-primary px-3 py-1 bg-primary/10 text-primary font-mono-code text-mono-code w-max mx-auto md:mx-0 uppercase relative z-10">
                BACKEND DEVELOPER
              </div>
              <h1
                className="font-display-xl-mobile md:font-display-xl text-display-xl-mobile md:text-display-xl uppercase text-[#D9D3C7] tracking-wider relative z-10 text-center md:text-left min-h-[3.2em] md:min-h-0"
                style={{ fontFamily: '"Bebas Neue", sans-serif' }}
              >
                BUILDING
                <br />
                SYSTEMS FOR
                <br />
                <span
                  className="text-primary font-bold inline-block min-w-[13ch] text-center md:text-left text-[68px] sm:text-[84px] md:text-[95px] lg:text-[110px] leading-none whitespace-nowrap"
                  style={{ fontFamily: '"Bebas Neue", sans-serif' }}
                >
                  {words[dynamicWordIndex]}
                </span>
              </h1>
              <p className="font-body-md text-body-md text-[#D9D3C7]/90 max-w-md md:border-l-2 border-primary md:pl-4 relative z-10 text-center md:text-left mx-auto md:mx-0 border-l-0 pl-0">
                Full-stack thinking. Backend obsession. From raw APIs to
                distributed systems — <span className="whitespace-nowrap">I build</span> what holds
                everything together.
              </p>
              <div className="hidden md:flex flex-row flex-wrap gap-5 mt-6 relative z-10 justify-center md:justify-start">
                {/* GitHub */}
                <a
                  href="https://github.com/Priyankm23"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  title="GitHub"
                  className="w-14 h-14 border border-1px border-[#D9D3C7] bg-transparent text-[#D9D3C7] flex items-center justify-center transition-all duration-150 cursor-pointer shadow-[3px_3px_0px_0px_rgba(217,211,199,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-[#D9D3C7] hover:text-[#1B1C1C]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/in/priyankmoradiya"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                  className="w-14 h-14 border border-1px border-[#D9D3C7] bg-transparent text-[#D9D3C7] flex items-center justify-center transition-all duration-150 cursor-pointer shadow-[3px_3px_0px_0px_rgba(217,211,199,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-[#D9D3C7] hover:text-[#1B1C1C]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                {/* Email */}
                <a
                  href="mailto:priyankmoradiya41@gmail.com"
                  aria-label="Email"
                  title="Email"
                  className="w-14 h-14 border border-1px border-[#D9D3C7] bg-transparent text-[#D9D3C7] flex items-center justify-center transition-all duration-150 cursor-pointer shadow-[3px_3px_0px_0px_rgba(217,211,199,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-[#D9D3C7] hover:text-[#1B1C1C]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-6 h-6"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M2 7l10 7 10-7" />
                  </svg>
                </a>
                {/* X */}
                <a
                  href="https://x.com/priyank_M73"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X (Twitter)"
                  title="X (Twitter)"
                  className="w-14 h-14 border border-1px border-[#D9D3C7] bg-transparent text-[#D9D3C7] flex items-center justify-center transition-all duration-150 cursor-pointer shadow-[3px_3px_0px_0px_rgba(217,211,199,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-[#D9D3C7] hover:text-[#1B1C1C]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column (Stylized Portrait) */}
          <div className="w-full md:w-[52%] flex-1 md:flex-none flex items-center justify-center px-margin-mobile md:px-0 md:px-[calc(max(40px,(100vw-1280px)/2))] relative z-10">
            <div className="relative h-[360px] md:h-[470px] lg:h-[570px] xl:h-[610px] aspect-square flex items-center justify-center md:-translate-x-2 md:translate-y-2">
              {/* The main portrait (increased size, centered) */}
              <img
                alt="Priyank Moradiya - Stylized Retro Portrait"
                className="w-full h-full object-contain select-none pointer-events-none z-10"
                src="/hero_portrait.png"
                style={{ mixBlendMode: "multiply" }}
              />

              {/* 1. Database Storage (Top-Left) */}
              <div className="absolute top-[12%] left-[-4%] w-[26%] h-[26%] z-20">
                <img
                  src="/simple_database.png"
                  alt="Database Storage"
                  className="w-full h-full object-contain select-none pointer-events-none"
                  style={{ mixBlendMode: "multiply" }}
                />
              </div>

              {/* 2. Server (Top-Right, on other side of head) */}
              <div className="absolute top-[8%] right-[0%] w-[26%] h-[26%] z-20">
                <img
                  src="/simple_server.png"
                  alt="Server Mainframe"
                  className="w-full h-full object-contain select-none pointer-events-none"
                  style={{ mixBlendMode: "multiply" }}
                />
              </div>

              {/* 3. API Gateway / Router (Right-Side Middle, outside of silhouette) */}
              <div className="absolute top-[46%] right-[0%] w-[26%] h-[26%] z-20">
                <img
                  src="/simple_router.png"
                  alt="API Gateway"
                  className="w-full h-full object-contain select-none pointer-events-none"
                  style={{ mixBlendMode: "multiply" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* About Section 01 - Full-Bleed Split Canvas Section */}
        <section
          id="about"
          className="relative border-b border-1px border-outline z-10 overflow-hidden bg-surface"
        >
          {/* Split Background: Left Side White, Right Side Dark #1B1C1C with Generative Canvas */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {/* Desktop split: Right side dark #1B1C1C with generative canvas starting at 48% */}
            <div className="hidden md:block absolute top-0 bottom-0 left-[48%] right-0 bg-[#1B1C1C] border-l border-1px border-outline">
              <GenerativeHeroBg fullWidth />
            </div>
            {/* Mobile split: Bottom side dark #1B1C1C with generative canvas starting at 54% */}
            <div className="md:hidden absolute top-[54%] bottom-0 left-0 right-0 bg-[#1B1C1C] border-t border-1px border-outline">
              <GenerativeHeroBg fullWidth />
            </div>
          </div>

          <div className="max-w-[1440px] mx-auto w-full relative z-10 px-4 sm:px-6 md:px-10 py-10 md:py-14">
            {/* Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch relative z-10">
              {/* Box A (Left Column - col-span-5): White side with 01 ABOUT Header + Specifications Card */}
              <div className="scroll-reveal-left lg:col-span-5 flex flex-col justify-between relative">
                {/* Header & 01 Watermark inside Left Column */}
                <div className="relative mb-6 md:mb-8 pt-1">
                  {/* Ghost Number / Watermark 01 */}
                  <div className="absolute top-0 md:top-1 left-0 font-display-xl-mobile md:font-display-xl text-[120px] md:text-[180px] text-on-surface opacity-10 pointer-events-none select-none z-0">
                    01
                  </div>
                  <h2 className="font-headline-lg text-[54px] md:text-[72px] leading-none text-on-surface tracking-wider uppercase relative z-10 pt-3 md:pt-4">
                    ABOUT
                  </h2>
                </div>

                {/* Specifications Card */}
                <div className="border-2 border-on-surface p-5 sm:p-6 flex flex-col shadow-[5px_5px_0px_0px_rgba(27,28,28,1)] bg-surface-container-lowest text-on-surface flex-1 justify-between">
                  {/* Personal Specs */}
                  <div className="font-mono-code text-[13px] flex flex-col justify-between h-full gap-3">
                    <div className="flex gap-2 items-center border-b border-outline/20 pb-2.5 mb-1">
                      <span className="material-symbols-outlined text-primary text-[17px]">
                        fingerprint
                      </span>
                      <span className="font-bold uppercase tracking-widest text-on-surface/80 text-[11.5px] md:text-[12px]">
                        SPECIFICATIONS
                      </span>
                    </div>

                    <div className="flex flex-col justify-between flex-1 gap-y-2 md:gap-y-2.5">
                      <div className="flex flex-col sm:flex-row justify-between border-b border-outline/10 pb-1.5 gap-1">
                        <span className="text-on-surface-variant font-bold uppercase text-[11.5px]">HOST:</span>
                        <span className="text-on-surface font-semibold text-[13px]">priyank_moradiya</span>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between border-b border-outline/10 pb-1.5 gap-1">
                        <span className="text-on-surface-variant font-bold uppercase text-[11.5px]">ACADEMICS:</span>
                        <span className="text-on-surface font-semibold text-[12.5px]">B.Tech (IT) · 4th Year</span>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between border-b border-outline/10 pb-1.5 gap-1">
                        <span className="text-on-surface-variant font-bold uppercase text-[11.5px]">INSTITUTION:</span>
                        <span className="text-on-surface font-semibold text-[12.5px] sm:text-right">GCET, Anand</span>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between border-b border-outline/10 pb-1.5 gap-1">
                        <span className="text-on-surface-variant font-bold uppercase text-[11.5px]">CGPA:</span>
                        <span className="text-primary font-bold text-[13.5px]">9.40 / 10.00</span>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between border-b border-outline/10 pb-1.5 gap-1">
                        <span className="text-on-surface-variant font-bold uppercase text-[11.5px]">CORE FOCUS:</span>
                        <span className="text-on-surface font-semibold text-[12.5px] sm:text-right">High-Throughput APIs & Distributed Backends</span>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between border-b border-outline/10 pb-1.5 gap-1">
                        <span className="text-on-surface-variant font-bold uppercase text-[11.5px]">LOC:</span>
                        <span className="text-on-surface font-semibold text-[12.5px]">Anand, Gujarat, IN</span>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-center pt-0.5 gap-1">
                        <span className="text-on-surface-variant font-bold uppercase text-[11.5px]">LIVE_VISITS:</span>
                        <div className="font-bold flex items-center gap-1.5 text-primary">
                          <span className="inline-block w-2.5 h-2.5 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                          </span>
                          {visitorCount !== null ? (
                            <span className="font-mono-code text-[13px] tracking-widest">
                              {visitorCount}
                            </span>
                          ) : (
                            <span className="text-on-surface-variant/40 animate-pulse text-[11px]">
                              Syncing...
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (col-span-6 col-start-7): Dark side with "THE HONEST TRUTH." text - GUARANTEED INSIDE DARK SECTION */}
              <div className="scroll-reveal-right lg:col-span-6 lg:col-start-7 flex flex-col justify-center py-4 lg:py-6 pl-4 sm:pl-6 md:pl-8 lg:pl-10 text-[#D9D3C7] relative z-10" style={{ transitionDelay: "150ms" }}>
                <div className="flex flex-col gap-4">
                  <h3 className="font-headline-md text-[30px] md:text-[38px] leading-tight text-[#D9D3C7] tracking-wider uppercase">
                    THE HONEST TRUTH.
                  </h3>
                  <div className="space-y-3.5 font-body-md text-[14px] md:text-[15px] text-[#D9D3C7]/90 leading-relaxed">
                    <p>
                      I am a backend developer focused on engineering optimized backend systems. While not claiming every system I create is perfect, every day I am learning and iterating to make services perform reliably under load.
                    </p>
                    <p>
                      I love building REST API endpoints, designing relational database schemas, and defining Redis caching layers with single-flight request patterns. My microservices leverage gRPC for inter-service communication and RabbitMQ for async task offloading. Everything is containerized with Docker, verified via load testing (k6, Autocannon), unit/integration tested (Jest, Supertest, Pytest), and monitored using Pino logs and Sentry observability. The skills remain the same, only the learnings get adapted with the new and unique business logic across different projects.
                    </p>
                    <p>
                      I started with Node.js for my backend foundation, explored FastAPI, and am currently diving deep into core Node.js concepts while contributing to open source, solving LeetCode SQL challenges, and always welcome tech discussions.
                    </p>

                    {/* Personal Quote Mantra */}
                    <div className="pl-4 border-l-2 border-primary italic text-[#D9D3C7]/90 text-[13.5px] md:text-[14.5px] mt-4 pt-0.5">
                      "Learning to optimize the system and on the journey to be honest about the failures and bad architectural design decisions because that's what would make the future systems better."
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section 02 - Lined Grid Overlay, beige background */}
        <section
          id="projects"
          className="relative px-margin-mobile md:px-margin-desktop py-16 border-b border-1px border-outline z-10 bg-d9d3c7 text-on-surface"
        >
          {/* Lined Grid Overlay - Locally inside Projects */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none grid grid-cols-4 md:grid-cols-12 gap-0 border-r border-1px border-outline opacity-10 z-0"
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

          {/* Content */}
          <div className="max-w-7xl mx-auto w-full relative z-10 mt-16">
            {/* Ghost Number */}
            <div className="absolute -top-10 right-0 md:-right-4 font-display-xl-mobile md:font-display-xl text-[120px] md:text-[240px] text-white opacity-20 pointer-events-none select-none z-0">
              02
            </div>
            <span className="font-mono-code text-mono-code text-primary uppercase relative z-10">
              PROJECTS
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-wider uppercase mb-12 relative z-10">
              SELECTED PROJECTS
            </h2>

            {/* Brutalist Grid Cards */}
            <div className="grid grid-cols-1 gap-8">
              {projects.map((project, idx) => (
                <div key={idx} className="project-card-reveal" style={{ transitionDelay: `${idx * 150}ms` }}>
                  <div
                    className={`bg-surface border border-1px border-on-surface flex flex-col ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} shadow-[4px_4px_0px_0px_rgba(27,28,28,1)] hover:-translate-y-1 transition-transform duration-200 group overflow-hidden`}
                  >
                  {/* Left Side: Details */}
                  <div className="flex-1 p-6 sm:p-8 flex flex-col gap-5 justify-between min-w-0">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-outline/30 pb-3 mb-4">
                        <span className="bg-primary/15 border border-primary text-primary px-3 py-1 text-[13px] md:text-[14px] font-mono-code font-bold uppercase tracking-wide rounded-xs">
                          {project.tech}
                        </span>
                        <span className="text-on-surface font-mono-code text-[13px] md:text-[14px] font-semibold tracking-wider">
                          {project.dates}
                        </span>
                      </div>
                      <h3 className="font-headline-md text-[36px] md:text-[44px] leading-none text-on-surface uppercase tracking-tight flex items-center gap-3">
                        {project.logoUrl && (
                          <img
                            src={project.logoUrl}
                            alt={`${project.title} logo`}
                            className="w-12 h-12 md:w-14 md:h-14 object-contain border border-on-surface bg-white p-1.5 rounded-sm shadow-[1.5px_1.5px_0px_0px_rgba(27,28,28,1)] mix-blend-multiply"
                          />
                        )}
                        <span>{project.title}</span>
                      </h3>
                      <p className="font-body-md text-[16px] md:text-[17px] text-on-surface leading-relaxed mt-4 font-normal">
                        {project.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-2 mb-5">
                        {project.tags.map((tag, tagIdx) => (
                          <span
                            key={tagIdx}
                            className="border border-on-surface/80 text-on-surface bg-surface-container-high/60 px-3 py-1 text-[12px] md:text-[13px] font-mono-code font-semibold uppercase tracking-wider rounded-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-4 border-t border-outline/30 pt-4">
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[14px] md:text-[15px] font-mono-code uppercase text-primary hover:underline flex items-center gap-1.5 font-bold"
                        >
                          SOURCE_CODE <span className="text-xs">→</span>
                        </a>
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[14px] md:text-[15px] font-mono-code uppercase text-on-surface hover:underline flex items-center gap-1.5 font-bold"
                          >
                            DEMO_LINK <span className="text-xs">→</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Halftone Brutalist Graphic / Screenshot Transition */}
                  <div
                    className={`w-full md:w-[48%] border-t md:border-t-0 ${idx % 2 === 0 ? "md:border-l" : "md:border-r"} border-on-surface relative flex items-center justify-center p-4 md:p-6 min-h-[300px] md:min-h-[420px]`}
                    style={{
                      backgroundColor: "var(--color-bg)",
                      backgroundImage:
                        "linear-gradient(rgba(27,28,28,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(27,28,28,0.06) 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  >
                    {project.image && (
                      <div className="relative w-full h-full">
                        {/* Halftone graphic (Default) */}
                        <img
                          src={project.image}
                          alt={`${project.title} Graphic`}
                          className={`absolute inset-0 m-auto max-w-full max-h-full w-auto h-auto object-contain select-none pointer-events-none group-hover:scale-105 group-hover:rotate-[2deg] transition-all duration-500 ${showScreenshot && project.screenshot ? "opacity-0" : "opacity-100"} ${project.screenshot ? "group-hover:opacity-0" : ""}`}
                        />
                        {/* Actual platform screenshot (Visible on hover / mobile timer - fit cleanly!) */}
                        {project.screenshot && (
                          <img
                            src={project.screenshot}
                            alt={`${project.title} Screenshot`}
                            className={`absolute inset-0 m-auto max-w-full max-h-full w-auto h-auto object-contain select-none pointer-events-none border border-on-surface shadow-[3px_3px_0px_0px_rgba(27,28,28,1)] group-hover:scale-105 transition-all duration-500 ${showScreenshot ? "opacity-100" : "opacity-0"} group-hover:opacity-100`}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack Section 03 - White background, beige cards, red hover */}
        <section
          id="stack"
          className="relative px-margin-mobile md:px-margin-desktop py-16 border-b border-1px border-outline z-10 bg-surface text-on-surface"
        >
          <div className="max-w-7xl mx-auto w-full relative z-10">
            {/* Ghost Number */}
            <div className="absolute -top-10 left-0 md:-left-4 font-display-xl-mobile md:font-display-xl text-[120px] md:text-[240px] text-primary opacity-10 pointer-events-none select-none z-0">
              03
            </div>
            <div className="relative z-10 mt-16">
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-wider uppercase mb-12">
                TOOLS I TRUST
              </h2>

              {/* Categorized columns - Beige Background Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {techStack.map((cat, catIdx) => (
                  <div
                    key={catIdx}
                    className="scroll-reveal border border-1px border-on-surface p-6 bg-d9d3c7 shadow-[4px_4px_0px_0px_rgba(27,28,28,1)] text-on-surface"
                    style={{ transitionDelay: `${catIdx * 150}ms` }}
                  >
                    <h3 className="font-label-sm text-label-sm text-primary uppercase border-b border-primary pb-2 mb-4">
                      {cat.category}
                    </h3>
                    <div className="flex flex-col gap-2">
                      {cat.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="group/stack flex items-center gap-3 border border-1px border-outline/35 px-3 py-1.5 font-mono-code text-[13px] text-on-surface bg-surface hover:bg-primary hover:text-on-primary hover:border-primary transition-all duration-200 cursor-pointer"
                        >
                          <span className="text-primary group-hover/stack:text-on-primary transition-colors duration-200 flex items-center justify-center">
                            <BrandIcon
                              slug={item.slug}
                              fallback={item.fallback}
                            />
                          </span>
                          <span className="uppercase tracking-wide font-bold">
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 04: GitHub Contributions */}
        <section
          id="contributions"
          className="bg-surface text-on-surface relative overflow-hidden px-margin-mobile md:px-margin-desktop py-16 border-b border-brutal z-10"
        >
          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-75 pointer-events-none filter contrast-105 brightness-90"
          >
            <source src="/git-video.mp4" type="video/mp4" />
          </video>
          {/* Dark Overlay for text contrast */}
          <div className="absolute inset-0 bg-black/45 z-0 pointer-events-none" />

          <div className="max-w-7xl mx-auto w-full relative z-10">
            {/* Ghost Number */}
            <div className="absolute -top-10 right-0 md:-right-4 font-display-xl-mobile md:font-display-xl text-[120px] md:text-[240px] text-white opacity-20 pointer-events-none select-none z-0">
              04
            </div>
            <div className="relative z-10 flex flex-col md:grid md:grid-cols-12 gap-gutter mt-16">
              {/* Heading Area */}
              <div className="scroll-reveal-left md:col-span-4 mb-8 md:mb-0">
                <h2 className="font-headline-lg text-white uppercase flex items-center drop-shadow-sm">
                  COMMIT HISTORY
                  <span className="text-primary ml-1 blink">_</span>
                </h2>
                <div className="h-px w-full bg-white/30 my-4"></div>
                <p className="font-mono-code text-white/90 text-sm max-w-sm">
                  Raw output from the primary repository structure. Tracking
                  daily commits, merges, and system updates.
                </p>
              </div>
              {/* Heatmap Area */}
              <div className="scroll-reveal-right md:col-span-8 flex flex-col gap-6" style={{ transitionDelay: "150ms" }}>
                {/* Stats Row */}
                <div className="flex flex-wrap gap-4 border-l border-white/40 pl-4">
                  <div className="flex flex-col">
                    <span className="font-headline-md text-primary">
                      {githubCommits}
                    </span>
                    <span className="font-label-sm text-white/80 uppercase">
                      COMMITS
                    </span>
                  </div>
                  <div className="w-px h-auto bg-white/30 mx-2 hidden md:block"></div>
                  <div className="flex flex-col">
                    <span className="font-headline-md text-primary">
                      {githubRepos}
                    </span>
                    <span className="font-label-sm text-white/80 uppercase">
                      REPOS
                    </span>
                  </div>
                  <div className="w-px h-auto bg-white/30 mx-2 hidden md:block"></div>
                  <div className="flex flex-col">
                    <span className="font-headline-md text-primary">
                      {githubPRs < 10 ? `0${githubPRs}` : githubPRs}
                    </span>
                    <span className="font-label-sm text-white/80 uppercase">
                      PRs
                    </span>
                  </div>
                  <div className="w-px h-auto bg-white/30 mx-2 hidden md:block"></div>
                  <div className="flex flex-col">
                    <span className="font-headline-md text-primary">
                      {githubStreak < 10 ? `0${githubStreak}` : githubStreak}
                    </span>
                    <span className="font-label-sm text-white/80 uppercase">
                      STREAK
                    </span>
                  </div>
                </div>
                {/* Grid */}
                <div className="bg-[#111111]/90 backdrop-blur-md border border-white/20 p-4 overflow-x-auto w-full max-w-full rounded-xs">
                  <div className="flex gap-2 w-max">
                    {/* Weekdays column */}
                    <div className="flex flex-col gap-1 mt-[22px] select-none text-left">
                      <div className="h-3 w-5 text-[9px] leading-3 text-secondary-fixed-dim font-mono"></div> {/* Sun */}
                      <div className="h-3 w-5 text-[9px] leading-3 text-secondary-fixed-dim font-mono">Mon</div> {/* Mon */}
                      <div className="h-3 w-5 text-[9px] leading-3 text-secondary-fixed-dim font-mono"></div> {/* Tue */}
                      <div className="h-3 w-5 text-[9px] leading-3 text-secondary-fixed-dim font-mono">Wed</div> {/* Wed */}
                      <div className="h-3 w-5 text-[9px] leading-3 text-secondary-fixed-dim font-mono"></div> {/* Thu */}
                      <div className="h-3 w-5 text-[9px] leading-3 text-secondary-fixed-dim font-mono">Fri</div> {/* Fri */}
                      <div className="h-3 w-5 text-[9px] leading-3 text-secondary-fixed-dim font-mono"></div> {/* Sat */}
                    </div>

                    <div className="flex flex-col">
                      {/* Months row */}
                      <div className="flex gap-1 mb-1.5 h-4 relative select-none">
                        {weeks.map((week, weekIdx) => {
                          const dateParts = week[0].date.split("-").map(Number);
                          const year = dateParts[0];
                          const month = dateParts[1] - 1;

                          const targetYear = parseDate(githubDays[githubDays.length - 1].date).getFullYear();

                          const isFirstWeekOfMonth =
                            (weekIdx === 0 ||
                              weeks[weekIdx - 1][0].date.split("-").map(Number)[1] - 1 !== month) &&
                            year === targetYear;

                          return (
                            <div
                              key={weekIdx}
                              className="w-3 text-[10px] font-mono text-secondary-fixed-dim relative uppercase"
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

                      {/* Weeks columns */}
                      <div className="flex gap-1">
                        {weeks.map((week, weekIdx) => (
                          <div key={weekIdx} className="flex flex-col gap-1">
                            {week.map((day, dayIdx) => (
                              <div
                                key={dayIdx}
                                className={`w-3 h-3 rounded-sm ${
                                  day.isPlaceholder
                                    ? "bg-transparent pointer-events-none"
                                    : `heat-${day.level}`
                                }`}
                                title={
                                  day.isPlaceholder
                                    ? undefined
                                    : `${day.date}: ${day.count} contributions`
                                }
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3 font-label-sm text-[10px] text-secondary-fixed-dim uppercase">
                    <span>Less</span>
                    <div className="flex gap-1">
                      <div className="w-3 h-3 rounded-sm heat-0 border border-brutal-dark"></div>
                      <div className="w-3 h-3 rounded-sm heat-1"></div>
                      <div className="w-3 h-3 rounded-sm heat-2"></div>
                      <div className="w-3 h-3 rounded-sm heat-3"></div>
                      <div className="w-3 h-3 rounded-sm heat-4"></div>
                    </div>
                    <span>More</span>
                  </div>
                </div>
                <a
                  className="inline-flex items-center gap-2 border border-white px-4 py-2 w-max text-white font-label-sm hover:bg-primary hover:text-white transition-colors duration-200 uppercase cursor-pointer"
                  href="https://github.com/Priyankm23"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    open_in_new
                  </span>
                  VIEW FULL LOG
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section 05: Experience - Clean Brutalist Paper White Theme */}
        <section
          id="experience"
          className="relative px-margin-mobile md:px-margin-desktop py-16 border-b border-1px border-outline z-10 bg-surface text-on-surface overflow-hidden"
        >
          <div className="max-w-7xl mx-auto w-full relative z-10">
            {/* Ghost Number */}
            <div className="absolute -top-10 left-0 md:-left-4 font-display-xl-mobile md:font-display-xl text-[120px] md:text-[240px] text-on-surface opacity-10 pointer-events-none select-none z-0">
              05
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mt-16 relative z-10">
              {/* Heading */}
              <div className="md:col-span-4 mb-10 md:mb-0 relative">
                <h2 className="font-headline-lg text-on-surface uppercase relative z-10 tracking-wider">
                  WHERE I'VE WORKED
                </h2>
                <div className="h-px w-full bg-outline my-4"></div>
                <p className="font-mono-code text-on-surface font-medium text-sm">
                  Professional deployments and architectural leadership across
                  various production systems.
                </p>
              </div>
              {/* Timeline */}
              <div className="md:col-span-8 relative">
                <div className="flex flex-col gap-8 md:gap-12 relative z-10">
                  {/* Job 1: Prelax Infotech */}
                  <div className="relative pl-10 md:pl-12 group scroll-reveal">
                    {/* Line joining the two circles */}
                    <div className="absolute left-0 top-6 bottom-[-32px] md:bottom-[-48px] w-0.5 bg-gradient-to-b from-primary to-outline/40 ml-3.5 md:ml-4 z-10"></div>
                    {/* Circle-in-circle timeline marker */}
                    <div className="absolute left-0 top-4 w-5 h-5 bg-surface-container-lowest border-2 border-primary rounded-full flex items-center justify-center ml-1 md:ml-1.5 z-20 shadow-[0_2px_8px_rgba(176,38,0,0.3)]">
                      <div className="w-2 h-2 bg-primary rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                    </div>
                    <div
                      onClick={() => setPrelaxExpanded(!prelaxExpanded)}
                      className="border-2 border-on-surface bg-surface-container-lowest p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(27,28,28,1)] transition-all duration-200 cursor-pointer select-none rounded-xs"
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 border-b border-outline/20 pb-4 gap-3">
                        <div>
                          <h3 className="font-headline-md text-[28px] md:text-[36px] leading-tight text-on-surface font-bold uppercase tracking-wide mb-1.5">
                            BACKEND DEVELOPER INTERN
                          </h3>
                          <div className="font-mono-code text-primary font-bold uppercase text-[14px] md:text-[15px] tracking-wider flex items-center gap-2">
                            PRELAX INFOTECH
                          </div>
                        </div>
                        <div className="font-mono-code text-primary font-bold text-[12px] md:text-[13px] bg-primary/10 border border-primary px-3 py-1.5 inline-block w-max rounded-xs tracking-wider shadow-xs">
                          MAY 2026 — JUN 2026
                        </div>
                      </div>

                      <div className="font-mono-code text-on-surface/75 text-[13px] md:text-[14px] mb-4 font-semibold">
                        Backend Developer Intern · Surat, Gujarat, India
                      </div>

                      <ul className="font-body-md text-on-surface text-[14.5px] md:text-[15.5px] space-y-3.5 leading-relaxed font-normal">
                        <li className="flex items-start gap-2.5">
                          <span className="material-symbols-outlined text-primary text-[20px] font-bold mt-0.5">
                            arrow_forward
                          </span>
                          <span>
                            Architected a microservices backend with 8-10
                            Node.js/Express services, each using its own
                            PostgreSQL database instance
                            {!prelaxExpanded && "....."}
                          </span>
                        </li>
                        {prelaxExpanded && (
                          <>
                            <li className="flex items-start gap-2.5">
                              <span className="material-symbols-outlined text-primary text-[20px] font-bold mt-0.5">
                                arrow_forward
                              </span>
                              <span>
                                Engineered synchronous inter-service calls using
                                gRPC and an API Gateway, with RabbitMQ topic
                                exchanges for async event-driven logging.
                              </span>
                            </li>
                            <li className="flex items-start gap-2.5">
                              <span className="material-symbols-outlined text-primary text-[20px] font-bold mt-0.5">
                                arrow_forward
                              </span>
                              <span>
                                Resolved N+1 query issues on the job browsing
                                endpoint using Redis caching, achieving
                                throughput of 400-600 RPS under load tests with
                                Autocannon.
                              </span>
                            </li>
                          </>
                        )}
                      </ul>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-outline/20">
                        {['Node.js', 'Express', 'PostgreSQL', 'gRPC', 'RabbitMQ', 'Redis', 'Docker', 'Autocannon'].map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="border border-on-surface/30 text-on-surface bg-surface-variant/40 px-2.5 py-1 font-mono-code text-[11.5px] md:text-[12px] uppercase font-bold rounded-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 text-[12px] font-mono-code uppercase tracking-wider text-primary font-bold flex items-center gap-1">
                        {prelaxExpanded
                          ? "— Click card to collapse"
                          : "+ Click card to expand"}
                      </div>
                    </div>
                  </div>

                  {/* Job 2: Infosys Springboard */}
                  <div className="relative pl-10 md:pl-12 group scroll-reveal" style={{ transitionDelay: "150ms" }}>
                    {/* Circle-in-circle timeline marker */}
                    <div className="absolute left-0 top-4 w-5 h-5 bg-surface-container-lowest border-2 border-primary rounded-full flex items-center justify-center ml-1 md:ml-1.5 z-20 shadow-[0_2px_8px_rgba(176,38,0,0.3)]">
                      <div className="w-2 h-2 bg-primary rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                    </div>
                    <div
                      onClick={() => setInfosysExpanded(!infosysExpanded)}
                      className="border-2 border-on-surface bg-surface-container-lowest p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(27,28,28,1)] transition-all duration-200 cursor-pointer select-none rounded-xs"
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 border-b border-outline/20 pb-4 gap-3">
                        <div>
                          <h3 className="font-headline-md text-[28px] md:text-[36px] leading-tight text-on-surface font-bold uppercase tracking-wide mb-1.5">
                            PYTHON BACKEND INTERN
                          </h3>
                          <div className="font-mono-code text-primary font-bold uppercase text-[14px] md:text-[15px] tracking-wider flex items-center gap-2">
                            INFOSYS SPRINGBOARD
                          </div>
                        </div>
                        <div className="font-mono-code text-primary font-bold text-[12px] md:text-[13px] bg-primary/10 border border-primary px-3 py-1.5 inline-block w-max rounded-xs tracking-wider shadow-xs">
                          AUG 2025 — OCT 2025
                        </div>
                      </div>

                      <div className="font-mono-code text-on-surface/75 text-[13px] md:text-[14px] mb-4 font-semibold">
                        Python Backend Intern · Remote · Anand, Gujarat, India
                      </div>

                      <ul className="font-body-md text-on-surface text-[14.5px] md:text-[15.5px] space-y-3.5 leading-relaxed font-normal">
                        <li className="flex items-start gap-2.5">
                          <span className="material-symbols-outlined text-primary text-[20px] font-bold mt-0.5">
                            arrow_forward
                          </span>
                          <span>
                            Collaborated in a 25+ member Agile/Scrum team across
                            4 sprints, managing testing and backlog
                            documentation{!infosysExpanded && "....."}
                          </span>
                        </li>
                        {infosysExpanded && (
                          <>
                            <li className="flex items-start gap-2.5">
                              <span className="material-symbols-outlined text-primary text-[20px] font-bold mt-0.5">
                                arrow_forward
                              </span>
                              <span>
                                Built a time-series crypto pipeline (SQLite,
                                Pandas, NumPy) with Ridge Regression return
                                prediction.
                              </span>
                            </li>
                            <li className="flex items-start gap-2.5">
                              <span className="material-symbols-outlined text-primary text-[20px] font-bold mt-0.5">
                                arrow_forward
                              </span>
                              <span>
                                Integrated stress testing across diverse market
                                scenarios, exposing endpoints via FastAPI and a
                                Streamlit dashboard.
                              </span>
                            </li>
                          </>
                        )}
                      </ul>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-outline/20">
                        {['Python', 'FastAPI', 'SQLite', 'Pandas', 'NumPy', 'Ridge Regression', 'Streamlit', 'Agile/Scrum'].map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="border border-on-surface/30 text-on-surface bg-surface-variant/40 px-2.5 py-1 font-mono-code text-[11.5px] md:text-[12px] uppercase font-bold rounded-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Certificate & Expand Row */}
                      <div className="flex flex-wrap gap-4 items-center justify-between pt-4 border-t border-outline/20 mt-4">
                        <div className="text-[12px] font-mono-code uppercase tracking-wider text-primary font-bold flex items-center gap-1">
                          {infosysExpanded
                            ? "— Click card to collapse"
                            : "+ Click card to expand"}
                        </div>

                        <a
                          href="https://bit.ly/Priyank-InfosysCert"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 border border-on-surface bg-surface text-on-surface hover:bg-primary hover:text-white transition-colors duration-200 px-4 py-2 font-mono-code text-[12px] font-bold uppercase cursor-pointer rounded-xs shadow-xs"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            verified_user
                          </span>
                          VIEW CREDENTIAL <span className="text-xs">→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 06: Interactive Play - Dark black grid background */}
        <section
          id="play"
          className="px-margin-mobile md:px-margin-desktop py-16 border-b border-[#2a2a2a] relative z-10 text-[#D9D3C7] animate-fade-in"
          style={{
            backgroundColor: "#111111",
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        >
          <div className="max-w-7xl mx-auto w-full relative z-10">
            {/* Ghost Number */}
            <div className="absolute -top-10 right-0 md:-right-4 font-display-xl-mobile md:font-display-xl text-[120px] md:text-[240px] text-[#D9D3C7] opacity-20 pointer-events-none select-none z-0">
              06
            </div>
            <header className="border-b border-[#2a2a2a] pb-base relative z-10 mt-16">
              <h2 className="font-headline-md text-headline-md text-[#D9D3C7] tracking-wider uppercase">
                KNOW MORE ABOUT ME.....
              </h2>
            </header>

            {/* Terminal Playground Widget - Black Background */}
            <div className="scroll-reveal border border-[#C4BDB2] bg-[#1A1A1A] flex flex-col mt-base shadow-sm text-surface relative z-10">
              {/* Window Header */}
              <div className="flex items-center px-base py-2 border-b border-[#C4BDB2] bg-[#111111]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-tertiary-container border border-[#C4BDB2]"></div>
                  <div className="w-3 h-3 rounded-full bg-tertiary-container border border-[#C4BDB2]"></div>
                  <div className="w-3 h-3 rounded-full bg-tertiary-container border border-[#C4BDB2]"></div>
                </div>
                <span className="mx-auto font-label-sm text-label-sm text-[#D9D3C7] opacity-50">
                  sh — 80x24
                </span>
              </div>

              {/* Terminal Body */}
              <div
                ref={terminalBodyRef}
                className="p-4 font-mono-code text-mono-code text-[#D9D3C7] h-[400px] overflow-y-auto flex flex-col gap-1"
              >
                {playHistory.map((line, idx) => (
                  <div
                    key={idx}
                    className="whitespace-pre-wrap leading-relaxed"
                  >
                    {line.startsWith("visitor@portfolio:~$") ? (
                      <span>
                        <span className="text-primary-container mr-2">
                          visitor@portfolio:~$
                        </span>
                        {line.slice(21)}
                      </span>
                    ) : (
                      <span className="text-surface-dim opacity-90">
                        {line}
                      </span>
                    )}
                  </div>
                ))}

                <div className="flex gap-2 items-center text-[#D9D3C7] mt-1">
                  <span className="text-primary-container">
                    visitor@portfolio:~$
                  </span>
                  <form onSubmit={handlePlaySubmit} className="flex-1">
                    <input
                      type="text"
                      id="terminal-input"
                      name="terminal-command"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck="false"
                      value={playInput}
                      onChange={(e) => setPlayInput(e.target.value)}
                      placeholder="type h..."
                      className="bg-transparent border-none outline-none w-full text-[#D9D3C7] font-mono-code text-[14px] focus:ring-0 p-0"
                      suppressHydrationWarning
                    />
                  </form>
                  <span className="w-2 h-4 bg-[#D9D3C7] animate-pulse inline-block"></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Redesigned Footer & Straightaway Contact Info */}
        <footer className="w-full relative overflow-hidden py-8 md:py-12 px-margin-mobile md:px-margin-desktop bg-inverse-surface border-t border-outline text-[#D9D3C7] mt-auto z-10">
          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover object-bottom md:object-[center_85%] z-0 opacity-80 pointer-events-none filter contrast-105 brightness-90"
          >
            <source src="/footer-video.mp4" type="video/mp4" />
          </video>
          {/* Dark Overlay for optimal text contrast */}
          <div className="absolute inset-0 bg-black/50 z-0 pointer-events-none" />

          <div className="max-w-7xl mx-auto w-full flex flex-col gap-6 md:gap-8 relative z-10">
            {/* Top Row: Say Hello & Thanks Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
              <div className="flex flex-col gap-3">
                <span className="font-mono-code text-[11px] md:text-[12px] uppercase tracking-widest text-primary font-bold">
                  GET IN TOUCH
                </span>
                <a
                  href="mailto:priyankmoradiya41@gmail.com"
                  className="font-display-xl-mobile md:font-display-xl text-[28px] md:text-[48px] uppercase tracking-tighter text-[#D9D3C7] hover:text-primary transition-colors duration-200"
                >
                  priyankmoradiya41@gmail.com
                </a>
              </div>

              {/* Thanks For Visiting Section */}
              <div className="flex flex-row items-center gap-4 md:mr-4 self-center md:self-auto select-none">
                <div className="font-mono-code text-[#D9D3C7] leading-relaxed">
                  <p className="font-headline-lg text-primary text-[26px] sm:text-[32px] md:text-[42px] font-extrabold uppercase tracking-wider drop-shadow-md">
                    Thanks for visiting!
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Row: Social Links & Copyright */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-t border-outline/20 pt-4 mt-2 font-mono-code text-[12px] md:text-[14px]">
              <div className="flex flex-row flex-wrap gap-x-6 gap-y-2 uppercase">
                <a
                  href="https://github.com/Priyankm23"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#D9D3C7] hover:text-primary transition-colors duration-150"
                >
                  GITHUB
                </a>
                <a
                  href="https://linkedin.com/in/priyankmoradiya"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#D9D3C7] hover:text-primary transition-colors duration-150"
                >
                  LINKEDIN
                </a>
                <a
                  href="https://x.com/priyank_M73"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#D9D3C7] hover:text-primary transition-colors duration-150"
                >
                  X (TWITTER)
                </a>
                <span className="text-primary flex items-center gap-1.5 font-bold">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  READY_FOR_HIRE
                </span>
              </div>
              <div className="text-[#C4BDB2] opacity-60 text-[11px] md:text-[12px]">
                © 2026 PRIYANK MORADIYA · BUILT WITH OBSESSION
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
