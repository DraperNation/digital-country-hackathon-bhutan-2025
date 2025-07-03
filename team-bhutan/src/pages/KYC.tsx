import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  User, 
  Upload, 
  FileText, 
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Shield,
  Globe,
  Camera,
  RotateCcw,
  X,
  Play,
  Square
} from 'lucide-react';
import toast from 'react-hot-toast';

interface KYCFormData {
  fullName: string;
  nationality: string;
  passportNumber: string;
  dateOfBirth: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  passportImage: File | null;
  addressProof: File | null;
  selfieImage: File | null;
}

export const KYC: React.FC = () => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [formData, setFormData] = useState<KYCFormData>({
    fullName: currentUser?.displayName || '',
    nationality: '',
    passportNumber: '',
    dateOfBirth: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    passportImage: null,
    addressProof: null,
    selfieImage: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'passportImage' | 'addressProof' | 'selfieImage') => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      [fieldName]: file
    }));
  };
// Camera-related state and refs

// Start Camera
const startCamera = useCallback(async () => {
  try {
    // Request camera access
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: 640, height: 480 },
      audio: false,
    });
    setStream(mediaStream);
    setShowWebcam(true);
    setIsRecording(true);

    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play().catch(err => {
          toast.error('Unable to play video stream.');
        });
      };
    }
    toast.success('Camera activated successfully!');
  } catch (error: any) {
    if (error.name === 'NotAllowedError') {
      toast.error('Camera access denied. Please allow camera permission.');
    } else if (error.name === 'NotFoundError') {
      toast.error('No camera device found.');
    } else {
      toast.error('Failed to access camera.');
    }
  }
}, []);

// Stop Camera
const stopCamera = useCallback(() => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    setStream(null);
  }
  if (videoRef.current) {
    videoRef.current.srcObject = null;
  }
  setShowWebcam(false);
  setIsRecording(false);
  setCapturedImage(null);
}, [stream]);

// Capture Photo (mirrored selfie)
const capturePhoto = useCallback(() => {
  if (videoRef.current && canvasRef.current) {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Mirror the image for selfie
      context.save();
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      context.restore();

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
          setFormData(prev => ({
            ...prev,
            selfieImage: file
          }));
          const imageUrl = canvas.toDataURL('image/jpeg');
          setCapturedImage(imageUrl);
          setIsRecording(false);
          toast.success('Selfie captured successfully!');
        }
      }, 'image/jpeg', 0.8);
    }
  }
}, [setFormData]);

