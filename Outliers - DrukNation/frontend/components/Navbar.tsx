"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useWallet } from "../context/WalletConnect";

interface NavbarProps {
  className?: string;
}

interface Toast {
  id: number;
  message: string;
  type: "error" | "success" | "warning";
}

const Navbar: React.FC<NavbarProps> = ({ className = "" }) => {
  const { isWalletConnected, walletAddress, connectWallet, disconnectWallet } =
    useWallet();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [toastId, setToastId] = useState(0);

  // Function to show toast
  const showToast = (
    message: string,
    type: "error" | "success" | "warning" = "error"
  ) => {
    const id = toastId + 1;
    setToastId(id);

    const newToast: Toast = {
      id,
      message,
      type,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove toast after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  // Function to remove toast manually
  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Enhanced wallet connection handler
  const handleConnectWallet = async () => {
    try {
      // Check if wallet is available
      if (typeof window !== "undefined" && !(window as any).ethereum) {
        showToast(
          "No crypto wallet found. Please install MetaMask or another Web3 wallet.",
          "error"
        );
        return;
      }

      await connectWallet();

      // Show success toast if connection was successful
      if (isWalletConnected) {
        showToast("Wallet connected successfully!", "success");
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);
      showToast("Failed to connect wallet. Please try again.", "error");
    }
  };

  // Check wallet availability on component mount
  useEffect(() => {
    if (typeof window !== "undefined" && !(window as any).ethereum) {
      showToast(
        "No Web3 wallet detected. Install MetaMask to connect.",
        "warning"
      );
    }
  }, []);

  // Toast component styles
  const getToastStyles = (type: string) => {
    const baseStyles =
      "flex items-center gap-3 p-4 rounded-lg shadow-lg border-l-4 min-w-80 max-w-md";

    switch (type) {
      case "error":
        return `${baseStyles} bg-red-50 border-red-500 text-red-800`;
      case "success":
        return `${baseStyles} bg-green-50 border-green-500 text-green-800`;
      case "warning":
        return `${baseStyles} bg-yellow-50 border-yellow-500 text-yellow-800`;
      default:
        return `${baseStyles} bg-gray-50 border-gray-500 text-gray-800`;
    }
  };

  const getToastIcon = (type: string) => {
    switch (type) {
      case "error":
        return (
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "success":
        return (
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "warning":
        return (
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <nav
        className={`flex items-center justify-between px-6 py-4 bg-transparent ${className}`}
      >
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <h1 className="text-2xl font-semibold text-blue-900 tracking-wide cursor-pointer">
              DrukNation
            </h1>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/chatbot"
            className="text-gray-700 hover:text-gray-900 font-light tracking-wide transition-colors duration-200"
          >
            Chatbot
          </Link>

          <Link
            href="/e-residency"
            className="text-gray-700 hover:text-gray-900 font-light tracking-wide transition-colors duration-200"
          >
            E-Resident
          </Link>

          <Link
            href="/property-deals"
            className="text-gray-700 hover:text-gray-900 font-light tracking-wide transition-colors duration-200"
          >
            Property
          </Link>

          <Link
            href="/business"
            className="text-gray-700 hover:text-gray-900 font-light tracking-wide transition-colors duration-200"
          >
            Business
          </Link>
        </div>

        {/* Wallet Connection */}
        <div className="flex items-center">
          {isWalletConnected ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-mono">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </div>
              <button
                onClick={disconnectWallet}
                className="px-4 py-2 bg-red-100 border border-red-300 text-red-700 font-semibold rounded-full hover:bg-red-200 transition-all duration-200 text-sm"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnectWallet}
              className="px-6 py-2 bg-white border-2 border-gray-900 text-gray-900 font-semibold rounded-full hover:bg-gray-900 hover:text-white transition-all duration-200"
            >
              Connect Wallet
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button className="text-gray-700 hover:text-gray-900">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${getToastStyles(toast.type)} animate-slide-in-right`}
          >
            {getToastIcon(toast.type)}
            <div className="flex-1">
              <p className="font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 ml-2 hover:opacity-70 transition-opacity"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;
