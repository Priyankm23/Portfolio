'use client';

import { 
  Terminal, 
  Workflow
} from 'lucide-react';
import React from 'react';

const BrandIcon = ({ slug, fallback }: { slug?: string; fallback: React.ReactNode }) => {
  if (!slug) return <span className="flex items-center justify-center w-4 h-4">{fallback}</span>;
  
  return (
    <div 
      className="w-4 h-4 bg-current transition-colors"
      style={{
        maskImage: `url(https://cdn.simpleicons.org/${slug})`,
        maskRepeat: 'no-repeat',
        maskSize: 'contain',
        maskPosition: 'center',
        WebkitMaskImage: `url(https://cdn.simpleicons.org/${slug})`,
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
        WebkitMaskPosition: 'center',
      }}
    />
  );
};

const categories = [
  {
    label: 'Backend Runtime',
    items: [
      { name: 'Node.js', slug: 'nodedotjs' },
      { name: 'Express.js', slug: 'express' },
      { name: 'FastAPI', slug: 'fastapi' },
      { name: 'Python', slug: 'python' },
      { name: 'TypeScript', slug: 'typescript' },
    ],
  },
  {
    label: 'Databases',
    items: [
      { name: 'PostgreSQL', slug: 'postgresql' },
      { name: 'MongoDB', slug: 'mongodb' },
      { name: 'Redis', slug: 'redis' },
      { name: 'SQLite', slug: 'sqlite' },
      { name: 'Prisma ORM', slug: 'prisma' },
    ],
  },
  {
    label: 'DevOps & Tools',
    items: [
      { name: 'Docker', slug: 'docker' },
      { name: 'Git / GitHub', slug: 'git' },
      { name: 'PM2', slug: 'pm2' },
      { name: 'Postman', slug: 'postman' },
      { name: 'Zod', slug: 'zod' },
      { name: 'BullMQ', fallback: <Workflow className="w-4 h-4" /> },
    ],
  },
];

const Tag = ({ name, slug, fallback }: { name: string; slug?: string; fallback?: React.ReactNode }) => (
  <span
    className="group/tag flex items-center gap-3"
    style={{
      border: '1px dashed var(--border)',
      padding: '10px 20px',
      fontFamily: '"Space Mono", monospace',
      fontSize: '0.85rem',
      fontWeight: 700,
      color: 'var(--muted)',
      cursor: 'default',
      transition: 'all 0.2s ease',
      letterSpacing: '0.05em',
      lineHeight: 1,
      whiteSpace: 'nowrap' as const,
      textTransform: 'uppercase' as const,
    }}
    onMouseEnter={(e) => {
      const el = e.currentTarget as HTMLElement;
      el.style.color = 'var(--accent)';
      el.style.borderColor = 'var(--accent)';
      el.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      const el = e.currentTarget as HTMLElement;
      el.style.color = 'var(--muted)';
      el.style.borderColor = 'var(--border)';
      el.style.transform = 'translateY(0)';
    }}
  >
    <BrandIcon slug={slug} fallback={fallback || <Terminal className="w-4 h-4" />} />
    {name}
  </span>
);

export const TechStack = () => {
  return (
    <section
      id="stack"
      style={{
        width: '100%',
        background: 'var(--bg)',
        padding: 'clamp(56px, 8vw, 96px) clamp(20px, 5vw, 80px)',
      }}
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Section label */}
      <div
        style={{
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: '1.25rem',
          letterSpacing: '0.18em',
          color: 'var(--muted)',
          textTransform: 'uppercase',
          marginBottom: '16px',
        }}
      >
        03 — STACK
      </div>

      {/* Section title */}
      <h2
        style={{
          fontFamily: '"Space Mono", monospace',
          fontSize: 'clamp(1.8rem, 4vw, 3rem)',
          fontWeight: 700,
          color: 'var(--ink)',
          lineHeight: 1.1,
          marginBottom: 'clamp(36px, 5vw, 56px)',
        }}
      >
        TOOLS OF THE TRADE
      </h2>

      {/* 3-column category grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'clamp(32px, 5vw, 56px)',
        }}
      >
        {categories.map((cat) => (
          <div key={cat.label}>
            {/* Category header — distressed divider above */}
            <div style={{ marginBottom: '20px' }}>
              <hr style={{ marginBottom: '14px', width: '100%' }} />
              <h3
                style={{
                  fontFamily: '"Bebas Neue", sans-serif',
                  fontSize: '1rem',
                  letterSpacing: '0.18em',
                  color: 'var(--ink)',
                  textTransform: 'uppercase',
                }}
              >
                {cat.label}
              </h3>
            </div>

            {/* Tag wrap */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {cat.items.map((item) => (
                <Tag key={item.name} name={item.name} slug={item.slug} fallback={item.fallback} />
              ))}
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
};
