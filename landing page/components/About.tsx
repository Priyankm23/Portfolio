export const About = () => {
  return (
    <section 
      id="about"
      className="w-full bg-bg py-16 md:py-24 px-5 sm:px-8 md:px-20 border-t border-border border-dashed"
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="max-w-4xl">
        {/* Section label */}
        <div className="font-label text-xl md:text-2xl text-muted tracking-[0.15em] mb-8">
          01 — ABOUT
        </div>

        {/* Section title */}
        <h2 className="text-3xl md:text-5xl font-display font-bold text-ink leading-tight mb-8">
          THE HONEST TRUTH.
        </h2>

        {/* Content */}
        <div 
          className="space-y-6 text-muted font-body text-base md:text-lg leading-relaxed"
          style={{ fontFamily: '"IBM Plex Mono", monospace' }}
        >
          <p>
            I am a backend developer who tries to build optimized backend systems. Although not claiming that the systems I create are the best ones, everyday I am learning something new to make it work under load.
          </p>
          <p>
            I am not that guy who would claim false statements of creating a <span className="text-accent">"scalable architecture"</span> because I know what it means to create true scalable systems. The systems that should handle server load with P(95-98) and the systems which actually use the industry-aligned design principles like load balancing, caching, and async request processing.
          </p>
          <p>
            I started with Node.js for my backend base, then switched to FastAPI for a while, and currently learning most of the backend concepts deeply in Node.js.
          </p>
          <p className="pl-4 border-l-2 border-accent/40 italic">
            "Learning to optimize the system and on the journey to be honest about the failures and bad architectural design decisions because that's what would make the future systems better."
          </p>
        </div>
        </div>
      </div>
    </section>
  );
};
