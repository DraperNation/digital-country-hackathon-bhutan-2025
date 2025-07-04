import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  X, 
  User, 
  Bell, 
  Palette, 
  Globe,
  Shield,
  Save,
  Camera,
  Mail,
  Phone,
  MapPin,
  Eye,
  EyeOff
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'display' | 'security'>('profile');
  const [profileData, setProfileData] = useState({
    firstName: state.user?.firstName || '',
    lastName: state.user?.lastName || '',
    email: state.user?.email || '',
    phone: state.user?.phone || '',
    country: state.user?.country || '',
    bio: '',
    website: '',
    company: state.user?.companies[0]?.name || ''
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    systemUpdates: true,
    complianceReminders: true,
    marketingEmails: false,
    weeklyDigest: true
  });
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: '30',
    passwordLastChanged: new Date('2024-01-15')
  });
  const [showPassword, setShowPassword] = useState(false);

  const tabs = [
    { 
      id: 'profile', 
      name: state.language === 'en' ? 'Profile' : 'རྒྱུད་རིམ', 
      icon: User 
    },
    { 
      id: 'notifications', 
      name: state.language === 'en' ? 'Notifications' : 'བརྡ་ལན', 
      icon: Bell 
    },
    { 
      id: 'display', 
      name: state.language === 'en' ? 'Display' : 'མངོན་སྟོན', 
      icon: Palette 
    },
    { 
      id: 'security', 
      name: state.language === 'en' ? 'Security' : 'བདེ་འཇགས', 
      icon: Shield 
    }
  ];

  const handleProfileSave = () => {
    if (state.user) {
      const updatedUser = {
        ...state.user,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
        country: profileData.country
      };
      dispatch({ type: 'SET_USER', payload: updatedUser });
    }
    alert(state.language === 'en' ? 'Profile updated successfully!' : 'རྒྱུད་རིམ་ལེགས་པར་གསར་བཅོས་བྱས!');
  };

  const handleNotificationSave = () => {
    // Save notification settings
    alert(state.language === 'en' ? 'Notification preferences saved!' : 'བརྡ་ལན་གདམ་ཀ་ཉར་ཚགས་བྱས!');
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Picture */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {profileData.firstName[0]}{profileData.lastName[0]}
          </div>
          <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors">
            <Camera className="h-3 w-3" />
          </button>
        </div>
        <div>
          <h3 className={`font-semibold ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {profileData.firstName} {profileData.lastName}
          </h3>
          <p className={`text-sm ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {state.language === 'en' ? 'eResident ID:' : 'ཨི་རེསིཌེནཊ་ཨང་རྟགས:'} {state.user?.digitalId || 'BT2024001'}
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            state.theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
          }`}>
            {state.language === 'en' ? 'First Name' : 'མིང་སྔོན་མ'}
          </label>
          <input
            type="text"
            value={profileData.firstName}
            onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
              state.theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            state.theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
          }`}>
            {state.language === 'en' ? 'Last Name' : 'མིང་ཕྱི་མ'}
          </label>
          <input
            type="text"
            value={profileData.lastName}
            onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
              state.theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            state.theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
          }`}>
            {state.language === 'en' ? 'Email' : 'གློག་འཕྲིན'}
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                state.theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            state.theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
          }`}>
            {state.language === 'en' ? 'Phone' : 'ཁ་པར'}
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                state.theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            state.theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
          }`}>
            {state.language === 'en' ? 'Country' : 'རྒྱལ་ཁབ'}
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={profileData.country}
              onChange={(e) => setProfileData({...profileData, country: e.target.value})}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                state.theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            state.theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
          }`}>
            {state.language === 'en' ? 'Company' : 'ཚོང་ལས'}
          </label>
          <input
            type="text"
            value={profileData.company}
            onChange={(e) => setProfileData({...profileData, company: e.target.value})}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
              state.theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>
      </div>

      <button
        onClick={handleProfileSave}
        className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
      >
        <Save className="h-4 w-4" />
        <span>{state.language === 'en' ? 'Save Changes' : 'བཅོས་བསྒྱུར་ཉར་ཚགས'}</span>
      </button>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${
          state.theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {state.language === 'en' ? 'Notification Preferences' : 'བརྡ་ལན་གདམ་ཀ'}
        </h3>
        
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: state.language === 'en' ? 'Email Notifications' : 'གློག་འཕྲིན་བརྡ་ལན' },
            { key: 'pushNotifications', label: state.language === 'en' ? 'Push Notifications' : 'འདེད་བརྡ་ལན' },
            { key: 'systemUpdates', label: state.language === 'en' ? 'System Updates' : 'རིམ་ལུགས་གསར་བཅོས' },
            { key: 'complianceReminders', label: state.language === 'en' ? 'Compliance Reminders' : 'མཐུན་སྒྲིག་དྲན་སྐུལ' },
            { key: 'marketingEmails', label: state.language === 'en' ? 'Marketing Emails' : 'ཚོང་འཛིན་གློག་འཕྲིན' },
            { key: 'weeklyDigest', label: state.language === 'en' ? 'Weekly Digest' : 'གཟའ་འཁོར་བསྡུས་དོན' }
          ].map(setting => (
            <div key={setting.key} className="flex items-center justify-between">
              <span className={`${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {setting.label}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings[setting.key as keyof typeof notificationSettings]}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    [setting.key]: e.target.checked
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleNotificationSave}
        className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
      >
        <Save className="h-4 w-4" />
        <span>{state.language === 'en' ? 'Save Preferences' : 'གདམ་ཀ་ཉར་ཚགས'}</span>
      </button>
    </div>
  );

  const renderDisplayTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${
          state.theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {state.language === 'en' ? 'Display Settings' : 'མངོན་སྟོན་སྒྲིག་འཇུག'}
        </h3>
        
        <div className="space-y-4">
          {/* Theme Selection */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              state.theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {state.language === 'en' ? 'Theme' : 'བརྗོད་གཞི'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => dispatch({ type: 'SET_THEME', payload: 'light' })}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  state.theme === 'light'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                  <span className={`text-sm ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {state.language === 'en' ? 'Light' : 'འོད་གསལ'}
                  </span>
                </div>
              </button>
              <button
                onClick={() => dispatch({ type: 'SET_THEME', payload: 'dark' })}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  state.theme === 'dark'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-800 border border-gray-600 rounded"></div>
                  <span className={`text-sm ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {state.language === 'en' ? 'Dark' : 'མུན་ནག'}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Language Selection */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              state.theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {state.language === 'en' ? 'Language' : 'སྐད་ཡིག'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => dispatch({ type: 'SET_LANGUAGE', payload: 'en' })}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  state.language === 'en'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span className={`text-sm ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    English
                  </span>
                </div>
              </button>
              <button
                onClick={() => dispatch({ type: 'SET_LANGUAGE', payload: 'dz' })}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  state.language === 'dz'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span className={`text-sm ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    རྫོང་ཁ
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${
          state.theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {state.language === 'en' ? 'Security Settings' : 'བདེ་འཇགས་སྒྲིག་འཇུག'}
        </h3>
        
        <div className="space-y-4">
          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between">
            <div>
              <span className={`font-medium ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {state.language === 'en' ? 'Two-Factor Authentication' : 'གཉིས་ལྡན་ར་སྤྲོད'}
              </span>
              <p className={`text-sm ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {state.language === 'en' ? 'Add an extra layer of security' : 'བདེ་འཇགས་ཀྱི་རིམ་པ་ཁ་སྐོང'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securitySettings.twoFactorAuth}
                onChange={(e) => setSecuritySettings({
                  ...securitySettings,
                  twoFactorAuth: e.target.checked
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {/* Login Alerts */}
          <div className="flex items-center justify-between">
            <div>
              <span className={`font-medium ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {state.language === 'en' ? 'Login Alerts' : 'ཞུགས་པའི་བརྡ་ལན'}
              </span>
              <p className={`text-sm ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {state.language === 'en' ? 'Get notified of new logins' : 'ཞུགས་པ་གསར་པའི་བརྡ་ལན་ཐོབ'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securitySettings.loginAlerts}
                onChange={(e) => setSecuritySettings({
                  ...securitySettings,
                  loginAlerts: e.target.checked
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {/* Session Timeout */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              state.theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {state.language === 'en' ? 'Session Timeout (minutes)' : 'ཐེངས་སྐབས་དུས་ཚོད (སྐར་མ)'}
            </label>
            <select
              value={securitySettings.sessionTimeout}
              onChange={(e) => setSecuritySettings({
                ...securitySettings,
                sessionTimeout: e.target.value
              })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                state.theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="15">15</option>
              <option value="30">30</option>
              <option value="60">60</option>
              <option value="120">120</option>
            </select>
          </div>

          {/* Password Change */}
          <div className={`p-4 rounded-lg border ${
            state.theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`font-medium ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {state.language === 'en' ? 'Password' : 'གསང་ཨང'}
              </span>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                {state.language === 'en' ? 'Change' : 'བཅོས'}
              </button>
            </div>
            <p className={`text-sm ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {state.language === 'en' ? 'Last changed:' : 'མཐའ་མའི་བཅོས་པ:'} {securitySettings.passwordLastChanged.toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`w-full max-w-4xl h-full max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden ${
            state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`p-6 border-b ${
            state.theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Settings className={`h-6 w-6 ${
                  state.theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                }`} />
                <h2 className={`text-xl font-bold ${
                  state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {state.language === 'en' ? 'Settings' : 'སྒྲིག་འཇུག'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  state.theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex h-full">
            {/* Sidebar */}
            <div className={`w-64 border-r ${
              state.theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
            }`}>
              <nav className="p-4 space-y-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? state.theme === 'dark'
                          ? 'bg-yellow-600 text-gray-900'
                          : 'bg-yellow-500 text-white'
                        : state.theme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'profile' && renderProfileTab()}
                  {activeTab === 'notifications' && renderNotificationsTab()}
                  {activeTab === 'display' && renderDisplayTab()}
                  {activeTab === 'security' && renderSecurityTab()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};