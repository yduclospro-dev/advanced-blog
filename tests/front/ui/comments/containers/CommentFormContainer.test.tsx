import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import CommentFormContainer from '@/components/articles/comments/containers/CommentFormContainer'

jest.mock('@/components/ui', () => ({
  Toast: ({ message, type }: { message: string; type: string }) => (
    <div data-testid="toast" data-message={message} data-type={type}>
      {message}
    </div>
  )
  ,
  ImageUpload: ({ value }: { value?: string | null }) => <div data-testid="image-upload">{value}</div>
}))

jest.mock('@/components/articles/comments/presenters/CommentFormPresenter', () => ({
  __esModule: true,
  default: ({ content, onInputChange, onSubmit }: { content: string; onInputChange: (value: string) => void; onSubmit: () => void }) => (
    <div data-testid="comment-form-presenter">
      <input
        data-testid="content-input"
        value={content}
        onChange={(e) => onInputChange(e.target.value)}
      />
      <button data-testid="submit-button" onClick={onSubmit}>
        Publier
      </button>
    </div>
  )
}))

describe('CommentFormContainer', () => {
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Initialization', () => {
    it('should render CommentFormPresenter', () => {
      // Arrange & Act
      render(<CommentFormContainer onSubmit={mockOnSubmit} />)

      // Assert
      expect(screen.getByTestId('comment-form-presenter')).toBeInTheDocument()
    })

    it('should initialize with empty content', () => {
      // Arrange & Act
      render(<CommentFormContainer onSubmit={mockOnSubmit} />)
      const input = screen.getByTestId('content-input') as HTMLInputElement

      // Assert
      expect(input.value).toBe('')
    })
  })

  describe('Content management', () => {
    it('should update content when user types', () => {
      // Arrange
      render(<CommentFormContainer onSubmit={mockOnSubmit} />)
      const input = screen.getByTestId('content-input')

      // Act
      fireEvent.change(input, { target: { value: 'Mon commentaire' } })

      // Assert
      expect((input as HTMLInputElement).value).toBe('Mon commentaire')
    })

    it('should handle multiple content changes', () => {
      // Arrange
      render(<CommentFormContainer onSubmit={mockOnSubmit} />)
      const input = screen.getByTestId('content-input')

      // Act
      fireEvent.change(input, { target: { value: 'First' } })
      fireEvent.change(input, { target: { value: 'Second' } })
      fireEvent.change(input, { target: { value: 'Third' } })

      // Assert
      expect((input as HTMLInputElement).value).toBe('Third')
    })
  })

  describe('Form submission', () => {
    it('should call onSubmit with content when form is submitted', () => {
      // Arrange
      render(<CommentFormContainer onSubmit={mockOnSubmit} />)
      const input = screen.getByTestId('content-input')
      const submitButton = screen.getByTestId('submit-button')

      // Act
      fireEvent.change(input, { target: { value: 'Mon super commentaire' } })
      fireEvent.click(submitButton)

      // Assert
      expect(mockOnSubmit).toHaveBeenCalledWith('Mon super commentaire')
    })

    it('should reset content after successful submission', () => {
      // Arrange
      render(<CommentFormContainer onSubmit={mockOnSubmit} />)
      const input = screen.getByTestId('content-input')
      const submitButton = screen.getByTestId('submit-button')

      // Act
      fireEvent.change(input, { target: { value: 'Commentaire à soumettre' } })
      fireEvent.click(submitButton)

      // Assert
      expect((input as HTMLInputElement).value).toBe('')
    })

    it('should show toast when submitting empty content', () => {
      // Arrange
      render(<CommentFormContainer onSubmit={mockOnSubmit} />)
      const submitButton = screen.getByTestId('submit-button')

      // Act
      fireEvent.click(submitButton)

      // Assert
      const toast = screen.getByTestId('toast')
      expect(toast).toHaveAttribute('data-message', 'Le commentaire ne peut pas être vide !')
      expect(toast).toHaveAttribute('data-type', 'error')
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should show toast when submitting whitespace only', () => {
      // Arrange
      render(<CommentFormContainer onSubmit={mockOnSubmit} />)
      const input = screen.getByTestId('content-input')
      const submitButton = screen.getByTestId('submit-button')

      // Act
      fireEvent.change(input, { target: { value: '   ' } })
      fireEvent.click(submitButton)

      // Assert
      const toast = screen.getByTestId('toast')
      expect(toast).toHaveAttribute('data-message', 'Le commentaire ne peut pas être vide !')
      expect(toast).toHaveAttribute('data-type', 'error')
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should allow submission with content after trimming', () => {
      // Arrange
      render(<CommentFormContainer onSubmit={mockOnSubmit} />)
      const input = screen.getByTestId('content-input')
      const submitButton = screen.getByTestId('submit-button')

      // Act
      fireEvent.change(input, { target: { value: '  Valid comment  ' } })
      fireEvent.click(submitButton)

      // Assert
      expect(mockOnSubmit).toHaveBeenCalledWith('  Valid comment  ')
      expect(screen.queryByTestId('toast')).not.toBeInTheDocument()
    })
  })

  describe('Multiple submissions', () => {
    it('should allow multiple submissions', () => {
      // Arrange
      render(<CommentFormContainer onSubmit={mockOnSubmit} />)
      const input = screen.getByTestId('content-input')
      const submitButton = screen.getByTestId('submit-button')

      // Act
      fireEvent.change(input, { target: { value: 'First comment' } })
      fireEvent.click(submitButton)

      // Act
      fireEvent.change(input, { target: { value: 'Second comment' } })
      fireEvent.click(submitButton)

      // Assert
      expect(mockOnSubmit).toHaveBeenCalledTimes(2)
      expect(mockOnSubmit).toHaveBeenNthCalledWith(1, 'First comment')
      expect(mockOnSubmit).toHaveBeenNthCalledWith(2, 'Second comment')
    })

    it('should reset form after each submission', () => {
      // Arrange
      render(<CommentFormContainer onSubmit={mockOnSubmit} />)
      const input = screen.getByTestId('content-input')
      const submitButton = screen.getByTestId('submit-button')

      // Act
      fireEvent.change(input, { target: { value: 'Comment 1' } })
      fireEvent.click(submitButton)
      const valueAfterFirst = (input as HTMLInputElement).value

      // Act
      fireEvent.change(input, { target: { value: 'Comment 2' } })
      fireEvent.click(submitButton)
      const valueAfterSecond = (input as HTMLInputElement).value

      // Assert
      expect(valueAfterFirst).toBe('')
      expect(valueAfterSecond).toBe('')
    })
  })
})
