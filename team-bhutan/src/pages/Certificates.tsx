import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  FileText, 
  Download, 
  Shield, 
  Building2, 
  Award, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  ExternalLink,
  QrCode
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Certificate {
  id: string;
  type: 'residency' | 'tax' | 'business' | 'compliance';
  title: string;
  description: string;
  status: 'issued' | 'pending' | 'expired' | 'renewal_required';
  issueDate: string;
  expiryDate?: string;
  downloadUrl?: string;
  verificationCode: string;
}

export const Certificates: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [showVerification, setShowVerification] = useState(false);

  const certificates: Certificate[] = [
    {
      id: 'cert-001',
      type: 'residency',
      title: 'Digital Residency Certificate',
      description: 'Official certificate of digital residency in the Kingdom of Bhutan',
      status: 'issued',
      issueDate: '2024-01-15',
      downloadUrl: '/certificates/residency-cert.pdf',
      verificationCode: 'BHU-RES-2024-001'
    },
    {
      id: 'cert-002',
      type: 'tax',
      title: 'Tax Identification Certificate',
      description: 'Bhutanese Tax ID and registration certificate',
      status: 'issued',
      issueDate: '2024-01-16',
      downloadUrl: '/certificates/tax-cert.pdf',
      verificationCode: 'BHU-TAX-2024-002'
    },
    {
      id: 'cert-003',
      type: 'business',
      title: 'Business Registration Certificate',
      description: 'Company incorporation and registration documents',
      status: 'pending',
      issueDate: '2024-01-20',
      verificationCode: 'BHU-BUS-2024-003'
    },
    {
      id: 'cert-004',
      type: 'compliance',
      title: 'Compliance Certificate',
      description: 'Annual compliance and good standing certificate',
      status: 'renewal_required',
      issueDate: '2023-01-15',
      expiryDate: '2024-01-15',
      verificationCode: 'BHU-COM-2023-004'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'issued':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'expired':
      case 'renewal_required':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'issued':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'pending':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'expired':
      case 'renewal_required':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'residency':
        return <Award className="h-6 w-6 text-orange-500" />;
      case 'tax':
        return <Shield className="h-6 w-6 text-green-500" />;
      case 'business':
        return <Building2 className="h-6 w-6 text-blue-500" />;
      case 'compliance':
        return <FileText className="h-6 w-6 text-purple-500" />;
      default:
        return <FileText className="h-6 w-6 text-slate-500" />;
    }
  };

  const handleDownload = (certificate: Certificate) => {
    if (certificate.downloadUrl) {
      toast.success(`${certificate.title} downloaded successfully`);
    } else {
      toast.error('Certificate not available for download');
    }
  };

  const handleVerify = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setShowVerification(true);
  };

  const handleRenewal = (certificate: Certificate) => {
    toast.success('Renewal process initiated. You will receive an email with next steps.');
  };

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-6 py-3 glass-card rounded-full text-white text-sm font-medium mb-8 border border-white/30">
            <FileText className="h-4 w-4 mr-2 text-orange-400" />
            Official Documents
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-8 text-white text-shadow-strong">
            Certificates & <span className="text-saffron">Tax ID</span>
          </h1>
          
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed text-shadow">
            Access and manage all your official documents, certificates, and tax identification 
            from the Kingdom of Bhutan.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="glass-card p-6 rounded-xl border border-white/20 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1 text-shadow">
              {certificates.filter(c => c.status === 'issued').length}
            </div>
            <div className="text-white/90 text-sm text-shadow">Active Certificates</div>
          </div>
          
          <div className="glass-card p-6 rounded-xl border border-white/20 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1 text-shadow">
              {certificates.filter(c => c.status === 'pending').length}
            </div>
            <div className="text-white/90 text-sm text-shadow">Pending</div>
          </div>
          
          <div className="glass-card p-6 rounded-xl border border-white/20 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1 text-shadow">
              {certificates.filter(c => c.status === 'renewal_required' || c.status === 'expired').length}
            </div>
            <div className="text-white/90 text-sm text-shadow">Need Attention</div>
          </div>
          
          <div className="glass-card p-6 rounded-xl border border-white/20 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1 text-shadow">100%</div>
            <div className="text-white/90 text-sm text-shadow">Compliance Rate</div>
          </div>
        </div>

        {/* Certificates List */}
        <div className="glass-card rounded-xl border border-white/20 overflow-hidden mb-12">
          <div className="p-6 border-b border-white/20">
            <h2 className="text-2xl font-display font-bold text-white text-shadow">Your Certificates</h2>
            <p className="text-white/90 mt-2 text-shadow">Manage and download your official documents</p>
          </div>

          <div className="divide-y divide-white/10">
            {certificates.map((certificate) => (
              <div key={certificate.id} className="p-6 hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getTypeIcon(certificate.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white text-shadow">{certificate.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(certificate.status)}`}>
                          {getStatusIcon(certificate.status)}
                          <span className="ml-1 capitalize">{certificate.status.replace('_', ' ')}</span>
                        </span>
                      </div>
                      <p className="text-white/80 text-sm mb-2 text-shadow">{certificate.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-white/70">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span className="text-shadow">Issued: {new Date(certificate.issueDate).toLocaleDateString()}</span>
                        </div>
                        {certificate.expiryDate && (
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span className="text-shadow">Expires: {new Date(certificate.expiryDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <QrCode className="h-3 w-3 mr-1" />
                          <span className="text-shadow">ID: {certificate.verificationCode}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleVerify(certificate)}
                      className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      title="Verify Certificate"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    
                    {certificate.downloadUrl && certificate.status === 'issued' && (
                      <button
                        onClick={() => handleDownload(certificate)}
                        className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title="Download Certificate"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    )}
                    
                    {certificate.status === 'renewal_required' && (
                      <button
                        onClick={() => handleRenewal(certificate)}
                        className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors"
                      >
                        Renew
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Modal */}
        {showVerification && selectedCertificate && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-form rounded-2xl p-8 max-w-md w-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  {getTypeIcon(selectedCertificate.type)}
                </div>
                <h3 className="text-xl font-display font-bold text-slate-800 mb-2">{selectedCertificate.title}</h3>
                <p className="text-slate-600 mb-6">{selectedCertificate.description}</p>
                
                <div className="bg-slate-50 rounded-lg p-4 mb-6">
                  <div className="w-32 h-32 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center border">
                    <QrCode className="h-16 w-16 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-600 mb-2">Verification Code:</p>
                  <p className="font-mono text-lg font-bold text-slate-800">{selectedCertificate.verificationCode}</p>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowVerification(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Close
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors">
                    <ExternalLink className="h-4 w-4 inline mr-2" />
                    Verify Online
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Compliance Status */}
        <div className="glass-card p-8 rounded-xl border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-white text-shadow">Compliance Status</h2>
            <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              All Up to Date
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-white mb-3 text-shadow">Current Requirements</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <span className="text-white/90 text-shadow">Annual Filing</span>
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <span className="text-white/90 text-shadow">Tax Compliance</span>
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <span className="text-white/90 text-shadow">Business Registration</span>
                  <Clock className="h-5 w-5 text-amber-400" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-3 text-shadow">Upcoming Deadlines</h3>
              <div className="space-y-3">
                <div className="p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/90 text-shadow">Annual Report</span>
                    <span className="text-xs text-white/70 text-shadow">Due in 45 days</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div className="p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/90 text-shadow">Tax Filing</span>
                    <span className="text-xs text-white/70 text-shadow">Due in 90 days</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};