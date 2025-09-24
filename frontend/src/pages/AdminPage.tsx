import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Users, DollarSign, TrendingUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000'

interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  country: string
  kyc_status: string
  is_active: boolean
  balance: number
  created_at: string
}

interface PlatformStats {
  total_users: number
  active_users: number
  pending_kyc: number
  total_investments: number
  total_invested_amount: number
  platform_revenue: number
}

export function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [userFilter, setUserFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/admin/users`),
        axios.get(`${API_URL}/admin/stats`)
      ])
      setUsers(usersRes.data)
      setStats(statsRes.data)
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
      toast.error('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  const updateKYCStatus = async (userId: string, status: string) => {
    try {
      await axios.put(`${API_URL}/admin/users/${userId}/kyc-status`, {
        status
      })
      
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, kyc_status: status } : user
      ))
      
      toast.success(`KYC status updated to ${status}`)
    } catch (error: any) {
      console.error('Failed to update KYC status:', error)
      toast.error(error.response?.data?.detail || 'Failed to update KYC status')
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesFilter = userFilter === 'all' || 
      (userFilter === 'pending_kyc' && user.kyc_status === 'pending') ||
      (userFilter === 'approved' && user.kyc_status === 'approved') ||
      (userFilter === 'active' && user.is_active)
    
    const matchesSearch = searchTerm === '' ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

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
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage users, KYC verifications, and platform analytics
          </p>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_users}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.active_users} active users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending KYC</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pending_kyc}</div>
                <p className="text-xs text-muted-foreground">
                  Require review
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${stats.total_invested_amount.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.total_investments} investments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${stats.platform_revenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="kyc">KYC Reviews</TabsTrigger>
            <TabsTrigger value="investments">Investments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts and permissions
                </CardDescription>
                <div className="flex space-x-4">
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                  <Select value={userFilter} onValueChange={setUserFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="active">Active Users</SelectItem>
                      <SelectItem value="pending_kyc">Pending KYC</SelectItem>
                      <SelectItem value="approved">KYC Approved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>KYC Status</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {user.first_name} {user.last_name}
                            </div>
                            <div className="text-sm text-gray-600">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{user.country}</TableCell>
                        <TableCell>
                          <Badge variant={
                            user.kyc_status === 'approved' ? 'default' :
                            user.kyc_status === 'rejected' ? 'destructive' : 'secondary'
                          }>
                            {user.kyc_status}
                          </Badge>
                        </TableCell>
                        <TableCell>${user.balance.toLocaleString()}</TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {user.kyc_status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => updateKYCStatus(user.id, 'approved')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateKYCStatus(user.id, 'rejected')}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kyc">
            <Card>
              <CardHeader>
                <CardTitle>KYC Reviews</CardTitle>
                <CardDescription>
                  Review and approve user identity verifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">KYC document review interface would be implemented here</p>
                  <p className="text-sm text-gray-400">This would include document viewing, approval/rejection, and notes</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investments">
            <Card>
              <CardHeader>
                <CardTitle>Investment Oversight</CardTitle>
                <CardDescription>
                  Monitor and manage platform investments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">Investment management interface would be implemented here</p>
                  <p className="text-sm text-gray-400">This would include investment tracking, performance monitoring, and risk management</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
                <CardDescription>
                  Detailed analytics and reporting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">Advanced analytics dashboard would be implemented here</p>
                  <p className="text-sm text-gray-400">This would include charts, reports, and business intelligence</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
