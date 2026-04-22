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
          {/* SafeTrail */}
          <ProjectCard
            title="SafeTrail"
            dates="Jan – Feb 2026"
            tech="Node.js · MongoDB"
            description="Architected a REST API for a tourist safety platform with digital identity stored on Polygon via Ethers.js. Engineered a Risk Engine computing dynamic proximity-wise safety scores from SOS alerts and crowdsourced incidents using Haversine distance. Built an itinerary-driven safe zone system generating auto-expiring geofences. Integrated Socket.IO for real-time live SOS dashboard streaming to authorities."
            tags={['Node.js', 'MongoDB', 'Socket.IO', 'Ethers.js', 'Redis']}
            githubUrl="https://github.com/Priyankm23/safetrail"
            liveUrl="https://safetrail-your-safety-in-your-mobile.vercel.app/"
            image="/safetrail.png"
          />

          {/* MarketFlow */}
          <ProjectCard
            title="MarketFlow"
            dates="Mar 2026 – Present"
            tech="TypeScript · Node.js"
            description="Built a multi-vendor REST API backend serving Customers, Vendors, and Delivery Partners with role-based JWT auth. Implemented the end-to-end order lifecycle including cart, active reservations, and Stripe payments with idempotency. Prevented inventory overselling via PostgreSQL row-level locking. Offloaded emails and scheduled syncs to BullMQ and cached product searches in Redis with TTL."
            tags={['PostgreSQL', 'Redis', 'BullMQ', 'PM2', 'Prisma', 'Zod']}
            githubUrl="https://github.com/Priyankm23/marketflow"
            liveUrl="https://marketflow-your-one-stop-shop.vercel.app/"
            image="/marketflow.png"
          />
        </div>
      </div>
    </section>
  );
};
