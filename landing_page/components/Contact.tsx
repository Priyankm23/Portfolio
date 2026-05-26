import { InteractiveGrid } from "./InteractiveGrid";

export const Contact = () => {
  return (
    <section
      id="contact"
      className="relative w-full bg-surface py-16 sm:py-20 md:py-32 px-5 sm:px-8 md:px-20 overflow-hidden"
    >
      {/* Large stencil background >_ */}
      <div
        className="absolute top-8 right-8 font-display font-bold pointer-events-none select-none leading-none"
        style={{
          fontSize: 'clamp(6rem, 20vw, 22rem)',
          color: 'var(--border)',
          userSelect: 'none',
        }}
      >
        {'> _'}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          <div className="w-full lg:w-1/2 space-y-8">
        {/* Section label */}
        <div className="font-label text-xl md:text-2xl text-muted uppercase tracking-widest">
          05 — CONTACT
        </div>

        {/* Main headline */}
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-ink leading-tight">
            LET&apos;S BUILD
          </h2>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-ink leading-tight md:ml-10">
            SOMETHING.
          </h2>
        </div>

        {/* Divider */}
        <div className="w-48 py-4">
          <hr />
        </div>

        {/* Contact links */}
        <div className="space-y-3">
          <a
            href="mailto:priyankmoradiya41@gmail.com"
            className="block font-body text-base md:text-lg text-accent no-underline transition-all hover:underline"
          >
            priyankmoradiya41@gmail.com
          </a>
          <a
            href="https://github.com/Priyankm23"
            target="_blank"
            rel="noopener noreferrer"
            className="block font-body text-base md:text-lg text-muted transition-colors hover:text-[var(--color-accent)] hover:underline"
          >
            github.com/Priyankm23
          </a>
          <a
            href="https://linkedin.com/in/priyankmoradiya"
            target="_blank"
            rel="noopener noreferrer"
            className="block font-body text-base md:text-lg text-muted transition-colors hover:text-[var(--color-accent)] hover:underline"
          >
            linkedin.com/in/priyankmoradiya
          </a>
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <a
            href="mailto:priyankmoradiya41@gmail.com"
            className="inline-block border border-[var(--color-accent)] text-[var(--color-accent)] font-label text-sm px-6 md:px-8 py-3 md:py-4 uppercase tracking-widest hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] transition-all active:scale-95"
          >
            [ SEND A MESSAGE → ]
          </a>
        </div>
        </div>
        
        {/* RIGHT — Interactive Grid */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-12 lg:mt-0">
          <InteractiveGrid className="w-full" />
        </div>
        </div>
      </div>
    </section>
  );
};
