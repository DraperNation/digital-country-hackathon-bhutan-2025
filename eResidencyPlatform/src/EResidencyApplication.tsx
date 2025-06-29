import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Shield, Globe, Building2, CreditCard } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { LoadingSpinner } from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

export const EResidencyApplication: React.FC = () => {
  const { state, dispatch } = useApp();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState('standard');

  const plans = [
    {
      id: 'standard',
      name: 'Standard eResidency',
      price: 399,
      duration: 'Annual',
      features: [
        'Digital identity certificate',
        'Basic company formation',
        'Government services access',
        'Standard processing (5-7 days)',
        'Email support',
      ],
      popular: false,
    },
    {
      id: 'premium',
      name: 'Premium eResidency',
      price: 799,
      duration: 'Annual',
      features: [
        'Everything in Standard',
        'Fast-track processing (24 hours)',
        'Multiple company formations',
        'Tax optimization consultation',
        'Priority support',
        'Blockchain credentials',
      ],
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise eResidency',
      price: 1999,
      duration: 'Annual',
      features: [
        'Everything in Premium',
        'Dedicated account manager',
        'Custom legal structures',
        'Compliance monitoring',
        'API access',
        'White-label solutions',
      ],
      popular: false,
    },
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate application submission
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      if (state.user) {
        const updatedUser = { 
          ...state.user, 
          eResidencyStatus: 'pending' as const,
          digitalId: `BT${Date.now()}`,
        };
        dispatch({ type: 'SET_USER', payload: updatedUser });
      }
      
      dispatch({ type: 'SET_CURRENT_STEP', payload: 'business-formation' });
      toast.success('eResidency application submitted successfully!');
      
    } catch (error) {
      toast.error('Application submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'kyc-basic' });
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Submitting your eResidency application..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-8 text-white">
            <button
              onClick={goBack}
              className="flex items-center space-x-2 text-primary-200 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            
            <h1 className="text-3xl font-bold mb-2">Apply for eResidency</h1>
            <p className="text-primary-100">
              Choose your plan and become a digital resident of Bhutan
            </p>
            
            {/* Progress bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Step 3 of 4</span>
                <span>75% Complete</span>
              </div>
              <div className="w-full bg-primary-700 rounded-full h-2">
                <div className="bg-accent-400 h-2 rounded-full w-3/4"></div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Select Your eResidency Plan
              </h2>
              <p className="text-gray-600">
                Choose the plan that best fits your business needs and goals.
              </p>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * plans.indexOf(plan) }}
                  whileHover={{ y: -5 }}
                  className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedPlan === plan.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  } ${plan.popular ? 'ring-2 ring-accent-400' : ''}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <div className="text-3xl font-bold text-primary-600 mb-1">
                      ${plan.price}
                    </div>
                    <div className="text-gray-600 text-sm">
                      per {plan.duration}
                    </div>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className={`w-full py-2 px-4 rounded-lg text-center font-medium transition-colors ${
                    selectedPlan === plan.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                    {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Benefits Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6 mb-8">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 text-blue-600 mr-2" />
                What You Get with Bhutan eResidency
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start space-x-3">
                  <Globe className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Global Recognition</p>
                    <p className="text-sm text-gray-600">Recognized in 190+ countries worldwide</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Building2 className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Business Formation</p>
                    <p className="text-sm text-gray-600">Incorporate companies in 15 minutes</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CreditCard className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Tax Benefits</p>
                    <p className="text-sm text-gray-600">Access to double taxation treaties</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Summary */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <h3 className="font-bold text-gray-900 mb-4">Application Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Applicant</p>
                  <p className="font-medium text-gray-900">
                    {state.user?.firstName} {state.user?.lastName}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">Country</p>
                  <p className="font-medium text-gray-900">{state.user?.country}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">KYC Level</p>
                  <p className="font-medium text-gray-900 capitalize">{state.user?.kycLevel}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">Selected Plan</p>
                  <p className="font-medium text-gray-900">
                    {plans.find(p => p.id === selectedPlan)?.name}
                  </p>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Submit eResidency Application</span>
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};