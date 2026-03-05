import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Showcase from "@/components/landing/Showcase";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-accent/30 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Showcase />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
