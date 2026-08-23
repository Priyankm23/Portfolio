export const About = () => {
  return (
    <section 
      id="about"
      className="relative w-full bg-bg py-16 md:py-24 px-5 sm:px-8 md:px-20 border-t border-border border-dashed overflow-hidden"
    >
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-85 pointer-events-none filter contrast-105 brightness-95"
      >
        <source src="/video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/35 z-0 pointer-events-none" />

      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 z-20">
        <span className="font-label text-sm md:text-base text-white/70 tracking-[0.2em] uppercase drop-shadow-sm">
          Who I Am
        </span>
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className="max-w-4xl">
        {/* Section label */}
        <div className="font-label text-xl md:text-2xl text-white/80 tracking-[0.15em] mb-8 drop-shadow-sm">
          01 — ABOUT
        </div>

        {/* Section title */}
        <h2 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight mb-8 drop-shadow-md">
          THE HONEST TRUTH.
        </h2>

        {/* Content */}
        <div 
          className="space-y-4 text-white/90 font-body text-base md:text-lg leading-relaxed"
          style={{ fontFamily: '"IBM Plex Mono", monospace' }}
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
          <p className="pl-4 border-l-2 border-accent/60 italic text-white/80">
            "Learning to optimize the system and on the journey to be honest about the failures and bad architectural design decisions because that's what would make the future systems better."
          </p>
        </div>
        </div>
      </div>
    </section>
  );
};
