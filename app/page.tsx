import { LandingNavbar } from "./components/LandingNavbar";
import { Hero } from "./components/Hero";
import { ProblemSolution } from "./components/ProblemSolution";
import { HowItWorks } from "./components/HowItWorks";
import { DemoSection } from "./components/DemoSection";
import { Benchmark } from "./components/Benchmark";
import { SystemArchitecture } from "./components/SystemArchitecture";
import { Footer } from "./components/Footer";
import { ScrollAnimation } from "./components/ui/ScrollAnimation";

export default function Home() {
  return (
    <div className="bg-[#1B211A] min-h-screen text-white font-sans selection:bg-ray-mid selection:text-white">
      <LandingNavbar />
      <main>
        <Hero />
        <ScrollAnimation>
          <HowItWorks />
        </ScrollAnimation>
        <ScrollAnimation>
          <ProblemSolution />
        </ScrollAnimation>
        <ScrollAnimation>
          <DemoSection />
        </ScrollAnimation>
        <ScrollAnimation>
          <SystemArchitecture />
        </ScrollAnimation>
        <ScrollAnimation>
          <Benchmark />
        </ScrollAnimation>
      </main>
      <ScrollAnimation>
        <Footer />
      </ScrollAnimation>
    </div>
  );
}

