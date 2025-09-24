import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Copy, Users, DollarSign, Share2, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'

interface ReferralData {
  referral_code: string
  total_referrals: number
  total_earned: number
  referrals: Array<{
    first_name: string
    last_name: string
    email: string
    referred_date: string
    total_earned: number
  }>
}

export function ReferralPage() {
  const { user } = useAuth()
  const [referralData, setReferralData] = useState<ReferralData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchReferralData()
  }, [])

  const fetchReferralData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/referrals/info', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReferralData(response.data)
    } catch (error) {
      console.error('Failed to fetch referral data:', error)
      toast.error('Failed to load referral information')
    } finally {
      setLoading(false)
    }
  }

  const copyReferralLink = () => {
    if (!referralData?.referral_code) return
    
    const referralLink = `${window.location.origin}/register?ref=${referralData.referral_code}`
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    toast.success('Referral link copied to clipboard!')
    
    setTimeout(() => setCopied(false), 2000)
  }

  const shareReferralLink = () => {
    if (!referralData?.referral_code) return
    
    const referralLink = `${window.location.origin}/register?ref=${referralData.referral_code}`
    const text = `Join me on Ajmal Investments PLC - Premier International Investment Platform! Use my referral link to get started: ${referralLink}`
    
    if (navigator.share) {
      navigator.share({
        title: 'Join Ajmal Investments PLC',
        text: text,
        url: referralLink
      })
    } else {
      navigator.clipboard.writeText(text)
      toast.success('Referral message copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Referral Program</h1>
          <p className="mt-2 text-gray-600">
            Earn 5% commission on every investment made by your referrals
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{referralData?.total_referrals || 0}</div>
              <p className="text-xs text-muted-foreground">
                People you've referred
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${referralData?.total_earned?.toFixed(2) || '0.00'}</div>
              <p className="text-xs text-muted-foreground">
                Commission earned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5%</div>
              <p className="text-xs text-muted-foreground">
                On all referral investments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Referral Link Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Referral Link</CardTitle>
            <CardDescription>
              Share this link with friends and family to earn commissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  value={referralData?.referral_code ? `${window.location.origin}/register?ref=${referralData.referral_code}` : ''}
                  readOnly
                  className="font-mono text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={copyReferralLink} variant="outline" className="flex items-center gap-2">
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button onClick={shareReferralLink} className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
            
            <Alert className="mt-4">
              <AlertDescription>
                <strong>How it works:</strong> When someone registers using your referral link and makes an investment, 
                you earn 5% commission on their investment amount. Commissions are automatically added to your account balance.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Referral History */}
        <Card>
          <CardHeader>
            <CardTitle>Referral History</CardTitle>
            <CardDescription>
              People who joined using your referral link
            </CardDescription>
          </CardHeader>
          <CardContent>
            {referralData?.referrals && referralData.referrals.length > 0 ? (
              <div className="space-y-4">
                {referralData.referrals.map((referral, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {referral.first_name[0]}{referral.last_name[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{referral.first_name} {referral.last_name}</p>
                        <p className="text-sm text-gray-500">{referral.email}</p>
                        <p className="text-xs text-gray-400">
                          Joined {new Date(referral.referred_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">
                        ${referral.total_earned?.toFixed(2) || '0.00'} earned
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No referrals yet</h3>
                <p className="text-gray-500 mb-4">
                  Start sharing your referral link to earn commissions
                </p>
                <Button onClick={copyReferralLink} className="flex items-center gap-2 mx-auto">
                  <Copy className="h-4 w-4" />
                  Copy Referral Link
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
