import { useEffect } from "react";
import { StarBackground } from "../components/StarBackground";
import { HeroSection } from "../components/HeroSection";
import { ContactSection } from "../components/ContactSection";

export const Home = () => {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <StarBackground />
      <HeroSection />
      <ContactSection />
    </div>
  );
};
