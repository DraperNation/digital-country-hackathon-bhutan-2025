"use client";
import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  ArrowRight,
  Globe,
  Shield,
  Clock,
  CheckCircle,
} from "lucide-react";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  const quickLinks = [
    { name: "How It Works", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "FAQ", href: "#" },
    { name: "Support", href: "#" },
    { name: "Documentation", href: "#" },
  ];

  const services = [
    { name: "E-Residency", href: "#" },
    { name: "Company Formation", href: "#" },
    { name: "Digital Banking", href: "#" },
    { name: "Tax Services", href: "#" },
    { name: "Legal Support", href: "#" },
  ];

  const legal = [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
    { name: "Compliance", href: "#" },
    { name: "Data Protection", href: "#" },
  ];

  const socialLinks = [
    { icon: Twitter, href: "#", name: "Twitter" },
    { icon: Facebook, href: "#", name: "Facebook" },
    { icon: Linkedin, href: "#", name: "LinkedIn" },
    { icon: Instagram, href: "#", name: "Instagram" },
  ];

  const features = [
    { icon: Globe, text: "Available Worldwide" },
    { icon: Shield, text: "Bank-Level Security" },
    { icon: Clock, text: "24/7 Support" },
  ];

  return (
    <footer
      className={`bg-gray-900 text-white relative overflow-hidden ${className}`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      <div className="absolute top-20 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-blue-500/5 rounded-full blur-lg animate-float"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Newsletter Section */}
        <div className="border-b border-gray-800 py-16 px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-3xl lg:text-4xl font-bold">
                  Stay Updated with
                  <span className="block bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                    Digital Innovation
                  </span>
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                  Get the latest updates on e-residency, digital business
                  trends, and exclusive offers delivered to your inbox.
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-2 animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <IconComponent className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300 text-sm font-medium">
                        {feature.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Newsletter Form */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 animate-fade-in-up">
              <div className="space-y-6">
                <div className="flex items-center space-x-2 text-blue-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Join 50,000+ subscribers</span>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 px-6 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                  <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2 group">
                    <span>Subscribe</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>

                <p className="text-gray-500 text-sm">
                  No spam, unsubscribe at any time. We respect your privacy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16 px-6">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">
                    E-Residency of{" "}
                    <span className="bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                      Bhutan
                    </span>
                  </h2>
                  <p className="text-gray-400 leading-relaxed max-w-md">
                    Empowering global entrepreneurs with digital residency in
                    the world's most beautiful country. Start your digital
                    journey today.
                  </p>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-200">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <span>hello@bhutan-eresidency.gov.bt</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-200">
                    <Phone className="w-5 h-5 text-blue-400" />
                    <span>+975 2 123 4567</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-200">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    <span>Thimphu, Kingdom of Bhutan</span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h4 className="font-semibold text-white">Follow Us</h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
                        aria-label={social.name}
                      >
                        <IconComponent className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="font-semibold text-white text-lg">Quick Links</h4>
              <nav className="space-y-3">
                {quickLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="block text-gray-400 hover:text-white transition-colors duration-200 hover:translate-x-1 transform"
                  >
                    {link.name}
                  </a>
                ))}
              </nav>
            </div>

            {/* Services */}
            <div className="space-y-6">
              <h4 className="font-semibold text-white text-lg">Services</h4>
              <nav className="space-y-3">
                {services.map((service, index) => (
                  <a
                    key={index}
                    href={service.href}
                    className="block text-gray-400 hover:text-white transition-colors duration-200 hover:translate-x-1 transform"
                  >
                    {service.name}
                  </a>
                ))}
              </nav>
            </div>

            {/* Legal */}
            <div className="space-y-6">
              <h4 className="font-semibold text-white text-lg">Legal</h4>
              <nav className="space-y-3">
                {legal.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="block text-gray-400 hover:text-white transition-colors duration-200 hover:translate-x-1 transform"
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-8 px-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-gray-400 text-sm">
              <span>© 2025 E-Residency of Bhutan. All rights reserved.</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-gray-400 text-sm">
              <span>Powered by Digital Bhutan Initiative</span>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>ISO 27001 Certified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out both;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out both;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
