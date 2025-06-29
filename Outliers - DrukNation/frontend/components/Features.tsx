"use client";
import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface FeatureSectionProps {
  className?: string;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({ className = "" }) => {
  const features = [
    {
      id: 1,
      image: "./Identity.png",
      title: "Become an E-Resident",
      description:
        "Get your digital identity and secure access to Bhutan's digital ecosystem. Enjoy all the benefits of residency from anywhere in the world.",
      highlights: ["Digital ID Card", "Secure Authentication", "Global Access"],
      delay: "0s",
      link: "/e-residency",
    },
    {
      id: 2,
      image: "./Business.png",
      title: "Start a Company",
      description:
        "Launch your business with ease using our streamlined digital process. Access banking, taxation, and legal services all in one place.",
      highlights: ["Quick Setup", "Digital Banking", "Tax Benefits"],
      delay: "0.2s",
      link: "/business",
    },
    {
      id: 3,
      image: "./Land.png",
      title: "Own a Land",
      description:
        "Invest in Bhutan's beautiful landscapes through our digital land ownership program. Secure your piece of the Last Shangri-La.",
      highlights: [
        "Digital Ownership",
        "Investment Security",
        "Beautiful Locations",
      ],
      delay: "0.4s",
      link: "/property-deals",
    },
  ];

  return (
    <section
      className={`bg-gray-50 min-h-screen py-20 px-6 relative overflow-hidden flex items-center pb-24 ${className}`}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-left mb-16">
          <h2 className="text-5xl lg:text-4xl font-bold text-blue-900 mb-6 animate-fade-in-up">
            How It Works
          </h2>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="group relative bg-white rounded overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 animate-slide-in"
              style={{
                animationDelay: feature.delay,
              }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Step Number Overlay */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/90  text-blue-800 backdrop-blur-sm rounded-full flex items-center justify-center text-lg font-bold  shadow-lg animate-bounce-in">
                  {feature.id}
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-900 transition-colors duration-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Highlights */}
                <div className="space-y-3 mb-8">
                  {feature.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-3 animate-fade-in"
                      style={{ animationDelay: `${0.6 + idx * 0.1}s` }}
                    >
                      <div className="w-2 h-2 bg-blue-900 rounded-full animate-pulse"></div>
                      <span className="text-gray-700 font-medium">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Learn More Link */}
                <Link href={feature.link} className="group/btn flex items-center space-x-2 text-blue-900 font-semibold hover:text-gray-700 transition-all duration-300 transform hover:translate-x-1">
                  <span>Learn More</span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
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
            transform: translateY(60px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
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

        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateX(-20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out;
        }

        .animate-slide-in {
          animation: slideIn 0.8s ease-out both;
        }

        .animate-bounce-in {
          animation: bounceIn 0.6s ease-out 0.8s both;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: floatDelayed 8s ease-in-out infinite 2s;
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out both;
        }
      `}</style>
    </section>
  );
};

export default FeatureSection;
