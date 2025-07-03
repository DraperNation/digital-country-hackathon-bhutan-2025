import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  FileText,
  Filter,
  Download,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

interface KYCApplication {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  nationality: string;
  passportNumber: string;
  status: 'pending' | 'verified' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  documents: {
    passportImage: string;
    addressProof: string;
  };
}

export const Admin: React.FC = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState<KYCApplication[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<KYCApplication | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setTimeout(() => {
        const mockApplications: KYCApplication[] = [
          {
            id: '1',
            userId: 'user1',
            fullName: 'John Doe',
            email: 'john@example.com',
            nationality: 'US',
            passportNumber: 'P123456789',
            status: 'pending',
            submittedAt: new Date().toISOString(),
            documents: {
              passportImage: 'passport1.jpg',
              addressProof: 'utility1.pdf'
            }
          },
          {
            id: '2',
            userId: 'user2',
            fullName: 'Jane Smith',
            email: 'jane@example.com',
            nationality: 'UK',
            passportNumber: 'P987654321',
            status: 'verified',
            submittedAt: new Date(Date.now() - 86400000).toISOString(),
            reviewedAt: new Date().toISOString(),
            documents: {
              passportImage: 'passport2.jpg',
              addressProof: 'bank2.pdf'
            }
          }
        ];
        setApplications(mockApplications);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Failed to fetch applications');
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: 'verified' | 'rejected') => {
    try {
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: newStatus, reviewedAt: new Date().toISOString() }
            : app
        )
      );
      toast.success(`Application ${newStatus} successfully`);
      setSelectedApplication(null);
    } catch (error) {
      toast.error('Failed to update application status');
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'pending':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'rejected':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    verified: applications.filter(app => app.status === 'verified').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-white/20 rounded mb-6"></div>
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-white/20 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-white/20 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white text-shadow-strong">Admin Dashboard</h1>
        <p className="text-white/90 mt-2 text-shadow">
          Review and manage KYC applications from users.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="glass-card p-6 rounded-lg shadow-md border border-white/20">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-orange-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-white/80 text-shadow">Total Applications</p>
              <p className="text-2xl font-bold text-white text-shadow">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-lg shadow-md border border-white/20">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-amber-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-white/80 text-shadow">Pending Review</p>
              <p className="text-2xl font-bold text-white text-shadow">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-lg shadow-md border border-white/20">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-emerald-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-white/80 text-shadow">Verified</p>
              <p className="text-2xl font-bold text-white text-shadow">{stats.verified}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-lg shadow-md border border-white/20">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-white/80 text-shadow">Rejected</p>
              <p className="text-2xl font-bold text-white text-shadow">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="glass-card rounded-lg shadow-md border border-white/20">
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-semibold text-white text-shadow">KYC Applications</h2>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-white/60" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="form-input border border-white/30 rounded-md px-3 py-1 text-sm"
              >
                <option value="all">All Applications</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider text-shadow">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider text-shadow">
                  Nationality
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider text-shadow">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider text-shadow">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider text-shadow">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredApplications.map((application) => (
                <tr key={application.id} className="hover:bg-white/5">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white text-shadow">
                        {application.fullName}
                      </div>
                      <div className="text-sm text-white/80 text-shadow">
                        {application.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-shadow">
                    {application.nationality}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      <span className="ml-1 capitalize">{application.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80 text-shadow">
                    {new Date(application.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedApplication(application)}
                      className="text-orange-400 hover:text-orange-300 inline-flex items-center transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="glass-form max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg border border-white/20">
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-display font-semibold text-slate-800">
                  KYC Application Review
                </h3>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-medium text-slate-800 mb-3">Personal Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Full Name:</span>
                    <p className="font-medium text-slate-800">{selectedApplication.fullName}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Email:</span>
                    <p className="font-medium text-slate-800">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Nationality:</span>
                    <p className="font-medium text-slate-800">{selectedApplication.nationality}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Passport Number:</span>
                    <p className="font-medium text-slate-800">{selectedApplication.passportNumber}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-slate-800 mb-3">Documents</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-slate-50">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-slate-500 mr-2" />
                      <span className="text-sm text-slate-800">Passport Photo</span>
                    </div>
                    <button className="text-orange-600 hover:text-orange-700 text-sm">
                      View Document
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-slate-50">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-slate-500 mr-2" />
                      <span className="text-sm text-slate-800">Proof of Address</span>
                    </div>
                    <button className="text-orange-600 hover:text-orange-700 text-sm">
                      View Document
                    </button>
                  </div>
                </div>
              </div>

              {selectedApplication.status === 'pending' && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleStatusUpdate(selectedApplication.id, 'verified')}
                    className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Approve Application
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedApplication.id, 'rejected')}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reject Application
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};