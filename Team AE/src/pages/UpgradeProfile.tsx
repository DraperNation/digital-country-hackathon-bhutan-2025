import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWallet } from '@/contexts/WalletContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface UserData {
  fullName: string;
  phoneNumber: string;
  email: string;
  walletAddress: string;
  decentralizedId: string;
}

const UpgradeProfile = () => {
  const { isConnected, account, signMessage } = useWallet();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [upgradeData, setUpgradeData] = useState({
    currentResidence: '',
    occupation: '',
    education: '',
    skills: '',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      navigate('/');
      return;
    }

    const storedData = localStorage.getItem('userData');
    if (storedData) {
      setUserData(JSON.parse(storedData));
    } else {
      navigate('/kyc');
    }
  }, [isConnected, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upgradeData.currentResidence || !upgradeData.occupation || !upgradeData.reason) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create hash of upgrade data with timestamp
      const timestamp = Date.now();
      const dataToSign = JSON.stringify({ ...upgradeData, timestamp });
      const signature = await signMessage(dataToSign);

      if (signature) {
        // Store upgrade application
        localStorage.setItem('upgradeApplication', JSON.stringify({
          ...upgradeData,
          timestamp,
          signature,
          status: 'pending'
        }));

        toast.success('Upgrade application submitted! You will be notified of its status via your dashboard.');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
    }

    setIsSubmitting(false);
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-druk-blue mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gradient">Upgrade Profile</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-druk-red mb-4">
            Upgrade Your Profile: Towards Bhutanese Digital Citizenship
          </h2>
          <p className="text-gray-600">
            Take the next step in your digital journey with Bhutan
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="card-druk">
              <CardHeader>
                <CardTitle className="flex items-center text-druk-red">
                  <User className="w-6 h-6 mr-2" />
                  Enhanced Identity Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Existing Details (Read-only) */}
                <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-4">Current Profile Details</h3>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Full Name:</span>
                      <p className="text-gray-500">{userData.fullName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Phone:</span>
                      <p className="text-gray-500">{userData.phoneNumber}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Email:</span>
                      <p className="text-gray-500">{userData.email}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Wallet:</span>
                      <p className="text-gray-500 font-mono text-xs">
                        {userData.walletAddress.slice(0, 10)}...{userData.walletAddress.slice(-8)}
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="font-medium text-gray-700">Decentralized ID:</span>
                      <p className="text-gray-500 font-mono text-xs">{userData.decentralizedId}</p>
                    </div>
                  </div>
                </div>

                {/* New Information Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="currentResidence">Country of Current Residence *</Label>
                      <Select
                        value={upgradeData.currentResidence}
                        onValueChange={(value) => setUpgradeData(prev => ({ ...prev, currentResidence: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="united_states">United States</SelectItem>
                          <SelectItem value="united_kingdom">United Kingdom</SelectItem>
                          <SelectItem value="canada">Canada</SelectItem>
                          <SelectItem value="australia">Australia</SelectItem>
                          <SelectItem value="india">India</SelectItem>
                          <SelectItem value="singapore">Singapore</SelectItem>
                          <SelectItem value="japan">Japan</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="occupation">Current Occupation/Profession *</Label>
                      <Input
                        id="occupation"
                        value={upgradeData.occupation}
                        onChange={(e) => setUpgradeData(prev => ({ ...prev, occupation: e.target.value }))}
                        placeholder="e.g., Software Engineer, Teacher, Artist"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="education">Highest Educational Qualification</Label>
                    <Select
                      value={upgradeData.education}
                      onValueChange={(value) => setUpgradeData(prev => ({ ...prev, education: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select qualification" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high_school">High School</SelectItem>
                        <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                        <SelectItem value="master">Master's Degree</SelectItem>
                        <SelectItem value="phd">PhD</SelectItem>
                        <SelectItem value="vocational">Vocational Training</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="skills">Special Skills/Expertise relevant to Bhutan's GNH philosophy</Label>
                    <Textarea
                      id="skills"
                      value={upgradeData.skills}
                      onChange={(e) => setUpgradeData(prev => ({ ...prev, skills: e.target.value }))}
                      placeholder="e.g., sustainable development, traditional arts, renewable energy, education, healthcare, tourism, spiritual guidance"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="reason">Reason for seeking advanced e-residency/interest in Bhutanese digital citizenship *</Label>
                    <Textarea
                      id="reason"
                      value={upgradeData.reason}
                      onChange={(e) => setUpgradeData(prev => ({ ...prev, reason: e.target.value }))}
                      placeholder="Explain your motivation and how you plan to contribute to Bhutan's digital future and GNH philosophy"
                      rows={5}
                      required
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/dashboard')}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 btn-druk"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Upgrade Application'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            <Card className="card-druk">
              <CardHeader>
                <CardTitle className="text-druk-red">Why Upgrade?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Enhanced Services</p>
                    <p className="text-gray-600">Access to premium digital services and priority support</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Business Opportunities</p>
                    <p className="text-gray-600">Expanded access to Bhutan's digital marketplace</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Cultural Integration</p>
                    <p className="text-gray-600">Deeper connection with Bhutanese values and community</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-druk">
              <CardHeader>
                <CardTitle className="text-druk-red">Application Process</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-druk-blue text-white rounded-full flex items-center justify-center text-xs">1</div>
                  <span>Complete enhanced profile form</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-druk-blue text-white rounded-full flex items-center justify-center text-xs">2</div>
                  <span>Sign declaration with MetaMask</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-druk-blue text-white rounded-full flex items-center justify-center text-xs">3</div>
                  <span>Application review (1-2 weeks)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-druk-blue text-white rounded-full flex items-center justify-center text-xs">4</div>
                  <span>Notification via dashboard</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeProfile;
