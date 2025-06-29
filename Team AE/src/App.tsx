
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import KYC from "./pages/KYC";
import BusinessResidency from "./pages/BusinessResidency";
import UpgradeProfile from "./pages/UpgradeProfile";
import Services from "./pages/Services";
import Notarization from "./pages/services/Notarization";
import Lightning from "./pages/services/Lightning";
import CarbonCredits from "./pages/services/CarbonCredits";
import DigitalAttestations from "./pages/DigitalAttestations";
import NotFound from "./pages/NotFound";
import { WalletProvider } from "./contexts/WalletContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WalletProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/kyc" element={<KYC />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/attestations" element={<DigitalAttestations />} />
            <Route path="/business-residency" element={<BusinessResidency />} />
            <Route path="/dashboard/upgrade-profile" element={<UpgradeProfile />} />
            <Route path="/dashboard/services" element={<Services />} />
            <Route path="/dashboard/services/notarization" element={<Notarization />} />
            <Route path="/dashboard/services/lightning" element={<Lightning />} />
            <Route path="/dashboard/services/carbon-credits" element={<CarbonCredits />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </WalletProvider>
  </QueryClientProvider>
);

export default App;
