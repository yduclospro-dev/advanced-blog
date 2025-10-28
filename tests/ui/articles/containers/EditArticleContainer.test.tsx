import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import EditArticleContainer from '@/components/articles/containers/EditArticleContainer'
import { Article } from '@/types/Article'

const mockPush = jest.fn()
const mockParams = { id: 'article1' }

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush
  }),
  useParams: () => mockParams
}))

const mockArticle: Article = {
  id: 'article1',
  title: 'Existing Article',
  content: 'Existing content',
  author: 'TestUser',
  authorId: 'user1',
  date: '2024-01-01',
  likes: [],
  dislikes: []
}

const mockGetArticleById = jest.fn()
const mockUpdateArticle = jest.fn()
let mockCurrentUser: { id: string; username: string; email: string; password: string } | null = {
  id: 'user1',
  username: 'TestUser',
  email: 'test@test.com',
  password: 'pass'
}

jest.mock('@/stores/articlesStore', () => ({
  useArticleStore: () => ({
    getArticleById: mockGetArticleById,
    updateArticle: mockUpdateArticle,
    safeUpdateArticle: mockUpdateArticle
  })
}))

jest.mock('@/stores/userStore', () => ({
  useUserStore: () => ({
    currentUser: mockCurrentUser
  })
}))

