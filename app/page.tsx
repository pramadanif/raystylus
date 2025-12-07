import { LandingNavbar } from "./components/LandingNavbar";
import { Hero } from "./components/Hero";
import { ProblemSolution } from "./components/ProblemSolution";
import { HowItWorks } from "./components/HowItWorks";
import { DemoSection } from "./components/DemoSection";
import { Benchmark } from "./components/Benchmark";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <div className="bg-[#1B211A] min-h-screen text-white font-sans selection:bg-ray-mid selection:text-white">
      <LandingNavbar />
      <main>
        <Hero />
        <HowItWorks />
        <ProblemSolution />
        <DemoSection />
        <Benchmark />
      </main>
      <Footer />
    </div>
  );
}

