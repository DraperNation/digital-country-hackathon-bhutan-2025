import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  FileText, 
  DollarSign, 
  Globe,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Users,
  Zap,
  Award
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Layout } from '../common/Layout';

export const Services: React.FC = () => {
  const { state, dispatch } = useApp();

  const goBack = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'welcome' });
  };

  const getText = (en: string, dz: string) => {
    return state.language === 'en' ? en : dz;
  };

  const services = [
    {
      icon: Building2,
      title: getText('Digital Residency', 'ཌིཇི་ཊལ་གནས་སྡོད'),
      description: getText(
        'Become a digital resident of Bhutan with full legal recognition and access to government services.',
        'འབྲུག་གི་ཌིཇི་ཊལ་གནས་སྡོད་པ་ཆགས་ཏེ་ཁྲིམས་མཐུན་ངོས་འཛིན་དང་གཞུང་གི་ཞབས་ཏོག་ཐོབ།'
      ),
      features: [
        getText('Legal digital identity', 'ཁྲིམས་མཐུན་ཌིཇི་ཊལ་ངོ་བོ'),
        getText('Government services access', 'གཞུང་གི་ཞབས་ཏོག་ཐོབ་ཐང'),
        getText('International recognition', 'རྒྱལ་སྤྱིའི་ངོས་འཛིན'),
        getText('Blockchain-secured credentials', 'བློཀ་ཅེན་བདེ་འཇགས་ཡིག་ཆ')
      ],
      price: getText('From $399/year', '$༣༩༩/ལོ་ནས'),
      processingTime: getText('24-48 hours', 'ཆུ་ཚོད་༢༤-༤༨')
    },
    {
      icon: FileText,
      title: getText('Business Formation', 'ཚོང་ལས་གསར་འཛུགས'),
      description: getText(
        'Incorporate your company in Bhutan with streamlined processes and full legal compliance.',
        'འབྲུག་ནང་ཁྱེད་ཀྱི་ཚོང་ལས་གསར་འཛུགས་བྱེད་པ་དང་ཁྲིམས་མཐུན་སྒྲིག་འཇུག'
      ),
      features: [
        getText('15-minute incorporation', 'སྐར་མ་༡༥ གསར་འཛུགས'),
        getText('Multiple entity types', 'ཚོང་ལས་རིགས་མང་པོ'),
        getText('Virtual office included', 'བར་སྣང་ཡིག་ཚང་ཚུད'),
        getText('Tax registration', 'ཁྲལ་ཐོ་འགོད')
      ],
      price: getText('From $199', '$༡༩༩ ནས'),
      processingTime: getText('15 minutes', 'སྐར་མ་༡༥')
    },
    {
      icon: DollarSign,
      title: getText('Tax Services', 'ཁྲལ་གྱི་ཞབས་ཏོག'),
      description: getText(
        'Optimize your tax structure with expert guidance and automated compliance monitoring.',
        'མཁས་པའི་ལམ་སྟོན་དང་རང་འགུལ་མཐུན་སྒྲིག་ལྟ་རྟོག་ཐོག་ཁྲལ་གྱི་བཀོད་པ་ལེགས་བཅོས།'
      ),
      features: [
        getText('25% corporate tax rate', 'ཚོང་ལས་ཁྲལ་ཚད་༢༥%'),
        getText('Double taxation treaties', 'ཁྲལ་ཐེངས་གཉིས་མཐུན་འགྲེལ'),
        getText('Automated filing', 'རང་འགུལ་འབུལ་ཞུ'),
        getText('Expert consultation', 'མཁས་པའི་བསླབ་བྱ')
      ],
      price: getText('From $99/month', '$༩༩/ཟླ་ནས'),
      processingTime: getText('Same day', 'ཉིན་གཅིག')
    },
    {
      icon: Globe,
      title: getText('Government Services', 'གཞུང་གི་ཞབས་ཏོག'),
      description: getText(
        'Access a full range of government services digitally with streamlined processes.',
        'ཌིཇི་ཊལ་ཐོག་ནས་གཞུང་གི་ཞབས་ཏོག་ཚང་མ་ཐོབ་པ་དང་བྱ་རིམ་འཇམ་པོ།'
      ),
      features: [
        getText('License applications', 'ཆོག་མཆན་ཞུ་ཡིག'),
        getText('Permit processing', 'གནང་བ་བྱེད་སྒོ'),
        getText('Document verification', 'ཡིག་ཆ་ར་སྤྲོད'),
        getText('Digital signatures', 'ཌིཇི་ཊལ་མཚན་རྟགས')
      ],
      price: getText('Pay per service', 'ཞབས་ཏོག་རེར་སྤྲོད'),
      processingTime: getText('1-5 business days', 'ལས་ཉིན་༡-༥')
    }
  ];

  const additionalServices = [
    {
      icon: Shield,
      title: getText('Compliance Monitoring', 'མཐུན་སྒྲིག་ལྟ་རྟོག'),
      description: getText('Automated compliance tracking and deadline management', 'རང་འགུལ་མཐུན་སྒྲིག་ལྟ་རྟོག་དང་དུས་ཚོད་སྐྱོང་སྲུང')
    },
    {
      icon: Users,
      title: getText('Community Access', 'སྤྱི་ཚོགས་ཐོབ་ཐང'),
      description: getText('Connect with 2,847+ global entrepreneurs', 'འཛམ་གླིང་གི་ཚོང་པ་༢,༨༤༧+ དང་འབྲེལ་མཐུད')
    },
    {
      icon: Award,
      title: getText('Learning Rewards', 'སློབ་སྦྱོང་རྒྱུགས་སྐྱེད'),
      description: getText('Earn up to 5% discount through educational modules', 'སློབ་སྦྱོང་ཐོག་ཕབ་ཆ་༥% ཚུན་ཐོབ')
    }
  ];

  return (
    <Layout>
      <div className={`min-h-screen transition-colors duration-300 ${
        state.theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'
      }`}>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-yellow-600 via-orange-600 to-red-600">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl transform -translate-x-48 -translate-y-48" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl transform translate-x-48 translate-y-48" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white"
            >
              <button
                onClick={goBack}
                className="inline-flex items-center space-x-2 text-yellow-200 hover:text-white transition-colors mb-8"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{getText('Back to Home', 'ཁྱིམ་ལ་ལོག')}</span>
              </button>

              <div className="text-6xl mb-6">🏢</div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {getText('Our Services', 'ང་ཚོའི་ཞབས་ཏོག')}
              </h1>
              <p className="text-xl text-yellow-100 max-w-3xl mx-auto leading-relaxed">
                {getText(
                  'Comprehensive digital services designed to empower global entrepreneurs and businesses in the digital age.',
                  'ཌིཇི་ཊལ་དུས་རབས་ནང་འཛམ་གླིང་གི་ཚོང་པ་དང་ཚོང་ལས་ལ་ནུས་པ་སྤྲོད་པའི་ཌིཇི་ཊལ་ཞབས་ཏོག་ཡོངས་རྫོགས།'
                )}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Services */}
        <section className={`py-24 ${
          state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className={`text-4xl font-bold mb-6 ${
                state.theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {getText('Core Services', 'གཙོ་བོའི་ཞབས་ཏོག')}
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${
                state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {getText(
                  'Everything you need to establish and grow your digital presence in Bhutan.',
                  'འབྲུག་ནང་ཁྱེད་ཀྱི་ཌིཇི་ཊལ་གནས་ཚད་གསར་འཛུགས་དང་འཕེལ་རྒྱས་ལ་དགོས་པའི་ཆ་ཚང།'
                )}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all ${
                    state.theme === 'dark' 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-2xl'
                  }`}
                >
                  <div className="flex items-start space-x-4 mb-6">
                    <div className={`p-3 rounded-xl ${
                      state.theme === 'dark'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-yellow-500 text-white'
                    }`}>
                      <service.icon className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold mb-2 ${
                        state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {service.title}
                      </h3>
                      <p className={`text-sm ${
                        state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-success-600" />
                        <span className={`text-sm ${
                          state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className={`text-2xl font-bold ${
                        state.theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                      }`}>
                        {service.price}
                      </div>
                      <div className={`text-sm ${
                        state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {getText('Processing:', 'བྱེད་སྒོ:')} {service.processingTime}
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => dispatch({ type: 'SET_CURRENT_STEP', payload: 'register' })}
                    className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>{getText('Get Started', 'འགོ་བཙུགས')}</span>
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Services */}
        <section className={`py-24 ${
          state.theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className={`text-4xl font-bold mb-6 ${
                state.theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {getText('Additional Benefits', 'ཁ་སྐོང་ཕན་ཐོགས')}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {additionalServices.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`text-center p-6 rounded-2xl ${
                    state.theme === 'dark' 
                      ? 'bg-gray-800' 
                      : 'bg-white shadow-lg'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                    state.theme === 'dark'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-yellow-500 text-white'
                  }`}>
                    <service.icon className="h-8 w-8" />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {service.title}
                  </h3>
                  <p className={`text-sm ${
                    state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {service.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-yellow-600 to-orange-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                {getText('Ready to Get Started?', 'འགོ་བཙུགས་ལ་གྲ་སྒྲིག་ཡིན་ནམ?')}
              </h2>
              <p className="text-xl text-yellow-100 max-w-3xl mx-auto mb-8">
                {getText(
                  'Join thousands of entrepreneurs who have transformed their business with Bhutan eResidency.',
                  'འབྲུག་ཨི་རེསིཌེནསི་ཐོག་ཚོང་ལས་བསྒྱུར་བཅོས་བྱས་པའི་ཚོང་པ་སྟོང་ཕྲག་མང་པོ་དང་མཉམ་དུ་ཞུགས།'
                )}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => dispatch({ type: 'SET_CURRENT_STEP', payload: 'register' })}
                className="px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors inline-flex items-center space-x-2"
              >
                <span>{getText('Start Your Application', 'ཞུ་ཡིག་འགོ་བཙུགས')}</span>
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
};