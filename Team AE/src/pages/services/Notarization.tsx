
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Shield, Check, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useWallet } from '@/contexts/WalletContext';

const Notarization = () => {
  const navigate = useNavigate();
  const { signMessage } = useWallet();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState<string>('');
  const [verifyFile, setVerifyFile] = useState<File | null>(null);
  const [isNotarizing, setIsNotarizing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const calculateSHA256 = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const hash = await calculateSHA256(file);
      setFileHash(hash);
    }
  };

  const handleNotarize = async () => {
    if (!uploadedFile || !fileHash) {
      toast.error('Please upload a file first');
      return;
    }

    setIsNotarizing(true);
    try {
      const signature = await signMessage(fileHash);
      if (signature) {
        // Store notarization record (in real app, this would go to blockchain/Supabase)
        const notarization = {
          fileName: uploadedFile.name,
          fileHash,
          signature,
          timestamp: new Date().toISOString(),
          transactionHash: `0x${Math.random().toString(16).slice(2)}` // Simulated
        };
        
        localStorage.setItem('notarizations', JSON.stringify([
          ...(JSON.parse(localStorage.getItem('notarizations') || '[]')),
          notarization
        ]));

        toast.success('Document notarized! Verification proof recorded.');
      }
    } catch (error) {
      toast.error('Notarization failed. Please try again.');
    }
    setIsNotarizing(false);
  };

  const handleVerify = async () => {
    if (!verifyFile) {
      toast.error('Please upload a file to verify');
      return;
    }

    setIsVerifying(true);
    try {
      const hash = await calculateSHA256(verifyFile);
      const notarizations = JSON.parse(localStorage.getItem('notarizations') || '[]');
      const found = notarizations.find((n: any) => n.fileHash === hash);
      
      if (found) {
        toast.success(`Verified: Document is authentic and was notarized on ${new Date(found.timestamp).toLocaleDateString()}`);
      } else {
        toast.error('Verification Failed: Document not found or tampered.');
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.');
    }
    setIsVerifying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              onClick={() => navigate('/dashboard/services')}
              variant="ghost"
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </Button>
            <h1 className="text-2xl font-bold text-gradient">Smart Contract Notarization</h1>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-druk-red mb-4">
            Secure Your Documents On-Chain
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Use blockchain technology to create immutable, tamper-proof records of your important documents
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Notarize Document */}
          <Card className="card-druk">
            <CardHeader>
              <CardTitle className="flex items-center text-druk-red">
                <FileText className="w-6 h-6 mr-2" />
                Notarize Document
              </CardTitle>
              <p className="text-gray-600 text-sm">
                Upload a document to create a blockchain-verified record
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="document-upload">Upload Document</Label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-druk-blue transition-colors">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="document-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-druk-blue hover:text-druk-gold"
                      >
                        <span>Upload a file</span>
                        <input
                          id="document-upload"
                          type="file"
                          className="sr-only"
                          accept=".pdf,.docx,.txt"
                          onChange={handleFileUpload}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, DOCX, TXT up to 10MB</p>
                  </div>
                </div>
              </div>

              {uploadedFile && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">File Details</h4>
                    <p className="text-sm text-blue-800">Name: {uploadedFile.name}</p>
                    <p className="text-sm text-blue-800">Size: {(uploadedFile.size / 1024).toFixed(2)} KB</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">SHA-256 Hash</h4>
                    <p className="text-xs font-mono bg-white p-2 rounded border break-all">
                      {fileHash}
                    </p>
                  </div>

                  <Button
                    onClick={handleNotarize}
                    disabled={isNotarizing}
                    className="w-full btn-druk"
                  >
                    {isNotarizing ? 'Notarizing...' : 'Notarize Document with MetaMask'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Verify Document */}
          <Card className="card-druk">
            <CardHeader>
              <CardTitle className="flex items-center text-druk-red">
                <Shield className="w-6 h-6 mr-2" />
                Verify Document
              </CardTitle>
              <p className="text-gray-600 text-sm">
                Check if a document has been previously notarized
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="verify-upload">Upload Document to Verify</Label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-druk-blue transition-colors">
                  <div className="space-y-1 text-center">
                    <Check className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="verify-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-druk-blue hover:text-druk-gold"
                      >
                        <span>Upload file to verify</span>
                        <input
                          id="verify-upload"
                          type="file"
                          className="sr-only"
                          accept=".pdf,.docx,.txt"
                          onChange={(e) => setVerifyFile(e.target.files?.[0] || null)}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {verifyFile && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">Verification File</h4>
                    <p className="text-sm text-green-800">Name: {verifyFile.name}</p>
                    <p className="text-sm text-green-800">Size: {(verifyFile.size / 1024).toFixed(2)} KB</p>
                  </div>

                  <Button
                    onClick={handleVerify}
                    disabled={isVerifying}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isVerifying ? 'Verifying...' : 'Verify Document Authenticity'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="card-druk mt-8">
          <CardHeader>
            <CardTitle className="text-druk-red text-center">How Blockchain Notarization Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-druk-blue text-white rounded-full flex items-center justify-center mx-auto">1</div>
                <h3 className="font-semibold">Hash Generation</h3>
                <p className="text-sm text-gray-600">Your document is converted to a unique SHA-256 hash</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-druk-gold text-white rounded-full flex items-center justify-center mx-auto">2</div>
                <h3 className="font-semibold">Blockchain Signature</h3>
                <p className="text-sm text-gray-600">The hash is signed with your MetaMask wallet</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-druk-red text-white rounded-full flex items-center justify-center mx-auto">3</div>
                <h3 className="font-semibold">Immutable Record</h3>
                <p className="text-sm text-gray-600">Proof is stored permanently on the blockchain</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Notarization;
