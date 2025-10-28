import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import LoginContainer from '@/components/auth/login/containers/LoginContainer'

const mockPush = jest.fn()
const mockSearchParams = {
  get: jest.fn()
}

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush
  }),
  useSearchParams: () => mockSearchParams
}))

const mockLogin = jest.fn()
jest.mock('@/stores/userStore', () => ({
  useUserStore: () => ({
    login: mockLogin
  })
}))

jest.mock('@/components/ui', () => ({
  Toast: ({ message, type }: { message: string; type: string }) => (
    <div data-testid="toast" data-message={message} data-type={type}>
      {message}
    </div>
  )
  ,
  ImageUpload: ({ value }: { value?: string | null }) => <div data-testid="image-upload">{value}</div>
}))

jest.mock('@/components/auth/login/presenters/LoginPresenter', () => ({
  __esModule: true,
  default: ({
    formData,
    isLoading,
    onInputChange,
    onSubmit
  }: {
    formData: { email: string; password: string }
    isLoading?: boolean
    onInputChange: (field: string, value: string) => void
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  }) => (
    <div data-testid="login-presenter">
      <div data-testid="email-value">{formData.email}</div>
      <div data-testid="password-value">{formData.password}</div>
      <div data-testid="loading-state">{isLoading ? 'loading' : 'idle'}</div>
      
      <input
        data-testid="email-input"
        onChange={(e) => onInputChange('email', e.target.value)}
      />
      <input
        data-testid="password-input"
        onChange={(e) => onInputChange('password', e.target.value)}
      />
      <form onSubmit={onSubmit}>
        <button type="submit" data-testid="submit-button">Login</button>
      </form>
    </div>
  )
}))

