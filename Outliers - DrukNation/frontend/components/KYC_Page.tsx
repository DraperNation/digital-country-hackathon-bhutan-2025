"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
// import { ADDRESS, ABI } from "@/lib/constant_contracts";
import {
  KYC_ADDRESS,
  KYC_ABI,
  NFT_ADDRESS,
  NFT_ABI,
} from "@/lib/constant_contracts";
import Navbar from "@/components/Navbar";
import { useWallet } from "@/context/WalletConnect";
import {
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Hash,
  Camera,
  Send,
  CheckCircle,
} from "lucide-react";

// Add type definition for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Types
type KYCStatus = "Pending" | "Verified" | "Rejected" | "Suspended";
type UserType = "Individual" | "Business";

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

const KYCPage = () => {
  const { isWalletConnected, walletAddress, signer } = useWallet();
  const [alert, setAlert] = useState<{ message: string; type: string }>({
    message: "",
    type: "",
  });

  const [kycData, setKycData] = useState<KYCData | null>(null);
  const [isKycVerified, setIsKycVerified] = useState<boolean>(false);
  const [userNFTs, setUserNFTs] = useState<string[]>([]);
  const [addedToWallet, setAddedToWallet] = useState<Record<string, boolean>>(
    {}
  );

  // Loading states
  const [isKycPending, setIsKycPending] = useState(false);

  // KYC Form State
  const [kycForm, setKycForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    residenceAddress: "",
    documentHash: "",
    userType: "Individual",
    profileImage: null as File | null,
    idDocument: null as File | null, // Add this new field
  });
  const [addingToWallet, setAddingToWallet] = useState<Record<string, boolean>>(
    {}
  );
  const [isUploadingId, setIsUploadingId] = useState(false);
  const [generatedNFTImageUrl, setGeneratedNFTImageUrl] = useState<string>("");

  const [addStatus, setAddStatus] = useState<Record<string, string>>({});

  useEffect(() => {
    if (walletAddress && isWalletConnected) {
      loadKYCData();
    }
  }, [walletAddress, isWalletConnected]);

  const showAlert = (message: string, type: string = "info") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 3000);
  };

  const loadKYCData = async () => {
    if (!signer || !walletAddress) return;
    try {
      const kycContract = new ethers.Contract(KYC_ADDRESS, KYC_ABI, signer);

      // Check if user is KYC verified
      const verified = await kycContract.isKYCVerified(walletAddress);
      setIsKycVerified(verified);

      // Try to get KYC data
      try {
        const userData = await kycContract.getKYCData(walletAddress);
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
  const addNFTToWallet = async (tokenId: string) => {
    try {
      setAddingToWallet((prev) => ({ ...prev, [tokenId]: true }));
      setAddStatus((prev) => ({ ...prev, [tokenId]: "Adding..." }));

      // Check if we have ethereum provider (MetaMask)
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
      }

      // Get user's NFT data for the token
      const nftContract = new ethers.Contract(NFT_ADDRESS, NFT_ABI, signer);
      const userTokens = await nftContract.getUserOwnedTokens(walletAddress);

      // Find the specific token data
      const tokenExists = userTokens.find(
        (token: any) => token.toString() === tokenId
      );
      if (!tokenExists) {
        throw new Error("Token not found in your wallet");
      }

      // Get token URI for metadata
      let tokenURI = "";
      let tokenName = `Bhutan E-Residency #${tokenId}`;
      let tokenImage = "";

      try {
        tokenURI = await nftContract.tokenURI(tokenId);
        // If we have metadata, try to get name and image
        if (tokenURI) {
          const metadata = await fetch(
            tokenURI.replace(
              "ipfs://",
              "https://aqua-rare-worm-454.mypinata.cloud/ipfs/"
            )
          );
          const metadataJson = await metadata.json();
          tokenName = metadataJson.name || tokenName;
          tokenImage =
            metadataJson.image?.replace(
              "ipfs://",
              "https://aqua-rare-worm-454.mypinata.cloud/ipfs/"
            ) || "";
        }
      } catch (metadataError) {
        console.log("Could not fetch metadata, using default values");
      }

      // Request to add NFT to MetaMask
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC721",
          options: {
            address: NFT_ADDRESS,
            tokenId: tokenId,
            image: tokenImage,
            name: tokenName,
          },
        },
      });

      // Mark as added in localStorage
      const addedNFTs = JSON.parse(localStorage.getItem("addedNFTs") || "[]");
      const nftKey = `${NFT_ADDRESS}-${tokenId}`;
      if (!addedNFTs.includes(nftKey)) {
        addedNFTs.push(nftKey);
        localStorage.setItem("addedNFTs", JSON.stringify(addedNFTs));
      }

      setAddedToWallet((prev) => ({ ...prev, [tokenId]: true }));
      setAddStatus((prev) => ({ ...prev, [tokenId]: "Added successfully!" }));

      // Reset status after delay
      setTimeout(() => {
        setAddStatus((prev) => {
          const newStatus = { ...prev };
          delete newStatus[tokenId];
          return newStatus;
        });
      }, 3000);
    } catch (error) {
      console.error("Error adding NFT to wallet:", error);
      setAddStatus((prev) => ({
        ...prev,
        [tokenId]: error instanceof Error ? error.message : "Failed to add",
      }));

      // Reset error status after delay
      setTimeout(() => {
        setAddStatus((prev) => {
          const newStatus = { ...prev };
          delete newStatus[tokenId];
          return newStatus;
        });
      }, 3000);
    } finally {
      setAddingToWallet((prev) => ({ ...prev, [tokenId]: false }));
    }
  };
  const checkIfNFTAddedToWallet = async (tokenId: string): Promise<boolean> => {
    try {
      if (!window.ethereum) return false;

      // This is a workaround since there's no direct way to check if NFT is in MetaMask
      // We'll use localStorage to track what we've added
      const addedNFTs = JSON.parse(localStorage.getItem("addedNFTs") || "[]");
      return addedNFTs.includes(`${NFT_ADDRESS}-${tokenId}`);
    } catch (error) {
      return false;
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

      // NFT standard square dimensions - 1:1 aspect ratio
      const size = 1000; // 1000x1000 for high quality NFT
      canvas.width = size;
      canvas.height = size;

      // Create premium gradient background
      const gradient = ctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2
      );
      gradient.addColorStop(0, "#0F1419"); // Dark center
      gradient.addColorStop(0.3, "#1E293B"); // Slate
      gradient.addColorStop(0.7, "#334155"); // Medium slate
      gradient.addColorStop(1, "#1E40AF"); // Royal blue edge
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      // Add subtle pattern overlay
      ctx.globalAlpha = 0.1;
      for (let i = 0; i < size; i += 50) {
        ctx.strokeStyle = "#60A5FA";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, size);
        ctx.moveTo(0, i);
        ctx.lineTo(size, i);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Premium border with gradient
      const borderGradient = ctx.createLinearGradient(0, 0, size, size);
      borderGradient.addColorStop(0, "#F59E0B"); // Gold
      borderGradient.addColorStop(0.25, "#EAB308"); // Yellow
      borderGradient.addColorStop(0.5, "#F59E0B"); // Gold
      borderGradient.addColorStop(0.75, "#D97706"); // Amber
      borderGradient.addColorStop(1, "#F59E0B"); // Gold

      ctx.strokeStyle = borderGradient;
      ctx.lineWidth = 12;
      ctx.strokeRect(20, 20, size - 40, size - 40);

      // Inner border
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 40, size - 80, size - 120);

      // Header section with emblem placeholder
      ctx.fillStyle = "#FFFFFF";
      ctx.font = `bold ${size * 0.045}px 'Arial', sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("🏔️ KINGDOM OF BHUTAN 🏔️", size / 2, size * 0.12);

      ctx.font = `bold ${size * 0.035}px 'Arial', sans-serif`;
      ctx.fillStyle = "#F59E0B";
      ctx.fillText("DIGITAL CITIZENSHIP CERTIFICATE", size / 2, size * 0.17);

      ctx.font = `${size * 0.025}px 'Arial', sans-serif`;
      ctx.fillStyle = "#E5E7EB";
      ctx.fillText("E-RESIDENCY NFT", size / 2, size * 0.21);

      // Load and draw profile image
      const profileImg = new Image();
      profileImg.crossOrigin = "anonymous";

      profileImg.onload = () => {
        const imgSize = size * 0.25;
        const imgX = size / 2 - imgSize / 2;
        const imgY = size * 0.25;

        // Profile image with premium styling
        ctx.save();

        // Outer glow
        ctx.shadowColor = "#F59E0B";
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Circular clip for profile image
        ctx.beginPath();
        ctx.arc(size / 2, imgY + imgSize / 2, imgSize / 2, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(profileImg, imgX, imgY, imgSize, imgSize);
        ctx.restore();

        // Profile border with gradient
        const profileBorderGradient = ctx.createLinearGradient(
          imgX,
          imgY,
          imgX + imgSize,
          imgY + imgSize
        );
        profileBorderGradient.addColorStop(0, "#F59E0B");
        profileBorderGradient.addColorStop(0.5, "#FCD34D");
        profileBorderGradient.addColorStop(1, "#F59E0B");

        ctx.strokeStyle = profileBorderGradient;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(size / 2, imgY + imgSize / 2, imgSize / 2, 0, 2 * Math.PI);
        ctx.stroke();

        // Information section with better spacing
        const infoStartY = size * 0.55;
        const lineHeight = size * 0.06;

        // Name
        ctx.fillStyle = "#F59E0B";
        ctx.font = `bold ${size * 0.03}px 'Arial', sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText("CITIZEN NAME", size / 2, infoStartY);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = `bold ${size * 0.035}px 'Arial', sans-serif`;
        ctx.fillText(
          userData.fullName.toUpperCase(),
          size / 2,
          infoStartY + lineHeight * 0.7
        );

        // Type
        ctx.fillStyle = "#F59E0B";
        ctx.font = `bold ${size * 0.025}px 'Arial', sans-serif`;
        ctx.fillText("RESIDENCY TYPE", size / 2, infoStartY + lineHeight * 1.8);

        ctx.fillStyle = "#E5E7EB";
        ctx.font = `${size * 0.03}px 'Arial', sans-serif`;
        ctx.fillText(
          userData.userType.toUpperCase(),
          size / 2,
          infoStartY + lineHeight * 2.4
        );

        // ID
        ctx.fillStyle = "#F59E0B";
        ctx.font = `bold ${size * 0.025}px 'Arial', sans-serif`;
        ctx.fillText("CITIZEN ID", size / 2, infoStartY + lineHeight * 3.2);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = `bold ${size * 0.03}px 'Courier New', monospace`;
        ctx.fillText(
          `BT-${userData.kycId}`,
          size / 2,
          infoStartY + lineHeight * 3.8
        );

        // Issue date
        ctx.fillStyle = "#F59E0B";
        ctx.font = `bold ${size * 0.025}px 'Arial', sans-serif`;
        ctx.fillText("ISSUED", size / 2, infoStartY + lineHeight * 4.6);

        ctx.fillStyle = "#E5E7EB";
        ctx.font = `${size * 0.025}px 'Arial', sans-serif`;
        ctx.fillText(
          new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          size / 2,
          infoStartY + lineHeight * 5.1
        );

        // Footer with blockchain info
        ctx.fillStyle = "rgba(245, 158, 11, 0.8)";
        ctx.font = `${size * 0.02}px 'Arial', sans-serif`;
        ctx.fillText("🔗 SECURED ON BLOCKCHAIN", size / 2, size * 0.92);

        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.font = `${size * 0.018}px 'Arial', sans-serif`;
        ctx.fillText(
          "This certificate is a unique NFT representing digital citizenship",
          size / 2,
          size * 0.95
        );

        // Convert canvas to blob and upload
        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              const file = new File([blob], "e-citizenship-nft.png", {
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

  const checkNFTStatus = async () => {
    if (!signer || !walletAddress) return;

    try {
      const nftContract = new ethers.Contract(NFT_ADDRESS, NFT_ABI, signer);
      const userTokens = await nftContract.getUserOwnedTokens(walletAddress);
      // Handle NFT data if needed
      return userTokens;
    } catch (error) {
      console.error("Error checking NFT status:", error);
      return [];
    }
  };

  const handleKycSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!signer) return;
    setIsKycPending(true);

    try {
      let documentHash = kycForm.documentHash;
      let idDocumentUrl = "";

      // Upload ID document if provided (for verification purposes)
      if (kycForm.idDocument) {
        setIsUploadingId(true);
        const idDocumentResult = await uploadToPinata(kycForm.idDocument);
        idDocumentUrl = idDocumentResult.ipfsUrl;
        setIsUploadingId(false);
      }

      // Generate ID card if profile image is provided (this will be the NFT image)
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

        // Use the generated ID card as the main document hash (for NFT metadata)
        documentHash = idCardImageUrl;
      } else if (idDocumentUrl) {
        // If no profile image but ID document exists, use ID document
        documentHash = idDocumentUrl;
      }

      const kycContract = new ethers.Contract(KYC_ADDRESS, KYC_ABI, signer);

      // Submit KYC with the generated ID card image as document hash
      const tx = await kycContract.submitKYC(
        kycForm.fullName,
        kycForm.email,
        kycForm.phoneNumber,
        kycForm.residenceAddress,
        documentHash, // This will be the generated ID card with profile photo
        kycForm.userType === "Individual" ? 0 : 1
      );

      await tx.wait();
      showAlert(
        "KYC submitted successfully! Your ID card has been generated for the NFT.",
        "success"
      );
      await loadKYCData();
    } catch (error) {
      console.error("KYC submission failed:", error);
      showAlert("KYC submission failed", "error");
    } finally {
      setIsKycPending(false);
      setIsUploadingId(false);
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

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />

      {alert.message && (
        <div
          className={`fixed top-20 left-1/2 z-50 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg text-white text-sm ${
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

      {!isWalletConnected ? (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              KYC Verification
            </h1>
            <p className="text-gray-600 mb-6">
              Connect your wallet to complete KYC verification for Bhutan
              E-Residency
            </p>
            <p className="text-sm text-blue-600 mb-4">
              Please use the "Connect Wallet" button in the navigation bar
              above.
            </p>
          </div>
        </div>
      ) : (
        <div className="py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                📋 KYC Verification
              </h1>
              <p className="text-gray-600 mb-4">
                Complete your Know Your Customer verification for Bhutan
                E-Residency
              </p>
            </div>

            {/* KYC Content */}
            <div className="bg-gradient-to-br from-white to-gray-50 text-gray-900 rounded-xl shadow-2xl border border-gray-100 p-10 backdrop-blur-sm">
              <h2 className="text-3xl text-gray-800 font-semibold mb-8 tracking-wide">
                KYC Verification
              </h2>

              {kycData && kycData.kycId > BigInt(0) ? (
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200 ">
                  <h3 className="text-xl text-gray-900 font-bold mb-6 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Your KYC Status
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col space-y-1">
                      <span className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                        Status:
                      </span>
                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold w-fit ${getKycStatusColor(
                          Number(kycData.status)
                        )}`}
                      >
                        {getKycStatusText(Number(kycData.status))}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                        KYC ID:
                      </span>
                      <span className="font-mono text-gray-800 bg-gray-100 px-3 py-1 rounded-lg w-fit">
                        {kycData.kycId.toString()}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                        Full Name:
                      </span>
                      <span className="text-gray-800 font-medium">
                        {kycData.fullName}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                        Email:
                      </span>
                      <span className="text-gray-800 font-medium">
                        {kycData.email}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                        Phone:
                      </span>
                      <span className="text-gray-800 font-medium">
                        {kycData.phoneNumber}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                        User Type:
                      </span>
                      <span className="text-gray-800 font-medium">
                        {kycData.userType === 0 ? "Individual" : "Business"}
                      </span>
                    </div>
                  </div>

                  {isKycVerified && (
                    <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 shadow-lg">
                      <h3 className="text-xl font-bold text-green-800 mb-3 flex items-center">
                        <span className="text-2xl mr-3">🎉</span>
                        Congratulations! Your KYC has been verified
                      </h3>
                      <p className="text-green-700 mb-6 leading-relaxed">
                        You can now proceed to purchase your E-Residency. Your
                        NFT certificate will be minted upon purchase.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={async () => {
                            try {
                              const contract = new ethers.Contract(
                                NFT_ADDRESS,
                                NFT_ABI,
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

                              // If user has NFTs, show them in a list and check their MetaMask status
                              if (userResidencies.length > 0) {
                                const tokenIds = userResidencies.map(
                                  (tokenId: any) => tokenId.toString()
                                );
                                setUserNFTs(tokenIds);

                                // Check which NFTs are already added to MetaMask
                                const addedStatus: Record<string, boolean> = {};
                                for (const tokenId of tokenIds) {
                                  addedStatus[tokenId] =
                                    await checkIfNFTAddedToWallet(tokenId);
                                }
                                setAddedToWallet(addedStatus);
                              }
                            } catch (error) {
                              console.error("Error fetching NFTs:", error);
                              showAlert("Error fetching your NFTs", "error");
                            }
                          }}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg font-semibold"
                        >
                          View My NFTs
                        </button>
                      </div>

                      {/* NFT List - Add this new section */}
                      {userNFTs.length > 0 && (
                        <div className="mt-6 space-y-3">
                          <h4 className="text-lg font-semibold text-green-800">
                            Your E-Residency NFTs:
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {userNFTs.map((tokenId) => (
                              <div
                                key={tokenId}
                                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <h5 className="font-semibold text-gray-800">
                                    E-Residency #{tokenId}
                                  </h5>
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                    Owned
                                  </span>
                                </div>

                                <button
                                  onClick={() => addNFTToWallet(tokenId)}
                                  disabled={
                                    addingToWallet[tokenId] ||
                                    addedToWallet[tokenId]
                                  }
                                  className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                    addedToWallet[tokenId]
                                      ? "bg-green-100 text-green-800 border border-green-300 cursor-not-allowed"
                                      : addStatus[tokenId] ===
                                        "Added successfully!"
                                      ? "bg-green-100 text-green-800 border border-green-300"
                                      : addStatus[tokenId] &&
                                        addStatus[tokenId] !== "Adding..."
                                      ? "bg-red-100 text-red-800 border border-red-300"
                                      : "bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105"
                                  } ${
                                    addingToWallet[tokenId]
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                  }`}
                                >
                                  {addedToWallet[tokenId]
                                    ? "✓ Added to MetaMask"
                                    : addingToWallet[tokenId]
                                    ? "Adding..."
                                    : addStatus[tokenId] || "Add to MetaMask"}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleKycSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-end justify-start gap-2 mb-2">
                        <div className="flex items-start p-2 bg-sky-50 rounded-xl">
                          <User className="w-5 h-5 text-slate-700 stroke-1.5" />
                        </div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Full Name
                        </label>
                      </div>
                      <input
                        type="text"
                        required
                        value={kycForm.fullName}
                        onChange={(e) =>
                          setKycForm({ ...kycForm, fullName: e.target.value })
                        }
                        className="w-full text-gray-700 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <div className="flex items-end justify-start gap-2 mb-2">
                        <div className="flex items-start p-2 bg-sky-50 rounded-xl">
                          <Mail className="w-5 h-5 text-slate-700 stroke-1.5" />
                        </div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Email
                        </label>
                      </div>
                      <input
                        type="email"
                        required
                        value={kycForm.email}
                        onChange={(e) =>
                          setKycForm({ ...kycForm, email: e.target.value })
                        }
                        className="w-full text-gray-700 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <div className="flex items-end justify-start gap-2 mb-2">
                        <div className="flex items-start p-2 bg-sky-50 rounded-xl">
                          <Phone className="w-5 h-5 text-slate-700 stroke-1.5" />
                        </div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Phone Number
                        </label>
                      </div>
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
                        className="w-full text-gray-700 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <div className="flex items-end justify-start gap-2 mb-2">
                        <div className="flex items-start p-2 bg-sky-50 rounded-xl">
                          <Building className="w-5 h-5 text-slate-700 stroke-1.5" />
                        </div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          User Type
                        </label>
                      </div>
                      <select
                        value={kycForm.userType}
                        onChange={(e) =>
                          setKycForm({ ...kycForm, userType: e.target.value })
                        }
                        className="w-full text-gray-700 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Individual">Individual</option>
                        <option value="Business">Business</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-end justify-start gap-2 mb-2">
                      <div className="flex items-start p-2 bg-sky-50 rounded-xl">
                        <MapPin className="w-5 h-5 text-slate-700 stroke-1.5" />
                      </div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        Residence Address
                      </label>
                    </div>
                    <textarea
                      required
                      value={kycForm.residenceAddress}
                      onChange={(e) =>
                        setKycForm({
                          ...kycForm,
                          residenceAddress: e.target.value,
                        })
                      }
                      className="w-full text-gray-700 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                  <div>
                    <div className="flex items-end justify-start gap-2 mb-2">
                      <div className="flex items-start p-2 bg-sky-50 rounded-xl">
                        <Hash className="w-5 h-5 text-slate-700 stroke-1.5" />
                      </div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        ID Document Upload
                      </label>
                    </div>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      required
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setKycForm({ ...kycForm, idDocument: file });
                      }}
                      className="w-full text-gray-700 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Upload a clear image of your government-issued ID
                      (passport, driver's license, etc.)
                    </p>
                    {isUploadingId && (
                      <div className="mt-2 flex items-center text-blue-600 text-sm">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        Uploading ID document...
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-end justify-start gap-2 mb-2">
                      <div className="flex items-start p-2 bg-sky-50 rounded-xl">
                        <Camera className="w-5 h-5 text-slate-700 stroke-1.5" />
                      </div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        Profile Image for NFT
                      </label>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setKycForm({ ...kycForm, profileImage: file });
                      }}
                      className="w-full text-gray-700 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      This image will be used for your residency NFT certificate
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={isKycPending || isUploadingId}
                    className="w-full bg-blue-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-900/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isUploadingId
                      ? "Uploading documents..."
                      : isKycPending
                      ? "Submitting..."
                      : "Submit KYC"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYCPage;
