'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dashboard } from '@/components/dashboard'

export default function DashboardPage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    // In a real app, you would get this from authentication context or session
    const email = localStorage.getItem('userEmail')
    if (!email) {
      router.push('/')
      return
    }
    setUserEmail(email)
  }, [router])

  const handleSignOut = () => {
    localStorage.removeItem('userEmail')
    router.push('/')
  }

  if (!userEmail) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return <Dashboard userEmail={userEmail} onSignOut={handleSignOut} />
}