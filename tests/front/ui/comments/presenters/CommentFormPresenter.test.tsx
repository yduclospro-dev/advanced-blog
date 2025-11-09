import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import CommentFormPresenter from '@/components/articles/comments/presenters/CommentFormPresenter'

jest.mock('@/components/ui', () => ({
  Button: ({ label, onClick, disabled, variant }: { label: string; onClick?: () => void; disabled?: boolean; variant?: string }) => (
    <button onClick={onClick} disabled={disabled} data-variant={variant}>{label}</button>
  ),
  TextArea: ({ label, value, onChange, placeholder, rows }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string; rows?: number }) => (
    <div>
      <label>{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
      />
    </div>
  )
  ,
  ImageUpload: ({ value }: { value?: string | null }) => <div data-testid="image-upload">{value}</div>
}))

describe('CommentFormPresenter', () => {
  const mockProps = {
    content: '',
    onInputChange: jest.fn(),
    onSubmit: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render comment form with textarea and button', () => {
      // Arrange & Act
      render(<CommentFormPresenter {...mockProps} />)

      // Assert
      expect(screen.getByPlaceholderText(/partagez votre opinion/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /publier/i })).toBeInTheDocument()
    })

    it('should render form title', () => {
      // Arrange & Act
      render(<CommentFormPresenter {...mockProps} />)

      // Assert
      expect(screen.getByText(/ajouter un commentaire/i)).toBeInTheDocument()
    })
  })

  describe('Form interaction', () => {
    it('should display current content value', () => {
      // Arrange
      const propsWithContent = {
        ...mockProps,
        content: 'My comment text'
      }

      // Act
      render(<CommentFormPresenter {...propsWithContent} />)

      // Assert
      expect(screen.getByDisplayValue('My comment text')).toBeInTheDocument()
    })

    it('should call onInputChange when user types', () => {
      // Arrange
      render(<CommentFormPresenter {...mockProps} />)
      const textarea = screen.getByPlaceholderText(/partagez votre opinion/i)

      // Act
      fireEvent.change(textarea, { target: { value: 'New comment' } })

      // Assert
      expect(mockProps.onInputChange).toHaveBeenCalledWith('New comment')
    })

    it('should call onSubmit when button is clicked', () => {
      // Arrange
      render(<CommentFormPresenter {...mockProps} />)
      const submitButton = screen.getByRole('button', { name: /publier/i })

      // Act
      fireEvent.click(submitButton)

      // Assert
      expect(mockProps.onSubmit).toHaveBeenCalledTimes(1)
    })

    it('should render with placeholder text', () => {
      // Arrange & Act
      render(<CommentFormPresenter {...mockProps} />)

      // Assert
      const textarea = screen.getByPlaceholderText(/partagez votre opinion/i)
      expect(textarea).toBeInTheDocument()
    })

    it('should render textarea with correct rows', () => {
      // Arrange & Act
      render(<CommentFormPresenter {...mockProps} />)

      // Assert
      const textarea = screen.getByPlaceholderText(/partagez votre opinion/i)
      expect(textarea).toHaveAttribute('rows', '4')
    })
  })

  describe('Multiple interactions', () => {
    it('should handle multiple content changes', () => {
      // Arrange
      render(<CommentFormPresenter {...mockProps} />)
      const textarea = screen.getByPlaceholderText(/partagez votre opinion/i)

      // Act
      fireEvent.change(textarea, { target: { value: 'First' } })
      fireEvent.change(textarea, { target: { value: 'Second' } })
      fireEvent.change(textarea, { target: { value: 'Third' } })

      // Assert
      expect(mockProps.onInputChange).toHaveBeenCalledTimes(3)
      expect(mockProps.onInputChange).toHaveBeenLastCalledWith('Third')
    })

    it('should allow form submission with empty content', () => {
      // Arrange
      render(<CommentFormPresenter {...mockProps} />)
      const submitButton = screen.getByRole('button', { name: /publier/i })

      // Act
      fireEvent.click(submitButton)

      // Assert
      expect(mockProps.onSubmit).toHaveBeenCalled()
    })

    it('should allow form submission with filled content', () => {
      // Arrange
      const filledProps = {
        ...mockProps,
        content: 'This is my comment'
      }
      render(<CommentFormPresenter {...filledProps} />)
      const submitButton = screen.getByRole('button', { name: /publier/i })

      // Act
      fireEvent.click(submitButton)

      // Assert
      expect(mockProps.onSubmit).toHaveBeenCalled()
    })
  })
})

