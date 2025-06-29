'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showApplication, setShowApplication] = useState(false)
  const [currentStep, setCurrentStep] = useState(2) // Start at step 2 since we removed personal info
  const [showMenu, setShowMenu] = useState(false)
  // Define the KYC form data type
  type KycFormData = {
    [key: string]: string | boolean | null;
    fullName: string;
    email: string;
    // KYC fields
    passportNumber: string;
    address: string;
    city: string;
    postalCode: string;
    addressCountry: string;
    // Selfie
    selfieImage: string | null;
    // Compliance questions
    hasBeenConvicted: boolean | null;
    hasBankruptcy: boolean | null;
    isPoliticallyExposed: boolean | null;
    hasRegulatorySanctions: boolean | null;
    agreesToTerms: boolean;
  }

  const [formData, setFormData] = useState<KycFormData>({
    fullName: '',
    email: '',
    // KYC fields
    passportNumber: '',
    address: '',
    city: '',
    postalCode: '',
    addressCountry: '',
    // Selfie
    selfieImage: null,
    // Compliance questions
    hasBeenConvicted: null,
    hasBankruptcy: null,
    isPoliticallyExposed: null,
    hasRegulatorySanctions: null,
    agreesToTerms: false
  })
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleGetStarted = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setShowApplication(true)
    }, 1500)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleBooleanChange = (field: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleContinue = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else if (currentStep === 4) {
      // Submit the form
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      
      // Create FormData object to handle file upload
      const formDataToSend = new FormData();
      
      // Map frontend form fields to backend field names
      const fieldMappings = {
        'fullName': 'fullName',
        'email': 'email',
        'passportNumber': 'passportNumber',
        'addressCountry': 'country' // Map addressCountry to country
      } as const;

      // Add mapped scalar fields to FormData
      Object.entries(fieldMappings).forEach(([frontendKey, backendKey]) => {
        const value = formData[frontendKey];
        if (value !== null && value !== undefined && value !== '') {
          formDataToSend.append(backendKey, String(value));
        }
      });

      // Combine address + city + postalCode into a single string for the 'address' field
      const combinedAddressParts = [formData.address, formData.city, formData.postalCode].filter(Boolean);
      if (combinedAddressParts.length > 0) {
        formDataToSend.append('address', combinedAddressParts.join(', '));
      }
      
      // Add compliance fields if they exist
      if (formData.hasBeenConvicted !== null) {
        formDataToSend.append('hasBeenConvicted', String(formData.hasBeenConvicted));
      }
      if (formData.hasBankruptcy !== null) {
        formDataToSend.append('hasBankruptcy', String(formData.hasBankruptcy));
      }
      if (formData.isPoliticallyExposed !== null) {
        formDataToSend.append('isPoliticallyExposed', String(formData.isPoliticallyExposed));
      }
      
      // Convert base64 image to blob and append to FormData as 'selfie'
      if (formData.selfieImage) {
        const base64Response = await fetch(formData.selfieImage);
        const blob = await base64Response.blob();
        formDataToSend.append('selfie', blob, 'selfie.jpg');
      }
      
      // Send the request to the backend
      console.log('Sending KYC data to:', `${process.env.NEXT_PUBLIC_API_URL}/api/kyc/submit`);
      console.log('Form data keys:', Array.from(formDataToSend.keys()));
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/kyc/submit`, {
        method: 'POST',
        body: formDataToSend,
        // Don't set Content-Type header - let the browser set it with the correct boundary
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          console.error('Failed to parse error response:', e);
        }
        throw new Error(errorMessage);
      }
      
      // Success: store identifiers locally then redirect
      try {
        const data = await response.json();
        if (data.userId) localStorage.setItem('userId', data.userId);
        if (data.kycId) localStorage.setItem('kycId', data.kycId);
        localStorage.setItem('isKycApplied', 'true');
      } catch (e) {
        console.warn('Unable to parse success response JSON', e);
      }
      setIsSubmitted(true);
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Error submitting KYC:', error);
      alert(`Error submitting KYC: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      setShowApplication(false)
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      })
      setCameraStream(stream)
      setIsCameraActive(true)
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please ensure you have granted camera permissions.')
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
      setIsCameraActive(false)
    }
  }

  const takeSelfie = () => {
    const video = document.getElementById('selfie-video') as HTMLVideoElement
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    
    if (ctx) {
      ctx.drawImage(video, 0, 0)
      const imageData = canvas.toDataURL('image/jpeg', 0.8)
      setFormData(prev => ({ ...prev, selfieImage: imageData }))
      stopCamera()
    }
  }

  const retakeSelfie = () => {
    setFormData(prev => ({ ...prev, selfieImage: null }))
    startCamera()
  }

  const steps = [
    { number: 1, title: 'KYC Details', active: currentStep === 2, completed: currentStep > 2 },
    { number: 2, title: 'Selfie Verification', active: currentStep === 3, completed: currentStep > 3 },
    { number: 3, title: 'Compliance', active: currentStep === 4, completed: currentStep > 4 },
  ]

  const handleStepClick = (stepNumber: number) => {
    // Adjust step number since we removed the first step
    const adjustedStep = stepNumber + 1;
    if (adjustedStep < currentStep || steps[stepNumber - 1].completed) {
      setCurrentStep(adjustedStep)
    }
  }

  useEffect(() => {
    if (showApplication && currentStep === 3 && !formData.selfieImage && !isCameraActive) {
      startCamera()
    }
    
    return () => {
      if (cameraStream) {
        stopCamera()
      }
    }
  }, [showApplication, currentStep])

  useEffect(() => {
    if (cameraStream && isCameraActive) {
      const video = document.getElementById('selfie-video') as HTMLVideoElement
      if (video) {
        video.srcObject = cameraStream
      }
    }
  }, [cameraStream, isCameraActive])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMenu && !(event.target as Element).closest('.menu-dropdown')) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Grey dots gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-white opacity-30"></div>
      <div 
        className="absolute inset-0 opacity-20" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}
      ></div>

      {/* Header */}
      <header className="absolute top-0 left-0 z-10 p-6">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-black rounded-sm flex items-center justify-center">
            <span className="text-xs font-bold text-white">D</span>
          </div>
          <span className="text-base font-medium text-gray-900">Druk e-Portal</span>
        </div>
      </header>

      {/* Navigation - top right */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-4">
        <a 
          href="/directory" 
          className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
        >
          Public Directory
        </a>
        <div className="relative menu-dropdown">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
              <a
                href="/directory"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowMenu(false)}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                  Public Directory
                </div>
              </a>
              <a
                href="/dashboard"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowMenu(false)}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  Dashboard
                </div>
              </a>
              <a
                href="/vc"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowMenu(false)}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Digital Wallet
                </div>
              </a>
              <a
                href="/admin"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowMenu(false)}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Admin Panel
                </div>
              </a>
              <div className="border-t border-gray-100 my-2"></div>
              <a 
                href="#about" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowMenu(false)}
              >
                About e-Residency
              </a>
              <a 
                href="#contact" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowMenu(false)}
              >
                Contact
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Main Container - centered with bordered card */}
      <div className="min-h-screen flex items-center justify-center p-8 relative z-10">
        {isSubmitted ? (
          /* Success Screen */
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-2xl p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Application Submitted Successfully!
              </h2>
              <p className="text-gray-600">
                Thank you for your application to the Druk e-Portal. We will review your submission and contact you within 2-3 business days.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Next Steps:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Your application will be reviewed by our compliance team</li>
                <li>• You will receive an email confirmation within 24 hours</li>
                <li>• Final approval and digital ID issuance: 2-3 business days</li>
                <li>• You can track your application status via email updates</li>
              </ul>
            </div>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setIsSubmitted(false)
                  setShowApplication(false)
                  setCurrentStep(1)
                  setFormData({
                    fullName: '',
                    email: '',

                    passportNumber: '',
                    address: '',
                    city: '',
                    postalCode: '',
                    addressCountry: '',
                    selfieImage: null,
                    hasBeenConvicted: null,
                    hasBankruptcy: null,
                    isPoliticallyExposed: null,
                    hasRegulatorySanctions: null,
                    agreesToTerms: false
                  })
                }}
                className="bg-gray-900 text-white px-6 py-2 rounded-md font-medium text-sm hover:bg-gray-800 transition-colors"
              >
                Submit Another Application
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md font-medium text-sm hover:bg-gray-50 transition-colors"
              >
                Return to Home
              </button>
            </div>
          </div>
        ) : !showApplication ? (
          /* Landing Page with Image */
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex w-full max-w-4xl h-auto">
            {/* Left side - Image */}
            <div className="w-96 relative">
              <div className="aspect-[4/5] relative">
                <Image
                  src="/image.avif"
                  alt="Futuristic city architecture"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Right side - Landing Content */}
            <div className="w-96 flex flex-col">
              <div className="flex-1 flex items-center justify-center py-12">
                <div className="w-full max-w-sm mx-auto space-y-8">
                  {/* Title with gradient background and subtitles */}
                  <div className="relative text-center">
                    {/* Grey dots gradient behind text */}
                    <div 
                      className="absolute inset-0 rounded-xl -mx-4 -my-6 opacity-30" 
                      style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0)`,
                        backgroundSize: '16px 16px'
                      }}
                    ></div>
                    <div className="relative space-y-4">
                      <div>
                        <h2 className="text-2xl font-normal text-gray-900 leading-tight bg-gradient-to-r from-gray-900 via-black to-gray-900 bg-clip-text ml-16">
                          The e-Himalayan Kingdom
                        </h2>
                        <p className="text-2xl font-normal text-gray-900 leading-tight bg-gradient-to-r from-gray-900 via-black to-gray-900 bg-clip-text ml-16">
                          for the ambitious world
                        </p>
                      </div>
                      
                      {/* Subtitle lines */}
                      <div>
                        <p className="text-sm text-gray-600 ml-16">
                          Get verified. Get your ID. Build a company — all from anywhere, under Bhutan&apos;s new digital frontier.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Get Started Button */}
                  <div className="text-center">
                    <button
                      onClick={handleGetStarted}
                      disabled={isLoading}
                      className="bg-black hover:bg-gray-900 disabled:bg-gray-400 text-white font-medium py-3 px-8 rounded-lg transition-colors text-sm ml-16"
                    >
                      {isLoading ? 'Loading...' : 'Get Started'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer Links - bottom */}
              <div className="text-center pb-8">
                <div className="flex justify-center gap-6 text-xs text-gray-400 uppercase tracking-wider ml-16">
                  <a href="#privacy" className="hover:text-gray-600 transition-colors">
                    Privacy
                  </a>
                  <a href="#terms" className="hover:text-gray-600 transition-colors">
                    Terms
                  </a>
                  <a href="#contact" className="hover:text-gray-600 transition-colors">
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Application Form without Image */
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-2xl">
            <div className="p-6 border-b">
              <h1 className="text-xl font-semibold text-gray-900 mb-1">
                Apply for Digital Residency
              </h1>
              <p className="text-sm text-gray-600">
                Complete your application to become a verified digital resident
              </p>
            </div>

            {/* Progress Steps */}
            <div className="px-6 py-4 border-b bg-gray-50">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div 
                      onClick={() => handleStepClick(step.number)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                        step.completed 
                          ? 'bg-blue-600 text-white cursor-pointer hover:bg-blue-700' 
                          : step.active 
                          ? 'bg-blue-600 text-white' 
                          : step.number < 4 
                          ? 'bg-gray-200 text-gray-500 cursor-pointer hover:bg-gray-300'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {step.completed ? '✓' : step.number}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-12 h-0.5 mx-2 ${
                        step.completed ? 'bg-blue-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6 min-h-96">


              {currentStep === 2 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Step 2: KYC Verification
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Legal Name (as on passport)
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your legal name"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Passport Number
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your passport number"
                        value={formData.passportNumber}
                        onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your street address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          placeholder="City"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          placeholder="Postal code"
                          value={formData.postalCode}
                          onChange={(e) => handleInputChange('postalCode', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <select
                        value={formData.addressCountry}
                        onChange={(e) => handleInputChange('addressCountry', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        <option value="">Select country</option>
                        <option value="US">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="CA">Canada</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="JP">Japan</option>
                        <option value="SG">Singapore</option>
                        <option value="IN">India</option>
                        <option value="CN">China</option>
                        <option value="BR">Brazil</option>
                        <option value="MX">Mexico</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Step 3: Identity Verification
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Please take a clear selfie for identity verification. Make sure your face is well-lit and clearly visible.
                  </p>
                  
                  <div className="space-y-4">
                    {!formData.selfieImage ? (
                      <div className="flex flex-col items-center">
                        {isCameraActive ? (
                          <div className="relative">
                            <video
                              id="selfie-video"
                              autoPlay
                              playsInline
                              muted
                              className="w-80 h-60 object-cover rounded-lg border border-gray-300"
                            />
                            <div className="mt-4 flex gap-3">
                              <button
                                onClick={takeSelfie}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors"
                              >
                                📸 Take Photo
                              </button>
                              <button
                                onClick={stopCamera}
                                className="bg-gray-500 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-gray-600 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="w-80 h-60 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                              <div className="text-center">
                                <div className="text-4xl mb-2">📷</div>
                                <p className="text-gray-500 text-sm">Camera not active</p>
                              </div>
                            </div>
                            <button
                              onClick={startCamera}
                              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors"
                            >
                              Start Camera
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="relative">
                          <img
                            src={formData.selfieImage}
                            alt="Selfie preview"
                            className="w-80 h-60 object-cover rounded-lg border border-gray-300"
                          />
                          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                            ✓ Photo captured
                          </div>
                        </div>
                        <div className="mt-4 flex gap-3">
                          <button
                            onClick={retakeSelfie}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-gray-600 transition-colors"
                          >
                            Retake Photo
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Tips for a good selfie:</h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Ensure good lighting on your face</li>
                      <li>• Look directly at the camera</li>
                      <li>• Remove sunglasses or hat</li>
                      <li>• Keep a neutral expression</li>
                    </ul>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div>
                  {/* Compliance Questions */}
                  <div className="space-y-4 mb-6">
                    {/* Question 1 */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-900 mb-3">Have you ever been convicted of a criminal offense?</p>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="convicted"
                            checked={formData.hasBeenConvicted === false}
                            onChange={() => handleBooleanChange('hasBeenConvicted', false)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">No</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="convicted"
                            checked={formData.hasBeenConvicted === true}
                            onChange={() => handleBooleanChange('hasBeenConvicted', true)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">Yes</span>
                        </label>
                      </div>
                    </div>

                    {/* Question 2 */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-900 mb-3">Have you ever filed for bankruptcy or been subject to insolvency proceedings?</p>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="bankruptcy"
                            checked={formData.hasBankruptcy === false}
                            onChange={() => handleBooleanChange('hasBankruptcy', false)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">No</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="bankruptcy"
                            checked={formData.hasBankruptcy === true}
                            onChange={() => handleBooleanChange('hasBankruptcy', true)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">Yes</span>
                        </label>
                      </div>
                    </div>

                    {/* Question 3 */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-900 mb-3">Are you a politically exposed person (PEP) or related to one?</p>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="politically-exposed"
                            checked={formData.isPoliticallyExposed === false}
                            onChange={() => handleBooleanChange('isPoliticallyExposed', false)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">No</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="politically-exposed"
                            checked={formData.isPoliticallyExposed === true}
                            onChange={() => handleBooleanChange('isPoliticallyExposed', true)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">Yes</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Terms Agreement */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        checked={formData.agreesToTerms}
                        onChange={(e) => handleBooleanChange('agreesToTerms', e.target.checked)}
                        className="mt-1 mr-3"
                      />
                      <span className="text-sm text-gray-700">
                        I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>. I understand that providing false information may result in application rejection and legal consequences.
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="p-6 border-t bg-gray-50 flex justify-between">
              <button
                onClick={handlePrevious}
                className="text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors"
              >
                ← Previous
              </button>
              
              <button
                onClick={handleContinue}
                disabled={
                  false &&
                  (currentStep === 2 && (!formData.fullName || !formData.passportNumber || !formData.address || !formData.city || !formData.postalCode || !formData.addressCountry)) ||
                  (currentStep === 3 && !formData.selfieImage) ||
                  (currentStep === 4 && (
                    formData.hasBeenConvicted === null ||
                    formData.hasBankruptcy === null ||
                    formData.isPoliticallyExposed === null ||
                    !formData.agreesToTerms
                  ))
                }
                className="bg-gray-900 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {currentStep === 4 ? 'Submit' : 'Continue'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
