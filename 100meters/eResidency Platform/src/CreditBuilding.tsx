import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, TrendingUp, DollarSign, Building2, ArrowLeft, CheckCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Layout } from '../common/Layout';

export const CreditBuilding: React.FC = () => {
  const { state, dispatch } = useApp();

  const goBack = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'welcome' });
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
              <button
                onClick={goBack}
                className="inline-flex items-center space-x-2 text-yellow-200 hover:text-white transition-colors mb-8"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </button>

              <div className="text-6xl mb-6">💳</div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Credit Building
              </h1>
              <p className="text-xl text-yellow-100 max-w-3xl mx-auto leading-relaxed">
                Build international business credit without physical presence
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
                  What Credit Building Does
                </h2>
                <p className={`text-lg leading-relaxed ${
                  state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Our system tracks your business behavior and creates comprehensive credit profiles that international banks trust. 
                  It monitors payment history, project completions, and revenue patterns to generate creditworthiness scores 
                  that help you access loans and financial products typically requiring extensive local history.
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
                  <CreditCard className="h-6 w-6 text-yellow-600 mr-2" />
                  Real-World Example
                </h3>
                <p className={`leading-relaxed ${
                  state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  James, a consultant from Australia, consistently paid platform fees on time and completed 30 projects with 
                  verified positive reviews. Our system generated a comprehensive credit report showing his reliable payment 
                  patterns and steady revenue growth. When he applied for a business loan in Singapore, the bank approved 
                  him within 48 hours based on his Bhutan eResidency credit profile, bypassing their usual 6-week process.
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
                      icon: TrendingUp,
                      title: 'Payment Tracking',
                      description: 'Monitors on-time payments and financial consistency'
                    },
                    {
                      icon: CheckCircle,
                      title: 'Project Verification',
                      description: 'Validates successful business transactions and outcomes'
                    },
                    {
                      icon: DollarSign,
                      title: 'Revenue Analysis',
                      description: 'Tracks income patterns and business growth trends'
                    },
                    {
                      icon: Building2,
                      title: 'Bank Integration',
                      description: 'Provides standardized reports to financial institutions'
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

              {/* CTA */}
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => dispatch({ type: 'SET_CURRENT_STEP', payload: 'register' })}
                  className="px-8 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-xl hover:from-yellow-700 hover:to-orange-700 transition-colors"
                >
                  Start Building Credit
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
};