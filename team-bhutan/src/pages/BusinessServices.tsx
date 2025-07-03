import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Building2, 
  Globe, 
  Shield, 
  DollarSign, 
  Users, 
  FileText,
  Award,
  TrendingUp,
  Briefcase,
  Calculator,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

interface BusinessService {
  id: string;
  title: string;
  description: string;
  image: string;
  price: string;
  duration: string;
  rating: number;
  reviews: number;
  features: string[];
  category: 'formation' | 'compliance' | 'tax' | 'banking' | 'consulting';
}

export const BusinessServices: React.FC = () => {
  const { theme } = useTheme();

  const businessServices: BusinessService[] = [
    {
      id: '1',
      title: 'Company Formation & Registration',
      description: 'Complete business registration service with all legal documentation and government filing.',
      image: '/b1.png',
      price: '$299',
      duration: '5-7 days',
      rating: 4.9,
      reviews: 156,
      features: [
        'Business name reservation',
        'Articles of incorporation',
        'Tax ID registration',
        'Operating agreement',
        'Government filing fees included'
      ],
      category: 'formation'
    },
    {
      id: '2',
      title: 'Tax Optimization Consulting',
      description: 'Expert tax planning and optimization strategies for international businesses.',
      image: '/b2.png',
      price: '$199',
      duration: '2-3 days',
      rating: 4.8,
      reviews: 89,
      features: [
        'Tax structure analysis',
        'International tax planning',
        'Compliance strategy',
        'Annual tax filing support',
        'Ongoing consultation'
      ],
      category: 'tax'
    },
    {
      id: '3',
      title: 'Banking & Financial Services',
      description: 'Multi-currency business banking solutions with international payment processing.',
      image: '/b3.png',
      price: '$149',
      duration: '3-5 days',
      rating: 4.7,
      reviews: 234,
      features: [
        'Multi-currency accounts',
        'International wire transfers',
        'Payment gateway setup',
        'Cryptocurrency support',
        'Mobile banking access'
      ],
      category: 'banking'
    },
    {
      id: '4',
      title: 'Legal Compliance Management',
      description: 'Comprehensive legal compliance and regulatory management for your business.',
      image: '/b4.png',
      price: '$179',
      duration: '1-2 days',
      rating: 4.9,
      reviews: 67,
      features: [
        'Regulatory compliance audit',
        'Legal document templates',
        'Contract review service',
        'Intellectual property protection',
        'Ongoing legal support'
      ],
      category: 'compliance'
    },
    {
      id: '5',
      title: 'Digital Marketing & Branding',
      description: 'Complete digital marketing strategy and brand development for global reach.',
      image: '/b5.png',
      price: '$249',
      duration: '7-10 days',
      rating: 4.6,
      reviews: 123,
      features: [
        'Brand identity design',
        'Website development',
        'SEO optimization',
        'Social media strategy',
        'Content marketing plan'
      ],
      category: 'consulting'
    },
    {
      id: '6',
      title: 'Business Plan Development',
      description: 'Professional business plan creation with financial projections and market analysis.',
      image: '/b6.png',
      price: '$399',
      duration: '10-14 days',
      rating: 4.8,
      reviews: 78,
      features: [
        'Market research & analysis',
        'Financial projections',
        'Competitive analysis',
        'Investment pitch deck',
        'Executive summary'
      ],
      category: 'consulting'
    },
    {
      id: '7',
      title: 'Accounting & Bookkeeping',
      description: 'Professional accounting services with monthly financial reporting and analysis.',
      image: '/b7.png',
      price: '$99/month',
      duration: 'Ongoing',
      rating: 4.7,
      reviews: 145,
      features: [
        'Monthly bookkeeping',
        'Financial statements',
        'Expense tracking',
        'Invoice management',
        'Tax preparation support'
      ],
      category: 'compliance'
    },
    {
      id: '8',
      title: 'International Trade Consulting',
      description: 'Expert guidance for international trade, import/export regulations, and global expansion.',
      image: '/b8.png',
      price: '$299',
      duration: '5-7 days',
      rating: 4.9,
      reviews: 92,
      features: [
        'Trade regulation guidance',
        'Export/import documentation',
        'Customs compliance',
        'International partnerships',
        'Market entry strategy'
      ],
      category: 'consulting'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Services', icon: Building2 },
    { id: 'formation', name: 'Formation', icon: FileText },
    { id: 'compliance', name: 'Compliance', icon: Shield },
    { id: 'tax', name: 'Tax Services', icon: Calculator },
    { id: 'banking', name: 'Banking', icon: CreditCard },
    { id: 'consulting', name: 'Consulting', icon: Users }
  ];

  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const filteredServices = selectedCategory === 'all' 
    ? businessServices 
    : businessServices.filter(service => service.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'formation':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'compliance':
        return <Shield className="h-5 w-5 text-green-500" />;
      case 'tax':
        return <Calculator className="h-5 w-5 text-purple-500" />;
      case 'banking':
        return <CreditCard className="h-5 w-5 text-orange-500" />;
      case 'consulting':
        return <Users className="h-5 w-5 text-red-500" />;
      default:
        return <Building2 className="h-5 w-5 text-slate-500" />;
    }
  };

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center px-6 py-3 glass-card rounded-full text-sm font-medium mb-8 border border-white/30 ${
            theme === 'dark' ? 'text-white' : 'text-black'
          }`}>
            <Briefcase className="h-4 w-4 mr-2 text-orange-400" />
            Professional Business Services
          </div>
          
          <h1 className={`text-4xl md:text-6xl font-display font-bold mb-8 text-shadow-strong ${
            theme === 'dark' ? 'text-white' : 'text-black'
          }`}>
            Business <span className="text-saffron">Services</span>
          </h1>
          
          <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${
            theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'
          }`}>
            Comprehensive business services to help you establish, grow, and manage your 
            company in the Kingdom of Bhutan and beyond.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
          <div className="glass-card p-4 sm:p-6 rounded-xl border border-white/20 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className={`text-xl sm:text-2xl font-bold mb-1 text-shadow ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>500+</div>
            <div className={`text-xs sm:text-sm ${
              theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'
            }`}>Companies Formed</div>
          </div>
          
          <div className="glass-card p-4 sm:p-6 rounded-xl border border-white/20 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className={`text-xl sm:text-2xl font-bold mb-1 text-shadow ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>98%</div>
            <div className={`text-xs sm:text-sm ${
              theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'
            }`}>Success Rate</div>
          </div>
          
          <div className="glass-card p-4 sm:p-6 rounded-xl border border-white/20 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className={`text-xl sm:text-2xl font-bold mb-1 text-shadow ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>50+</div>
            <div className={`text-xs sm:text-sm ${
              theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'
            }`}>Countries Served</div>
          </div>
          
          <div className="glass-card p-4 sm:p-6 rounded-xl border border-white/20 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Award className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className={`text-xl sm:text-2xl font-bold mb-1 text-shadow ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>4.8</div>
            <div className={`text-xs sm:text-sm ${
              theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'
            }`}>Average Rating</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="glass-card p-4 sm:p-6 rounded-xl border border-white/20 mb-12">
          <h2 className={`text-lg sm:text-xl font-display font-bold mb-4 text-shadow ${
            theme === 'dark' ? 'text-white' : 'text-black'
          }`}>Service Categories</h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : theme === 'dark'
                      ? 'bg-white/10 text-white hover:bg-white/20 border border-white/30'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                <category.icon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{category.name}</span>
                <span className="sm:hidden">{category.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {filteredServices.map((service) => (
            <div key={service.id} className="glass-card rounded-xl overflow-hidden border border-white/20 group hover:transform hover:-translate-y-2 transition-all duration-300 equal-height-card">
              {/* Service Image */}
              <div className="relative overflow-hidden h-48">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback to a placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMUYyOTM3Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzE2MS4zNDMgMTAwIDEzMCAxMzEuMzQzIDEzMCAxNzBDMTMwIDIwOC42NTcgMTYxLjM0MyAyNDAgMjAwIDI0MEM2MzguNjU3IDI0MCAyNzAgMjA4LjY1NyAyNzAgMTcwQzI3MCAxMzEuMzQzIDIzOC42NTcgMTAwIDIwMCAxMDBaIiBmaWxsPSIjRjk3MzE2Ii8+CjwvZz4KPC9zdmc+';
                  }}
                />
                <div className="absolute top-3 right-3">
                  {getCategoryIcon(service.category)}
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black/50 text-white backdrop-blur-sm">
                    {service.duration}
                  </span>
                </div>
              </div>

              {/* Service Details */}
              <div className="p-4 sm:p-6 card-content">
                <div className="flex items-start justify-between mb-2 gap-2">
                  <h3 className={`text-lg font-display font-bold text-shadow flex-1 ${
                    theme === 'dark' ? 'text-white' : 'text-black'
                  }`}>{service.title}</h3>
                  <div className="text-lg sm:text-xl font-bold text-saffron text-shadow flex-shrink-0">{service.price}</div>
                </div>
                
                <p className={`text-sm mb-4 text-shadow ${
                  theme === 'dark' ? 'text-white/90' : 'text-slate-600'
                }`}>{service.description}</p>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(service.rating) ? 'text-yellow-400 fill-current' : 'text-white/30'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-sm ml-2 text-shadow ${
                    theme === 'dark' ? 'text-white/80' : 'text-slate-600'
                  }`}>
                    {service.rating} ({service.reviews} reviews)
                  </span>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-6 flex-grow">
                  {service.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className={`flex items-center text-sm ${
                      theme === 'dark' ? 'text-white/90' : 'text-slate-700'
                    }`}>
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      <span className="text-shadow">{feature}</span>
                    </div>
                  ))}
                  {service.features.length > 3 && (
                    <div className={`text-xs ${
                      theme === 'dark' ? 'text-white/70 text-shadow' : 'text-slate-500'
                    }`}>
                      +{service.features.length - 3} more features
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="card-footer">
                  <button className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors font-medium shadow-lg group btn-mobile-full">
                    Get Started
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="glass-card p-6 sm:p-8 rounded-xl border border-white/20">
          <div className="text-center mb-8">
            <h2 className={`text-2xl font-display font-bold mb-4 text-shadow ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>Need Custom Solutions?</h2>
            <p className={theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'}>
              Our expert team can create tailored business solutions for your specific needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <h3 className={`font-semibold mb-2 text-shadow ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>Phone Support</h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'
              }`}>+975 2 123-456</p>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-white/70 text-shadow' : 'text-slate-500'
              }`}>Mon-Fri 9AM-6PM BST</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <h3 className={`font-semibold mb-2 text-shadow ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>Email Support</h3>
              <p className={`text-sm break-all ${
                theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'
              }`}>business@bhutan-eresidency.gov.bt</p>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-white/70 text-shadow' : 'text-slate-500'
              }`}>24/7 Response</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className={`font-semibold mb-2 text-shadow ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>Office Location</h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-white/90 text-shadow' : 'text-slate-600'
              }`}>Thimphu, Kingdom of Bhutan</p>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-white/70 text-shadow' : 'text-slate-500'
              }`}>By Appointment</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <button className="inline-flex items-center px-6 sm:px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors font-medium shadow-lg btn-mobile">
              <Mail className="h-5 w-5 mr-2" />
              Contact Our Experts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};