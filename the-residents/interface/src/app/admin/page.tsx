'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type KycStatus = 'pending' | 'approved' | 'rejected' | 'in_review';

type KycSubmission = {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    passportNumber?: string;
  };
  status: KycStatus;
  submittedAt: string;
  reviewedAt?: string;
  comments?: string;
};

type Company = {
  _id: string;
  companyName: string;
  companyType: string;
  businessActivity: string;
  registrationNumber: string;
  taxId: string;
  status: string;
  registrationDate: string;
  owner: {
    _id: string;
    fullName: string;
    email: string;
  };
};

type DashboardStats = {
  totalUsers: number;
  totalKycSubmissions: number;
  pendingKyc: number;
  approvedKyc: number;
  rejectedKyc: number;
  totalCompanies: number;
  recentUsers: number;
  recentCompanies: number;
};

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'kyc' | 'companies' | 'logs'>('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [kycSubmissions, setKycSubmissions] = useState<KycSubmission[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchDashboardStats();
    if (activeTab === 'kyc') {
      fetchKycSubmissions();
    } else if (activeTab === 'companies') {
      fetchCompanies();
    }
  }, [activeTab]);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`);
      const result = await response.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchKycSubmissions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/kyc`);
      const result = await response.json();
      if (result.success) {
        setKycSubmissions(result.data);
      }
    } catch (error) {
      console.error('Error fetching KYC submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/companies`);
      const result = await response.json();
      if (result.success) {
        setCompanies(result.data);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKycAction = async (id: string, action: 'approve' | 'reject', comments?: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/kyc/${id}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comments }),
      });

      const result = await response.json();
      if (result.success) {
        fetchKycSubmissions();
        fetchDashboardStats();
        alert(`KYC ${action}d successfully`);
      } else {
        alert(`Failed to ${action} KYC: ${result.message}`);
      }
    } catch (error) {
      console.error(`Error ${action}ing KYC:`, error);
      alert(`Failed to ${action} KYC`);
    }
  };

  const getStatusBadge = (status: KycStatus) => {
    const statusConfig = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Approved', color: 'bg-green-100 text-green-800' },
      rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
      in_review: { label: 'In Review', color: 'bg-blue-100 text-blue-800' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredKycSubmissions = kycSubmissions.filter(submission => {
    const matchesSearch = submission.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.owner.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-medium text-gray-900">Admin Panel</h1>
              <p className="text-gray-500 text-sm mt-1">Manage e-Residency applications and entities</p>
            </div>
            <Link 
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Portal
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-100 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'kyc', label: 'KYC Submissions' },
              { id: 'companies', label: 'Companies' },
              { id: 'logs', label: 'Audit Logs' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-2xl font-medium text-gray-900">{stats.totalUsers}</div>
                  <div className="text-sm text-gray-500 mt-1">Total Users</div>
                  <div className="text-xs text-gray-400 mt-1">+{stats.recentUsers} this month</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-2xl font-medium text-yellow-600">{stats.pendingKyc}</div>
                  <div className="text-sm text-gray-500 mt-1">Pending KYC</div>
                  <div className="text-xs text-gray-400 mt-1">{stats.totalKycSubmissions} total</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-2xl font-medium text-green-600">{stats.approvedKyc}</div>
                  <div className="text-sm text-gray-500 mt-1">Approved KYC</div>
                  <div className="text-xs text-gray-400 mt-1">{stats.rejectedKyc} rejected</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-2xl font-medium text-blue-600">{stats.totalCompanies}</div>
                  <div className="text-sm text-gray-500 mt-1">Registered Companies</div>
                  <div className="text-xs text-gray-400 mt-1">+{stats.recentCompanies} this month</div>
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('kyc')}
                  className="text-left p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="font-medium text-gray-900">Review KYC Applications</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {stats?.pendingKyc || 0} pending applications
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('companies')}
                  className="text-left p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="font-medium text-gray-900">Manage Companies</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {stats?.totalCompanies || 0} registered entities
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('logs')}
                  className="text-left p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="font-medium text-gray-900">View Audit Logs</div>
                  <div className="text-sm text-gray-500 mt-1">System activity tracking</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* KYC Tab */}
        {activeTab === 'kyc' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="text-sm text-gray-500">
                {filteredKycSubmissions.length} of {kycSubmissions.length} submissions
              </div>
            </div>

            {/* KYC Submissions Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                          Loading...
                        </td>
                      </tr>
                    ) : filteredKycSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                          No KYC submissions found
                        </td>
                      </tr>
                    ) : (
                      filteredKycSubmissions.map((submission) => (
                        <tr key={submission._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {submission.user.fullName}
                              </div>
                              <div className="text-sm text-gray-500">{submission.user.email}</div>
                              {submission.user.passportNumber && (
                                <div className="text-xs text-gray-400">
                                  Passport: {submission.user.passportNumber}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(submission.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(submission.submittedAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {submission.status === 'pending' && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleKycAction(submission._id, 'approve')}
                                  className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    const comments = prompt('Rejection reason (optional):');
                                    if (comments !== null) {
                                      handleKycAction(submission._id, 'reject', comments);
                                    }
                                  }}
                                  className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                            {submission.status !== 'pending' && (
                              <span className="text-gray-400 text-xs">
                                {submission.reviewedAt ? formatDate(submission.reviewedAt) : 'No action needed'}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Companies Tab */}
        {activeTab === 'companies' && (
          <div className="space-y-6">
            {/* Search */}
            <div className="flex items-center justify-between">
              <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
              />
              <div className="text-sm text-gray-500">
                {filteredCompanies.length} of {companies.length} companies
              </div>
            </div>

            {/* Companies Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Owner
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                          Loading...
                        </td>
                      </tr>
                    ) : filteredCompanies.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                          No companies found
                        </td>
                      </tr>
                    ) : (
                      filteredCompanies.map((company) => (
                        <tr key={company._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {company.companyName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {company.companyType} • {company.businessActivity}
                              </div>
                              <div className="text-xs text-gray-400">
                                {company.registrationNumber}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {company.owner.fullName}
                              </div>
                              <div className="text-sm text-gray-500">{company.owner.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(company.registrationDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {company.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Audit Logs Tab */}
        {activeTab === 'logs' && (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <div className="text-gray-500">Audit logs feature coming soon...</div>
            <div className="text-sm text-gray-400 mt-2">
              This will show system activity, user actions, and administrative changes.
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 