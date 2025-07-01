"use client";
import React from "react";

interface IdCardProps {
  className?: string;
}

const IdCard: React.FC<IdCardProps> = ({ className = "" }) => {
  return (
    <div
      className={`bg-gray-100 rounded-2xl p-8 shadow-sm transform transition-all duration-500 hover:shadow-lg hover:scale-105 ${className}`}
    >
      {/* Profile Section */}
      <div className="flex items-start space-x-6 mb-6">
        {/* Avatar */}
        <div className="bg-gray-300 rounded-lg p-2 flex-shrink-0">
          <img
            src="./Picture.png"
            className="w-20 h-20 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110"
            style={{
              animation: "fadeInScale 0.8s ease-out",
            }}
          />
        </div>

        {/* Info Lines */}
        <div className="flex-1 space-y-3">
          <div
            className="h-4 bg-gray-400 rounded w-3/4 animate-pulse"
            style={{
              animation:
                "shimmer 2s infinite linear, slideInRight 0.6s ease-out",
            }}
          ></div>
          <div
            className="h-4 bg-gray-400 rounded w-full"
            style={{
              animation:
                "shimmer 2s infinite linear, slideInRight 0.8s ease-out",
            }}
          ></div>
          <div className="flex space-x-3">
            <div
              className="h-4 bg-gray-400 rounded w-1/3 animate-pulse"
              style={{
                animation:
                  "shimmer 2s infinite linear, slideInRight 1s ease-out",
              }}
            ></div>
            <div
              className="h-4 bg-gray-400 rounded w-1/4 animate-pulse"
              style={{
                animation:
                  "shimmer 2s infinite linear, slideInRight 1.2s ease-out",
              }}
            ></div>
          </div>
          <div
            className="h-4 bg-gray-400 rounded w-5/6 animate-pulse"
            style={{
              animation:
                "shimmer 2s infinite linear, slideInRight 1.4s ease-out",
            }}
          ></div>
        </div>
      </div>

      {/* Additional Info Sections */}
      <div className="space-y-4">
        <div
          className="h-3 bg-gray-300 rounded w-1/2 animate-pulse"
          style={{
            animation: "shimmer 2s infinite linear, slideInUp 1.6s ease-out",
          }}
        ></div>
        <div
          className="h-3 bg-gray-300 rounded w-2/3"
          style={{
            animation: "shimmer 2s infinite linear, slideInUp 1.8s ease-out",
          }}
        ></div>
        <div
          className="h-3 bg-gray-300 rounded w-3/4 animate-pulse"
          style={{
            animation: "shimmer 2s infinite linear, slideInUp 2s ease-out",
          }}
        ></div>
        <div className="flex justify-between items-center">
          <div
            className="h-3 bg-gray-300 rounded w-1/3 animate-pulse"
            style={{
              animation: "shimmer 2s infinite linear, slideInUp 2.2s ease-out",
            }}
          ></div>
          <div
            className="h-3 self-end justify-self-end bg-gray-300 rounded w-1/3 animate-pulse"
            style={{
              animation: "shimmer 2s infinite linear, slideInUp 2.2s ease-out",
            }}
          ></div>
        </div>
      </div>

      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }

        @keyframes slideInRight {
          0% {
            opacity: 0;
            transform: translateX(30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-pulse {
          background-image: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          background-size: 200px 100%;
          background-repeat: no-repeat;
        }
      `}</style>
    </div>
  );
};
export default IdCard;