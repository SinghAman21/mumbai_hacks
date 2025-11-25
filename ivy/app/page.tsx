import { ModeToggle } from "@/components/modetoggle";
import { Hero } from "@/components/landing/Hero";

export default function Home() {
  return (
    <div className="relative">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-8 right-8 z-50">
        <ModeToggle />
      </div>

      {/* Hero Section */}
      <Hero />
    </div>
  );
}
