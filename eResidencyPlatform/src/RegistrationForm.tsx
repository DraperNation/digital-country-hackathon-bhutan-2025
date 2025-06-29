import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Mail, User, Phone, MapPin, ArrowRight, ArrowLeft, Lock, Eye, EyeOff, CheckCircle, X } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { api } from '../../services/api';
import { LoadingSpinner } from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

export const RegistrationForm: React.FC = () => {
  const { state, dispatch } = useApp();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegistrationFormData>();
  
  const password = watch('password', '');
  const confirmPassword = watch('confirmPassword', '');

  const passwordRequirements: PasswordRequirement[] = [
    {
      label: 'At least 8 characters',
      test: (pwd) => pwd.length >= 8
    },
    {
      label: 'Contains uppercase letter',
      test: (pwd) => /[A-Z]/.test(pwd)
    },
    {
      label: 'Contains lowercase letter',
      test: (pwd) => /[a-z]/.test(pwd)
    },
    {
      label: 'Contains number',
      test: (pwd) => /\d/.test(pwd)
    },
    {
      label: 'Contains special character',
      test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    }
  ];

  const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
    const passedRequirements = passwordRequirements.filter(req => req.test(password)).length;
    
    if (passedRequirements === 0) return { score: 0, label: 'Very Weak', color: 'bg-red-500' };
    if (passedRequirements <= 2) return { score: 25, label: 'Weak', color: 'bg-red-400' };
    if (passedRequirements <= 3) return { score: 50, label: 'Fair', color: 'bg-yellow-400' };
    if (passedRequirements <= 4) return { score: 75, label: 'Good', color: 'bg-blue-400' };
    return { score: 100, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data: RegistrationFormData) => {
    // Validate password requirements
    const failedRequirements = passwordRequirements.filter(req => !req.test(data.password));
    if (failedRequirements.length > 0) {
      toast.error('Password does not meet security requirements');
      return;
    }

    // Validate password confirmation
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const user = await api.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        country: data.country,
        kycLevel: 'basic',
        eResidencyStatus: 'not_applied',
        companies: [],
      });

      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ type: 'SET_CURRENT_STEP', payload: 'kyc-basic' });
      toast.success('Registration successful! Welcome to Druk eResidency.');
      
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'welcome' });
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Creating your account..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
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
            
            <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
            <p className="text-primary-100">
              Start your journey to becoming a digital resident of Druk
            </p>
            
            {/* Progress bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Step 1 of 4</span>
                <span>25% Complete</span>
              </div>
              <div className="w-full bg-primary-700 rounded-full h-2">
                <div className="bg-accent-400 h-2 rounded-full w-1/4"></div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    {...register('firstName', { required: 'First name is required' })}
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Enter your first name"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-sm text-error-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    {...register('lastName', { required: 'Last name is required' })}
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Enter your last name"
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-sm text-error-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email address'
                    }
                  })}
                  type="email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email address"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('phone')}
                  type="tel"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country of Residence *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  {...register('country', { required: 'Country is required' })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors appearance-none bg-white"
                >
                  <option value="">Select your country</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="JP">Japan</option>
                  <option value="SG">Singapore</option>
                  <option value="IN">India</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              {errors.country && (
                <p className="mt-1 text-sm text-error-600">{errors.country.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('password', { 
                    required: 'Password is required',
                    validate: (value) => {
                      const failedRequirements = passwordRequirements.filter(req => !req.test(value));
                      return failedRequirements.length === 0 || 'Password does not meet security requirements';
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder="Create a secure password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Password Strength</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength.score >= 75 ? 'text-green-600' :
                      passwordStrength.score >= 50 ? 'text-blue-600' :
                      passwordStrength.score >= 25 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.score}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Password Requirements */}
              {password && (
                <div className="mt-3 space-y-1">
                  {passwordRequirements.map((requirement, index) => {
                    const isValid = requirement.test(password);
                    return (
                      <div key={index} className="flex items-center space-x-2">
                        {isValid ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-gray-300" />
                        )}
                        <span className={`text-xs ${
                          isValid ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {requirement.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {errors.password && (
                <p className="mt-1 text-sm text-error-600">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match'
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {/* Password Match Indicator */}
              {confirmPassword && (
                <div className="mt-2 flex items-center space-x-2">
                  {password === confirmPassword ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-green-600">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 text-red-500" />
                      <span className="text-xs text-red-600">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}

              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-error-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex items-start space-x-3">
              <input
                {...register('agreeToTerms', { required: 'You must agree to the terms' })}
                type="checkbox"
                className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <div className="text-sm">
                <label className="text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-700 underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-700 underline">
                    Privacy Policy
                  </a>
                  . I understand that my information will be processed in accordance with Druk's data protection laws.
                </label>
                {errors.agreeToTerms && (
                  <p className="mt-1 text-error-600">{errors.agreeToTerms.message}</p>
                )}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Continue to Verification</span>
              <ArrowRight className="h-5 w-5" />
            </motion.button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                className="text-primary-600 hover:text-primary-700 font-medium"
                onClick={() => dispatch({ type: 'SET_CURRENT_STEP', payload: 'login' })}
              >
                Sign in here
              </button>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};