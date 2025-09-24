import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Progress } from '../components/ui/progress'
import { Badge } from '../components/ui/badge'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, DollarSign, PieChart as PieChartIcon, AlertCircle, Plus, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000'

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

interface Portfolio {
  total_invested: number
  current_value: number
  total_profit_loss: number
  roi_percentage: number
  investments: Investment[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C', '#8DD1E1']

export function DashboardPage() {
  const { user } = useAuth()
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPortfolio()
  }, [])

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get(`${API_URL}/portfolio`)
      setPortfolio(response.data)
    } catch (error) {
      console.error('Failed to fetch portfolio:', error)
    } finally {
      setLoading(false)
    }
  }

  const performanceData = [
    { month: 'Jan', value: 10000 },
    { month: 'Feb', value: 10500 },
    { month: 'Mar', value: 11200 },
    { month: 'Apr', value: 10800 },
    { month: 'May', value: 12100 },
    { month: 'Jun', value: 12800 },
  ]

  const categoryData = portfolio?.investments.reduce((acc: any[], inv) => {
    const existing = acc.find(item => item.name === inv.category)
    if (existing) {
      existing.value += inv.amount
    } else {
      acc.push({ name: inv.category, value: inv.amount })
    }
    return acc
  }, []) || []

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
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.first_name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's an overview of your investment portfolio
          </p>
        </div>

        {user?.kyc_status !== 'approved' && (
          <Card className="mb-8 border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-yellow-800 font-medium">KYC Verification Required</p>
                  <p className="text-yellow-700 text-sm">
                    Complete your KYC verification to start investing and access all features.
                  </p>
                </div>
                <Link to="/kyc">
                  <Button variant="outline" size="sm" className="ml-auto">
                    Complete KYC
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${user?.balance.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Available for investment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${portfolio?.total_invested.toLocaleString() || '0'}
              </div>
              <p className="text-xs text-muted-foreground">Across all investments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Value</CardTitle>
              <PieChartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${portfolio?.current_value.toLocaleString() || '0'}
              </div>
              <p className="text-xs text-muted-foreground">Portfolio value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Return</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                (portfolio?.total_profit_loss || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ${portfolio?.total_profit_loss.toLocaleString() || '0'}
              </div>
              <p className="text-xs text-muted-foreground">
                {portfolio?.roi_percentage.toFixed(2) || '0'}% ROI
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Performance</CardTitle>
              <CardDescription>Your investment growth over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} />
                  <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Investment Allocation</CardTitle>
              <CardDescription>Distribution across categories</CardDescription>
            </CardHeader>
            <CardContent>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-gray-500">
                  <div className="text-center">
                    <PieChartIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No investments yet</p>
                    <p className="text-sm">Start investing to see your allocation</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Investments</CardTitle>
                  <CardDescription>Your latest investment activities</CardDescription>
                </div>
                <Link to="/investments">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {portfolio?.investments && portfolio.investments.length > 0 ? (
                  <div className="space-y-4">
                    {portfolio.investments.slice(0, 5).map((investment) => (
                      <div key={investment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{investment.category.replace('_', ' ').toUpperCase()}</p>
                          <p className="text-sm text-gray-600">
                            Invested: ${investment.amount.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${
                            investment.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {investment.profit_loss >= 0 ? '+' : ''}${investment.profit_loss.toLocaleString()}
                          </p>
                          <Badge variant={investment.status === 'active' ? 'default' : 'secondary'}>
                            {investment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 mb-4">No investments yet</p>
                    <Link to="/investments">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Start Investing
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link to="/investments" className="block">
                  <Button className="w-full" disabled={user?.kyc_status !== 'approved'}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Investment
                  </Button>
                </Link>
                
                <Button variant="outline" className="w-full" disabled={user?.kyc_status !== 'approved'}>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Deposit Funds
                </Button>
                
                <Button variant="outline" className="w-full" disabled={user?.kyc_status !== 'approved'}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Withdraw
                </Button>
                
                <Link to="/kyc" className="block">
                  <Button variant="outline" className="w-full">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    KYC Status
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
