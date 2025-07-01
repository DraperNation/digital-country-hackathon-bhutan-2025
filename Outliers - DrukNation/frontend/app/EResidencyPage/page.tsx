"use client";

import { useState, useEffect } from "react";
import { ethers, BrowserProvider, JsonRpcSigner } from "ethers";
import { ADDRESS, ABI } from "@/lib/constant_contracts";

// Types
type KYCStatus = "Pending" | "Verified" | "Rejected" | "Suspended";
type UserType = "Individual" | "Business";
type ResidencyType = "Individual" | "Business" | "PremiumBusiness";

interface KYCData {
  kycId: bigint;
  userAddress: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  residenceAddress: string;
  documentHash: string;
  userType: number;
  status: number;
  submissionTime: bigint;
  verificationTime: bigint;
  verifiedBy: string;
}

interface Listing {
  listingId: bigint;
  seller: string;
  residencyType: number;
  price: bigint;
  description: string;
  documentsHash: string;
  status: number;
  createdAt: bigint;
  expiresAt: bigint;
  buyer: string;
  soldAt: bigint;
  title: string;
}

const EResidencyPage = () => {
  const [isWalletConnected, setWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: string }>({
    message: "",
    type: "",
  });

  const [activeTab, setActiveTab] = useState<string>("kyc");
  const [kycData, setKycData] = useState<KYCData | null>(null);
  const [isKycVerified, setIsKycVerified] = useState<boolean>(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // Loading states
  const [isKycPending, setIsKycPending] = useState(false);
  const [isPurchasePending, setIsPurchasePending] = useState(false);

  // KYC Form State
  const [kycForm, setKycForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    residenceAddress: "",
    documentHash: "",
    userType: "Individual",
    profileImage: null as File | null, // Add this
  });
  // Purchase Form State
  const [purchaseForm, setPurchaseForm] = useState({
    taxId: "",
    legalEntityName: "",
    tokenURI: "",
  });

  // Sample listings data (replace with actual contract data)
  const sampleListings: Listing[] = [
    {
      listingId: BigInt(1),
      seller: "0x1234567890123456789012345678901234567890",
      residencyType: 0,
      price: ethers.parseEther("0.1"),
      description:
        "Perfect for freelancers and digital nomads looking for tax benefits.",
      documentsHash: "QmExample1",
      status: 1,
      createdAt: BigInt(Math.floor(Date.now() / 1000)),
      expiresAt: BigInt(Math.floor(Date.now() / 1000 + 86400 * 30)),
      buyer: "0x0000000000000000000000000000000000000000",
      soldAt: BigInt(0),
      title: "Individual Residency",
    },
    {
      listingId: BigInt(2),
      seller: "0x1234567890123456789012345678901234567890",
      residencyType: 1,
      price: ethers.parseEther("0.5"),
      description:
        "Ideal for small to medium businesses seeking international presence.",
      documentsHash: "QmExample2",
      status: 1,
      createdAt: BigInt(Math.floor(Date.now() / 1000)),
      expiresAt: BigInt(Math.floor(Date.now() / 1000 + 86400 * 30)),
      buyer: "0x0000000000000000000000000000000000000000",
      soldAt: BigInt(0),
      title: "Business Residency",
    },
    {
      listingId: BigInt(3),
      seller: "0x1234567890123456789012345678901234567890",
      residencyType: 2,
      price: ethers.parseEther("1.0"),
      description: "Premium package with additional services and benefits.",
      documentsHash: "QmExample3",
      status: 1,
      createdAt: BigInt(Math.floor(Date.now() / 1000)),
      expiresAt: BigInt(Math.floor(Date.now() / 1000 + 86400 * 30)),
      buyer: "0x0000000000000000000000000000000000000000",
      soldAt: BigInt(0),
      title: "Premium Business",
    },
  ];

  useEffect(() => {
    loadWallet();
  }, []);

  useEffect(() => {
    if (walletAddress) {
      loadKYCData();
    }
  }, [walletAddress]);

  const showAlert = (message: string, type: string = "info") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 3000);
  };

  const loadWallet = async () => {
    const storedAddress = sessionStorage.getItem("walletAddress");
    if (storedAddress && typeof (window as any).ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        if (address === storedAddress) {
          setWalletConnected(true);
          setWalletAddress(address);
          setProvider(provider);
          setSigner(signer);
        }
      } catch (error) {
        console.error("Error reconnecting wallet:", error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof (window as any).ethereum !== "undefined") {
      try {
        await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });

        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        // Check the network and switch to Sepolia if needed
        const network = await provider.getNetwork();
        if (network.chainId !== BigInt(11155111)) {
          // Sepolia chainId
          await (window as any).ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xaa36a7" }], // Sepolia hex
          });
        }

        setWalletConnected(true);
        setWalletAddress(address);
        setProvider(provider);
        setSigner(signer);
        sessionStorage.setItem("walletAddress", address);

        showAlert("Wallet connected successfully!", "success");
      } catch (error) {
        console.error("Error connecting wallet:", error);
        showAlert("Failed to connect wallet", "error");
      }
    } else {
      showAlert("MetaMask is not installed!", "error");
    }
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress("");
    setProvider(null);
    setSigner(null);
    setKycData(null);
    setIsKycVerified(false);
    sessionStorage.removeItem("walletAddress");
    showAlert("Wallet disconnected", "info");
  };

  const loadKYCData = async () => {
    if (!signer || !walletAddress) return;

    try {
      const contract = new ethers.Contract(ADDRESS, ABI, signer);

      // Check if user is KYC verified
      const verified = await contract.isKYCVerified(walletAddress);
      setIsKycVerified(verified);

      // Try to get KYC data
      try {
        const userData = await contract.getKYCData(walletAddress);
        if (userData.kycId > BigInt(0)) {
          setKycData(userData);
        }
      } catch (error) {
        // User might not have KYC data yet
        console.log("No KYC data found for user");
      }
    } catch (error) {
      console.error("Error loading KYC data:", error);
    }
  };
  const generateIDCardImage = async (
    profileImageUrl: string,
    userData: {
      fullName: string;
      userType: string;
      kycId: string;
    }
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }

      // Set canvas size for ID card dimensions
      canvas.width = 400;
      canvas.height = 250;

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 400, 250);
      gradient.addColorStop(0, "#1E40AF"); // Blue
      gradient.addColorStop(1, "#3B82F6"); // Lighter blue
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 400, 250);

      // Add border
      ctx.strokeStyle = "#F59E0B"; // Gold border
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, 396, 246);

      // Add header
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 18px Arial";
      ctx.textAlign = "center";
      ctx.fillText("KINGDOM OF BHUTAN", 200, 30);
      ctx.font = "bold 14px Arial";
      ctx.fillText("E-RESIDENCY CERTIFICATE", 200, 50);

      // Load and draw profile image
      const profileImg = new Image();
      profileImg.crossOrigin = "anonymous";

      profileImg.onload = () => {
        // Draw profile image (circular)
        ctx.save();
        ctx.beginPath();
        ctx.arc(80, 120, 50, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(profileImg, 30, 70, 100, 100);
        ctx.restore();

        // Add profile border
        ctx.strokeStyle = "#F59E0B";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(80, 120, 50, 0, 2 * Math.PI);
        ctx.stroke();

        // Add text information
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "left";
        ctx.fillText("Name:", 160, 90);
        ctx.font = "14px Arial";
        ctx.fillText(userData.fullName, 160, 110);

        ctx.font = "bold 14px Arial";
        ctx.fillText("Type:", 160, 135);
        ctx.font = "12px Arial";
        ctx.fillText(userData.userType, 160, 150);

        ctx.font = "bold 14px Arial";
        ctx.fillText("ID:", 160, 175);
        ctx.font = "12px Arial";
        ctx.fillText(`BT-${userData.kycId}`, 160, 190);

        ctx.font = "bold 14px Arial";
        ctx.fillText("Issued:", 160, 215);
        ctx.font = "12px Arial";
        ctx.fillText(new Date().toLocaleDateString(), 160, 230);

        // Convert canvas to blob and upload
        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              const file = new File([blob], "id-card.png", {
                type: "image/png",
              });
              const result = await uploadToPinata(file);
              resolve(result.ipfsUrl);
            } catch (error) {
              reject(error);
            }
          } else {
            reject(new Error("Failed to create image blob"));
          }
        }, "image/png");
      };

      profileImg.onerror = () => {
        reject(new Error("Failed to load profile image"));
      };

      // Convert IPFS URL to gateway URL for loading
      const gatewayUrl = profileImageUrl.replace(
        "ipfs://",
        "https://aqua-rare-worm-454.mypinata.cloud/ipfs/"
      );
      profileImg.src = gatewayUrl;
    });
  };
  const handleKycSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!signer) return;
    setIsKycPending(true);

    try {
      let documentHash = kycForm.documentHash;

      // Generate ID card if profile image is provided
      if (kycForm.profileImage) {
        // First upload the profile image to get its URL
        const profileImageResult = await uploadToPinata(kycForm.profileImage);

        // Generate ID card image using the profile image
        const idCardImageUrl = await generateIDCardImage(
          profileImageResult.ipfsUrl,
          {
            fullName: kycForm.fullName,
            userType: kycForm.userType,
            kycId: `${Date.now()}`, // Temporary ID, will be replaced with actual KYC ID
          }
        );

        documentHash = idCardImageUrl; // Store the ID card image URL
      }

      const contract = new ethers.Contract(ADDRESS, ABI, signer);

      // Submit KYC with ID card image hash
      const tx = await contract.submitKYC(
        kycForm.fullName,
        kycForm.email,
        kycForm.phoneNumber,
        kycForm.residenceAddress,
        documentHash,
        kycForm.userType === "Individual" ? 0 : 1
      );

      await tx.wait();
      showAlert(
        "KYC submitted successfully with ID card! Metadata will be created upon approval.",
        "success"
      );
      await loadKYCData();
    } catch (error) {
      console.error("KYC submission failed:", error);
      showAlert("KYC submission failed", "error");
    } finally {
      setIsKycPending(false);
    }
  };

  const handlePurchase = async (listing: Listing) => {
    if (!signer || !isKycVerified) return;

    setIsPurchasePending(true);
    try {
      const contract = new ethers.Contract(ADDRESS, ABI, signer);

      const tx = await contract.purchaseResidency(
        listing.listingId,
        purchaseForm.taxId,
        purchaseForm.legalEntityName,
        purchaseForm.tokenURI,
        { value: listing.price }
      );

      await tx.wait();
      showAlert("Residency purchased successfully!", "success");
    } catch (error) {
      console.error("Purchase failed:", error);
      showAlert("Purchase failed", "error");
    } finally {
      setIsPurchasePending(false);
    }
  };
  const uploadToPinata = async (
    file: File
  ): Promise<{ ipfsUrl: string; gatewayUrl: string }> => {
    try {
      const formDataObj = new FormData();
      formDataObj.append("file", file);

      const pinataMetadata = JSON.stringify({
        name: "Residency NFT Image",
      });
      formDataObj.append("pinataMetadata", pinataMetadata);

      const pinataOptions = JSON.stringify({
        cidVersion: 1,
      });
      formDataObj.append("pinataOptions", pinataOptions);

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
          },
          body: formDataObj,
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error?.details || "Failed to upload to Pinata"
        );
      }

      const data = await res.json();
      return {
        ipfsUrl: `ipfs://${data.IpfsHash}`,
        gatewayUrl: `https://aqua-rare-worm-454.mypinata.cloud/ipfs/${data.IpfsHash}`,
      };
    } catch (err: unknown) {
      console.error("Pinata upload error:", err);
      throw new Error(
        `Failed to upload image to Pinata: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  //   fullName: string,
  //   userType: string,
  //   imageUrl: string
  // ): Promise<string> => {
  //   try {
  //     const metadata = createNFTMetadata(fullName, userType, imageUrl);

  //     const res = await fetch(
  //       "https://api.pinata.cloud/pinning/pinJSONToIPFS",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
  //         },
  //         body: JSON.stringify({
  //           pinataContent: metadata,
  //           pinataMetadata: {
  //             name: `${fullName}-residency-metadata`,
  //             keyvalues: {
  //               type: "nft-metadata",
  //               user: fullName,
  //               country: "bhutan",
  //             },
  //           },
  //         }),
  //       }
  //     );

  //     if (!res.ok) {
  //       const errorData = await res.json();
  //       throw new Error(
  //         errorData.error?.details || "Failed to upload metadata to Pinata"
  //       );
  //     }

  //     const data = await res.json();
  //     // Return HTTP URL instead of IPFS URL for better compatibility
  //     return `https://aqua-rare-worm-454.mypinata.cloud/ipfs/${data.IpfsHash}`;
  //   } catch (err: unknown) {
  //     console.error("Pinata metadata upload error:", err);
  //     throw new Error(
  //       `Failed to upload metadata to Pinata: ${
  //         err instanceof Error ? err.message : "Unknown error"
  //       }`
  //     );
  //   }
  // };
  const getKycStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return "text-yellow-600 bg-yellow-100";
      case 1:
        return "text-green-600 bg-green-100";
      case 2:
        return "text-red-600 bg-red-100";
      case 3:
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getKycStatusText = (status: number) => {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Verified";
      case 2:
        return "Rejected";
      case 3:
        return "Suspended";
      default:
        return "Unknown";
    }
  };

  const getResidencyTypeText = (type: number) => {
    switch (type) {
      case 0:
        return "Individual";
      case 1:
        return "Business";
      case 2:
        return "Premium Business";
      default:
        return "Unknown";
    }
  };
  const refreshNFTInMetaMask = async (
    contractAddress: string,
    tokenId: string
  ) => {
    try {
      // Method 1: Try to trigger MetaMask to refresh
      if (typeof (window as any).ethereum !== "undefined") {
        await (window as any).ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC721",
            options: {
              address: contractAddress,
              tokenId: tokenId,
            },
          },
        });
      }
    } catch (error) {
      console.log("MetaMask refresh attempt failed:", error);
    }
  };

  // Add this component to show NFT details
  const NFTDetailsCard = ({
    tokenId,
    metadata,
  }: {
    tokenId: string;
    metadata: any;
  }) => {
    const [nftData, setNftData] = useState<any>(null);

    useEffect(() => {
      const fetchNFTData = async () => {
        try {
          // Fetch from your metadata URI
          const response = await fetch(
            metadata.replace(
              "ipfs://",
              "https://aqua-rare-worm-454.mypinata.cloud/ipfs/"
            )
          );
          const data = await response.json();
          setNftData(data);
        } catch (error) {
          console.error("Failed to fetch NFT data:", error);
        }
      };

      if (metadata) {
        fetchNFTData();
      }
    }, [metadata]);

    if (!nftData) {
      return <div>Loading NFT details...</div>;
    }

    // Convert ipfs:// to gateway for image
    const imageUrl = nftData.image?.replace(
      "ipfs://",
      "https://aqua-rare-worm-454.mypinata.cloud/ipfs/"
    );

    return (
      <div className="bg-white border border-blue-400 rounded-2xl shadow-lg flex flex-col md:flex-row items-center p-6 max-w-xl mx-auto">
        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={nftData.name}
              className="w-32 h-40 rounded-xl object-cover border-4 border-blue-300 shadow-md"
              style={{ background: "#e0e7ff" }}
            />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-blue-800 mb-2">
            {nftData.name}
          </h3>
          <p className="text-gray-700 mb-2 text-sm">{nftData.description}</p>
          <div className="grid grid-cols-1 gap-1 text-sm mb-2">
            {nftData.attributes?.map((attr: any, index: number) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-600 font-medium">
                  {attr.trait_type}:
                </span>
                <span className="text-gray-900">{attr.value}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() =>
                window.open(
                  `https://aqua-rare-worm-454.mypinata.cloud/ipfs/${metadata.replace(
                    "ipfs://",
                    ""
                  )}`,
                  "_blank"
                )
              }
              className="text-blue-600 hover:text-blue-800 text-xs underline"
            >
              View Metadata
            </button>
            <button
              onClick={() => refreshNFTInMetaMask(ADDRESS, tokenId)}
              className="text-green-600 hover:text-green-800 text-xs underline"
            >
              Refresh in MetaMask
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!isWalletConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        {alert.message && (
          <div
            className={`fixed top-4 left-1/2 z-50 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg text-white text-sm ${
              alert.type === "success"
                ? "bg-green-500"
                : alert.type === "error"
                ? "bg-red-500"
                : "bg-yellow-500"
            }`}
          >
            {alert.message}
          </div>
        )}
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Bhutan E-Residency
          </h1>
          <p className="text-gray-600 mb-6">
            Connect your wallet to start your digital residency journey
          </p>
          <button
            onClick={connectWallet}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      {alert.message && (
        <div
          className={`fixed top-4 left-1/2 z-50 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg text-white text-sm ${
            alert.type === "success"
              ? "bg-green-500"
              : alert.type === "error"
              ? "bg-red-500"
              : "bg-yellow-500"
          }`}
        >
          {alert.message}
        </div>
      )}

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🏔️ Bhutan E-Residency Platform
          </h1>
          <p className="text-gray-600 mb-4">
            Your gateway to digital residency in the Kingdom of Bhutan
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                Connected: {walletAddress.slice(0, 6)}...
                {walletAddress.slice(-4)}
              </span>
            </div>
            <button
              onClick={disconnectWallet}
              className="text-red-600 hover:text-red-800 text-sm border border-red-300 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-xl mb-8">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("kyc")}
              className={`px-6 py-4 font-semibold ${
                activeTab === "kyc"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              📋 KYC Verification
            </button>
            <button
              onClick={() => setActiveTab("listings")}
              className={`px-6 py-4 font-semibold ${
                activeTab === "listings"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              🏪 Residency Marketplace
            </button>
            <button
              onClick={() => setActiveTab("purchase")}
              className={`px-6 py-4 font-semibold ${
                activeTab === "purchase"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              🛒 Purchase Details
            </button>
          </div>

          <div className="p-6">
            {/* KYC Tab */}
            {activeTab === "kyc" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">KYC Verification</h2>

                {kycData && kycData.kycId > BigInt(0) ? (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Your KYC Status
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <span
                          className={`ml-2 px-3 py-1 rounded-full text-sm ${getKycStatusColor(
                            Number(kycData.status)
                          )}`}
                        >
                          {getKycStatusText(Number(kycData.status))}
                        </span>
                      </div>
                      {isKycVerified && (
                        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6">
                          <h3 className="text-lg font-semibold text-green-800 mb-2">
                            🎉 Congratulations! Your E-Residency NFT has been
                            minted
                          </h3>
                          <p className="text-green-700 mb-4">
                            You now have a digital residency certificate NFT in
                            your wallet.
                          </p>
                          <button
                            onClick={async () => {
                              try {
                                const contract = new ethers.Contract(
                                  ADDRESS,
                                  ABI,
                                  signer
                                );
                                const userResidencies =
                                  await contract.getUserResidencies(
                                    walletAddress
                                  );
                                console.log(
                                  "Your NFT Token IDs:",
                                  userResidencies
                                );
                                showAlert(
                                  `You have ${userResidencies.length} residency NFT(s)`,
                                  "success"
                                );
                              } catch (error) {
                                console.error("Error fetching NFTs:", error);
                              }
                            }}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                          >
                            View My NFTs
                          </button>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-600">KYC ID:</span>
                        <span className="ml-2 font-mono">
                          {kycData.kycId.toString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Full Name:</span>
                        <span className="ml-2">{kycData.fullName}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <span className="ml-2">{kycData.email}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleKycSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={kycForm.fullName}
                          onChange={(e) =>
                            setKycForm({ ...kycForm, fullName: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          value={kycForm.email}
                          onChange={(e) =>
                            setKycForm({ ...kycForm, email: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={kycForm.phoneNumber}
                          onChange={(e) =>
                            setKycForm({
                              ...kycForm,
                              phoneNumber: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          User Type
                        </label>
                        <select
                          value={kycForm.userType}
                          onChange={(e) =>
                            setKycForm({ ...kycForm, userType: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Individual">Individual</option>
                          <option value="Business">Business</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Residence Address
                      </label>
                      <textarea
                        required
                        value={kycForm.residenceAddress}
                        onChange={(e) =>
                          setKycForm({
                            ...kycForm,
                            residenceAddress: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Document Hash (IPFS)
                      </label>
                      <input
                        type="text"
                        placeholder="QmExample123..."
                        required
                        value={kycForm.documentHash}
                        onChange={(e) =>
                          setKycForm({
                            ...kycForm,
                            documentHash: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile Image for NFT
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setKycForm({ ...kycForm, profileImage: file });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        This image will be used for your residency NFT
                      </p>
                    </div>
                    <button
                      type="submit"
                      disabled={isKycPending}
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isKycPending ? "Submitting..." : "Submit KYC"}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Listings Tab */}
            {activeTab === "listings" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  Available Residencies
                </h2>

                {!isKycVerified ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                      KYC Verification Required
                    </h3>
                    <p className="text-yellow-700">
                      Please complete KYC verification before purchasing a
                      residency.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sampleListings.map((listing) => (
                      <div
                        key={listing.listingId.toString()}
                        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold">
                            {listing.title}
                          </h3>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Active
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">
                          {listing.description}
                        </p>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Type:</span>
                            <span>
                              {getResidencyTypeText(listing.residencyType)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Price:</span>
                            <span className="font-semibold">
                              {ethers.formatEther(listing.price)} ETH
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedListing(listing);
                            setActiveTab("purchase");
                          }}
                          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700"
                        >
                          Purchase
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Purchase Tab */}
            {activeTab === "purchase" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  Complete Your Purchase
                </h2>

                {!isKycVerified ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                      KYC Verification Required
                    </h3>
                    <p className="text-yellow-700">
                      Please complete KYC verification before proceeding with
                      purchase.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax ID
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your unique tax ID"
                        value={purchaseForm.taxId}
                        onChange={(e) =>
                          setPurchaseForm({
                            ...purchaseForm,
                            taxId: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Legal Entity Name (for businesses)
                      </label>
                      <input
                        type="text"
                        placeholder="Leave empty for individual residency"
                        value={purchaseForm.legalEntityName}
                        onChange={(e) =>
                          setPurchaseForm({
                            ...purchaseForm,
                            legalEntityName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Token URI (metadata)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="https://example.com/metadata.json"
                        value={purchaseForm.tokenURI}
                        onChange={(e) =>
                          setPurchaseForm({
                            ...purchaseForm,
                            tokenURI: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {selectedListing && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">
                          Purchase Summary
                        </h3>
                        <div className="space-y-2 text-blue-700">
                          <div className="flex justify-between">
                            <span>Residency Type:</span>
                            <span>
                              {getResidencyTypeText(
                                selectedListing.residencyType
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Price:</span>
                            <span>
                              {ethers.formatEther(selectedListing.price)} ETH
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Platform Fee (2.5%):</span>
                            <span>
                              {ethers.formatEther(
                                (selectedListing.price * BigInt(25)) /
                                  BigInt(1000)
                              )}{" "}
                              ETH
                            </span>
                          </div>
                          <hr className="border-blue-300" />
                          <div className="flex justify-between font-semibold">
                            <span>Total:</span>
                            <span>
                              {ethers.formatEther(
                                selectedListing.price +
                                  (selectedListing.price * BigInt(25)) /
                                    BigInt(1000)
                              )}{" "}
                              ETH
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() =>
                        selectedListing && handlePurchase(selectedListing)
                      }
                      disabled={
                        isPurchasePending ||
                        !purchaseForm.taxId ||
                        !purchaseForm.tokenURI ||
                        !selectedListing
                      }
                      className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPurchasePending
                        ? "Processing..."
                        : "Complete Purchase"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EResidencyPage;
