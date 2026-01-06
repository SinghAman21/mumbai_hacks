import { ForceDarkTheme } from "@/components/landing/force-dark-theme";
import { Hero } from "@/components/landing/Hero";

export default function Home() {
  return (
    <div className="relative dark min-h-screen bg-background text-foreground">
      <ForceDarkTheme />
      {/* Hero Section */}
      <Hero />
    </div>
  );
}
