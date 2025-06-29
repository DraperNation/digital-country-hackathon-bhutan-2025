'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { BankRegistrationForm } from './bank-registration-form'

interface DashboardProps {
  userEmail: string
  onSignOut?: () => void
}

const services = [
  {
    title: 'Bank Account',
    description: 'Register for a new bank account using your digital identity with Bhutan National Bank.',
    icon: '🏦',
    color: 'bg-blue-500',
    enabled: true,
    action: 'bank-registration'
  },
  {
    title: 'Company Registration',
    description: 'Register your Bhutanese company 100% online. Complete incorporation process in 24 hours.',
    icon: '🏢',
    color: 'bg-green-500',
    enabled: true,
    action: 'company-registration'
  },
  {
    title: 'Tax Registration & Filing',
    description: 'Register for Tax Identification Number (TIN) and file returns online. 0% corporate tax on undistributed profits.',
    icon: '📊',
    color: 'bg-purple-500',
    enabled: true,
    action: 'tax-services'
  },
  {
    title: 'Digital ID Services',
    description: 'Manage your e-Resident digital identity card, renew certificates, and access secure authentication.',
    icon: '🆔',
    color: 'bg-cyan-500',
    enabled: true,
    action: 'digital-id'
  },
  {
    title: 'Business Banking',
    description: 'Open business bank accounts with multi-currency support and international transfers.',
    icon: '💳',
    color: 'bg-emerald-500',
    enabled: true,
    action: 'business-banking'
  },
  {
    title: 'Legal Address & Contact',
    description: 'Get a registered business address in Bhutan and assign a local contact person.',
    icon: '📍',
    color: 'bg-orange-500',
    enabled: true,
    action: 'legal-address'
  },
  {
    title: 'Accounting & Bookkeeping',
    description: 'Professional accounting services from certified Bhutanese accountants.',
    icon: '📈',
    color: 'bg-indigo-500',
    enabled: true,
    action: 'accounting'
  },
  {
    title: 'Business Licenses',
    description: 'Apply for industry-specific business licenses and permits.',
    icon: '📜',
    color: 'bg-red-500',
    enabled: true,
    action: 'licenses'
  },
  {
    title: 'Service Provider Marketplace',
    description: 'Connect with verified lawyers, accountants, and consultants specialized in e-Resident businesses.',
    icon: '🤝',
    color: 'bg-teal-500',
    enabled: true,
    action: 'marketplace'
  },
  {
    title: 'Cross-Border Tax Consulting',
    description: 'Expert guidance on international tax obligations and double taxation treaties.',
    icon: '🌍',
    color: 'bg-yellow-500',
    enabled: true,
    action: 'tax-consulting'
  },
  {
    title: 'Payment Solutions',
    description: 'Set up online payment processing for your business with e-commerce integration.',
    icon: '💰',
    color: 'bg-pink-500',
    enabled: true,
    action: 'payments'
  },
  {
    title: 'Annual Compliance',
    description: 'Stay compliant with annual filing requirements and automated reminders.',
    icon: '📅',
    color: 'bg-lime-500',
    enabled: true,
    action: 'compliance'
  },
  {
    title: 'Digital Nomad Visa',
    description: 'Apply for Bhutan Digital Nomad Visa with special tax incentives.',
    icon: '✈️',
    color: 'bg-sky-500',
    enabled: true,
    action: 'nomad-visa'
  },
  {
    title: 'Investment Incentives',
    description: 'Explore investment opportunities and tax incentives for e-Residents.',
    icon: '📈',
    color: 'bg-rose-500',
    enabled: true,
    action: 'investments'
  },
  {
    title: 'Document Authentication',
    description: 'Digitally sign and authenticate business documents using your e-Resident card.',
    icon: '✍️',
    color: 'bg-violet-500',
    enabled: true,
    action: 'document-auth'
  },
  {
    title: 'Gross National Happiness',
    description: 'Participate in Bhutan\'s unique GNH measurement for sustainable business practices.',
    icon: '😊',
    color: 'bg-amber-500',
    enabled: true,
    action: 'gnh-business'
  }
]

