"use client";
import React, { useState, useEffect } from "react";
import { ethers, Signer } from "ethers";
import {
  MapPin,
  Upload,
  FileText,
  Camera,
  DollarSign,
  Home,
  Building,
  Wheat,
  Factory,
  Map,
  CheckCircle,
  X,
  Plus,
  Trash2,
  Info,
  AlertCircle,
  Send,
} from "lucide-react";

import { MAR_ABI, MAR_ADDRESS } from "@/lib/constant_contracts";

// Land types matching the contract enum
const LAND_TYPES = {
  0: { name: "Residential", icon: Home, color: "blue" },
  1: { name: "Commercial", icon: Building, color: "green" },
  2: { name: "Agricultural", icon: Wheat, color: "yellow" },
  3: { name: "Industrial", icon: Factory, color: "purple" },
};

interface LandListingFormData {
  landTitle: string;
  description: string;
  location: string;
  coordinates: string;
  area: string;
  landType: number;
  price: string;
  images: File[];
  documents: File[];
}

const BhutanLandListingForm = () => {
  const [formData, setFormData] = useState<LandListingFormData>({
    landTitle: "",
    description: "",
    location: "",
    coordinates: "",
    area: "",
    landType: 0,
    price: "",
    images: [],
    documents: [],
  });

  const [signer, setSigner] = useState<Signer | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(
    null
  );
  const [showPreview, setShowPreview] = useState(false);

  // Auto-connect wallet on component mount
  useEffect(() => {
    checkWalletConnection();
  }, []);

  // Toast auto-hide effect
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

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
        await checkVerificationStatus(signer, address);
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!(window as any).ethereum) {
        setToast({ message: "Please install MetaMask!", type: "error" });
        return;
      }

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setSigner(signer);
      setWalletAddress(address);
      await checkVerificationStatus(signer, address);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setToast({ message: "Failed to connect wallet", type: "error" });
    }
  };

  const checkVerificationStatus = async (signer: Signer, address: string) => {
    try {
      const marketplaceContract = new ethers.Contract(
        MAR_ADDRESS,
        MAR_ABI,
        signer
      );

      const verified = await marketplaceContract.isVerifiedBhutaneseNational(
        address
      );
      setIsVerified(verified);

      if (!verified) {
        setToast({
          message: "You must be a verified Bhutanese national to list land",
          type: "warning",
        });
      }
    } catch (error) {
      console.error("Error checking verification status:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "landType" ? parseInt(value) : value,
    }));
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "images" | "documents"
  ) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        [type]: [...prev[type], ...fileArray],
      }));
    }
  };

  const removeFile = (index: number, type: "images" | "documents") => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const simulateFileUpload = async (
    files: File[],
    type: string
  ): Promise<string> => {
    setUploadProgress(0);

    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Generate a mock hash based on file content
    const fileNames = files.map((f) => f.name).join(",");
    const hash = ethers.keccak256(
      ethers.toUtf8Bytes(`${type}-${fileNames}-${Date.now()}`)
    );
    setUploadProgress(0);
    return hash;
  };

  const validateForm = (): boolean => {
    if (!formData.landTitle.trim()) {
      setToast({ message: "Land title is required", type: "error" });
      return false;
    }

    if (!formData.description.trim()) {
      setToast({ message: "Description is required", type: "error" });
      return false;
    }

    if (!formData.location.trim()) {
      setToast({ message: "Location is required", type: "error" });
      return false;
    }

    if (!formData.coordinates.trim()) {
      setToast({ message: "GPS coordinates are required", type: "error" });
      return false;
    }

    // Validate coordinates format (basic validation)
    const coordRegex = /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/;
    if (!coordRegex.test(formData.coordinates.trim())) {
      setToast({
        message:
          "Invalid coordinates format. Use: latitude, longitude (e.g., 27.4728, 89.6390)",
        type: "error",
      });
      return false;
    }

    if (!formData.area || parseFloat(formData.area) <= 0) {
      setToast({ message: "Valid area is required", type: "error" });
      return false;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setToast({ message: "Valid price is required", type: "error" });
      return false;
    }

    if (formData.images.length === 0) {
      setToast({
        message: "At least one land image is required",
        type: "error",
      });
      return false;
    }

    if (formData.documents.length === 0) {
      setToast({ message: "Legal documents are required", type: "error" });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!signer) {
      setToast({ message: "Please connect your wallet", type: "error" });
      return;
    }

    if (!isVerified) {
      setToast({
        message: "You must be a verified Bhutanese national to list land",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload files and get hashes
      setToast({ message: "Uploading images...", type: "info" });
      const imageHashes = await Promise.all(
        formData.images.map(async (_, index) => {
          const batch = formData.images.slice(index, index + 1);
          return await simulateFileUpload(batch, "image");
        })
      );

      setToast({ message: "Uploading documents...", type: "info" });
      const documentHash = await simulateFileUpload(
        formData.documents,
        "document"
      );

      // Convert price to wei
      const priceInWei = ethers.parseEther(formData.price);

      // Convert area to square feet (assuming input is in acres, convert to sq ft)
      const areaInSqFt = Math.floor(parseFloat(formData.area) * 43560); // 1 acre = 43,560 sq ft

      const marketplaceContract = new ethers.Contract(
        MAR_ADDRESS,
        MAR_ABI,
        signer
      );

      setToast({ message: "Listing land on blockchain...", type: "info" });

      const tx = await marketplaceContract.listLand(
        formData.landTitle,
        formData.description,
        formData.location,
        formData.coordinates.trim(),
        areaInSqFt,
        formData.landType,
        priceInWei,
        imageHashes,
        documentHash
      );

      console.log("Land listing transaction:", tx.hash);
      setToast({
        message: "Confirming transaction... Please wait.",
        type: "info",
      });

      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);

      setToast({
        message:
          "Land listed successfully! Your land is now available for purchase.",
        type: "success",
      });

      // Reset form
      setFormData({
        landTitle: "",
        description: "",
        location: "",
        coordinates: "",
        area: "",
        landType: 0,
        price: "",
        images: [],
        documents: [],
      });
    } catch (error: any) {
      console.error("Error listing land:", error);

      let errorMessage = "Failed to list land. Please try again.";
      if (error.reason) {
        errorMessage = error.reason;
      } else if (error.message) {
        if (error.message.includes("user rejected")) {
          errorMessage = "Transaction was cancelled by user.";
        } else if (error.message.includes("insufficient funds")) {
          errorMessage = "Insufficient funds for transaction.";
        }
      }

      setToast({ message: errorMessage, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const LandTypeIcon =
    LAND_TYPES[formData.landType as keyof typeof LAND_TYPES]?.icon || Home;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4">
      {/* Toast Notifications */}
      {toast && (
        <div
          className={`fixed top-4 left-1/2 z-50 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-semibold ${
            toast.type === "success"
              ? "bg-green-600"
              : toast.type === "error"
              ? "bg-red-600"
              : toast.type === "warning"
              ? "bg-yellow-600"
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
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <MapPin className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            List Your Land for Sale
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            List your land on Bhutan's premier land marketplace for e-residents
          </p>
        </div>

        {/* Wallet Connection */}
        {!walletAddress && (
          <div className="bg-white rounded-2xl p-8 mb-8 text-center shadow-lg">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Connect Your Wallet
            </h3>
            <p className="text-gray-600 mb-6">
              Connect your MetaMask wallet to list your land
            </p>
            <button
              onClick={connectWallet}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        )}

        {/* Verification Status */}
        {walletAddress && (
          <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Wallet Connected
                  </p>
                  <p className="text-sm text-gray-600">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </p>
                </div>
              </div>
              <div>
                {isVerified ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-red-600">
                    <X className="w-5 h-5" />
                    <span className="font-semibold">Not Verified</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Land Listing Form */}
        {walletAddress && isVerified && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Land Details
            </h3>

            <div className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Info className="w-5 h-5 mr-2" />
                  Basic Information
                </h4>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Land Title *
                    </label>
                    <input
                      type="text"
                      name="landTitle"
                      value={formData.landTitle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., Prime Commercial Plot in Thimphu"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Land Type *
                    </label>
                    <select
                      name="landType"
                      value={formData.landType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {Object.entries(LAND_TYPES).map(
                        ([value, { name, icon: Icon }]) => (
                          <option key={value} value={value}>
                            {name}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Describe your land, its features, nearby amenities, and any special characteristics..."
                  />
                </div>
              </div>

              {/* Location Details */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Map className="w-5 h-5 mr-2" />
                  Location Details
                </h4>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location Address *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., Norzin Lam, Thimphu, Bhutan"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      GPS Coordinates *
                    </label>
                    <input
                      type="text"
                      name="coordinates"
                      value={formData.coordinates}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="27.4728, 89.6390"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Format: latitude, longitude
                    </p>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Property Details
                </h4>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Area (in acres) *
                    </label>
                    <input
                      type="number"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 2.5"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Area will be converted to square feet
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price (ETH) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.001"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 10.5"
                    />
                  </div>
                </div>
              </div>

              {/* File Uploads */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Media & Documents
                </h4>

                {/* Images Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Land Images *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition-colors">
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(e, "images")}
                      multiple
                      accept="image/*"
                      className="hidden"
                      id="images"
                    />
                    <label htmlFor="images" className="cursor-pointer">
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        Upload Land Images
                      </p>
                      <p className="text-gray-600 mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-500">
                        JPG, PNG files (max 10MB each)
                      </p>
                    </label>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.images.map((file, index) => (
                        <div key={index} className="relative">
                          <div className="bg-gray-100 rounded-lg p-3 text-center">
                            <Camera className="w-6 h-6 text-gray-500 mx-auto mb-1" />
                            <p className="text-xs text-gray-600 truncate">
                              {file.name}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFile(index, "images")}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Documents Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Legal Documents *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition-colors">
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(e, "documents")}
                      multiple
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      id="documents"
                    />
                    <label htmlFor="documents" className="cursor-pointer">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        Upload Legal Documents
                      </p>
                      <p className="text-gray-600 mb-2">
                        Land ownership papers, permits, etc.
                      </p>
                      <p className="text-sm text-gray-500">
                        PDF, DOC files (max 10MB each)
                      </p>
                    </label>
                  </div>

                  {formData.documents.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {formData.documents.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-gray-500" />
                            <span className="text-sm text-gray-700">
                              {file.name}
                            </span>
                          </div>
                          <button
                            onClick={() => removeFile(index, "documents")}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Progress */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-900">
                      Uploading files...
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

              {/* Preview Section */}
              {(formData.landTitle || formData.description) && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Preview
                  </h4>
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <LandTypeIcon className="w-5 h-5 text-gray-600" />
                        <span className="text-sm text-gray-600">
                          {
                            LAND_TYPES[
                              formData.landType as keyof typeof LAND_TYPES
                            ]?.name
                          }
                        </span>
                      </div>
                      {formData.price && (
                        <span className="text-lg font-bold text-green-600">
                          {formData.price} ETH
                        </span>
                      )}
                    </div>
                    <h5 className="font-semibold text-gray-900 mb-2">
                      {formData.landTitle || "Land Title"}
                    </h5>
                    <p className="text-gray-600 text-sm mb-3">
                      {formData.description ||
                        "Land description will appear here..."}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      {formData.location || "Location"}
                      {formData.area && (
                        <span className="ml-3">• {formData.area} acres</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Important Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-2">
                      Important Notice
                    </h4>
                    <ul className="text-amber-800 text-sm space-y-1">
                      <li>
                        • Ensure all information is accurate before listing
                      </li>
                      <li>• Your land will be visible to all e-residents</li>
                      <li>• Transaction fees apply (2.5% platform fee)</li>
                      <li>• Upload clear, high-quality images and documents</li>
                      <li>
                        • Verification may be required for high-value properties
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 text-center">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isVerified}
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2 mx-auto group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>
                    {isSubmitting ? "Listing Land..." : "List Land for Sale"}
                  </span>
                  <Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  By listing your land, you agree to our{" "}
                  <a href="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default BhutanLandListingForm;
