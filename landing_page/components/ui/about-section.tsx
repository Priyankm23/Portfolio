"use client";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { PixelDiamond } from "@/components/ui/pixel-icons";
import { useRef } from "react";

interface AboutSectionProps {
  visitorCount?: number | string | null;
}

export default function AboutSection3({
  visitorCount = null,
}: AboutSectionProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
    hidden: {
      y: 15,
      opacity: 0,
    },
  };

  const scaleVariants = {
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
    hidden: {
      opacity: 0,
      y: 15,
    },
  };

  return (
    <section
      id="about"
      className="pt-20 pb-20 md:pt-28 md:pb-28 px-margin-mobile md:px-margin-desktop bg-[#0a0a0a] text-[#D9D3C7] relative z-10 overflow-hidden"
      ref={heroRef}
    >
      {/* Hoplite ASCII Art Texture Layer with smooth vertical feathered blend */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[url(/landing/ascii-art.webp)] bg-cover bg-center opacity-10 mix-blend-screen [mask-image:linear-gradient(to_bottom,transparent_0%,black_20%,black_80%,transparent_100%)]"
      />

      <div className="max-w-7xl mx-auto w-full">
        {/* Section label above the content */}
        <div className="flex items-center mb-10 w-full">
          <div className="flex items-center gap-2 text-xl">
            <PixelDiamond className="size-4 text-primary animate-pulse" />
            <TimelineContent
              as="span"
              animationNum={0}
              timelineRef={heroRef}
              customVariants={revealVariants}
              className="text-sm font-semibold tracking-wider text-zinc-400 font-sans uppercase"
            >
              WHO I AM
            </TimelineContent>
          </div>
        </div>

        {/* Split Section Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column: Title and Description */}
          <div className="flex flex-col gap-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] !leading-[110%] font-bold text-zinc-100 uppercase tracking-wide font-sans">
              <VerticalCutReveal
                splitBy="lines"
                staggerDuration={0.12}
                staggerFrom="first"
                reverse={true}
                transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 30,
                  delay: 0.5,
                }}
              >
                {`Crafting\nSystems\nThat Make\na\nDifference.`}
              </VerticalCutReveal>
            </h1>

            <TimelineContent
              as="div"
              animationNum={2}
              timelineRef={heroRef}
              customVariants={revealVariants}
              className="flex flex-col gap-6 text-[#D9D3C7] font-sans text-[15px] sm:text-base leading-relaxed text-justify"
            >
              <p>
                I am a backend developer focused on engineering optimized backend systems. While not claiming every system I create is perfect, every day I am learning and iterating to make services <span className="bg-[#D9D3C7] text-primary px-1.5 py-0.5 font-semibold whitespace-nowrap">perform reliably</span> under load.
              </p>
              <p>
                My work revolves around finding <span className="bg-[#D9D3C7] text-primary px-1.5 py-0.5 font-semibold whitespace-nowrap">bottlenecks</span> in web systems and optimizing them until the end users are genuinely satisfied with the product. I build across API endpoints, database layers, caching strategies, real-time pipelines, and whatever the system demands. I test at scale, profile under pressure, and iterate until the numbers tell me to stop. I openly use <span className="bg-[#D9D3C7] text-primary px-1.5 py-0.5 font-semibold whitespace-nowrap">AI as part of my workflow</span> — where the work demands creative thinking or speed, I take the front seat; where it's repetitive and predictable, AI is guided with structured context through <span className="bg-[#D9D3C7] text-primary px-1.5 py-0.5 font-semibold whitespace-nowrap">skills, MCPs, and .md files</span> to get maximum leverage from the looping capability of agents and the reasoning of LLMs.
              </p>
              <p>
                I started with Node.js for my backend foundation, explored FastAPI, and am currently diving deep into core Node.js concepts while contributing to <span className="bg-[#D9D3C7] text-primary px-1.5 py-0.5 font-semibold whitespace-nowrap">open source</span>, solving LeetCode SQL challenges, and always welcome tech discussions.
              </p>
              <p>
                Learning to optimize the system and on the journey to be honest about the failures and bad architectural design decisions because that's what would make the future systems better.
              </p>
            </TimelineContent>
          </div>

          {/* Right Column: Video, Stats, and Contact */}
          <div className="flex flex-col gap-6 w-full">
            {/* Video Component */}
            <TimelineContent
              as="figure"
              animationNum={1}
              timelineRef={heroRef}
              customVariants={scaleVariants}
              className="relative z-20 group w-full"
            >
              {/* Minimalistic, panoramic short-height video with no borders or rounded corners */}
              <div
                className="w-full bg-[#0a0a0a] overflow-hidden"
                style={{
                  aspectRatio: "2.5 / 1",
                }}
              >
                <video
                  src="/video2.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            </TimelineContent>

            {/* Profile Bio */}
            <div className="mt-2 flex flex-col gap-4 font-sans">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-primary font-bold text-xl sm:text-2xl tracking-wide uppercase leading-tight">
                    PRIYANK MORADIYA
                  </h3>
                  <span className="text-[#D9D3C7]/60 text-[10px] tracking-widest uppercase font-semibold">
                    Backend Developer
                  </span>
                </div>
                <span className="text-primary text-xl select-none animate-spin">✱</span>
              </div>

              <p className="text-[#D9D3C7]/90 text-sm sm:text-base leading-relaxed italic border-l-2 border-primary/60 pl-3">
                "Looking for opportunities to contribute to backend engineering teams and grow as a developer."
              </p>

              {/* Education & Status Metadata */}
              <div className="flex flex-col gap-2.5 pt-3 border-t border-white/10 text-xs sm:text-sm font-sans">
                <div className="flex items-center gap-2.5 text-[#D9D3C7]/80">
                  <span className="material-symbols-outlined text-[16px] text-primary select-none">school</span>
                  <span>GCET, IT'27 - Anand, Gujarat</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#D9D3C7]/80">
                  <span className="material-symbols-outlined text-[16px] text-primary select-none">work</span>
                  <span>Open for Internships, Roles & Opportunities</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
