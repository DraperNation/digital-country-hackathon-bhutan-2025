import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Shield, Globe, ArrowLeft, X, Info, BookOpen } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export const Benefits: React.FC = () => {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = React.useState('tax');
  const [showCalculator, setShowCalculator] = React.useState(false);
  const [showDocumentation, setShowDocumentation] = React.useState(false);
  const [calculatorData, setCalculatorData] = React.useState({
    currentCountry: '',
    annualRevenue: '',
    currentTaxRate: '',
  });
  const [calculatedSavings, setCalculatedSavings] = React.useState<number | null>(null);

  const getText = (en: string, dz: string) => {
    return state.language === 'en' ? en : dz;
  };

  const tabs = [
    { 
      id: 'tax', 
      label: getText('Tax Benefits', 'ཁྲལ་གྱི་ཕན་ཐོགས'), 
      icon: Calculator 
    },
    { 
      id: 'business', 
      label: getText('Business Growth', 'ཚོང་ལས་འཕེལ་རྒྱས'), 
      icon: TrendingUp 
    },
    { 
      id: 'security', 
      label: getText('Security', 'བདེ་འཇགས'), 
      icon: Shield 
    },
    { 
      id: 'global', 
      label: getText('Global Access', 'འཛམ་གླིང་ཐོབ་ཐང'), 
      icon: Globe 
    },
  ];

  const tabContent = {
    tax: {
      title: getText('Optimize Your Global Tax Strategy', 'ཁྱེད་ཀྱི་འཛམ་གླིང་ཁྲལ་གྱི་ཐབས་ཇུས་ལེགས་བཅོས'),
      points: [
        getText('Corporate tax rate of 25% - competitive with major jurisdictions', 'ཚོང་ལས་ཁྲལ་ཚད་༢༥% - ཁྲིམས་ཁོངས་ཆེན་པོ་ཚོ་དང་རྩོད་ཤུགས་ཡོད'),
        getText('Extensive double taxation treaty network', 'ཁྲལ་ཐེངས་གཉིས་སྤྲོད་མི་དགོས་པའི་མཐུན་འགྲེལ་དྲ་བ་རྒྱ་ཆེ'),
        getText('No capital gains tax on qualifying investments', 'ཚད་ལྡན་རྒྱུ་སྦྱོར་ལ་རྩ་འབྲས་ཁྲལ་མེད'),
        getText('R&D tax incentives for innovation-focused businesses', 'གསར་བཟོ་ལ་གཙོ་བོར་བྱེད་པའི་ཚོང་ལས་ལ་ཞིབ་འཇུག་ཁྲལ་སྐྱོབ'),
        getText('Transparent and stable tax regime', 'གསལ་བ་དང་བརྟན་པོའི་ཁྲལ་གྱི་ལམ་ལུགས'),
      ],
      savings: '$15,000+',
      description: getText('Average annual tax savings for international businesses', 'རྒྱལ་སྤྱིའི་ཚོང་ལས་ཀྱི་ལོ་རེའི་ཆ་སྙོམས་ཁྲལ་ཉུང'),
    },
    business: {
      title: getText('Accelerate Your Business Growth', 'ཁྱེད་ཀྱི་ཚོང་ལས་འཕེལ་རྒྱས་མགྱོགས་པོ་བཟོ'),
      points: [
        getText('100% foreign ownership allowed in most sectors', 'ཁྱབ་ཁོངས་མང་པོར་ཕྱི་རྒྱལ་བདག་དབང་༡༠༠% ཆོག'),
        getText('Strategic location connecting South Asia and China', 'ལྷོ་ཨེ་ཤི་ཡ་དང་རྒྱ་ནག་འབྲེལ་མཐུད་ཀྱི་ཐབས་ཇུས་ས་གནས'),
        getText('English-speaking business environment', 'དབྱིན་ཇི་སྐད་སྤྱོད་ཚོང་ལས་ཁོར་ཡུག'),
        getText('Streamlined regulatory processes', 'སྒྲིག་གཞི་བྱ་རིམ་འཇམ་པོ'),
        getText('Access to regional markets and trade agreements', 'ས་ཁུལ་ཚོང་ཁྲོམ་དང་ཚོང་འབྲེལ་མཐུན་འགྲེལ་ཐོབ་ཐང'),
      ],
      savings: '75%',
      description: getText('Faster incorporation compared to traditional methods', 'སྔ་རྗེས་ཐབས་ལམ་ལས་མགྱོགས་པའི་ཚོང་ལས་གསར་འཛུགས'),
    },
    security: {
      title: getText('World-Class Security & Compliance', 'འཛམ་གླིང་གི་རིམ་པ་མཐོ་ཤོས་ཀྱི་བདེ་འཇགས་དང་མཐུན་སྒྲིག'),
      points: [
        getText('ISO 27001 certified security infrastructure', 'ISO 27001 ཚད་ལྡན་བདེ་འཇགས་གཞི་རྟེན'),
        getText('GDPR compliant data handling', 'GDPR དང་མཐུན་པའི་གཞི་གྲངས་སྤྱོད་ཐབས'),
        getText('Biometric authentication and encryption', 'ལུས་ཁམས་ངོས་འཛིན་དང་གསང་སྦྱོར'),
        getText('Regular security audits and penetration testing', 'དུས་རྒྱུན་བདེ་འཇགས་ཞིབ་བཤེར་དང་ཞུགས་ཚོད'),
        getText('Compliance with international AML/KYC standards', 'རྒྱལ་སྤྱིའི་AML/KYC ཚད་གཞི་དང་མཐུན'),
      ],
      savings: '99.9%',
      description: getText('Uptime guarantee for all critical services', 'གལ་ཆེའི་ཞབས་ཏོག་ཚང་མའི་འཁྱུད་ཡོད་ཁས་ལེན'),
    },
    global: {
      title: getText('Unlock Global Opportunities', 'འཛམ་གླིང་གི་གོ་སྐབས་ཕྱེ'),
      points: [
        getText('Visa-free or visa-on-arrival to 50+ countries', 'རྒྱལ་ཁབ་༥༠+ ལ་ཝི་ས་མེད་པའམ་སླེབས་སྐབས་ཝི་ས'),
        getText('Access to international banking services', 'རྒྱལ་སྤྱིའི་དངུལ་ཁང་ཞབས་ཏོག་ཐོབ་ཐང'),
        getText('Participation in global e-commerce platforms', 'འཛམ་གླིང་གི་གློག་ཚོང་ཚོང་ཁྲོམ་ནང་ཞུགས་པ'),
        getText('International business networking opportunities', 'རྒྱལ་སྤྱིའི་ཚོང་ལས་དྲ་བ་གོ་སྐབས'),
        getText('Cross-border payment and remittance facilities', 'རྒྱལ་མཚམས་བརྒལ་སྤྲོད་ལེན་དང་དངུལ་སྐྱེལ་ཁང་མིག'),
      ],
      savings: '190+',
      description: getText('Countries recognize Bhutan business entities', 'རྒྱལ་ཁབ་ཚོས་འབྲུག་གི་ཚོང་ལས་ངོས་འཛིན'),
    },
  };

  const calculateSavings = () => {
    const revenue = parseFloat(calculatorData.annualRevenue);
    const currentRate = parseFloat(calculatorData.currentTaxRate);
    
    if (revenue && currentRate) {
      const currentTax = revenue * (currentRate / 100);
      const bhutanTax = revenue * 0.25; // 25% Bhutan rate
      const savings = Math.max(0, currentTax - bhutanTax);
      setCalculatedSavings(savings);
    }
  };

  const openCalculator = () => {
    setShowCalculator(true);
  };

  const openDocumentation = () => {
    setShowDocumentation(true);
  };

  return (
    <section className={`py-24 transition-colors duration-300 ${
      state.theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 to-blue-50'
    }`} id="benefits">
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
            {getText('Measurable Benefits for Your Business', 'ཁྱེད་ཀྱི་ཚོང་ལས་ལ་ཚད་འཛིན་ཐུབ་པའི་ཕན་ཐོགས')}
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {getText(
              'Join thousands of entrepreneurs who have transformed their business operations with Bhutan eResidency.',
              'འབྲུག་གི་ཨི་རེསིཌེནསི་ཐོག་ནས་ཚོང་ལས་ཀྱི་བྱ་བ་བསྒྱུར་བཅོས་བྱས་པའི་ཚོང་པ་སྟོང་ཕྲག་མང་པོ་དང་མཉམ་དུ་ཞུགས་རོགས།'
            )}
          </p>
        </motion.div>

        <div className={`rounded-3xl shadow-2xl overflow-hidden ${
          state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          {/* Tab Navigation */}
          <div className={`border-b ${
            state.theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? state.theme === 'dark'
                        ? 'text-yellow-400 border-b-2 border-yellow-400 bg-gray-700'
                        : 'text-yellow-600 border-b-2 border-yellow-600 bg-yellow-50'
                      : state.theme === 'dark'
                        ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8 lg:p-12">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            >
              <div>
                <h3 className={`text-3xl font-bold mb-6 ${
                  state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {tabContent[activeTab as keyof typeof tabContent].title}
                </h3>
                
                <ul className="space-y-4">
                  {tabContent[activeTab as keyof typeof tabContent].points.map((point, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        state.theme === 'dark' ? 'bg-yellow-400' : 'bg-yellow-600'
                      }`} />
                      <span className={state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                        {point}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-6 ${
                    state.theme === 'dark' 
                      ? 'bg-gradient-to-br from-yellow-500 to-orange-500' 
                      : 'bg-gradient-to-br from-yellow-500 to-orange-500'
                  }`}>
                    <span className="text-4xl font-bold text-white">
                      {tabContent[activeTab as keyof typeof tabContent].savings}
                    </span>
                  </div>
                  <p className={`text-lg font-semibold mb-2 ${
                    state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {tabContent[activeTab as keyof typeof tabContent].description}
                  </p>
                  <p className={state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    {getText(
                      'Based on our analysis of 1000+ successful applications',
                      'ཆ་འཕྲིན་ལེགས་གྲུབ་༡༠༠༠+ ཀྱི་དཔྱད་པ་གཞིར་བཞག'
                    )}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-3xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              {getText('Ready to Transform Your Business?', 'ཁྱེད་ཀྱི་ཚོང་ལས་བསྒྱུར་བཅོས་བྱེད་ལ་གྲ་སྒྲིག་ཡིན་ནམ?')}
            </h3>
            <p className="text-yellow-100 mb-6 max-w-2xl mx-auto">
              {getText(
                'Join the digital revolution and position your business for global success with Bhutan eResidency.',
                'ཌིཇི་ཊལ་གསར་བརྗེ་ལ་ཞུགས་ཏེ་འབྲུག་གི་ཨི་རེསིཌེནསི་ཐོག་ནས་ཁྱེད་ཀྱི་ཚོང་ལས་འཛམ་གླིང་དུ་ལེགས་གྲུབ་ཐོབ་པར་གྲ་སྒྲིག་བྱེད།'
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={openCalculator}
                className="px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                {getText('Calculate Your Savings', 'ཁྱེད་ཀྱི་ཉུང་བ་རྩིས་རྐྱབ')}
              </button>
              <button 
                onClick={openDocumentation}
                className="px-8 py-4 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors flex items-center space-x-2"
              >
                <BookOpen className="h-5 w-5" />
                <span>{getText('View Documentation', 'ཡིག་ཆ་ལྟ')}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tax Savings Calculator Modal */}
        {showCalculator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCalculator(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto ${
                state.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">
                  {getText('Tax Savings Calculator', 'ཁྲལ་ཉུང་རྩིས་འཁོར')}
                </h3>
                <button
                  onClick={() => setShowCalculator(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    state.theme === 'dark' 
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    state.theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    {getText('Current Country', 'ད་ལྟའི་རྒྱལ་ཁབ')}
                  </label>
                  <select
                    value={calculatorData.currentCountry}
                    onChange={(e) => {
                      const country = e.target.value;
                      setCalculatorData({...calculatorData, currentCountry: country});
                      // Auto-fill tax rate based on country
                      const taxRates: {[key: string]: string} = {
                        'US': '21',
                        'UK': '19',
                        'DE': '30',
                        'FR': '28',
                        'JP': '23',
                        'SG': '17'
                      };
                      if (taxRates[country]) {
                        setCalculatorData(prev => ({...prev, currentCountry: country, currentTaxRate: taxRates[country]}));
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 ${
                      state.theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">{getText('Select country', 'རྒྱལ་ཁབ་འདེམས')}</option>
                    <option value="US">United States (21%)</option>
                    <option value="UK">United Kingdom (19%)</option>
                    <option value="DE">Germany (30%)</option>
                    <option value="FR">France (28%)</option>
                    <option value="JP">Japan (23%)</option>
                    <option value="SG">Singapore (17%)</option>
                  </select>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    state.theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    {getText('Annual Revenue (USD)', 'ལོ་རེའི་འབྱོར་འབབ (USD)')}
                  </label>
                  <input
                    type="number"
                    value={calculatorData.annualRevenue}
                    onChange={(e) => setCalculatorData({...calculatorData, annualRevenue: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 ${
                      state.theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="100000"
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    state.theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    {getText('Current Tax Rate (%)', 'ད་ལྟའི་ཁྲལ་ཚད (%)')}
                  </label>
                  <input
                    type="number"
                    value={calculatorData.currentTaxRate}
                    onChange={(e) => setCalculatorData({...calculatorData, currentTaxRate: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 ${
                      state.theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="21"
                  />
                </div>
                
                <button
                  onClick={calculateSavings}
                  className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-3 rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-colors font-semibold"
                >
                  {getText('Calculate Savings', 'ཉུང་བ་རྩིས་རྐྱབ')}
                </button>
                
                {calculatedSavings !== null && (
                  <div className={`mt-6 p-4 rounded-lg ${
                    state.theme === 'dark' 
                      ? 'bg-green-900/20 border border-green-700' 
                      : 'bg-green-50 border border-green-200'
                  }`}>
                    <h4 className={`font-semibold mb-2 ${
                      state.theme === 'dark' ? 'text-green-300' : 'text-green-800'
                    }`}>
                      {getText('Potential Annual Savings', 'ལོ་རེའི་ཉུང་ཐུབ་པའི་ཁྲལ')}
                    </h4>
                    <p className={`text-2xl font-bold ${
                      state.theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`}>
                      ${calculatedSavings.toLocaleString()}
                    </p>
                    <p className={`text-sm mt-2 ${
                      state.theme === 'dark' ? 'text-green-300' : 'text-green-700'
                    }`}>
                      {getText(
                        'By incorporating in Bhutan with a 25% corporate tax rate',
                        'འབྲུག་ནང་ཚོང་ལས་ཁྲལ་ཚད་༢༥% ཐོག་ཚོང་ལས་གསར་འཛུགས་བྱས་ན'
                      )}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Documentation Modal */}
        {showDocumentation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDocumentation(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto ${
                state.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">
                  {getText('Tax Savings Documentation', 'ཁྲལ་ཉུང་ཡིག་ཆ')}
                </h3>
                <button
                  onClick={() => setShowDocumentation(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    state.theme === 'dark' 
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                <section>
                  <h4 className={`text-xl font-semibold mb-3 ${
                    state.theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                  }`}>
                    {getText('Calculation Formula', 'རྩིས་ཐབས་སུ་རིས')}
                  </h4>
                  <div className={`p-4 rounded-lg font-mono text-sm ${
                    state.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <p>Current Tax = Annual Revenue × (Current Tax Rate ÷ 100)</p>
                    <p>Bhutan Tax = Annual Revenue × 0.25</p>
                    <p>Savings = Current Tax - Bhutan Tax</p>
                  </div>
                </section>

                <section>
                  <h4 className={`text-xl font-semibold mb-3 ${
                    state.theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                  }`}>
                    {getText('Step-by-Step Explanation', 'གོ་རིམ་གསལ་བཤད')}
                  </h4>
                  <ol className={`list-decimal list-inside space-y-2 ${
                    state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <li>{getText('Select your current country of incorporation', 'ད་ལྟའི་ཚོང་ལས་གསར་འཛུགས་རྒྱལ་ཁབ་འདེམས')}</li>
                    <li>{getText('Enter your annual revenue in USD', 'ལོ་རེའི་འབྱོར་འབབ་USD ནང་འབྲི')}</li>
                    <li>{getText('The system auto-fills the tax rate for your country', 'རིམ་ལུགས་ཀྱིས་ཁྱེད་ཀྱི་རྒྱལ་ཁབ་ཀྱི་ཁྲལ་ཚད་རང་འགུལ་བཀང')}</li>
                    <li>{getText('Click calculate to see potential savings', 'ཉུང་ཐུབ་པའི་ཁྲལ་མཐོང་བར་རྩིས་རྐྱབ་ལ་ཨེབ')}</li>
                  </ol>
                </section>

                <section>
                  <h4 className={`text-xl font-semibold mb-3 ${
                    state.theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                  }`}>
                    {getText('Example Calculations', 'དཔེ་རྩིས')}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`p-4 rounded-lg ${
                      state.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <h5 className="font-semibold mb-2">US Company Example</h5>
                      <p className="text-sm">Revenue: $500,000</p>
                      <p className="text-sm">US Tax (21%): $105,000</p>
                      <p className="text-sm">Bhutan Tax (25%): $125,000</p>
                      <p className="text-sm text-red-500">Savings: -$20,000 (Higher)</p>
                    </div>
                    <div className={`p-4 rounded-lg ${
                      state.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <h5 className="font-semibold mb-2">German Company Example</h5>
                      <p className="text-sm">Revenue: $500,000</p>
                      <p className="text-sm">German Tax (30%): $150,000</p>
                      <p className="text-sm">Bhutan Tax (25%): $125,000</p>
                      <p className="text-sm text-green-500">Savings: $25,000</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className={`text-xl font-semibold mb-3 ${
                    state.theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                  }`}>
                    {getText('Important Notes', 'གལ་ཆེའི་གསལ་བཤད')}
                  </h4>
                  <ul className={`list-disc list-inside space-y-2 ${
                    state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <li>{getText('Calculations are estimates for comparison purposes only', 'རྩིས་རྐྱབ་ནི་བསྡུར་བའི་དོན་དུ་ཚོད་དཔག་ཙམ')}</li>
                    <li>{getText('Actual tax obligations may vary based on specific circumstances', 'དངོས་ཡོད་ཁྲལ་འབབ་ནི་ཁྱད་གཞི་ལ་རག་ལས་ཏེ་མི་འདྲ་ཡོང་སྲིད')}</li>
                    <li>{getText('Consult with tax professionals for accurate advice', 'ཡང་དག་པའི་བསླབ་བྱ་དོན་དུ་ཁྲལ་གྱི་མཁས་པ་དང་བསླབ་བྱ')}</li>
                    <li>{getText('Double taxation treaties may provide additional benefits', 'ཁྲལ་ཐེངས་གཉིས་མཐུན་འགྲེལ་གྱིས་ཕན་ཐོགས་ཁ་སྐོང་སྤྲོད་སྲིད')}</li>
                  </ul>
                </section>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};