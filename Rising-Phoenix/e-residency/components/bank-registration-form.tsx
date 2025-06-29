'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select } from './ui/select'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'

interface BankRegistrationFormProps {
  userEmail: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function BankRegistrationForm({ userEmail, onSuccess, onCancel }: BankRegistrationFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'form' | 'verification'>('form')
  const [verificationUrl, setVerificationUrl] = useState('')
  
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    mobileNumber: '',
    dzongkhag: '',
    gewog: '',
    village: '',
    houseNumber: '',
    occupation: '',
    employerName: '',
    monthlyIncome: '',
    accountType: 'SAVINGS',
    initialDeposit: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // First, request proof verification
      const proofResponse = await fetch('/api/request-proof', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      })

      const proofData = await proofResponse.json()

      if (!proofResponse.ok) {
        throw new Error(proofData.error || 'Failed to request identity verification')
      }

      // Store the invitation URL if provided
      if (proofData.invitationUrl) {
        setVerificationUrl(proofData.invitationUrl)
      }

      setStep('verification')
      
      // In a real app, you would:
      // 1. Show QR code or link for verification
      // 2. Poll for verification status
      // 3. Once verified, submit bank registration
      
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleVerificationComplete = () => {
    // In a real app, this would be called after successful verification
    alert('Bank account registration successful! Your account will be created within 2-3 business days.')
    onSuccess?.()
  }

  if (step === 'verification') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Identity Verification Required</CardTitle>
          <CardDescription>
            Please verify your digital identity to proceed with bank account registration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Check your email for the verification link, or scan the QR code with your Sovio wallet app.
            </p>
            {verificationUrl && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs break-all">{verificationUrl}</p>
              </div>
            )}
            <div className="flex justify-center">
              <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">QR Code Placeholder</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleVerificationComplete}>
            I&apos;ve Verified My Identity
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Bank Account Registration</CardTitle>
        <CardDescription>
          Register for a new bank account using your Digital Identity
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name (as per DID)</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mobileNumber">Mobile Number</Label>
              <Input
                id="mobileNumber"
                name="mobileNumber"
                type="tel"
                placeholder="+975 17123456"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dzongkhag">Dzongkhag</Label>
              <Input
                id="dzongkhag"
                name="dzongkhag"
                type="text"
                placeholder="Thimphu"
                value={formData.dzongkhag}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gewog">Gewog</Label>
              <Input
                id="gewog"
                name="gewog"
                type="text"
                value={formData.gewog}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="village">Village</Label>
              <Input
                id="village"
                name="village"
                type="text"
                value={formData.village}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="houseNumber">House Number</Label>
              <Input
                id="houseNumber"
                name="houseNumber"
                type="text"
                value={formData.houseNumber}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                name="occupation"
                type="text"
                value={formData.occupation}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="employerName">Employer Name</Label>
              <Input
                id="employerName"
                name="employerName"
                type="text"
                value={formData.employerName}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="monthlyIncome">Monthly Income (Nu.)</Label>
              <Input
                id="monthlyIncome"
                name="monthlyIncome"
                type="number"
                placeholder="25000"
                value={formData.monthlyIncome}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accountType">Account Type</Label>
              <Select
                id="accountType"
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                required
              >
                <option value="SAVINGS">Savings Account</option>
                <option value="CURRENT">Current Account</option>
                <option value="FIXED_DEPOSIT">Fixed Deposit</option>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="initialDeposit">Initial Deposit (Nu.)</Label>
              <Input
                id="initialDeposit"
                name="initialDeposit"
                type="number"
                placeholder="1000"
                value={formData.initialDeposit}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> As a Bhutan resident with a Digital Identity (DID), 
              you don&apos;t need to provide your CID number. Your identity will be verified 
              through the DID system.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Proceed to Verification'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}