import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mountain, 
  Users, 
  Globe, 
  Award, 
  Heart, 
  Zap,
  Shield,
  Target,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Layout } from '../common/Layout';

export const About: React.FC = () => {
  const { state, dispatch } = useApp();

  const goBack = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'welcome' });
  };

  const getText = (en: string, dz: string) => {
    return state.language === 'en' ? en : dz;
  };

  const values = [
    {
      icon: Heart,
      title: getText('Gross National Happiness', 'རྒྱལ་ཡོངས་དགའ་སྐྱིད་ཆེན་པོ'),
      description: getText(
        'We prioritize holistic well-being over pure economic growth, ensuring our platform serves humanity.',
        'ང་ཚོས་དངུལ་རྩིས་འཕེལ་རྒྱས་ཙམ་ལས་མི་ཚེའི་བདེ་ཐང་ཡོངས་རྫོགས་ལ་གཙོ་བོར་བྱེད།'
      )
    },
    {
      icon: Shield,
      title: getText('Environmental Stewardship', 'ཁོར་ཡུག་སྲུང་སྐྱོབ'),
      description: getText(
        'As the world\'s only carbon-negative country, we ensure our digital platform maintains Bhutan\'s environmental values.',
        'འཛམ་གླིང་གི་ཁར་བོན་ཟུར་ཟ་ཡུལ་གྲུ་གཅིག་པུ་ཡིན་པས་ང་ཚོའི་ཌིཇི་ཊལ་མཉེན་ཆས་ཀྱིས་འབྲུག་གི་ཁོར་ཡུག་རིན་ཐང་རྒྱུན་སྐྱོང་བྱེད།'
      )
    },
    {
      icon: Users,
      title: getText('Cultural Preservation', 'རིག་གཞུང་སྲུང་སྐྱོབ'),
      description: getText(
        'We bridge ancient wisdom with modern technology, preserving Bhutanese culture while embracing innovation.',
        'ང་ཚོས་རྙིང་པའི་ཤེས་རབ་དང་དེང་དུས་ཀྱི་ལག་རྩལ་སྦྲེལ་ཏེ་འབྲུག་གི་རིག་གཞུང་སྲུང་སྐྱོབ་བྱེད།'
      )
    },
    {
      icon: Globe,
      title: getText('Global Connectivity', 'འཛམ་གླིང་འབྲེལ་མཐུད'),
      description: getText(
        'We connect Bhutan to the world while maintaining our unique identity and sovereignty.',
        'ང་ཚོས་འབྲུག་གི་ཁྱད་པར་ཅན་གྱི་ངོ་བོ་དང་རང་དབང་རྒྱུན་སྐྱོང་བྱེད་པའི་སྐབས་སུ་འཛམ་གླིང་དང་འབྲེལ་མཐུད་བྱེད།'
      )
    }
  ];

  const team = [
    {
      name: 'Tenzin Norbu',
      role: getText('Chief Technology Officer', 'ལག་རྩལ་འགོ་ཁྲིད'),
      avatar: '👨‍💻',
      bio: getText(
        'Former Silicon Valley engineer who returned to Bhutan to lead digital transformation.',
        'སི་ལི་ཀོན་གླིང་ཚོམ་གྱི་ལག་རྩལ་བ་རྗེས་སུ་འབྲུག་ལ་ལོག་ནས་ཌིཇི་ཊལ་བསྒྱུར་བཅོས་འགོ་ཁྲིད།'
      )
    },
    {
      name: 'Pema Choden',
      role: getText('Head of Compliance', 'མཐུན་སྒྲིག་འགོ་ཁྲིད'),
      avatar: '👩‍⚖️',
      bio: getText(
        'Legal expert specializing in international business law and regulatory frameworks.',
        'རྒྱལ་སྤྱིའི་ཚོང་ལས་ཁྲིམས་དང་སྒྲིག་གཞིའི་མཁས་པ།'
      )
    },
    {
      name: 'Karma Wangchuk',
      role: getText('Director of Innovation', 'གསར་བཟོའི་སྟེང་འཛིན'),
      avatar: '🚀',
      bio: getText(
        'Blockchain and AI specialist driving cutting-edge solutions for digital governance.',
        'ཌིཇི་ཊལ་གཞུང་སྐྱོང་གི་དོན་དུ་བློཀ་ཅེན་དང་AI གི་མཁས་པ།'
      )
    },
    {
      name: 'Sonam Yangchen',
      role: getText('Community Manager', 'སྤྱི་ཚོགས་འགོ་ཁྲིད'),
      avatar: '🌟',
      bio: getText(
        'Building bridges between global entrepreneurs and Bhutanese culture.',
        'འཛམ་གླིང་གི་ཚོང་པ་དང་འབྲུག་གི་རིག་གཞུང་བར་ཟམ་པ་བརྩིགས།'
      )
    }
  ];

  const milestones = [
    {
      year: '2023',
      title: getText('Royal Decree', 'རྒྱལ་པོའི་བཀའ་རྒྱ'),
      description: getText(
        'His Majesty the King announces the Digital Bhutan initiative',
        'རྒྱལ་པོ་མཆོག་གིས་ཌིཇི་ཊལ་འབྲུག་འཆར་གཞི་གསལ་བསྒྲགས'
      )
    },
    {
      year: '2024',
      title: getText('Platform Launch', 'མཉེན་ཆས་འགོ་བཙུགས'),
      description: getText(
        'Bhutan eResidency platform goes live with advanced AI features',
        'འབྲུག་ཨི་རེསིཌེནསི་མཉེན་ཆས་AI ཁྱད་ཆོས་དང་བཅས་འགོ་བཙུགས'
      )
    },
    {
      year: '2024',
      title: getText('Global Recognition', 'འཛམ་གླིང་ངོས་འཛིན'),
      description: getText(
        '10,000+ entrepreneurs from 127 countries join the platform',
        'རྒྱལ་ཁབ་༡༢༧ ནས་ཚོང་པ་༡༠,༠༠༠+ མཉེན་ཆས་ལ་ཞུགས'
      )
    },
    {
      year: '2025',
      title: getText('Future Vision', 'མ་འོངས་ལྟ་ཚུལ'),
      description: getText(
        'Expanding to become the world\'s leading digital jurisdiction',
        'འཛམ་གླིང་གི་ཌིཇི་ཊལ་ཁྲིམས་ཁོངས་གཙོ་བོར་འགྱུར་བའི་འཆར་གཞི'
      )
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

              <div className="text-6xl mb-6">🐉</div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {getText('About Bhutan eResidency', 'འབྲུག་ཨི་རེསིཌེནསི་སྐོར')}
              </h1>
              <p className="text-xl text-yellow-100 max-w-3xl mx-auto leading-relaxed">
                {getText(
                  'Pioneering the future of digital governance from the Last Shangri-La, where ancient wisdom meets cutting-edge technology.',
                  'མཐའ་མའི་ཞང་གྲི་ལ་ནས་ཌིཇི་ཊལ་གཞུང་སྐྱོང་གི་མ་འོངས་པ་འགོ་ཁྲིད་བྱེད་ས། རྙིང་པའི་ཤེས་རབ་དང་དེང་དུས་ལག་རྩལ་མཇལ་ས།'
                )}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
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
                {getText('Our Mission', 'ང་ཚོའི་དམིགས་ཡུལ')}
              </h2>
              <p className={`text-xl max-w-4xl mx-auto leading-relaxed ${
                state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {getText(
                  'To create the world\'s most advanced digital jurisdiction that empowers global entrepreneurs while preserving Bhutan\'s unique values of Gross National Happiness, environmental stewardship, and cultural heritage.',
                  'རྒྱལ་ཡོངས་དགའ་སྐྱིད་ཆེན་པོ་དང་ཁོར་ཡུག་སྲུང་སྐྱོབ། རིག་གཞུང་རྒྱུད་འཛིན་བཅས་འབྲུག་གི་ཁྱད་པར་ཅན་གྱི་རིན་ཐང་རྒྱུན་སྐྱོང་བྱེད་པའི་སྐབས་སུ་འཛམ་གླིང་གི་ཚོང་པ་ཚོར་ནུས་པ་སྤྲོད་པའི་འཛམ་གླིང་གི་ཌིཇི་ཊལ་ཁྲིམས་ཁོངས་མཐོ་ཤོས་གསར་འཛུགས་བྱེད་པ།'
                )}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`p-6 rounded-2xl transition-all duration-300 ${
                    state.theme === 'dark' 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-lg'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    state.theme === 'dark'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-yellow-500 text-white'
                  }`}>
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className={`text-lg font-semibold mb-3 ${
                    state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {value.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${
                    state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
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
                {getText('Our Journey', 'ང་ཚོའི་ལམ་ཡུལ')}
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${
                state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {getText(
                  'From royal vision to global reality - the evolution of Bhutan\'s digital transformation.',
                  'རྒྱལ་པོའི་ལྟ་ཚུལ་ནས་འཛམ་གླིང་གི་དངོས་པོར་འགྱུར་བ། འབྲུག་གི་ཌིཇི་ཊལ་བསྒྱུར་བཅོས་ཀྱི་འཕེལ་རིམ།'
                )}
              </p>
            </motion.div>

            <div className="relative">
              <div className={`absolute left-1/2 transform -translate-x-1/2 h-full w-1 ${
                state.theme === 'dark' ? 'bg-yellow-600' : 'bg-yellow-500'
              }`} />
              
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center mb-12 ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                    <div className={`p-6 rounded-2xl ${
                      state.theme === 'dark' 
                        ? 'bg-gray-800 border border-gray-700' 
                        : 'bg-white shadow-lg'
                    }`}>
                      <div className={`text-2xl font-bold mb-2 ${
                        state.theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                      }`}>
                        {milestone.year}
                      </div>
                      <h3 className={`text-lg font-semibold mb-2 ${
                        state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {milestone.title}
                      </h3>
                      <p className={`text-sm ${
                        state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full ${
                    state.theme === 'dark' ? 'bg-yellow-400' : 'bg-yellow-500'
                  } border-4 ${
                    state.theme === 'dark' ? 'border-gray-900' : 'border-white'
                  }`} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
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
                {getText('Our Team', 'ང་ཚོའི་སྡེ་ཚན')}
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${
                state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {getText(
                  'Meet the visionaries and experts driving Bhutan\'s digital transformation.',
                  'འབྲུག་གི་ཌིཇི་ཊལ་བསྒྱུར་བཅོས་འགོ་ཁྲིད་བྱེད་མཁན་གྱི་ལྟ་ཚུལ་ཅན་དང་མཁས་པ་ཚོ་མཇལ་རོགས།'
                )}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`text-center p-6 rounded-2xl transition-all duration-300 ${
                    state.theme === 'dark' 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-lg'
                  }`}
                >
                  <div className="text-6xl mb-4">{member.avatar}</div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {member.name}
                  </h3>
                  <p className={`text-sm font-medium mb-3 ${
                    state.theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                  }`}>
                    {member.role}
                  </p>
                  <p className={`text-sm leading-relaxed ${
                    state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {member.bio}
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
                {getText('Join Our Digital Revolution', 'ང་ཚོའི་ཌིཇི་ཊལ་གསར་བརྗེ་ལ་ཞུགས')}
              </h2>
              <p className="text-xl text-yellow-100 max-w-3xl mx-auto mb-8">
                {getText(
                  'Be part of the future of digital governance. Start your eResidency journey today.',
                  'ཌིཇི་ཊལ་གཞུང་སྐྱོང་གི་མ་འོངས་པའི་ཆ་ཤས་ཤིག་ཆགས། ད་རེས་ཁྱེད་ཀྱི་ཨི་རེསིཌེནསི་ལམ་ཡུལ་འགོ་བཙུགས།'
                )}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => dispatch({ type: 'SET_CURRENT_STEP', payload: 'register' })}
                className="px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors inline-flex items-center space-x-2"
              >
                <span>{getText('Start Your Application', 'ཞུ་ཡིག་འགོ་བཙུགས')}</span>
                <Target className="h-5 w-5" />
              </motion.button>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
};