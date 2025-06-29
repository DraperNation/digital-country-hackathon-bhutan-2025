import React from 'react';
import { Award, ExternalLink, Download } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface NFTCardProps {
  tokenId: number;
  name: string;
  description: string;
  image: string; // Example: 'n1.jpg'
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

export const NFTCard: React.FC<NFTCardProps> = ({
  tokenId,
  name,
  description,
  image,
  rarity,
  attributes
}) => {
  const { theme } = useTheme();

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'from-gray-500 to-gray-600';
      case 'Rare': return 'from-blue-500 to-blue-600';
      case 'Epic': return 'from-purple-500 to-purple-600';
      case 'Legendary': return 'from-orange-500 to-red-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRarityTextColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'text-gray-200';
      case 'Rare': return 'text-blue-200';
      case 'Epic': return 'text-purple-200';
      case 'Legendary': return 'text-yellow-200';
      default: return 'text-gray-200';
    }
  };

  // Directly reference the image in /public/nft/


  return (
    <div className="glass-card rounded-xl overflow-hidden border border-white/20 group hover:transform hover:-translate-y-2 transition-all duration-300">
      {/* NFT Image */}
      <div className="relative overflow-hidden">
<img
  src={image}
  alt={name}
  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
  onError={(e) => {
    const target = e.target as HTMLImageElement;
    target.src =
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMUYyOTM3Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzE2MS4zNDMgMTAwIDEzMCAxMzEuMzQzIDEzMCAxNzBDMTMwIDIwOC42NTcgMTYxLjM0MyAyNDAgMjAwIDI0MEM2MzguNjU3IDI0MCAyNzAgMjA4LjY1NyAyNzAgMTcwQzI3MCAxMzEuMzQzIDIzOC42NTcgMTAwIDIwMCAxMDBaIiBmaWxsPSIjRjk3MzE2Ii8+CjwvZz4KPC9zdmc+';
  }}
/>

        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getRarityColor(rarity)} text-white`}>
            <Award className="h-3 w-3 mr-1" />
            {rarity}
          </span>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black/50 text-white backdrop-blur-sm">
            #{tokenId}
          </span>
        </div>
      </div>

      {/* NFT Details */}
      <div className="p-6">
        <h3 className={`text-xl font-display font-bold mb-2 text-shadow ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
          {name}
        </h3>
        <p className={`text-sm mb-4 text-shadow ${theme === 'dark' ? 'text-white/90' : 'text-slate-600'}`}>
          {description}
        </p>

        {/* Attributes */}
        <div className="space-y-2 mb-4">
          <h4 className={`text-sm font-medium text-shadow ${theme === 'dark' ? 'text-white/80' : 'text-slate-700'}`}>Attributes:</h4>
          <div className="grid grid-cols-2 gap-2">
            {attributes.map((attr, index) => (
              <div
                key={index}
                className={`rounded-lg p-2 ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-100'}`}
              >
                <div className={`text-xs ${theme === 'dark' ? 'text-white/70 text-shadow' : 'text-slate-500'}`}>
                  {attr.trait_type}
                </div>
                <div className={`text-sm font-medium text-shadow ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  {attr.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-colors text-sm font-medium">
            <ExternalLink className="h-4 w-4 mr-2" />
            View on OpenSea
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-colors border ${
              theme === 'dark'
                ? 'glass text-white hover:bg-white/20 border-white/30'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
            }`}
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