export function Dashboard({ userEmail, onSignOut }: DashboardProps) {
  const [showBankRegistration, setShowBankRegistration] = useState(false)

  const handleServiceClick = (action: string) => {
    if (action === 'bank-registration') {
      setShowBankRegistration(true)
    } else {
      // For other services, show coming soon alert
      alert(`${action.replace('-', ' ').toUpperCase()} service coming soon!`)
    }
  }

  const handleBankRegistrationSuccess = () => {
    setShowBankRegistration(false)
  }

  const handleBankRegistrationCancel = () => {
    setShowBankRegistration(false)
  }

  if (showBankRegistration) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <BankRegistrationForm 
          userEmail={userEmail}
          onSuccess={handleBankRegistrationSuccess}
          onCancel={handleBankRegistrationCancel}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-cyan-100/30"></div>
      
      <div className="relative z-10 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="bg-cyan-400/95 backdrop-blur-sm rounded-xl shadow-lg mb-8 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 relative">
                  <Image
                    src="/bhutan.svg.png"
                    alt="Bhutan Coat of Arms"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-blue-900">BHUTAN E-RESIDENCY PORTAL</h1>
                  <p className="text-blue-700 text-lg">Digital Services Dashboard - Kingdom of Bhutan</p>
                </div>
              </div>
              <Button variant="outline" onClick={onSignOut} className="bg-white/90 hover:bg-white">
                Sign Out
              </Button>
            </div>
          </header>

          {/* User Info */}
          <Card className="mb-8 bg-white/80 backdrop-blur-sm border-cyan-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span>Digital Identity Status</span>
              </CardTitle>
              <CardDescription>Your e-Resident digital identity is verified and active</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Verified E-Resident</span>
                  <span className="text-sm text-muted-foreground">({userEmail})</span>
                </div>
                <div className="h-6 w-px bg-border"></div>
                <div className="text-sm text-green-600 font-medium">All Services Available</div>
              </div>
            </CardContent>
          </Card>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {services.map((service, index) => (
              <Card 
                key={index}
                className={`cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 bg-white/80 backdrop-blur-sm border-cyan-200 ${
                  service.enabled ? 'hover:bg-white/90' : 'opacity-60'
                }`}
                onClick={() => service.enabled && handleServiceClick(service.action)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${service.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                      {service.icon}
                    </div>
                    <span className="text-base">{service.title}</span>
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className={`w-full ${service.enabled ? '' : 'opacity-60'}`}
                    disabled={!service.enabled}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleServiceClick(service.action)
                    }}
                  >
                    {service.action === 'bank-registration' ? 'Register Now' : 'Access Service'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 text-center border border-cyan-200">
              <div className="text-3xl font-bold text-blue-900 mb-2">2,500+</div>
              <div className="text-cyan-700">E-Residents Worldwide</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 text-center border border-cyan-200">
              <div className="text-3xl font-bold text-blue-900 mb-2">1,200+</div>
              <div className="text-cyan-700">Companies Registered</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 text-center border border-cyan-200">
              <div className="text-3xl font-bold text-blue-900 mb-2">85+</div>
              <div className="text-cyan-700">Countries Represented</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 text-center border border-cyan-200">
              <div className="text-3xl font-bold text-blue-900 mb-2">$15M+</div>
              <div className="text-cyan-700">Business Volume</div>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center text-sm text-blue-800 bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-cyan-200">
            <p className="font-medium">Powered by Sovio Digital Identity Platform</p>
            <p>Kingdom of Bhutan - Where Gross National Happiness meets Global Entrepreneurship</p>
            <p className="mt-2 text-xs text-blue-600">© 2024 Royal Government of Bhutan. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  )
}