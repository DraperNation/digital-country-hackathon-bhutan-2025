import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Clock, Globe, Zap } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export const Hero: React.FC = () => {
  const { state, dispatch } = useApp();

  const startApplication = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'register' });
  };

  const tryDemo = () => {
    dispatch({ type: 'TOGGLE_DEMO_MODE' });
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'demo-personas' });
  };

  const getText = (en: string, dz: string) => {
    return state.language === 'en' ? en : dz;
  };

  return (
    <section className={`relative overflow-hidden transition-colors duration-300 ${
      state.theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-yellow-600 via-orange-600 to-red-600'
    }`}>
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className={`absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl transform -translate-x-48 -translate-y-48 ${
          state.theme === 'dark' ? 'bg-yellow-500/10' : 'bg-yellow-500/20'
        }`} />
        <div className={`absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl transform translate-x-48 translate-y-48 ${
          state.theme === 'dark' ? 'bg-orange-500/10' : 'bg-orange-500/20'
        }`} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-2 mb-6">
              <div className={`px-3 py-1 text-sm font-medium rounded-full ${
                state.theme === 'dark' 
                  ? 'bg-yellow-600 text-gray-900' 
                  : 'bg-yellow-500 text-white'
              }`}>
                🌟 {getText('Now Live', 'ད་ལྟ་འཁྱུད་ཡོད')}
              </div>
              <span className={`text-sm ${
                state.theme === 'dark' ? 'text-gray-300' : 'text-yellow-100'
              }`}>
                {getText('Launched by Royal Government', 'རྒྱལ་གཞུང་གིས་འགོ་བཙུགས')}
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {getText('Become a', 'ཞུགས་པ་ཞིག་ཆགས')}{' '}
              <span className={`bg-gradient-to-r bg-clip-text text-transparent ${
                state.theme === 'dark' 
                  ? 'from-yellow-400 to-orange-400' 
                  : 'from-yellow-300 to-orange-300'
              }`}>
                {getText('Digital Resident', 'ཌིཇི་ཊལ་གནས་སྡོད་པ')}
              </span>{' '}
              {getText('of Druk', 'འབྲུག་གི')}
            </h1>

            <p className={`text-xl mb-8 leading-relaxed ${
              state.theme === 'dark' ? 'text-gray-300' : 'text-yellow-100'
            }`}>
              {getText(
                'Join the world\'s most innovative digital jurisdiction. Start a business in 15 minutes, access government services online, and unlock global opportunities from the Land of the Thunder Dragon.',
                'འཛམ་གླིང་གི་གསར་བཟོའི་ཌིཇི་ཊལ་ཁྲིམས་ཁོངས་ལ་ཞུགས་རོགས། སྐར་མ་༡༥་ནང་ཚོང་ལས་འགོ་བཙུགས་ཏེ་གཞུང་གི་ཞབས་ཏོག་ཐོབ་ནས་འབྲུག་ཡུལ་ནས་འཛམ་གླིང་གི་གོ་སྐབས་ཐོབ་རོགས།'
              )}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startApplication}
                className={`px-8 py-4 font-semibold rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-2xl ${
                  state.theme === 'dark' 
                    ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400' 
                    : 'bg-yellow-500 text-white hover:bg-yellow-600'
                }`}
              >
                <span>{getText('Start Your Journey', 'ཁྱེད་ཀྱི་ལམ་འགོ་བཙུགས')}</span>
                <ArrowRight className="h-5 w-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={tryDemo}
                className={`px-8 py-4 font-semibold rounded-xl transition-colors backdrop-blur-sm border ${
                  state.theme === 'dark' 
                    ? 'bg-white/10 text-white hover:bg-white/20 border-white/20' 
                    : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
                }`}
              >
                {getText('Try Interactive Demo', 'ཕན་ཚུན་འབྲེལ་བའི་དཔེ་སྟོན')}
              </motion.button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  icon: Clock, 
                  label: getText('15 Min Setup', 'སྐར་མ་༡༥ སྒྲིག་འཇུག'), 
                  value: getText('Average time', 'ཆ་སྙོམས་དུས་ཚོད') 
                },
                { 
                  icon: Shield, 
                  label: getText('99.9% Secure', '༩༩.༩% བདེ་འཇགས'), 
                  value: getText('Bank-grade security', 'དངུལ་ཁང་གི་བདེ་འཇགས') 
                },
                { 
                  icon: Globe, 
                  label: getText('190+ Countries', 'རྒྱལ་ཁབ་༡༩༠+'), 
                  value: getText('Supported globally', 'འཛམ་གླིང་ཡོངས་ལ་རམ་འདེགས') 
                },
                { 
                  icon: Zap, 
                  label: getText('24/7 Support', '༢༤/༧ རམ་འདེགས'), 
                  value: getText('Always available', 'རྟག་ཏུ་ཐོབ་ཚུགས') 
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-3 backdrop-blur-sm ${
                    state.theme === 'dark' ? 'bg-white/10' : 'bg-white/10'
                  }`}>
                    <stat.icon className={`h-6 w-6 ${
                      state.theme === 'dark' ? 'text-yellow-400' : 'text-yellow-300'
                    }`} />
                  </div>
                  <div className="text-white font-semibold text-sm">{stat.label}</div>
                  <div className={`text-xs ${
                    state.theme === 'dark' ? 'text-gray-400' : 'text-yellow-200'
                  }`}>{stat.value}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10">
              {/* Mock dashboard preview */}
              <div className={`rounded-2xl shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500 ${
                state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold ${
                      state.theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>
                      {getText('eResidency Dashboard', 'ཨི་རེསིཌེནསི་ཚོད་ལྟ་སྒེའུ་ཁུང')}
                    </h3>
                    <div className={`px-2 py-1 text-xs rounded-full ${
                      state.theme === 'dark' 
                        ? 'bg-green-900 text-green-300' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {getText('Active', 'ཤུགས་ལྡན')}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-3 rounded-lg ${
                      state.theme === 'dark' ? 'bg-yellow-900/20' : 'bg-yellow-50'
                    }`}>
                      <div className={`text-2xl font-bold ${
                        state.theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                      }`}>1</div>
                      <div className={`text-xs ${
                        state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {getText('Active Company', 'ཤུགས་ལྡན་ཚོང་ལས')}
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${
                      state.theme === 'dark' ? 'bg-orange-900/20' : 'bg-orange-50'
                    }`}>
                      <div className={`text-2xl font-bold flex items-center justify-center ${
                        state.theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
                      }`}>
                        <span className="text-lg">$15K</span>
                      </div>
                      <div className={`text-xs ${
                        state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {getText('Tax Savings', 'ཁྲལ་ཉུང')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className={state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        {getText('KYC Verification', 'KYC ར་སྤྲོད')}
                      </span>
                      <span className={`font-medium ${
                        state.theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      }`}>
                        ✓ {getText('Completed', 'ཚར་བ')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        {getText('Business Registration', 'ཚོང་ལས་ཐོ་འགོད')}
                      </span>
                      <span className={`font-medium ${
                        state.theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      }`}>
                        ✓ {getText('Completed', 'ཚར་བ')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        {getText('Tax Setup', 'ཁྲལ་སྒྲིག་འཇུག')}
                      </span>
                      <span className={`font-medium ${
                        state.theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                      }`}>
                        ⏳ {getText('In Progress', 'འགྲུབ་བཞིན')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity }}
              className={`absolute -top-4 -right-4 p-3 rounded-xl shadow-lg z-20 ${
                state.theme === 'dark' ? 'bg-yellow-600 text-gray-900' : 'bg-yellow-500 text-white'
              }`}
            >
              <div className="text-xs font-medium">
                {getText('Digital ID', 'ཌིཇི་ཊལ་ཐོབ་ཐང')}
              </div>
              <div className="text-lg font-bold">#DK2025</div>
            </motion.div>

            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 4, repeat: Infinity }}
              className={`absolute -bottom-6 -left-6 p-3 rounded-xl shadow-lg z-20 ${
                state.theme === 'dark' ? 'bg-orange-600 text-white' : 'bg-orange-500 text-white'
              }`}
            >
              <div className="text-xs font-medium">
                {getText('Tax Savings', 'ཁྲལ་ཉུང')}
              </div>
              <div className="text-lg font-bold">$15K+</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};