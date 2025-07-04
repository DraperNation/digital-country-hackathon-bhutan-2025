import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Building2, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Globe,
  ArrowRight,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface BankPartner {
  id: string;
  name: string;
  logo: string;
  country: string;
  features: string[];
  accountTypes: string[];
  processingTime: string;
  minimumDeposit: number;
  rating: number;
  specialOffers?: string;
}

export const BankingHub: React.FC = () => {
  const { state } = useApp();
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [applicationStep, setApplicationStep] = useState<'selection' | 'application' | 'processing'>('selection');

  const bankPartners: BankPartner[] = [
    {
      id: 'hsbc',
      name: 'HSBC International',
      logo: '🏦',
      country: 'Hong Kong',
      features: [
        'Multi-currency accounts (USD, EUR, GBP, SGD)',
        'Global online banking platform',
        'International wire transfers',
        'Business credit cards',
        'Trade finance solutions'
      ],
      accountTypes: ['Business Current', 'Business Savings', 'Multi-currency'],
      processingTime: '5-7 business days',
      minimumDeposit: 10000,
      rating: 4.8,
      specialOffers: '50% off international transfer fees for first 6 months'
    },
    {
      id: 'dbs',
      name: 'DBS Bank',
      logo: '🏛️',
      country: 'Singapore',
      features: [
        'Digital-first banking experience',
        'API integration for businesses',
        'Real-time payment notifications',
        'Automated bookkeeping integration',
        'SME lending solutions'
      ],
      accountTypes: ['Business Account', 'Corporate Account', 'Startup Account'],
      processingTime: '3-5 business days',
      minimumDeposit: 5000,
      rating: 4.9,
      specialOffers: 'Zero monthly fees for first year'
    },
    {
      id: 'standard_chartered',
      name: 'Standard Chartered',
      logo: '🏢',
      country: 'United Kingdom',
      features: [
        'Emerging markets expertise',
        'Trade finance and letters of credit',
        'Foreign exchange services',
        'Cash management solutions',
        'Investment banking services'
      ],
      accountTypes: ['Business Banking', 'Corporate Banking', 'Private Banking'],
      processingTime: '7-10 business days',
      minimumDeposit: 15000,
      rating: 4.7,
      specialOffers: 'Dedicated relationship manager for eResidents'
    },
    {
      id: 'revolut',
      name: 'Revolut Business',
      logo: '💳',
      country: 'Lithuania',
      features: [
        'Instant account opening',
        'Multi-currency wallets',
        'Expense management tools',
        'Corporate cards with spending controls',
        'Cryptocurrency support'
      ],
      accountTypes: ['Freelancer', 'Startup', 'SME', 'Corporate'],
      processingTime: '1-2 business days',
      minimumDeposit: 0,
      rating: 4.6,
      specialOffers: 'Premium plan free for 3 months'
    }
  ];

  const handleBankSelection = (bankId: string) => {
    setSelectedBank(bankId);
    setApplicationStep('application');
  };

  const handleApplicationSubmit = () => {
    setApplicationStep('processing');
    // Simulate processing
    setTimeout(() => {
      setApplicationStep('selection');
      setSelectedBank(null);
    }, 3000);
  };

  const selectedBankData = bankPartners.find(bank => bank.id === selectedBank);

  if (applicationStep === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-md"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Building2 className="h-8 w-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Processing Your Application
          </h2>
          <p className="text-gray-600 mb-6">
            We're submitting your application to {selectedBankData?.name}. 
            You'll receive an email confirmation shortly.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Expected processing time: {selectedBankData?.processingTime}</span>
          </div>
        </motion.div>
      </div>
    );
  }

  if (applicationStep === 'application' && selectedBankData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-8 text-white">
              <button
                onClick={() => setApplicationStep('selection')}
                className="flex items-center space-x-2 text-primary-200 hover:text-white transition-colors mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Bank Selection</span>
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{selectedBankData.logo}</div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Apply to {selectedBankData.name}
                  </h1>
                  <p className="text-primary-100">
                    Complete your business banking application
                  </p>
                </div>
              </div>
            </div>

            {/* Application Form */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Business Information */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Business Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        defaultValue={state.user?.companies[0]?.name || ''}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter company name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Type
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                        <option>Limited Liability Company (LLC)</option>
                        <option>Corporation</option>
                        <option>Partnership</option>
                        <option>Sole Proprietorship</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expected Monthly Turnover (USD)
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                        <option>$0 - $10,000</option>
                        <option>$10,000 - $50,000</option>
                        <option>$50,000 - $100,000</option>
                        <option>$100,000+</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Type
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                        {selectedBankData.accountTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue={`${state.user?.firstName} ${state.user?.lastName}`}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        defaultValue={state.user?.email || ''}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter email address"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        defaultValue={state.user?.phone || ''}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter phone number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country of Residence
                      </label>
                      <input
                        type="text"
                        defaultValue={state.user?.country || ''}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter country"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Offer */}
              {selectedBankData.specialOffers && (
                <div className="mt-8 bg-gradient-to-r from-accent-50 to-warning-50 border border-accent-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="h-5 w-5 text-accent-600" />
                    <span className="font-semibold text-accent-800">Special Offer for eResidents</span>
                  </div>
                  <p className="text-accent-700">{selectedBankData.specialOffers}</p>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleApplicationSubmit}
                className="w-full mt-8 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Submit Application</span>
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {state.language === 'en' ? 'Banking & Financial Services Hub' : 'དངུལ་ཁང་དང་དངུལ་རྩིས་ཞབས་ཏོག་ལྟེ་གནས'}
        </h1>
        <p className="text-gray-600">
          {state.language === 'en' 
            ? 'Open business bank accounts with our trusted international partners'
            : 'ང་ཚོའི་ཡིད་ཆེས་རུང་བའི་རྒྱལ་སྤྱིའི་མཉམ་ལས་པ་ཚོ་དང་ཚོང་ལས་དངུལ་ཁང་རྩིས་ཁྲ་ཕྱེ་རོགས'
          }
        </p>
      </div>

      {/* Benefits Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-primary-900">Fast Setup</h3>
              <p className="text-sm text-primary-700">3-7 days average</p>
            </div>
          </div>
          <p className="text-primary-800 text-sm">
            Streamlined application process with pre-verified eResident status
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-2xl p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-secondary-600 rounded-xl flex items-center justify-center">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-secondary-900">Global Access</h3>
              <p className="text-sm text-secondary-700">190+ countries</p>
            </div>
          </div>
          <p className="text-secondary-800 text-sm">
            Multi-currency accounts with worldwide banking access
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-accent-50 to-accent-100 rounded-2xl p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-accent-600 rounded-xl flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-accent-900">Secure & Compliant</h3>
              <p className="text-sm text-accent-700">Bank-grade security</p>
            </div>
          </div>
          <p className="text-accent-800 text-sm">
            Full regulatory compliance with international banking standards
          </p>
        </motion.div>
      </div>

      {/* Bank Partners */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {bankPartners.map((bank, index) => (
          <motion.div
            key={bank.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100"
          >
            <div className="p-6">
              {/* Bank Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{bank.logo}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{bank.name}</h3>
                    <p className="text-gray-600">{bank.country}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(bank.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">({bank.rating})</span>
                    </div>
                  </div>
                </div>
                {bank.specialOffers && (
                  <div className="px-3 py-1 bg-accent-100 text-accent-800 text-xs font-medium rounded-full">
                    Special Offer
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Key Features</h4>
                <ul className="space-y-2">
                  {bank.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-success-600 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Account Info */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Processing Time:</span>
                  <p className="text-gray-600">{bank.processingTime}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Min. Deposit:</span>
                  <p className="text-gray-600">
                    {bank.minimumDeposit === 0 ? 'No minimum' : `$${bank.minimumDeposit.toLocaleString()}`}
                  </p>
                </div>
              </div>

              {/* Special Offer */}
              {bank.specialOffers && (
                <div className="bg-gradient-to-r from-accent-50 to-warning-50 border border-accent-200 rounded-lg p-3 mb-6">
                  <div className="flex items-center space-x-2 mb-1">
                    <Star className="h-4 w-4 text-accent-600" />
                    <span className="font-medium text-accent-800 text-sm">eResident Exclusive</span>
                  </div>
                  <p className="text-accent-700 text-sm">{bank.specialOffers}</p>
                </div>
              )}

              {/* Apply Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBankSelection(bank.id)}
                className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Apply Now</span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional Services */}
      <div className="mt-12 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-6">Additional Financial Services</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <CreditCard className="h-8 w-8 mx-auto mb-3 text-primary-200" />
            <h3 className="font-semibold mb-2">Payment Processing</h3>
            <p className="text-primary-100 text-sm">
              Accept payments globally with integrated merchant services
            </p>
          </div>
          
          <div className="text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-3 text-primary-200" />
            <h3 className="font-semibold mb-2">Investment Services</h3>
            <p className="text-primary-100 text-sm">
              Access to investment platforms and wealth management
            </p>
          </div>
          
          <div className="text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-3 text-primary-200" />
            <h3 className="font-semibold mb-2">Currency Exchange</h3>
            <p className="text-primary-100 text-sm">
              Competitive FX rates for international transactions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};