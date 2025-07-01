// KYCPageWrapper.tsx or in your page.tsx file
import React from "react";
import { WalletProvider } from "@/context/WalletConnect";
import KYCPage from "../../components/KYC_Page"; // Import your KYC component

const KYCPageWrapper = () => {
  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Alternative CSS Grid Pattern (uncomment to use instead) */}
      {/* 
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)
          `,
          backgroundSize: '20px 20px'
        }}
      />
      */}

      <WalletProvider>
        <div className="relative z-10">
          <KYCPage />
        </div>
      </WalletProvider>
    </div>
  );
};

export default KYCPageWrapper;
