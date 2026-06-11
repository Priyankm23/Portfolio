export const Ticker = () => {
  const techs = [
    'Node.js',
    'Express.js',
    'FastAPI',
    'Python',
    'TypeScript',
    'PostgreSQL',
    'MongoDB',
    'Redis',
    'Docker',
    'Git',
    'PM2',
    'Postman',
    'Prisma ORM',
    'Zod',
    'Socket.IO',
    'Ethers.js',
    'BullMQ',
    'gRPC',
    'RabbitMQ',
  ];

  const ticker = [...techs, ...techs]; // Duplicate for seamless loop

  return (
    <div
      className="w-full overflow-hidden bg-bg border-y border-dashed border-border py-4"
      aria-hidden="true"
    >
      <div className="flex gap-6 animate-ticker">
        {ticker.map((tech, idx) => (
          <span
            key={idx}
            className="font-label text-xs text-muted/40 uppercase tracking-widest whitespace-nowrap"
          >
            {tech} ·
          </span>
        ))}
      </div>
    </div>
  );
};
