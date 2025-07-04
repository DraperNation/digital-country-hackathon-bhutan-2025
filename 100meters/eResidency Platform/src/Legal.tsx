import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  FileText, 
  Scale, 
  Lock,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Eye,
  UserCheck,
  Globe
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Layout } from '../common/Layout';

export const Legal: React.FC = () => {
  const { state, dispatch } = useApp();

  const goBack = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'welcome' });
  };

  const getText = (en: string, dz: string) => {
    return state.language === 'en' ? en : dz;
  };

  const legalSections = [
    {
      icon: FileText,
      title: getText('Privacy Policy', 'གསང་བའི་སྲིད་བྱུས'),
      description: getText('How we collect, use, and protect your personal information', 'ང་ཚོས་ཁྱེད་ཀྱི་སྒེར་གྱི་ཆ་འཕྲིན་ཇི་ལྟར་བསྡུ་ལེན་དང་སྤྱོད་པ། སྲུང་སྐྱོབ་བྱེད་ཚུལ'),
      lastUpdated: '2025-01-01',
      sections: [
        getText('Information Collection', 'ཆ་འཕྲིན་བསྡུ་ལེན'),
        getText('Data Usage', 'གཞི་གྲངས་སྤྱོད་ཐབས'),
        getText('Data Protection', 'གཞི་གྲངས་སྲུང་སྐྱོབ'),
        getText('Your Rights', 'ཁྱེད་ཀྱི་ཐོབ་ཐང'),
        getText('Contact Information', 'འབྲེལ་བ་ཆ་འཕྲིན')
      ]
    },
    {
      icon: Scale,
      title: getText('Terms of Service', 'ཞབས་ཏོག་གི་ཁྲིམས་གཞི'),
      description: getText('Legal terms and conditions for using our platform', 'ང་ཚོའི་མཉེན་ཆས་སྤྱོད་པའི་ཁྲིམས་གཞི་དང་ཆ་རྐྱེན'),
      lastUpdated: '2025-01-01',
      sections: [
        getText('Service Description', 'ཞབས་ཏོག་འགྲེལ་བཤད'),
        getText('User Obligations', 'སྤྱོད་མཁན་འགན་ཁུར'),
        getText('Intellectual Property', 'བློ་རིག་རྒྱུ་དངོས'),
        getText('Limitation of Liability', 'འགན་ཁུར་ཚད་འཛིན'),
        getText('Dispute Resolution', 'རྩོད་གླེང་སེལ་ཐབས')
      ]
    },
    {
      icon: Shield,
      title: getText('Compliance', 'མཐུན་སྒྲིག'),
      description: getText('Our regulatory compliance and certifications', 'ང་ཚོའི་སྒྲིག་གཞི་མཐུན་སྒྲིག་དང་ཚད་ལྡན'),
      lastUpdated: '2025-01-01',
      sections: [
        getText('Regulatory Framework', 'སྒྲིག་གཞི་གཞི་རྟེན'),
        getText('Data Protection Laws', 'གཞི་གྲངས་སྲུང་སྐྱོབ་ཁྲིམས'),
        getText('Financial Regulations', 'དངུལ་རྩིས་སྒྲིག་གཞི'),
        getText('International Standards', 'རྒྱལ་སྤྱིའི་ཚད་གཞི'),
        getText('Audit Reports', 'ཞིབ་བཤེར་སྙན་ཞུ')
      ]
    },
    {
      icon: Lock,
      title: getText('Security', 'བདེ་འཇགས'),
      description: getText('Our security measures and data protection protocols', 'ང་ཚོའི་བདེ་འཇགས་ཐབས་ལམ་དང་གཞི་གྲངས་སྲུང་སྐྱོབ་གྲོས་གཞི'),
      lastUpdated: '2025-01-01',
      sections: [
        getText('Security Infrastructure', 'བདེ་འཇགས་གཞི་རྟེན'),
        getText('Encryption Standards', 'གསང་སྦྱོར་ཚད་གཞི'),
        getText('Access Controls', 'ཞུགས་ཐང་ཚོད་འཛིན'),
        getText('Incident Response', 'གནས་ཚུལ་ལན་འདེབས'),
        getText('Security Audits', 'བདེ་འཇགས་ཞིབ་བཤེར')
      ]
    }
  ];

  const certifications = [
    {
      name: 'ISO 27001',
      description: getText('Information Security Management', 'ཆ་འཕྲིན་བདེ་འཇགས་སྐྱོང་སྲུང'),
      status: 'certified'
    },
    {
      name: 'GDPR',
      description: getText('General Data Protection Regulation', 'སྤྱིར་བཏང་གཞི་གྲངས་སྲུང་སྐྱོབ་སྒྲིག་གཞི'),
      status: 'compliant'
    },
    {
      name: 'SOC 2 Type II',
      description: getText('Service Organization Control', 'ཞབས་ཏོག་ཚོགས་པ་ཚོད་འཛིན'),
      status: 'certified'
    },
    {
      name: 'PCI DSS',
      description: getText('Payment Card Industry Data Security', 'སྤྲོད་ལེན་ཤོག་བུ་ཚོང་ལས་གཞི་གྲངས་བདེ་འཇགས'),
      status: 'compliant'
    }
  ];

  return (
    <Layout>
      <div className={`min-h-screen transition-colors duration-300 ${
        state.theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'
      }`}>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-yellow-600 via-orange-600 to-red-600">
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

              <div className="text-6xl mb-6">⚖️</div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {getText('Legal & Compliance', 'ཁྲིམས་ལུགས་དང་མཐུན་སྒྲིག')}
              </h1>
              <p className="text-xl text-yellow-100 max-w-3xl mx-auto leading-relaxed">
                {getText(
                  'Transparency, security, and compliance are at the core of everything we do. Learn about our legal framework and commitments.',
                  'གསལ་ཁ་དང་བདེ་འཇགས། མཐུན་སྒྲིག་བཅས་ང་ཚོས་བྱེད་པའི་ཆ་ཚང་གི་སྙིང་པོ་ཡིན། ང་ཚོའི་ཁྲིམས་གཞི་དང་ཁས་ལེན་སྐོར་ཤེས་རོགས།'
                )}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Legal Sections */}
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
                {getText('Legal Documentation', 'ཁྲིམས་ལུགས་ཡིག་ཆ')}
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${
                state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {getText(
                  'Comprehensive legal information to help you understand our policies and your rights.',
                  'ང་ཚོའི་སྲིད་བྱུས་དང་ཁྱེད་ཀྱི་ཐོབ་ཐང་ཤེས་རྟོགས་ལ་རོགས་པའི་ཁྲིམས་ལུགས་ཆ་འཕྲིན་ཡོངས་རྫོགས།'
                )}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {legalSections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all ${
                    state.theme === 'dark' 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-gradient-to-br from-yellow-50 to-orange-50'
                  }`}
                >
                  <div className="flex items-start space-x-4 mb-6">
                    <div className={`p-3 rounded-xl ${
                      state.theme === 'dark'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-yellow-500 text-white'
                    }`}>
                      <section.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold mb-2 ${
                        state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {section.title}
                      </h3>
                      <p className={`text-sm mb-2 ${
                        state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {section.description}
                      </p>
                      <p className={`text-xs ${
                        state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {getText('Last updated:', 'མཐའ་མའི་གསར་བཅོས:')} {section.lastUpdated}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {section.sections.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-success-600" />
                        <span className={`text-sm ${
                          state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>{getText('Read Full Document', 'ཡིག་ཆ་ཚང་མ་ཀློག')}</span>
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications */}
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
                {getText('Certifications & Compliance', 'ཚད་ལྡན་དང་མཐུན་སྒྲིག')}
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${
                state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {getText(
                  'We maintain the highest standards of security and compliance.',
                  'ང་ཚོས་བདེ་འཇགས་དང་མཐུན་སྒྲིག་གི་ཚད་གཞི་མཐོ་ཤོས་རྒྱུན་སྐྱོང་བྱེད།'
                )}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`p-6 rounded-2xl text-center ${
                    state.theme === 'dark' 
                      ? 'bg-gray-800' 
                      : 'bg-white shadow-lg'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                    cert.status === 'certified' 
                      ? 'bg-success-100 text-success-600' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {cert.status === 'certified' ? (
                      <CheckCircle className="h-8 w-8" />
                    ) : (
                      <Shield className="h-8 w-8" />
                    )}
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {cert.name}
                  </h3>
                  <p className={`text-sm mb-3 ${
                    state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {cert.description}
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    cert.status === 'certified'
                      ? 'bg-success-100 text-success-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {cert.status === 'certified' 
                      ? getText('Certified', 'ཚད་ལྡན') 
                      : getText('Compliant', 'མཐུན་སྒྲིག')
                    }
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Principles */}
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
                {getText('Our Principles', 'ང་ཚོའི་རྩ་འཛིན')}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Eye,
                  title: getText('Transparency', 'གསལ་ཁ'),
                  description: getText(
                    'We believe in complete transparency about our processes, policies, and data handling practices.',
                    'ང་ཚོས་ང་ཚོའི་བྱ་རིམ་དང་སྲིད་བྱུས། གཞི་གྲངས་སྤྱོད་ཐབས་སྐོར་གསལ་ཁ་ཡོངས་རྫོགས་ལ་ཡིད་ཆེས།'
                  )
                },
                {
                  icon: UserCheck,
                  title: getText('User Rights', 'སྤྱོད་མཁན་ཐོབ་ཐང'),
                  description: getText(
                    'Your rights are protected under international data protection laws and our strict privacy policies.',
                    'ཁྱེད་ཀྱི་ཐོབ་ཐང་རྒྱལ་སྤྱིའི་གཞི་གྲངས་སྲུང་སྐྱོབ་ཁྲིམས་དང་ང་ཚོའི་གསང་བའི་སྲིད་བྱུས་ཀྱིས་སྲུང་སྐྱོབ།'
                  )
                },
                {
                  icon: Globe,
                  title: getText('Global Standards', 'འཛམ་གླིང་ཚད་གཞི'),
                  description: getText(
                    'We adhere to the highest international standards for security, privacy, and regulatory compliance.',
                    'ང་ཚོས་བདེ་འཇགས་དང་གསང་བ། སྒྲིག་གཞི་མཐུན་སྒྲིག་གི་རྒྱལ་སྤྱིའི་ཚད་གཞི་མཐོ་ཤོས་ལ་བརྟེན།'
                  )
                }
              ].map((principle, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`text-center p-6 rounded-2xl ${
                    state.theme === 'dark' 
                      ? 'bg-gray-700' 
                      : 'bg-gradient-to-br from-yellow-50 to-orange-50'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                    state.theme === 'dark'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-yellow-500 text-white'
                  }`}>
                    <principle.icon className="h-8 w-8" />
                  </div>
                  <h3 className={`text-lg font-semibold mb-3 ${
                    state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {principle.title}
                  </h3>
                  <p className={`text-sm ${
                    state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {principle.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Legal */}
        <section className="py-24 bg-gradient-to-r from-yellow-600 to-orange-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                {getText('Legal Questions?', 'ཁྲིམས་ལུགས་དྲི་བ?')}
              </h2>
              <p className="text-xl text-yellow-100 max-w-3xl mx-auto mb-8">
                {getText(
                  'Our legal team is available to answer any questions about our policies, compliance, or your rights.',
                  'ང་ཚོའི་ཁྲིམས་ལུགས་སྡེ་ཚན་གིས་ང་ཚོའི་སྲིད་བྱུས་དང་མཐུན་སྒྲིག། ཁྱེད་ཀྱི་ཐོབ་ཐང་སྐོར་དྲི་བ་གང་རུང་ལ་ལན་འདེབས།'
                )}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => dispatch({ type: 'SET_CURRENT_STEP', payload: 'contact' })}
                className="px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors inline-flex items-center space-x-2"
              >
                <span>{getText('Contact Legal Team', 'ཁྲིམས་ལུགས་སྡེ་ཚན་དང་འབྲེལ་བ')}</span>
                <Scale className="h-5 w-5" />
              </motion.button>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
};