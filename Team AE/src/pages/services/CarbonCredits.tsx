
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Leaf, TrendingUp, ExternalLink, TreePine } from 'lucide-react';
import { toast } from 'sonner';

const CarbonCredits = () => {
  const navigate = useNavigate();
  const [availableCredits] = useState(10.5); // BCC - Bhutan Carbon Credits

  // Simulated carbon credit projects
  const availableProjects = [
    {
      id: '1',
      name: 'Himalayan Forest Conservation',
      location: 'Thimphu, Bhutan',
      creditsAvailable: 500,
      pricePerCredit: 25, // USD
      description: 'Protecting old-growth forests in the Himalayas',
      certifiedBy: 'Verified Carbon Standard (VCS)'
    },
    {
      id: '2',
      name: 'Solar Village Initiative',
      location: 'Paro, Bhutan',
      creditsAvailable: 200,
      pricePerCredit: 30,
      description: 'Installing solar panels in rural communities',
      certifiedBy: 'Gold Standard'
    },
    {
      id: '3',
      name: 'Hydroelectric Expansion',
      location: 'Punakha, Bhutan',
      creditsAvailable: 750,
      pricePerCredit: 22,
      description: 'Clean energy from renewable hydroelectric sources',
      certifiedBy: 'Clean Development Mechanism (CDM)'
    }
  ];

  const carbonData = {
    totalEarned: 45.2,
    totalOffset: 34.7,
    netImpact: 10.5
  };

  const handleBuyCredits = (projectName: string, credits: number) => {
    toast.success(`Successfully purchased ${credits} carbon credits from ${projectName}! (Simulated transaction)`);
  };

  const handleOffsetEmissions = (projectName: string, credits: number) => {
    toast.success(`${credits} BCC used to offset emissions via ${projectName}! Your carbon footprint has been reduced.`);
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
            <h1 className="text-2xl font-bold text-gradient">Carbon Credit Trading</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-druk-red mb-4">
            Trade Verified Carbon Credits for a Greener Tomorrow
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Participate in Bhutan's carbon-negative economy through our blockchain-backed carbon credit marketplace
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Portfolio Overview */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="card-druk">
              <CardHeader>
                <CardTitle className="flex items-center text-druk-red">
                  <Leaf className="w-6 h-6 mr-2 text-green-500" />
                  Your Carbon Portfolio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h3 className="text-2xl font-bold text-green-700 mb-1">
                    {availableCredits} BCC
                  </h3>
                  <p className="text-sm text-green-600">Available Carbon Credits</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Credits Earned:</span>
                    <span className="font-semibold text-green-600">{carbonData.totalEarned} BCC</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Credits Offset:</span>
                    <span className="font-semibold text-blue-600">{carbonData.totalOffset} BCC</span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-2">
                    <span className="text-sm font-medium">Net Impact:</span>
                    <span className="font-bold text-druk-red">{carbonData.netImpact} BCC</span>
                  </div>
                </div>

                {/* Visual Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Carbon Impact</span>
                    <span>Carbon Neutral Goal</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${(carbonData.netImpact / 50) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">21% towards carbon neutral status</p>
                </div>
              </CardContent>
            </Card>

            {/* Transparency Ledger */}
            <Card className="card-druk">
              <CardHeader>
                <CardTitle className="text-druk-red">Transparency Ledger</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => window.open('https://sepolia.etherscan.io/', '_blank')}
                  variant="outline"
                  className="w-full justify-between"
                >
                  View On-Chain Transactions
                  <ExternalLink className="w-4 h-4" />
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  All carbon credit transactions are publicly verifiable on the blockchain
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Marketplace */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="card-druk">
              <CardHeader>
                <CardTitle className="flex items-center text-druk-red">
                  <TrendingUp className="w-6 h-6 mr-2" />
                  Carbon Credit Marketplace
                </CardTitle>
                <p className="text-gray-600 text-sm">
                  Support verified environmental projects across Bhutan
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {availableProjects.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <TreePine className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{project.name}</h3>
                            <p className="text-sm text-gray-500">{project.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-druk-red">${project.pricePerCredit}</p>
                          <p className="text-xs text-gray-500">per credit</p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {project.creditsAvailable} credits available
                          </p>
                          <p className="text-xs text-gray-500">Certified by {project.certifiedBy}</p>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          onClick={() => handleBuyCredits(project.name, 10)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                          Buy 10 Credits
                        </Button>
                        <Button
                          onClick={() => handleOffsetEmissions(project.name, 5)}
                          variant="outline"
                          className="flex-1"
                        >
                          Offset 5 BCC
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bhutan's Carbon Negative Status */}
        <Card className="card-druk mt-8">
          <CardHeader>
            <CardTitle className="text-druk-red text-center">Bhutan: The World's Only Carbon-Negative Country</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  -2.6M
                </div>
                <h3 className="font-semibold">Carbon Absorbed</h3>
                <p className="text-sm text-gray-600">Tonnes of CO₂ absorbed annually by Bhutan's forests</p>
              </div>
              <div className="space-y-2">
                <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  71%
                </div>
                <h3 className="font-semibold">Forest Coverage</h3>
                <p className="text-sm text-gray-600">Constitutionally mandated minimum forest coverage</p>
              </div>
              <div className="space-y-2">
                <div className="w-16 h-16 bg-druk-gold text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  100%
                </div>
                <h3 className="font-semibold">Renewable Energy</h3>
                <p className="text-sm text-gray-600">Clean energy from hydroelectric power</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CarbonCredits;
