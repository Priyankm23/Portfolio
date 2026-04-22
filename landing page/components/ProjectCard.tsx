interface ProjectCardProps {
  title: string;
  dates: string;
  tech: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  variant?: 'default' | 'amber';
  beta?: boolean;
  image?: string;
}

export const ProjectCard = ({
  title,
  dates,
  tech,
  description,
  tags,
  githubUrl,
  liveUrl,
  variant = 'default',
  beta = false,
  image,
}: ProjectCardProps) => {
  const borderColor = variant === 'amber' ? 'border-[var(--accent-2)]' : 'border-border';
  const accentColor = variant === 'amber' ? 'text-[var(--accent-2)]' : 'text-accent';
  const hoverBorderColor = variant === 'amber' ? 'hover:border-[var(--accent-2)]' : 'hover:border-accent';
  const hoverBgColor = variant === 'amber' ? 'hover:bg-[var(--accent-2)]/5' : 'hover:bg-accent/5';

  return (
    <article
      className={`relative overflow-hidden border ${borderColor} bg-surface p-5 sm:p-8 md:p-10 space-y-5 sm:space-y-6 transition-all ${hoverBorderColor} ${hoverBgColor} group`}
    >
      {/* Meta row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <span className="font-label text-lg md:text-xl text-muted tracking-[0.15em]">
          {dates}
        </span>
        <span className="font-body text-sm text-muted tracking-wider">
          {tech}
        </span>
      </div>

      {/* Project title */}
      <h3 className="text-2xl md:text-4xl font-display font-bold text-ink leading-tight flex items-center gap-4">
        {title}
        {beta && (
          <span className="text-xs md:text-sm border border-[var(--accent-2)] text-[var(--accent-2)] px-2 py-0.5 rounded-sm tracking-widest uppercase">
            Beta
          </span>
        )}
      </h3>

      {/* Description intro */}
      <p className="font-body text-sm md:text-base text-muted leading-relaxed">
        {description}
      </p>

      {/* Distressed divider */}
      <div className="py-2">
        <hr />
      </div>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className={`border ${borderColor} text-muted font-body text-sm px-4 py-2 tracking-wider transition-all hover:${accentColor.replace('text-', 'border-')} group-hover:${accentColor}`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="flex flex-wrap gap-4 pt-2">
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`font-body text-sm ${accentColor} underline transition-opacity hover:opacity-60`}
          >
            GitHub ↗
          </a>
        )}
      </div>

      {/* Image & Live Link */}
      {(image || liveUrl) && (
        <div className="mt-6 sm:mt-0 sm:absolute sm:bottom-8 sm:right-8 md:bottom-10 md:right-10 opacity-100 sm:opacity-70 group-hover:opacity-100 transition-opacity flex flex-col items-end gap-3 z-10">
          {image && (
            <img src={image} alt={title} className="w-24 h-24 sm:w-40 sm:h-40 object-contain grayscale-0 sm:grayscale group-hover:grayscale-0 transition-all duration-300" />
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`font-body text-sm ${accentColor} underline transition-opacity hover:opacity-60`}
            >
              Live ↗
            </a>
          )}
        </div>
      )}
    </article>
  );
};
