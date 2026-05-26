export const Experience = () => {
  return (
    <section id="experience" className="w-full bg-bg py-16 md:py-24 px-5 md:px-20 border-t border-dashed border-border">
      <div className="max-w-6xl mx-auto w-full space-y-8 md:space-y-12">
        {/* Section label */}
        <div className="font-label text-xl md:text-2xl text-muted tracking-[0.15em]">
          04 — EXPERIENCE
        </div>

        {/* Section title */}
        <h2 className="text-3xl md:text-5xl font-display font-bold text-ink leading-tight">
          WHERE I&apos;VE WORKED
        </h2>

        {/* Timeline */}
        <div className="relative pl-8 md:pl-14 mt-4">
          {/* Vertical line */}
          <div className="absolute left-0 top-3 bottom-0 w-px bg-border" />

          {/* Timeline item */}
          <div className="relative pb-12">
            {/* Dot — 6px circle, hollow, on the line */}
            <div
              className="absolute -left-[25px] top-2 w-3 h-3 rounded-full border border-accent bg-bg"
              style={{ borderWidth: '1px' }}
            />

            {/* Content */}
            <div className="space-y-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-0">
                <h3 className="font-display text-lg md:text-xl font-bold text-ink uppercase">
                  Infosys Springboard
                </h3>
                <span className="font-label text-sm text-muted tracking-[0.15em]">
                  Aug 2025 – Oct 2025
                </span>
              </div>

              <p className="font-body text-sm text-muted">
                Python Backend Intern · Remote · Anand, Gujarat, India
              </p>

              {/* Divider */}
              <div className="py-2 w-32">
                <hr />
              </div>

              {/* Project description */}
              <div className="space-y-2">
                <ul className="list-disc pl-5 font-body text-sm text-muted leading-relaxed space-y-2 marker:text-accent">
                  <li>Contributed to a two-month virtual internship within a 25+ member team, utilizing Agile/Scrum methodology across 4 two-week sprints.</li>
                  <li>Developed the Crypto Portfolio Manager using Python/Streamlit.</li>
                  <li>Implemented Strategic Portfolio Construction and integrated Machine Learning (Ridge Regression) for predictive modeling.</li>
                  <li>Focused on professional development through daily stand-up meetings and maintaining Agile documentation (Test Cases, Product Backlog).</li>
                </ul>
              </div>

              {/* Certificate Link */}
              <div className="pt-2">
                <a 
                  href="https://bit.ly/Priyank-InfosysCert" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-body text-sm text-accent no-underline transition-all hover:underline hover:text-[var(--color-accent)] inline-flex items-center gap-1"
                >
                  View Certificate ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
