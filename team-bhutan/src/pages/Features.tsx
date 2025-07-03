import React from 'react';
import { 
  Shield, 
  Globe, 
  Building2, 
  CreditCard, 
  Award, 
  Zap, 
  Heart, 
  Leaf, 
  Mountain, 
  Users,
  CheckCircle,
  ArrowRight,
  FileText,
  Wallet
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Features: React.FC = () => {
  const mainFeatures = [
    {
      icon: Shield,
      title: 'Secure Digital Identity',
      description: 'Government-backed digital identity with blockchain verification and biometric authentication.',
      benefits: [
        'Military-grade encryption',
        'Biometric verification',
        'Blockchain-secured credentials',
        'Government authentication'
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Building2,
      title: 'Business Formation',
      description: 'Register your company in Bhutan with streamlined digital processes and tax benefits.',
      benefits: [
        'Online company registration',
        'Tax optimization strategies',
        'Regulatory compliance',
        'International market access'
      ],
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Globe,
      title: 'Global Banking',
      description: 'Access international banking services and payment systems through your digital residency.',
      benefits: [
        'Multi-currency accounts',
        'International wire transfers',
        'Digital payment processing',
        'Cryptocurrency support'
      ],
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: CreditCard,
      title: 'NFT-Based Credentials',
      description: 'Your digital residency card as a unique NFT, providing verifiable proof of status.',
      benefits: [
        'Unique digital collectible',
        'Verifiable on blockchain',
        'Transferable credentials',
        'Lifetime validity'
      ],
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const additionalFeatures = [
    {
      icon: Heart,
      title: 'Gross National Happiness',
      description: 'Join a nation that prioritizes well-being over GDP'
    },
    {
      icon: Leaf,
      title: 'Carbon Negative',
      description: 'Contribute to the world\'s only carbon-negative country'
    },
    {
      icon: Mountain,
      title: 'Himalayan Heritage',
      description: 'Connect with ancient wisdom and modern innovation'
    },
    {
      icon: Users,
      title: 'Global Community',
      description: 'Network with entrepreneurs from around the world'
    },
    {
      icon: Award,
      title: 'Tax Benefits',
      description: 'Optimize your tax strategy with Bhutanese advantages'
    },
    {
      icon: Zap,
      title: 'Fast Processing',
      description: 'Get your digital residency in just 7-14 days'
    }
  ];

  const comparisonData = [
    {
      feature: 'Processing Time',
      bhutan: '7-14 days',
      estonia: '14-30 days',
      traditional: '3-6 months'
    },
    {
      feature: 'Setup Cost',
      bhutan: '$299',
      estonia: '€100 + fees',
      traditional: '$2,000+'
    },
    {
      feature: 'Annual Fee',
      bhutan: '$99',
      estonia: '€100',
      traditional: '$500+'
    },
    {
      feature: 'Banking Access',
      bhutan: 'Global',
      estonia: 'EU focused',
      traditional: 'Limited'
    },
    {
      feature: 'Tax Benefits',
      bhutan: 'Optimized',
      estonia: 'EU rates',
      traditional: 'Standard'
    }
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 glass-card rounded-full text-white text-sm font-medium mb-8 border border-white/30">
            <Zap className="h-4 w-4 mr-2 text-orange-400" />
            Comprehensive Features
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-8 text-white text-shadow-strong">
            Everything You Need for <span className="text-saffron">Digital Success</span>
          </h1>
          
          <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed text-shadow">
            Discover the comprehensive suite of features that make Bhutan eResidency the most 
            advanced digital residency platform in the world.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {mainFeatures.map((feature, index) => (
            <div key={index} className="glass-card p-8 rounded-xl border border-white/20 group hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-display font-bold text-white mb-4 text-shadow">{feature.title}</h3>
              <p className="text-white/90 leading-relaxed text-shadow mb-6">{feature.description}</p>
              
              <div className="space-y-3">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <div key={benefitIndex} className="flex items-center text-white/90">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-shadow">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 text-shadow-strong">
              Why Choose Bhutan?
            </h2>
            <p className="text-lg text-white/90 max-w-3xl mx-auto text-shadow">
              Unique advantages that set Bhutan apart from other digital residency programs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="glass-card p-6 rounded-xl border border-white/20 text-center group hover:transform hover:-translate-y-2 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-display font-semibold text-white mb-3 text-shadow">{feature.title}</h3>
                <p className="text-white/90 text-sm leading-relaxed text-shadow">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 text-shadow-strong">
              How We Compare
            </h2>
            <p className="text-lg text-white/90 max-w-3xl mx-auto text-shadow">
              See how Bhutan eResidency stacks up against other options
            </p>
          </div>

          <div className="glass-card rounded-xl border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white/80 uppercase tracking-wider text-shadow">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-saffron uppercase tracking-wider text-shadow">Bhutan eResidency</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-white/80 uppercase tracking-wider text-shadow">Estonia e-Residency</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-white/80 uppercase tracking-wider text-shadow">Traditional Setup</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {comparisonData.map((row, index) => (
                    <tr key={index} className="hover:bg-white/5">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white text-shadow">{row.feature}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-500 to-red-500 text-white">
                          {row.bhutan}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80 text-center text-shadow">{row.estonia}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80 text-center text-shadow">{row.traditional}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Process Overview */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 text-shadow-strong">
              Simple Process, Powerful Results
            </h2>
            <p className="text-lg text-white/90 max-w-3xl mx-auto text-shadow">
              Get started with your digital residency in just a few steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Apply Online', description: 'Complete your application in 15 minutes', icon: FileText, link: '/register' },
              { step: '2', title: 'Verify Identity', description: 'Upload documents and complete KYC', icon: Shield, link: '/kyc' },
              { step: '3', title: 'Get Approved', description: 'Receive your digital credentials', icon: Award, link: '/identity' },
              { step: '4', title: 'Start Business', description: 'Register your company and start trading', icon: Building2, link: '/business' }
            ].map((process, index) => (
              <Link key={index} to={process.link} className="group text-center">
                <div className="glass-card p-6 rounded-xl border border-white/20 group-hover:transform group-hover:-translate-y-2 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform relative">
                    <process.icon className="h-8 w-8 text-white" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-orange-600">
                      {process.step}
                    </div>
                  </div>
                  <h3 className="text-lg font-display font-semibold text-white mb-3 text-shadow group-hover:text-saffron transition-colors">{process.title}</h3>
                  <p className="text-white/90 text-sm leading-relaxed text-shadow">{process.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="glass-card p-8 md:p-12 rounded-xl border border-white/20 max-w-4xl mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Wallet className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6 text-shadow-strong">
              Ready to Experience the Future?
            </h2>
            <p className="text-lg text-white/90 leading-relaxed text-shadow max-w-2xl mx-auto mb-8">
              Join thousands of entrepreneurs who have already discovered the power of Bhutan's 
              digital residency program. Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 text-white font-display font-bold rounded-xl hover:from-orange-600 hover:via-red-600 hover:to-orange-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Start Your Application
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
              <Link
                to="/kyc"
                className="inline-flex items-center px-8 py-4 glass-card text-white font-display font-bold rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/30 text-shadow"
              >
                Begin KYC Process
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};