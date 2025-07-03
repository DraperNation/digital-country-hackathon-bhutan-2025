import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { HeroCarousel } from '../components/HeroCarousel';
import { Shield, Globe, CheckCircle, ArrowRight, Users, Award, Zap, Building2, Mountain, Heart, Leaf } from 'lucide-react';

export const Home: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const features = [
    {
      icon: Building2,
      title: 'Digital Identity',
      description: 'Secure digital identity backed by Bhutan\'s trusted government infrastructure'
    },
    {
      icon: Globe,
      title: 'Global Business Access',
      description: 'Access international markets while benefiting from Bhutan\'s stable business environment'
    },
    {
      icon: Shield,
      title: 'Regulatory Compliance',
      description: 'Built-in compliance with international standards and Bhutanese regulations'
    },
    {
      icon: Heart,
      title: 'Happiness Index',
      description: 'Join the world\'s happiest nation and embrace Gross National Happiness principles'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Digital Residents' },
    { number: '50+', label: 'Countries' },
    { number: '99.9%', label: 'Uptime' },
    { number: '#1', label: 'Happiness Index' }
  ];

  return (
    <div className="relative overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <div className={`inline-flex items-center px-3 sm:px-4 lg:px-6 py-2 sm:py-3 glass-card rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 lg:mb-8 border border-white/30 ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              <Mountain className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-orange-400" />
              <span className="whitespace-nowrap">From the Land of the Thunder Dragon</span>
            </div>
          </div>

          <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold mb-4 sm:mb-6 lg:mb-8 leading-tight animate-fade-in-up text-shadow-strong ${
            theme === 'dark' ? 'text-white' : 'text-black'
          }`}>
            <span className="block mb-1 sm:mb-2">
              Become a Digital
            </span>
            <span className="text-saffron">
              Resident of Bhutan
            </span>
          </h1>

          <p className={`text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 lg:mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up px-4 ${
            theme === 'dark' ? 'text-white text-shadow' : 'text-black'
          }`}>
            {t('home.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center mb-8 sm:mb-12 lg:mb-16 animate-fade-in-up px-4">
            <Link
              to="/kyc"
              className="group w-full sm:w-auto px-6 sm:px-8 lg:px-10 py-3 sm:py-4 bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 text-white font-display font-bold rounded-xl hover:from-orange-600 hover:via-red-600 hover:to-orange-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:shadow-orange-500/40 text-shadow inline-flex items-center justify-center text-sm sm:text-base lg:text-lg btn-mobile-full"
            >
              <span className="truncate">{t('home.cta.kyc')}</span>
              <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-200 flex-shrink-0" />
            </Link>
            <Link
              to="/features"
              className={`w-full sm:w-auto px-6 sm:px-8 lg:px-10 py-3 sm:py-4 glass-card font-display font-bold rounded-xl transition-all duration-300 inline-flex items-center justify-center text-sm sm:text-base lg:text-lg border border-white/30 btn-mobile-full ${
                theme === 'dark' 
                  ? 'text-white hover:bg-white/20 text-shadow' 
                  : 'text-black hover:bg-white/50'
              }`}
            >
              <span className="truncate">{t('home.cta.explore')}</span>
            </Link>
          </div>

          {/* Hero Carousel */}
          <div className="mb-8 sm:mb-12 lg:mb-16">
            <HeroCarousel />
          </div>

          {/* Stats - Equal Height Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-8 max-w-4xl mx-auto animate-fade-in-up px-4">
            {stats.map((stat, index) => (
              <div key={index} className="glass-card p-3 sm:p-4 lg:p-6 rounded-xl border border-white/30 shadow-lg equal-height-card">
                <div className="card-content flex flex-col justify-center h-full text-center">
                  <div className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold mb-1 sm:mb-2 text-shadow ${
                    theme === 'dark' ? 'text-white' : 'text-black'
                  }`}>
                    {stat.number}
                  </div>
                  <div className={`text-xs sm:text-sm font-medium ${
                    theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'
                  }`}>
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 sm:py-16 lg:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent"></div>
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 sm:mb-6 text-shadow-strong ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              Why Choose Bhutan eResidency?
            </h2>
            <p className={`text-base sm:text-lg lg:text-xl max-w-3xl mx-auto px-4 ${
              theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'
            }`}>
              Experience the benefits of digital residency in a nation that prioritizes 
              happiness, sustainability, and innovation.
            </p>
          </div>

          {/* Equal Height Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group equal-height-card">
                <div className="glass-card p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20 card-content h-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-200 shadow-lg flex-shrink-0">
                    <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h3 className={`text-base sm:text-lg lg:text-xl font-display font-semibold mb-3 sm:mb-4 flex-shrink-0 ${
                    theme === 'dark' ? 'text-white text-shadow' : 'text-black'
                  }`}>{feature.title}</h3>
                  <p className={`text-sm sm:text-base leading-relaxed flex-grow ${
                    theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'
                  }`}>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Steps */}
      <div className="py-12 sm:py-16 lg:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30"></div>
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 sm:mb-6 text-shadow-strong ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              Simple Three-Step Process
            </h2>
            <p className={`text-base sm:text-lg lg:text-xl px-4 ${
              theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'
            }`}>
              Your journey to Bhutanese digital residency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {[
              {
                step: '01',
                title: 'Identity Verification',
                description: 'Complete our secure KYC process with document verification and live selfie capture',
                icon: Shield,
                link: '/kyc'
              },
              {
                step: '02',
                title: 'Digital Certification',
                description: 'Receive your official digital identity credentials and NFT-based residency card',
                icon: Award,
                link: '/identity'
              },
              {
                step: '03',
                title: 'Business Setup',
                description: 'Register your business entity and access global opportunities with tax benefits',
                icon: Building2,
                link: '/business'
              }
            ].map((step, index) => (
              <Link key={index} to={step.link} className="text-center group cursor-pointer">
                <div className="relative mb-4 sm:mb-6 lg:mb-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200 shadow-xl">
                    <step.icon className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-orange-600 shadow-lg">
                    {step.step}
                  </div>
                </div>
                <h3 className={`text-lg sm:text-xl lg:text-2xl font-display font-bold mb-3 sm:mb-4 group-hover:text-saffron transition-colors px-4 ${
                  theme === 'dark' ? 'text-white text-shadow' : 'text-black'
                }`}>{step.title}</h3>
                <p className={`text-sm sm:text-base leading-relaxed px-4 ${
                  theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'
                }`}>{step.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12 sm:py-16 lg:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50"></div>
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto glass-card p-6 sm:p-8 lg:p-12 rounded-2xl border border-white/30">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <Leaf className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-green-400 mr-2 sm:mr-3" />
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-red-400 mr-2 sm:mr-3" />
              <Mountain className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-blue-400" />
            </div>
            <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold mb-4 sm:mb-6 lg:mb-8 text-shadow-strong ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              Ready to Join Bhutan's Digital Future?
            </h2>
            <p className={`text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 lg:mb-12 leading-relaxed px-4 ${
              theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'
            }`}>
              Join thousands of entrepreneurs who have already discovered the benefits of 
              Bhutanese digital residency and Gross National Happiness.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center px-6 sm:px-8 lg:px-12 py-3 sm:py-4 bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 text-white font-display font-bold rounded-xl hover:from-orange-600 hover:via-red-600 hover:to-orange-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-base sm:text-lg lg:text-xl btn-mobile"
            >
              <Building2 className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 flex-shrink-0" />
              <span className="whitespace-nowrap">Start Your Application</span>
              <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 flex-shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};