jest.mock('@/components/ForbiddenAccess', () => ({
  __esModule: true,
  default: ({ message }: { message: string }) => (
    <div data-testid="forbidden-access">{message}</div>
  )
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

jest.mock('@/components/articles/presenters/EditArticlePresenter', () => ({
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
    <div data-testid="edit-article-presenter">
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

describe('EditArticleContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCurrentUser = { id: 'user1', username: 'TestUser', email: 'test@test.com', password: 'pass' }
    mockGetArticleById.mockReturnValue(mockArticle)
  })

  describe('Authentication', () => {
    it('should show ForbiddenAccess when not authenticated', () => {
      // Arrange
      mockCurrentUser = null

      // Act
      render(<EditArticleContainer />)

      // Assert
      expect(screen.getByTestId('forbidden-access')).toBeInTheDocument()
      expect(screen.getByText(/vous devez être connecté pour modifier cet article/i)).toBeInTheDocument()
    })

    it('should render EditArticlePresenter when authenticated', () => {
      // Arrange
      mockCurrentUser = { id: 'user1', username: 'TestUser', email: 'test@test.com', password: 'pass' }

      // Act
      render(<EditArticleContainer />)

      // Assert
      expect(screen.getByTestId('edit-article-presenter')).toBeInTheDocument()
    })
  })

  describe('Article loading', () => {
    it('should load article by id from params', () => {
      // Arrange & Act
      render(<EditArticleContainer />)

      // Assert
      expect(mockGetArticleById).toHaveBeenCalledWith('article1')
    })

    it('should show not found message when article does not exist', () => {
      // Arrange
      mockGetArticleById.mockReturnValue(null)

      // Act
      render(<EditArticleContainer />)

      // Assert
      expect(screen.getByText(/article introuvable/i)).toBeInTheDocument()
      expect(screen.queryByTestId('edit-article-presenter')).not.toBeInTheDocument()
    })

    it('should initialize form with existing article data', () => {
      // Arrange & Act
      render(<EditArticleContainer />)

      // Assert
      expect(screen.getByTestId('title-value')).toHaveTextContent('Existing Article')
      expect(screen.getByTestId('content-value')).toHaveTextContent('Existing content')
    })

    it('should initialize with empty strings when article is null', () => {
      // Arrange
      mockGetArticleById.mockReturnValue(null)

      // Act
      render(<EditArticleContainer />)

      // Assert
      expect(screen.getByText(/article introuvable/i)).toBeInTheDocument()
    })
  })

  describe('Form input handling', () => {
    it('should update title when input changes', () => {
      // Arrange
      render(<EditArticleContainer />)
      const titleInput = screen.getByTestId('title-input')

      // Act
      fireEvent.change(titleInput, { target: { value: 'Updated Title' } })

      // Assert
      expect(screen.getByTestId('title-value')).toHaveTextContent('Updated Title')
    })

    it('should update content when input changes', () => {
      // Arrange
      render(<EditArticleContainer />)
      const contentInput = screen.getByTestId('content-input')

      // Act
      fireEvent.change(contentInput, { target: { value: 'Updated content' } })

      // Assert
      expect(screen.getByTestId('content-value')).toHaveTextContent('Updated content')
    })

    it('should update both fields independently', () => {
      // Arrange
      render(<EditArticleContainer />)
      const titleInput = screen.getByTestId('title-input')
      const contentInput = screen.getByTestId('content-input')

      // Act
      fireEvent.change(titleInput, { target: { value: 'New Title' } })
      fireEvent.change(contentInput, { target: { value: 'New Content' } })

      // Assert
      expect(screen.getByTestId('title-value')).toHaveTextContent('New Title')
      expect(screen.getByTestId('content-value')).toHaveTextContent('New Content')
    })

    it('should preserve original values when not modified', () => {
      // Arrange
      render(<EditArticleContainer />)
      const titleInput = screen.getByTestId('title-input')

      // Act
      fireEvent.change(titleInput, { target: { value: 'Changed Title' } })

      // Assert
      expect(screen.getByTestId('content-value')).toHaveTextContent('Existing content')
    })
  })

  describe('Article update', () => {
    it('should call updateArticle with correct data on save', () => {
      // Arrange
      render(<EditArticleContainer />)
      const titleInput = screen.getByTestId('title-input')
      const contentInput = screen.getByTestId('content-input')
      const saveButton = screen.getByTestId('save-button')

      // Act
      fireEvent.change(titleInput, { target: { value: 'Updated Title' } })
      fireEvent.change(contentInput, { target: { value: 'Updated Content' } })
      fireEvent.click(saveButton)

      // Assert
      expect(mockUpdateArticle).toHaveBeenCalledWith('article1', {
        title: 'Updated Title',
        content: 'Updated Content'
      })
    })

    it('should redirect to article detail after save', async () => {
      // Arrange
      jest.useFakeTimers()
      render(<EditArticleContainer />)
      const saveButton = screen.getByTestId('save-button')

      // Act
      fireEvent.click(saveButton)

      // Assert
      await waitFor(() => {
        const toast = screen.getByTestId('toast')
        expect(toast).toHaveAttribute('data-message', 'Article modifié avec succès !')
        expect(toast).toHaveAttribute('data-type', 'success')
      })
      
      // Assert
      jest.advanceTimersByTime(1500)
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/articles/article1')
      })
      
      jest.useRealTimers()
    })

    it('should save with only title changed', () => {
      // Arrange
      render(<EditArticleContainer />)
      const titleInput = screen.getByTestId('title-input')
      const saveButton = screen.getByTestId('save-button')

      // Act
      fireEvent.change(titleInput, { target: { value: 'Only Title Changed' } })
      fireEvent.click(saveButton)

      // Assert
      expect(mockUpdateArticle).toHaveBeenCalledWith('article1', {
        title: 'Only Title Changed',
        content: 'Existing content'
      })
    })

    it('should save with only content changed', () => {
      // Arrange
      render(<EditArticleContainer />)
      const contentInput = screen.getByTestId('content-input')
      const saveButton = screen.getByTestId('save-button')

      // Act
      fireEvent.change(contentInput, { target: { value: 'Only Content Changed' } })
      fireEvent.click(saveButton)

      // Assert
      expect(mockUpdateArticle).toHaveBeenCalledWith('article1', {
        title: 'Existing Article',
        content: 'Only Content Changed'
      })
    })

    it('should save even with no changes', () => {
      // Arrange
      render(<EditArticleContainer />)
      const saveButton = screen.getByTestId('save-button')

      // Act
      fireEvent.click(saveButton)

      // Assert
      expect(mockUpdateArticle).toHaveBeenCalledWith('article1', {
        title: 'Existing Article',
        content: 'Existing content'
      })
    })
  })

  describe('Cancel action', () => {
    it('should redirect to article detail when cancel is clicked', () => {
      // Arrange
      render(<EditArticleContainer />)
      const cancelButton = screen.getByTestId('cancel-button')

      // Act
      fireEvent.click(cancelButton)

      // Assert
      expect(mockPush).toHaveBeenCalledWith('/articles/article1')
    })

    it('should not save changes when cancel is clicked', () => {
      // Arrange
      render(<EditArticleContainer />)
      const titleInput = screen.getByTestId('title-input')
      const contentInput = screen.getByTestId('content-input')
      const cancelButton = screen.getByTestId('cancel-button')

      // Act
      fireEvent.change(titleInput, { target: { value: 'Changed' } })
      fireEvent.change(contentInput, { target: { value: 'Changed' } })
      fireEvent.click(cancelButton)

      // Assert
      expect(mockUpdateArticle).not.toHaveBeenCalled()
    })
  })

  describe('Edge cases', () => {
    it('should handle different article IDs', () => {
      // Arrange
      mockParams.id = 'article2'
      const differentArticle = { ...mockArticle, id: 'article2', title: 'Different Article' }
      mockGetArticleById.mockReturnValue(differentArticle)

      // Act
      render(<EditArticleContainer />)

      // Assert
      expect(mockGetArticleById).toHaveBeenCalledWith('article2')
      expect(screen.getByTestId('title-value')).toHaveTextContent('Different Article')
    })

    it('should handle article with empty content', () => {
      // Arrange
      const emptyContentArticle = { ...mockArticle, content: '' }
      mockGetArticleById.mockReturnValue(emptyContentArticle)

      // Act
      render(<EditArticleContainer />)

      // Assert
      expect(screen.getByTestId('content-value')).toHaveTextContent('')
    })

    it('should handle article with long title and content', () => {
      // Arrange
      const longArticle = {
        ...mockArticle,
        title: 'A'.repeat(200),
        content: 'B'.repeat(5000)
      }
      mockGetArticleById.mockReturnValue(longArticle)

      // Act
      render(<EditArticleContainer />)

      // Assert
      expect(screen.getByTestId('title-value')).toHaveTextContent('A'.repeat(200))
      expect(screen.getByTestId('content-value')).toHaveTextContent('B'.repeat(5000))
    })

    it('should handle multiple edit attempts', () => {
      // Arrange
      render(<EditArticleContainer />)
      const titleInput = screen.getByTestId('title-input')
      const saveButton = screen.getByTestId('save-button')

      // Act
      fireEvent.change(titleInput, { target: { value: 'Edit 1' } })
      fireEvent.click(saveButton)

      // Act
      fireEvent.change(titleInput, { target: { value: 'Edit 2' } })
      fireEvent.click(saveButton)

      // Assert
      expect(mockUpdateArticle).toHaveBeenCalledTimes(2)
      expect(mockUpdateArticle).toHaveBeenLastCalledWith('article1', expect.objectContaining({
        title: 'Edit 2'
      }))
    })
  })

  describe('Not found state', () => {
    it('should render error message with proper styling', () => {
      // Arrange
      mockGetArticleById.mockReturnValue(null)

      // Act
      const { container } = render(<EditArticleContainer />)

      // Assert
      expect(screen.getByText(/article introuvable/i)).toBeInTheDocument()
      const errorContainer = container.querySelector('.min-h-screen')
      expect(errorContainer).toBeInTheDocument()
    })

    it('should not render presenter when article not found', () => {
      // Arrange
      mockGetArticleById.mockReturnValue(null)

      // Act
      render(<EditArticleContainer />)

      // Assert
      expect(screen.queryByTestId('edit-article-presenter')).not.toBeInTheDocument()
      expect(screen.queryByTestId('save-button')).not.toBeInTheDocument()
    })
  })
})
