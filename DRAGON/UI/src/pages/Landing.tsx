import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Bitcoin, Shield, TrendingUp, Coins, Users, Globe, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-saffron-50/30 to-dragon-50/20">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br flex items-center justify-center p-1">
                <img 
                  src="/lovable-uploads/fbdc7794-3168-4711-b65e-cb31f7d10381.png" 
                  alt="Dragon Coin" 
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Dragon Coin</h1>
                <p className="text-xs text-muted-foreground">Bitcoin-Backed Stability</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('stability')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Stability
              </button>
              <button 
                onClick={() => scrollToSection('benefits')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Benefits
              </button>
              <Link to="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Inspired by the uploaded image */}
      <section className="relative overflow-hidden">
        {/* Flowing Valley Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-yellow-500 to-orange-600">
          <div className="absolute inset-0 bg-gradient-to-t from-green-600/80 via-green-500/60 to-transparent"></div>
          <div className="absolute inset-0">
            <svg viewBox="0 0 1200 800" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="valley1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8"/>
                  <stop offset="50%" stopColor="#eab308" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#16a34a" stopOpacity="0.7"/>
                </linearGradient>
                <linearGradient id="valley2" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity="0.8"/>
                  <stop offset="50%" stopColor="#eab308" stopOpacity="0.5"/>
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.6"/>
                </linearGradient>
              </defs>
              <path d="M0,400 Q300,200 600,350 T1200,300 L1200,800 L0,800 Z" fill="url(#valley1)"/>
              <path d="M0,500 Q400,300 800,450 T1200,400 L1200,800 L0,800 Z" fill="url(#valley2)"/>
            </svg>
          </div>
        </div>

        <div className="relative z-10 py-20 px-6 min-h-[80vh] flex items-center">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Content */}
              <div className="text-left">
                <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
                  🇧🇹 Powered by Bhutan's Bitcoin Reserves
                </Badge>
                
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
                  A STABLECOIN BASED ON BHUTAN'S BITCOIN RESERVE
                </h1>
                
                <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl drop-shadow-md">
                  Stabilization mechanisms: First is the burning and minting of token when Bitcoin deposited with collateral, and hedging of reserve to protect against Bitcoin's volatility.
                </p>
                
                <Button 
                  size="lg" 
                  className="bg-white text-orange-600 hover:bg-white/90 gap-2 font-semibold px-8 py-6 text-lg rounded-full"
                  onClick={() => scrollToSection('how-it-works')}
                >
                  Learn More
                </Button>
              </div>

              {/* Right Side - Visual Elements */}
              <div className="relative flex justify-center items-center">
                {/* Main Dragon Coin */}
                <div className="relative z-20">
                  <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 shadow-2xl flex items-center justify-center animate-pulse-glow">
                    <img 
                      src="/lovable-uploads/fbdc7794-3168-4711-b65e-cb31f7d10381.png" 
                      alt="Dragon Coin" 
                      className="w-56 h-56 md:w-72 md:h-72 object-cover rounded-full drop-shadow-xl"
                    />
                  </div>
                </div>

                {/* Bitcoin Element */}
                <div className="absolute -bottom-8 -right-4 z-10">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-orange-500 to-red-500 shadow-xl flex items-center justify-center animate-bounce">
                    <Bitcoin className="w-10 h-10 md:w-12 md:h-12 text-white" />
                  </div>
                  {/* Flame effect around Bitcoin */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full opacity-20 animate-ping"></div>
                </div>

                {/* Gold Bars */}
                <div className="absolute -bottom-4 -left-8 z-10">
                  <div className="flex flex-col space-y-1">
                    <div className="flex space-x-1">
                      <div className="w-8 h-4 bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-md"></div>
                      <div className="w-8 h-4 bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-md"></div>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-8 h-4 bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-md"></div>
                      <div className="w-8 h-4 bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-md"></div>
                      <div className="w-8 h-4 bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-md"></div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-4 left-4 animate-bounce" style={{ animationDelay: '0.5s' }}>
                  <Coins className="w-8 h-8 text-white/80" />
                </div>
                <div className="absolute top-8 right-8 animate-bounce" style={{ animationDelay: '1s' }}>
                  <Shield className="w-6 h-6 text-white/80" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="animate-bounce">
            <ChevronDown 
              className="w-8 h-8 text-white cursor-pointer drop-shadow-lg" 
              onClick={() => scrollToSection('how-it-works')}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How Dragon Coin Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A revolutionary approach to cryptocurrency stability, backed by real Bitcoin reserves.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bhutan-card text-center p-6">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-saffron-100 flex items-center justify-center">
                  <Bitcoin className="w-8 h-8 text-saffron-600" />
                </div>
                <CardTitle className="text-xl">Bitcoin Reserves</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Backed by Bhutan's sovereign Bitcoin holdings, providing real value and trust.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bhutan-card text-center p-6">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dragon-100 flex items-center justify-center">
                  <Coins className="w-8 h-8 text-dragon-600" />
                </div>
                <CardTitle className="text-xl">Smart Pegging</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Intelligent minting and burning mechanisms maintain stable value automatically.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bhutan-card text-center p-6">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Global Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Trade globally with confidence, supported by transparent governance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stability Mechanisms */}
      <section id="stability" className="py-20 px-6 bg-gradient-to-r from-saffron-50/50 to-dragon-50/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Dual Stability Mechanisms</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Two powerful systems work together to keep Dragon Coin stable and reliable.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="bhutan-card p-8">
              <CardHeader>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-saffron-100 flex items-center justify-center">
                    <Coins className="w-6 h-6 text-saffron-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Mechanism 1</CardTitle>
                    <p className="text-saffron-600 font-medium">Collateral-Based Stability</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-saffron-500 mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      When Bitcoin is deposited as collateral, new DGC tokens are minted
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-saffron-500 mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      Over-collateraliation ensures stability even during market fluctuations
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-saffron-500 mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      Automatic burning occurs when collateral is withdrawn, maintaining balance
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bhutan-card p-8">
              <CardHeader>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-dragon-100 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-dragon-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Mechanism 2</CardTitle>
                    <p className="text-dragon-600 font-medium">Reserve Hedging</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-dragon-500 mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      Strategic hedging protects reserves against Bitcoin's natural volatility
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-dragon-500 mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      Sophisticated algorithms monitor and adjust positions automatically
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-dragon-500 mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      Maintains purchasing power stability for everyday transactions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Dragon Coin?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the benefits of true stability backed by sovereign Bitcoin reserves.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Stable Value</h3>
              <p className="text-muted-foreground">
                Dual stabilization mechanisms ensure consistent purchasing power for your transactions.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-100 flex items-center justify-center">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Global Trust</h3>
              <p className="text-muted-foreground">
                Backed by a sovereign nation's reserves, providing unmatched credibility and transparency.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Community Driven</h3>
              <p className="text-muted-foreground">
                Open-source smart contracts and transparent governance for the global community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-saffron-600 to-dragon-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Experience True Stability?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join the future of stable digital currency backed by real Bitcoin reserves.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg" variant="secondary" className="gap-2">
                View Live Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-saffron-600 gap-2">
              Learn More
              <TrendingUp className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br flex items-center justify-center p-1">
              <img 
                src="/lovable-uploads/fbdc7794-3168-4711-b65e-cb31f7d10381.png" 
                alt="Dragon Coin" 
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <span className="text-lg font-semibold">Dragon Coin</span>
          </div>
          <p className="text-muted-foreground mb-4">
            Royal Government of Bhutan • Digital Currency Management
          </p>
          <p className="text-sm text-muted-foreground">
            © 2024 Dragon Coin. Built with innovation and backed by trust.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
