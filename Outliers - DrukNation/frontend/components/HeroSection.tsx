import React from "react";
import IdCard from "./IdentityCard";
import { Play } from "lucide-react";
import Link from "next/link";
interface HeroSectionProps {
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ className = "" }) => {
  return (
    <section
      className={`bg-gray-50 py-10 px-6 relative overflow-hidden ${className}`}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Enhanced Left Content */}
          <div className="space-y-10">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full text-sm font-medium text-gray-700">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Digital Innovation Initiative</span>
            </div>

            <div className="space-y-8">
              <h1 className="text-6xl lg:text-7xl font-bold text-blue-900 leading-tight">
                E-Residency of{" "}
                <span className="block bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                  Bhutan
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-xl">
                Start and manage your business online, in one of the world's
                most beautiful country.
                <span className="block mt-2 text-lg text-gray-500">
                  Join thousands of digital entrepreneurs building the future.
                </span>
              </p>
            </div>

            {/* Enhanced Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 pb-2">
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-gray-900">100 %</div>
                <div className="text-sm text-gray-600">Digital Process</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-gray-900">24 / 7</div>
                <div className="text-sm text-gray-600">Online Access</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-gray-900">15 mins</div>
                <div className="text-sm text-gray-600">Setup Time</div>
              </div>
            </div>

            {/* Enhanced CTA Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 pt-2">
              <Link href='/e-residency' className="bg-blue-900 text-white px-10 py-5 rounded-2xl font-semibold text-lg  transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Get Started
              </Link>
              <Link href='/learn-more' className="text-gray-700 font-medium hover:text-gray-900 duration-200 flex items-center space-x-2 hover:scale-105 transition-all">
                <span>Watch Demo</span>
                <div className="w-6 h-6 border-2 border-current rounded-full flex items-center justify-center p-1">
                  <Play className="fill-current" />
                </div>
              </Link>
            </div>
          </div>

          {/* Enhanced Right Content - ID Card */}
          <div className="flex flex-col items-center h-full w-full justify-center gap-20">
            <IdCard className="w-full max-w-md transform hover:scale-105 transition-transform duration-300" />

            <div className="flex items-center space-x-8 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-500">Trusted by</div>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-6 bg-gray-300 rounded"></div>
                <div className="w-12 h-6 bg-gray-300 rounded"></div>
                <div className="w-20 h-6 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;