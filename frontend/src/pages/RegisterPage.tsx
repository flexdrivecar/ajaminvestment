import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Loader2, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000'

const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'Singapore',
  'Hong Kong', 'Switzerland', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Belgium',
  'Austria', 'Ireland', 'New Zealand', 'South Korea', 'UAE', 'Saudi Arabia', 'Qatar', 'Kuwait',
  'India', 'China', 'Brazil', 'Mexico', 'South Africa', 'Nigeria', 'Kenya', 'Ghana', 'Egypt',
  'Other'
]

interface FormData {
  first_name: string
  last_name: string
  email: string
  country: string
  phone: string
  referral_code: string
  password: string
  confirmPassword: string
}

interface ValidationErrors {
  [key: string]: string
}

interface ApiError {
  error_code: string
  message: string
  field?: string
}

export function RegisterPage() {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const navigate = useNavigate()

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string): string[] => {
    const errors: string[] = []
    if (password.length < 8) errors.push('Password must be at least 8 characters long')
    if (!/[A-Z]/.test(password)) errors.push('Password must contain at least one uppercase letter')
    if (!/[a-z]/.test(password)) errors.push('Password must contain at least one lowercase letter')
    if (!/\d/.test(password)) errors.push('Password must contain at least one number')
    return errors
  }

  const clearValidationError = (field: string) => {
    setValidationErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }

  const mapApiError = (error: ApiError): string => {
    switch (error.error_code) {
      case '409_EMAIL_EXISTS':
        return 'That email is already registered. Please use a different email or try signing in.'
      case '400_WEAK_PASSWORD':
        return 'Password is too weak. Please choose a stronger password.'
      case '400_INVALID_REFERRAL':
        return 'Invalid referral code. Please check the code and try again.'
      case '400_VALIDATION_FAILED':
        return error.message || 'Please check your input and try again.'
      default:
        return error.message || 'Registration failed. Please try again.'
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    const submitData = {
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      email: formData.get('email') as string,
      country: formData.get('country') as string,
      phone: formData.get('phone') as string,
      referral_code: formData.get('referral_code') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string
    }
    
    const errors: ValidationErrors = {}
    
    if (!submitData.first_name?.trim()) errors.first_name = 'First name is required'
    if (!submitData.last_name?.trim()) errors.last_name = 'Last name is required'
    if (!submitData.email?.trim()) errors.email = 'Email is required'
    if (!submitData.country) errors.country = 'Country is required'
    if (!submitData.password) errors.password = 'Password is required'
    if (!submitData.confirmPassword) errors.confirmPassword = 'Please confirm your password'

    if (submitData.email && !validateEmail(submitData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (submitData.password) {
      const passwordErrors = validatePassword(submitData.password)
      if (passwordErrors.length > 0) {
        errors.password = passwordErrors[0]
      }
    }

    if (submitData.password && submitData.confirmPassword && submitData.password !== submitData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      toast.error('Please fix the errors below')
      return
    }

    setLoading(true)
    setValidationErrors({})

    try {
      const { confirmPassword, ...registerData } = submitData
      
      const response = await axios.post(`${API_URL}/auth/register`, registerData)
      
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`
        
        setSuccess(true)
        toast.success('Account created successfully!')
        
        setTimeout(() => {
          navigate('/dashboard?onboarding=true')
        }, 1500)
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      
      if (error.response?.data) {
        const apiError = error.response.data as ApiError
        const errorMessage = mapApiError(apiError)
        
        if (apiError.field) {
          setValidationErrors({ [apiError.field]: errorMessage })
        } else {
          toast.error(errorMessage)
        }
      } else {
        toast.error('Registration failed. Please check your connection and try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                <h2 className="text-2xl font-bold text-gray-900">Account Created Successfully!</h2>
                <p className="text-gray-600">
                  Your account is pending KYC verification. Please upload the required documents to start investing.
                </p>
                <div className="animate-pulse text-sm text-gray-500">
                  Redirecting to your dashboard...
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Join Ajmal Investments</CardTitle>
            <CardDescription>
              Start your investment journey with our global platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    type="text"
                    onChange={() => clearValidationError('first_name')}
                    className={`mt-1 ${validationErrors.first_name ? 'border-red-500' : ''}`}
                    placeholder="John"
                  />
                  {validationErrors.first_name && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.first_name}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    type="text"
                    onChange={() => clearValidationError('last_name')}
                    className={`mt-1 ${validationErrors.last_name ? 'border-red-500' : ''}`}
                    placeholder="Doe"
                  />
                  {validationErrors.last_name && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.last_name}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  onChange={() => clearValidationError('email')}
                  className={`mt-1 ${validationErrors.email ? 'border-red-500' : ''}`}
                  placeholder="john@example.com"
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="country">Country *</Label>
                <select
                  id="country"
                  name="country"
                  onChange={() => clearValidationError('country')}
                  className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.country ? 'border-red-500' : ''}`}
                >
                  <option value="">Select your country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
                {validationErrors.country && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.country}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="mt-1"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <Label htmlFor="referral_code">Referral Code (Optional)</Label>
                <Input
                  id="referral_code"
                  name="referral_code"
                  type="text"
                  onChange={() => clearValidationError('referral_code')}
                  className={`mt-1 ${validationErrors.referral_code ? 'border-red-500' : ''}`}
                  placeholder="Enter referral code if you have one"
                />
                {validationErrors.referral_code && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.referral_code}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  onChange={() => clearValidationError('password')}
                  className={`mt-1 ${validationErrors.password ? 'border-red-500' : ''}`}
                  placeholder="Minimum 8 characters with uppercase, lowercase, and number"
                />
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  onChange={() => clearValidationError('confirmPassword')}
                  className={`mt-1 ${validationErrors.confirmPassword ? 'border-red-500' : ''}`}
                  placeholder="Confirm your password"
                />
                {validationErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}
