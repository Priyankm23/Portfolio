import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ProjectCard } from '@/components/ProjectCard';

export default function WorkPage() {
  return (
    <main className="w-full bg-bg min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-1 pt-24 pb-14 sm:pb-16 md:pb-24 px-5 sm:px-8 md:px-20">
        <div className="max-w-6xl mx-auto w-full space-y-6 md:space-y-10">
          {/* Page title */}
          <h1 className="text-4xl md:text-6xl font-display font-bold text-ink leading-tight mt-10">
            ALL PROJECTS
          </h1>
          <p className="font-body text-lg text-muted max-w-2xl">
            A comprehensive list of my selected work, featuring robust backend systems, 
            developer tools, and full-stack applications.
          </p>

          {/* Project cards */}
          <div className="space-y-8 md:space-y-12 mt-12 md:mt-16">
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
      </div>

      <Footer />
    </main>
  );
}
