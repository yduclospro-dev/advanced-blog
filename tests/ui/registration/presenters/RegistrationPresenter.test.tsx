import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import RegistrationPresenter from '@/components/auth/registration/presenters/RegistrationPresenter'

jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
  return MockLink
})

jest.mock('@/components/ui', () => ({
  Button: ({ label, disabled, type, variant }: { label: string; disabled?: boolean; type?: 'button' | 'submit' | 'reset'; variant?: string }) => (
    <button type={type} disabled={disabled} data-variant={variant}>
      {label}
    </button>
  ),
  Input: ({ label, id, value, onChange, disabled, type }: { label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean; type?: string }) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  ),
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
  ,
  ImageUpload: ({ value }: { value?: string | null }) => <div data-testid="image-upload">{value}</div>
}))

describe('RegistrationPresenter', () => {
  const mockProps = {
    formData: {
      username: '',
      email: '',
      password: ''
    },
    isLoading: false,
    error: '',
    onInputChange: jest.fn(),
    onSubmit: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render registration form with all fields', () => {
    // Arrange
    const props = mockProps

    // Act
    render(<RegistrationPresenter {...props} />)
    
    // Assert
    expect(screen.getByLabelText(/nom d'utilisateur/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /S'inscrire/i })).toBeInTheDocument()
  })

  it('should display form data correctly', () => {
    // Arrange
    const propsWithData = {
      ...mockProps,
      formData: {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123'
      }
    }

    // Act
    render(<RegistrationPresenter {...propsWithData} />)
    
    // Assert
    expect(screen.getByDisplayValue('john_doe')).toBeInTheDocument()
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('password123')).toBeInTheDocument()
  })

  it('should call onInputChange when user types in username field', async () => {
    // Arrange
    const user = userEvent.setup()
    const expectedValue = 'j'
    render(<RegistrationPresenter {...mockProps} />)
    const usernameInput = screen.getByLabelText(/nom d'utilisateur/i)
    
    // Act
    await user.type(usernameInput, expectedValue)
    
    // Assert
    expect(mockProps.onInputChange).toHaveBeenCalledTimes(1)
    expect(mockProps.onInputChange).toHaveBeenCalledWith('username', expectedValue)
  })

  it('should call onInputChange when user types in email field', () => {
    // Arrange
    const expectedEmail = 'test@example.com'
    render(<RegistrationPresenter {...mockProps} />)
    const emailInput = screen.getByLabelText(/email/i)
    
    // Act
    fireEvent.change(emailInput, { target: { value: expectedEmail } })
    
    // Assert
    expect(mockProps.onInputChange).toHaveBeenCalledTimes(1)
    expect(mockProps.onInputChange).toHaveBeenCalledWith('email', expectedEmail)
  })

  it('should call onSubmit when form is submitted', () => {
    // Arrange
    render(<RegistrationPresenter {...mockProps} />)
    const form = screen.getByRole('button', { name: /S'inscrire/i }).closest('form')
    
    // Act
    if (form) {
      fireEvent.submit(form)
    }
    
    // Assert
    expect(mockProps.onSubmit).toHaveBeenCalled()
  })

  it('should display error message when error prop is provided', () => {
    // Arrange
    const errorMessage = 'Erreur de test'
    const propsWithError = {
      ...mockProps,
      error: errorMessage
    }

    // Act
    render(<RegistrationPresenter {...propsWithError} />)
    
    // Assert
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('should disable form fields and show loading text when isLoading is true', () => {
    // Arrange
    const propsWithLoading = {
      ...mockProps,
      isLoading: true
    }

    // Act
    render(<RegistrationPresenter {...propsWithLoading} />)
    
    // Assert
    expect(screen.getByLabelText(/nom d'utilisateur/i)).toBeDisabled()
    expect(screen.getByLabelText(/email/i)).toBeDisabled()
    expect(screen.getByLabelText(/mot de passe/i)).toBeDisabled()
    expect(screen.getByRole('button', { name: /inscription\.\.\./i })).toBeDisabled()
  })

  it('should render login link', () => {
    // Arrange
    // Act
    render(<RegistrationPresenter {...mockProps} />)
    const loginLink = screen.getByText(/Se connecter/i)
    
    // Assert
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login')
  })
})