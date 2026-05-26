"use client";

import React, { useState, useEffect, useRef } from "react";
import { Terminal, Workflow } from "lucide-react";

// Project Interface
interface Project {
  title: string;
  dates: string;
  tech: string;
  description: string;
  tags: string[];
  githubUrl: string;
  liveUrl?: string;
  image?: string;
  logoUrl?: string;
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
      { name: "Zod", slug: "zod" },
      { name: "BullMQ", fallback: <Workflow className="w-3.5 h-3.5" /> },
    ],
  },
];

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");

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
    ...HELP_LINES
  ]);
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  // Fetch real GitHub contribution data
  const [githubCommits, setGithubCommits] = useState<number>(234);
  const [githubRepos, setGithubRepos] = useState<number>(18);
  const [githubPRs, setGithubPRs] = useState<number>(7);
  const [githubStreak, setGithubStreak] = useState<number>(0);
  const [heatmapCells, setHeatmapCells] = useState<number[]>([]);

  useEffect(() => {
    const fetchGithubData = async () => {
      try {
        const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/+$/, "");
        const primaryUrl = `${apiBaseUrl}/api/github/contributions`;

        let response = await fetch(primaryUrl);

        // If local API or primary URL fetch fails in development, try fetching from the Vercel deployed backup
        if (!response.ok && apiBaseUrl !== "https://portfolio-vq3d.vercel.app") {
          response = await fetch("https://portfolio-vq3d.vercel.app/api/github/contributions");
        }

        if (response.ok) {
          const data = await response.json();
          if (data && typeof data.total === "number" && Array.isArray(data.days)) {
            setGithubCommits(data.total);
            if (typeof data.streak === "number") {
              setGithubStreak(data.streak);
            }
            
            const getLevel = (count: number) => {
              if (count === 0) return 0;
              if (count < 3) return 1;
              if (count < 6) return 2;
              if (count < 9) return 3;
              return 4;
            };

            const apiLevels = data.days.map((d: any) => getLevel(d.count));
            const targetLength = 140;
            let cells: number[] = [];
            if (apiLevels.length >= targetLength) {
              cells = apiLevels.slice(-targetLength);
            } else {
              cells = [...Array(targetLength - apiLevels.length).fill(0), ...apiLevels];
            }
            setHeatmapCells(cells);
            return;
          }
        }
      } catch (err) {
        console.error("Error fetching GitHub contributions:", err);
      }

      // Fallback
      const cells = Array.from({ length: 140 }, () => {
        const rand = Math.random();
        if (rand > 0.9) return 4;
        if (rand > 0.75) return 3;
        if (rand > 0.5) return 2;
        if (rand > 0.3) return 1;
        return 0;
      });
      setHeatmapCells(cells);
    };
    fetchGithubData();
  }, []);

  // Fetch real visitor count from the backend API
  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/+$/, "");
        const primaryUrl = `${apiBaseUrl}/api/visitor-count`;

        let response = await fetch(primaryUrl);

        // If primary call fails, try fetching from the Vercel deployed API as a live backup
        if (!response.ok && apiBaseUrl !== "https://portfolio-vq3d.vercel.app") {
          response = await fetch(
            "https://portfolio-vq3d.vercel.app/api/visitor-count"
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
              ...HELP_LINES
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
                ...HELP_LINES
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
        ...HELP_LINES
      ]);
    };
    fetchVisits();
  }, []);

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
      image: "/cadence.png",
      logoUrl: "/cadence_logo.png",
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
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDCaSrNF-c3XvGDxzmwLCgO51fCbAbhYKALOpXlmRlPrd-6MbVFhO9F6Ch1sTfUfCKhHEh4ND0iQoV4Kre6WtVcdFYCEKWTV_OT2wEkg7P1qY2rk8Pk1n5t9_3zCkHovZdSecE_jptiCbyHX5cdcb5FdQ0jF8h2EFY715ZB3OhYVUByKU5T4OTGHPXYN9kB2LRhJR35xU5TXoQkEwsEb08fNJse9kX8QF9zoszIo5R-pbPcVzFpn_QAbQrIcLHWe8my75DLxFxKtQa8",
      logoUrl: "/markivo_logo.png",
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
      logoUrl: "/safetrail_logo.png",
    },
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
        lines = [`sh: command not found: '${command}'. Type 'h' or 'help' for options.`];
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
        {/* Hero Section 00 */}
        <section
          id="hero"
          className="relative px-margin-mobile md:px-margin-desktop pt-4 pb-12 md:pt-8 md:pb-24 border-b border-1px border-outline flex flex-col justify-center min-h-[85vh] overflow-hidden z-10 bg-d9d3c7 text-on-surface"
        >
          {/* Lined Grid Overlay - Locally inside Hero */}
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

          <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center md:items-stretch relative z-10 gap-12 md:gap-gutter">
            <div className="flex flex-col gap-6 w-full md:w-[45%] justify-center">
              <div className="inline-block border border-1px border-primary px-3 py-1 bg-primary/10 text-primary font-mono-code text-mono-code w-max mx-auto md:mx-0 uppercase relative z-10">
                BACKEND DEVELOPER
              </div>
              <h1 className="font-display-xl-mobile md:font-display-xl text-display-xl-mobile md:text-display-xl uppercase text-on-surface tracking-wider relative z-10 text-center md:text-left min-h-[3.2em] md:min-h-0" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                BUILDING
                <br />
                SYSTEMS FOR
                <br />
                <span className="text-primary font-bold inline-block min-w-[13ch] text-center md:text-left text-[72px] sm:text-[90px] md:text-[110px] lg:text-[120px] leading-none whitespace-nowrap" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                  {words[dynamicWordIndex]}
                </span>
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md md:border-l-2 border-primary md:pl-4 relative z-10 text-center md:text-left mx-auto md:mx-0 border-l-0 pl-0">
                Full-stack thinking. Backend obsession. From raw APIs to
                distributed systems — <span className="whitespace-nowrap">I build</span> what holds everything together.
              </p>
              <div className="flex flex-row flex-wrap gap-5 mt-6 relative z-10 justify-center md:justify-start">
                {/* GitHub */}
                <a
                  href="https://github.com/Priyankm23"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  title="GitHub"
                  className="w-14 h-14 border border-1px border-on-surface bg-transparent text-primary flex items-center justify-center transition-all duration-150 cursor-pointer shadow-[3px_3px_0px_0px_rgba(27,28,28,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-on-surface hover:text-[#D9D3C7]"
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
                  className="w-14 h-14 border border-1px border-on-surface bg-transparent text-primary flex items-center justify-center transition-all duration-150 cursor-pointer shadow-[3px_3px_0px_0px_rgba(27,28,28,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-on-surface hover:text-[#D9D3C7]"
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
                  className="w-14 h-14 border border-1px border-on-surface bg-transparent text-primary flex items-center justify-center transition-all duration-150 cursor-pointer shadow-[3px_3px_0px_0px_rgba(27,28,28,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-on-surface hover:text-[#D9D3C7]"
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
                  className="w-14 h-14 border border-1px border-on-surface bg-transparent text-primary flex items-center justify-center transition-all duration-150 cursor-pointer shadow-[3px_3px_0px_0px_rgba(27,28,28,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-on-surface hover:text-[#D9D3C7]"
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
            {/* Hero Image Panel */}
            <div className="w-full md:w-[55%] relative z-10 shrink-0 flex items-center justify-center md:justify-end">
              <div className="relative w-full h-full flex items-center justify-center md:justify-end min-h-[380px] md:min-h-[480px]">
                {/* The main portrait (increased size, centered) */}
                <img
                  alt="Priyank Moradiya - Stylized Retro Portrait"
                  className="h-[320px] md:h-[420px] lg:h-[480px] w-auto object-contain object-bottom select-none pointer-events-none z-10"
                  src="/hero_portrait.png"
                  style={{ mixBlendMode: "multiply" }}
                />

                {/* 1. Database Storage (Top-Left) */}
                <div className="absolute top-[2%] left-[-3%] md:top-[12%] md:left-[0%] z-20">
                  <img
                    src="/simple_database.png"
                    alt="Database Storage"
                    className="w-24 h-24 md:w-36 md:h-36 object-contain select-none pointer-events-none"
                    style={{ mixBlendMode: "multiply" }}
                  />
                </div>

                {/* 2. Server (Top-Right, on other side of head) */}
                <div className="absolute top-[0%] right-[2%] md:top-[8%] md:right-[8%] z-20">
                  <img
                    src="/simple_server.png"
                    alt="Server Mainframe"
                    className="w-24 h-24 md:w-36 md:h-36 object-contain select-none pointer-events-none"
                    style={{ mixBlendMode: "multiply" }}
                  />
                </div>

                {/* 3. API Gateway / Router (Right-Side Middle, outside of silhouette) */}
                <div className="absolute top-[38%] right-[-3%] md:top-[42%] md:right-[-8%] z-20">
                  <img
                    src="/simple_router.png"
                    alt="API Gateway"
                    className="w-24 h-24 md:w-36 md:h-36 object-contain select-none pointer-events-none"
                    style={{ mixBlendMode: "multiply" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section 01 - Bento Console Grid */}
        <section
          id="about"
          className="relative px-margin-mobile md:px-margin-desktop py-16 border-b border-1px border-outline z-10 bg-surface text-on-surface"
        >
          <div className="max-w-6xl mx-auto w-full relative z-10">
            {/* Ghost Number / Watermark behind the entire section */}
            <div className="absolute -top-10 left-0 md:-left-4 font-display-xl-mobile md:font-display-xl text-[120px] md:text-[240px] text-primary opacity-10 pointer-events-none select-none z-0">
              01
            </div>

            <div className="relative z-10 mt-16">
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-wider uppercase mb-12 relative z-10">
                ABOUT
              </h2>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
              {/* Box A: Personal Specifications Card (col-span-5) */}
              <div className="lg:col-span-5 border border-on-surface p-6 flex flex-col shadow-[4px_4px_0px_0px_rgba(27,28,28,1)] bg-surface-container-lowest text-on-surface">
                {/* Personal Specs */}
                <div className="font-mono-code text-[13px] flex flex-col gap-4">
                  <div className="flex gap-2 items-center border-b border-outline/20 pb-2 mb-2">
                    <span className="material-symbols-outlined text-primary text-[16px]">
                      fingerprint
                    </span>
                    <span className="font-bold uppercase tracking-widest text-on-surface/80 text-[11px]">
                      SPECIFICATIONS
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 gap-x-4">
                    <div className="sm:col-span-1 text-on-surface-variant font-bold uppercase">
                      HOST:
                    </div>
                    <div className="sm:col-span-2 text-on-surface font-semibold">
                      priyank_moradiya
                    </div>

                    <div className="sm:col-span-1 text-on-surface-variant font-bold uppercase">
                      ACADEMICS:
                    </div>
                    <div className="sm:col-span-2 text-on-surface font-semibold text-[12px] sm:text-[13px]">
                      B.Tech (Information Technology)
                    </div>

                    <div className="sm:col-span-1 text-on-surface-variant font-bold uppercase">
                      ACADEMIC YEAR:
                    </div>
                    <div className="sm:col-span-2 text-on-surface font-semibold text-[12px] sm:text-[13px]">
                      4th Year (Final Year)
                    </div>

                    <div className="sm:col-span-1 text-on-surface-variant font-bold uppercase">
                      INSTITUTION:
                    </div>
                    <div className="sm:col-span-2 text-on-surface font-semibold text-[12px] leading-tight sm:text-[13px]">
                      G H Patel College of Engineering & Technology, Anand
                    </div>

                    <div className="sm:col-span-1 text-on-surface-variant font-bold uppercase">
                      CGPA:
                    </div>
                    <div className="sm:col-span-2 text-primary font-bold">
                      9.40 / 10.00
                    </div>

                    <div className="sm:col-span-1 text-on-surface-variant font-bold uppercase">
                      CORE FOCUS:
                    </div>
                    <div className="sm:col-span-2 text-on-surface font-semibold text-[12px] sm:text-[13px]">
                      High-Throughput APIs & Distributed Backends
                    </div>

                    <div className="sm:col-span-1 text-on-surface-variant font-bold uppercase">
                      LOC:
                    </div>
                    <div className="sm:col-span-2 text-on-surface font-semibold">
                      Anand, Gujarat, IN
                    </div>

                    <div className="sm:col-span-1 text-on-surface-variant font-bold uppercase">
                      LIVE_VISITS:
                    </div>
                    <div className="sm:col-span-2 font-bold flex items-center gap-1.5 text-primary">
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                      </span>
                      {visitorCount !== null ? (
                        <span className="font-mono-code text-[14px] tracking-widest">
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

              {/* Box B: Philosophy Log Console (col-span-7) */}
              <div className="lg:col-span-7 border border-on-surface p-6 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(27,28,28,1)] bg-surface-container-lowest text-on-surface relative overflow-hidden">
                {/* Content */}
                <div className="flex flex-col gap-5 relative z-10">
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-wider uppercase">
                    THE HONEST TRUTH.
                  </h2>
                  <div className="space-y-4 font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    <p>
                      I am a backend developer who tries to build optimized
                      backend systems. Although not claiming that the systems I
                      create are the best ones, everyday I am learning something
                      new to make it work under load.
                    </p>
                    <p>
                      I started with Node.js for my backend base, switch to
                      FastAPI for a while, and currently learning most of the
                      backend concepts deeply in Node.js.
                    </p>

                    {/* Personal Quote Mantra */}
                    <div className="pl-4 border-l-2 border-primary/40 italic text-on-surface-variant/85 font-body-md text-body-md mt-6 pt-1">
                      "Learning to optimize the system and on the journey to be
                      honest about the failures and bad architectural design
                      decisions because that's what would make the future
                      systems better."
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
          <div className="max-w-6xl mx-auto w-full relative z-10 mt-16">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project, idx) => (
                <div
                  key={idx}
                  className="bg-surface border border-1px border-on-surface p-6 flex flex-col gap-4 shadow-[4px_4px_0px_0px_rgba(27,28,28,1)] hover:-translate-y-1 transition-transform duration-200"
                >
                  <div className="flex justify-between items-start border-b border-outline pb-2">
                    <span className="bg-primary/10 border border-primary text-primary px-2 py-0.5 text-[11px] font-label-sm uppercase">
                      {project.tech}
                    </span>
                    <span className="text-on-secondary-container font-mono-code text-[12px]">
                      {project.dates}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-[30px] leading-none text-on-surface uppercase tracking-tight flex items-center gap-3">
                      {project.logoUrl && (
                        <img
                          src={project.logoUrl}
                          alt={`${project.title} logo`}
                          className="w-12 h-12 object-contain border border-on-surface bg-white p-1.5 rounded-sm shadow-[1.5px_1.5px_0px_0px_rgba(27,28,28,1)] mix-blend-multiply"
                        />
                      )}
                      <span>{project.title}</span>
                    </h3>
                    <p className="font-body-md text-[14px] text-on-secondary-container leading-relaxed mt-2">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {project.tags.map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className="border-2 border-primary text-on-surface bg-transparent px-2 py-0.5 text-[11px] font-mono-code uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 border-t border-outline/20 pt-3 mt-2">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[12px] font-label-sm uppercase text-primary hover:underline flex items-center gap-1"
                    >
                      SOURCE_CODE <span className="text-xs">→</span>
                    </a>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[12px] font-label-sm uppercase text-on-surface hover:underline flex items-center gap-1"
                      >
                        DEMO_LINK <span className="text-xs">→</span>
                      </a>
                    )}
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
          <div className="max-w-6xl mx-auto w-full relative z-10">
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
                    className="border border-1px border-on-surface p-6 bg-d9d3c7 shadow-[4px_4px_0px_0px_rgba(27,28,28,1)] text-on-surface"
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

        {/* Section 04: GitHub Contributions - White background, no grid lines */}
        <section
          id="contributions"
          className="bg-surface text-on-surface relative overflow-hidden px-margin-mobile md:px-margin-desktop py-16 border-b border-brutal z-10"
        >
          <div className="max-w-6xl mx-auto w-full relative z-10">
            {/* Ghost Number */}
            <div className="absolute -top-10 right-0 md:-right-4 font-display-xl-mobile md:font-display-xl text-[120px] md:text-[240px] text-primary opacity-10 pointer-events-none select-none z-0">
              04
            </div>
            <div className="relative z-10 flex flex-col md:grid md:grid-cols-12 gap-gutter mt-16">
              {/* Heading Area */}
              <div className="md:col-span-4 mb-8 md:mb-0">
                <h2 className="font-headline-lg text-on-surface uppercase flex items-center">
                  COMMIT HISTORY
                  <span className="text-primary ml-1 blink">_</span>
                </h2>
                <div className="h-px w-full bg-outline my-4"></div>
                <p className="font-mono-code text-on-surface-variant text-sm max-w-sm">
                  Raw output from the primary repository structure. Tracking
                  daily commits, merges, and system updates.
                </p>
              </div>
              {/* Heatmap Area */}
              <div className="md:col-span-8 flex flex-col gap-6">
                 {/* Stats Row */}
                <div className="flex flex-wrap gap-4 border-l border-brutal pl-4">
                  <div className="flex flex-col">
                    <span className="font-headline-md text-primary">{githubCommits}</span>
                    <span className="font-label-sm text-on-surface-variant uppercase">
                      COMMITS
                    </span>
                  </div>
                  <div className="w-px h-auto bg-brutal mx-2 hidden md:block text-outline"></div>
                  <div className="flex flex-col">
                    <span className="font-headline-md text-primary">{githubRepos}</span>
                    <span className="font-label-sm text-on-surface-variant uppercase">
                      REPOS
                    </span>
                  </div>
                  <div className="w-px h-auto bg-brutal mx-2 hidden md:block text-outline"></div>
                  <div className="flex flex-col">
                    <span className="font-headline-md text-primary">
                      {githubPRs < 10 ? `0${githubPRs}` : githubPRs}
                    </span>
                    <span className="font-label-sm text-on-surface-variant uppercase">
                      PRs
                    </span>
                  </div>
                  <div className="w-px h-auto bg-brutal mx-2 hidden md:block text-outline"></div>
                  <div className="flex flex-col">
                    <span className="font-headline-md text-primary">
                      {githubStreak < 10 ? `0${githubStreak}` : githubStreak}
                    </span>
                    <span className="font-label-sm text-on-surface-variant uppercase">
                      STREAK
                    </span>
                  </div>
                </div>
                {/* Grid */}
                <div className="bg-[#111111] border border-brutal-dark p-4 overflow-x-auto w-full max-w-full">
                  <div className="grid grid-flow-col grid-rows-7 gap-1 w-max">
                    {heatmapCells.map((heat, idx) => (
                      <div
                        key={idx}
                        className={`w-3 h-3 rounded-sm heat-${heat}`}
                      />
                    ))}
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
                  className="inline-flex items-center gap-2 border border-on-surface px-4 py-2 w-max text-on-surface font-label-sm hover:bg-primary hover:text-on-primary transition-colors duration-0 uppercase cursor-pointer"
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

        {/* Section 05: Experience - White background, no grid lines */}
        <section
          id="experience"
          className="relative px-margin-mobile md:px-margin-desktop py-16 border-b border-1px border-outline z-10 bg-surface text-on-surface"
        >
          <div className="max-w-6xl mx-auto w-full relative z-10">
            {/* Ghost Number */}
            <div className="absolute -top-10 left-0 md:-left-4 font-display-xl-mobile md:font-display-xl text-[120px] md:text-[240px] text-primary opacity-10 pointer-events-none select-none z-0">
              05
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mt-16 relative z-10">
              {/* Heading */}
              <div className="md:col-span-4 mb-10 md:mb-0 relative">
                <div className="absolute left-0 top-14 bottom-0 w-px bg-brutal hidden md:block ml-[7px]"></div>
                <h2 className="font-headline-lg text-on-surface uppercase relative z-10 bg-surface pr-4 inline-block tracking-wider">
                  WHERE I'VE WORKED
                </h2>
                <div className="h-px w-full bg-outline my-4"></div>
                <p className="font-mono-code text-on-surface-variant text-sm">
                  Professional deployments and architectural leadership across
                  various systems.
                </p>
              </div>
              {/* Timeline */}
              <div className="md:col-span-8 relative">
                <div className="absolute left-0 top-0 bottom-0 w-px bg-brutal ml-3 md:hidden"></div>
                <div className="flex flex-col gap-8 md:gap-12 relative z-10">
                  {/* Job 1: Infosys Springboard */}
                  <div className="relative pl-10 md:pl-0 group">
                    <div className="absolute left-0 top-2 w-6 h-6 bg-surface border border-primary flex items-center justify-center -ml-[9px] md:hidden">
                      <div className="w-2 h-2 bg-primary group-hover:bg-on-surface transition-colors duration-0"></div>
                    </div>
                    <div className="border border-brutal bg-surface-container-lowest p-5 hover:border-on-surface transition-colors duration-0">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-4 border-b border-outline/30 pb-3">
                        <div>
                          <h3 className="font-headline-md text-[32px] md:text-[40px] leading-none text-on-surface uppercase mb-1">
                            PYTHON BACKEND INTERN
                          </h3>
                          <div className="font-mono-code text-primary font-bold uppercase text-sm">
                            INFOSYS SPRINGBOARD
                          </div>
                        </div>
                        <div className="font-mono-code text-on-surface-variant text-sm mt-2 md:mt-0 bg-surface-variant px-2 py-1 inline-block w-max border border-brutal">
                          AUG 2025 — OCT 2025
                        </div>
                      </div>

                      <div className="font-mono-code text-on-surface-variant text-xs mb-4">
                        Python Backend Intern · Remote · Anand, Gujarat, India
                      </div>

                      <ul className="font-body-md text-on-surface-variant space-y-3">
                        <li className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-primary text-[18px] mt-1">
                            arrow_forward
                          </span>
                          <span>
                            Contributed to a two-month virtual internship within
                            a 25+ member team, utilizing Agile/Scrum methodology
                            across 4 two-week sprints.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-primary text-[18px] mt-1">
                            arrow_forward
                          </span>
                          <span>
                            Developed the Crypto Portfolio Manager using Python
                            and Streamlit.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-primary text-[18px] mt-1">
                            arrow_forward
                          </span>
                          <span>
                            Implemented Strategic Portfolio Construction and
                            integrated Machine Learning (Ridge Regression) for
                            predictive modeling.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-primary text-[18px] mt-1">
                            arrow_forward
                          </span>
                          <span>
                            Focused on professional development through daily
                            stand-up meetings and maintaining Agile
                            documentation (Test Cases, Product Backlog).
                          </span>
                        </li>
                      </ul>

                      {/* Certificate Link */}
                      <div className="pt-4 border-t border-outline/10 mt-4">
                        <a
                          href="https://bit.ly/Priyank-InfosysCert"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 border border-primary px-3 py-1.5 font-label-sm text-[11px] text-primary hover:bg-primary hover:text-on-primary transition-colors duration-0 uppercase cursor-pointer"
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
          <div className="max-w-6xl mx-auto w-full relative z-10">
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
            <div className="border border-[#C4BDB2] bg-[#1A1A1A] flex flex-col mt-base shadow-sm text-surface relative z-10">
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
        <footer className="w-full py-8 md:py-10 px-margin-mobile md:px-margin-desktop bg-inverse-surface border-t border-outline text-[#D9D3C7] mt-auto z-10">
          <div className="max-w-6xl mx-auto w-full flex flex-col gap-5">
            {/* Top Row: Say Hello & Witty Dev Card */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
              <div className="flex flex-col gap-3">
                <span className="font-mono-code text-[11px] md:text-[12px] uppercase tracking-widest text-primary">
                  GET IN TOUCH
                </span>
                <a
                  href="mailto:priyankmoradiya41@gmail.com"
                  className="font-display-xl-mobile md:font-display-xl text-[28px] md:text-[48px] uppercase tracking-tighter text-[#D9D3C7] hover:text-primary transition-colors duration-200"
                >
                  priyankmoradiya41@gmail.com
                </a>
              </div>

              {/* Memorable GigaChad Meme Section */}
              <div className="flex flex-row items-center gap-4 border border-outline bg-surface p-4 shadow-[4px_4px_0px_0px_rgba(27,28,28,1)] max-w-md md:mr-4 select-none">
                <img
                  src="/gigachad_avatar.png"
                  alt="GigaChad Developer"
                  className="w-16 h-16 md:w-20 md:h-20 object-cover border border-on-surface rounded-sm bg-white p-0.5 shadow-[1.5px_1.5px_0px_0px_rgba(27,28,28,1)] mix-blend-multiply"
                />
                <div className="flex-1 font-mono-code text-[11px] md:text-[12px] text-on-surface leading-relaxed">
                  <p className="font-bold text-primary mb-1">
                    GigaChad Backend Dev:
                  </p>
                  <p className="italic">
                    "Optimizes SQL indexes to save 2ms of query latency. Spends
                    4 hours picking a navbar font."
                  </p>
                  <p className="font-bold italic text-right mt-1">
                    "Refuses to elaborate."
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
