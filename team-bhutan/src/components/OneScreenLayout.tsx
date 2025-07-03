import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Building2, 
  Mountain, 
  Shield, 
  FileText, 
  CreditCard, 
  Users,
  X,
  ArrowRight,
  Globe,
  Award,
  Heart,
  Leaf,
  Camera,
  Upload,
  CheckCircle,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';

type ModalType = 'kyc' | 'identity' | 'business' | 'certificates' | 'login' | 'register' | null;

export const OneScreenLayout: React.FC = () => {
  const { currentUser, login, signup, logout } = useAuth();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [kycStep, setKycStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [kycForm, setKycForm] = useState({
    fullName: '',
    nationality: '',
    passportNumber: '',
    dateOfBirth: '',
    address: '',
    city: '',
    country: '',
    documents: { passport: null, address: null }
  });

  const closeModal = () => {
    setActiveModal(null);
    setKycStep(1);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      toast.success('Welcome back to the Dragon Kingdom!');
      closeModal();
    } catch (error: any) {
      toast.error(error.message || 'Failed to log in');
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.name || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (registerForm.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await signup(registerForm.email, registerForm.password, registerForm.name);
      toast.success('Welcome to the Dragon Kingdom!');
      closeModal();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const renderModal = () => {
    if (!activeModal) return null;

    return (
      <div className="fixed inset-0 glass-modal flex items-center justify-center z-50 p-4">
        <div className="glass-form rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden modal-enter">
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-2xl font-display font-bold text-slate-800">
              {activeModal === 'kyc' && 'Identity Verification'}
              {activeModal === 'identity' && 'Digital Identity'}
              {activeModal === 'business' && 'Business Formation'}
              {activeModal === 'certificates' && 'Certificates & Tax ID'}
              {activeModal === 'login' && 'Welcome Back'}
              {activeModal === 'register' && 'Begin Your Journey'}
            </h2>
            <button
              onClick={closeModal}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>

          <div className="modal-content overflow-y-auto max-h-[calc(90vh-80px)]">
            {activeModal === 'login' && (
              <div className="p-6">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                        className="form-input w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginForm.password}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                        className="form-input w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full gradient-monastery text-white py-3 rounded-lg font-semibold disabled:opacity-50 shadow-lg"
                  >
                    {loading ? 'Entering...' : 'Enter the Kingdom'}
                  </button>
                </form>
              </div>
            )}

            {activeModal === 'register' && (
              <div className="p-6">
                <form onSubmit={handleRegister} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                        className="form-input w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="email"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                        className="form-input w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="password"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                        className="form-input w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg"
                        placeholder="Create a password"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="password"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="form-input w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg"
                        placeholder="Confirm your password"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full gradient-monastery text-white py-3 rounded-lg font-semibold disabled:opacity-50 shadow-lg"
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>
              </div>
            )}

            {activeModal === 'kyc' && (
              <div className="p-6">
                <div className="flex items-center justify-center mb-6">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        step <= kycStep ? 'gradient-monastery text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {step < kycStep ? <CheckCircle className="h-4 w-4" /> : step}
                      </div>
                      {step < 4 && <div className={`w-12 h-1 mx-2 ${step < kycStep ? 'gradient-monastery' : 'bg-slate-200'}`} />}
                    </div>
                  ))}
                </div>

                {kycStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-slate-800 text-center">Personal Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg"
                        value={kycForm.fullName}
                        onChange={(e) => setKycForm(prev => ({ ...prev, fullName: e.target.value }))}
                      />
                      <select
                        className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg"
                        value={kycForm.nationality}
                        onChange={(e) => setKycForm(prev => ({ ...prev, nationality: e.target.value }))}
                      >
                        <option value="">Select Nationality</option>
                        <option value="US">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="CA">Canada</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="IN">India</option>
                        <option value="JP">Japan</option>
                        <option value="SG">Singapore</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Passport Number"
                        className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg"
                        value={kycForm.passportNumber}
                        onChange={(e) => setKycForm(prev => ({ ...prev, passportNumber: e.target.value }))}
                      />
                      <input
                        type="date"
                        className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg"
                        value={kycForm.dateOfBirth}
                        onChange={(e) => setKycForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      />
                    </div>
                  </div>
                )}

                {kycStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-slate-800 text-center">Address Information</h3>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Street Address"
                        className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg"
                        value={kycForm.address}
                        onChange={(e) => setKycForm(prev => ({ ...prev, address: e.target.value }))}
                      />
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="City"
                          className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg"
                          value={kycForm.city}
                          onChange={(e) => setKycForm(prev => ({ ...prev, city: e.target.value }))}
                        />
                        <select
                          className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg"
                          value={kycForm.country}
                          onChange={(e) => setKycForm(prev => ({ ...prev, country: e.target.value }))}
                        >
                          <option value="">Select Country</option>
                          <option value="US">United States</option>
                          <option value="UK">United Kingdom</option>
                          <option value="CA">Canada</option>
                          <option value="AU">Australia</option>
                          <option value="DE">Germany</option>
                          <option value="FR">France</option>
                          <option value="IN">India</option>
                          <option value="JP">Japan</option>
                          <option value="SG">Singapore</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {kycStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-slate-800 text-center">Document Upload</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                        <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-slate-700">Passport Photo</p>
                        <p className="text-xs text-slate-500">PNG, JPG up to 10MB</p>
                        <input type="file" className="hidden" accept="image/*" />
                      </div>
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                        <FileText className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-slate-700">Proof of Address</p>
                        <p className="text-xs text-slate-500">PDF, PNG, JPG up to 10MB</p>
                        <input type="file" className="hidden" accept="image/*,.pdf" />
                      </div>
                    </div>
                  </div>
                )}

                {kycStep === 4 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-slate-800 text-center">Live Selfie Verification</h3>
                    <div className="text-center">
                      <div className="w-64 h-48 bg-slate-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <Camera className="h-12 w-12 text-slate-400" />
                      </div>
                      <button className="gradient-monastery text-white px-6 py-3 rounded-lg font-medium">
                        <Camera className="h-4 w-4 inline mr-2" />
                        Activate Camera
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
                  {kycStep > 1 && (
                    <button
                      onClick={() => setKycStep(kycStep - 1)}
                      className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                    >
                      Previous
                    </button>
                  )}
                  <div className="ml-auto">
                    {kycStep < 4 ? (
                      <button
                        onClick={() => setKycStep(kycStep + 1)}
                        className="gradient-monastery text-white px-6 py-2 rounded-lg"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          toast.success('KYC application submitted successfully!');
                          closeModal();
                        }}
                        className="gradient-monastery text-white px-6 py-2 rounded-lg"
                      >
                        Submit Application
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'identity' && (
              <div className="p-6">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 gradient-monastery rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Digital Identity Card</h3>
                  <p className="text-slate-600">Your NFT-based Bhutanese digital residency credential</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-8 text-white mb-6 relative overflow-hidden">
                  <div className="absolute top-4 right-4 opacity-20">
                    <Mountain className="h-16 w-16" />
                  </div>
                  <div className="relative z-10">
                    <h4 className="text-lg font-semibold mb-2">Kingdom of Bhutan</h4>
                    <p className="text-sm opacity-90 mb-4">Digital Residency Card</p>
                    <div className="space-y-2">
                      <p className="font-medium">{currentUser?.displayName || 'Digital Resident'}</p>
                      <p className="text-sm opacity-90">ID: BHU-{Date.now().toString().slice(-6)}</p>
                      <p className="text-sm opacity-90">Valid: Lifetime</p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <button className="flex items-center justify-center px-6 py-3 gradient-monastery text-white rounded-lg">
                    <Award className="h-4 w-4 mr-2" />
                    Download Certificate
                  </button>
                  <button className="flex items-center justify-center px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50">
                    <Globe className="h-4 w-4 mr-2" />
                    Add to Wallet
                  </button>
                </div>
              </div>
            )}

            {activeModal === 'business' && (
              <div className="p-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <Building2 className="h-12 w-12 gradient-monastery rounded-lg p-2 mx-auto mb-4 text-white" />
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Business Formation</h3>
                    <p className="text-slate-600">Register your business in the Kingdom of Bhutan</p>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Company Name"
                      className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg"
                    />
                    <select className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg">
                      <option value="">Select Business Type</option>
                      <option value="LLC">Limited Liability Company (LLC)</option>
                      <option value="Corporation">Corporation</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Sole Proprietorship">Sole Proprietorship</option>
                    </select>
                    <textarea
                      placeholder="Business Description"
                      rows={4}
                      className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Business Address"
                      className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <button
                    onClick={() => {
                      toast.success('Business registration initiated!');
                      closeModal();
                    }}
                    className="w-full gradient-monastery text-white py-3 rounded-lg font-semibold"
                  >
                    Register Business
                  </button>
                </div>
              </div>
            )}

            {activeModal === 'certificates' && (
              <div className="p-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <FileText className="h-12 w-12 gradient-monastery rounded-lg p-2 mx-auto mb-4 text-white" />
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Certificates & Tax ID</h3>
                    <p className="text-slate-600">Access your official documents and tax information</p>
                  </div>

                  <div className="space-y-4">
                    <div className="border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-8 w-8 text-orange-500 mr-3" />
                        <div>
                          <h4 className="font-medium text-slate-800">Digital Residency Certificate</h4>
                          <p className="text-sm text-slate-500">Official government document</p>
                        </div>
                      </div>
                      <button className="text-orange-600 hover:text-orange-700 font-medium">Download</button>
                    </div>

                    <div className="border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <Shield className="h-8 w-8 text-green-500 mr-3" />
                        <div>
                          <h4 className="font-medium text-slate-800">Tax ID Certificate</h4>
                          <p className="text-sm text-slate-500">BHU-TAX-{Date.now().toString().slice(-6)}</p>
                        </div>
                      </div>
                      <button className="text-orange-600 hover:text-orange-700 font-medium">Download</button>
                    </div>

                    <div className="border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <Building2 className="h-8 w-8 text-blue-500 mr-3" />
                        <div>
                          <h4 className="font-medium text-slate-800">Business Registration</h4>
                          <p className="text-sm text-slate-500">Company incorporation documents</p>
                        </div>
                      </div>
                      <button className="text-slate-400 cursor-not-allowed">Pending</button>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Compliance Status</h4>
                    <div className="flex items-center text-sm text-blue-700">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      All documents are up to date and compliant
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div className="bhutan-bg" />
      <div className="bhutan-overlay" />

      {/* Thunder Dragon Watermark */}
      <div className="thunder-dragon">
        <Mountain className="h-32 w-32 text-white" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Navigation */}
        <nav className="glass-nav p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-monastery rounded-xl flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-display font-bold text-white text-shadow">Bhutan eResidency</h1>
                <p className="text-xs text-white/90 text-shadow">Digital Gateway to the Dragon Kingdom</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {currentUser ? (
                <>
                  <span className="text-white text-shadow">Welcome, {currentUser.displayName}</span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 glass text-white rounded-lg hover:bg-white/20 transition-colors text-shadow"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setActiveModal('login')}
                    className="px-4 py-2 text-white hover:text-white/80 transition-colors text-shadow"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setActiveModal('register')}
                    className="px-6 py-2 gradient-monastery text-white rounded-lg hover:shadow-lg transition-all text-shadow"
                  >
                    Begin Journey
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-4xl hero-content">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center px-4 py-2 glass rounded-full text-white text-sm font-medium mb-6">
                <Mountain className="h-4 w-4 mr-2 text-orange-400" />
                From the Land of the Thunder Dragon
              </div>
            </div>

            <h1 className="text-4xl md:text-7xl font-display font-bold mb-6 leading-tight animate-fade-in-up text-white text-3d">
              <span className="block mb-2">Become a Digital</span>
              <span className="block bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 bg-clip-text text-transparent">
                Resident of Bhutan
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up text-shadow">
              Global entrepreneurship. Himalayan trust. Join the world's happiest nation and access 
              international business opportunities from the mystical Dragon Kingdom.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up">
              <button
                onClick={() => setActiveModal('kyc')}
                className="group px-8 py-4 gradient-monastery text-white font-display font-bold rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center justify-center text-lg animate-pulse-glow"
              >
                Start KYC Verification
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button
                onClick={() => setActiveModal('identity')}
                className="px-8 py-4 glass text-white font-display font-bold rounded-xl hover:bg-white/20 transition-all duration-300 inline-flex items-center justify-center text-lg text-shadow"
              >
                Explore Benefits
              </button>
            </div>

            {/* Feature Icons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto animate-fade-in-up">
              {[
                { icon: Shield, label: 'Secure Identity', action: () => setActiveModal('kyc') },
                { icon: CreditCard, label: 'Digital ID', action: () => setActiveModal('identity') },
                { icon: Building2, label: 'Business Setup', action: () => setActiveModal('business') },
                { icon: FileText, label: 'Certificates', action: () => setActiveModal('certificates') }
              ].map((feature, index) => (
                <button
                  key={index}
                  onClick={feature.action}
                  className="group glass p-4 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <feature.icon className="h-8 w-8 text-orange-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-white text-shadow">{feature.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Navigation */}
        <div className="floating-nav">
          <div className="flex flex-col md:flex-row gap-2">
            <button
              onClick={() => setActiveModal('kyc')}
              className="p-3 glass rounded-lg hover:bg-white/20 transition-colors group"
              title="KYC Verification"
            >
              <Shield className="h-5 w-5 text-white group-hover:text-orange-400 transition-colors" />
            </button>
            <button
              onClick={() => setActiveModal('identity')}
              className="p-3 glass rounded-lg hover:bg-white/20 transition-colors group"
              title="Digital Identity"
            >
              <CreditCard className="h-5 w-5 text-white group-hover:text-orange-400 transition-colors" />
            </button>
            <button
              onClick={() => setActiveModal('business')}
              className="p-3 glass rounded-lg hover:bg-white/20 transition-colors group"
              title="Business Formation"
            >
              <Building2 className="h-5 w-5 text-white group-hover:text-orange-400 transition-colors" />
            </button>
            <button
              onClick={() => setActiveModal('certificates')}
              className="p-3 glass rounded-lg hover:bg-white/20 transition-colors group"
              title="Certificates"
            >
              <FileText className="h-5 w-5 text-white group-hover:text-orange-400 transition-colors" />
            </button>
          </div>
        </div>

        {/* Cultural Elements */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 text-white/60 text-sm animate-float">
          <Heart className="h-4 w-4" />
          <span className="text-shadow">Gross National Happiness</span>
          <Leaf className="h-4 w-4" />
        </div>
      </div>

      {/* Modal */}
      {renderModal()}
    </div>
  );
};