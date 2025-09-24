import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Navbar } from './components/Navbar'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { InvestmentsPage } from './pages/InvestmentsPage'
import { KYCPage } from './pages/KYCPage'
import { AdminPage } from './pages/AdminPage'
import { LandingPage } from './pages/LandingPage'
import { Toaster } from 'sonner'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  }
  
  if (!user) {
    return <Navigate to="/login" />
  }
  
  return <>{children}</>
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  }
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" />
  }
  
  return <>{children}</>
}

function AppContent() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/investments" element={
          <ProtectedRoute>
            <InvestmentsPage />
          </ProtectedRoute>
        } />
        <Route path="/kyc" element={
          <ProtectedRoute>
            <KYCPage />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        } />
      </Routes>
      <Toaster position="top-right" />
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App
