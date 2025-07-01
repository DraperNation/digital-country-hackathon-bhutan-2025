
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, CreditCard, Circle, Zap, Leaf } from 'lucide-react';
import { toast } from 'sonner';

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Shield,
      title: 'Web3 Identity Verification',
      description: 'Advanced blockchain-based identity verification with reputation scoring and cross-chain attestations',
      status: 'active',
      action: 'Access Service',
      bgGradient: 'from-druk-crimson/20 to-druk-ruby/20',
      onClick: () => navigate('/dashboard')
    },
    {
      icon: FileText,
      title: 'Smart Contract Notarization',
      description: 'Military-grade document notarization with immutable blockchain proofs and timestamp verification',
      status: 'active',
      action: 'Access Service',
      bgGradient: 'from-druk-sapphire/20 to-druk-emerald/20',
      onClick: () => navigate('/dashboard/services/notarization')
    },
    {
      icon: CreditCard,
      title: 'Druk Token Payments',
      description: 'Native cryptocurrency payments integrated with multi-chain bridges and automated compliance',
      status: 'coming_soon',
      action: 'Notify Me',
      bgGradient: 'from-druk-gold/20 to-druk-amber/20',
      onClick: () => toast.success('Thank you! We\'ll notify you when Druk Token Payments are available.')
    },
    {
      icon: Circle,
      title: 'Decentralized Governance',
      description: 'Advanced DAO governance with quadratic voting, proposal mechanisms, and treasury management',
      status: 'coming_soon',
      action: 'Coming Soon',
      bgGradient: 'from-purple-500/20 to-indigo-500/20',
      onClick: () => toast.success('Decentralized Governance is coming soon! Stay tuned.')
    },
    {
      icon: Zap,
      title: 'Lightning Network Hub',
      description: 'Professional Lightning Network node with advanced routing, liquidity management, and instant settlements',
      status: 'beta',
      action: 'Access Service',
      bgGradient: 'from-yellow-400/20 to-orange-500/20',
      onClick: () => navigate('/dashboard/services/lightning')
    },
    {
      icon: Leaf,
      title: 'Carbon Credit Exchange',
      description: 'Sophisticated carbon credit marketplace with automated offsetting, impact tracking, and global trading',
      status: 'active',
      action: 'Access Service',
      bgGradient: 'from-druk-emerald/20 to-green-500/20',
      onClick: () => navigate('/dashboard/services/carbon-credits')
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-druk-emerald to-green-500 text-white shadow-lg">
            ⚡ ACTIVE
          </span>
        );
      case 'beta':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-druk-sapphire to-blue-500 text-white shadow-lg">
            🚀 BETA
          </span>
        );
      case 'coming_soon':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-druk-amber to-yellow-500 text-black shadow-lg">
            ⏳ SOON
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800/95 via-slate-700/90 to-slate-800/95 backdrop-blur-xl border-b-2 border-druk-gold/30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              className="mr-6 text-druk-gold hover:text-druk-crimson hover:bg-druk-gold/10 transition-all duration-300 border border-druk-gold/30 hover:border-druk-crimson/50"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gradient">Advanced Web3 Services</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-16 text-center">
          <h2 className="text-5xl font-bold text-gradient mb-6 animate-fade-in">
            Professional Web3 Infrastructure
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Access enterprise-grade blockchain services with advanced features designed for 
            the next generation of digital residents and businesses
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className={`bg-gradient-to-br ${service.bgGradient} backdrop-blur-xl border-2 border-white/10 hover:border-druk-gold/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-druk-gold/20 group`}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-druk rounded-2xl flex items-center justify-center shadow-xl group-hover:animate-float">
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white group-hover:text-druk-gold transition-colors font-bold">
                        {service.title}
                      </CardTitle>
                    </div>
                  </div>
                  {getStatusBadge(service.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-slate-300 text-sm leading-relaxed">
                  {service.description}
                </p>
                
                <Button
                  onClick={service.onClick}
                  className={`w-full font-bold py-3 transition-all duration-300 ${
                    service.status === 'active' || service.status === 'beta' 
                      ? 'bg-gradient-to-r from-druk-crimson via-druk-ruby to-druk-gold hover:from-druk-gold hover:to-druk-crimson text-white shadow-xl hover:shadow-2xl hover:scale-105' 
                      : 'bg-gradient-to-r from-slate-600 to-slate-700 text-slate-300 hover:from-slate-500 hover:to-slate-600 cursor-not-allowed'
                  }`}
                  disabled={service.status === 'coming_soon'}
                >
                  {service.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Service Categories */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <Card className="bg-gradient-to-br from-druk-crimson/10 to-druk-ruby/10 backdrop-blur-xl border-2 border-druk-crimson/30 hover:border-druk-crimson/60 transition-all duration-500">
            <CardHeader>
              <CardTitle className="text-druk-crimson text-center text-xl font-bold">🛡️ Identity & Security</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-slate-300 leading-relaxed">
              Advanced blockchain identity management with multi-signature security, 
              zero-knowledge proofs, and cross-chain verification protocols
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-druk-gold/10 to-druk-amber/10 backdrop-blur-xl border-2 border-druk-gold/30 hover:border-druk-gold/60 transition-all duration-500">
            <CardHeader>
              <CardTitle className="text-druk-gold text-center text-xl font-bold">⚡ Payments & Finance</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-slate-300 leading-relaxed">
              Next-generation payment infrastructure with Lightning Network integration, 
              automated DeFi strategies, and institutional-grade custody solutions
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-druk-emerald/10 to-green-500/10 backdrop-blur-xl border-2 border-druk-emerald/30 hover:border-druk-emerald/60 transition-all duration-500">
            <CardHeader>
              <CardTitle className="text-druk-emerald text-center text-xl font-bold">🌱 Sustainability & Impact</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-slate-300 leading-relaxed">
              Environmental impact tracking with automated carbon offsetting, 
              regenerative finance mechanisms, and GNH-aligned governance systems
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Services;
