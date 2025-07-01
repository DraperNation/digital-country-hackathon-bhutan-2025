"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ethers, BrowserProvider, JsonRpcSigner } from "ethers";

interface WalletContextType {
  isWalletConnected: boolean;
  walletAddress: string;
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  showAlert: (message: string, type?: string) => void;
  alert: { message: string; type: string };
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isWalletConnected, setWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: string }>({
    message: "",
    type: "",
  });

  useEffect(() => {
    loadWallet();
  }, []);

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
    sessionStorage.removeItem("walletAddress");
    showAlert("Wallet disconnected", "info");
  };

  const value: WalletContextType = {
    isWalletConnected,
    walletAddress,
    provider,
    signer,
    connectWallet,
    disconnectWallet,
    showAlert,
    alert,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};
