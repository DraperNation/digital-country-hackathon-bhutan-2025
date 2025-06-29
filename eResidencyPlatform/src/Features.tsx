import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  FileText, 
  Wallet, 
  Users, 
  Calendar, 
  Smartphone,
  Award,
  BarChart3,
  MessageSquare,
  Clock,
  Target,
  Globe
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useTranslation } from '../../utils/translations';

export const Features: React.FC = () => {
  const { state, dispatch } = useApp();
  const { t } = useTranslation(state.language);

  const features = [
    {
      icon: FileText,
      title: t('Smart Document Vault'),
      description: t('Manage your documents with AI organization'),
      color: 'primary',
      action: () => dispatch({ type: 'SET_CURRENT_STEP', payload: 'dashboard' })
    },
    {
      icon: Wallet,
      title: t('Banking Hub'),
      description: t('Open accounts with partner banks'),
      color: 'secondary',
      action: () => dispatch({ type: 'SET_CURRENT_STEP', payload: 'dashboard' })
    },
    {
      icon: Users,
      title: t('Global Community'),
      description: t('Connect with fellow eResidents'),
      color: 'accent',
      action: () => dispatch({ type: 'SET_CURRENT_STEP', payload: 'dashboard' })
    },
    {
      icon: Calendar,
      title: t('Predictive Compliance'),
      description: t('Track deadlines and requirements'),
      color: 'success',
      action: () => dispatch({ type: 'SET_CURRENT_STEP', payload: 'dashboard' })
    },
    {
      icon: Award,
      title: t('Learning & Rewards'),
      description: t('Earn rewards while learning'),
      color: 'warning',
      action: () => dispatch({ type: 'SET_CURRENT_STEP', payload: 'dashboard' })
    },
    {
      icon: BarChart3,
      title: t('Enhanced Dashboard'),
      description: t('Comprehensive analytics with real-time metrics and centralized feature access'),
      color: 'error',
      action: () => dispatch({ type: 'SET_CURRENT_STEP', payload: 'dashboard' })
    }
  ];

  const colorClasses = {
    primary: state.theme === 'dark' ? 'text-yellow-400 bg-yellow-900/20' : 'text-yellow-600 bg-yellow-50',
    secondary: state.theme === 'dark' ? 'text-orange-400 bg-orange-900/20' : 'text-orange-600 bg-orange-50',
    accent: state.theme === 'dark' ? 'text-red-400 bg-red-900/20' : 'text-red-600 bg-red-50',
    success: state.theme === 'dark' ? 'text-green-400 bg-green-900/20' : 'text-green-600 bg-green-50',
    warning: state.theme === 'dark' ? 'text-yellow-400 bg-yellow-900/20' : 'text-yellow-600 bg-yellow-50',
    error: state.theme === 'dark' ? 'text-red-400 bg-red-900/20' : 'text-red-600 bg-red-50',
  };

  return (
    <section className={`py-24 transition-colors duration-300 ${
      state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`} id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl font-bold mb-4 ${
            state.theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {t('Advanced Features & Capabilities')}
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {t('Experience the future of digital governance with cutting-edge technology, world-class security, and unparalleled convenience. All features are fully implemented and production-ready.')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              onClick={feature.action}
              className={`p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border cursor-pointer group ${
                state.theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                  : 'bg-white border-gray-100 hover:border-yellow-200'
              }`}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${colorClasses[feature.color as keyof typeof colorClasses]}`}>
                <feature.icon className="h-7 w-7" />
              </div>
              
              <h3 className={`text-xl font-semibold mb-3 transition-colors ${
                state.theme === 'dark' 
                  ? 'text-white group-hover:text-yellow-400' 
                  : 'text-gray-900 group-hover:text-yellow-600'
              }`}>
                {feature.title}
              </h3>
              
              <p className={`leading-relaxed ${
                state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* AI Chatbot Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-3xl p-8 text-white">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-full mb-4">
                  <Bot className="h-5 w-5" />
                  <span className="font-medium">{t('AI-Powered Support')}</span>
                </div>
                <h2 className="text-3xl font-bold mb-4">
                  {t('Ask Our AI Assistant Anything')}
                </h2>
                <p className="text-yellow-100 max-w-2xl mx-auto">
                  {t('Get instant answers about eResidency, business formation, compliance requirements, and Bhutanese regulations. Available 24/7 in English and Dzongkha.')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { icon: MessageSquare, label: t('24/7 Support'), value: t('Always Available') },
                  { icon: Globe, label: t('Multilingual'), value: t('English & Dzongkha') },
                  { icon: Clock, label: t('Response Time'), value: t('<2 seconds') },
                  { icon: Target, label: t('Accuracy'), value: t('95%+ Success Rate') }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm"
                  >
                    <stat.icon className="h-6 w-6 text-yellow-300 mx-auto mb-2" />
                    <div className="font-semibold text-sm">{stat.label}</div>
                    <div className="text-yellow-200 text-xs">{stat.value}</div>
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const chatButton = document.querySelector('[data-chat-button]');
                    if (chatButton) {
                      (chatButton as HTMLElement).click();
                    }
                  }}
                  className="px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors inline-flex items-center space-x-2"
                >
                  <Bot className="h-5 w-5" />
                  <span>{t('Start Chatting with AI Assistant')}</span>
                </motion.button>
                <p className="text-yellow-200 text-sm mt-3">
                  {t('Try asking: "How do I start my eResidency application?" or "What are the tax benefits?"')}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};