"use client";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { ArrowRight } from "lucide-react";
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
      filter: "blur(0px)",
      transition: {
        delay: i * 0.4,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  const scaleVariants = {
    visible: (i: number) => ({
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.4,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      opacity: 0,
    },
  };

  return (
    <section
      id="about"
      className="pt-16 pb-8 px-margin-mobile md:px-margin-desktop bg-[#0a0a0a] text-[#D9D3C7] relative z-10"
      ref={heroRef}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section label above the content */}
        <div className="flex items-center mb-10 w-full">
          <div className="flex items-center gap-2 text-xl">
            <span className="text-primary animate-spin">✱</span>
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
                {`Crafting\nSystems\nThat\nMake\na\nDifference.`}
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
                I am a backend developer focused on engineering optimized backend systems. While not claiming every system I create is perfect, every day I am learning and iterating to make services perform reliably under load.
              </p>
              <p>
                I love building REST API endpoints, designing relational database schemas, and defining Redis caching layers with single-flight request patterns. My microservices leverage gRPC for inter-service communication and RabbitMQ for async task offloading. Everything is containerized with Docker, verified via load testing (k6, Autocannon), unit/integration tested (Jest, Supertest, Pytest), and monitored using Pino logs and Sentry observability. The skills remain the same, only the learnings get adapted with the new and unique business logic across different projects.
              </p>
              <p>
                I started with Node.js for my backend foundation, explored FastAPI, and am currently diving deep into core Node.js concepts while contributing to open source, solving LeetCode SQL challenges, and always welcome tech discussions.
              </p>
              <p className="pl-4 border-l-2 border-primary/60 italic text-[#D9D3C7]/80">
                "Learning to optimize the system and on the journey to be honest about the failures and bad architectural design decisions because that's what would make the future systems better."
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

            {/* GPA, Portfolio visits and College name/Relocation below the video */}
            <div className="flex flex-col gap-2 py-4 border-b border-[#222]/60 font-sans text-sm">
              <TimelineContent
                as="div"
                animationNum={3}
                timelineRef={heroRef}
                customVariants={revealVariants}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="text-primary font-bold">9.48</span>
                  <span className="text-[#D9D3C7]">CGPA (B.Tech IT)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary font-bold">
                    {visitorCount !== null ? `${visitorCount}` : "1,200+"}
                  </span>
                  <span className="text-[#D9D3C7]">portfolio visits</span>
                </div>
              </TimelineContent>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 justify-between mt-1 text-xs sm:text-sm">
                <TimelineContent
                  as="div"
                  animationNum={3}
                  timelineRef={heroRef}
                  customVariants={revealVariants}
                  className="flex items-center gap-2"
                >
                  <span className="text-primary font-semibold">GCET</span>
                  <span className="text-[#D9D3C7] uppercase">Anand, Gujarat</span>
                </TimelineContent>

                <TimelineContent
                  as="div"
                  animationNum={3}
                  timelineRef={heroRef}
                  customVariants={revealVariants}
                  className="flex items-center gap-2"
                >
                  <span className="text-primary font-bold">OPEN</span>
                  <span className="text-[#D9D3C7]">to remote / relocation</span>
                </TimelineContent>
              </div>
            </div>

            {/* Contact, Name, Role under stats */}
            <div className="text-left font-sans flex flex-col items-start gap-4 mt-2">
              <div className="flex flex-col gap-1">
                <TimelineContent
                  as="div"
                  animationNum={4}
                  timelineRef={heroRef}
                  customVariants={revealVariants}
                  className="text-primary text-2xl font-bold uppercase tracking-wider"
                >
                  PRIYANK MORADIYA
                </TimelineContent>
                <TimelineContent
                  as="div"
                  animationNum={4}
                  timelineRef={heroRef}
                  customVariants={revealVariants}
                  className="text-[#D9D3C7] text-sm uppercase tracking-widest font-semibold"
                >
                  Backend Developer
                </TimelineContent>
              </div>

              <TimelineContent
                as="div"
                animationNum={5}
                timelineRef={heroRef}
                customVariants={revealVariants}
                className="text-[#D9D3C7] text-sm md:text-base leading-relaxed"
              >
                <p className="font-medium">
                  Ready to build reliable, optimized backend architectures for
                  your services?
                </p>
              </TimelineContent>

              <TimelineContent
                as="a"
                animationNum={6}
                timelineRef={heroRef}
                customVariants={revealVariants}
                href="mailto:priyankmoradiya41@gmail.com"
                className="bg-neutral-900 hover:bg-[#b02600] border border-neutral-800 hover:border-[#b02600] inline-flex items-center gap-2 hover:gap-4 transition-all duration-300 ease-in-out text-white px-5 py-3 rounded-lg cursor-pointer font-semibold shadow-md uppercase tracking-wider text-xs md:text-sm mt-2"
              >
                LET'S TALK <ArrowRight className="w-4 h-4" />
              </TimelineContent>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
