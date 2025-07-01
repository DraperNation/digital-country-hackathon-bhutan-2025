'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Entity = {
  id: string;
  name: string;
  status: string;
  registrationDate: string;
  registrationNumber: string;
};

type Resident = {
  id: string;
  name: string;
  residencyDate: string;
  isPublic: boolean;
  walletAddress?: string;
  entities: Entity[];
};

type DirectoryData = {
  residents: Resident[];
  totalCount: number;
  publicCount: number;
  privateCount: number;
};

type DirectoryStats = {
  totalResidents: number;
  totalEntities: number;
  publicResidents: number;
  privateResidents: number;
  recentResidents: number;
};

export default function PublicDirectoryPage() {
  const [directoryData, setDirectoryData] = useState<DirectoryData | null>(null);
  const [stats, setStats] = useState<DirectoryStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPrivateResidents, setShowPrivateResidents] = useState(true);

  useEffect(() => {
    const fetchDirectoryData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch directory data and stats in parallel
        const [directoryResponse, statsResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/directory`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/directory/stats`)
        ]);

        if (!directoryResponse.ok || !statsResponse.ok) {
          throw new Error('Failed to fetch directory data');
        }

        const directoryResult = await directoryResponse.json();
        const statsResult = await statsResponse.json();

        console.log('Directory API response:', directoryResult);
        console.log('Stats API response:', statsResult);

        if (directoryResult.success) {
          setDirectoryData(directoryResult.message);
        } else {
          console.error('Directory API failed:', directoryResult);
        }

        if (statsResult.success) {
          setStats(statsResult.message);
        } else {
          console.error('Stats API failed:', statsResult);
        }

      } catch (error) {
        console.error('Error fetching directory:', error);
        setError('Failed to load public directory');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDirectoryData();
  }, []);

  const filteredResidents = directoryData?.residents?.filter(resident => {
    const matchesSearch = resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resident.entities.some(entity => entity.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPrivacyFilter = showPrivateResidents || resident.isPublic;
    
    return matchesSearch && matchesPrivacyFilter;
  }) || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading public directory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-medium text-gray-900 mb-2">
                Public Directory
              </h1>
              <p className="text-gray-500 text-sm">
                Verified digital residents and entities in Bhutan's e-Residency program
              </p>
            </div>
            <Link 
              href="/"
              className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Apply for e-Residency
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-5 gap-8 mb-12">
            <div>
              <div className="text-2xl font-medium text-gray-900">{stats.totalResidents}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Residents</div>
            </div>
            <div>
              <div className="text-2xl font-medium text-gray-900">{stats.totalEntities}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Entities</div>
            </div>
            <div>
              <div className="text-2xl font-medium text-green-600">{stats.publicResidents}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Public</div>
            </div>
            <div>
              <div className="text-2xl font-medium text-gray-400">{stats.privateResidents}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Private</div>
            </div>
            <div>
              <div className="text-2xl font-medium text-blue-600">{stats.recentResidents}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Recent</div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search residents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
            />
            <label className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                checked={showPrivateResidents}
                onChange={(e) => setShowPrivateResidents(e.target.checked)}
                className="mr-2 w-4 h-4"
              />
              Include private
            </label>
          </div>
          <div className="text-sm text-gray-500">
            {filteredResidents.length} of {directoryData?.totalCount || 0}
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-4 h-4 rounded-full bg-gray-300 mt-0.5 flex-shrink-0"></div>
            <div>
              <p className="text-sm text-gray-700 leading-relaxed">
                This directory balances transparency with privacy. Residents can opt for public profiles 
                or remain private with pseudonymized data. All information is blockchain-verified.
              </p>
            </div>
          </div>
        </div>

        {/* Residents List */}
        <div className="space-y-1">
          {!directoryData || !directoryData.residents ? (
            <div className="text-center py-16">
              <p className="text-gray-500">No directory data available</p>
            </div>
          ) : filteredResidents.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">No residents found</p>
            </div>
          ) : (
            filteredResidents.map((resident) => (
              <div key={resident.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${resident.isPublic ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{resident.name}</div>
                      <div className="text-xs text-gray-500">
                        Resident since {formatDate(resident.residencyDate)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    {/* Entities */}
                    {resident.entities.length > 0 && (
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {resident.entities[0].name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {resident.entities[0].status}
                          {resident.entities.length > 1 && ` +${resident.entities.length - 1} more`}
                        </div>
                      </div>
                    )}
                    
                    {/* Wallet */}
                    {resident.walletAddress && (
                      <div className="text-right">
                        <div className="text-sm font-mono text-gray-700">
                          {truncateAddress(resident.walletAddress)}
                        </div>
                        <div className="text-xs text-gray-500">Wallet</div>
                      </div>
                    )}
                    
                    {/* Status */}
                    <div className="flex items-center">
                      {resident.isPublic ? (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                          Public
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                          Private
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            Powered by blockchain technology • Kingdom of Bhutan Digital Government Initiative
          </p>
        </div>
      </div>
    </div>
  );
} 