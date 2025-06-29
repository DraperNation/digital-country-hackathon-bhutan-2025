import React from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Briefcase, Clock, TrendingUp } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface Persona {
  id: string;
  name: string;
  country: string;
  avatar: string;
  role: string;
  goal: string;
  riskScore: number;
  processingTime: string;
  status: 'pending' | 'processing' | 'approved' | 'review';
  progress: number;
}

export const DemoPersonas: React.FC = () => {
  const { dispatch } = useApp();
  
  const personas: Persona[] = [
    {
      id: 'emma',
      name: 'Emma Chen',
      country: 'Singapore',
      avatar: '👩‍💼',
      role: 'AI Startup Founder',
      goal: 'Establish AI startup with fast-track processing',
      riskScore: 15,
      processingTime: '24 hours',
      status: 'approved',
      progress: 100,
    },
    {
      id: 'carlos',
      name: 'Carlos Rodriguez',
      country: 'Mexico',
      avatar: '👨‍💻',
      role: 'Digital Nomad Developer',
      goal: 'Freelance business with tax optimization',
      riskScore: 25,
      processingTime: '3-5 days',
      status: 'processing',
      progress: 75,
    },
    {
      id: 'amara',
      name: 'Amara Okafor',
      country: 'Nigeria',
      avatar: '👩‍🚀',
      role: 'Fintech Entrepreneur',
      goal: 'Fintech startup with enhanced due diligence',
      riskScore: 45,
      processingTime: '7-10 days',
      status: 'review',
      progress: 60,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-success-600 bg-success-50';
      case 'processing': return 'text-warning-600 bg-warning-50';
      case 'review': return 'text-error-600 bg-error-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk < 20) return 'text-success-600';
    if (risk < 40) return 'text-warning-600';
    return 'text-error-600';
  };

  const simulatePersona = (persona: Persona) => {
    // Set demo mode and simulate the persona's journey
    dispatch({ type: 'TOGGLE_DEMO_MODE' });
    dispatch({ type: 'SET_USER', payload: {
      id: `demo_${persona.id}`,
      firstName: persona.name.split(' ')[0],
      lastName: persona.name.split(' ')[1],
      email: `${persona.id}@example.com`,
      country: persona.country,
      kycLevel: 'enhanced',
      eResidencyStatus: persona.status === 'approved' ? 'active' : 'pending',
      companies: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }});
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'dashboard' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Demo Personas
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the Bhutan eResidency platform through different user journeys. 
            Each persona represents a unique use case and risk profile.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {personas.map((persona, index) => (
            <motion.div
              key={persona.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
              onClick={() => simulatePersona(persona)}
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{persona.avatar}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {persona.name}
                </h3>
                <div className="flex items-center justify-center space-x-2 text-gray-600 mb-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{persona.country}</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <Briefcase className="h-4 w-4" />
                  <span className="text-sm">{persona.role}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Goal</p>
                  <p className="text-sm text-gray-600">{persona.goal}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Risk Score</p>
                    <p className={`text-lg font-bold ${getRiskColor(persona.riskScore)}`}>
                      {persona.riskScore}/100
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">Processing</p>
                    <p className="text-sm text-gray-600">{persona.processingTime}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(persona.status)}`}>
                      {persona.status}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${persona.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{persona.progress}% complete</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-colors"
              >
                Simulate Journey
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Demo Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Demo Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <User className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Multi-Persona Testing</h3>
              <p className="text-sm text-gray-600">
                Experience different user journeys with varying risk profiles and requirements
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-secondary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Real-time Processing</h3>
              <p className="text-sm text-gray-600">
                See live updates as applications move through different stages
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-accent-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Performance Metrics</h3>
              <p className="text-sm text-gray-600">
                Track completion times, success rates, and system performance
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};