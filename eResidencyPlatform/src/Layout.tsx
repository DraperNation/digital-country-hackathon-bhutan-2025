import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../contexts/AppContext';
import { useTranslation } from '../../utils/translations';
import { 
  Globe, 
  Menu, 
  X, 
  User, 
  LogOut, 
  BarChart3, 
  Sun, 
  Moon,
  Home,
  Info,
  Settings,
  Phone,
  Briefcase,
  Smartphone,
  Bot,
  FileText,
  Wallet,
  Users,
  Calendar,
  Award,
  HelpCircle,
  Scale,
  TrendingUp,
  Shield,
  Target,
  CreditCard,
  ChevronRight
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showHeader = true, 
  showFooter = true 
}) => {
  const { state, dispatch } = useApp();
  const { t } = useTranslation(state.language);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'welcome' });
  };

  const toggleDemoMode = () => {
    dispatch({ type: 'TOGGLE_DEMO_MODE' });
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'demo-personas' });
  };

  const goToDashboard = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'dashboard' });
  };

  const goToHome = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'welcome' });
  };

  const goToAbout = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'about' });
  };

  const goToContact = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'contact' });
  };

  const goToServices = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'services' });
  };

  const goToSupport = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'support' });
  };

  const goToLegal = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'legal' });
  };

  const toggleLanguage = () => {
    const newLanguage = state.language === 'en' ? 'dz' : 'en';
    dispatch({ type: 'SET_LANGUAGE', payload: newLanguage });
  };

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const getLanguageDisplay = () => {
    const displays = {
      'en': 'EN',
      'dz': 'རྫོང་ཁ'
    };
    return displays[state.language];
  };

  const navigationItems = [
    { id: 'home', label: t('Home'), icon: Home, action: goToHome },
  ];

  const featureItems = [
    { 
      id: 'smart-matchmaking', 
      label: t('Smart Matchmaking'),
      icon: Target,
      action: () => dispatch({ type: 'SET_CURRENT_STEP', payload: 'smart-matchmaking' })
    },
    { 
      id: 'predictive-compliance', 
      label: t('Predictive Compliance'),
      icon: Shield,
      action: () => dispatch({ type: 'SET_CURRENT_STEP', payload: 'predictive-compliance' })
    },
    { 
      id: 'business-reputation', 
      label: t('Business Reputation'),
      icon: Award,
      action: () => dispatch({ type: 'SET_CURRENT_STEP', payload: 'business-reputation' })
    },
    { 
      id: 'credit-building', 
      label: t('Credit Building'),
      icon: CreditCard,
      action: () => dispatch({ type: 'SET_CURRENT_STEP', payload: 'credit-building' })
    }
  ];

  const additionalFeatures = [
    { 
      id: 'ai-assistant', 
      icon: Bot, 
      label: t('AI Assistant', 'AI Assistant'),
      action: () => {
        const chatButton = document.querySelector('[data-chat-button]');
        if (chatButton) {
          (chatButton as HTMLElement).click();
        }
      }
    },
    { 
      id: 'documents', 
      icon: FileText, 
      label: t('Smart Document Vault', 'Documents'),
      action: () => dispatch({ type: 'SET_CURRENT_STEP', payload: 'dashboard' })
    },
    { 
      id: 'banking', 
      icon: Wallet, 
      label: t('Banking Hub', 'Banking'),
      action: () => dispatch({ type: 'SET_CURRENT_STEP', payload: 'dashboard' })
    },
    { 
      id: 'community', 
      icon: Users, 
      label: t('Global Community', 'Community'),
      action: () => dispatch({ type: 'SET_CURRENT_STEP', payload: 'dashboard' })
    },
    { 
      id: 'compliance', 
      icon: Calendar, 
      label: t('Predictive Compliance', 'Compliance'),
      action: () => dispatch({ type: 'SET_CURRENT_STEP', payload: 'dashboard' })
    },
    { 
      id: 'learning', 
      icon: Award, 
      label: t('Learning & Rewards', 'Learning'),
      action: () => dispatch({ type: 'SET_CURRENT_STEP', payload: 'dashboard' })
    },
    { 
      id: 'mobile', 
      icon: Smartphone, 
      label: t('Mobile', 'Mobile'),
      action: () => {
        alert(t('Try resizing your browser or accessing from mobile - the entire platform is fully responsive!', 'Try resizing your browser or accessing from mobile - the entire platform is fully responsive!'));
      }
    }
  ];

  // Breadcrumb generation
  const getBreadcrumbs = () => {
    const breadcrumbs = [
      { label: t('Home'), action: goToHome }
    ];

    switch (state.currentStep) {
      case 'about':
        breadcrumbs.push({ label: t('About') });
        break;
      case 'services':
        breadcrumbs.push({ label: t('Services') });
        break;
      case 'support':
        breadcrumbs.push({ label: t('Support') });
        break;
      case 'contact':
        breadcrumbs.push({ label: t('Contact') });
        break;
      case 'legal':
        breadcrumbs.push({ label: 'Legal' });
        break;
      case 'dashboard':
        breadcrumbs.push({ label: t('Dashboard') });
        break;
      case 'smart-matchmaking':
        breadcrumbs.push({ label: 'Features', action: () => {} });
        breadcrumbs.push({ label: t('Smart Matchmaking') });
        break;
      case 'predictive-compliance':
        breadcrumbs.push({ label: 'Features', action: () => {} });
        breadcrumbs.push({ label: t('Predictive Compliance') });
        break;
      case 'business-reputation':
        breadcrumbs.push({ label: 'Features', action: () => {} });
        breadcrumbs.push({ label: t('Business Reputation') });
        break;
      case 'credit-building':
        breadcrumbs.push({ label: 'Features', action: () => {} });
        breadcrumbs.push({ label: t('Credit Building') });
        break;
      default:
        break;
    }

    return breadcrumbs;
  };

  const isFeaturePage = ['smart-matchmaking', 'predictive-compliance', 'business-reputation', 'credit-building'].includes(state.currentStep);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      state.theme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-gradient-to-br from-slate-50 to-blue-50 text-gray-900'
    }`}>
      {showHeader && (
        <motion.header 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={`sticky top-0 z-50 transition-colors duration-300 ${
            state.theme === 'dark'
              ? 'bg-gray-800/90 border-gray-700'
              : 'bg-white/80 border-gray-200'
          } backdrop-blur-md border-b`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center cursor-pointer" onClick={goToHome}>
                <div className="text-3xl mr-3">🐉</div>
                <div>
                  <h1 className={`text-xl font-bold ${
                    state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Druk eResidency
                  </h1>
                  <p className={`text-xs ${
                    state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {t('Land of the Thunder Dragon', 'Land of the Thunder Dragon')}
                  </p>
                </div>
              </div>

              {/* Desktop Navigation - Home Icon Only */}
              <nav className="hidden lg:flex space-x-2">
                {navigationItems.map((item) => (
                  <div key={item.id} className="relative group">
                    <button
                      onClick={item.action}
                      className={`p-2 rounded-lg transition-colors ${
                        state.currentStep === item.id
                          ? state.theme === 'dark'
                            ? 'text-yellow-400'
                            : 'text-yellow-600'
                          : state.theme === 'dark'
                            ? 'text-gray-300 hover:text-yellow-400'
                            : 'text-gray-700 hover:text-yellow-600'
                      }`}
                      title={item.label}
                      aria-label={item.label}
                    >
                      <item.icon className="h-5 w-5" />
                    </button>
                    <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[60] whitespace-nowrap ${
                      state.theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'
                    }`}>
                      {item.label}
                    </div>
                  </div>
                ))}
              </nav>

              {/* Feature Navigation */}
              <div className="hidden xl:flex items-center space-x-1">
                {featureItems.map((feature) => (
                  <div key={feature.id} className="relative group">
                    <button
                      onClick={feature.action}
                      className={`p-2 rounded-lg transition-colors ${
                        state.currentStep === feature.id
                          ? state.theme === 'dark'
                            ? 'bg-yellow-600 text-gray-900'
                            : 'bg-yellow-500 text-white'
                          : state.theme === 'dark'
                            ? 'text-gray-400 hover:text-yellow-400 hover:bg-gray-700'
                            : 'text-gray-600 hover:text-yellow-600 hover:bg-gray-100'
                      }`}
                      title={feature.label}
                      aria-label={feature.label}
                    >
                      <feature.icon className="h-4 w-4" />
                    </button>
                    <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[60] whitespace-nowrap ${
                      state.theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'
                    }`}>
                      {feature.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Features */}
              <div className="hidden xl:flex items-center space-x-2">
                {additionalFeatures.slice(0, 4).map((feature) => (
                  <div key={feature.id} className="relative group">
                    <button
                      onClick={feature.action}
                      className={`p-2 rounded-lg transition-colors ${
                        state.theme === 'dark'
                          ? 'text-gray-400 hover:text-yellow-400 hover:bg-gray-700'
                          : 'text-gray-600 hover:text-yellow-600 hover:bg-gray-100'
                      }`}
                      title={feature.label}
                      aria-label={feature.label}
                    >
                      <feature.icon className="h-4 w-4" />
                    </button>
                    <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[60] whitespace-nowrap ${
                      state.theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'
                    }`}>
                      {feature.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Side Controls */}
              <div className="flex items-center space-x-4">
                {state.demoMode && (
                  <div className={`px-3 py-1 text-xs font-medium rounded-full ${
                    state.theme === 'dark'
                      ? 'bg-yellow-900 text-yellow-200'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {t('DEMO MODE', 'DEMO MODE')}
                  </div>
                )}
                
                {/* About, Contact, Support Icons - Repositioned */}
                <div className="hidden lg:flex items-center space-x-1">
                  <div className="relative group">
                    <button
                      onClick={goToAbout}
                      className={`p-2 rounded-lg transition-colors ${
                        state.currentStep === 'about'
                          ? state.theme === 'dark'
                            ? 'text-yellow-400'
                            : 'text-yellow-600'
                          : state.theme === 'dark'
                            ? 'text-gray-400 hover:text-yellow-400 hover:bg-gray-700'
                            : 'text-gray-600 hover:text-yellow-600 hover:bg-gray-100'
                      }`}
                      title={t('About')}
                      aria-label={t('About')}
                    >
                      <Info className="h-4 w-4" />
                    </button>
                    <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[60] whitespace-nowrap ${
                      state.theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'
                    }`}>
                      {t('About')}
                    </div>
                  </div>

                  <div className="relative group">
                    <button
                      onClick={goToContact}
                      className={`p-2 rounded-lg transition-colors ${
                        state.currentStep === 'contact'
                          ? state.theme === 'dark'
                            ? 'text-yellow-400'
                            : 'text-yellow-600'
                          : state.theme === 'dark'
                            ? 'text-gray-400 hover:text-yellow-400 hover:bg-gray-700'
                            : 'text-gray-600 hover:text-yellow-600 hover:bg-gray-100'
                      }`}
                      title={t('Contact')}
                      aria-label={t('Contact')}
                    >
                      <Phone className="h-4 w-4" />
                    </button>
                    <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[60] whitespace-nowrap ${
                      state.theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'
                    }`}>
                      {t('Contact')}
                    </div>
                  </div>

                  <div className="relative group">
                    <button
                      onClick={goToSupport}
                      className={`p-2 rounded-lg transition-colors ${
                        state.currentStep === 'support'
                          ? state.theme === 'dark'
                            ? 'text-yellow-400'
                            : 'text-yellow-600'
                          : state.theme === 'dark'
                            ? 'text-gray-400 hover:text-yellow-400 hover:bg-gray-700'
                            : 'text-gray-600 hover:text-yellow-600 hover:bg-gray-100'
                      }`}
                      title={t('Support')}
                      aria-label={t('Support')}
                    >
                      <HelpCircle className="h-4 w-4" />
                    </button>
                    <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[60] whitespace-nowrap ${
                      state.theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'
                    }`}>
                      {t('Support')}
                    </div>
                  </div>
                </div>

                {/* Theme Toggle */}
                <div className="relative group">
                  <button
                    onClick={toggleTheme}
                    className={`p-2 rounded-lg transition-colors ${
                      state.theme === 'dark'
                        ? 'text-gray-300 hover:text-yellow-400 hover:bg-gray-700'
                        : 'text-gray-700 hover:text-yellow-600 hover:bg-gray-100'
                    }`}
                    aria-label={state.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                  >
                    {state.theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </button>
                  <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[60] whitespace-nowrap ${
                    state.theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'
                  }`}>
                    {state.theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </div>
                </div>

                {/* Language Toggle */}
                <div className="relative group">
                  <button
                    onClick={toggleLanguage}
                    className={`flex items-center space-x-1 transition-colors ${
                      state.theme === 'dark'
                        ? 'text-gray-300 hover:text-yellow-400'
                        : 'text-gray-700 hover:text-yellow-600'
                    }`}
                    aria-label="Switch language"
                  >
                    <Globe className="h-4 w-4" />
                    <span className="text-sm">{getLanguageDisplay()}</span>
                  </button>
                  <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[60] whitespace-nowrap ${
                    state.theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'
                  }`}>
                    Switch Language
                  </div>
                </div>

                {/* User Controls */}
                {state.user ? (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={goToDashboard}
                      className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors ${
                        state.currentStep === 'dashboard'
                          ? state.theme === 'dark'
                            ? 'bg-yellow-600 text-gray-900'
                            : 'bg-yellow-500 text-white'
                          : state.theme === 'dark'
                            ? 'bg-yellow-900 text-yellow-200 hover:bg-yellow-800'
                            : 'bg-yellow-50 text-yellow-800 hover:bg-yellow-100'
                      }`}
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span className="text-sm">
                        {t('Dashboard')}
                      </span>
                    </button>
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${
                      state.theme === 'dark'
                        ? 'bg-gray-700 text-gray-200'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <User className="h-4 w-4" />
                      <span className="text-sm">{state.user.firstName}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className={`p-2 transition-colors ${
                        state.theme === 'dark'
                          ? 'text-gray-400 hover:text-gray-200'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                      aria-label="Logout"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={toggleDemoMode}
                    className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                      state.theme === 'dark'
                        ? 'bg-yellow-600 text-gray-900 hover:bg-yellow-500'
                        : 'bg-yellow-500 text-white hover:bg-yellow-600'
                    }`}
                  >
                    {t('Try Demo', 'Try Demo')}
                  </button>
                )}

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={`lg:hidden p-2 ${
                    state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}
                  aria-label="Toggle mobile menu"
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Breadcrumbs */}
            {(isFeaturePage || ['about', 'services', 'support', 'contact', 'legal', 'dashboard'].includes(state.currentStep)) && (
              <div className={`py-2 border-t ${
                state.theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <nav className="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
                  {getBreadcrumbs().map((crumb, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && (
                        <ChevronRight className={`h-4 w-4 ${
                          state.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                      )}
                      {crumb.action ? (
                        <button
                          onClick={crumb.action}
                          className={`transition-colors ${
                            state.theme === 'dark'
                              ? 'text-gray-400 hover:text-yellow-400'
                              : 'text-gray-600 hover:text-yellow-600'
                          }`}
                        >
                          {crumb.label}
                        </button>
                      ) : (
                        <span className={`font-medium ${
                          state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {crumb.label}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </nav>
              </div>
            )}

            {/* Mobile menu */}
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`lg:hidden py-4 border-t ${
                  state.theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
                <nav className="flex flex-col space-y-4">
                  {/* Main Navigation */}
                  {[
                    { id: 'home', label: t('Home'), icon: Home, action: goToHome },
                    { id: 'about', label: t('About'), icon: Info, action: goToAbout },
                    { id: 'services', label: t('Services'), icon: Briefcase, action: goToServices },
                    { id: 'support', label: t('Support'), icon: HelpCircle, action: goToSupport },
                    { id: 'contact', label: t('Contact'), icon: Phone, action: goToContact },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        item.action();
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center space-x-2 transition-colors ${
                        state.currentStep === item.id
                          ? state.theme === 'dark'
                            ? 'text-yellow-400'
                            : 'text-yellow-600'
                          : state.theme === 'dark'
                            ? 'text-gray-300 hover:text-yellow-400'
                            : 'text-gray-700 hover:text-yellow-600'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                  
                  {/* Mobile Feature Navigation */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className={`text-sm font-medium mb-3 ${
                      state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {t('Features', 'Features')}
                    </p>
                    <div className="space-y-2">
                      {featureItems.map((feature) => (
                        <button
                          key={feature.id}
                          onClick={() => {
                            feature.action();
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center space-x-2 p-2 rounded-lg text-sm transition-colors ${
                            state.currentStep === feature.id
                              ? state.theme === 'dark'
                                ? 'bg-yellow-600 text-gray-900'
                                : 'bg-yellow-500 text-white'
                              : state.theme === 'dark'
                                ? 'text-gray-300 hover:text-yellow-400 hover:bg-gray-700'
                                : 'text-gray-700 hover:text-yellow-600 hover:bg-gray-100'
                          }`}
                        >
                          <feature.icon className="h-4 w-4" />
                          <span>{feature.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Additional Features */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className={`text-sm font-medium mb-3 ${
                      state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {t('Tools', 'Tools')}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {additionalFeatures.map((feature) => (
                        <button
                          key={feature.id}
                          onClick={() => {
                            feature.action();
                            setMobileMenuOpen(false);
                          }}
                          className={`flex items-center space-x-2 p-2 rounded-lg text-sm transition-colors ${
                            state.theme === 'dark'
                              ? 'text-gray-300 hover:text-yellow-400 hover:bg-gray-700'
                              : 'text-gray-700 hover:text-yellow-600 hover:bg-gray-100'
                          }`}
                        >
                          <feature.icon className="h-4 w-4" />
                          <span>{feature.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </nav>
              </motion.div>
            )}
          </div>
        </motion.header>
      )}

      <main className="flex-1">
        {children}
      </main>

      {showFooter && (
        <footer className={`transition-colors duration-300 ${
          state.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-900 text-white'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <div className="text-2xl mr-2">🐉</div>
                  <span className="text-lg font-bold">
                    Druk eResidency
                  </span>
                </div>
                <p className={`text-sm ${
                  state.theme === 'dark' ? 'text-gray-300' : 'text-gray-400'
                }`}>
                  {t('Empowering global entrepreneurs through digital residency in the Land of the Thunder Dragon.', 'Empowering global entrepreneurs through digital residency in the Land of the Thunder Dragon.')}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">
                  {t('Services')}
                </h3>
                <ul className={`space-y-2 text-sm ${
                  state.theme === 'dark' ? 'text-gray-300' : 'text-gray-400'
                }`}>
                  <li><button onClick={goToServices} className="hover:text-yellow-400 transition-colors">
                    {t('Digital Residency', 'Digital Residency')}
                  </button></li>
                  <li><button onClick={goToServices} className="hover:text-yellow-400 transition-colors">
                    {t('Business Formation', 'Business Formation')}
                  </button></li>
                  <li><button onClick={goToServices} className="hover:text-yellow-400 transition-colors">
                    {t('Tax Services', 'Tax Services')}
                  </button></li>
                  <li><button onClick={goToServices} className="hover:text-yellow-400 transition-colors">
                    {t('Government Services', 'Government Services')}
                  </button></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">
                  {t('Support')}
                </h3>
                <ul className={`space-y-2 text-sm ${
                  state.theme === 'dark' ? 'text-gray-300' : 'text-gray-400'
                }`}>
                  <li><button onClick={goToSupport} className="hover:text-yellow-400 transition-colors">
                    {t('Help Center', 'Help Center')}
                  </button></li>
                  <li><button onClick={goToContact} className="hover:text-yellow-400 transition-colors">
                    {t('Contact Us', 'Contact Us')}
                  </button></li>
                  <li><button onClick={goToSupport} className="hover:text-yellow-400 transition-colors">
                    {t('Documentation', 'Documentation')}
                  </button></li>
                  <li><button onClick={goToSupport} className="hover:text-yellow-400 transition-colors">
                    {t('API Reference', 'API Reference')}
                  </button></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">
                  {t('Legal', 'Legal')}
                </h3>
                <ul className={`space-y-2 text-sm ${
                  state.theme === 'dark' ? 'text-gray-300' : 'text-gray-400'
                }`}>
                  <li><button onClick={goToLegal} className="hover:text-yellow-400 transition-colors">
                    {t('Privacy Policy', 'Privacy Policy')}
                  </button></li>
                  <li><button onClick={goToLegal} className="hover:text-yellow-400 transition-colors">
                    {t('Terms of Service', 'Terms of Service')}
                  </button></li>
                  <li><button onClick={goToLegal} className="hover:text-yellow-400 transition-colors">
                    {t('Compliance', 'Compliance')}
                  </button></li>
                  <li><button onClick={goToLegal} className="hover:text-yellow-400 transition-colors">
                    {t('Security', 'Security')}
                  </button></li>
                </ul>
              </div>
            </div>
            
            <div className={`mt-8 pt-8 border-t text-center text-sm ${
              state.theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-800 text-gray-400'
            }`}>
              <p>
                © 2025 Kingdom of Bhutan. All rights reserved. Built with 🐉 in the Himalayas.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};