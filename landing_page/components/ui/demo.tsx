// This is a demo of a preview
'use client'
import { Component } from "@/components/ui/tech-stack";

const DemoOne = () => {
  const techStack = [
    { name: 'Next.js', url: 'https://nextjs.org/', color: '#FFFFFF', slug: 'nextdotjs' },
    { name: 'React', url: 'https://react.dev/', color: '#61DAFB', slug: 'react' },
    { name: 'TypeScript', url: 'https://www.typescriptlang.org/', color: '#3178C6', slug: 'typescript' },
    { name: 'Tailwind CSS', url: 'https://tailwindcss.com/', color: '#06B6D4', slug: 'tailwindcss' },
    { name: 'Framer Motion', url: 'https://www.framer.com/motion/', color: '#0055FF', slug: 'framer' },
    { name: 'Node.js', url: 'https://nodejs.org/en', color: '#68A063', slug: 'nodedotjs' },
    { name: 'Vercel', url: 'https://vercel.com/', color: '#000000', slug: 'vercel' },
  ];

  return (
    <div className="flex w-full h-screen justify-center items-center bg-black">
      <div className="w-96 h-60">
        <Component techStack={techStack} />
      </div>
    </div>
  );
};

export default DemoOne;
