"use client";
import { useState } from "react";

const mockNFTs = [
  {
    tokenId: "#001",
    image: "/images/nft/sample1.png",
    name: "eResidency Genesis NFT",
    description: "Your official eResidency NFT badge.",
    date: "2025-06-01",
    tx: "0xabc123...",
  },
  {
    tokenId: "#002",
    image: "/images/nft/sample2.png",
    name: "eResidency Anniversary NFT",
    description: "Celebrating 1 year of eResidency.",
    date: "2025-06-15",
    tx: "0xdef456...",
  },
];

const mockVCs = [
  {
    id: "vc-1",
    type: "eResidency",
    issued: "2025-06-01",
    status: "Valid",
    details: {
      name: "Kiran S.",
      did: "did:ebhutan:123",
      credentialId: "VC-001",
    },
  },
];

export default function NFTPage() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [minting, setMinting] = useState(false);
  const [issuing, setIssuing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [nfts, setNfts] = useState(mockNFTs);
  const [vcs, setVCs] = useState(mockVCs);
  const [showModal, setShowModal] = useState<null | any>(null);

  const handleConnectWallet = () => {
    setWallet("0x1234...abcd");
    setStatus(null);
  };

  const handleMintNFT = async () => {
    setMinting(true);
    setStatus("Minting NFT...");
    setTimeout(() => {
      setNfts((prev) => [
        ...prev,
        {
          tokenId: `#00${prev.length + 1}`,
          image: "/images/nft/sample1.png",
          name: "eResidency NFT",
          description: "Mock NFT minted.",
          date: new Date().toISOString().slice(0, 10),
          tx: "0xnewmint...",
        },
      ]);
      setMinting(false);
      setStatus("NFT minted successfully!");
    }, 2000);
  };

  const handleIssueVC = async () => {
    setIssuing(true);
    setStatus("Issuing Verifiable Credential...");
    setTimeout(() => {
      setVCs((prev) => [
        ...prev,
        {
          id: `vc-${prev.length + 1}`,
          type: "eResidency",
          issued: new Date().toISOString().slice(0, 10),
          status: "Valid",
          details: {
            name: "Kiran S.",
            did: "did:ebhutan:123",
            credentialId: `VC-00${prev.length + 1}`,
          },
        },
      ]);
      setIssuing(false);
      setStatus("Verifiable Credential issued!");
    }, 2000);
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold">
        Mint eResidency NFT / Issue Verifiable Credential
      </h2>
      <div className="mb-6 flex items-center gap-4">
        {wallet ? (
          <span className="rounded bg-green-50 px-3 py-1 font-mono text-green-700">
            {wallet}
          </span>
        ) : (
          <button
            className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            onClick={handleConnectWallet}
          >
            Connect Wallet
          </button>
        )}
        <button
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
          onClick={handleMintNFT}
          disabled={!wallet || minting}
        >
          {minting ? "Minting..." : "Mint eResidency NFT"}
        </button>
        <button
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-60"
          onClick={handleIssueVC}
          disabled={!wallet || issuing}
        >
          {issuing ? "Issuing..." : "Issue Verifiable Credential"}
        </button>
      </div>
      {status && <div className="mb-4 text-sm text-blue-700">{status}</div>}
      <div className="mb-8">
        <h3 className="mb-2 text-lg font-semibold">Your eResidency NFTs</h3>
        {nfts.length === 0 ? (
          <div className="text-gray-500">No NFTs minted yet.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {nfts.map((nft) => (
              <div
                key={nft.tokenId}
                className="flex flex-col items-center rounded-xl border bg-white p-4 shadow"
              >
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="mb-2 h-24 w-24 rounded border object-cover"
                  onClick={() => setShowModal(nft)}
                  style={{ cursor: "pointer" }}
                />
                <div className="font-bold">{nft.name}</div>
                <div className="text-xs text-gray-500">{nft.tokenId}</div>
                <div className="mb-1 text-xs text-gray-400">{nft.date}</div>
                <button
                  className="text-xs text-blue-600 hover:underline"
                  onClick={() => setShowModal(nft)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mb-8">
        <h3 className="mb-2 text-lg font-semibold">
          Your Verifiable Credentials
        </h3>
        {vcs.length === 0 ? (
          <div className="text-gray-500">No credentials issued yet.</div>
        ) : (
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Issued</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vcs.map((vc) => (
                <tr key={vc.id} className="border-t">
                  <td className="p-2">{vc.type}</td>
                  <td className="p-2">{vc.issued}</td>
                  <td className="p-2">{vc.status}</td>
                  <td className="p-2">
                    <button
                      className="text-xs text-blue-600 hover:underline"
                      onClick={() => setShowModal(vc)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div>
        <h3 className="mb-2 text-lg font-semibold">Recent Activity</h3>
        <ul className="space-y-1 text-sm text-gray-700">
          {nfts.map((nft) => (
            <li key={nft.tokenId}>
              🖼️ Minted NFT <span className="font-mono">{nft.tokenId}</span> on{" "}
              {nft.date} (tx: {nft.tx})
            </li>
          ))}
          {vcs.map((vc) => (
            <li key={vc.id}>
              📜 Issued VC{" "}
              <span className="font-mono">{vc.details.credentialId}</span> on{" "}
              {vc.issued}
            </li>
          ))}
        </ul>
      </div>
      {showModal && (
        <Modal onClose={() => setShowModal(null)}>
          {showModal.image ? (
            <div className="flex flex-col items-center">
              <img
                src={showModal.image}
                alt={showModal.name}
                className="mb-2 h-32 w-32 rounded border object-cover"
              />
              <div className="mb-1 font-bold">{showModal.name}</div>
              <div className="mb-1 text-xs text-gray-500">
                {showModal.tokenId}
              </div>
              <div className="mb-2 text-xs text-gray-400">{showModal.date}</div>
              <div className="mb-2 text-center">{showModal.description}</div>
              <div className="text-xs text-gray-500">Tx: {showModal.tx}</div>
            </div>
          ) : (
            <div>
              <div className="mb-2 font-bold">Verifiable Credential</div>
              <pre className="overflow-x-auto rounded bg-gray-100 p-2 text-xs">
                {JSON.stringify(showModal, null, 2)}
              </pre>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative min-w-[320px] max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <button
          className="absolute right-2 top-2 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
