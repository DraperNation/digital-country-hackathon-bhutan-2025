import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Building2, 
  FileText, 
  Globe, 
  DollarSign, 
  Users, 
  Shield,
  CheckCircle,
  ArrowRight,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Upload,
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Business: React.FC = () => {
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    businessType: '',
    description: '',
    address: '',
    city: 'Thimphu',
    country: 'Bhutan',
    postalCode: '',
    phone: '',
    email: currentUser?.email || '',
    website: '',
    industry: '',
    employees: '',
    capitalAmount: '',
    documents: {
      businessPlan: null,
      financialProjections: null,
      additionalDocs: null
    }
  });

  const businessTypes = [
    { value: 'LLC', label: 'Limited Liability Company (LLC)', description: 'Most popular for small to medium businesses' },
    { value: 'Corporation', label: 'Corporation', description: 'Best for larger businesses and investment' },
    { value: 'Partnership', label: 'Partnership', description: 'For businesses with multiple owners' },
    { value: 'Sole Proprietorship', label: 'Sole Proprietorship', description: 'Simplest form for individual entrepreneurs' }
  ];

  const industries = [
    'Technology & Software',
    'E-commerce & Retail',
    'Consulting Services',
    'Digital Marketing',
    'Financial Services',
    'Healthcare & Wellness',
    'Education & Training',
    'Tourism & Hospitality',
    'Agriculture & Food',
    'Manufacturing',
    'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [fieldName]: file
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Business registration submitted successfully!');
      setCurrentStep(4); // Move to success step
    } catch (error) {
      toast.error('Failed to submit business registration');
    }
    
    setLoading(false);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[
        { number: 1, title: 'Company Info', icon: Building2 },
        { number: 2, title: 'Business Details', icon: FileText },
        { number: 3, title: 'Documents', icon: Upload }
      ].map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                step.number <= currentStep
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'bg-white/20 text-white/60'
              }`}
            >
              {step.number < currentStep ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <step.icon className="h-5 w-5" />
              )}
            </div>
            <span className={`mt-2 text-sm font-medium text-shadow ${
              step.number <= currentStep ? 'text-white' : 'text-white/60'
            }`}>
              {step.title}
            </span>
          </div>
          {index < 2 && (
            <div
              className={`w-16 h-1 mx-4 rounded-full transition-all duration-200 ${
                step.number < currentStep ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-white/20'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderCompanyInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-display font-semibold text-white mb-2 text-shadow">Company Information</h3>
        <p className="text-white/90 text-shadow">Tell us about your business</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2 text-shadow">
            Company Name *
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            className="form-input w-full px-4 py-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter your company name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2 text-shadow">
            Business Type *
          </label>
          <div className="space-y-3">
            {businessTypes.map((type) => (
              <label key={type.value} className="flex items-start p-4 glass-card rounded-lg border border-white/20 cursor-pointer hover:bg-white/10 transition-colors">
                <input
                  type="radio"
                  name="businessType"
                  value={type.value}
                  checked={formData.businessType === type.value}
                  onChange={handleInputChange}
                  className="mt-1 mr-3"
                />
                <div>
                  <div className="font-medium text-white text-shadow">{type.label}</div>
                  <div className="text-sm text-white/80 text-shadow">{type.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2 text-shadow">
            Business Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="form-input w-full px-4 py-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            placeholder="Describe your business activities and goals"
          />
        </div>
      </div>
    </div>
  );

  const renderBusinessDetails = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-display font-semibold text-white mb-2 text-shadow">Business Details</h3>
        <p className="text-white/90 text-shadow">Additional information about your business</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2 text-shadow">
            Industry *
          </label>
          <select
            name="industry"
            value={formData.industry}
            onChange={handleInputChange}
            className="form-input w-full px-4 py-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Select your industry</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2 text-shadow">
            Expected Employees
          </label>
          <select
            name="employees"
            value={formData.employees}
            onChange={handleInputChange}
            className="form-input w-full px-4 py-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Select range</option>
            <option value="1">Just me</option>
            <option value="2-5">2-5 employees</option>
            <option value="6-10">6-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="50+">50+ employees</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2 text-shadow">
            Initial Capital (USD)
          </label>
          <input
            type="number"
            name="capitalAmount"
            value={formData.capitalAmount}
            onChange={handleInputChange}
            className="form-input w-full px-4 py-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            placeholder="10000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2 text-shadow">
            Website (Optional)
          </label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            className="form-input w-full px-4 py-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            placeholder="https://yourwebsite.com"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-medium text-white text-shadow">Business Address</h4>
        
        <div>
          <label className="block text-sm font-medium text-white mb-2 text-shadow">
            Street Address *
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="form-input w-full px-4 py-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter business address"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2 text-shadow">
              City *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="form-input w-full px-4 py-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2 text-shadow">
              Country *
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="form-input w-full px-4 py-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2 text-shadow">
              Postal Code
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              className="form-input w-full px-4 py-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              placeholder="11001"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2 text-shadow">
              Business Phone *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="form-input w-full px-4 py-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              placeholder="+975 2 123456"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2 text-shadow">
              Business Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input w-full px-4 py-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              placeholder="business@company.com"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-display font-semibold text-white mb-2 text-shadow">Supporting Documents</h3>
        <p className="text-white/90 text-shadow">Upload required business documents</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white mb-3 text-shadow">
            Business Plan (Optional)
          </label>
          <div className="border-2 border-dashed border-white/30 rounded-lg p-6 bg-white/10 hover:bg-white/20 transition-colors">
            <div className="text-center">
              <Upload className="h-8 w-8 text-white/60 mx-auto mb-3" />
              <div className="mb-3">
                <label htmlFor="business-plan" className="cursor-pointer">
                  <span className="text-sm font-medium text-white block mb-1 text-shadow">
                    Upload Business Plan
                  </span>
                  <span className="text-xs text-white/80 block text-shadow">
                    PDF up to 10MB
                  </span>
                </label>
                <input
                  id="business-plan"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, 'businessPlan')}
                  className="hidden"
                />
              </div>
              {formData.documents.businessPlan && (
                <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {formData.documents.businessPlan.name}
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-3 text-shadow">
            Financial Projections (Optional)
          </label>
          <div className="border-2 border-dashed border-white/30 rounded-lg p-6 bg-white/10 hover:bg-white/20 transition-colors">
            <div className="text-center">
              <FileText className="h-8 w-8 text-white/60 mx-auto mb-3" />
              <div className="mb-3">
                <label htmlFor="financial-projections" className="cursor-pointer">
                  <span className="text-sm font-medium text-white block mb-1 text-shadow">
                    Upload Financial Projections
                  </span>
                  <span className="text-xs text-white/80 block text-shadow">
                    PDF, Excel up to 10MB
                  </span>
                </label>
                <input
                  id="financial-projections"
                  type="file"
                  accept=".pdf,.xlsx,.xls"
                  onChange={(e) => handleFileChange(e, 'financialProjections')}
                  className="hidden"
                />
              </div>
              {formData.documents.financialProjections && (
                <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {formData.documents.financialProjections.name}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-blue-50/90 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <Shield className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Document Requirements:</p>
              <ul className="space-y-1 list-disc list-inside text-xs">
                <li>All documents must be in English or include certified translation</li>
                <li>Financial projections should cover at least 2 years</li>
                <li>Business plan should include market analysis and strategy</li>
                <li>Documents will be reviewed within 5-7 business days</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="h-8 w-8 text-white" />
      </div>
      
      <h3 className="text-2xl font-display font-bold text-white mb-4 text-shadow">Registration Submitted!</h3>
      <p className="text-white/90 mb-6 text-shadow">
        Your business registration has been submitted successfully. You will receive updates via email.
      </p>
      
      <div className="glass-card p-6 rounded-lg border border-white/20 max-w-md mx-auto mb-6">
        <h4 className="font-semibold text-white mb-3 text-shadow">Next Steps:</h4>
        <div className="space-y-2 text-sm text-white/90 text-left">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-orange-400" />
            <span className="text-shadow">Review process: 5-7 business days</span>
          </div>
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-orange-400" />
            <span className="text-shadow">Email confirmation will be sent</span>
          </div>
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-orange-400" />
            <span className="text-shadow">Certificate generation upon approval</span>
          </div>
        </div>
      </div>
      
      <button
        onClick={() => window.location.href = '/dashboard'}
        className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors font-medium shadow-lg"
      >
        Return to Dashboard
      </button>
    </div>
  );

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-6 py-3 glass-card rounded-full text-white text-sm font-medium mb-8 border border-white/30">
            <Building2 className="h-4 w-4 mr-2 text-orange-400" />
            Business Formation
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-8 text-white text-shadow-strong">
            Register Your <span className="text-saffron">Business</span>
          </h1>
          
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed text-shadow">
            Establish your company in the Kingdom of Bhutan and access global opportunities 
            with favorable tax policies and business-friendly regulations.
          </p>
        </div>

        {/* Benefits Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6 rounded-xl border border-white/20 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-white mb-2 text-shadow">Tax Benefits</h3>
            <p className="text-white/90 text-sm text-shadow">Competitive corporate tax rates and incentives</p>
          </div>
          
          <div className="glass-card p-6 rounded-xl border border-white/20 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-white mb-2 text-shadow">Global Access</h3>
            <p className="text-white/90 text-sm text-shadow">Access to international markets and banking</p>
          </div>
          
          <div className="glass-card p-6 rounded-xl border border-white/20 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-white mb-2 text-shadow">Regulatory Support</h3>
            <p className="text-white/90 text-sm text-shadow">Streamlined compliance and government support</p>
          </div>
        </div>

        {/* Registration Form */}
        <div className="glass-form p-8 rounded-xl shadow-2xl border border-white/30">
          {currentStep < 4 && renderStepIndicator()}

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderCompanyInfo()}
            {currentStep === 2 && renderBusinessDetails()}
            {currentStep === 3 && renderDocuments()}
            {currentStep === 4 && renderSuccess()}

            {currentStep < 4 && (
              <div className="flex justify-between mt-8 pt-6 border-t border-white/20">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors font-medium"
                  >
                    Previous
                  </button>
                )}

                <div className="ml-auto">
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors font-medium shadow-lg"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-lg"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Submitting...
                        </div>
                      ) : (
                        'Submit Registration'
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};