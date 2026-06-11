import { ProjectCard } from './ProjectCard';

export const Projects = () => {
  return (
    <section
      id="work"
      className="w-full bg-bg py-14 sm:py-16 md:py-24 px-5 sm:px-8 md:px-20 border-t border-border border-dashed"
    >
      <div className="max-w-6xl mx-auto w-full space-y-6 md:space-y-10">
        {/* Section label */}
        <div className="font-label text-xl md:text-2xl text-muted tracking-[0.15em]">
          02 — WORK
        </div>

        {/* Section title */}
        <h2 className="text-3xl md:text-5xl font-display font-bold text-ink leading-tight">
          FEATURED PROJECTS
        </h2>

        {/* Project cards */}
        <div className="space-y-8 md:space-y-12 mt-8 md:mt-12">
          {/* Cadence */}
          <ProjectCard
            title="Cadence"
            dates="May 2026 – Present"
            tech="Python · FastAPI"
            description="A real-time microservices platform capturing and analyzing meeting audio. Streams audio seamlessly via Socket.IO, transcribes speech using Whisper v3 via Groq API, and automatically extracts summaries and action items with Llama 3.3."
            tags={['FastAPI', 'Socket.IO', 'Groq API', 'Redis', 'PostgreSQL', 'Docker']}
            githubUrl="https://github.com/Priyankm23/Cadence-backend"
            liveUrl="https://cadence-meeting-intelligence.vercel.app/"
            image="/cadence.png"
            logoUrl="/cadence_logo.png"
          />

          {/* Markivo */}
          <ProjectCard
            title="Markivo"
            dates="Mar 2026 – Present"
            tech="TypeScript · Express"
            description="A high-throughput multi-vendor e-commerce API managing complex order lifecycles and idempotent Stripe payments. Uses PostgreSQL row-level locking to prevent inventory overselling, offloading intensive tasks to Redis and BullMQ queues."
            tags={['Express', 'PostgreSQL', 'Redis', 'BullMQ', 'Prisma', 'Zod']}
            githubUrl="https://github.com/Priyankm23/marketflow"
            liveUrl="https://marketflow-your-one-stop-shop.vercel.app/"
            image="/marketflow.png"
            logoUrl="/markivo_logo.png"
          />

          {/* SafeTrail */}
          <ProjectCard
            title="SafeTrail"
            dates="Jan – Feb 2026"
            tech="JavaScript · Node.js"
            description="A tourist safety API featuring decentralized identity on Polygon. Dynamically computes proximity-based safety scores using Haversine distance, operates auto-expiring itinerary geofences, and streams live SOS alerts via WebSockets."
            tags={['Express', 'MongoDB', 'Socket.IO', 'Ethers.js', 'Redis']}
            githubUrl="https://github.com/Priyankm23/safetrail"
            liveUrl="https://safetrail-your-safety-in-your-mobile.vercel.app/"
            image="/safetrail.png"
            logoUrl="/safetrail_logo.png"
          />

          {/* Bandit CLI - Hidden for now
          <ProjectCard
            title="Bandit CLI"
            dates="Jun 2026 – Present (Beta)"
            tech="TypeScript · Node.js"
            description="An interactive terminal workspace companion and auditor for backend developers. Automates codebase scans for route discovery, benchmarks endpoints under load with live latency percentiles, manages port processes, and audits env setups."
            tags={['TypeScript', 'Node.js', 'Commander', 'Clack Prompts', 'CLI', 'NPM Package']}
            githubUrl="https://github.com/Priyankm23/Backend-Audit-CLI-Tool---Bandit"
            liveUrl="https://www.npmjs.com/package/bandit-cli"
            image="/bandit.png"
            logoUrl="/bandit_logo.png"
          />
          */}
        </div>
      </div>
    </section>
  );
};
