import type { CSSProperties } from 'react';

export const StatsStrip = () => {
  const statNumbers: CSSProperties = {
    fontFamily: '"Space Mono", monospace',
    fontWeight: 700,
    color: 'var(--accent)',
    fontSize: 'clamp(2.25rem, 5vw, 3rem)',
    lineHeight: 1,
  };

  const statLabel: CSSProperties = {
    fontFamily: '"Bebas Neue", sans-serif',
    fontSize: '0.8rem',
    letterSpacing: '0.15em',
    color: 'var(--muted)',
    textTransform: 'uppercase' as const,
    marginTop: '6px',
  };

  const bioText: CSSProperties = {
    fontFamily: '"IBM Plex Mono", monospace',
    fontSize: '0.875rem',
    color: 'var(--muted)',
    lineHeight: 1.6,
  };

  return (
    <section
      style={{
        width: '100%',
        background: 'var(--surface)',
        borderTop: '1px dashed var(--border)',
        borderBottom: '1px dashed var(--border)',
        padding: 'clamp(32px, 5vw, 64px) 0',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          padding: '0 clamp(20px, 4vw, 40px)',
        }}
        className="grid-cols-2 md:grid-cols-4"
      >
        {/* Bio */}
        <div
          style={{ borderRight: '1px dashed var(--border)', paddingRight: 'clamp(16px, 3vw, 32px)', gridColumn: 'span 2' }}
          className="col-span-2 md:col-span-1 pb-6 md:pb-0 mb-6 md:mb-0 border-b md:border-b-0 border-dashed border-[var(--border)]"
        >
          <p style={bioText}>B.Tech IT @ GCET</p>
          <p style={bioText}>CGPA: 9.4 / 10</p>
          <p style={bioText}>Anand, Gujarat</p>
        </div>

        {/* SGPA */}
        <div
          style={{ borderRight: '1px dashed var(--border)', padding: '0 clamp(16px, 3vw, 32px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          className="pb-6 md:pb-0"
        >
          <div style={statNumbers}>9.79</div>
          <p style={statLabel}>SGPA — 5th Sem</p>
        </div>

        {/* Projects */}
        <div
          style={{ borderRight: '1px dashed var(--border)', padding: '0 clamp(16px, 3vw, 32px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          className="pb-6 md:pb-0"
        >
          <div style={statNumbers}>2</div>
          <p style={statLabel}>Production Projects</p>
        </div>

        {/* Tech Stacks */}
        <div
          style={{ padding: '0 clamp(16px, 3vw, 32px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        >
          <div style={statNumbers}>4+</div>
          <p style={statLabel}>Tech Stacks Mastered</p>
        </div>
      </div>
    </section>
  );
};
