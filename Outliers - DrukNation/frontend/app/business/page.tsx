"use client";
import BusinessApplicationForm from "@/components/BusinessApplication";
import BusinessCategories from "@/components/BusinessCategories";
import BusinessBenefitsHero from "@/components/BusinessHero";
import Navbar from "@/components/Navbar";
import { WalletProvider } from "@/context/WalletConnect";
import { useState } from "react";

// Main App Component
const Page = () => {
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <WalletProvider>
        <Navbar />

        <BusinessBenefitsHero />
        <BusinessCategories
          onCategorySelect={setSelectedCategory}
          selectedCategory={selectedCategory}
        />
        <BusinessApplicationForm selectedCategory={selectedCategory} />
      </WalletProvider>
    </div>
  );
};

export default Page;
