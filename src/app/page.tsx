import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustedBy } from "@/components/TrustedBy";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { DemoPreview } from "@/components/DemoPreview";
import { Testimonials } from "@/components/Testimonials";
import { Pricing } from "@/components/Pricing";
import { CTABanner } from "@/components/CTABanner";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <Hero />
      <TrustedBy />
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <div id="features">
        <Features />
      </div>
      <DemoPreview />
      <Testimonials />
      <div id="pricing">
        <Pricing />
      </div>
      <CTABanner />
      <Footer />
    </div>
  );
}
