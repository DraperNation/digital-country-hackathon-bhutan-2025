import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useApp } from './contexts/AppContext';
import { Layout } from './components/common/Layout';
import { Hero } from './components/landing/Hero';
import { Features } from './components/landing/Features';
import { Benefits } from './components/landing/Benefits';
import { RegistrationForm } from './components/onboarding/RegistrationForm';
import { KYCBasic } from './components/onboarding/KYCBasic';
import { EResidencyApplication } from './components/onboarding/EResidencyApplication';
import { BusinessFormation } from './components/onboarding/BusinessFormation';
import { EnhancedDashboard } from './components/dashboard/EnhancedDashboard';
import { DemoPersonas } from './components/demo/DemoPersonas';
import { LearningSystem } from './components/gamification/LearningSystem';
import { About } from './components/pages/About';
import { Contact } from './components/pages/Contact';
import { Services } from './components/pages/Services';
import { Support } from './components/pages/Support';
import { Legal } from './components/pages/Legal';
import { SmartMatchmaking } from './components/features/SmartMatchmaking';
import { PredictiveCompliance } from './components/features/PredictiveCompliance';
import { BusinessReputation } from './components/features/BusinessReputation';
import { CreditBuilding } from './components/features/CreditBuilding';
import { AIAssistant } from './components/ai-assistant/AIAssistant';

const AppContent: React.FC = () => {
  const { state } = useApp();

  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case 'welcome':
        return (
          <Layout>
            <Hero />
            <Features />
            <Benefits />
          </Layout>
        );
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'services':
        return <Services />;
      case 'support':
        return <Support />;
      case 'legal':
        return <Legal />;
      case 'smart-matchmaking':
        return <SmartMatchmaking />;
      case 'predictive-compliance':
        return <PredictiveCompliance />;
      case 'business-reputation':
        return <BusinessReputation />;
      case 'credit-building':
        return <CreditBuilding />;
      case 'register':
        return <RegistrationForm />;
      case 'kyc-basic':
        return <KYCBasic />;
      case 'eresidency-application':
        return <EResidencyApplication />;
      case 'business-formation':
        return <BusinessFormation />;
      case 'dashboard':
        return <EnhancedDashboard />;
      case 'demo-personas':
        return <DemoPersonas />;
      case 'learning-system':
        return <LearningSystem />;
      default:
        return (
          <Layout>
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Step: {state.currentStep}
                </h2>
                <p className="text-gray-600">This step is under development.</p>
              </div>
            </div>
          </Layout>
        );
    }
  };

  return (
    <Router>
      <div className={`App transition-colors duration-300 ${
        state.theme === 'dark' ? 'dark' : ''
      }`}>
        {renderCurrentStep()}
        <AIAssistant />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: state.theme === 'dark' ? '#374151' : '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10B981',
              },
            },
            error: {
              style: {
                background: '#EF4444',
              },
            },
          }}
        />
      </div>
    </Router>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;