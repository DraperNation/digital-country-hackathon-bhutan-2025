import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  MessageSquare, 
  Book, 
  Video,
  Search,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  Bot
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Layout } from '../common/Layout';

export const Support: React.FC = () => {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const goBack = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'welcome' });
  };

  const getText = (en: string, dz: string) => {
    return state.language === 'en' ? en : dz;
  };

  const supportChannels = [
    {
      icon: Bot,
      title: getText('AI Assistant', 'AI རོགས་རམ་པ'),
      description: getText('Get instant answers 24/7', '༢༤/༧ འཕྲལ་དུ་ལན་ཐོབ'),
      availability: getText('Always available', 'རྟག་ཏུ་ཐོབ་ཚུགས'),
      responseTime: getText('Instant', 'འཕྲལ་དུ'),
      action: () => {
        const chatButton = document.querySelector('[data-chat-button]');
        if (chatButton) {
          (chatButton as HTMLElement).click();
        }
      }
    },
    {
      icon: MessageSquare,
      title: getText('Live Chat', 'ཐད་ཀར་གླེང་མོལ'),
      description: getText('Chat with our support team', 'ང་ཚོའི་རམ་འདེགས་སྡེ་ཚན་དང་གླེང་མོལ'),
      availability: getText('Mon-Fri, 9AM-6PM BST', 'ཟླ་སྤེན། ཞོགས་པ་༩-ཕྱི་དྲོ་༦'),
      responseTime: getText('< 2 minutes', 'སྐར་མ་༢ ནང'),
      action: () => alert(getText('Live chat will be available soon!', 'ཐད་ཀར་གླེང་མོལ་མ་འོངས་པར་ཐོབ་ཚུགས!'))
    },
    {
      icon: Mail,
      title: getText('Email Support', 'གློག་འཕྲིན་རམ་འདེགས'),
      description: getText('Send us a detailed message', 'ང་ཚོ་ལ་ཞིབ་ཕྲའི་འཕྲིན་ཡིག་གཏོང'),
      availability: getText('24/7 monitoring', '༢༤/༧ ལྟ་རྟོག'),
      responseTime: getText('< 4 hours', 'ཆུ་ཚོད་༤ ནང'),
      action: () => dispatch({ type: 'SET_CURRENT_STEP', payload: 'contact' })
    },
    {
      icon: Phone,
      title: getText('Phone Support', 'ཁ་པར་རམ་འདེགས'),
      description: getText('Speak directly with an expert', 'མཁས་པ་དང་ཐད་ཀར་གླེང་མོལ'),
      availability: getText('Mon-Fri, 9AM-6PM BST', 'ཟླ་སྤེན། ཞོགས་པ་༩-ཕྱི་དྲོ་༦'),
      responseTime: getText('Immediate', 'འཕྲལ་དུ'),
      action: () => window.open('tel:+975-2-123-4567')
    }
  ];

  const faqCategories = [
    { id: 'all', name: getText('All Topics', 'བརྗོད་གཞི་ཚང་མ') },
    { id: 'getting-started', name: getText('Getting Started', 'འགོ་བཙུགས') },
    { id: 'business', name: getText('Business Formation', 'ཚོང་ལས་གསར་འཛུགས') },
    { id: 'compliance', name: getText('Compliance', 'མཐུན་སྒྲིག') },
    { id: 'technical', name: getText('Technical', 'ལག་རྩལ') }
  ];

  const faqs = [
    {
      id: '1',
      category: 'getting-started',
      question: getText('How do I start my eResidency application?', 'ཨི་རེསིཌེནསི་ཞུ་ཡིག་ཇི་ལྟར་འགོ་བཙུགས?'),
      answer: getText(
        'Starting your eResidency application is simple. Click "Start Your Journey" on our homepage, create an account, complete KYC verification, and submit your application. The entire process takes about 30 minutes.',
        'ཨི་རེསིཌེནསི་ཞུ་ཡིག་འགོ་བཙུགས་པ་འཇམ་པོ་ཡིན། ང་ཚོའི་ཁྱིམ་ཤོག་ལ་"ཁྱེད་ཀྱི་ལམ་ཡུལ་འགོ་བཙུགས"ལ་ཨེབ་ཏེ་རྩིས་ཁྲ་གསར་འཛུགས། KYC ར་སྤྲོད་ཚར་བ་དང་ཞུ་ཡིག་འབུལ། བྱ་རིམ་ཚང་མ་ལ་སྐར་མ་༣༠ ཙམ་འགོར།'
      )
    },
    {
      id: '2',
      category: 'business',
      question: getText('How long does company incorporation take?', 'ཚོང་ལས་གསར་འཛུགས་ལ་དུས་ཚོད་ག་ཚོད་འགོར?'),
      answer: getText(
        'Company incorporation in Bhutan takes just 15 minutes through our automated system. Once you submit all required information, your company is immediately registered and you receive your incorporation documents.',
        'འབྲུག་ནང་ཚོང་ལས་གསར་འཛུགས་བྱེད་པ་ལ་ང་ཚོའི་རང་འགུལ་རིམ་ལུགས་ཐོག་སྐར་མ་༡༥ ཙམ་ལས་མི་འགོར། དགོས་པའི་ཆ་འཕྲིན་ཚང་མ་འབུལ་རྗེས་ཚོང་ལས་འཕྲལ་དུ་ཐོ་འགོད་བྱས་ཏེ་གསར་འཛུགས་ཡིག་ཆ་ཐོབ།'
      )
    },
    {
      id: '3',
      category: 'compliance',
      question: getText('What are the ongoing compliance requirements?', 'རྒྱུན་སྐྱོང་མཐུན་སྒྲིག་དགོས་མཁོ་གང་ཡོད?'),
      answer: getText(
        'Ongoing compliance includes annual tax filings, quarterly reports for certain business types, and maintaining accurate company records. Our platform automatically tracks all deadlines and sends reminders.',
        'རྒྱུན་སྐྱོང་མཐུན་སྒྲིག་ལ་ལོ་རེའི་ཁྲལ་འབུལ། ཚོང་ལས་རིགས་ལ་དུས་གསུམ་སྙན་ཞུ། ཚོང་ལས་ཀྱི་ཡིག་ཆ་ཡང་དག་པར་རྒྱུན་སྐྱོང་བཅས་ཚུད། ང་ཚོའི་མཉེན་ཆས་ཀྱིས་དུས་ཚོད་ཚང་མ་རང་འགུལ་ལྟ་རྟོག་དང་དྲན་སྐུལ་གཏོང།'
      )
    },
    {
      id: '4',
      category: 'technical',
      question: getText('Is my data secure on the platform?', 'མཉེན་ཆས་ལ་ངའི་གཞི་གྲངས་བདེ་འཇགས་ཡོད་དམ?'),
      answer: getText(
        'Yes, we use bank-grade security with ISO 27001 certification, end-to-end encryption, and regular security audits. Your data is stored in secure data centers with 99.9% uptime guarantee.',
        'ཡོད། ང་ཚོས་དངུལ་ཁང་གི་བདེ་འཇགས་དང་ISO 27001 ཚད་ལྡན། མཐའ་ནས་མཐའ་བར་གསང་སྦྱོར། དུས་རྒྱུན་བདེ་འཇགས་ཞིབ་བཤེར་བཅས་སྤྱོད། ཁྱེད་ཀྱི་གཞི་གྲངས་བདེ་འཇགས་གཞི་གྲངས་ལྟེ་གནས་ནང་ཉར་ཚགས་བྱས་ཏེ་༩༩.༩% འཁྱུད་ཡོད་ཁས་ལེན་ཡོད།'
      )
    },
    {
      id: '5',
      category: 'getting-started',
      question: getText('What documents do I need for KYC?', 'KYC ལ་ཡིག་ཆ་གང་དགོས?'),
      answer: getText(
        'For KYC verification, you need: 1) Government-issued photo ID (passport or national ID), 2) A clear selfie holding your ID, and 3) Proof of address (utility bill or bank statement from last 3 months).',
        'KYC ར་སྤྲོད་ལ་དགོས་པ། ༡) གཞུང་གིས་སྤྲད་པའི་པར་དང་བཅས་ཐོབ་ཐང་ཡིག་ཆ། ༢) ཐོབ་ཐང་ཡིག་ཆ་འཛིན་པའི་གསལ་པོའི་པར། ༣) གནས་ཡུལ་སྒྲུབ་ཆ (ཟླ་༣ ནང་གི་གློག་ཁྲིད་ཁ་ཡིག་ཡང་ན་དངུལ་ཁང་སྙན་ཞུ)།'
      )
    },
    {
      id: '6',
      category: 'business',
      question: getText('Can I have multiple companies?', 'ང་ལ་ཚོང་ལས་མང་པོ་ཡོད་ཆོག་གམ?'),
      answer: getText(
        'Yes, eResidents can incorporate multiple companies under their digital residency. Each company is treated as a separate legal entity with its own registration and compliance requirements.',
        'ཆོག ཨི་རེསིཌེནཊ་ཚོས་ཁོ་ཚོའི་ཌིཇི་ཊལ་གནས་སྡོད་འོག་ཚོང་ལས་མང་པོ་གསར་འཛུགས་ཆོག ཚོང་ལས་རེ་རེ་ལ་རང་སོའི་ཐོ་འགོད་དང་མཐུན་སྒྲིག་དགོས་མཁོ་ཡོད་པའི་ཁྲིམས་ཁོངས་སོ་སོར་བལྟ།'
      )
    }
  ];

  const resources = [
    {
      icon: Book,
      title: getText('Documentation', 'ཡིག་ཆ'),
      description: getText('Comprehensive guides and API documentation', 'ཡོངས་རྫོགས་ལམ་སྟོན་དང་API ཡིག་ཆ'),
      items: [
        getText('Getting Started Guide', 'འགོ་བཙུགས་ལམ་སྟོན'),
        getText('API Reference', 'API གཞི་རྟེན'),
        getText('Integration Examples', 'སྦྲེལ་བ་དཔེ་མཚོན'),
        getText('Best Practices', 'ཐབས་ལམ་ལེགས་ཤོས')
      ]
    },
    {
      icon: Video,
      title: getText('Video Tutorials', 'བརྙན་ཟློས་སློབ་སྟོན'),
      description: getText('Step-by-step video guides', 'གོ་རིམ་བརྙན་ཟློས་ལམ་སྟོན'),
      items: [
        getText('Platform Overview', 'མཉེན་ཆས་སྤྱིར་བཏང'),
        getText('Company Formation', 'ཚོང་ལས་གསར་འཛུགས'),
        getText('Document Management', 'ཡིག་ཆ་སྐྱོང་སྲུང'),
        getText('Compliance Tracking', 'མཐུན་སྒྲིག་ལྟ་རྟོག')
      ]
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

              <div className="text-6xl mb-6">🆘</div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {getText('Help & Support', 'རོགས་རམ་དང་རམ་འདེགས')}
              </h1>
              <p className="text-xl text-yellow-100 max-w-3xl mx-auto leading-relaxed">
                {getText(
                  'Get the help you need to succeed with Bhutan eResidency. Our support team is here to assist you every step of the way.',
                  'འབྲུག་ཨི་རེསིཌེནསི་ཐོག་ལེགས་གྲུབ་ཐོབ་པར་དགོས་པའི་རོགས་རམ་ཐོབ། ང་ཚོའི་རམ་འདེགས་སྡེ་ཚན་གིས་གོ་རིམ་རེ་རེར་རོགས་རམ་བྱེད།'
                )}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Support Channels */}
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
                {getText('Get Support', 'རམ་འདེགས་ཐོབ')}
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${
                state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {getText(
                  'Choose the support channel that works best for you.',
                  'ཁྱེད་ལ་འཚམས་པའི་རམ་འདེགས་ཐབས་ལམ་འདེམས་རོགས།'
                )}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {supportChannels.map((channel, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  onClick={channel.action}
                  className={`p-6 rounded-2xl cursor-pointer transition-all hover:shadow-xl ${
                    state.theme === 'dark' 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-2xl'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    state.theme === 'dark'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-yellow-500 text-white'
                  }`}>
                    <channel.icon className="h-6 w-6" />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {channel.title}
                  </h3>
                  <p className={`text-sm mb-4 ${
                    state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {channel.description}
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className={state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                        {channel.availability}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-success-600" />
                      <span className={state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                        {getText('Response:', 'ལན:')} {channel.responseTime}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className={`py-24 ${
          state.theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'
        }`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                {getText('Frequently Asked Questions', 'ཡང་ཡང་དྲིས་པའི་དྲི་བ')}
              </h2>
            </motion.div>

            {/* Search and Filter */}
            <div className="mb-8 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={getText('Search FAQs...', 'དྲི་བ་འཚོལ་བ...')}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                    state.theme === 'dark' 
                      ? 'bg-gray-800 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {faqCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? state.theme === 'dark'
                          ? 'bg-yellow-600 text-gray-900'
                          : 'bg-yellow-500 text-white'
                        : state.theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`rounded-lg border ${
                    state.theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className={`font-medium ${
                      state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {faq.question}
                    </span>
                    {expandedFaq === faq.id ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  
                  {expandedFaq === faq.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-6 pb-6"
                    >
                      <p className={`${
                        state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {filteredFaqs.length === 0 && (
              <div className="text-center py-12">
                <HelpCircle className={`h-16 w-16 mx-auto mb-4 ${
                  state.theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                }`} />
                <h3 className={`text-lg font-semibold mb-2 ${
                  state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {getText('No FAQs found', 'དྲི་བ་མ་རྙེད')}
                </h3>
                <p className={`${
                  state.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {getText('Try adjusting your search or category filter', 'འཚོལ་ཞིབ་ཡང་ན་རིགས་གྲས་འདེམས་ཚན་བཅོས་སྒྲིག་བྱེད་རོགས')}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Resources */}
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
                {getText('Resources', 'ཐོབ་ལམ')}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {resources.map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`p-8 rounded-2xl ${
                    state.theme === 'dark' 
                      ? 'bg-gray-700' 
                      : 'bg-gradient-to-br from-yellow-50 to-orange-50'
                  }`}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`p-3 rounded-xl ${
                      state.theme === 'dark'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-yellow-500 text-white'
                    }`}>
                      <resource.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${
                        state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {resource.title}
                      </h3>
                      <p className={`text-sm ${
                        state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {resource.description}
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {resource.items.map((item, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-success-600" />
                        <span className={`text-sm ${
                          state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};