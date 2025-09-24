import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { RegisterPage } from '../pages/RegisterPage'
import { AuthProvider } from '../contexts/AuthContext'

const mockRegister = vi.fn()
const mockAuthContext = {
  user: null,
  login: vi.fn(),
  register: mockRegister,
  logout: vi.fn(),
  loading: false,
  token: null
}

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => mockAuthContext,
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ children, to }: { children: React.ReactNode, to: string }) => 
      <a href={to}>{children}</a>
  }
})

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

const renderRegisterPage = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders registration form with all required fields', () => {
    renderRegisterPage()
    
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/referral code/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('shows validation errors for empty required fields', async () => {
    renderRegisterPage()
    
    const submitButton = screen.getByRole('button', { name: /create account/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/country is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })

  it('shows password mismatch error', async () => {
    renderRegisterPage()
    
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'StrongPass123' } })
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'DifferentPass123' } })
    
    const submitButton = screen.getByRole('button', { name: /create account/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    })
  })

  it('maps backend error codes to user-friendly messages', async () => {
    const errorCodes = [
      { code: '409_EMAIL_EXISTS', message: 'That email is already registered' },
      { code: '400_WEAK_PASSWORD', message: 'Password must be at least 8 characters with uppercase, lowercase, and number' },
      { code: '400_INVALID_REFERRAL', message: 'Invalid referral code' },
      { code: '400_VALIDATION_FAILED', message: 'Please check your information and try again' }
    ]

    errorCodes.forEach(({ code, message }) => {
      mockRegister.mockRejectedValueOnce({
        response: {
          data: {
            detail: {
              error_code: code,
              message: message,
              field: 'test'
            }
          }
        }
      })

      renderRegisterPage()
      
      fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } })
      fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } })
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } })
      fireEvent.change(screen.getByLabelText(/country/i), { target: { value: 'United States' } })
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'StrongPass123' } })
      fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'StrongPass123' } })
      
      const submitButton = screen.getByRole('button', { name: /create account/i })
      fireEvent.click(submitButton)
      
      waitFor(() => {
        expect(screen.getByText(message)).toBeInTheDocument()
      })
    })
  })

  it('calls register function with correct data on valid submission', async () => {
    mockRegister.mockResolvedValueOnce({})
    
    renderRegisterPage()
    
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } })
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/country/i), { target: { value: 'United States' } })
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '+1234567890' } })
    fireEvent.change(screen.getByLabelText(/referral code/i), { target: { value: 'REF123' } })
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'StrongPass123' } })
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'StrongPass123' } })
    
    const submitButton = screen.getByRole('button', { name: /create account/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'StrongPass123',
        first_name: 'John',
        last_name: 'Doe',
        country: 'United States',
        phone: '+1234567890',
        referral_code: 'REF123'
      })
    })
  })

  it('redirects to dashboard with onboarding parameter on successful registration', async () => {
    mockRegister.mockResolvedValueOnce({})
    
    renderRegisterPage()
    
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } })
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/country/i), { target: { value: 'United States' } })
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'StrongPass123' } })
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'StrongPass123' } })
    
    const submitButton = screen.getByRole('button', { name: /create account/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard?onboarding=true')
    }, { timeout: 3000 })
  })
})
