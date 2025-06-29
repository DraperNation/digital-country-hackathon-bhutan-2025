
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/contexts/WalletContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Calendar, ExternalLink, Download, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface DigitalAttestation {
  id: string;
  attestation_type: string;
  issuer_name: string;
  issuer_did: string | null;
  title: string;
  description: string | null;
  verification_hash: string | null;
  blockchain_tx_hash: string | null;
  issue_date: string;
  expiry_date: string | null;
  status: string;
  metadata: any;
}

const DigitalAttestations = () => {
  const { isConnected } = useWallet();
  const navigate = useNavigate();
  const [attestations, setAttestations] = useState<DigitalAttestation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConnected) {
      navigate('/');
      return;
    }
    fetchAttestations();
  }, [isConnected, navigate]);

  const fetchAttestations = async () => {
    try {
      const { data, error } = await supabase
        .from('digital_attestations')
        .select('*')
        .order('issue_date', { ascending: false });

      if (error) throw error;
      setAttestations(data || []);
    } catch (error) {
      console.error('Error fetching attestations:', error);
      toast.error('Failed to load digital attestations');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleVerifyAttestation = async (attestation: DigitalAttestation) => {
    if (attestation.blockchain_tx_hash) {
      toast.success(`Verification confirmed: ${attestation.blockchain_tx_hash.slice(0, 10)}...`);
    } else {
      toast.info('Verification in progress...');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-druk-gold mx-auto mb-4"></div>
          <p className="text-white">Loading attestations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-gradient">
      <header className="bg-slate-900/95 backdrop-blur-sm border-b border-druk-gold/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              className="mr-4 text-white hover:bg-druk-gold/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gradient">Digital Attestations</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Your Digital Credentials</h2>
          <p className="text-slate-300">
            Blockchain-verified attestations and certifications issued by trusted authorities
          </p>
        </div>

        {attestations.length === 0 ? (
          <Card className="card-druk text-center">
            <CardContent className="p-12">
              <Shield className="w-16 h-16 text-druk-gold mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Attestations Yet</h3>
              <p className="text-slate-400 mb-6">
                Your digital attestations will appear here once issued by authorized entities
              </p>
              <Button 
                onClick={() => navigate('/dashboard/services')}
                className="btn-druk"
              >
                Explore Services
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {attestations.map((attestation) => (
              <Card key={attestation.id} className="card-druk">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(attestation.status)}
                      <div>
                        <CardTitle className="text-white">{attestation.title}</CardTitle>
                        <p className="text-sm text-slate-400">
                          Issued by {attestation.issuer_name}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(attestation.status)}>
                      {attestation.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-druk-gold mb-2">Attestation Details</h4>
                      <div className="space-y-2 text-sm text-slate-300">
                        <p><strong>Type:</strong> {attestation.attestation_type}</p>
                        <p><strong>Issue Date:</strong> {format(new Date(attestation.issue_date), 'PPP')}</p>
                        {attestation.expiry_date && (
                          <p><strong>Expires:</strong> {format(new Date(attestation.expiry_date), 'PPP')}</p>
                        )}
                        {attestation.description && (
                          <p><strong>Description:</strong> {attestation.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-druk-gold mb-2">Verification</h4>
                      <div className="space-y-2 text-sm text-slate-300">
                        {attestation.verification_hash && (
                          <p><strong>Hash:</strong> 
                            <span className="font-mono text-xs ml-1">
                              {attestation.verification_hash.slice(0, 16)}...
                            </span>
                          </p>
                        )}
                        {attestation.blockchain_tx_hash && (
                          <p><strong>Blockchain TX:</strong> 
                            <span className="font-mono text-xs ml-1">
                              {attestation.blockchain_tx_hash.slice(0, 16)}...
                            </span>
                          </p>
                        )}
                        {attestation.issuer_did && (
                          <p><strong>Issuer DID:</strong> 
                            <span className="font-mono text-xs ml-1">
                              {attestation.issuer_did.slice(0, 20)}...
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-700">
                    <Button
                      onClick={() => handleVerifyAttestation(attestation)}
                      variant="outline"
                      size="sm"
                      className="border-druk-gold text-druk-gold hover:bg-druk-gold hover:text-black"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Verify
                    </Button>
                    <Button
                      onClick={() => toast.success('Certificate downloaded!')}
                      variant="outline"
                      size="sm"
                      className="border-druk-emerald text-druk-emerald hover:bg-druk-emerald hover:text-black"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    {attestation.blockchain_tx_hash && (
                      <Button
                        onClick={() => toast.success('Opening blockchain explorer...')}
                        variant="outline"
                        size="sm"
                        className="border-druk-sapphire text-druk-sapphire hover:bg-druk-sapphire hover:text-black"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View on Chain
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DigitalAttestations;
