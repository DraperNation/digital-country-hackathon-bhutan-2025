"use client";
import React, { useState, useEffect } from "react";
import { ethers, Signer } from "ethers";
import {
  MapPin,
  Send,
  CheckCircle,
  Clock,
  X,
  Upload,
  User,
  FileText,
} from "lucide-react";

import { MAR_ABI, MAR_ADDRESS } from "@/lib/constant_contracts";
interface BhutaneseKYCData {
  kycId: string;
  userAddress: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  residenceAddress: string;
  citizenshipNumber: string;
  documentHash: string;
  status: number;
  submissionTime: Date;
  verificationTime: Date | null;
  verifiedBy: string;
}

const BhutaneseRegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    residenceAddress: "",
    citizenshipNumber: "",
    documents: null as File[] | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kycSubmitted, setKycSubmitted] = useState(false);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [kycData, setKycData] = useState<BhutaneseKYCData | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(
    null
  );
  const [uploadProgress, setUploadProgress] = useState(0);

  // Auto-connect wallet on component mount
  useEffect(() => {
    checkWalletConnection();
  }, []);

  // Poll for verification status updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (walletAddress && kycSubmitted) {
      interval = setInterval(() => {
        loadUserData(signer, walletAddress);
      }, 10000); // Check every 10 seconds
    }
    return () => clearInterval(interval);
  }, [walletAddress, kycSubmitted, signer]);

  // Toast auto-hide effect
  useEffect(() => {
    if (showToast || toast) {
      const timer = setTimeout(() => {
        setShowToast(false);
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast, toast]);

  const checkWalletConnection = async () => {
    try {
      if (!(window as any).ethereum) return;

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const accounts = await provider.listAccounts();

      if (accounts.length > 0) {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setSigner(signer);
        setWalletAddress(address);
        await loadUserData(signer, address);
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!(window as any).ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setSigner(signer);
      setWalletAddress(address);
      await loadUserData(signer, address);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet");
    }
  };

  const loadUserData = async (signer: Signer | null, address: string) => {
    if (!signer || !address) return;

    try {
      const marketplaceContract = new ethers.Contract(
        MAR_ADDRESS,
        MAR_ABI,
        signer
      );

      // Check if user is verified
      const verified = await marketplaceContract.isVerifiedBhutaneseNational(
        address
      );
      setIsVerified(verified);

      // Load KYC data
      try {
        const userData = await marketplaceContract.getBhutaneseKYCData(address);
        if (userData.kycId > BigInt(0)) {
          setKycData({
            kycId: userData.kycId.toString(),
            userAddress: userData.userAddress,
            fullName: userData.fullName,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            residenceAddress: userData.residenceAddress,
            citizenshipNumber: userData.citizenshipNumber,
            documentHash: userData.documentHash,
            status: Number(userData.status),
            submissionTime: new Date(Number(userData.submissionTime) * 1000),
            verificationTime:
              userData.verificationTime > BigInt(0)
                ? new Date(Number(userData.verificationTime) * 1000)
                : null,
            verifiedBy: userData.verifiedBy,
          });
          setKycSubmitted(true);
        }
      } catch (error) {
        console.log("No KYC data found for user");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setFormData({
        ...formData,
        documents: fileArray,
      });
    }
  };

  const simulateFileUpload = async (files: File[]): Promise<string> => {
    // Simulate file upload to IPFS or similar storage
    setUploadProgress(0);

    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Generate a mock hash
    const fileNames = files.map((f) => f.name).join(",");
    const hash = ethers.keccak256(ethers.toUtf8Bytes(fileNames + Date.now()));
    setUploadProgress(0);
    return hash;
  };

  const validateForm = () => {
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.residenceAddress ||
      !formData.citizenshipNumber
    ) {
      setToast({
        message: "Please fill in all required fields.",
        type: "error",
      });
      return false;
    }

    if (!formData.documents || formData.documents.length === 0) {
      setToast({
        message: "Please upload your citizenship documents.",
        type: "error",
      });
      return false;
    }

    // Validate citizenship number format (mock validation)
    if (!/^[0-9]{11}-[0-9]{2}-[0-9]{6}$/.test(formData.citizenshipNumber)) {
      setToast({
        message:
          "Please enter a valid Bhutanese citizenship number (format: 11234567890-01-123456).",
        type: "error",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!signer) {
      setShowToast(true);
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload documents and get hash
      const documentHash = await simulateFileUpload(formData.documents!);

      const marketplaceContract = new ethers.Contract(
        MAR_ADDRESS,
        MAR_ABI,
        signer
      );

      const tx = await marketplaceContract.submitBhutaneseKYC(
        formData.fullName,
        formData.email,
        formData.phoneNumber,
        formData.residenceAddress,
        formData.citizenshipNumber,
        documentHash
      );

      console.log("Bhutanese KYC submission transaction:", tx.hash);
      setToast({
        message:
          "Submitting your registration... Please wait for confirmation.",
        type: "info",
      });

      await tx.wait();

      setKycSubmitted(true);
      setToast({
        message:
          "Registration submitted successfully! Our team will verify your documents within 24-48 hours.",
        type: "success",
      });

      if (walletAddress && signer) {
        await loadUserData(signer, walletAddress);
      }
    } catch (error) {
      console.error("Error submitting Bhutanese KYC:", error);
      setToast({
        message: "Failed to submit registration. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-4 h-4 mr-1" />
            Pending Verification
          </span>
        );
      case 1:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            Verified ✓
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <X className="w-4 h-4 mr-1" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-12 px-4">
      {/* Toast Notifications */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
          <p className="font-semibold">
            Please connect your wallet to submit the registration
          </p>
        </div>
      )}
      {toast && (
        <div
          className={`fixed top-4 left-1/2 z-50 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-semibold ${
            toast.type === "success"
              ? "bg-green-600"
              : toast.type === "error"
              ? "bg-red-600"
              : "bg-blue-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
              <MapPin className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bhutanese Citizen Registration
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Register as a verified Bhutanese national to list and sell your land
            on our marketplace
          </p>
        </div>

        {/* Wallet Connection */}
        {!walletAddress && (
          <div className="bg-white rounded-2xl p-8 mb-8 text-center shadow-lg">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Connect Your Wallet
            </h3>
            <p className="text-gray-600 mb-6">
              Connect your MetaMask wallet to begin the registration process
            </p>
            <button
              onClick={connectWallet}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        )}

        {/* Registration Status */}
        {kycData && (
          <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Registration Status
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {kycData.fullName}
                  </h4>
                  <p className="text-gray-600">
                    Citizenship: {kycData.citizenshipNumber}
                  </p>
                  <p className="text-sm text-gray-500">
                    Submitted: {kycData.submissionTime.toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  {getStatusBadge(kycData.status)}
                  {kycData.verificationTime && (
                    <p className="text-sm text-gray-500 mt-1">
                      Verified: {kycData.verificationTime.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {isVerified && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                    <div>
                      <h4 className="font-semibold text-green-900">
                        Congratulations! You're verified as a Bhutanese national
                      </h4>
                      <p className="text-green-700">
                        You can now list your land for sale on our marketplace.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Registration Form */}
        {!kycSubmitted && walletAddress && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Citizen Verification Form
            </h3>

            <div className="space-y-6">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name (as per citizenship) *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your full legal name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Citizenship Number *
                  </label>
                  <input
                    type="text"
                    name="citizenshipNumber"
                    value={formData.citizenshipNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="11234567890-01-123456"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Format: 11 digits - 2 digits - 6 digits
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="+975 XXXXXXXX"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Residential Address in Bhutan *
                </label>
                <textarea
                  name="residenceAddress"
                  value={formData.residenceAddress}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your complete residential address in Bhutan"
                />
              </div>

              {/* Document Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Citizenship Documents *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-500 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    id="documents"
                  />
                  <label htmlFor="documents" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Upload Citizenship Documents
                    </p>
                    <p className="text-gray-600 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF, JPG, PNG files (max 10MB each)
                    </p>
                  </label>

                  {formData.documents && formData.documents.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="font-medium text-gray-900">
                        Selected files:
                      </p>
                      {formData.documents.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-center space-x-2"
                        >
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">
                            {file.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Please upload clear photos or scans of your Bhutanese
                  citizenship card (front and back)
                </p>
              </div>

              {/* Upload Progress */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-900">
                      Uploading documents...
                    </span>
                    <span className="text-sm text-blue-600">
                      {uploadProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Important Notice */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <h4 className="font-semibold text-orange-900 mb-2">
                  Important Notice
                </h4>
                <ul className="text-orange-800 text-sm space-y-1">
                  <li>
                    • Only verified Bhutanese nationals can list land for sale
                  </li>
                  <li>
                    • Your documents will be securely verified by our team
                  </li>
                  <li>• Verification typically takes 24-48 hours</li>
                  <li>
                    • All information must match your official citizenship
                    documents
                  </li>
                  <li>• You'll receive an email notification once verified</li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="pt-6 text-center">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2 mx-auto group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>
                    {isSubmitting
                      ? "Submitting Registration..."
                      : "Submit Registration"}
                  </span>
                  <Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                <p className="text-gray-500 text-sm mt-4">
                  By submitting, you agree to our terms and confirm that all
                  information provided is accurate.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success State */}
        {isVerified && (
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              You're All Set!
            </h3>
            <p className="text-gray-600 mb-8">
              Your Bhutanese citizenship has been verified. You can now proceed
              to list your land for sale.
            </p>
            <button
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              onClick={() => {
                window.location.href = "/property-list  ";
              }}
            >
              List Your Land
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BhutaneseRegistrationForm;
