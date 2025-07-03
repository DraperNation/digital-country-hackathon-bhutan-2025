import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  LogOut, 
  User, 
  Building2, 
  HelpCircle, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Globe,
  ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isHomePage = location.pathname === '/';

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/business-services', label: 'Business Services' },
    { path: '/kyc', label: t('nav.kyc') },
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'dz', name: 'རྫོང་ཁ', flag: '🇧🇹' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isHomePage ? 'bhutan-bg' : 'bhutan-bg-blur'
    }`}>
      <nav className={`shadow-2xl border-b sticky top-0 z-50 transition-all duration-300 ${
        theme === 'dark' 
          ? 'glass-nav border-white/20' 
          : 'glass-nav border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 min-w-0">
              <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
                <div className="relative">
                  <div className="relative transform group-hover:scale-110 transition-all duration-500">
                    <div className={`absolute inset-0 rounded-xl sm:rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity ${
                      theme === 'dark' 
                        ? 'bg-gradient-to-r from-orange-400 to-red-500' 
                        : 'bg-gradient-to-r from-orange-500 to-red-600'
                    }`}></div>
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden">
                      <img 
                        src="/logo.png" 
                        alt="Bhutan eResidency Logo" 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className={`absolute inset-0 rounded-xl sm:rounded-2xl items-center justify-center hidden ${
                        theme === 'dark'
                          ? 'bg-gradient-to-br from-orange-500 via-red-500 to-orange-600'
                          : 'bg-gradient-to-br from-orange-600 via-red-600 to-orange-700'
                      }`}>
                        <Building2 className="h-4 w-4 sm:h-5 sm:w-5 lg:h-7 lg:w-7 text-white drop-shadow-lg" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className={`text-sm sm:text-lg lg:text-2xl font-display font-bold leading-tight truncate ${
                    theme === 'dark' ? 'text-white text-shadow-strong' : 'text-black'
                  }`}>
                    Bhutan eResidency
                  </span>
                  <span className={`text-xs sm:text-sm font-medium tracking-wide hidden sm:block truncate ${
                    theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-700'
                  }`}>
                    Digital Gateway
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl'
                      : theme === 'dark'
                        ? 'text-white hover:text-white hover:bg-white/10 backdrop-blur-sm text-shadow'
                        : 'text-black hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 sm:p-3 rounded-xl transition-all duration-300 ${
                  theme === 'dark'
                    ? 'text-white hover:bg-white/10 backdrop-blur-sm'
                    : 'text-black hover:bg-slate-100'
                }`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
              </button>

              {/* Language Selector */}
              <div className="relative language-selector">
                <button
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  className={`flex items-center px-2 sm:px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    theme === 'dark'
                      ? 'text-white hover:bg-white/10 backdrop-blur-sm text-shadow'
                      : 'text-black hover:bg-slate-100'
                  }`}
                >
                  <Globe className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="mr-1">{currentLanguage?.flag}</span>
                  <span className="mr-1 hidden xl:inline">{currentLanguage?.name}</span>
                  <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>

                {languageMenuOpen && (
                  <div className={`language-dropdown dropdown-menu ${
                    theme === 'dark'
                      ? 'glass-form border-white/20'
                      : 'glass-form border-slate-200'
                  }`}>
                    <div className="py-2">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code as any);
                            setLanguageMenuOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                            language === lang.code
                              ? theme === 'dark'
                                ? 'bg-orange-500/20 text-orange-300'
                                : 'bg-orange-50 text-orange-700'
                              : theme === 'dark'
                                ? 'text-white hover:bg-white/10'
                                : 'text-black hover:bg-slate-50'
                          }`}
                        >
                          <span className="mr-3">{lang.flag}</span>
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Actions */}
              {currentUser ? (
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <Link
                    to="/dashboard"
                    className={`px-3 sm:px-4 xl:px-6 py-2 sm:py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      isActive('/dashboard')
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl'
                        : theme === 'dark'
                          ? 'text-white hover:text-white hover:bg-white/10 backdrop-blur-sm text-shadow'
                          : 'text-black hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <User className="h-4 w-4 inline mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">{t('nav.dashboard')}</span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className={`px-3 sm:px-4 xl:px-6 py-2 sm:py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      theme === 'dark'
                        ? 'text-white hover:text-white hover:bg-red-500/20 backdrop-blur-sm text-shadow'
                        : 'text-black hover:text-red-700 hover:bg-red-50'
                    }`}
                  >
                    <LogOut className="h-4 w-4 inline mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">{t('nav.logout')}</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <Link
                    to="/login"
                    className={`px-3 sm:px-4 xl:px-6 py-2 sm:py-3 text-sm font-semibold transition-all duration-300 ${
                      theme === 'dark'
                        ? 'text-white hover:text-white text-shadow'
                        : 'text-black hover:text-slate-900'
                    }`}
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 sm:px-6 xl:px-8 py-2 sm:py-3 text-sm font-bold rounded-xl transition-all duration-300 shadow-xl transform hover:-translate-y-1 hover:shadow-2xl btn-primary"
                  >
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu controls */}
            <div className="lg:hidden flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors btn-mobile ${
                  theme === 'dark'
                    ? 'text-white hover:bg-white/10'
                    : 'text-black hover:bg-slate-100'
                }`}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-lg transition-colors btn-mobile ${
                  theme === 'dark'
                    ? 'text-white hover:bg-white/10'
                    : 'text-black hover:bg-slate-100'
                }`}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className={`lg:hidden py-4 border-t ${
              theme === 'dark' ? 'border-white/20' : 'border-slate-200'
            }`}>
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`mobile-nav-item px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl'
                        : theme === 'dark'
                          ? 'text-white hover:bg-white/10 text-shadow'
                          : 'text-black hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Mobile Language Selector */}
                <div className="px-4 py-2">
                  <div className={`text-sm font-medium mb-3 ${
                    theme === 'dark' ? 'text-white/80 text-shadow' : 'text-slate-600'
                  }`}>
                    Language / भाषा / སྐད་ཡིག
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code as any);
                          setMobileMenuOpen(false);
                        }}
                        className={`p-3 rounded-lg text-xs font-medium transition-colors text-center btn-mobile ${
                          language === lang.code
                            ? theme === 'dark'
                              ? 'bg-orange-500/20 text-orange-300'
                              : 'bg-orange-50 text-orange-700'
                            : theme === 'dark'
                              ? 'text-white hover:bg-white/10'
                              : 'text-black hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-lg mb-1">{lang.flag}</div>
                        <div className="text-xs">{lang.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {currentUser ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`mobile-nav-item px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                        theme === 'dark'
                          ? 'text-white hover:bg-white/10 text-shadow'
                          : 'text-black hover:bg-slate-100'
                      }`}
                    >
                      <User className="h-4 w-4 inline mr-2" />
                      {t('nav.dashboard')}
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className={`mobile-nav-item px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 text-left w-full ${
                        theme === 'dark'
                          ? 'text-white hover:bg-red-500/20 text-shadow'
                          : 'text-black hover:bg-red-50'
                      }`}
                    >
                      <LogOut className="h-4 w-4 inline mr-2" />
                      {t('nav.logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`mobile-nav-item px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                        theme === 'dark'
                          ? 'text-white hover:bg-white/10 text-shadow'
                          : 'text-black hover:bg-slate-100'
                      }`}
                    >
                      {t('nav.login')}
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 rounded-lg text-sm font-bold transition-all duration-300 shadow-lg btn-primary btn-mobile-full"
                    >
                      {t('nav.register')}
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="flex-1">
        {children}
      </main>

      {/* Floating Help Button */}
      <button className={`floating-help rounded-full flex items-center justify-center transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl'
          : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl'
      }`}>
        <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Click outside to close language menu */}
      {languageMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setLanguageMenuOpen(false)}
        />
      )}
    </div>
  );
};