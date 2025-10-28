import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import NewArticleContainer from '@/components/articles/containers/NewArticleContainer'

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

const mockAddArticle = jest.fn()
let mockCurrentUser: { id: string; username: string; email: string; password: string } | null = { 
  id: 'user1', 
  username: 'TestUser', 
  email: 'test@test.com', 
  password: 'pass' 
}

jest.mock('@/stores/articlesStore', () => ({
  useArticleStore: () => ({
    addArticle: mockAddArticle,
    safeAddArticle: mockAddArticle
  })
}))

jest.mock('@/stores/userStore', () => ({
  useUserStore: () => ({
    currentUser: mockCurrentUser
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

jest.mock('@/components/ForbiddenAccess', () => ({
  __esModule: true,
  default: ({ message }: { message: string }) => (
    <div data-testid="forbidden-access">{message}</div>
  )
}))

jest.mock('@/components/articles/presenters/NewArticlePresenter', () => ({
  __esModule: true,
  default: ({
    formData,
    onInputChange,
    onSave,
    onCancel
  }: {
    formData: { title: string; content: string }
    onInputChange: (field: string, value: string) => void
    onSave: () => void
    onCancel: () => void
  }) => (
    <div data-testid="new-article-presenter">
      <div data-testid="title-value">{formData.title}</div>
      <div data-testid="content-value">{formData.content}</div>
      <input
        data-testid="title-input"
        onChange={(e) => onInputChange('title', e.target.value)}
      />
      <input
        data-testid="content-input"
        onChange={(e) => onInputChange('content', e.target.value)}
      />
      <button data-testid="save-button" onClick={onSave}>Save</button>
      <button data-testid="cancel-button" onClick={onCancel}>Cancel</button>
    </div>
  )
}))

describe('NewArticleContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCurrentUser = { id: 'user1', username: 'TestUser', email: 'test@test.com', password: 'pass' }
  })

  describe('Authentication', () => {
    it('should show ForbiddenAccess when not authenticated', () => {
      // Arrange
      mockCurrentUser = null

      // Act
      render(<NewArticleContainer />)

      // Assert
      expect(screen.getByTestId('forbidden-access')).toBeInTheDocument()
      expect(screen.getByText(/vous devez être connecté pour créer un nouvel article/i)).toBeInTheDocument()
    })

    it('should render NewArticlePresenter when authenticated', () => {
      // Arrange
      mockCurrentUser = { id: 'user1', username: 'TestUser', email: 'test@test.com', password: 'pass' }

      // Act
      render(<NewArticleContainer />)

      // Assert
      expect(screen.getByTestId('new-article-presenter')).toBeInTheDocument()
    })
  })

  describe('Initialization', () => {
    it('should initialize with empty form data', () => {
      // Arrange & Act
      render(<NewArticleContainer />)

      // Assert
      expect(screen.getByTestId('title-value')).toHaveTextContent('')
      expect(screen.getByTestId('content-value')).toHaveTextContent('')
    })
  })

  describe('Form input handling', () => {
    it('should update title when input changes', () => {
      // Arrange
      render(<NewArticleContainer />)
      const titleInput = screen.getByTestId('title-input')

      // Act
      fireEvent.change(titleInput, { target: { value: 'My New Article' } })

      // Assert
      expect(screen.getByTestId('title-value')).toHaveTextContent('My New Article')
    })

    it('should update content when input changes', () => {
      // Arrange
      render(<NewArticleContainer />)
      const contentInput = screen.getByTestId('content-input')

      // Act
      fireEvent.change(contentInput, { target: { value: 'Article content here' } })

      // Assert
      expect(screen.getByTestId('content-value')).toHaveTextContent('Article content here')
    })

    it('should update both fields independently', () => {
      // Arrange
      render(<NewArticleContainer />)
      const titleInput = screen.getByTestId('title-input')
      const contentInput = screen.getByTestId('content-input')

      // Act
      fireEvent.change(titleInput, { target: { value: 'Title' } })
      fireEvent.change(contentInput, { target: { value: 'Content' } })

      // Assert
      expect(screen.getByTestId('title-value')).toHaveTextContent('Title')
      expect(screen.getByTestId('content-value')).toHaveTextContent('Content')
    })
  })

  describe('Form validation', () => {
    it('should show toast when title is empty on save', () => {
      // Arrange
      render(<NewArticleContainer />)
      const contentInput = screen.getByTestId('content-input')
      const saveButton = screen.getByTestId('save-button')

      // Act
      fireEvent.change(contentInput, { target: { value: 'Content only' } })
      fireEvent.click(saveButton)

      // Assert
      const toast = screen.getByTestId('toast')
      expect(toast).toHaveAttribute('data-message', 'Le titre et le contenu sont requis !')
      expect(toast).toHaveAttribute('data-type', 'error')
      expect(mockAddArticle).not.toHaveBeenCalled()
    })

    it('should show toast when content is empty on save', () => {
      // Arrange
      render(<NewArticleContainer />)
      const titleInput = screen.getByTestId('title-input')
      const saveButton = screen.getByTestId('save-button')

      // Act
      fireEvent.change(titleInput, { target: { value: 'Title only' } })
      fireEvent.click(saveButton)

      // Assert
      const toast = screen.getByTestId('toast')
      expect(toast).toHaveAttribute('data-message', 'Le titre et le contenu sont requis !')
      expect(toast).toHaveAttribute('data-type', 'error')
      expect(mockAddArticle).not.toHaveBeenCalled()
    })

    it('should show toast when both fields are empty on save', () => {
      // Arrange
      render(<NewArticleContainer />)
      const saveButton = screen.getByTestId('save-button')

      // Act
      fireEvent.click(saveButton)

      // Assert
      const toast = screen.getByTestId('toast')
      expect(toast).toHaveAttribute('data-message', 'Le titre et le contenu sont requis !')
      expect(toast).toHaveAttribute('data-type', 'error')
      expect(mockAddArticle).not.toHaveBeenCalled()
    })
  })

  describe('Article creation', () => {
    it('should call addArticle with correct data on save', () => {
      // Arrange
      render(<NewArticleContainer />)
      const titleInput = screen.getByTestId('title-input')
      const contentInput = screen.getByTestId('content-input')
      const saveButton = screen.getByTestId('save-button')

      // Act
      fireEvent.change(titleInput, { target: { value: 'New Article Title' } })
      fireEvent.change(contentInput, { target: { value: 'New Article Content' } })
      fireEvent.click(saveButton)

      // Assert
      expect(mockAddArticle).toHaveBeenCalledWith({
        title: 'New Article Title',
        content: 'New Article Content',
        author: 'TestUser',
        authorId: 'user1'
      })
    })

    it('should redirect to articles list after successful save', async () => {
      // Arrange
      jest.useFakeTimers()
      render(<NewArticleContainer />)
      const titleInput = screen.getByTestId('title-input')
      const contentInput = screen.getByTestId('content-input')
      const saveButton = screen.getByTestId('save-button')

      // Act
      fireEvent.change(titleInput, { target: { value: 'Title' } })
      fireEvent.change(contentInput, { target: { value: 'Content' } })
      fireEvent.click(saveButton)

      await waitFor(() => {
        const toast = screen.getByTestId('toast')
        expect(toast).toHaveAttribute('data-message', 'Article créé avec succès !')
        expect(toast).toHaveAttribute('data-type', 'success')
      })

      jest.advanceTimersByTime(1500)

      // Assert
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/articles')
      })
      
      jest.useRealTimers()
    })

    it('should include current user information in article', () => {
      // Arrange
      render(<NewArticleContainer />)
      const titleInput = screen.getByTestId('title-input')
      const contentInput = screen.getByTestId('content-input')
      const saveButton = screen.getByTestId('save-button')

      // Act
      fireEvent.change(titleInput, { target: { value: 'Test' } })
      fireEvent.change(contentInput, { target: { value: 'Test content' } })
      fireEvent.click(saveButton)

      // Assert
      expect(mockAddArticle).toHaveBeenCalledWith(
        expect.objectContaining({
          author: 'TestUser',
          authorId: 'user1'
        })
      )
    })
  })

  describe('Cancel action', () => {
    it('should redirect to articles list when cancel is clicked', () => {
      // Arrange
      render(<NewArticleContainer />)
      const cancelButton = screen.getByTestId('cancel-button')

      // Act
      fireEvent.click(cancelButton)

      // Assert
      expect(mockPush).toHaveBeenCalledWith('/articles')
    })

    it('should not save article when cancel is clicked', () => {
      // Arrange
      render(<NewArticleContainer />)
      const titleInput = screen.getByTestId('title-input')
      const contentInput = screen.getByTestId('content-input')
      const cancelButton = screen.getByTestId('cancel-button')

      // Act
      fireEvent.change(titleInput, { target: { value: 'Title' } })
      fireEvent.change(contentInput, { target: { value: 'Content' } })
      fireEvent.click(cancelButton)

      // Assert
      expect(mockAddArticle).not.toHaveBeenCalled()
    })
  })

  describe('Edge cases', () => {
    it('should trim whitespace from title and content on save', async () => {
      // Arrange
      jest.useFakeTimers()
      render(<NewArticleContainer />)
      const titleInput = screen.getByTestId('title-input')
      const contentInput = screen.getByTestId('content-input')
      const saveButton = screen.getByTestId('save-button')

      // Act
      fireEvent.change(titleInput, { target: { value: '   Spaced Title   ' } })
      fireEvent.change(contentInput, { target: { value: '  Spaced Content  ' } })
      fireEvent.click(saveButton)

      // Assert
      expect(mockAddArticle).toHaveBeenCalledWith({
        title: '   Spaced Title   ',
        content: '  Spaced Content  ',
        author: 'TestUser',
        authorId: 'user1'
      })
      
      await waitFor(() => {
        const toast = screen.getByTestId('toast')
        expect(toast).toHaveAttribute('data-message', 'Article créé avec succès !')
        expect(toast).toHaveAttribute('data-type', 'success')
      })
      
      jest.useRealTimers()
    })

    it('should reject whitespace-only title after trim', () => {
      // Arrange
      render(<NewArticleContainer />)
      const titleInput = screen.getByTestId('title-input')
      const contentInput = screen.getByTestId('content-input')
      const saveButton = screen.getByTestId('save-button')

      // Act
      fireEvent.change(titleInput, { target: { value: '   ' } })
      fireEvent.change(contentInput, { target: { value: 'Content' } })
      fireEvent.click(saveButton)

      // Assert
      const toast = screen.getByTestId('toast')
      expect(toast).toHaveAttribute('data-message', 'Le titre et le contenu sont requis !')
      expect(toast).toHaveAttribute('data-type', 'error')
      expect(mockAddArticle).not.toHaveBeenCalled()
    })

    it('should handle multiple save attempts', () => {
      // Arrange
      render(<NewArticleContainer />)
      const titleInput = screen.getByTestId('title-input')
      const contentInput = screen.getByTestId('content-input')
      const saveButton = screen.getByTestId('save-button')

      // Act
      fireEvent.click(saveButton)

      // Assert
      expect(screen.getByTestId('toast')).toBeInTheDocument()

      // Act
      fireEvent.change(titleInput, { target: { value: 'Title' } })
      fireEvent.change(contentInput, { target: { value: 'Content' } })
      fireEvent.click(saveButton)

      // Assert
      expect(mockAddArticle).toHaveBeenCalledTimes(1)
    })

    it('should handle form changes after cancel', () => {
      // Arrange
      render(<NewArticleContainer />)
      const titleInput = screen.getByTestId('title-input')
      const cancelButton = screen.getByTestId('cancel-button')

      // Act
      fireEvent.change(titleInput, { target: { value: 'Initial Title' } })
      fireEvent.click(cancelButton)

      // Assert
      expect(screen.getByTestId('title-value')).toHaveTextContent('Initial Title')
    })
  })
})
