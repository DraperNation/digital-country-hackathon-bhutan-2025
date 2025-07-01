"use client";
import React from "react";
import { ArrowRight, CheckCircle, Users, Globe, Shield } from "lucide-react";
import Link from "next/link";

interface CTASectionProps {
  className?: string;
}

const CTASection: React.FC<CTASectionProps> = ({ className = "" }) => {
  const stats = [
    { icon: Users, number: "10,000+", label: "Digital Residents" },
    { icon: Globe, number: "150+", label: "Countries" },
    { icon: Shield, number: "99.9%", label: "Security Rate" },
  ];

  const benefits = [
    "Start your business in 15 minutes",
    "Access to global banking solutions",
    "Tax-efficient business structure",
    "24/7 digital government services",
  ];

  return (
    <section
      className={`bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 py-20 px-6 relative overflow-hidden ${className}`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]"></div>
      <div className="absolute top-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-white/5 rounded-full blur-lg animate-float"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-md animate-float-delayed"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-white">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Join the Digital Revolution</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                Ready to Start Your
                <span className="block bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                  Digital Journey?
                </span>
              </h2>

              <p className="text-xl text-blue-100 leading-relaxed max-w-xl">
                Join thousands of entrepreneurs who have already transformed
                their business with Bhutan E-Residency. Your digital future
                starts here.
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 animate-slide-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <span className="text-blue-100 font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 pt-4">
              <Link href="/e-residency" className="bg-white text-blue-900 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2 group">
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link href="/learn-more" className="text-white border-2 border-white/30 px-8 py-4 rounded-2xl font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                Learn More
              </Link>
            </div>

            {/* Trust Indicator */}
            <div className="flex items-center space-x-2 pt-6">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-white/20 flex items-center justify-center text-white text-xs font-bold"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div className="text-blue-100 text-sm">
                <span className="font-semibold">
                  Join 10,000+ digital residents
                </span>
                <br />
                <span className="text-blue-200">from around the world</span>
              </div>
            </div>
          </div>

          {/* Right Content - Stats */}
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 transform hover:scale-105 transition-all duration-300 hover:bg-white/15 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-white/20 p-3 rounded-xl">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-white">
                          {stat.number}
                        </div>
                        <div className="text-blue-200 font-medium">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Testimonial Card */}
            <div
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 animate-fade-in-up"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div className="flex-1">
                  <p className="text-white italic mb-3">
                    "Bhutan E-Residency transformed my business completely. The
                    process was seamless and the support incredible."
                  </p>
                  <div className="text-blue-200 font-medium">Sarah Chen</div>
                  <div className="text-blue-300 text-sm">
                    Tech Entrepreneur, Singapore
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS Animations */}
      <style jsx>{`
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

        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateX(-30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
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

        @keyframes floatDelayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out both;
        }

        .animate-slide-in {
          animation: slideIn 0.6s ease-out both;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: floatDelayed 8s ease-in-out infinite 2s;
        }
      `}</style>
    </section>
  );
};

export default CTASection;
