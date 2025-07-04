import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, CheckCircle, AlertCircle, FileText, ArrowRight, ArrowLeft } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useApp } from '../../contexts/AppContext';
import { api } from '../../services/api';
import { LoadingSpinner } from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

export const KYCBasic: React.FC = () => {
  const { state, dispatch } = useApp();
  const [uploadedDocs, setUploadedDocs] = React.useState<{[key: string]: File}>({});
  const [verificationStatus, setVerificationStatus] = React.useState<{[key: string]: 'idle' | 'processing' | 'verified' | 'failed'}>({});
  const [isProcessing, setIsProcessing] = React.useState(false);

  const requiredDocs = [
    {
      id: 'passport',
      title: 'Passport or National ID',
      description: 'Government-issued photo identification document',
      icon: FileText,
      required: true,
    },
    {
      id: 'selfie',
      title: 'Selfie Photo',
      description: 'Clear photo of yourself holding your ID document',
      icon: Camera,
      required: true,
    },
    {
      id: 'proof_of_address',
      title: 'Proof of Address',
      description: 'Utility bill or bank statement (last 3 months)',
      icon: FileText,
      required: false,
    },
  ];

  const onDrop = React.useCallback((acceptedFiles: File[], docId: string) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedDocs(prev => ({ ...prev, [docId]: file }));
      processDocument(docId, file);
    }
  }, []);

  const processDocument = async (docId: string, file: File) => {
    setVerificationStatus(prev => ({ ...prev, [docId]: 'processing' }));
    
    try {
      const kycDoc = {
        id: `${docId}_${Date.now()}`,
        type: docId as any,
        file,
        status: 'processing' as const,
      };

      dispatch({ type: 'ADD_KYC_DOCUMENT', payload: kycDoc });

      const result = await api.submitKYCDocument(state.user?.id || '', kycDoc);
      
      if (result.success) {
        setVerificationStatus(prev => ({ ...prev, [docId]: 'verified' }));
        dispatch({ 
          type: 'UPDATE_KYC_DOCUMENT', 
          payload: { 
            id: kycDoc.id, 
            updates: { 
              status: 'verified',
              extractedData: result.extractedData,
              verificationScore: result.extractedData?.verificationScore 
            }
          }
        });
        toast.success(`${docId} verified successfully!`);
      } else {
        setVerificationStatus(prev => ({ ...prev, [docId]: 'failed' }));
        toast.error(`${docId} verification failed. Please try again.`);
      }
    } catch (error) {
      setVerificationStatus(prev => ({ ...prev, [docId]: 'failed' }));
      toast.error('Document processing failed. Please try again.');
    }
  };

  const handleContinue = async () => {
    const requiredDocsUploaded = requiredDocs
      .filter(doc => doc.required)
      .every(doc => uploadedDocs[doc.id] && verificationStatus[doc.id] === 'verified');

    if (!requiredDocsUploaded) {
      toast.error('Please upload and verify all required documents.');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Update user KYC level
      if (state.user) {
        const updatedUser = { ...state.user, kycLevel: 'enhanced' as const };
        dispatch({ type: 'SET_USER', payload: updatedUser });
      }
      
      dispatch({ type: 'SET_CURRENT_STEP', payload: 'eresidency-application' });
      toast.success('Basic KYC completed! You can now apply for eResidency.');
      
    } catch (error) {
      toast.error('Failed to update KYC status. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const goBack = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'register' });
  };

  const FileUploadZone: React.FC<{ doc: any }> = ({ doc }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: (files) => onDrop(files, doc.id),
      accept: {
        'image/*': ['.jpeg', '.jpg', '.png', '.pdf'],
        'application/pdf': ['.pdf']
      },
      maxFiles: 1,
      maxSize: 10 * 1024 * 1024, // 10MB
    });

    const status = verificationStatus[doc.id] || 'idle';
    const isUploaded = uploadedDocs[doc.id];

    return (
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : status === 'verified'
            ? 'border-success-500 bg-success-50'
            : status === 'failed'
            ? 'border-error-500 bg-error-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-3">
          {status === 'processing' ? (
            <LoadingSpinner size="sm" />
          ) : status === 'verified' ? (
            <CheckCircle className="h-10 w-10 text-success-600" />
          ) : status === 'failed' ? (
            <AlertCircle className="h-10 w-10 text-error-600" />
          ) : (
            <Upload className="h-10 w-10 text-gray-400" />
          )}
          
          <div>
            <p className="font-medium text-gray-900">{doc.title}</p>
            <p className="text-sm text-gray-600">{doc.description}</p>
            
            {isUploaded ? (
              <p className="text-sm text-primary-600 mt-2">
                {status === 'verified' ? '✅ Verified' : 
                 status === 'processing' ? '⏳ Processing...' :
                 status === 'failed' ? '❌ Failed - Click to retry' :
                 '📄 Uploaded'}
              </p>
            ) : (
              <p className="text-sm text-gray-500 mt-2">
                Click to upload or drag and drop
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Updating your profile..." />
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
            
            <h1 className="text-3xl font-bold mb-2">Identity Verification</h1>
            <p className="text-primary-100">
              Verify your identity with our secure AI-powered document verification
            </p>
            
            {/* Progress bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Step 2 of 4</span>
                <span>50% Complete</span>
              </div>
              <div className="w-full bg-primary-700 rounded-full h-2">
                <div className="bg-accent-400 h-2 rounded-full w-1/2"></div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Upload Required Documents
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Secure & Private</p>
                    <p>Your documents are encrypted and processed using bank-grade security. We never store sensitive information longer than necessary.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {requiredDocs.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * requiredDocs.indexOf(doc) }}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <doc.icon className="h-5 w-5 text-primary-600" />
                    <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                    {doc.required && (
                      <span className="text-xs bg-error-100 text-error-800 px-2 py-1 rounded-full">
                        Required
                      </span>
                    )}
                  </div>
                  
                  <FileUploadZone doc={doc} />
                </motion.div>
              ))}
            </div>

            {/* AI Verification Info */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <span className="mr-2">🤖</span>
                AI-Powered Verification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium text-purple-800">OCR Technology</p>
                  <p className="text-purple-600">Extracts data from documents automatically</p>
                </div>
                <div>
                  <p className="font-medium text-purple-800">Liveness Detection</p>
                  <p className="text-purple-600">Prevents fraud with biometric checks</p>
                </div>
                <div>
                  <p className="font-medium text-purple-800">Real-time Processing</p>
                  <p className="text-purple-600">Get results in under 30 seconds</p>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContinue}
              disabled={!requiredDocs.filter(doc => doc.required).every(doc => verificationStatus[doc.id] === 'verified')}
              className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Continue to eResidency Application</span>
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};