import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Projects } from '@/components/Projects';
import { GithubContributions } from '@/components/GithubContributions';
import { TechStack } from '@/components/TechStack';
import { Experience } from '@/components/Experience';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="w-full bg-bg">
      <Navigation />
      <Hero />
      <About />
      <Projects />
      <GithubContributions />
      <TechStack />
      <Experience />
      <Contact />
      <Footer />
    </main>
  );
}
