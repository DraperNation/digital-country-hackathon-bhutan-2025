"use client";

import { useState } from "react";
import { ethers, BrowserProvider } from "ethers";
import { ADDRESS, ABI } from "@/lib/constant_contracts";

const RegisterPage = () => {
  const [form, setForm] = useState({
    tokenId: "",
    price: "",
    description: "",
    documentsHash: "",
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: string }>({
    message: "",
    type: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showAlert = (message: string, type: string = "info") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (typeof window === "undefined" || !(window as any).ethereum) {
        showAlert("MetaMask is not installed!", "error");
        setLoading(false);
        return;
      }
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(ADDRESS, ABI, signer);
      // ResidencyType.Business = 1 (see contract)
      const tx = await contract.createListing(
        1, // ResidencyType.Business
        ethers.parseEther(form.price),
        form.description,
        form.documentsHash
      );
      await tx.wait();
      showAlert("Business listing created!", "success");
      setForm({ tokenId: "", price: "", description: "", documentsHash: "" });
    } catch (err: any) {
      showAlert(err.message || "Failed to create listing", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
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
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg space-y-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          List Your E-Business
        </h1>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Resident ID (tokenId)
          </label>
          <input
            type="text"
            name="tokenId"
            value={form.tokenId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your Residency NFT tokenId"
            required
            disabled
          />
          <p className="text-xs text-gray-500 mt-1">
            (Auto-detected from your wallet, not needed for listing)
          </p>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Price (in ETH)
          </label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="e.g. 0.5"
            min="0.0001"
            step="0.0001"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Business Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Describe your e-business..."
            rows={3}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Documents Hash (IPFS)
          </label>
          <input
            type="text"
            name="documentsHash"
            value={form.documentsHash}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="IPFS hash of business docs"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Listing..." : "List E-Business"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
