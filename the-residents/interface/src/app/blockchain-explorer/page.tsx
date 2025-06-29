'use client';

import { useState } from 'react';

export default function BlockchainExplorer() {
  const [searchType, setSearchType] = useState<'nft' | 'company'>('nft');

  const generateExampleLinks = () => {
    if (searchType === 'nft') {
      return {
        polygonScan: `https://amoy.polygonscan.com/token/0xCd1242b6E41C3Fa77093446e569487A95601058D?a=1`,
        openSea: `https://testnets.opensea.io/assets/amoy/0xCd1242b6E41C3Fa77093446e569487A95601058D/1`,
        description: 'View your eResidency NFT on the blockchain'
      };
    } else {
      return {
        polygonScan: `https://amoy.polygonscan.com/address/CONTRACT_ADDRESS`,
        events: `https://amoy.polygonscan.com/address/CONTRACT_ADDRESS#events`,
        description: 'View company registration events and hashes'
      };
    }
  };

  const links = generateExampleLinks();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            🔍 Blockchain Explorer Guide
          </h1>
          
          <p className="text-gray-600 mb-8">
            Learn how to view your data on the blockchain and get PolygonScan links.
          </p>

          {/* Search Type Selector */}
          <div className="mb-8">
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => setSearchType('nft')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  searchType === 'nft'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🏔️ eResidency NFT
              </button>
              <button
                onClick={() => setSearchType('company')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  searchType === 'company'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🏢 Company Registry
              </button>
            </div>
          </div>

          {/* NFT Section */}
          {searchType === 'nft' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-blue-900 mb-3">
                  🏔️ Your eResidency NFT
                </h2>
                                 <p className="text-blue-700 mb-4">
                   Your NFT is stored on Polygon Amoy testnet. Here&apos;s how to view it:
                 </p>
                
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-blue-900">Contract Address:</span>
                    <code className="ml-2 px-2 py-1 bg-blue-100 rounded text-sm">
                      0xCd1242b6E41C3Fa77093446e569487A95601058D
                    </code>
                  </div>
                  <div>
                    <span className="font-medium text-blue-900">Token ID:</span>
                    <code className="ml-2 px-2 py-1 bg-blue-100 rounded text-sm">1</code>
                  </div>
                  <div>
                    <span className="font-medium text-blue-900">Network:</span>
                    <span className="ml-2">Polygon Amoy Testnet</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <a
                    href={links.polygonScan}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    View on PolygonScan →
                  </a>
                  <a
                    href={links.openSea}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors"
                  >
                    View on OpenSea →
                  </a>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-md font-semibold text-gray-900 mb-3">
                  📋 What you can see on PolygonScan:
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>Token Details:</strong> Name, symbol, and metadata</li>
                  <li>• <strong>Owner Address:</strong> Your wallet address</li>
                  <li>• <strong>Transfer History:</strong> When it was minted</li>
                  <li>• <strong>Contract Info:</strong> Smart contract code and functions</li>
                  <li>• <strong>Metadata:</strong> Your eResidency ID and details</li>
                </ul>
              </div>
            </div>
          )}

          {/* Company Section */}
          {searchType === 'company' && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-green-900 mb-3">
                  🏢 Company Registry (Coming Soon)
                </h2>
                <p className="text-green-700 mb-4">
                  Once you deploy the DrukCompanyRegistry contract, company hashes will be stored here:
                </p>
                
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-green-900">Contract:</span>
                    <code className="ml-2 px-2 py-1 bg-green-100 rounded text-sm">
                      Will be deployed after getting testnet MATIC
                    </code>
                  </div>
                  <div>
                    <span className="font-medium text-green-900">Event:</span>
                    <code className="ml-2 px-2 py-1 bg-green-100 rounded text-sm">NewEntityCreated</code>
                  </div>
                  <div>
                    <span className="font-medium text-green-900">Network:</span>
                    <span className="ml-2">Polygon Amoy Testnet</span>
                  </div>
                </div>

                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ <strong>Next Steps:</strong>
                    <br />
                    1. Get testnet MATIC from the faucet
                    <br />
                    2. Deploy the DrukCompanyRegistry contract
                    <br />
                    3. Register a company to see the hash stored on-chain
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-md font-semibold text-gray-900 mb-3">
                  🔐 How Company Hashing Works:
                </h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div>
                    <strong>1. Data Collection:</strong>
                    <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
{`{
  "companyName": "Acme Corp",
  "companyType": "LLC",
  "owner": "user123",
  "timestamp": 1751147266431
}`}
                    </pre>
                  </div>
                  <div>
                    <strong>2. Hashing:</strong>
                    <code className="block mt-1 p-2 bg-gray-100 rounded text-xs">
                      keccak256(JSON.stringify(data)) → 0xabc123...
                    </code>
                  </div>
                  <div>
                    <strong>3. Blockchain Storage:</strong>
                    <p className="mt-1">Hash is stored in a NewEntityCreated event with your wallet address and timestamp</p>
                  </div>
                  <div>
                    <strong>4. Verification:</strong>
                    <p className="mt-1">Anyone can verify the company data by hashing it and comparing with the blockchain</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
            <h3 className="text-md font-semibold text-indigo-900 mb-3">
              🚀 How to Get PolygonScan Links:
            </h3>
            <ol className="space-y-2 text-sm text-indigo-700">
              <li><strong>1. Transaction Hash:</strong> Copy from success message → Paste in PolygonScan search</li>
              <li><strong>2. Contract Address:</strong> Use contract address + token ID for NFTs</li>
              <li><strong>3. Events:</strong> Go to contract page → Events tab → Filter by your address</li>
              <li><strong>4. Direct Links:</strong> The app automatically generates these for you</li>
            </ol>
          </div>

          <div className="mt-6 text-center">
            <a
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 