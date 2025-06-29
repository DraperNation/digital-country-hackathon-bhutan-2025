"use client";
import React, { useState, useEffect } from "react";
import { Mail, ArrowRight, Sparkles, Zap, Rocket, Star } from "lucide-react";
import { WalletProvider } from "@/context/WalletConnect";
import Navbar from "@/components/Navbar";

// Define the type for a particle
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

const ComingSoonPage = () => {
  const [email, setEmail] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [countdown, setCountdown] = useState({
    days: 15,
    hours: 8,
    minutes: 42,
    seconds: 30,
  });

  // Generate floating particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 30; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.3 + 0.1,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  // Animate particles
  useEffect(() => {
    const animateParticles = () => {
      setParticles((prev) =>
        prev.map((particle) => ({
          ...particle,
          x: (particle.x + particle.speedX + 100) % 100,
          y: (particle.y + particle.speedY + 100) % 100,
        }))
      );
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = () => {
    if (email) {
      alert("Thanks for subscribing! We'll keep you updated.");
      setEmail("");
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gray-50">
      {/* Move animated background below Navbar so it doesn't block clicks */}
      <WalletProvider>
        <Navbar className="z-50 relative" />
      </WalletProvider>
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Floating Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-gray-400 rounded-full animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
              transform: `scale(${particle.size})`,
            }}
          />
        ))}

        {/* Subtle Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gray-200/50 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-300/40 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gray-100/60 rounded-full blur-3xl animate-pulse delay-500" />
      </div>
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-20">
        {/* Floating Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <Sparkles className="absolute top-1/4 left-1/6 text-gray-400 w-6 h-6 animate-bounce delay-100" />
          <Zap className="absolute top-1/3 right-1/6 text-gray-500 w-8 h-8 animate-bounce delay-300" />
          <Rocket className="absolute bottom-1/3 left-1/4 text-gray-600 w-7 h-7 animate-bounce delay-500" />
          <Star className="absolute bottom-1/4 right-1/4 text-gray-400 w-5 h-5 animate-bounce delay-700" />
        </div>

        {/* Main Heading */}
        <div className="text-center mb-8">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-800 bg-clip-text text-transparent animate-pulse">
            Coming Soon
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-gray-600 to-gray-800 mx-auto mb-8 rounded-full animate-pulse" />
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Something incredible is brewing. Get ready for an experience that
            will change everything.
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="grid grid-cols-4 gap-4 md:gap-8 mb-12">
          {Object.entries(countdown).map(([unit, value], index) => (
            <div key={unit} className="text-center group">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300 hover:scale-110 hover:rotate-1">
                <div className="text-3xl md:text-5xl font-bold text-gray-800 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-gray-600 group-hover:to-gray-900 group-hover:bg-clip-text transition-all duration-300">
                  {value.toString().padStart(2, "0")}
                </div>
                <div className="text-gray-500 uppercase text-sm md:text-base font-medium">
                  {unit}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Email Subscription */}
        <div className="w-full max-w-md mb-12">
          <div className="relative">
            <div className="flex items-center bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 p-2 hover:bg-white hover:shadow-lg transition-all duration-300 group">
              <Mail className="text-gray-400 ml-4 w-5 h-5 group-hover:text-gray-600 transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email for updates"
                className="flex-1 bg-transparent text-gray-800 placeholder-gray-500 px-4 py-3 focus:outline-none"
              />
              <button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25 flex items-center gap-2 group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Notify Me
                <ArrowRight
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isHovered ? "translate-x-1" : ""
                  }`}
                />
              </button>
            </div>
          </div>
          <p className="text-gray-400 text-sm text-center mt-4">
            Be the first to know when we launch. No spam, we promise.
          </p>
        </div>

        {/* Social Links */}
        <div className="flex space-x-6">
          {["Twitter", "Discord", "Telegram"].map((social, index) => (
            <a
              key={social}
              href="#"
              className="text-gray-400 hover:text-gray-700 transition-all duration-300 hover:scale-125 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center border border-gray-200 hover:bg-white hover:border-gray-300 hover:shadow-lg transition-all duration-300">
                <span className="font-bold text-lg">{social.slice(0, 1)}</span>
              </div>
            </a>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="fixed bottom-0 left-0 w-full h-1 bg-gray-200">
          <div
            className="h-full bg-gradient-to-r from-gray-600 to-gray-800 transition-all duration-1000 ease-out"
            style={{ width: "68%" }}
          />
        </div>

        {/* Decorative Elements */}
        <div
          className="absolute top-20 left-10 w-20 h-20 border-2 border-gray-300 rounded-full animate-spin opacity-20"
          style={{ animationDuration: "20s" }}
        />
        <div
          className="absolute bottom-20 right-10 w-16 h-16 border-2 border-gray-400 rounded-full animate-spin opacity-30"
          style={{ animationDuration: "15s" }}
        />
        <div className="absolute top-1/3 right-20 w-12 h-12 bg-gray-300 rounded-full animate-pulse opacity-40" />
        <div className="absolute bottom-1/3 left-20 w-8 h-8 bg-gray-400 rounded-full animate-pulse opacity-50 delay-500" />
      </div>
    </section>
  );
};

export default ComingSoonPage;
