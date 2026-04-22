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

            {/* Bandit */}
            <ProjectCard
              title="Bandit"
              dates="Feb 2026 – Present"
              tech="TypeScript · CLI"
              description="A CLI tool which can audit your backend project for the important and best practices of creating an industry-grade backend by checking for required package files and dependencies, whether your env variables are ignored in .gitignore or not, what type of framework is being used, does it contain src/ file structure and many more comprehensive checks."
              tags={['Commander', 'Zod', 'Chalk', 'Ora', 'Fast-Glob', 'JS-YAML']}
              beta={true}
              image="/bandit.png"
            />

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

            {/* Subscription Tracker */}
            <ProjectCard
              title="Subscription Tracker"
              dates="May – June 2025"
              tech="Node.js · Express"
              description="A full-featured Node.js backend for tracking user subscriptions, sending automated email renewal reminders using Upstash Workflows, Nodemailer, and Google OAuth for authentication. Secured routes with Arcjet API protection against abuse."
              tags={['MongoDB', 'Mongoose', 'Upstash', 'Passport.js', 'Arcjet']}
              githubUrl="https://github.com/Priyankm23/subscription-tracker"
              liveUrl="https://subscription-tracker-pvms.onrender.com/"
              image="/subscriptiontracker.png"
            />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
