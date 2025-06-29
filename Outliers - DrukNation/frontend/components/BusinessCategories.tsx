import { CheckCircle, TrendingUp, Target, Crown } from "lucide-react";
import {
  KYC_ADDRESS,
  KYC_ABI,
  NFT_ADDRESS,
  NFT_ABI,
} from "@/lib/constant_contracts";
import { ethers, Signer } from "ethers";
import { useState, useEffect } from "react";

interface Category {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  features: string[];
  price: string;
  popular: boolean;
  color: string;
}

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

interface BusinessCategoriesProps {
  onCategorySelect: (id: string) => void;
  selectedCategory: string;
}

const BusinessCategories = ({
  onCategorySelect,
  selectedCategory,
}: BusinessCategoriesProps) => {
  const [signer, setSigner] = useState<Signer | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isKycVerified, setIsKycVerified] = useState<boolean>(false);
  const [kycData, setKycData] = useState<KYCData | null>(null);
  const [businessListings, setBusinessListings] = useState<BusinessListing[]>(
    []
  );
  const [nftTokens, setNftTokens] = useState<NFTToken[]>([]);

  const categories: Category[] = [
    {
      id: "small",
      title: "Small Scale Business",
      subtitle: "Perfect for startups and freelancers",
      icon: Target,
      features: [
        "Annual revenue up to $100,000",
        "Up to 5 employees",
        "Simplified tax filing",
        "Basic digital banking",
        "Online business registration",
      ],
      price: "$299/year",
      popular: false,
      color: "from-green-500 to-emerald-600",
    },
    {
      id: "medium",
      title: "Mid Scale Business",
      subtitle: "For growing companies",
      icon: TrendingUp,
      features: [
        "Annual revenue $100K - $1M",
        "Up to 50 employees",
        "Advanced tax benefits",
        "Premium banking solutions",
        "Priority customer support",
      ],
      price: "$599/year",
      popular: true,
      color: "from-blue-500 to-indigo-600",
    },
    {
      id: "large",
      title: "Large Scale Business",
      subtitle: "For established enterprises",
      icon: Crown,
      features: [
        "Annual revenue above $1M",
        "Unlimited employees",
        "Custom tax optimization",
        "Dedicated account manager",
        "White-glove onboarding",
      ],
      price: "Custom pricing",
      popular: false,
      color: "from-purple-500 to-violet-600",
    },
  ];

  const loadUserData = async (signer: Signer, address: string) => {
    await Promise.all([
      loadKYCData(signer, address),
      loadBusinessListings(signer, address),
      loadNFTTokens(signer, address),
    ]);
  };

  const loadKYCData = async (signerInstance: Signer, address: string) => {
    if (!signerInstance || !address) return;
    try {
      const kycContract = new ethers.Contract(
        KYC_ADDRESS,
        KYC_ABI,
        signerInstance
      );

      // Check if user is KYC verified
      const verified = await kycContract.isKYCVerified(address);
      setIsKycVerified(verified);

      // Try to get KYC data
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

  // Add business listings loading function
  const loadBusinessListings = async (
    signerInstance: Signer,
    address: string
  ) => {
    if (!signerInstance || !address) return;
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

  // Add NFT tokens loading function
  const loadNFTTokens = async (signerInstance: Signer, address: string) => {
    if (!signerInstance || !address) return;
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
            residencyType: residencyData.residencyType,
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

      // Load user data after connecting
      await loadUserData(signer, address);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet");
    }
  };

  const WalletConnectionButton = () => (
    <div className="mb-8 text-center">
      {!walletAddress ? (
        <button
          onClick={connectWallet}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-green-800 font-semibold">
            Wallet Connected: {walletAddress.slice(0, 6)}...
            {walletAddress.slice(-4)}
          </p>
          {isKycVerified && (
            <p className="text-green-600 text-sm mt-1">✅ KYC Verified</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <section className="bg-gray-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Choose Your Business Category
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the category that best fits your business size and goals. You
            can always upgrade as your business grows.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            const isSelected = selectedCategory === category.id;

            return (
              <div
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 ${
                  isSelected ? "ring-4 ring-blue-500 scale-105" : ""
                }`}
              >
                {category.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div
                    className={`bg-gradient-to-r ${category.color} p-4 rounded-xl w-fit mx-auto mb-4`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {category.title}
                  </h3>
                  <p className="text-gray-600">{category.subtitle}</p>
                </div>

                <div className="space-y-4 mb-8">
                  {category.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="text-center border-t pt-6">
                  <div className="text-3xl font-bold text-gray-900 mb-4">
                    {category.price}
                  </div>
                  <button
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    {isSelected ? "Selected" : "Select This Plan"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BusinessCategories;
