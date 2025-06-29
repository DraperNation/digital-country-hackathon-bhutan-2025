"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  User,
  Badge,
  Eye,
  Heart,
  Share2,
  Wallet,
} from "lucide-react";
import { ethers, Signer } from "ethers";
import {
  KYC_ADDRESS,
  KYC_ABI,
  NFT_ADDRESS,
  NFT_ABI,
  MAR_ADDRESS,
  MAR_ABI,
} from "@/lib/constant_contracts";

// Types based on the smart contract
interface LandListing {
  landId: number;
  owner: string;
  landTitle: string;
  description: string;
  location: string;
  coordinates: string;
  area: number;
  landType: "Residential" | "Commercial" | "Agricultural" | "Industrial";
  price: string; // in wei, we'll convert to ETH
  status: "Available" | "Sold" | "Delisted";
  imageHashes: string[];
  documentHash: string;
  listedAt: number;
  soldAt: number;
  soldTo: string;
  isVerified: boolean;
}

const PropertyListings: React.FC = () => {
  const [properties, setProperties] = useState<LandListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [account, setAccount] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<LandListing | null>(
    null
  );

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      setIsConnecting(true);
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        setSigner(signer);
        setAccount(address);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      } finally {
        setIsConnecting(false);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };
  useEffect(() => {
    const initializeApp = async () => {
      // Auto-connect if previously connected
      if (typeof window.ethereum !== "undefined") {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            setSigner(signer);
            setAccount(address);
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };

    initializeApp();
  }, []);

  const fetchAvailableLands = async () => {
    if (!signer) return;

    setIsLoading(true);
    try {
      const contract = new ethers.Contract(MAR_ADDRESS, MAR_ABI, signer);
      const availableLands = await contract.getAvailableLands();

      // Convert contract data to component format
      const formattedLands: LandListing[] = availableLands.map((land: any) => ({
        landId: Number(land.landId),
        owner: land.owner,
        landTitle: land.landTitle,
        description: land.description,
        location: land.location,
        coordinates: land.coordinates,
        area: Number(land.area),
        landType: getLandTypeFromEnum(Number(land.landType)),
        price: land.price.toString(),
        status: getStatusFromEnum(Number(land.status)),
        imageHashes: land.imageHashes,
        documentHash: land.documentHash,
        listedAt: Number(land.listedAt) * 1000, // Convert to milliseconds
        soldAt: Number(land.soldAt) * 1000,
        soldTo: land.soldTo,
        isVerified: land.isVerified,
      }));

      setProperties(formattedLands);
    } catch (error) {
      console.error("Error fetching available lands:", error);
      alert("Failed to fetch property listings");
    } finally {
      setIsLoading(false);
    }
  };

  const getLandTypeFromEnum = (enumValue: number): string => {
    const types = ["Residential", "Commercial", "Agricultural", "Industrial"];
    return types[enumValue] || "Unknown";
  };

  const getStatusFromEnum = (enumValue: number): string => {
    const statuses = ["Available", "Sold", "Delisted"];
    return statuses[enumValue] || "Unknown";
  };

  useEffect(() => {
    if (signer) {
      fetchAvailableLands();
    }
  }, [signer]);

  // 8. Add function to check if user is eligible to purchase
  const checkEligibility = async (): Promise<boolean> => {
    if (!signer || !account) return false;

    try {
      const contract = new ethers.Contract(KYC_ADDRESS, KYC_ABI, signer);
      return await contract.isResidencyValid(account);
    } catch (error) {
      console.error("Error checking eligibility:", error);
      return false;
    }
  };

  const formatPrice = (priceWei: string): string => {
    const priceEth = parseFloat(priceWei) / 1e18;
    return `${priceEth.toFixed(2)} ETH`;
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString();
  };

  const formatArea = (area: number): string => {
    return `${area.toLocaleString()} sq ft`;
  };

  const shortenAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getLandTypeColor = (type: string): string => {
    switch (type) {
      case "Residential":
        return "bg-blue-100 text-blue-800";
      case "Commercial":
        return "bg-green-100 text-green-800";
      case "Agricultural":
        return "bg-yellow-100 text-yellow-800";
      case "Industrial":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const renderWalletConnection = () => {
    if (!account) {
      return (
        <div className="lg:w-1/4">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Connect Wallet
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Connect your wallet to view and purchase properties
            </p>
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50"
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          </div>
        </div>
      );
    }

    const handlePurchase = async (property: LandListing) => {
      if (!signer || !account) {
        alert("Please connect your wallet first");
        return;
      }

      try {
        // Check eligibility first
        const isEligible = await checkEligibility();
        if (!isEligible) {
          alert("You must be a verified e-resident to purchase land");
          return;
        }

        const contract = new ethers.Contract(MAR_ADDRESS, MAR_ABI, signer);

        // Call purchaseLand function
        const tx = await contract.purchaseLand(property.landId, {
          value: property.price,
        });

        alert(`Transaction submitted: ${tx.hash}`);

        // Wait for confirmation
        const receipt = await tx.wait();
        alert(
          `Purchase successful! Transaction confirmed: ${receipt.transactionHash}`
        );

        // Refresh the listings
        fetchAvailableLands();
      } catch (error: any) {
        console.error("Error purchasing land:", error);

        // Handle specific error messages
        if (error.reason) {
          alert(`Purchase failed: ${error.reason}`);
        } else if (error.message?.includes("user rejected")) {
          alert("Transaction cancelled by user");
        } else {
          alert("Purchase failed. Please try again.");
        }
      }
    };

    if (isLoading) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading properties...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Bhutan Property Marketplace
            </h1>
            <p className="mt-2 text-gray-600">
              Discover premium land opportunities in the Kingdom of Bhutan
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Account Info
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Connected Address
                    </label>
                    <p className="text-sm text-gray-600 break-all">{account}</p>
                  </div>
                  <button
                    onClick={fetchAvailableLands}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 font-medium"
                  >
                    Refresh Listings
                  </button>
                </div>
              </div>
            </div>
            {/* Properties Grid */}
            <div className="lg:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  {properties.length}{" "}
                  {properties.length === 1 ? "property" : "properties"} found
                </p>
              </div>

              {properties.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🏔️</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No properties found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your filters to find more properties.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {properties.map((property) => (
                    <div
                      key={property.landId}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
                    >
                      {/* Property Image */}
                      <div className="h-48 bg-gradient-to-br from-green-100 to-blue-100 relative">
                        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                          <div className="text-center">
                            <div className="text-4xl mb-2">🏞️</div>
                            <p className="text-sm">Property Image</p>
                          </div>
                        </div>
                        {property.isVerified && (
                          <div className="absolute top-3 left-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <Badge className="w-3 h-3 mr-1" />
                              Verified
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Property Details */}
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                            {property.landTitle}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLandTypeColor(
                              property.landType
                            )}`}
                          >
                            {property.landType}
                          </span>
                        </div>

                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">{property.location}</span>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {property.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-gray-500">Area:</span>
                            <span className="ml-1 font-medium">
                              {formatArea(property.area)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Listed:</span>
                            <span className="ml-1 font-medium">
                              {formatDate(property.listedAt)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center text-xs text-gray-500 mb-4">
                          <User className="w-3 h-3 mr-1" />
                          <span>Owner: {shortenAddress(property.owner)}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-bold text-gray-900">
                              {formatPrice(property.price)}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                              <Heart className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                              <Share2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setSelectedProperty(property)}
                              className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => handlePurchase(property)}
                          className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
                        >
                          Purchase Property
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Property Detail Modal */}
        {selectedProperty && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedProperty.landTitle}
                  </h2>
                  <button
                    onClick={() => setSelectedProperty(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="h-64 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg mb-6 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-6xl mb-2">🏞️</div>
                    <p>Property Images</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Description
                    </h3>
                    <p className="text-gray-700">
                      {selectedProperty.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Location</h4>
                      <p className="text-gray-700">
                        {selectedProperty.location}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Coordinates</h4>
                      <p className="text-gray-700">
                        {selectedProperty.coordinates}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Area</h4>
                      <p className="text-gray-700">
                        {formatArea(selectedProperty.area)}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Type</h4>
                      <p className="text-gray-700">
                        {selectedProperty.landType}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-3xl font-bold text-gray-900">
                          {formatPrice(selectedProperty.price)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Owner: {shortenAddress(selectedProperty.owner)}
                        </p>
                      </div>
                      <button
                        onClick={() => handlePurchase(selectedProperty)}
                        className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
                      >
                        Purchase Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Return the main render
  return renderWalletConnection();
};

export default PropertyListings;
