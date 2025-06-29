import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Building2, 
  DollarSign, 
  TrendingUp, 
  Globe, 
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Wallet,
  BarChart3,
  MessageSquare,
  Calendar,
  Award,
  Bell,
  Settings,
  Home,
  ChevronRight,
  ArrowLeft,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { AIAssistant } from '../ai-assistant/AIAssistant';
import { DocumentVault } from '../document-vault/DocumentVault';
import { BankingHub } from '../banking/BankingHub';
import { CommunityPlatform } from '../community/CommunityPlatform';
import { ComplianceCalendar } from '../compliance/ComplianceCalendar';
import { LearningSystem } from '../gamification/LearningSystem';
import { NotificationCenter } from './NotificationCenter';
import { SettingsPanel } from './SettingsPanel';

interface BreadcrumbItem {
  label: string;
  action?: () => void;
}

export const EnhancedDashboard: React.FC = () => {
  const { state, dispatch } = useApp();
  const [activeSection, setActiveSection] = useState<'overview' | 'documents' | 'banking' | 'community' | 'compliance' | 'learning'>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
  
  const stats = [
    { label: state.language === 'en' ? 'Total eResidents' : 'ཨི་རེསིཌེནཊ་ཚང་མ', value: '12,847', change: '+23%', icon: Users, color: 'primary' },
    { label: state.language === 'en' ? 'Companies Formed' : 'ཚོང་ལས་གསར་འཛུགས', value: '3,421', change: '+18%', icon: Building2, color: 'secondary' },
    { label: state.language === 'en' ? 'Revenue Generated' : 'འབྱོར་འབབ་བསྐྲུན', value: '$5.1M', change: '+31%', icon: DollarSign, color: 'accent' },
    { label: state.language === 'en' ? 'Countries Served' : 'ཞབས་ཏོག་སྤྲད་པའི་རྒྱལ་ཁབ', value: '127', change: '+5', icon: Globe, color: 'success' },
  ];

  const recentApplications = [
    { name: 'Emma Chen', country: 'Singapore', status: 'approved', type: 'AI Startup LLC', risk: 15 },
    { name: 'Carlos Rodriguez', country: 'Mexico', status: 'processing', type: 'Freelance Corp', risk: 25 },
    { name: 'Amara Okafor', country: 'Nigeria', status: 'review', type: 'Fintech LLC', risk: 45 },
    { name: 'James Wilson', country: 'UK', status: 'approved', type: 'Consulting LLC', risk: 20 },
    { name: 'Li Wei', country: 'China', status: 'processing', type: 'E-commerce Corp', risk: 30 },
  ];

  const quickActions = [
    { 
      id: 'documents', 
      name: state.language === 'en' ? 'Document Vault' : 'ཡིག་ཆ་མཛོད', 
      description: state.language === 'en' ? 'Manage your documents with AI organization' : 'AI སྒྲིག་འཇུག་ཐོག་ཡིག་ཆ་སྐྱོང་སྲུང',
      icon: FileText, 
      color: 'primary',
      count: state.language === 'en' ? '24 documents' : 'ཡིག་ཆ་༢༤'
    },
    { 
      id: 'banking', 
      name: state.language === 'en' ? 'Banking Hub' : 'དངུལ་ཁང་ལྟེ་གནས', 
      description: state.language === 'en' ? 'Open accounts with partner banks' : 'མཉམ་ལས་དངུལ་ཁང་ནས་རྩིས་ཁྲ་ཕྱེ',
      icon: Wallet, 
      color: 'secondary',
      count: state.language === 'en' ? '4 partners' : 'མཉམ་ལས་པ་༤'
    },
    { 
      id: 'community', 
      name: state.language === 'en' ? 'Community' : 'སྤྱི་ཚོགས', 
      description: state.language === 'en' ? 'Connect with fellow eResidents' : 'ཨི་རེསིཌེནཊ་མཉམ་རུབ་དང་འབྲེལ་མཐུད',
      icon: MessageSquare, 
      color: 'accent',
      count: state.language === 'en' ? '2,847 members' : 'འཐུས་མི་༢,༨༤༧'
    },
    { 
      id: 'compliance', 
      name: state.language === 'en' ? 'Compliance' : 'མཐུན་སྒྲིག', 
      description: state.language === 'en' ? 'Track deadlines and requirements' : 'དུས་ཚོད་དང་དགོས་མཁོ་ལྟ་རྟོག',
      icon: Calendar, 
      color: 'warning',
      count: state.language === 'en' ? '3 upcoming' : 'འབྱུང་འགྲོ་༣'
    },
    { 
      id: 'learning', 
      name: state.language === 'en' ? 'Learning Center' : 'སློབ་སྦྱོང་ལྟེ་གནས', 
      description: state.language === 'en' ? 'Earn rewards while learning' : 'སློབ་སྦྱོང་བྱེད་སྐབས་རྒྱུགས་སྐྱེད་ཐོབ',
      icon: Award, 
      color: 'success',
      count: state.language === 'en' ? '3.5% discount earned' : 'ཕབ་ཆ་༣.༥% ཐོབ'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-success-600 bg-success-50';
      case 'processing': return 'text-warning-600 bg-warning-50';
      case 'review': return 'text-error-600 bg-error-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk < 20) return 'text-success-600';
    if (risk < 40) return 'text-warning-600';
    return 'text-error-600';
  };

  const goToHome = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'welcome' });
  };

  const goToSection = (section: typeof activeSection) => {
    setActiveSection(section);
  };

  const toggleLanguage = () => {
    const newLanguage = state.language === 'en' ? 'dz' : 'en';
    dispatch({ type: 'SET_LANGUAGE', payload: newLanguage });
  };

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [
      { label: state.language === 'en' ? 'Home' : 'ཁྱིམ', action: goToHome },
      { label: state.language === 'en' ? 'Dashboard' : 'ཚོད་ལྟ་སྒེའུ་ཁུང', action: () => setActiveSection('overview') }
    ];

    if (activeSection !== 'overview') {
      const sectionNames = {
        documents: state.language === 'en' ? 'Document Vault' : 'ཡིག་ཆ་མཛོད',
        banking: state.language === 'en' ? 'Banking Hub' : 'དངུལ་ཁང་ལྟེ་གནས',
        community: state.language === 'en' ? 'Community Platform' : 'སྤྱི་ཚོགས་མཉེན་ཆས',
        compliance: state.language === 'en' ? 'Compliance Calendar' : 'མཐུན་སྒྲིག་ལོ་ཐོ',
        learning: state.language === 'en' ? 'Learning System' : 'སློབ་སྦྱོང་རིམ་ལུགས'
      };
      breadcrumbs.push({ label: sectionNames[activeSection] });
    }

    return breadcrumbs;
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-8 text-white transition-colors duration-300 ${
          state.theme === 'dark' 
            ? 'bg-gradient-to-r from-yellow-600 to-orange-600' 
            : 'bg-gradient-to-r from-yellow-600 to-orange-600'
        }`}
      >
        <h1 className="text-3xl font-bold mb-2">
          {state.language === 'en' ? `Welcome back, ${state.user?.firstName || 'Admin'}` : `ཕྱིར་ལོག་པར་དགའ་བསུ། ${state.user?.firstName || 'འགོ་ཁྲིད'}`}
        </h1>
        <p className="text-yellow-100 mb-6">
          {state.language === 'en' 
            ? 'Monitor and manage the Bhutan eResidency platform with enhanced features'
            : 'ཁྱད་ཆོས་ལེགས་བཅོས་དང་བཅས་འབྲུག་ཨི་རེསིཌེནསི་མཉེན་ཆས་ལྟ་རྟོག་དང་སྐྱོང་སྲུང'
          }
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">15 {state.language === 'en' ? 'min' : 'སྐར་མ'}</div>
            <div className="text-yellow-200">{state.language === 'en' ? 'Average Setup Time' : 'ཆ་སྙོམས་སྒྲིག་འཇུག་དུས་ཚོད'}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">99.9%</div>
            <div className="text-yellow-200">{state.language === 'en' ? 'System Uptime' : 'རིམ་ལུགས་འཁྱུད་ཡོད'}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">4.8/5</div>
            <div className="text-yellow-200">{state.language === 'en' ? 'User Satisfaction' : 'སྤྱོད་མཁན་ངོ་མཚར'}</div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow ${
              state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${
                stat.color === 'primary' ? 'bg-yellow-100 text-yellow-600' :
                stat.color === 'secondary' ? 'bg-orange-100 text-orange-600' :
                stat.color === 'accent' ? 'bg-red-100 text-red-600' :
                'bg-green-100 text-green-600'
              }`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <span className="text-success-600 text-sm font-medium">
                {stat.change}
              </span>
            </div>
            <h3 className={`text-2xl font-bold mb-1 ${
              state.theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {stat.value}
            </h3>
            <p className={`text-sm ${
              state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className={`text-2xl font-bold mb-6 ${
          state.theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>{state.language === 'en' ? 'Quick Actions' : 'མགྱོགས་པའི་བྱ་བ'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => setActiveSection(action.id as any)}
              className={`rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border p-6 ${
                state.theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
                  : 'bg-white border-gray-100 hover:border-yellow-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                  action.color === 'primary' ? 'bg-yellow-100 text-yellow-600' :
                  action.color === 'secondary' ? 'bg-orange-100 text-orange-600' :
                  action.color === 'accent' ? 'bg-red-100 text-red-600' :
                  action.color === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  action.color === 'primary' ? 'bg-yellow-100 text-yellow-700' :
                  action.color === 'secondary' ? 'bg-orange-100 text-orange-700' :
                  action.color === 'accent' ? 'bg-red-100 text-red-700' :
                  action.color === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {action.count}
                </span>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${
                state.theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {action.name}
              </h3>
              <p className={`text-sm ${
                state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {action.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`rounded-2xl p-6 shadow-lg ${
            state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold ${
              state.theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{state.language === 'en' ? 'Recent Applications' : 'ཉེ་ཆར་ཞུ་ཡིག'}</h2>
            <button className="text-yellow-600 hover:text-yellow-700 text-sm font-medium">
              {state.language === 'en' ? 'View All' : 'ཚང་མ་ལྟ'}
            </button>
          </div>
          
          <div className="space-y-4">
            {recentApplications.map((app, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
                  state.theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {app.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className={`font-medium ${
                      state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{app.name}</p>
                    <p className={`text-sm ${
                      state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>{app.country} • {app.type}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                    {state.language === 'en' ? app.status : 
                     app.status === 'approved' ? 'ཆོག་མཆན' :
                     app.status === 'processing' ? 'བྱེད་བཞིན' :
                     'ཞིབ་བཤེར'
                    }
                  </span>
                  <span className={`text-sm font-medium ${getRiskColor(app.risk)}`}>
                    {state.language === 'en' ? `Risk: ${app.risk}` : `ཉེན་ཁ: ${app.risk}`}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Platform Performance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`rounded-2xl p-6 shadow-lg ${
            state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h2 className={`text-xl font-bold mb-6 ${
            state.theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>{state.language === 'en' ? 'Platform Performance' : 'མཉེན་ཆས་ལས་འགུལ'}</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${
                  state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>{state.language === 'en' ? 'Average Processing Time' : 'ཆ་སྙོམས་བྱེད་སྒོའི་དུས་ཚོད'}</span>
                <span className={`text-sm ${
                  state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>14.2 {state.language === 'en' ? 'minutes' : 'སྐར་མ'}</span>
              </div>
              <div className={`w-full rounded-full h-2 ${
                state.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div className="bg-success-500 h-2 rounded-full w-4/5"></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${
                  state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>{state.language === 'en' ? 'KYC Success Rate' : 'KYC ལེགས་གྲུབ་ཚད'}</span>
                <span className={`text-sm ${
                  state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>94.7%</span>
              </div>
              <div className={`w-full rounded-full h-2 ${
                state.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div className="bg-yellow-500 h-2 rounded-full w-11/12"></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${
                  state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>{state.language === 'en' ? 'System Uptime' : 'རིམ་ལུགས་འཁྱུད་ཡོད'}</span>
                <span className={`text-sm ${
                  state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>99.9%</span>
              </div>
              <div className={`w-full rounded-full h-2 ${
                state.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div className="bg-orange-500 h-2 rounded-full w-full"></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${
                  state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>{state.language === 'en' ? 'User Satisfaction' : 'སྤྱོད་མཁན་ངོ་མཚར'}</span>
                <span className={`text-sm ${
                  state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>4.8/5.0</span>
              </div>
              <div className={`w-full rounded-full h-2 ${
                state.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div className="bg-red-500 h-2 rounded-full w-11/12"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Economic Impact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl p-8 text-white"
      >
        <h2 className="text-2xl font-bold mb-6">{state.language === 'en' ? 'Economic Impact Projection' : 'དཔལ་འབྱོར་ཤུགས་རྐྱེན་ཚོད་དཔག'}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">$39.9M</div>
            <div className="text-yellow-200">{state.language === 'en' ? 'Projected Annual Revenue' : 'ལོ་རེའི་འབྱོར་འབབ་ཚོད་དཔག'}</div>
            <div className="text-sm text-yellow-100 mt-1">{state.language === 'en' ? '100,000 eResidents × $399' : 'ཨི་རེསིཌེནཊ་༡༠༠,༠༠༠ × $༣༩༩'}</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">2,500</div>
            <div className="text-yellow-200">{state.language === 'en' ? 'New Jobs Created' : 'ལས་ཀ་གསར་པ་བསྐྲུན'}</div>
            <div className="text-sm text-yellow-100 mt-1">{state.language === 'en' ? 'Direct & indirect employment' : 'ཐད་ཀར་དང་ཡན་ལག་ལས་གནས'}</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">15 {state.language === 'en' ? 'min' : 'སྐར་མ'}</div>
            <div className="text-yellow-200">{state.language === 'en' ? 'Average Setup Time' : 'ཆ་སྙོམས་སྒྲིག་འཇུག་དུས་ཚོད'}</div>
            <div className="text-sm text-yellow-100 mt-1">{state.language === 'en' ? 'vs 30 days traditional' : 'སྔ་རྗེས་ཉིན་༣༠ ལས་མགྱོགས'}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const sidebarItems = [
    { id: 'overview', name: state.language === 'en' ? 'Overview' : 'སྤྱིར་བཏང', icon: BarChart3 },
    { id: 'documents', name: state.language === 'en' ? 'Documents' : 'ཡིག་ཆ', icon: FileText },
    { id: 'banking', name: state.language === 'en' ? 'Banking' : 'དངུལ་ཁང', icon: Wallet },
    { id: 'community', name: state.language === 'en' ? 'Community' : 'སྤྱི་ཚོགས', icon: MessageSquare },
    { id: 'compliance', name: state.language === 'en' ? 'Compliance' : 'མཐུན་སྒྲིག', icon: Calendar },
    { id: 'learning', name: state.language === 'en' ? 'Learning' : 'སློབ་སྦྱོང', icon: Award }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      state.theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'
    }`}>
      {/* Top Navigation Bar */}
      <div className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        state.theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white/90 backdrop-blur-md border-gray-200'
      }`}>
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left side - Breadcrumbs */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg transition-colors ${
                state.theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            
            <nav className="flex items-center space-x-2">
              {getBreadcrumbs().map((crumb, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {index > 0 && (
                    <ChevronRight className={`h-4 w-4 ${
                      state.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                  )}
                  {crumb.action ? (
                    <button
                      onClick={crumb.action}
                      className={`text-sm font-medium transition-colors ${
                        state.theme === 'dark'
                          ? 'text-gray-400 hover:text-yellow-400'
                          : 'text-gray-600 hover:text-yellow-600'
                      }`}
                    >
                      {crumb.label}
                    </button>
                  ) : (
                    <span className={`text-sm font-medium ${
                      state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {crumb.label}
                    </span>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Right side - Controls */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <div className="relative group">
              <button
                onClick={toggleLanguage}
                className={`flex items-center space-x-1 transition-colors ${
                  state.theme === 'dark'
                    ? 'text-gray-300 hover:text-yellow-400'
                    : 'text-gray-700 hover:text-yellow-600'
                }`}
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm">{state.language === 'en' ? 'EN' : 'རྫོང་ཁ'}</span>
              </button>
              <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[60] whitespace-nowrap ${
                state.theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'
              }`}>
                {state.language === 'en' ? 'Switch to Dzongkha' : 'Switch to English'}
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
              >
                {state.theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[60] whitespace-nowrap ${
                state.theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'
              }`}>
                {state.theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </div>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationCenterOpen(true)}
                className={`p-2 rounded-lg transition-colors relative ${
                  state.theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Bell className="h-4 w-4" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </button>
            </div>

            {/* Settings */}
            <button
              onClick={() => setSettingsPanelOpen(true)}
              className={`p-2 rounded-lg transition-colors ${
                state.theme === 'dark'
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Settings className="h-4 w-4" />
            </button>

            {/* User Info */}
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
              state.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {state.user?.firstName?.[0] || 'U'}
              </div>
              <span className={`text-sm font-medium ${
                state.theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {state.user?.firstName || 'User'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <motion.div
          initial={false}
          animate={{ width: sidebarOpen ? 256 : 0 }}
          transition={{ duration: 0.3 }}
          className={`overflow-hidden shadow-lg transition-colors duration-300 ${
            state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className="w-64 p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="text-3xl">🐉</div>
              <div>
                <h2 className={`text-lg font-bold ${
                  state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{state.language === 'en' ? 'Dashboard' : 'ཚོད་ལྟ་སྒེའུ་ཁུང'}</h2>
                <p className={`text-xs ${
                  state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>{state.language === 'en' ? 'eResidency Platform' : 'ཨི་རེསིཌེནསི་མཉེན་ཆས'}</p>
              </div>
            </div>
            
            <nav className="space-y-2">
              {sidebarItems.map(item => (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => setActiveSection(item.id as any)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeSection === item.id
                        ? state.theme === 'dark'
                          ? 'bg-yellow-600 text-white'
                          : 'bg-yellow-50 text-yellow-700 border-r-2 border-yellow-600'
                        : state.theme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                </div>
              ))}
            </nav>

            {/* Quick Navigation */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className={`text-sm font-medium mb-3 ${
                state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>{state.language === 'en' ? 'Quick Navigation' : 'མགྱོགས་པའི་འགྲུལ་བསྐྱོད'}</h3>
              <div className="space-y-2">
                <button
                  onClick={goToHome}
                  className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    state.theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span>{state.language === 'en' ? 'Back to Home' : 'ཁྱིམ་ལ་ལོག'}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeSection === 'overview' && renderOverview()}
            {activeSection === 'documents' && <DocumentVault />}
            {activeSection === 'banking' && <BankingHub />}
            {activeSection === 'community' && <CommunityPlatform />}
            {activeSection === 'compliance' && <ComplianceCalendar />}
            {activeSection === 'learning' && <LearningSystem />}
          </motion.div>
        </div>
      </div>

      {/* AI Assistant */}
      <AIAssistant />

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={notificationCenterOpen} 
        onClose={() => setNotificationCenterOpen(false)} 
      />

      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={settingsPanelOpen} 
        onClose={() => setSettingsPanelOpen(false)} 
      />
    </div>
  );
};