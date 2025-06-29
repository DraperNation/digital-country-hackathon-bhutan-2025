"use client";
import React, { useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  Users,
  Globe,
  Shield,
  Clock,
  CreditCard,
  FileText,
  Smartphone,
  Building,
  TrendingUp,
  MapPin,
  Star,
  ChevronDown,
  ChevronUp,
  Play,
  Award,
  Zap,
  Heart,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { WalletProvider } from "@/context/WalletConnect";



// FAQ Item Component
const FAQItem = ({ question, answer, isOpen, onToggle } : any) => (
  <div className="border border-gray-200 rounded-lg">
    <button
      onClick={onToggle}
      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
    >
      <span className="font-semibold text-gray-900">{question}</span>
      {isOpen ? (
        <ChevronUp className="w-5 h-5 text-gray-500" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-500" />
      )}
    </button>
    {isOpen && <div className="px-6 pb-4 text-gray-600">{answer}</div>}
  </div>
);

const LearnMorePage = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const benefits = [
    {
      icon: Clock,
      title: "15-Minute Setup",
      description:
        "Complete your application and get started in just 15 minutes with our streamlined digital process.",
    },
    {
      icon: Globe,
      title: "Global Banking Access",
      description:
        "Access international banking solutions and financial services from anywhere in the world.",
    },
    {
      icon: Shield,
      title: "99.9% Security Rate",
      description:
        "Bank-grade security with advanced encryption and multi-factor authentication protecting your data.",
    },
    {
      icon: CreditCard,
      title: "Tax Efficiency",
      description:
        "Benefit from Bhutan's business-friendly tax structure and international tax agreements.",
    },
    {
      icon: Smartphone,
      title: "24/7 Digital Services",
      description:
        "Access all government services digitally, anytime, anywhere through our secure platform.",
    },
    {
      icon: Building,
      title: "Business Registration",
      description:
        "Register and manage your business entirely online with full legal recognition.",
    },
  ];

  const processSteps = [
    {
      step: 1,
      title: "Apply Online",
      description:
        "Complete your application with required documents in our secure portal.",
      time: "5 minutes",
    },
    {
      step: 2,
      title: "Verification",
      description:
        "Our team verifies your documents and conducts background checks.",
      time: "24-48 hours",
    },
    {
      step: 3,
      title: "Payment",
      description:
        "Secure payment processing for your e-residency application fee.",
      time: "2 minutes",
    },
    {
      step: 4,
      title: "Digital ID",
      description:
        "Receive your digital identity card and access to all services.",
      time: "Instant",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Tech Entrepreneur",
      location: "Singapore",
      avatar: "S",
      quote:
        "Bhutan E-Residency transformed my business completely. The process was seamless and the support incredible.",
    },
    {
      name: "Marcus Rodriguez",
      role: "Digital Nomad",
      location: "Spain",
      avatar: "M",
      quote:
        "Having a legal business structure while traveling the world has been a game-changer for my consulting work.",
    },
    {
      name: "Priya Sharma",
      role: "Startup Founder",
      location: "India",
      avatar: "P",
      quote:
        "The tax benefits and ease of international banking made scaling my startup so much easier.",
    },
  ];

  const faqs = [
    {
      question: "What is Bhutan E-Residency?",
      answer:
        "Bhutan E-Residency is a digital identity program that allows global citizens to access Bhutan's digital services, start and manage a business online, and benefit from our business-friendly environment without physical relocation.",
    },
    {
      question: "Who can apply for E-Residency?",
      answer:
        "Any individual over 18 years old with a clean criminal background can apply for Bhutan E-Residency. We welcome entrepreneurs, freelancers, digital nomads, and anyone looking to establish a global business presence.",
    },
    {
      question: "What documents do I need?",
      answer:
        "You'll need a valid passport, proof of address, criminal background check from your country of residence, and a passport-style photo. All documents can be uploaded digitally during the application process.",
    },
    {
      question: "How much does it cost?",
      answer:
        "The E-Residency application fee is $100 USD. This includes your digital ID, access to all government services, and ongoing support. There are no hidden fees or recurring charges for the basic e-residency status.",
    },
    {
      question: "Can I open a bank account?",
      answer:
        "Yes! E-residents gain access to our partner banks and can open business accounts remotely. We also provide connections to international banking solutions and fintech services.",
    },
    {
      question: "What about taxes?",
      answer:
        "Bhutan offers competitive corporate tax rates and has double taxation agreements with many countries. E-residents benefit from our transparent tax system and can access professional tax advisory services.",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Digital Residents", icon: Users },
    { number: "150+", label: "Countries Represented", icon: Globe },
    { number: "99.9%", label: "Security Rate", icon: Shield },
    { number: "15 min", label: "Average Setup Time", icon: Clock },
    { number: "24/7", label: "Service Availability", icon: Smartphone },
    { number: "5★", label: "Average Rating", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-white">
      <WalletProvider>
        <Navbar />
      </WalletProvider>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-gray-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full text-sm font-medium text-blue-800 mb-8">
              <Heart className="w-4 h-4" />
              <span>Building the Future of Digital Governance</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Everything You Need to Know About
              <span className="block text-blue-900">Bhutan E-Residency</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Discover how Bhutan's innovative e-residency program is
              revolutionizing the way entrepreneurs and digital nomads build
              global businesses. Join the digital transformation that's changing
              lives worldwide.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="bg-blue-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-800 transition-colors flex items-center space-x-2">
                <span>Start Your Journey</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="text-gray-700 border border-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What is E-Residency Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                What is Bhutan E-Residency?
              </h2>
              <div className="space-y-6 text-lg text-gray-600">
                <p>
                  Bhutan E-Residency is a groundbreaking digital identity
                  program that provides global citizens with secure access to
                  Bhutan's advanced digital infrastructure and business
                  ecosystem.
                </p>
                <p>
                  Unlike traditional residency programs, e-residency doesn't
                  require physical relocation. Instead, it offers a digital
                  identity that enables you to establish and manage a business,
                  access banking services, and interact with government services
                  entirely online.
                </p>
                <p>
                  Built on the principles of Gross National Happiness, our
                  program combines cutting-edge technology with Bhutan's values
                  of sustainability, equity, and community well-being.
                </p>
              </div>
              <div className="mt-8">
                <button className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors">
                  Learn About Our Values
                </button>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <Zap className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Digital First
                    </h3>
                    <p className="text-gray-600">100% paperless processes</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Global Access
                    </h3>
                    <p className="text-gray-600">Available worldwide, 24/7</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Legally Recognized
                    </h3>
                    <p className="text-gray-600">Full legal business status</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Bhutan E-Residency?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive digital ecosystem provides everything you need
              to build, grow, and scale your business in the global marketplace.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow"
                >
                  <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-6 bg-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How to Become an E-Resident
            </h2>
            <p className="text-xl text-gray-600">
              Our streamlined process gets you up and running in record time
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow">
                  <div className="bg-blue-900 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {step.time}
                  </div>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 -right-4 transform translate-x-full">
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Stories from Our Community
            </h2>
            <p className="text-xl text-gray-600">
              Hear from entrepreneurs who've transformed their businesses with
              e-residency
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                    <div className="text-sm text-blue-600">
                      {testimonial.location}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                <div className="flex items-center space-x-1 mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Get answers to the most common questions about e-residency
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === index}
                onToggle={() => setOpenFAQ(openFAQ === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Start Your Digital Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Join thousands of entrepreneurs who have already transformed their
            business with Bhutan E-Residency. Your digital future starts here.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button className="bg-white text-blue-900 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2 group">
              <span>Apply Now</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button className="text-white border-2 border-white/30 px-8 py-4 rounded-2xl font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
              Contact Support
            </button>
          </div>
          <div className="mt-12 flex items-center justify-center space-x-8 text-blue-200">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>No Setup Fees</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Money-Back Guarantee</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LearnMorePage;
