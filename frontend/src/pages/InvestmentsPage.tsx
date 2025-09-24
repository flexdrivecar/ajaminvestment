import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Alert, AlertDescription } from '../components/ui/alert'
import { TrendingUp, DollarSign, AlertCircle, Plus, Filter } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000'

interface InvestmentCategory {
  category: string
  name: string
  description: string
  expected_return_min: number
  expected_return_max: number
  risk_level: string
  minimum_investment: number
  details: any
}

interface Investment {
  id: string
  category: string
  amount: number
  expected_return: number
  current_value: number
  profit_loss: number
  status: string
  start_date: string
}

export function InvestmentsPage() {
  const { user } = useAuth()
  const [categories, setCategories] = useState<InvestmentCategory[]>([])
  const [investments, setInvestments] = useState<Investment[]>([])
  const [loading, setLoading] = useState(true)
  const [investDialogOpen, setInvestDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<InvestmentCategory | null>(null)
  const [investmentAmount, setInvestmentAmount] = useState('')
  const [investing, setInvesting] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [categoriesRes, investmentsRes] = await Promise.all([
        axios.get(`${API_URL}/investment-categories`),
        axios.get(`${API_URL}/investments`)
      ])
      setCategories(categoriesRes.data)
      setInvestments(investmentsRes.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast.error('Failed to load investment data')
    } finally {
      setLoading(false)
    }
  }

  const handleInvest = async () => {
    if (!selectedCategory || !investmentAmount) return

    const amount = parseFloat(investmentAmount)
    if (amount < selectedCategory.minimum_investment) {
      toast.error(`Minimum investment is $${selectedCategory.minimum_investment.toLocaleString()}`)
      return
    }

    if (amount > (user?.balance || 0)) {
      toast.error('Insufficient balance')
      return
    }

    setInvesting(true)
    try {
      await axios.post(`${API_URL}/investments`, {
        category: selectedCategory.category,
        amount: amount
      })
      
      toast.success('Investment created successfully!')
      setInvestDialogOpen(false)
      setInvestmentAmount('')
      setSelectedCategory(null)
      fetchData()
    } catch (error: any) {
      console.error('Investment failed:', error)
      toast.error(error.response?.data?.detail || 'Investment failed')
    } finally {
      setInvesting(false)
    }
  }

  const filteredInvestments = investments.filter(inv => 
    filter === 'all' || inv.status === filter
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Investment Opportunities</h1>
          <p className="text-gray-600 mt-2">
            Explore our diversified investment categories with up to 14% ROI
          </p>
        </div>

        {user?.kyc_status !== 'approved' && (
          <Alert className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Complete your KYC verification to start investing. 
              <Button variant="link" className="p-0 ml-1 h-auto">
                Complete KYC
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Investment Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.category} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <Badge variant="outline">{category.risk_level}</Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Expected Returns</span>
                      <span className="font-semibold text-green-600">
                        {category.expected_return_min}% - {category.expected_return_max}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Minimum Investment</span>
                      <span className="font-semibold">
                        ${category.minimum_investment.toLocaleString()}
                      </span>
                    </div>
                    
                    <Dialog open={investDialogOpen && selectedCategory?.category === category.category} 
                            onOpenChange={(open) => {
                              setInvestDialogOpen(open)
                              if (!open) {
                                setSelectedCategory(null)
                                setInvestmentAmount('')
                              }
                            }}>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full" 
                          disabled={user?.kyc_status !== 'approved'}
                          onClick={() => setSelectedCategory(category)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Invest Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Invest in {category.name}</DialogTitle>
                          <DialogDescription>
                            {category.description}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Expected Returns:</span>
                              <p className="font-semibold text-green-600">
                                {category.expected_return_min}% - {category.expected_return_max}%
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600">Risk Level:</span>
                              <p className="font-semibold">{category.risk_level}</p>
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="amount">Investment Amount</Label>
                            <Input
                              id="amount"
                              type="number"
                              placeholder={`Minimum $${category.minimum_investment.toLocaleString()}`}
                              value={investmentAmount}
                              onChange={(e) => setInvestmentAmount(e.target.value)}
                              className="mt-1"
                            />
                            <p className="text-sm text-gray-600 mt-1">
                              Available balance: ${user?.balance.toLocaleString()}
                            </p>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button 
                              onClick={handleInvest} 
                              disabled={investing || !investmentAmount}
                              className="flex-1"
                            >
                              {investing ? 'Processing...' : 'Confirm Investment'}
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setInvestDialogOpen(false)}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Investments</h2>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Investments</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredInvestments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInvestments.map((investment) => (
                <Card key={investment.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">
                        {investment.category.replace('_', ' ').toUpperCase()}
                      </CardTitle>
                      <Badge variant={investment.status === 'active' ? 'default' : 'secondary'}>
                        {investment.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      Started: {new Date(investment.start_date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Invested</span>
                        <span className="font-semibold">${investment.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Current Value</span>
                        <span className="font-semibold">${investment.current_value.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Profit/Loss</span>
                        <span className={`font-semibold ${
                          investment.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {investment.profit_loss >= 0 ? '+' : ''}${investment.profit_loss.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Expected Return</span>
                        <span className="font-semibold text-blue-600">
                          {investment.expected_return.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No investments found</h3>
                <p className="text-gray-600 mb-4">
                  {filter === 'all' 
                    ? "You haven't made any investments yet. Start building your portfolio today!"
                    : `No ${filter} investments found. Try changing the filter.`
                  }
                </p>
                {filter === 'all' && (
                  <Button disabled={user?.kyc_status !== 'approved'}>
                    <Plus className="h-4 w-4 mr-2" />
                    Make Your First Investment
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
