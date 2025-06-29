import React from "react";
import { Building2, Users, Globe, Shield, Star, Zap } from "lucide-react";

// Component 1: Business Benefits Hero Section
const BusinessBenefitsHero = () => {
  const benefits = [
    {
      icon: Globe,
      title: "Global Market Access",
      description:
        "Reach international customers with your Bhutan-registered business",
    },
    {
      icon: Shield,
      title: "Tax Advantages",
      description: "Benefit from Bhutan's favorable business tax structure",
    },
    {
      icon: Zap,
      title: "Quick Setup",
      description: "Register your business in minutes, not months",
    },
    {
      icon: Users,
      title: "Digital Infrastructure",
      description: "Access world-class digital banking and payment solutions",
    },
  ];

  return (
    <section className="bg-gray-50 py-20 px-6 relative overflow-hidden">
      {/* Optional Soft Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.03),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,0,0,0.02),transparent_50%)]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gray-200 px-4 py-2 rounded-full text-sm font-medium text-gray-800 mb-6">
            <Building2 className="w-4 h-4 text-gray-600" />
            <span>Business Registration</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Start Your Business in
            <span className="block bg-gradient-to-r from-blue-700 to-blue-400 bg-clip-text text-transparent">
              Bhutan Today
            </span>
          </h1>

          <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto mb-12">
            With your Bhutan E-Residency, unlock unlimited business potential.
            Register your company in one of the world's happiest countries and
            gain access to unique advantages that will accelerate your growth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 text-center shadow-md transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
              >
                <div className="bg-blue-100 p-3 rounded-xl w-fit mx-auto mb-4">
                  <IconComponent className="w-6 h-6 text-blue-700" />
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-700 mb-4">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-400" />
            <span className="text-sm">
              Join 10,000+ entrepreneurs who chose Bhutan
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessBenefitsHero;
