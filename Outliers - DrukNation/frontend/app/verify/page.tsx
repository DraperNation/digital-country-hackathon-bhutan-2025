"use client";

import { useEffect, useState } from "react";
import { ethers, BrowserProvider, JsonRpcSigner } from "ethers";
import {
  KYC_ADDRESS,
  KYC_ABI,
  NFT_ADDRESS,
  NFT_ABI,
  MAR_ADDRESS,
  MAR_ABI,
} from "@/lib/constant_contracts";
import Navbar from "@/components/Navbar";
import { WalletProvider } from "@/context/WalletConnect";

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

interface BhutaneseKYCData {
  kycId: bigint;
  userAddress: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  residenceAddress: string;
  citizenshipNumber: string;
  documentHash: string;
  status: number; // 0 = Pending, 1 = Verified, 2 = Rejected
  submissionTime: bigint;
  verificationTime: bigint;
  verifiedBy: string;
}

interface BusinessListing {
  listingId: bigint;
  applicant: string;
  businessName: string;
  businessDescription: string;
  businessType: string;
  documentsHash: string;
  status: number; // 0 = Pending, 1 = Verified, 2 = Rejected
  submittedAt: bigint;
  verifiedAt: bigint;
  verifiedBy: string;
  rejectionReason: string;
}