// Retake Photo
const retakePhoto = useCallback(() => {
  setCapturedImage(null);
  setIsRecording(true);
  setFormData(prev => ({
    ...prev,
    selfieImage: null
  }));
}, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const requiredFields = ['fullName', 'nationality', 'passportNumber', 'dateOfBirth', 'address', 'city', 'country'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof KYCFormData]);
    
    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.passportImage || !formData.addressProof) {
      toast.error('Please upload all required documents');
      return;
    }

    if (!formData.selfieImage) {
      toast.error('Please capture a selfie for verification');
      return;
    }

    setLoading(true);
    try {
      stopCamera();
      
      localStorage.setItem('kycSubmitted', 'true');
      localStorage.setItem('kycSubmissionTime', Date.now().toString());
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Documents submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to submit documents');
    }
    setLoading(false);
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8 overflow-x-auto pb-2">
      {[
        { number: 1, title: t('kyc.step.personal'), icon: User },
        { number: 2, title: t('kyc.step.address'), icon: Globe },
        { number: 3, title: t('kyc.step.documents'), icon: Shield },
        { number: 4, title: t('kyc.step.selfie'), icon: Camera }
      ].map((step, index) => (
        <div key={step.number} className="flex items-center flex-shrink-0">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                step.number <= currentStep
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : theme === 'dark'
                    ? 'bg-white/20 text-white/60'
                    : 'bg-slate-200 text-slate-500'
              }`}
            >
              {step.number < currentStep ? (
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <step.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </div>
            <span className={`mt-2 text-xs sm:text-sm font-medium text-center ${
              step.number <= currentStep 
                ? theme === 'dark' ? 'text-white text-shadow' : 'text-slate-800'
                : theme === 'dark' ? 'text-white/60' : 'text-slate-500'
            }`}>
              {step.title}
            </span>
          </div>
          {index < 3 && (
            <div
              className={`w-8 sm:w-16 h-1 mx-2 sm:mx-4 rounded-full transition-all duration-200 ${
                step.number < currentStep 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                  : theme === 'dark' ? 'bg-white/20' : 'bg-slate-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className={`text-xl font-display font-semibold mb-2 ${
          theme === 'dark' ? 'text-white text-shadow' : 'text-slate-800'
        }`}>Personal Information</h3>
        <p className={theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'}>
          Please provide your personal details
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-white text-shadow' : 'text-slate-700'
          }`}>
            Full Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="form-input w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-white text-shadow' : 'text-slate-700'
          }`}>
            Nationality *
          </label>
          <select
            name="nationality"
            value={formData.nationality}
            onChange={handleInputChange}
            className="form-input w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Select your nationality</option>
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="IN">India</option>
            <option value="JP">Japan</option>
            <option value="SG">Singapore</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-white text-shadow' : 'text-slate-700'
          }`}>
            Passport Number *
          </label>
          <input
            type="text"
            name="passportNumber"
            value={formData.passportNumber}
            onChange={handleInputChange}
            className="form-input w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter passport number"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-white text-shadow' : 'text-slate-700'
          }`}>
            Date of Birth *
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className="form-input w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>
    </div>
  );

  const renderAddressInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className={`text-xl font-display font-semibold mb-2 ${
          theme === 'dark' ? 'text-white text-shadow' : 'text-slate-800'
        }`}>Address Information</h3>
        <p className={theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'}>
          Please provide your current address
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-white text-shadow' : 'text-slate-700'
          }`}>
            Street Address *
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="form-input w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter your street address"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-white text-shadow' : 'text-slate-700'
            }`}>
              City *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="form-input w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              placeholder="City"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-white text-shadow' : 'text-slate-700'
            }`}>
              Country *
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="form-input w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Select country</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="IN">India</option>
              <option value="JP">Japan</option>
              <option value="SG">Singapore</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-white text-shadow' : 'text-slate-700'
            }`}>
              Postal Code
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              className="form-input w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              placeholder="Postal code"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocumentUpload = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className={`text-xl font-display font-semibold mb-2 ${
          theme === 'dark' ? 'text-white text-shadow' : 'text-slate-800'
        }`}>Document Upload</h3>
        <p className={theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'}>
          Please upload the required documents
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className={`block text-sm font-medium mb-3 ${
            theme === 'dark' ? 'text-white text-shadow' : 'text-slate-700'
          }`}>
            Passport Photo *
          </label>
          <div className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
            theme === 'dark'
              ? 'border-white/30 bg-white/10 hover:bg-white/20'
              : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
          }`}>
            <div className="text-center">
              <Upload className={`h-8 w-8 mx-auto mb-3 ${
                theme === 'dark' ? 'text-white/60' : 'text-slate-400'
              }`} />
              <div className="mb-3">
                <label htmlFor="passport-upload" className="cursor-pointer">
                  <span className={`text-sm font-medium block mb-1 ${
                    theme === 'dark' ? 'text-white text-shadow' : 'text-slate-700'
                  }`}>
                    Upload Passport Image
                  </span>
                  <span className={`text-xs block ${
                    theme === 'dark' ? 'text-white/80 text-shadow' : 'text-slate-500'
                  }`}>
                    PNG, JPG up to 10MB
                  </span>
                </label>
                <input
                  id="passport-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'passportImage')}
                  className="hidden"
                />
              </div>
              {formData.passportImage && (
                <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {formData.passportImage.name}
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-3 ${
            theme === 'dark' ? 'text-white text-shadow' : 'text-slate-700'
          }`}>
            Proof of Address *
          </label>
          <div className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
            theme === 'dark'
              ? 'border-white/30 bg-white/10 hover:bg-white/20'
              : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
          }`}>
            <div className="text-center">
              <FileText className={`h-8 w-8 mx-auto mb-3 ${
                theme === 'dark' ? 'text-white/60' : 'text-slate-400'
              }`} />
              <div className="mb-3">
                <label htmlFor="address-upload" className="cursor-pointer">
                  <span className={`text-sm font-medium block mb-1 ${
                    theme === 'dark' ? 'text-white text-shadow' : 'text-slate-700'
                  }`}>
                    Upload Address Proof
                  </span>
                  <span className={`text-xs block ${
                    theme === 'dark' ? 'text-white/80 text-shadow' : 'text-slate-500'
                  }`}>
                    Utility bill, bank statement, or government document
                  </span>
                </label>
                <input
                  id="address-upload"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange(e, 'addressProof')}
                  className="hidden"
                />
              </div>
              {formData.addressProof && (
                <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {formData.addressProof.name}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${
          theme === 'dark'
            ? 'bg-blue-500/10 border-blue-400/30'
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-start">
            <AlertCircle className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
            }`} />
            <div className={`text-sm ${
              theme === 'dark' ? 'text-blue-200' : 'text-blue-700'
            }`}>
              <p className="font-medium mb-1">Document Requirements:</p>
              <ul className="space-y-1 list-disc list-inside text-xs">
                <li>All documents must be clear and legible</li>
                <li>Address proof must be dated within the last 3 months</li>
                <li>Documents must be in English or include certified translation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSelfieCapture = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className={`text-xl font-display font-semibold mb-2 ${
          theme === 'dark' ? 'text-white text-shadow' : 'text-slate-800'
        }`}>Live Selfie Verification</h3>
        <p className={theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'}>
          Take a live selfie for identity verification
        </p>
      </div>

      <div className="space-y-6">
        {!showWebcam && !capturedImage ? (
          <div className="text-center">
            <div className={`border-2 border-dashed rounded-lg p-8 ${
              theme === 'dark'
                ? 'border-white/30 bg-white/10'
                : 'border-slate-300 bg-slate-50'
            }`}>
              <Camera className={`h-16 w-16 mx-auto mb-4 ${
                theme === 'dark' ? 'text-white/60' : 'text-slate-400'
              }`} />
              <h4 className={`text-lg font-medium mb-2 ${
                theme === 'dark' ? 'text-white text-shadow' : 'text-slate-800'
              }`}>Ready for Selfie Capture</h4>
              <p className={`text-sm mb-6 ${
                theme === 'dark' ? 'text-white/80 text-shadow' : 'text-slate-600'
              }`}>
                Click the button below to activate your camera and take a live selfie
              </p>
              <button
                onClick={startCamera}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors font-medium shadow-lg"
              >
                <Camera className="h-5 w-5 mr-2" />
                {t('kyc.camera.activate')}
              </button>
            </div>
          </div>
        ) : showWebcam && !capturedImage ? (
          <div className={`rounded-lg p-6 border ${
            theme === 'dark'
              ? 'bg-white/10 border-white/30'
              : 'bg-white border-slate-200'
          }`}>
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full max-w-md mx-auto rounded-lg bg-black"
                style={{ transform: 'scaleX(-1)' }}
              />
              <canvas
                ref={canvasRef}
                className="hidden"
              />
              
              {isRecording && (
                <div className="absolute top-4 left-4 flex items-center px-3 py-1 bg-red-500 text-white rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                  Recording
                </div>
              )}
            </div>
            <p className={`text-sm mb-4 text-center ${
              theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'
            }`}>
              Position your face in the center and click capture
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={capturePhoto}
                disabled={!isRecording}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <Camera className="h-4 w-4 inline mr-2" />
                {t('kyc.camera.capture')}
              </button>
              <button
                onClick={stopCamera}
                className={`px-6 py-2 rounded-lg transition-colors font-medium border ${
                  theme === 'dark'
                    ? 'btn-secondary'
                    : 'btn-secondary'
                }`}
              >
                <X className="h-4 w-4 inline mr-2" />
                {t('common.cancel')}
              </button>
            </div>
          </div>
        ) : capturedImage ? (
          <div className={`rounded-lg p-6 border ${
            theme === 'dark'
              ? 'bg-white/10 border-white/30'
              : 'bg-white border-slate-200'
          }`}>
            <div className="text-center">
              <img
                src={capturedImage}
                alt="Captured selfie"
                className="w-64 h-48 object-cover rounded-lg mx-auto mb-4 border-2 border-green-400"
              />
              <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm mb-4">
                <CheckCircle className="h-4 w-4 mr-1" />
                Selfie captured successfully!
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={retakePhoto}
                  className={`px-6 py-2 rounded-lg transition-colors font-medium border ${
                    theme === 'dark'
                      ? 'btn-secondary'
                      : 'btn-secondary'
                  }`}
                >
                  <RotateCcw className="h-4 w-4 inline mr-2" />
                  {t('kyc.camera.retake')}
                </button>
                <button
                  onClick={stopCamera}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-colors font-medium"
                >
                  <CheckCircle className="h-4 w-4 inline mr-2" />
                  {t('kyc.camera.confirm')}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div className={`p-4 rounded-lg border ${
          theme === 'dark'
            ? 'bg-amber-500/10 border-amber-400/30'
            : 'bg-amber-50 border-amber-200'
        }`}>
          <div className="flex items-start">
            <AlertCircle className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${
              theme === 'dark' ? 'text-amber-400' : 'text-amber-500'
            }`} />
            <div className={`text-sm ${
              theme === 'dark' ? 'text-amber-200' : 'text-amber-700'
            }`}>
              <p className="font-medium mb-1">Selfie Guidelines:</p>
              <ul className="space-y-1 list-disc list-inside text-xs">
                <li>Ensure good lighting and clear visibility of your face</li>
                <li>Remove glasses, hats, or any face coverings</li>
                <li>Look directly at the camera with a neutral expression</li>
                <li>Make sure your face matches your passport photo</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen py-8 transition-colors duration-300`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className={`flex items-center mb-6 font-medium transition-colors ${
              theme === 'dark'
                ? 'text-white hover:text-white/80 text-shadow'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="text-center">
            <h1 className={`text-2xl sm:text-3xl font-display font-bold mb-3 ${
              theme === 'dark' ? 'text-white text-shadow-strong' : 'text-slate-800'
            }`}>{t('kyc.title')}</h1>
            <p className={`text-base sm:text-lg max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'
            }`}>
              {t('kyc.subtitle')}
            </p>
          </div>
        </div>

        <div className={`p-6 sm:p-8 rounded-xl shadow-2xl border transition-all duration-300 ${
          theme === 'dark'
            ? 'glass-form border-white/30'
            : 'glass-form border-slate-200'
        }`}>
          {renderStepIndicator()}

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderPersonalInfo()}
            {currentStep === 2 && renderAddressInfo()}
            {currentStep === 3 && renderDocumentUpload()}
            {currentStep === 4 && renderSelfieCapture()}

            <div className={`flex flex-col sm:flex-row justify-between gap-4 mt-8 pt-6 border-t ${
              theme === 'dark' ? 'border-white/20' : 'border-slate-200'
            }`}>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className={`px-6 py-2 border rounded-lg transition-colors font-medium order-2 sm:order-1 ${
                    theme === 'dark'
                      ? 'btn-secondary'
                      : 'btn-secondary'
                  }`}
                >
                  {t('common.previous')}
                </button>
              )}

              <div className="order-1 sm:order-2 sm:ml-auto">
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors font-medium shadow-lg"
                  >
                    {t('common.next')}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || !formData.selfieImage}
                    className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-lg"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Submitting...
                      </div>
                    ) : (
                      t('common.submit') + ' Application'
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};