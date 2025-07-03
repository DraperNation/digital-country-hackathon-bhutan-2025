import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Mountain, Heart, Globe, Users, Award, Shield, Leaf, Building2 } from 'lucide-react';

export const About: React.FC = () => {
  const { theme } = useTheme();

  const teamMembers = [
    {
      name: 'Tenzin Norbu',
      role: 'Chief Technology Officer',
      description: 'Leading digital transformation initiatives in Bhutan',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    {
      name: 'Pema Lhamo',
      role: 'Head of Digital Identity',
      description: 'Expert in blockchain and digital credentials',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    {
      name: 'Karma Wangchuk',
      role: 'Director of Business Development',
      description: 'Connecting global entrepreneurs with Bhutanese opportunities',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Gross National Happiness',
      description: 'We prioritize the well-being and happiness of our digital residents above pure economic metrics.'
    },
    {
      icon: Leaf,
      title: 'Environmental Harmony',
      description: 'Our digital platform supports Bhutan\'s commitment to carbon neutrality and environmental conservation.'
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Built on Bhutan\'s reputation for transparency and good governance, ensuring secure digital identities.'
    },
    {
      icon: Globe,
      title: 'Global Connectivity',
      description: 'Bridging the gap between Bhutan\'s traditional values and modern digital entrepreneurship.'
    }
  ];

  const features = [
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
      icon: Award,
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

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className={`inline-flex items-center px-6 py-3 glass-card rounded-full text-sm font-medium mb-8 border border-white/30 ${
            theme === 'dark' ? 'text-white' : 'text-black'
          }`}>
            <Mountain className="h-4 w-4 mr-2 text-orange-400" />
            About Our Mission
          </div>
          
          <h1 className={`text-4xl md:text-6xl font-display font-bold mb-8 text-shadow-strong ${
            theme === 'dark' ? 'text-white' : 'text-black'
          }`}>
            Inspired by Estonia's <span className="text-saffron">eResidency</span>
          </h1>
          
          <p className={`text-xl max-w-4xl mx-auto leading-relaxed ${
            theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'
          }`}>
            Building upon the success of Estonia's pioneering digital residency program, we're bringing 
            the same innovation to the mystical Kingdom of Bhutan, infused with our unique philosophy 
            of Gross National Happiness.
          </p>
        </div>

        {/* Features Section from Features page */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-display font-bold mb-6 text-shadow-strong ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              Everything You Need for Digital Success
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'
            }`}>
              Discover the comprehensive suite of features that make Bhutan eResidency the most 
              advanced digital residency platform in the world.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="glass-card p-8 rounded-xl border border-white/20 group hover:transform hover:-translate-y-2 transition-all duration-300">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className={`text-2xl font-display font-bold mb-4 text-shadow ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}>{feature.title}</h3>
                <p className={`leading-relaxed mb-6 ${
                  theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'
                }`}>{feature.description}</p>
                
                <div className="space-y-3">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className={`flex items-center ${
                      theme === 'dark' ? 'text-white/90' : 'text-slate-700'
                    }`}>
                      <Award className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                      <span className={theme === 'dark' ? 'text-shadow' : ''}>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <div className="glass-card p-8 rounded-xl border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h2 className={`text-2xl font-display font-bold mb-4 text-shadow ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>Our Mission</h2>
            <p className={`leading-relaxed mb-6 ${
              theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'
            }`}>
              To democratize access to Bhutan's stable business environment and unique cultural values, 
              enabling global entrepreneurs to establish digital presence in the world's happiest nation 
              while contributing to sustainable development.
            </p>
            <div className="space-y-3">
              <div className={`flex items-center ${
                theme === 'dark' ? 'text-white/90' : 'text-slate-700'
              }`}>
                <Award className="h-5 w-5 text-orange-400 mr-3" />
                <span className={theme === 'dark' ? 'text-shadow' : ''}>Digital-first government services</span>
              </div>
              <div className={`flex items-center ${
                theme === 'dark' ? 'text-white/90' : 'text-slate-700'
              }`}>
                <Globe className="h-5 w-5 text-orange-400 mr-3" />
                <span className={theme === 'dark' ? 'text-shadow' : ''}>Global business opportunities</span>
              </div>
              <div className={`flex items-center ${
                theme === 'dark' ? 'text-white/90' : 'text-slate-700'
              }`}>
                <Heart className="h-5 w-5 text-orange-400 mr-3" />
                <span className={theme === 'dark' ? 'text-shadow' : ''}>Happiness-centered approach</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-xl border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center mb-6">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <h2 className={`text-2xl font-display font-bold mb-4 text-shadow ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>Our Vision</h2>
            <p className={`leading-relaxed mb-6 ${
              theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'
            }`}>
              To position Bhutan as a leading digital nation that balances technological advancement 
              with environmental sustainability and cultural preservation, creating a new model for 
              digital governance in the 21st century.
            </p>
            <div className="space-y-3">
              <div className={`flex items-center ${
                theme === 'dark' ? 'text-white/90' : 'text-slate-700'
              }`}>
                <Shield className="h-5 w-5 text-green-400 mr-3" />
                <span className={theme === 'dark' ? 'text-shadow' : ''}>Carbon-negative digital services</span>
              </div>
              <div className={`flex items-center ${
                theme === 'dark' ? 'text-white/90' : 'text-slate-700'
              }`}>
                <Mountain className="h-5 w-5 text-green-400 mr-3" />
                <span className={theme === 'dark' ? 'text-shadow' : ''}>Cultural heritage preservation</span>
              </div>
              <div className={`flex items-center ${
                theme === 'dark' ? 'text-white/90' : 'text-slate-700'
              }`}>
                <Users className="h-5 w-5 text-green-400 mr-3" />
                <span className={theme === 'dark' ? 'text-shadow' : ''}>Inclusive digital transformation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-display font-bold mb-6 text-shadow-strong ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              Our Core Values
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'
            }`}>
              Rooted in Bhutanese philosophy and modern digital innovation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="glass-card p-6 rounded-xl border border-white/20 text-center group hover:transform hover:-translate-y-2 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <value.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className={`text-lg font-display font-semibold mb-3 text-shadow ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}>{value.title}</h3>
                <p className={`text-sm leading-relaxed ${
                  theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'
                }`}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-display font-bold mb-6 text-shadow-strong ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              Meet Our Team
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'
            }`}>
              Dedicated professionals bridging traditional Bhutanese wisdom with cutting-edge technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="glass-card p-6 rounded-xl border border-white/20 text-center group hover:transform hover:-translate-y-2 transition-all duration-300">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-orange-400/50 group-hover:border-orange-400 transition-colors">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className={`text-xl font-display font-semibold mb-2 text-shadow ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}>{member.name}</h3>
                <p className="text-saffron font-medium mb-3 text-shadow">{member.role}</p>
                <p className={`text-sm leading-relaxed ${
                  theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'
                }`}>{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Estonia Inspiration Section */}
        <div className="glass-card p-8 md:p-12 rounded-xl border border-white/20 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Globe className="h-8 w-8 text-white" />
          </div>
          <h2 className={`text-2xl md:text-3xl font-display font-bold mb-6 text-shadow-strong ${
            theme === 'dark' ? 'text-white' : 'text-black'
          }`}>
            Learning from Estonia's Success
          </h2>
          <p className={`text-lg leading-relaxed max-w-4xl mx-auto mb-8 ${
            theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'
          }`}>
            Estonia's e-Residency program has shown the world what's possible when a nation embraces 
            digital transformation. Since 2014, over 100,000 global citizens have become e-residents, 
            establishing thousands of companies and contributing significantly to Estonia's digital economy.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl font-bold text-saffron mb-2">100,000+</div>
              <div className={theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'}>Estonia e-Residents</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-saffron mb-2">20,000+</div>
              <div className={theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'}>Companies Established</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-saffron mb-2">€1B+</div>
              <div className={theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'}>Economic Impact</div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-20 text-center">
          <div className="glass-card p-8 rounded-xl border border-white/20 max-w-2xl mx-auto">
            <h2 className={`text-2xl font-display font-bold mb-4 text-shadow ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>Get in Touch</h2>
            <p className={`mb-6 ${
              theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'
            }`}>
              Have questions about Bhutan's eResidency program? We're here to help you on your journey.
            </p>
            <div className={`space-y-3 ${
              theme === 'dark' ? 'text-white/90' : 'text-slate-700'
            }`}>
              <div className="flex items-center justify-center">
                <Globe className="h-5 w-5 text-orange-400 mr-3" />
                <span className={theme === 'dark' ? 'text-shadow' : ''}>contact@bhutan-eresidency.gov.bt</span>
              </div>
              <div className="flex items-center justify-center">
                <Mountain className="h-5 w-5 text-orange-400 mr-3" />
                <span className={theme === 'dark' ? 'text-shadow' : ''}>Thimphu, Kingdom of Bhutan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};