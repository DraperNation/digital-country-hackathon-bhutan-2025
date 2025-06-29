import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { ArrowLeft, ArrowRight, Building2, Users, DollarSign, Sparkles } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { api } from '../../services/api';
import { LoadingSpinner } from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

interface BusinessFormData {
  companyName: string;
  companyType: 'llc' | 'corporation' | 'non_profit';
  businessActivity: string;
  authorizedCapital: number;
  shareholderName: string;
  shareholderEmail: string;
  sharePercentage: number;
  directorName: string;
  directorEmail: string;
}

export const BusinessFormation: React.FC = () => {
  const { state, dispatch } = useApp();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [nameAvailable, setNameAvailable] = React.useState<boolean | null>(null);
  const [nameSuggestions, setNameSuggestions] = React.useState<string[]>([]);
  const [isCheckingName, setIsCheckingName] = React.useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<BusinessFormData>();
  
  const companyName = watch('companyName');

  const checkNameAvailability = async (name: string) => {
    if (!name || name.length < 3) return;
    
    setIsCheckingName(true);
    try {
      const result = await api.checkNameAvailability(name);
      setNameAvailable(result.available);
      if (!result.available && result.alternatives) {
        setNameSuggestions(result.alternatives);
      }
    } catch (error) {
      console.error('Name check failed:', error);
    } finally {
      setIsCheckingName(false);
    }
  };

  const generateNames = async () => {
    const businessActivity = watch('businessActivity');
    if (!businessActivity) {
      toast.error('Please enter your business activity first');
      return;
    }
    
    try {
      const suggestions = await api.generateBusinessName(businessActivity, [businessActivity]);
      setNameSuggestions(suggestions);
    } catch (error) {
      toast.error('Failed to generate name suggestions');
    }
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (companyName) {
        checkNameAvailability(companyName);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [companyName]);

  const onSubmit = async (data: BusinessFormData) => {
    if (nameAvailable === false) {
      toast.error('Please choose an available company name');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const company = await api.incorporateCompany(state.user?.id || '', data);
      
      if (state.user) {
        const updatedUser = { 
          ...state.user, 
          companies: [...state.user.companies, company]
        };
        dispatch({ type: 'SET_USER', payload: updatedUser });
      }
      
      dispatch({ type: 'SET_CURRENT_STEP', payload: 'dashboard' });
      toast.success('Company incorporated successfully!');
      
    } catch (error) {
      toast.error('Company incorporation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'eresidency-application' });
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Incorporating your company..." />
      </div>
    );
  }

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
              onClick={goBack}
              className="flex items-center space-x-2 text-primary-200 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            
            <h1 className="text-3xl font-bold mb-2">Incorporate Your Company</h1>
            <p className="text-primary-100">
              Set up your business in Bhutan in just 15 minutes
            </p>
            
            {/* Progress bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Step 4 of 4</span>
                <span>100% Complete</span>
              </div>
              <div className="w-full bg-primary-700 rounded-full h-2">
                <div className="bg-accent-400 h-2 rounded-full w-full"></div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
            {/* Company Details */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Building2 className="h-6 w-6 text-primary-600 mr-2" />
                Company Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <div className="relative">
                    <input
                      {...register('companyName', { required: 'Company name is required' })}
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                        nameAvailable === true ? 'border-success-500' : 
                        nameAvailable === false ? 'border-error-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your company name"
                    />
                    {isCheckingName && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <LoadingSpinner size="sm" />
                      </div>
                    )}
                  </div>
                  
                  {nameAvailable === true && (
                    <p className="mt-1 text-sm text-success-600">✅ Name is available!</p>
                  )}
                  {nameAvailable === false && (
                    <p className="mt-1 text-sm text-error-600">❌ Name is not available</p>
                  )}
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-error-600">{errors.companyName.message}</p>
                  )}
                  
                  <button
                    type="button"
                    onClick={generateNames}
                    className="mt-2 flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Generate AI Suggestions</span>
                  </button>
                </div>

                {nameSuggestions.length > 0 && (
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-700 mb-2">Suggested Names:</p>
                    <div className="flex flex-wrap gap-2">
                      {nameSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setValue('companyName', suggestion)}
                          className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm hover:bg-primary-100 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Type *
                  </label>
                  <select
                    {...register('companyType', { required: 'Company type is required' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select company type</option>
                    <option value="llc">Limited Liability Company (LLC)</option>
                    <option value="corporation">Corporation</option>
                    <option value="non_profit">Non-Profit Organization</option>
                  </select>
                  {errors.companyType && (
                    <p className="mt-1 text-sm text-error-600">{errors.companyType.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Authorized Capital (USD) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register('authorizedCapital', { 
                        required: 'Authorized capital is required',
                        min: { value: 1000, message: 'Minimum capital is $1,000' }
                      })}
                      type="number"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                      placeholder="10000"
                    />
                  </div>
                  {errors.authorizedCapital && (
                    <p className="mt-1 text-sm text-error-600">{errors.authorizedCapital.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Activity *
                  </label>
                  <textarea
                    {...register('businessActivity', { required: 'Business activity is required' })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Describe your main business activities..."
                  />
                  {errors.businessActivity && (
                    <p className="mt-1 text-sm text-error-600">{errors.businessActivity.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Shareholder Information */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Users className="h-6 w-6 text-primary-600 mr-2" />
                Shareholder & Director Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shareholder Name *
                  </label>
                  <input
                    {...register('shareholderName', { required: 'Shareholder name is required' })}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Enter shareholder name"
                  />
                  {errors.shareholderName && (
                    <p className="mt-1 text-sm text-error-600">{errors.shareholderName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shareholder Email *
                  </label>
                  <input
                    {...register('shareholderEmail', { 
                      required: 'Shareholder email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Please enter a valid email address'
                      }
                    })}
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Enter shareholder email"
                  />
                  {errors.shareholderEmail && (
                    <p className="mt-1 text-sm text-error-600">{errors.shareholderEmail.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Share Percentage *
                  </label>
                  <input
                    {...register('sharePercentage', { 
                      required: 'Share percentage is required',
                      min: { value: 1, message: 'Minimum 1%' },
                      max: { value: 100, message: 'Maximum 100%' }
                    })}
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="100"
                  />
                  {errors.sharePercentage && (
                    <p className="mt-1 text-sm text-error-600">{errors.sharePercentage.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Director Name *
                  </label>
                  <input
                    {...register('directorName', { required: 'Director name is required' })}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Enter director name"
                  />
                  {errors.directorName && (
                    <p className="mt-1 text-sm text-error-600">{errors.directorName.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Director Email *
                  </label>
                  <input
                    {...register('directorEmail', { 
                      required: 'Director email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Please enter a valid email address'
                      }
                    })}
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Enter director email"
                  />
                  {errors.directorEmail && (
                    <p className="mt-1 text-sm text-error-600">{errors.directorEmail.message}</p>
                  )}
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={nameAvailable === false}
              className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Incorporate Company</span>
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};