const VerifierPage = () => {
  const [pendingKycList, setPendingKycList] = useState<KYCData[]>([]);
  const [pendingBhutaneseKyc, setPendingBhutaneseKyc] = useState<
    BhutaneseKYCData[]
  >([]);
  const [pendingBusinessList, setPendingBusinessList] = useState<
    BusinessListing[]
  >([]);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: string }>({
    message: "",
    type: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState<string>("");
  const [isVerifyingBusiness, setIsVerifyingBusiness] = useState<string>("");
  const [isVerifyingBhutanese, setIsVerifyingBhutanese] = useState<string>("");

  useEffect(() => {
    loadWallet();
  }, []);

  useEffect(() => {
    if (signer) {
      fetchPendingKyc();
      fetchPendingBusinessListings();
      fetchPendingBhutaneseKyc();
    }
  }, [signer]);

  const showAlert = (message: string, type: string = "info") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 3000);
  };

  const loadWallet = async () => {
    if (typeof (window as any).ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        setProvider(provider);
        setSigner(signer);
      } catch (error) {
        showAlert("Failed to connect wallet", "error");
      }
    } else {
      showAlert("MetaMask is not installed!", "error");
    }
  };

  const fetchPendingKyc = async () => {
    if (!signer) return;
    setIsLoading(true);
    try {
      const contract = new ethers.Contract(KYC_ADDRESS, KYC_ABI, signer);
      const kycList = await contract.getAllPendingKYC();
      setPendingKycList(kycList);
    } catch (error) {
      showAlert("Failed to fetch KYC data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPendingBhutaneseKyc = async () => {
    if (!signer) return;
    setIsLoading(true);
    try {
      const contract = new ethers.Contract(MAR_ADDRESS, MAR_ABI, signer);
      const bhutaneseKycList = await contract.getAllPendingBhutaneseKYC();
      setPendingBhutaneseKyc(bhutaneseKycList);
    } catch (error) {
      console.error("Error fetching Bhutanese KYC:", error);
      showAlert("Failed to fetch Bhutanese KYC data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPendingBusinessListings = async () => {
    if (!signer) return;
    setIsLoading(true);
    try {
      const contract = new ethers.Contract(KYC_ADDRESS, KYC_ABI, signer);
      const businessList = await contract.getPendingBusinessListings();
      setPendingBusinessList(businessList);
    } catch (error) {
      showAlert("Failed to fetch business listings", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (userAddress: string) => {
    if (!signer) return;
    setIsVerifying(userAddress);

    try {
      const kycContract = new ethers.Contract(KYC_ADDRESS, KYC_ABI, signer);

      console.log("Starting verification for:", userAddress);

      const signerAddress = await signer.getAddress();
      console.log("Signer address:", signerAddress);

      const isVerifier = await kycContract.kycVerifiers(signerAddress);
      const isOwner = await kycContract.owner();
      console.log("Is verifier:", isVerifier);
      console.log("Contract owner:", isOwner);
      console.log(
        "Is owner:",
        signerAddress.toLowerCase() === isOwner.toLowerCase()
      );

      if (
        !isVerifier &&
        signerAddress.toLowerCase() !== isOwner.toLowerCase()
      ) {
        throw new Error("You are not authorized as a verifier or owner");
      }

      const userKyc = await kycContract.getKYCData(userAddress);
      console.log("User KYC data:", {
        kycId: userKyc.kycId.toString(),
        status: userKyc.status.toString(),
        fullName: userKyc.fullName,
      });

      if (userKyc.kycId.toString() === "0") {
        throw new Error("KYC not submitted for this user");
      }

      if (userKyc.status.toString() !== "0") {
        throw new Error(
          `KYC status is not pending. Current status: ${userKyc.status.toString()}`
        );
      }

      const isPaused = await kycContract.paused();
      console.log("Contract paused:", isPaused);

      if (isPaused) {
        throw new Error("Contract is currently paused");
      }

      let tokenURI = "";
      if (
        !userKyc.documentHash.includes("metadata") &&
        !userKyc.documentHash.includes("json")
      ) {
        const imageUrl = userKyc.documentHash.startsWith("ipfs://")
          ? userKyc.documentHash
          : `ipfs://${userKyc.documentHash}`;

        console.log("Uploading metadata to Pinata...");
        tokenURI = await uploadMetadataToPinata(
          userKyc.fullName,
          userKyc.userType === 0 ? "Individual" : "Business",
          imageUrl
        );
        console.log("Metadata uploaded:", tokenURI);
      } else {
        tokenURI = userKyc.documentHash;
      }

      console.log("Verifying KYC and minting NFT...");

      try {
        const gasEstimate = await kycContract.verifyKYCAndMintNFT.estimateGas(
          userAddress,
          tokenURI
        );
        console.log("Gas estimate:", gasEstimate.toString());
      } catch (gasError) {
        console.error("Gas estimation failed:", gasError);
        throw new Error(`Transaction would fail: ${gasError}`);
      }

      const verifyTx = await kycContract.verifyKYCAndMintNFT(
        userAddress,
        tokenURI
      );
      console.log("Verify and mint transaction sent:", verifyTx.hash);
      await verifyTx.wait();
      console.log("KYC verified and NFT minted successfully");

      showAlert("KYC verified and NFT minted!", "success");
      await fetchPendingKyc();
    } catch (error: any) {
      console.error("Verification error:", error);

      let errorMessage = "Verification failed";

      if (error.message.includes("NotAuthorizedVerifier")) {
        errorMessage = "You are not authorized as a verifier";
      } else if (error.message.includes("KYCNotSubmitted")) {
        errorMessage = "KYC not submitted for this user";
      } else if (error.message.includes("KYCNotPending")) {
        errorMessage = "KYC is not in pending status";
      } else if (error.message.includes("UserNotKYCVerified")) {
        errorMessage = "User KYC verification failed";
      } else if (error.message.includes("Pausable: paused")) {
        errorMessage = "Contract is currently paused";
      } else if (error.reason) {
        errorMessage = error.reason;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showAlert(errorMessage, "error");
    } finally {
      setIsVerifying("");
    }
  };

  const handleVerifyBhutanese = async (userAddress: string) => {
    if (!signer) return;
    setIsVerifyingBhutanese(userAddress);

    try {
      const contract = new ethers.Contract(MAR_ADDRESS, MAR_ABI, signer);

      const signerAddress = await signer.getAddress();
      const isAuthorized = await contract.isVerifier(signerAddress);

      if (!isAuthorized) {
        throw new Error("You are not authorized as a verifier");
      }

      const verifyTx = await contract.verifyBhutaneseKYC(userAddress);
      await verifyTx.wait();

      showAlert("Bhutanese KYC verified successfully!", "success");
      await fetchPendingBhutaneseKyc();
    } catch (error: any) {
      console.error("Bhutanese KYC verification error:", error);

      let errorMessage = "Verification failed";
      if (error.message.includes("NotAuthorizedVerifier")) {
        errorMessage = "You are not authorized as a verifier";
      } else if (error.message.includes("KYC not submitted")) {
        errorMessage = "KYC not submitted for this user";
      } else if (error.message.includes("KYC not pending")) {
        errorMessage = "KYC is not in pending status";
      } else if (error.reason) {
        errorMessage = error.reason;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showAlert(errorMessage, "error");
    } finally {
      setIsVerifyingBhutanese("");
    }
  };

  const handleRejectBhutanese = async (userAddress: string, reason: string) => {
    if (!signer) return;

    try {
      const contract = new ethers.Contract(MAR_ADDRESS, MAR_ABI, signer);
      const rejectTx = await contract.rejectBhutaneseKYC(userAddress, reason);
      await rejectTx.wait();

      showAlert("Bhutanese KYC rejected successfully!", "success");
      await fetchPendingBhutaneseKyc();
    } catch (error: any) {
      console.error("Bhutanese KYC rejection error:", error);
      showAlert("Failed to reject Bhutanese KYC", "error");
    }
  };

  const handleVerifyBusiness = async (listingId: string) => {
    if (!signer) return;
    setIsVerifyingBusiness(listingId);

    try {
      const kycContract = new ethers.Contract(KYC_ADDRESS, KYC_ABI, signer);

      console.log("Starting business verification for listing:", listingId);

      const signerAddress = await signer.getAddress();
      const isVerifier = await kycContract.kycVerifiers(signerAddress);
      const isOwner = await kycContract.owner();

      if (
        !isVerifier &&
        signerAddress.toLowerCase() !== isOwner.toLowerCase()
      ) {
        throw new Error("You are not authorized as a verifier or owner");
      }

      const isPaused = await kycContract.paused();
      if (isPaused) {
        throw new Error("Contract is currently paused");
      }

      console.log("Verifying business listing...");
      const verifyTx = await kycContract.verifyBusinessListing(listingId);
      console.log("Business verification transaction sent:", verifyTx.hash);
      await verifyTx.wait();
      console.log("Business listing verified successfully");

      showAlert("Business listing verified successfully!", "success");
      await fetchPendingBusinessListings();
    } catch (error: any) {
      console.error("Business verification error:", error);

      let errorMessage = "Business verification failed";
      if (error.message.includes("NotAuthorizedVerifier")) {
        errorMessage = "You are not authorized as a verifier";
      } else if (error.message.includes("Listing not found")) {
        errorMessage = "Business listing not found";
      } else if (error.message.includes("Listing not pending")) {
        errorMessage = "Business listing is not in pending status";
      } else if (error.reason) {
        errorMessage = error.reason;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showAlert(errorMessage, "error");
    } finally {
      setIsVerifyingBusiness("");
    }
  };

  const createNFTMetadata = (
    fullName: string,
    userType: string,
    imageUrl: string
  ) => {
    let formattedImageUrl = imageUrl;

    if (imageUrl.startsWith("ipfs://")) {
      formattedImageUrl = imageUrl;
    } else if (imageUrl.includes("mypinata.cloud/ipfs/")) {
      const hash = imageUrl.split("/ipfs/").pop();
      formattedImageUrl = `ipfs://${hash}`;
    }

    return {
      name: `${fullName} - Bhutan E-Residency Certificate`,
      description: `This NFT represents an official digital residency certificate for ${fullName} in the Kingdom of Bhutan.`,
      image: formattedImageUrl,
      external_url: "https://bhutan-eresidency.gov.bt",
      background_color: "1E40AF",
      attributes: [
        {
          trait_type: "Full Name",
          value: fullName,
        },
        {
          trait_type: "Residency Type",
          value: userType,
        },
        {
          trait_type: "Issue Date",
          value: new Date().toISOString().split("T")[0],
        },
        {
          trait_type: "Country",
          value: "Bhutan",
        },
        {
          trait_type: "Status",
          value: "Active",
        },
        {
          trait_type: "Certificate ID",
          value: `BT-${Date.now()}`,
        },
      ],
    };
  };

  const uploadMetadataToPinata = async (
    fullName: string,
    userType: string,
    imageUrl: string
  ): Promise<string> => {
    try {
      const metadata = createNFTMetadata(fullName, userType, imageUrl);

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
          },
          body: JSON.stringify({
            pinataContent: metadata,
            pinataMetadata: {
              name: `${fullName}-residency-metadata`,
              keyvalues: {
                type: "nft-metadata",
                user: fullName,
                country: "bhutan",
              },
            },
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error?.details || "Failed to upload metadata to Pinata"
        );
      }

      const data = await res.json();
      return `https://aqua-rare-worm-454.mypinata.cloud/ipfs/${data.IpfsHash}`;
    } catch (err: unknown) {
      console.error("Pinata metadata upload error:", err);
      throw new Error(
        `Failed to upload metadata to Pinata: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  const totalPendingCount =
    pendingKycList.length +
    pendingBhutaneseKyc.length +
    pendingBusinessList.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 -z-10 opacity-10 pointer-events-none">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.12) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.12) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            animation: "grid-move 20s linear infinite",
          }}
        ></div>
      </div>
      <WalletProvider>
        <Navbar />
      </WalletProvider>
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
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="bg-white rounded-2xl shadow-xl p-10 mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-1">
              Verifier Dashboard
            </h1>
            <p className="text-gray-600 mb-2">
              Review and verify pending submissions
            </p>
            <div className="flex gap-4 text-sm text-gray-600">
              <span>E-Residency: {pendingKycList.length}</span>
              <span>Bhutanese Citizens: {pendingBhutaneseKyc.length}</span>
              <span>Business: {pendingBusinessList.length}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
            <span className="text-sm text-gray-700 font-mono">Live</span>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center text-lg text-blue-700 font-semibold animate-pulse py-12">
            Loading pending submissions...
          </div>
        ) : totalPendingCount === 0 ? (
          <div className="text-center text-lg text-gray-500 py-20">
            <div className="text-6xl mb-6">🔍</div>
            <p className="text-xl">No pending submissions found.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* E-Residency KYC Section */}
            {pendingKycList.length > 0 && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-blue-900 mb-2">
                    E-Residency Applications
                  </h2>
                  <p className="text-gray-600">
                    Pending e-residency KYC submissions
                  </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {pendingKycList.map((kyc) => (
                    <div
                      key={kyc.kycId.toString()}
                      className="bg-white border border-blue-100 rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow duration-200"
                    >
                      <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-3">
                        <span className="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
                        {kyc.fullName}
                      </h3>
                      <div className="mb-6 text-gray-700 text-sm space-y-3">
                        <div className="flex flex-col sm:flex-row sm:gap-2">
                          <span className="font-medium text-gray-800 min-w-[80px]">
                            Email:
                          </span>
                          <span className="break-all">{kyc.email}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:gap-2">
                          <span className="font-medium text-gray-800 min-w-[80px]">
                            Phone:
                          </span>
                          <span>{kyc.phoneNumber}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:gap-2">
                          <span className="font-medium text-gray-800 min-w-[80px]">
                            Address:
                          </span>
                          <span>{kyc.residenceAddress}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:gap-2">
                          <span className="font-medium text-gray-800 min-w-[80px]">
                            User Type:
                          </span>
                          <span>
                            {kyc.userType === 0 ? "Individual" : "Business"}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:gap-2">
                          <span className="font-medium text-gray-800 min-w-[80px]">
                            Document Hash:
                          </span>
                          <span className="break-all text-xs bg-gray-50 p-2 rounded">
                            {kyc.documentHash}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleVerify(kyc.userAddress)}
                        disabled={isVerifying === kyc.userAddress}
                        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                          isVerifying === kyc.userAddress
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {isVerifying === kyc.userAddress ? (
                          <span className="flex items-center gap-2 justify-center">
                            <svg
                              className="animate-spin h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Verifying...
                          </span>
                        ) : (
                          "Verify & Mint NFT"
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bhutanese KYC Section */}
            {pendingBhutaneseKyc.length > 0 && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-purple-900 mb-2">
                    Bhutanese Citizen Applications
                  </h2>
                  <p className="text-gray-600">
                    Pending Bhutanese citizen KYC submissions
                  </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {pendingBhutaneseKyc.map((kyc) => (
                    <div
                      key={kyc.kycId.toString()}
                      className="bg-white border border-purple-100 rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow duration-200"
                    >
                      <h3 className="text-xl font-semibold text-purple-900 mb-4 flex items-center gap-3">
                        <span className="inline-block w-2 h-2 bg-purple-400 rounded-full"></span>
                        {kyc.fullName}
                      </h3>
                      <div className="mb-6 text-gray-700 text-sm space-y-3">
                        <div className="flex flex-col sm:flex-row sm:gap-2">
                          <span className="font-medium text-gray-800 min-w-[120px]">
                            Email:
                          </span>
                          <span className="break-all">{kyc.email}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:gap-2">
                          <span className="font-medium text-gray-800 min-w-[120px]">
                            Phone:
                          </span>
                          <span>{kyc.phoneNumber}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:gap-2">
                          <span className="font-medium text-gray-800 min-w-[120px]">
                            Address:
                          </span>
                          <span>{kyc.residenceAddress}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:gap-2">
                          <span className="font-medium text-gray-800 min-w-[120px]">
                            Citizenship #:
                          </span>
                          <span>{kyc.citizenshipNumber}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:gap-2">
                          <span className="font-medium text-gray-800 min-w-[120px]">
                            Document Hash:
                          </span>
                          <span className="break-all text-xs bg-gray-50 p-2 rounded">
                            {kyc.documentHash}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:gap-2">
                          <span className="font-medium text-gray-800 min-w-[120px]">
                            Submitted:
                          </span>
                          <span>
                            {new Date(
                              Number(kyc.submissionTime) * 1000
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleVerifyBhutanese(kyc.userAddress)}
                        disabled={isVerifyingBhutanese === kyc.userAddress}
                        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                          isVerifyingBhutanese === kyc.userAddress
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-purple-600 text-white hover:bg-purple-700"
                        }`}
                      >
                        {isVerifyingBhutanese === kyc.userAddress ? (
                          <span className="flex items-center gap-2 justify-center">
                            <svg
                              className="animate-spin h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Verifying...
                          </span>
                        ) : (
                          "Verify Bhutanese KYC"
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Business Listings Section */}
            {pendingBusinessList.length > 0 && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-green-900 mb-2">
                    Business Applications
                  </h2>
                  <p className="text-gray-600">
                    Pending business listing submissions
                  </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {pendingBusinessList.map((business) => (
                    <div
                      key={business.listingId.toString()}
                      className="bg-white border border-green-100 rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow duration-200"
                    >
                      <h3 className="text-xl font-semibold text-green-900 mb-4 flex items-center gap-3">
                        <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
                        {business.businessName}
                      </h3>
                      <div className="mb-6 text-gray-700 text-sm space-y-3">
                        <div className="flex flex-col sm:flex-row sm:gap-2">
                          <span className="font-medium text-gray-800 min-w-[120px]">
                            Applicant:
                          </span>
                          <span className="break-all text-xs bg-gray-50 p-2 rounded">
                            {business.applicant}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:gap-2">
                          <span className="font-medium text-gray-800 min-w-[120px]">
                            Type:
                          </span>
                          <span>{business.businessType}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:gap-2">
                          <span className="font-medium text-gray-800 min-w-[120px]">
                            Description:
                          </span>
                          <span>{business.businessDescription}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:gap-2">
                          <span className="font-medium text-gray-800 min-w-[120px]">
                            Documents:
                          </span>
                          <span className="break-all text-xs bg-gray-50 p-2 rounded">
                            {business.documentsHash}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:gap-2">
                          <span className="font-medium text-gray-800 min-w-[120px]">
                            Submitted:
                          </span>
                          <span>
                            {new Date(
                              Number(business.submittedAt) * 1000
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            handleVerifyBusiness(business.listingId.toString())
                          }
                          disabled={
                            isVerifyingBusiness ===
                            business.listingId.toString()
                          }
                          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                            isVerifyingBusiness ===
                            business.listingId.toString()
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-green-600 text-white hover:bg-green-700"
                          }`}
                        >
                          {isVerifyingBusiness ===
                          business.listingId.toString() ? (
                            <span className="flex items-center gap-2 justify-center">
                              <svg
                                className="animate-spin h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Verifying...
                            </span>
                          ) : (
                            "Verify Business"
                          )}
                        </button>
                        {/* <button
                          onClick={() => {
                            const reason = prompt("Enter rejection reason:");
                            if (reason) {
                              // You'll need to implement handleRejectBusiness function
                              console.log(
                                "Rejecting business with reason:",
                                reason
                              );
                            }
                          }}
                          className="px-4 py-3 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition-all duration-200"
                        >
                          Reject
                        </button> */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes grid-move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
      `}</style>
    </div>
  );
};

export default VerifierPage;
