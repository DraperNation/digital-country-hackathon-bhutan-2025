'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from './ui/button'
import { KYCForm } from './kyc-form'

export function AuthButtons() {
  const router = useRouter()
  const [showKYC, setShowKYC] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [, setUserEmail] = useState('')

  const handleSignIn = () => {
    setShowKYC(true)
  }

  const handleSignUp = () => {
    setShowKYC(true)
  }

  const handleKYCSuccess = (email?: string) => {
    setShowKYC(false)
    setIsSignedIn(true)
    
    // Store user email for dashboard
    if (email) {
      setUserEmail(email)
      localStorage.setItem('userEmail', email)
    }
    
    // Redirect to dashboard
    router.push('/dashboard')
  }

  const handleKYCCancel = () => {
    setShowKYC(false)
  }

  const handleSignOut = () => {
    setIsSignedIn(false)
  }

  if (showKYC) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <KYCForm onSuccess={handleKYCSuccess} onCancel={handleKYCCancel} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-cyan-100/30"></div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 max-w-md w-full text-center border border-cyan-200">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <Image
              src="/bhutan.svg.png"
              alt="Bhutan Coat of Arms"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">BHUTAN E-RESIDENCY</h1>
          <h2 className="text-xl font-semibold text-cyan-700 mb-4">Digital Identity Portal</h2>
          <p className="text-blue-700 mb-6">
            Create your e-Resident digital identity and access services from the Kingdom of Bhutan
          </p>
        
          {isSignedIn ? (
            <div className="space-y-4">
              <p className="text-lg text-blue-900">You are signed in!</p>
              <Button onClick={handleSignOut} variant="outline" className="bg-white/90 hover:bg-white">
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-4 justify-center">
                <Button onClick={handleSignIn} className="bg-blue-600 hover:bg-blue-700">
                  Sign In
                </Button>
                <Button onClick={handleSignUp} variant="outline" className="bg-white/90 hover:bg-white border-cyan-300">
                  Sign Up
                </Button>
              </div>
              <p className="text-xs text-blue-600">
                By signing up, you agree to become an e-Resident of Bhutan
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}