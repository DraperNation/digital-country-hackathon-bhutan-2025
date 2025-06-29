import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  ArrowLeft,
  MessageSquare,
  Globe,
  Shield
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Layout } from '../common/Layout';

export const Contact: React.FC = () => {
  const { state, dispatch } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const goBack = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'welcome' });
  };

  const getText = (en: string, dz: string) => {
    return state.language === 'en' ? en : dz;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert(getText(
      'Thank you for your message! We will get back to you within 24 hours.',
      'ཁྱེད་ཀྱི་འཕྲིན་ཡིག་ལ་ཐུགས་རྗེ་ཆེ། ང་ཚོས་ཆུ་ཚོད་༢༤ ནང་ལན་འདེབས་ཡོང།'
    ));
    
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      category: 'general'
    });
    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactMethods = [
    {
      icon: Mail,
      title: getText('Email Support', 'གློག་འཕྲིན་རམ་འདེགས'),
      value: 'support@eresidency.bt',
      description: getText('24/7 email support', '༢༤/༧ གློག་འཕྲིན་རམ་འདེགས'),
      color: 'yellow'
    },
    {
      icon: Phone,
      title: getText('Phone Support', 'ཁ་པར་རམ་འདེགས'),
      value: '+975-2-123-4567',
      description: getText('Mon-Fri, 9AM-6PM BST', 'ཟླ་སྤེན། ཞོགས་པ་༩-ཕྱི་དྲོ་༦'),
      color: 'orange'
    },
    {
      icon: MapPin,
      title: getText('Office Address', 'ཡིག་ཚང་ཁ་བྱང'),
      value: getText('Thimphu Tech Park, Bhutan', 'ཐིམ་ཕུ་ལག་རྩལ་སྐྱེད་ཚལ། འབྲུག'),
      description: getText('Visit us in person', 'ང་ཚོ་ལ་ཐད་ཀར་འཚམས་འདྲི'),
      color: 'red'
    }
  ];

  const categories = [
    { value: 'general', label: getText('General Inquiry', 'སྤྱིར་བཏང་དྲི་བ') },
    { value: 'technical', label: getText('Technical Support', 'ལག་རྩལ་རམ་འདེགས') },
    { value: 'business', label: getText('Business Formation', 'ཚོང་ལས་གསར་འཛུགས') },
    { value: 'compliance', label: getText('Compliance & Legal', 'མཐུན་སྒྲིག་དང་ཁྲིམས') },
    { value: 'partnership', label: getText('Partnership', 'མཉམ་ལས') }
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

              <div className="text-6xl mb-6">📞</div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {getText('Contact Us', 'ང་ཚོ་དང་འབྲེལ་བ')}
              </h1>
              <p className="text-xl text-yellow-100 max-w-3xl mx-auto leading-relaxed">
                {getText(
                  'Get in touch with our team of experts. We\'re here to help you navigate your eResidency journey.',
                  'ང་ཚོའི་མཁས་པའི་སྡེ་ཚན་དང་འབྲེལ་བ་འདྲིས་རོགས། ང་ཚོ་ཁྱེད་ཀྱི་ཨི་རེསིཌེནསི་ལམ་ཡུལ་ལ་རོགས་རམ་བྱེད་ལ་འདུག'
                )}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Methods */}
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
                {getText('Get in Touch', 'འབྲེལ་བ་འདྲིས')}
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${
                state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {getText(
                  'Choose the best way to reach us. Our team is ready to assist you.',
                  'ང་ཚོ་དང་འབྲེལ་བ་འདྲིས་པའི་ཐབས་ལམ་གང་འཚམས་འདེམས་རོགས། ང་ཚོའི་སྡེ་ཚན་ཁྱེད་ལ་རོགས་རམ་བྱེད་ལ་གྲ་སྒྲིག་ཡོད།'
                )}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`text-center p-8 rounded-2xl transition-all duration-300 ${
                    state.theme === 'dark' 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-lg'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 ${
                    method.color === 'yellow' ? 'bg-yellow-500' :
                    method.color === 'orange' ? 'bg-orange-500' :
                    'bg-red-500'
                  } text-white`}>
                    <method.icon className="h-8 w-8" />
                  </div>
                  <h3 className={`text-xl font-semibold mb-3 ${
                    state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {method.title}
                  </h3>
                  <p className={`text-lg font-medium mb-2 ${
                    state.theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                  }`}>
                    {method.value}
                  </p>
                  <p className={`text-sm ${
                    state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {method.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className={`py-24 ${
          state.theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'
        }`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className={`rounded-3xl shadow-2xl overflow-hidden ${
                state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-8 text-white">
                <h2 className="text-3xl font-bold mb-2">
                  {getText('Send us a Message', 'ང་ཚོ་ལ་འཕྲིན་ཡིག་གཏོང')}
                </h2>
                <p className="text-yellow-100">
                  {getText(
                    'Fill out the form below and we\'ll get back to you as soon as possible.',
                    'འོག་གི་འབྲི་ཤོག་བཀང་རོགས། ང་ཚོས་མགྱོགས་ཤོས་ལན་འདེབས་ཡོང།'
                  )}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      state.theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      {getText('Full Name', 'མིང་ཚང་མ')} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors ${
                        state.theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder={getText('Enter your full name', 'ཁྱེད་ཀྱི་མིང་ཚང་མ་འབྲི')}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      state.theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      {getText('Email Address', 'གློག་འཕྲིན་ཁ་བྱང')} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors ${
                        state.theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder={getText('Enter your email', 'ཁྱེད་ཀྱི་གློག་འཕྲིན་འབྲི')}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    state.theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    {getText('Category', 'རིགས་གྲས')} *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors ${
                      state.theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    state.theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    {getText('Subject', 'བརྗོད་གཞི')} *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors ${
                      state.theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder={getText('Enter message subject', 'འཕྲིན་ཡིག་གི་བརྗོད་གཞི་འབྲི')}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    state.theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    {getText('Message', 'འཕྲིན་ཡིག')} *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors resize-none ${
                      state.theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder={getText('Enter your message...', 'ཁྱེད་ཀྱི་འཕྲིན་ཡིག་འབྲི...')}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      <span>{getText('Sending...', 'གཏོང་བཞིན...')}</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>{getText('Send Message', 'འཕྲིན་ཡིག་གཏོང')}</span>
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </section>

        {/* Additional Support */}
        <section className={`py-24 ${
          state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className={`text-center p-6 rounded-2xl ${
                  state.theme === 'dark' 
                    ? 'bg-gray-700' 
                    : 'bg-gradient-to-br from-yellow-50 to-orange-50'
                }`}
              >
                <MessageSquare className={`h-12 w-12 mx-auto mb-4 ${
                  state.theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                }`} />
                <h3 className={`text-lg font-semibold mb-2 ${
                  state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {getText('AI Assistant', 'AI རོགས་རམ་པ')}
                </h3>
                <p className={`text-sm ${
                  state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {getText(
                    'Get instant answers from our AI chatbot available 24/7',
                    'ང་ཚོའི་AI ཁ་པར་རོ་བོ་ནས་༢༤/༧ འཕྲལ་དུ་ལན་ཐོབ'
                  )}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className={`text-center p-6 rounded-2xl ${
                  state.theme === 'dark' 
                    ? 'bg-gray-700' 
                    : 'bg-gradient-to-br from-yellow-50 to-orange-50'
                }`}
              >
                <Globe className={`h-12 w-12 mx-auto mb-4 ${
                  state.theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                }`} />
                <h3 className={`text-lg font-semibold mb-2 ${
                  state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {getText('Global Support', 'འཛམ་གླིང་རམ་འདེགས')}
                </h3>
                <p className={`text-sm ${
                  state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {getText(
                    'Multilingual support team covering all time zones',
                    'དུས་ཚོད་ཁུལ་ཚང་མར་སྐད་རིགས་མང་པོའི་རམ་འདེགས་སྡེ་ཚན'
                  )}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className={`text-center p-6 rounded-2xl ${
                  state.theme === 'dark' 
                    ? 'bg-gray-700' 
                    : 'bg-gradient-to-br from-yellow-50 to-orange-50'
                }`}
              >
                <Shield className={`h-12 w-12 mx-auto mb-4 ${
                  state.theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                }`} />
                <h3 className={`text-lg font-semibold mb-2 ${
                  state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {getText('Secure Communication', 'བདེ་འཇགས་འབྲེལ་མཐུད')}
                </h3>
                <p className={`text-sm ${
                  state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {getText(
                    'All communications are encrypted and secure',
                    'འབྲེལ་མཐུད་ཚང་མ་གསང་སྦྱོར་དང་བདེ་འཇགས་ཡོད'
                  )}
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};