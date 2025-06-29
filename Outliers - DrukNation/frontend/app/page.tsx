import CTASection from "@/components/CTA";
import FeatureSection from "@/components/Features";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import { WalletProvider } from "@/context/WalletConnect";
import React from "react";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <WalletProvider>
        <Navbar />
      </WalletProvider>

      <HeroSection />
      <FeatureSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default App;
