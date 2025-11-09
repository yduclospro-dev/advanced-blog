import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import LoginPresenter from '@/components/auth/login/presenters/LoginPresenter'

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
}))

jest.mock('@/components/ui', () => ({
  Button: ({ label, onClick, disabled, type, fullWidth, variant }: { label: string; onClick?: () => void; disabled?: boolean; type?: 'submit' | 'button' | 'reset'; fullWidth?: boolean; variant?: string }) => (
    <button onClick={onClick} disabled={disabled} type={type} data-fullwidth={fullWidth} data-variant={variant}>
      {label}
    </button>
  ),
  Input: ({ id, label, value, onChange, placeholder, type, disabled, variant }: { id?: string; label?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; type?: string; disabled?: boolean; variant?: string }) => (
    <div>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        disabled={disabled}
        data-variant={variant}
      />
    </div>
  ),
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
  ,
  ImageUpload: ({ value }: { value?: string | null }) => <div data-testid="image-upload">{value}</div>
}))

describe('LoginPresenter', () => {
  const mockProps = {
    formData: {
      email: '',
      password: ''
    },
    error: '',
    onInputChange: jest.fn(),
    onSubmit: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render login form with all fields', () => {
      // Arrange & Act
      render(<LoginPresenter {...mockProps} />)

      // Assert
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
      expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument()
    })

    it('should render page title', () => {
      // Arrange & Act
      render(<LoginPresenter {...mockProps} />)

      // Assert
      expect(screen.getByText(/connectez-vous à votre compte/i)).toBeInTheDocument()
    })

    it('should render registration link', () => {
      // Arrange & Act
      render(<LoginPresenter {...mockProps} />)

      // Assert
      expect(screen.getByText(/pas encore de compte/i)).toBeInTheDocument()
      expect(screen.getByText(/s'inscrire/i)).toBeInTheDocument()
      const link = screen.getByText(/s'inscrire/i).closest('a')
      expect(link).toHaveAttribute('href', '/registration')
    })

    it('should render email input with placeholder', () => {
      // Arrange & Act
      render(<LoginPresenter {...mockProps} />)

      // Assert
      expect(screen.getByPlaceholderText('votre@email.com')).toBeInTheDocument()
    })

    it('should render password input with placeholder', () => {
      // Arrange & Act
      render(<LoginPresenter {...mockProps} />)

      // Assert
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
    })

    it('should render icon in header', () => {
      // Arrange & Act
      const { container } = render(<LoginPresenter {...mockProps} />)

      // Assert
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Form data display', () => {
    it('should display email value', () => {
      // Arrange
      const propsWithEmail = {
        ...mockProps,
        formData: { email: 'test@example.com', password: '' }
      }

      // Act
      render(<LoginPresenter {...propsWithEmail} />)

      // Assert
      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument()
    })

    it('should display password value', () => {
      // Arrange
      const propsWithPassword = {
        ...mockProps,
        formData: { email: '', password: 'password123' }
      }

      // Act
      render(<LoginPresenter {...propsWithPassword} />)

      // Assert
      expect(screen.getByDisplayValue('password123')).toBeInTheDocument()
    })

    it('should display both email and password', () => {
      // Arrange
      const propsWithData = {
        ...mockProps,
        formData: { email: 'user@test.com', password: 'mypass' }
      }

      // Act
      render(<LoginPresenter {...propsWithData} />)

      // Assert
      expect(screen.getByDisplayValue('user@test.com')).toBeInTheDocument()
      expect(screen.getByDisplayValue('mypass')).toBeInTheDocument()
    })
  })

  describe('User interactions', () => {
    it('should call onInputChange when email changes', () => {
      // Arrange
      render(<LoginPresenter {...mockProps} />)
      const emailInput = screen.getByLabelText('Email')

      // Act
      fireEvent.change(emailInput, { target: { value: 'new@email.com' } })

      // Assert
      expect(mockProps.onInputChange).toHaveBeenCalledWith('email', 'new@email.com')
    })

    it('should call onInputChange when password changes', () => {
      // Arrange
      render(<LoginPresenter {...mockProps} />)
      const passwordInput = screen.getByLabelText('Mot de passe')

      // Act
      fireEvent.change(passwordInput, { target: { value: 'newpassword' } })

      // Assert
      expect(mockProps.onInputChange).toHaveBeenCalledWith('password', 'newpassword')
    })

    it('should call onSubmit when form is submitted', () => {
      // Arrange
      render(<LoginPresenter {...mockProps} />)
      const form = screen.getByRole('button', { name: /se connecter/i }).closest('form')

      // Act
      if (form) fireEvent.submit(form)

      // Assert
      expect(mockProps.onSubmit).toHaveBeenCalledTimes(1)
    })

    it('should call onSubmit when submit button is clicked', () => {
      // Arrange
      render(<LoginPresenter {...mockProps} />)
      const submitButton = screen.getByRole('button', { name: /se connecter/i })

      // Act
      fireEvent.click(submitButton)

      // Assert
      expect(mockProps.onSubmit).toHaveBeenCalled()
    })
  })

  describe('Error handling', () => {
    it('should display error message when error is present', () => {
      // Arrange
      const propsWithError = {
        ...mockProps,
        error: 'Email ou mot de passe incorrect'
      }

      // Act
      render(<LoginPresenter {...propsWithError} />)

      // Assert
      expect(screen.getByText('Email ou mot de passe incorrect')).toBeInTheDocument()
    })

    it('should not display error message when error is empty', () => {
      // Arrange & Act
      render(<LoginPresenter {...mockProps} />)

      // Assert
      const errorMessages = screen.queryByText(/incorrect|erreur/i)
      expect(errorMessages).not.toBeInTheDocument()
    })

    it('should display multiple error messages', () => {
      // Arrange
      const propsWithError = {
        ...mockProps,
        error: 'Veuillez remplir tous les champs'
      }

      // Act
      render(<LoginPresenter {...propsWithError} />)

      // Assert
      expect(screen.getByText('Veuillez remplir tous les champs')).toBeInTheDocument()
    })
  })

  describe('Success message', () => {
    it('should display success message when provided', () => {
      // Arrange
      const propsWithSuccess = {
        ...mockProps,
        successMessage: 'Inscription réussie ! Vous pouvez maintenant vous connecter.'
      }

      // Act
      render(<LoginPresenter {...propsWithSuccess} />)

      // Assert
      expect(screen.getByText(/inscription réussie/i)).toBeInTheDocument()
    })

    it('should not display success message when not provided', () => {
      // Arrange & Act
      render(<LoginPresenter {...mockProps} />)

      // Assert
      expect(screen.queryByText(/réussie/i)).not.toBeInTheDocument()
    })
  })

  describe('Loading state', () => {
    it('should disable inputs when loading', () => {
      // Arrange
      const propsWithLoading = {
        ...mockProps,
        isLoading: true
      }

      // Act
      render(<LoginPresenter {...propsWithLoading} />)

      // Assert
      expect(screen.getByLabelText('Email')).toBeDisabled()
      expect(screen.getByLabelText('Mot de passe')).toBeDisabled()
    })

    it('should disable submit button when loading', () => {
      // Arrange
      const propsWithLoading = {
        ...mockProps,
        isLoading: true
      }

      // Act
      render(<LoginPresenter {...propsWithLoading} />)

      // Assert
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('should show loading text on button when loading', () => {
      // Arrange
      const propsWithLoading = {
        ...mockProps,
        isLoading: true
      }

      // Act
      render(<LoginPresenter {...propsWithLoading} />)

      // Assert
      expect(screen.getByText('Connexion en cours...')).toBeInTheDocument()
      expect(screen.queryByText('Se connecter')).not.toBeInTheDocument()
    })

    it('should enable inputs when not loading', () => {
      // Arrange & Act
      render(<LoginPresenter {...mockProps} />)

      // Assert
      expect(screen.getByLabelText('Email')).not.toBeDisabled()
      expect(screen.getByLabelText('Mot de passe')).not.toBeDisabled()
    })

    it('should show normal text on button when not loading', () => {
      // Arrange & Act
      render(<LoginPresenter {...mockProps} />)

      // Assert
      expect(screen.getByText('Se connecter')).toBeInTheDocument()
      expect(screen.queryByText('Connexion en cours...')).not.toBeInTheDocument()
    })
  })

  describe('Input types', () => {
    it('should have email type for email input', () => {
      // Arrange & Act
      render(<LoginPresenter {...mockProps} />)
      const emailInput = screen.getByLabelText('Email')

      // Assert
      expect(emailInput).toHaveAttribute('type', 'email')
    })

    it('should have password type for password input', () => {
      // Arrange & Act
      render(<LoginPresenter {...mockProps} />)
      const passwordInput = screen.getByLabelText('Mot de passe')

      // Assert
      expect(passwordInput).toHaveAttribute('type', 'password')
    })

    it('should have submit type for submit button', () => {
      // Arrange & Act
      render(<LoginPresenter {...mockProps} />)
      const submitButton = screen.getByRole('button', { name: /se connecter|connexion en cours/i })

      // Assert
      expect(submitButton).toHaveAttribute('type', 'submit')
    })
  })

  describe('Multiple interactions', () => {
    it('should handle multiple email changes', () => {
      // Arrange
      render(<LoginPresenter {...mockProps} />)
      const emailInput = screen.getByLabelText('Email')

      // Act
      fireEvent.change(emailInput, { target: { value: 'first@test.com' } })
      fireEvent.change(emailInput, { target: { value: 'second@test.com' } })
      fireEvent.change(emailInput, { target: { value: 'third@test.com' } })

      // Assert
      expect(mockProps.onInputChange).toHaveBeenCalledTimes(3)
      expect(mockProps.onInputChange).toHaveBeenLastCalledWith('email', 'third@test.com')
    })

    it('should handle alternating email and password changes', () => {
      // Arrange
      render(<LoginPresenter {...mockProps} />)
      const emailInput = screen.getByLabelText('Email')
      const passwordInput = screen.getByLabelText('Mot de passe')

      // Act
      fireEvent.change(emailInput, { target: { value: 'user@test.com' } })
      fireEvent.change(passwordInput, { target: { value: 'pass1' } })
      fireEvent.change(emailInput, { target: { value: 'updated@test.com' } })
      fireEvent.change(passwordInput, { target: { value: 'pass2' } })

      // Assert
      expect(mockProps.onInputChange).toHaveBeenCalledTimes(4)
      expect(mockProps.onInputChange).toHaveBeenNthCalledWith(1, 'email', 'user@test.com')
      expect(mockProps.onInputChange).toHaveBeenNthCalledWith(2, 'password', 'pass1')
      expect(mockProps.onInputChange).toHaveBeenNthCalledWith(3, 'email', 'updated@test.com')
      expect(mockProps.onInputChange).toHaveBeenNthCalledWith(4, 'password', 'pass2')
    })
  })

  describe('Button styling', () => {
    it('should render submit button with full width', () => {
      // Arrange & Act
      render(<LoginPresenter {...mockProps} />)
      const submitButton = screen.getByRole('button', { name: /se connecter/i })

      // Assert
      expect(submitButton).toHaveAttribute('data-fullwidth', 'true')
    })

    it('should render submit button with primary variant', () => {
      // Arrange & Act
      render(<LoginPresenter {...mockProps} />)
      const submitButton = screen.getByRole('button', { name: /se connecter/i })

      // Assert
      expect(submitButton).toHaveAttribute('data-variant', 'primary')
    })
  })
})
