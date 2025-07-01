// Component 3: Business Application Form - Integrated with NFT Minting
import React, { useState, useEffect } from "react";
import {
  KYC_ADDRESS,
  KYC_ABI,
  NFT_ADDRESS,
  NFT_ABI,
} from "@/lib/constant_contracts";
import { ethers, Signer } from "ethers";
import { Building2, Send, CheckCircle, Clock, X } from "lucide-react";

interface KYCData {
  kycId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  residenceAddress: string;
  userType: number;
  status: number;
  submissionTime: Date;
  verificationTime: Date | null;
}

interface BusinessListing {
  listingId: string;
  businessName: string;
  businessDescription: string;
  businessType: string;
  status: number;
  submittedAt: Date;
  verifiedAt: Date | null;
  rejectionReason: string;
}

interface NFTToken {
  tokenId: string;
  residencyType: string;
  taxId: string;
  legalEntityName: string;
  issueDate: Date;
  expiryDate: Date;
  isActive: boolean;
  isValid: boolean;
}

const BusinessApplicationForm = ({ selectedCategory }: any) => {
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    description: "",
    expectedRevenue: "",
    employees: "",
    contactEmail: "",
    phoneNumber: "",
    website: "",
    address: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kycSubmitted, setKycSubmitted] = useState(false);
  const [businessSubmitted, setBusinessSubmitted] = useState(false);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isKycVerified, setIsKycVerified] = useState<boolean>(false);
  const [kycData, setKycData] = useState<KYCData | null>(null);
  const [businessListings, setBusinessListings] = useState<BusinessListing[]>(
    []
  );
  const [nftTokens, setNftTokens] = useState<NFTToken[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(
    null
  );

  // Auto-connect wallet on component mount
  useEffect(() => {
    checkWalletConnection();
  }, []);

  // Poll for verification status updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (walletAddress && (kycSubmitted || businessSubmitted)) {
      interval = setInterval(() => {
        loadUserData(signer, walletAddress);
      }, 10000); // Check every 10 seconds
    }
    return () => clearInterval(interval);
  }, [walletAddress, kycSubmitted, businessSubmitted, signer]);

  // Toast auto-hide effect
  useEffect(() => {
    if (showToast || toast) {
      const timer = setTimeout(() => {
        setShowToast(false);
        setToast(null);
      }, 3000);
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

    await Promise.all([
      loadKYCData(signer, address),
      loadBusinessListings(signer, address),
      loadNFTTokens(signer, address),
    ]);
  };

  const loadKYCData = async (signerInstance: Signer, address: string) => {
    try {
      const kycContract = new ethers.Contract(
        KYC_ADDRESS,
        KYC_ABI,
        signerInstance
      );
      const verified = await kycContract.isKYCVerified(address);
      setIsKycVerified(verified);

      try {
        const userData = await kycContract.getKYCData(address);
        if (userData.kycId > BigInt(0)) {
          setKycData({
            kycId: userData.kycId.toString(),
            fullName: userData.fullName,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            residenceAddress: userData.residenceAddress,
            userType: Number(userData.userType),
            status: Number(userData.status),
            submissionTime: new Date(Number(userData.submissionTime) * 1000),
            verificationTime:
              userData.verificationTime > BigInt(0)
                ? new Date(Number(userData.verificationTime) * 1000)
                : null,
          });
        }
      } catch (error) {
        console.log("No KYC data found for user");
      }
    } catch (error) {
      console.error("Error loading KYC data:", error);
    }
  };

  const loadBusinessListings = async (
    signerInstance: Signer,
    address: string
  ) => {
    try {
      const kycContract = new ethers.Contract(
        KYC_ADDRESS,
        KYC_ABI,
        signerInstance
      );
      const listings = await kycContract.getUserBusinessListings(address);

      const formattedListings: BusinessListing[] = listings.map(
        (listing: any) => ({
          listingId: listing.listingId.toString(),
          businessName: listing.businessName,
          businessDescription: listing.businessDescription,
          businessType: listing.businessType,
          status: Number(listing.status),
          submittedAt: new Date(Number(listing.submittedAt) * 1000),
          verifiedAt:
            Number(listing.verifiedAt) > 0
              ? new Date(Number(listing.verifiedAt) * 1000)
              : null,
          rejectionReason: listing.rejectionReason,
        })
      );

      setBusinessListings(formattedListings);
    } catch (error) {
      console.error("Error loading business listings:", error);
    }
  };

  const loadNFTTokens = async (signerInstance: Signer, address: string) => {
    try {
      const nftContract = new ethers.Contract(
        NFT_ADDRESS,
        NFT_ABI,
        signerInstance
      );
      const tokenIds = await nftContract.getUserOwnedTokens(address);

      const tokens: NFTToken[] = await Promise.all(
        tokenIds.map(async (tokenId: any) => {
          const residencyData = await nftContract.getResidencyData(tokenId);
          const isValid = await nftContract.isResidencyValid(tokenId);

          return {
            tokenId: tokenId.toString(),
            residencyType: residencyData.residencyType.toString(),
            taxId: residencyData.taxId,
            legalEntityName: residencyData.legalEntityName,
            issueDate: new Date(Number(residencyData.issueDate) * 1000),
            expiryDate: new Date(Number(residencyData.expiryDate) * 1000),
            isActive: Boolean(residencyData.isActive),
            isValid: Boolean(isValid),
          };
        })
      );

      setNftTokens(tokens);
    } catch (error) {
      console.error("Error loading NFT tokens:", error);
    }
  };

  const handleInputChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (
      !formData.businessName ||
      !formData.businessType ||
      !formData.description ||
      !formData.contactEmail
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!signer) {
      setShowToast(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const kycContract = new ethers.Contract(KYC_ADDRESS, KYC_ABI, signer);

      // First submit KYC if not already verified
      if (!isKycVerified && !kycSubmitted) {
        await submitKYC(kycContract);
      }

      // Then submit business listing
      if (isKycVerified || kycSubmitted) {
        await submitBusinessListing(kycContract);
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      setToast({
        message: "Failed to submit application. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitKYC = async (kycContract: any) => {
    try {
      const documentHash = ethers.keccak256(
        ethers.toUtf8Bytes(
          formData.businessName + formData.contactEmail + Date.now()
        )
      );

      const userType = selectedCategory === "small" ? 0 : 1; // 0: Individual, 1: Business

      const tx = await kycContract.submitKYC(
        formData.businessName,
        formData.contactEmail,
        formData.phoneNumber || "N/A",
        formData.address || "N/A",
        documentHash,
        userType
      );

      console.log("KYC submission transaction:", tx.hash);
      await tx.wait();

      setKycSubmitted(true);
      setToast({
        message: "KYC submitted successfully! Waiting for verification...",
        type: "success",
      });
    } catch (error) {
      console.error("KYC submission error:", error);
      throw new Error("Failed to submit KYC");
    }
  };

  const submitBusinessListing = async (kycContract: any) => {
    try {
      const documentsHash = ethers.keccak256(
        ethers.toUtf8Bytes(
          formData.businessName +
            formData.description +
            formData.businessType +
            Date.now()
        )
      );

      const tx = await kycContract.submitBusinessListing(
        formData.businessName,
        formData.description,
        formData.businessType,
        documentsHash
      );

      console.log("Business listing transaction:", tx.hash);
      await tx.wait();

      setBusinessSubmitted(true);
      setToast({
        message:
          "Business application submitted successfully! We will review and contact you within 24 hours.",
        type: "success",
      });

      if (walletAddress && signer) {
        await loadBusinessListings(signer, walletAddress);
      }
    } catch (error) {
      console.error("Business listing submission error:", error);
      throw new Error("Failed to submit business listing");
    }
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 1:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  if (!selectedCategory) {
    return (
      <section className="bg-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-blue-50 rounded-2xl p-12">
            <Building2 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Please Select a Business Category
            </h3>
            <p className="text-gray-600">
              Choose your business category above to proceed with the
              application form.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Toast Notification */}
        {showToast && (
          <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
            <p className="font-semibold">
              Please connect your wallet to submit the application
            </p>
          </div>
        )}
        {toast && (
          <div
            className={`fixed top-4 left-1/2 z-50 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-semibold ${
              toast.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {toast.message}
          </div>
        )}

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Complete Your Application
          </h2>
          <p className="text-xl text-gray-600">
            You selected:{" "}
            <span className="font-semibold text-blue-600 capitalize">
              {selectedCategory} Scale Business
            </span>
          </p>
        </div>

        {/* Application Status Dashboard */}
        {(kycData || businessListings.length > 0 || nftTokens.length > 0) && (
          <div className="mb-8 bg-gray-50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Application Status
            </h3>

            {/* KYC Status */}
            {kycData && (
              <div className="mb-4 p-4 bg-white rounded-xl text-gray-800 border">
                <h4 className="font-semibold text-gray-800 mb-2">KYC Status</h4>
                <div className="flex items-center justify-between">
                  <span>Full Name: {kycData.fullName}</span>
                  {getStatusBadge(kycData.status)}
                </div>
              </div>
            )}

            {/* Business Listings */}
            {businessListings.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Business Applications
                </h4>
                {businessListings.map((listing) => (
                  <div
                    key={listing.listingId}
                    className="p-4 bg-white rounded-xl border mb-2"
                  >
                    <div className="flex items-center justify-between">
                      <span>
                        {listing.businessName} ({listing.businessType})
                      </span>
                      {getStatusBadge(listing.status)}
                    </div>
                    {listing.rejectionReason && (
                      <p className="text-red-600 text-sm mt-1">
                        Reason: {listing.rejectionReason}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* NFT Tokens */}
            {nftTokens.length > 0 && (
              <div className="mb-4 text-gray-800">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Your Digital Residency NFTs
                </h4>
                {nftTokens.map((token) => (
                  <div
                    key={token.tokenId}
                    className="p-4 bg-white rounded-xl border mb-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">
                          Tax ID: {token.taxId}
                        </span>
                        {token.legalEntityName && (
                          <p className="text-sm text-gray-600">
                            {token.legalEntityName}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            token.isValid
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {token.isValid ? "Valid" : "Expired"}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          Expires: {token.expiryDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Application Form */}
        <div className="bg-gray-50 text-gray-800 rounded-2xl p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your business name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Business Type *
              </label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select business type</option>
                <option value="technology">Technology</option>
                <option value="consulting">Consulting</option>
                <option value="ecommerce">E-commerce</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="services">Services</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Business Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your business and what products/services you offer"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contact Email *
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+1234567890"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Business Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your business address"
            />
          </div>

          <div className="pt-6 text-center">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-blue-900 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:bg-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2 mx-auto group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </span>
              <Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <p className="text-gray-500 text-sm mt-4">
              We'll review your application and contact you within 24 hours.
              Once verified, you'll automatically receive your digital residency
              NFT.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessApplicationForm;
