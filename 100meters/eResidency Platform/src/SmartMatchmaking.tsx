import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Clock, Globe, ArrowLeft, CheckCircle, Home, ChevronRight } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Layout } from '../common/Layout';

export const SmartMatchmaking: React.FC = () => {
  const { state, dispatch } = useApp();

  const goBack = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'welcome' });
  };

  const goToDashboard = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'dashboard' });
  };

  const goToOtherFeatures = (feature: string) => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: feature });
  };

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
              <div className="text-6xl mb-6">🎯</div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Smart Matchmaking
              </h1>
              <p className="text-xl text-yellow-100 max-w-3xl mx-auto leading-relaxed">
                Connect with the perfect business partners using AI-powered compatibility analysis
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className={`py-24 ${
          state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              {/* What It Does */}
              <div>
                <h2 className={`text-3xl font-bold mb-6 ${
                  state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  What Smart Matchmaking Does
                </h2>
                <p className={`text-lg leading-relaxed ${
                  state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Our AI analyzes your business profile, working patterns, and collaboration needs to find compatible partners. 
                  It considers time zones, complementary skills, and communication styles to suggest meaningful connections that 
                  can drive real business growth.
                </p>
              </div>

              {/* Real-World Example */}
              <div className={`p-8 rounded-2xl ${
                state.theme === 'dark' 
                  ? 'bg-gray-700 border border-gray-600' 
                  : 'bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200'
              }`}>
                <h3 className={`text-xl font-bold mb-4 flex items-center ${
                  state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  <Target className="h-6 w-6 text-yellow-600 mr-2" />
                  Real-World Example
                </h3>
                <p className={`leading-relaxed ${
                  state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Sarah, a web developer from Canada, works late nights and needs marketing support. The system matches her 
                  with Ahmed, a digital marketer in Dubai whose morning hours align perfectly with Sarah's evening schedule. 
                  Their complementary skills and overlapping work hours create an ideal partnership for serving global clients 
                  around the clock.
                </p>
              </div>

              {/* Key Features */}
              <div>
                <h3 className={`text-2xl font-bold mb-6 ${
                  state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  How It Works
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      icon: Users,
                      title: 'Skill Analysis',
                      description: 'Identifies complementary expertise and experience gaps'
                    },
                    {
                      icon: Clock,
                      title: 'Time Zone Optimization',
                      description: 'Finds partners with overlapping productive hours'
                    },
                    {
                      icon: Globe,
                      title: 'Cultural Compatibility',
                      description: 'Matches communication styles and business practices'
                    },
                    {
                      icon: CheckCircle,
                      title: 'Success Prediction',
                      description: 'Uses historical data to predict partnership success'
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className={`p-6 rounded-xl ${
                        state.theme === 'dark' 
                          ? 'bg-gray-700' 
                          : 'bg-gray-50'
                      }`}
                    >
                      <feature.icon className={`h-8 w-8 mb-4 ${
                        state.theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                      }`} />
                      <h4 className={`font-semibold mb-2 ${
                        state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {feature.title}
                      </h4>
                      <p className={`text-sm ${
                        state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Related Features */}
              <div className={`p-6 rounded-2xl ${
                state.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h3 className={`text-lg font-bold mb-4 ${
                  state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Explore Related Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => goToOtherFeatures('business-reputation')}
                    className={`p-4 rounded-lg text-left transition-colors ${
                      state.theme === 'dark'
                        ? 'bg-gray-600 hover:bg-gray-500 text-gray-200'
                        : 'bg-white hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <h4 className="font-semibold mb-2">Business Reputation</h4>
                    <p className="text-sm">Build trust with blockchain-verified credentials</p>
                  </button>
                  <button
                    onClick={() => goToOtherFeatures('predictive-compliance')}
                    className={`p-4 rounded-lg text-left transition-colors ${
                      state.theme === 'dark'
                        ? 'bg-gray-600 hover:bg-gray-500 text-gray-200'
                        : 'bg-white hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <h4 className="font-semibold mb-2">Predictive Compliance</h4>
                    <p className="text-sm">Stay ahead of regulatory changes</p>
                  </button>
                  <button
                    onClick={() => goToOtherFeatures('credit-building')}
                    className={`p-4 rounded-lg text-left transition-colors ${
                      state.theme === 'dark'
                        ? 'bg-gray-600 hover:bg-gray-500 text-gray-200'
                        : 'bg-white hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <h4 className="font-semibold mb-2">Credit Building</h4>
                    <p className="text-sm">Build international business credit</p>
                  </button>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center space-y-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => dispatch({ type: 'SET_CURRENT_STEP', payload: 'register' })}
                  className="px-8 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-xl hover:from-yellow-700 hover:to-orange-700 transition-colors"
                >
                  Start Finding Partners
                </motion.button>
                
                {state.user && (
                  <div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={goToDashboard}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        state.theme === 'dark'
                          ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Go to Dashboard
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
};