describe('LoginContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSearchParams.get.mockReturnValue(null)
  })

  describe('Initialization', () => {
    it('should render LoginPresenter', () => {
      // Arrange & Act
      render(<LoginContainer />)

      // Assert
      expect(screen.getByTestId('login-presenter')).toBeInTheDocument()
    })

    it('should initialize with empty form data', () => {
      // Arrange & Act
      render(<LoginContainer />)

      // Assert
      expect(screen.getByTestId('email-value')).toHaveTextContent('')
      expect(screen.getByTestId('password-value')).toHaveTextContent('')
    })

    it('should initialize with no error', () => {
      // Arrange & Act
      render(<LoginContainer />)

      // Assert
      expect(screen.queryByTestId('toast')).not.toBeInTheDocument()
    })

    it('should initialize with idle loading state', () => {
      // Arrange & Act
      render(<LoginContainer />)

      // Assert
      expect(screen.getByTestId('loading-state')).toHaveTextContent('idle')
    })

    it('should show success message when registered param is true', () => {
      // Arrange
      mockSearchParams.get.mockReturnValue('true')

      // Act
      render(<LoginContainer />)

      // Assert
      const toast = screen.getByTestId('toast')
      expect(toast).toHaveAttribute('data-message', 'Inscription réussie ! Vous pouvez maintenant vous connecter.')
      expect(toast).toHaveAttribute('data-type', 'success')
    })

    it('should not show success message when registered param is false', () => {
      // Arrange
      mockSearchParams.get.mockReturnValue('false')

      // Act
      render(<LoginContainer />)

      // Assert
      expect(screen.queryByTestId('toast')).not.toBeInTheDocument()
    })
  })

  describe('Form input handling', () => {
    it('should update email when input changes', () => {
      // Arrange
      render(<LoginContainer />)
      const emailInput = screen.getByTestId('email-input')

      // Act
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

      // Assert
      expect(screen.getByTestId('email-value')).toHaveTextContent('test@example.com')
    })

    it('should update password when input changes', () => {
      // Arrange
      render(<LoginContainer />)
      const passwordInput = screen.getByTestId('password-input')

      // Act
      fireEvent.change(passwordInput, { target: { value: 'password123' } })

      // Assert
      expect(screen.getByTestId('password-value')).toHaveTextContent('password123')
    })

    it('should update both fields independently', () => {
      // Arrange
      render(<LoginContainer />)
      const emailInput = screen.getByTestId('email-input')
      const passwordInput = screen.getByTestId('password-input')

      // Act
      fireEvent.change(emailInput, { target: { value: 'user@test.com' } })
      fireEvent.change(passwordInput, { target: { value: 'mypass' } })

      // Assert
      expect(screen.getByTestId('email-value')).toHaveTextContent('user@test.com')
      expect(screen.getByTestId('password-value')).toHaveTextContent('mypass')
    })
  })

  describe('Form validation', () => {
    it('should show error when email is empty on submit', async () => {
      // Arrange
      render(<LoginContainer />)
      const submitButton = screen.getByTestId('submit-button')

      // Act
      fireEvent.click(submitButton)

      // Assert
      await waitFor(() => {
        const toast = screen.getByTestId('toast')
        expect(toast).toHaveAttribute('data-message', 'Veuillez remplir tous les champs.')
        expect(toast).toHaveAttribute('data-type', 'error')
      })
      expect(mockLogin).not.toHaveBeenCalled()
    })

    it('should show error when password is empty on submit', async () => {
      // Arrange
      render(<LoginContainer />)
      const emailInput = screen.getByTestId('email-input')
      const submitButton = screen.getByTestId('submit-button')

      // Act
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.click(submitButton)

      // Assert
      await waitFor(() => {
        const toast = screen.getByTestId('toast')
        expect(toast).toHaveAttribute('data-message', 'Veuillez remplir tous les champs.')
        expect(toast).toHaveAttribute('data-type', 'error')
      })
      expect(mockLogin).not.toHaveBeenCalled()
    })

    it('should show error when both fields are empty on submit', async () => {
      // Arrange
      render(<LoginContainer />)
      const submitButton = screen.getByTestId('submit-button')

      // Act
      fireEvent.click(submitButton)

      // Assert
      await waitFor(() => {
        const toast = screen.getByTestId('toast')
        expect(toast).toHaveAttribute('data-message', 'Veuillez remplir tous les champs.')
        expect(toast).toHaveAttribute('data-type', 'error')
      })
      expect(mockLogin).not.toHaveBeenCalled()
    })
  })

  describe('Login submission', () => {
    it('should call login with correct credentials on submit', async () => {
      // Arrange
      mockLogin.mockResolvedValue({ success: true })
      render(<LoginContainer />)
      const emailInput = screen.getByTestId('email-input')
      const passwordInput = screen.getByTestId('password-input')
      const submitButton = screen.getByTestId('submit-button')

      // Act
      fireEvent.change(emailInput, { target: { value: 'user@test.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)

      // Assert
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('user@test.com', 'password123')
      })
    })

    it('should show loading state during login', async () => {
      // Arrange
      mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100)))
      render(<LoginContainer />)
      const emailInput = screen.getByTestId('email-input')
      const passwordInput = screen.getByTestId('password-input')
      const submitButton = screen.getByTestId('submit-button')

      // Act
      fireEvent.change(emailInput, { target: { value: 'user@test.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('loading-state')).toHaveTextContent('loading')
      })
    })

    it('should redirect to home on successful login', async () => {
      // Arrange
      jest.useFakeTimers()
      mockLogin.mockResolvedValue({ success: true })
      render(<LoginContainer />)
      const emailInput = screen.getByTestId('email-input')
      const passwordInput = screen.getByTestId('password-input')
      const submitButton = screen.getByTestId('submit-button')

      // Act
      fireEvent.change(emailInput, { target: { value: 'user@test.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        const toast = screen.getByTestId('toast')
        expect(toast).toHaveAttribute('data-message', 'Connexion réussie !')
        expect(toast).toHaveAttribute('data-type', 'success')
      })

      jest.advanceTimersByTime(1500)

      // Assert
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/')
      })

      jest.useRealTimers()
    })

    it('should clear error on new submission attempt', async () => {
      // Arrange
      mockLogin.mockResolvedValue({ success: false, error: 'Invalid credentials' })
      render(<LoginContainer />)
      const emailInput = screen.getByTestId('email-input')
      const passwordInput = screen.getByTestId('password-input')
      const submitButton = screen.getByTestId('submit-button')

      // Act
      fireEvent.change(emailInput, { target: { value: 'wrong@test.com' } })
      fireEvent.change(passwordInput, { target: { value: 'wrongpass' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        const toast = screen.getByTestId('toast')
        expect(toast).toHaveAttribute('data-message', 'Invalid credentials')
      })

      // Act
      jest.useFakeTimers()
      mockLogin.mockResolvedValue({ success: true })
      fireEvent.change(emailInput, { target: { value: 'correct@test.com' } })
      fireEvent.change(passwordInput, { target: { value: 'correctpass' } })
      fireEvent.click(submitButton)

      // Assert
      await waitFor(() => {
        const toast = screen.getByTestId('toast')
        expect(toast).toHaveAttribute('data-message', 'Connexion réussie !')
      })

      jest.advanceTimersByTime(1500)
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/')
      })
      
      jest.useRealTimers()
    })
  })

  describe('Login failure', () => {
    it('should show error message on failed login', async () => {
      // Arrange
      mockLogin.mockResolvedValue({ success: false, error: 'Email ou mot de passe incorrect' })
      render(<LoginContainer />)
      const emailInput = screen.getByTestId('email-input')
      const passwordInput = screen.getByTestId('password-input')
      const submitButton = screen.getByTestId('submit-button')

      // Act
      fireEvent.change(emailInput, { target: { value: 'user@test.com' } })
      fireEvent.change(passwordInput, { target: { value: 'wrongpass' } })
      fireEvent.click(submitButton)

      // Assert
      await waitFor(() => {
        const toast = screen.getByTestId('toast')
        expect(toast).toHaveAttribute('data-message', 'Email ou mot de passe incorrect')
        expect(toast).toHaveAttribute('data-type', 'error')
      })
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('should show default error message when no error provided', async () => {
      // Arrange
      mockLogin.mockResolvedValue({ success: false })
      render(<LoginContainer />)
      const emailInput = screen.getByTestId('email-input')
      const passwordInput = screen.getByTestId('password-input')
      const submitButton = screen.getByTestId('submit-button')

      // Act
      fireEvent.change(emailInput, { target: { value: 'user@test.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password' } })
      fireEvent.click(submitButton)

      // Assert
      await waitFor(() => {
        const toast = screen.getByTestId('toast')
        expect(toast).toHaveAttribute('data-message', 'Email ou mot de passe incorrect.')
        expect(toast).toHaveAttribute('data-type', 'error')
      })
    })

    it('should reset loading state after failed login', async () => {
      // Arrange
      mockLogin.mockResolvedValue({ success: false, error: 'Invalid' })
      render(<LoginContainer />)
      const emailInput = screen.getByTestId('email-input')
      const passwordInput = screen.getByTestId('password-input')
      const submitButton = screen.getByTestId('submit-button')

      // Act
      fireEvent.change(emailInput, { target: { value: 'user@test.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password' } })
      fireEvent.click(submitButton)

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('loading-state')).toHaveTextContent('idle')
      })
    })
  })

  describe('Multiple submissions', () => {
    it('should handle multiple failed login attempts', async () => {
      // Arrange
      mockLogin.mockResolvedValue({ success: false, error: 'Error 1' })
      render(<LoginContainer />)
      const emailInput = screen.getByTestId('email-input')
      const passwordInput = screen.getByTestId('password-input')
      const submitButton = screen.getByTestId('submit-button')

      // Act
      fireEvent.change(emailInput, { target: { value: 'user1@test.com' } })
      fireEvent.change(passwordInput, { target: { value: 'pass1' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        const toast = screen.getByTestId('toast')
        expect(toast).toHaveAttribute('data-message', 'Error 1')
      })

      // Act
      mockLogin.mockResolvedValue({ success: false, error: 'Error 2' })
      fireEvent.change(emailInput, { target: { value: 'user2@test.com' } })
      fireEvent.change(passwordInput, { target: { value: 'pass2' } })
      fireEvent.click(submitButton)

      // Assert
      await waitFor(() => {
        const toast = screen.getByTestId('toast')
        expect(toast).toHaveAttribute('data-message', 'Error 2')
      })
      expect(mockLogin).toHaveBeenCalledTimes(2)
    })

    it('should not call login multiple times for single submit', async () => {
      // Arrange
      jest.useFakeTimers()
      mockLogin.mockResolvedValue({ success: true })
      render(<LoginContainer />)
      const emailInput = screen.getByTestId('email-input')
      const passwordInput = screen.getByTestId('password-input')
      const submitButton = screen.getByTestId('submit-button')

      // Act
      fireEvent.change(emailInput, { target: { value: 'user@test.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password' } })
      fireEvent.click(submitButton)

      // Assert
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledTimes(1)
      })
      
      jest.useRealTimers()
    })
  })
})
