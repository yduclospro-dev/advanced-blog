import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import CommentsListContainer from '@/components/articles/comments/containers/CommentsListContainer'
import { Comment } from '@/types/Comment'

jest.mock('@/components/ui', () => ({
  Toast: ({ message, type }: { message: string; type: string }) => (
    <div data-testid="toast" data-message={message} data-type={type}>
      {message}
    </div>
  )
  ,
  ImageUpload: ({ value }: { value?: string | null }) => <div data-testid="image-upload">{value}</div>
}))

jest.mock('@/components/articles/comments/presenters/CommentsListPresenter', () => ({
  __esModule: true,
  default: ({
    comments,
    currentUserId,
    editingId,
    editContent,
    deleteConfirmId,
    onStartEditing,
    onCancelEditing,
    onEditContentChange,
    onSaveEdit,
    onShowDeleteConfirm,
    onConfirmDelete,
    onCancelDelete,
    onCommentLike,
    onCommentDislike,
  }: {
    comments: Comment[]
    currentUserId?: string
    editingId: string | null
    editContent: string
    deleteConfirmId: string | null
    onStartEditing: (comment: Comment) => void
    onCancelEditing: () => void
    onEditContentChange: (value: string) => void
    onSaveEdit: (commentId: string) => void
    onShowDeleteConfirm: (commentId: string) => void
    onConfirmDelete: () => void
    onCancelDelete: () => void
    onCommentLike: (commentId: string) => void
    onCommentDislike: (commentId: string) => void
  }) => (
    <div data-testid="comments-list-presenter">
      <div data-testid="comments-count">{comments.length}</div>
      <div data-testid="current-user">{currentUserId || 'none'}</div>
      <div data-testid="editing-id">{editingId || 'none'}</div>
      <div data-testid="edit-content">{editContent}</div>
      <div data-testid="delete-confirm-id">{deleteConfirmId || 'none'}</div>
      
      {comments.map((comment) => (
        <div key={comment.id} data-testid={`comment-${comment.id}`}>
          <button onClick={() => onStartEditing(comment)}>Edit {comment.id}</button>
          <button onClick={() => onShowDeleteConfirm(comment.id)}>Delete {comment.id}</button>
          <button onClick={() => onCommentLike(comment.id)}>Like {comment.id}</button>
          <button onClick={() => onCommentDislike(comment.id)}>Dislike {comment.id}</button>
        </div>
      ))}
      
      <button onClick={onCancelEditing}>Cancel Edit</button>
      <input
        data-testid="edit-input"
        value={editContent}
        onChange={(e) => onEditContentChange(e.target.value)}
      />
      <button onClick={() => editingId && onSaveEdit(editingId)}>Save Edit</button>
      <button onClick={onConfirmDelete}>Confirm Delete</button>
      <button onClick={onCancelDelete}>Cancel Delete</button>
    </div>
  )
}))

describe('CommentsListContainer', () => {
  const mockComments: Comment[] = [
    {
      id: '1',
      articleId: 'article1',
      content: 'Premier commentaire',
      authorId: 'user1',
      authorName: 'Alice',
      date: '2024-01-15T10:00:00Z',
      likes: [],
      dislikes: []
    },
    {
      id: '2',
      articleId: 'article1',
      content: 'Deuxième commentaire',
      authorId: 'user2',
      authorName: 'Bob',
      date: '2024-01-16T14:30:00Z',
      likes: [],
      dislikes: []
    }
  ]

  const mockProps = {
    comments: mockComments,
    currentUserId: 'user1',
    onDelete: jest.fn(),
    onUpdate: jest.fn(),
    onLike: jest.fn(),
    onDislike: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
    document.body.style.overflow = 'auto'
  })

  describe('Initialization', () => {
    it('should render CommentsListPresenter', () => {
      // Arrange & Act
      render(<CommentsListContainer {...mockProps} />)

      // Assert
      expect(screen.getByTestId('comments-list-presenter')).toBeInTheDocument()
    })

    it('should pass comments to presenter', () => {
      // Arrange & Act
      render(<CommentsListContainer {...mockProps} />)

      // Assert
      expect(screen.getByTestId('comments-count')).toHaveTextContent('2')
    })

    it('should pass currentUserId to presenter', () => {
      // Arrange & Act
      render(<CommentsListContainer {...mockProps} />)

      // Assert
      expect(screen.getByTestId('current-user')).toHaveTextContent('user1')
    })

    it('should initialize with no editing state', () => {
      // Arrange & Act
      render(<CommentsListContainer {...mockProps} />)

      // Assert
      expect(screen.getByTestId('editing-id')).toHaveTextContent('none')
      expect(screen.getByTestId('edit-content')).toHaveTextContent('')
    })

    it('should initialize with no delete confirmation', () => {
      // Arrange & Act
      render(<CommentsListContainer {...mockProps} />)

      // Assert
      expect(screen.getByTestId('delete-confirm-id')).toHaveTextContent('none')
    })
  })

  describe('Editing functionality', () => {
    it('should enter editing mode when edit button is clicked', () => {
      // Arrange
      render(<CommentsListContainer {...mockProps} />)
      const editButton = screen.getByText('Edit 1')

      // Act
      fireEvent.click(editButton)

      // Assert
      expect(screen.getByTestId('editing-id')).toHaveTextContent('1')
      expect(screen.getByTestId('edit-content')).toHaveTextContent('Premier commentaire')
    })

    it('should update edit content when input changes', () => {
      // Arrange
      render(<CommentsListContainer {...mockProps} />)
      fireEvent.click(screen.getByText('Edit 1'))
      const input = screen.getByTestId('edit-input')

      // Act
      fireEvent.change(input, { target: { value: 'Contenu modifié' } })

      // Assert
      expect(screen.getByTestId('edit-content')).toHaveTextContent('Contenu modifié')
    })

    it('should call onUpdate when save is clicked with valid content', () => {
      // Arrange
      render(<CommentsListContainer {...mockProps} />)
      fireEvent.click(screen.getByText('Edit 1'))
      const input = screen.getByTestId('edit-input')
      const saveButton = screen.getByText('Save Edit')

      // Act
      fireEvent.change(input, { target: { value: '  Nouveau contenu  ' } })
      fireEvent.click(saveButton)

      // Assert
      expect(mockProps.onUpdate).toHaveBeenCalledWith('1', '  Nouveau contenu  ')
    })

    it('should reset editing state after successful save', () => {
      // Arrange
      render(<CommentsListContainer {...mockProps} />)
      fireEvent.click(screen.getByText('Edit 1'))
      const input = screen.getByTestId('edit-input')
      const saveButton = screen.getByText('Save Edit')

      // Act
      fireEvent.change(input, { target: { value: 'Nouveau contenu' } })
      fireEvent.click(saveButton)

      // Assert
      expect(screen.getByTestId('editing-id')).toHaveTextContent('none')
      expect(screen.getByTestId('edit-content')).toHaveTextContent('')
    })

    it('should show toast when trying to save empty content', () => {
      // Arrange
      render(<CommentsListContainer {...mockProps} />)
      fireEvent.click(screen.getByText('Edit 1'))
      const input = screen.getByTestId('edit-input')
      const saveButton = screen.getByText('Save Edit')

      // Act
      fireEvent.change(input, { target: { value: '' } })
      fireEvent.click(saveButton)

      // Assert
      const toast = screen.getByTestId('toast')
      expect(toast).toHaveAttribute('data-message', 'Le commentaire ne peut pas être vide !')
      expect(toast).toHaveAttribute('data-type', 'error')
      expect(mockProps.onUpdate).not.toHaveBeenCalled()
    })

    it('should show toast when trying to save whitespace only', () => {
      // Arrange
      render(<CommentsListContainer {...mockProps} />)
      fireEvent.click(screen.getByText('Edit 1'))
      const input = screen.getByTestId('edit-input')
      const saveButton = screen.getByText('Save Edit')

      // Act
      fireEvent.change(input, { target: { value: '   ' } })
      fireEvent.click(saveButton)

      // Assert
      const toast = screen.getByTestId('toast')
      expect(toast).toHaveAttribute('data-message', 'Le commentaire ne peut pas être vide !')
      expect(toast).toHaveAttribute('data-type', 'error')
      expect(mockProps.onUpdate).not.toHaveBeenCalled()
    })

    it('should cancel editing when cancel button is clicked', () => {
      // Arrange
      render(<CommentsListContainer {...mockProps} />)
      fireEvent.click(screen.getByText('Edit 1'))
      const input = screen.getByTestId('edit-input')
      fireEvent.change(input, { target: { value: 'Modified' } })
      const cancelButton = screen.getByText('Cancel Edit')

      // Act
      fireEvent.click(cancelButton)

      // Assert
      expect(screen.getByTestId('editing-id')).toHaveTextContent('none')
      expect(screen.getByTestId('edit-content')).toHaveTextContent('')
    })

    it('should not maintain editing state across different comments', () => {
      // Arrange
      render(<CommentsListContainer {...mockProps} />)
      
      // Act
      fireEvent.click(screen.getByText('Edit 1'))
      const firstContent = screen.getByTestId('edit-content').textContent

      // Act
      fireEvent.click(screen.getByText('Edit 2'))
      const secondContent = screen.getByTestId('edit-content').textContent

      // Assert
      expect(firstContent).toBe('Premier commentaire')
      expect(secondContent).toBe('Deuxième commentaire')
      expect(screen.getByTestId('editing-id')).toHaveTextContent('2')
    })
  })

  describe('Delete functionality', () => {
    it('should show delete confirmation when delete button is clicked', () => {
      // Arrange
      render(<CommentsListContainer {...mockProps} />)
      const deleteButton = screen.getByText('Delete 1')

      // Act
      fireEvent.click(deleteButton)

      // Assert
      expect(screen.getByTestId('delete-confirm-id')).toHaveTextContent('1')
    })

    it('should call onDelete when confirm is clicked', () => {
      // Arrange
      render(<CommentsListContainer {...mockProps} />)
      fireEvent.click(screen.getByText('Delete 1'))
      const confirmButton = screen.getByText('Confirm Delete')

      // Act
      fireEvent.click(confirmButton)

      // Assert
      expect(mockProps.onDelete).toHaveBeenCalledWith('1')
    })

    it('should reset delete confirmation after deletion', () => {
      // Arrange
      render(<CommentsListContainer {...mockProps} />)
      fireEvent.click(screen.getByText('Delete 1'))
      const confirmButton = screen.getByText('Confirm Delete')

      // Act
      fireEvent.click(confirmButton)

      // Assert
      expect(screen.getByTestId('delete-confirm-id')).toHaveTextContent('none')
    })

    it('should cancel delete when cancel button is clicked', () => {
      // Arrange
      render(<CommentsListContainer {...mockProps} />)
      fireEvent.click(screen.getByText('Delete 1'))
      const cancelButton = screen.getByText('Cancel Delete')

      // Act
      fireEvent.click(cancelButton)

      // Assert
      expect(screen.getByTestId('delete-confirm-id')).toHaveTextContent('none')
      expect(mockProps.onDelete).not.toHaveBeenCalled()
    })

    it('should hide body overflow when delete modal is shown', () => {
      // Arrange
      render(<CommentsListContainer {...mockProps} />)

      // Act
      fireEvent.click(screen.getByText('Delete 1'))

      // Assert
      expect(document.body.style.overflow).toBe('hidden')
    })

    it('should restore body overflow when delete is cancelled', () => {
      // Arrange
      render(<CommentsListContainer {...mockProps} />)
      fireEvent.click(screen.getByText('Delete 1'))

      // Act
      fireEvent.click(screen.getByText('Cancel Delete'))

      // Assert
      expect(document.body.style.overflow).toBe('auto')
    })

    it('should restore body overflow when delete is confirmed', () => {
      // Arrange
      render(<CommentsListContainer {...mockProps} />)
      fireEvent.click(screen.getByText('Delete 1'))

      // Act
      fireEvent.click(screen.getByText('Confirm Delete'))

      // Assert
      expect(document.body.style.overflow).toBe('auto')
    })
  })

  describe('Like/Dislike functionality', () => {
    it('should call onLike when like button is clicked', () => {
      // Arrange
      render(<CommentsListContainer {...mockProps} />)
      const likeButton = screen.getByText('Like 1')

      // Act
      fireEvent.click(likeButton)

      // Assert
      expect(mockProps.onLike).toHaveBeenCalledWith('1')
    })

    it('should call onDislike when dislike button is clicked', () => {
      // Arrange
      render(<CommentsListContainer {...mockProps} />)
      const dislikeButton = screen.getByText('Dislike 1')

      // Act
      fireEvent.click(dislikeButton)

      // Assert
      expect(mockProps.onDislike).toHaveBeenCalledWith('1')
    })

    it('should handle multiple like clicks', () => {
      // Arrange
      render(<CommentsListContainer {...mockProps} />)
      const likeButton1 = screen.getByText('Like 1')
      const likeButton2 = screen.getByText('Like 2')

      // Act
      fireEvent.click(likeButton1)
      fireEvent.click(likeButton2)

      // Assert
      expect(mockProps.onLike).toHaveBeenCalledTimes(2)
      expect(mockProps.onLike).toHaveBeenNthCalledWith(1, '1')
      expect(mockProps.onLike).toHaveBeenNthCalledWith(2, '2')
    })

    it('should handle multiple dislike clicks', () => {
      // Arrange
      render(<CommentsListContainer {...mockProps} />)
      const dislikeButton1 = screen.getByText('Dislike 1')
      const dislikeButton2 = screen.getByText('Dislike 2')

      // Act
      fireEvent.click(dislikeButton1)
      fireEvent.click(dislikeButton2)

      // Assert
      expect(mockProps.onDislike).toHaveBeenCalledTimes(2)
      expect(mockProps.onDislike).toHaveBeenNthCalledWith(1, '1')
      expect(mockProps.onDislike).toHaveBeenNthCalledWith(2, '2')
    })
  })

  describe('Component cleanup', () => {
    it('should restore body overflow on unmount', () => {
      // Arrange
      const { unmount } = render(<CommentsListContainer {...mockProps} />)
      fireEvent.click(screen.getByText('Delete 1'))
      expect(document.body.style.overflow).toBe('hidden')

      // Act
      unmount()

      // Assert
      expect(document.body.style.overflow).toBe('auto')
    })
  })

  describe('Edge cases', () => {
    it('should handle empty comments array', () => {
      // Arrange
      const emptyProps = { ...mockProps, comments: [] }

      // Act
      render(<CommentsListContainer {...emptyProps} />)

      // Assert
      expect(screen.getByTestId('comments-count')).toHaveTextContent('0')
    })

    it('should handle undefined currentUserId', () => {
      // Arrange
      const propsWithoutUser = { ...mockProps, currentUserId: undefined }

      // Act
      render(<CommentsListContainer {...propsWithoutUser} />)

      // Assert
      expect(screen.getByTestId('current-user')).toHaveTextContent('none')
    })

    it('should handle multiple edits and cancellations', () => {
      // Arrange
      render(<CommentsListContainer {...mockProps} />)

      // Act
      fireEvent.click(screen.getByText('Edit 1'))
      fireEvent.click(screen.getByText('Cancel Edit'))
      fireEvent.click(screen.getByText('Edit 2'))
      fireEvent.click(screen.getByText('Cancel Edit'))

      // Assert
      expect(screen.getByTestId('editing-id')).toHaveTextContent('none')
      expect(mockProps.onUpdate).not.toHaveBeenCalled()
    })

    it('should handle edit and delete simultaneously', () => {
      // Arrange
      render(<CommentsListContainer {...mockProps} />)

      // Act
      fireEvent.click(screen.getByText('Edit 1'))
      fireEvent.click(screen.getByText('Delete 2'))

      // Assert
      expect(screen.getByTestId('editing-id')).toHaveTextContent('1')
      expect(screen.getByTestId('delete-confirm-id')).toHaveTextContent('2')
    })
  })
})
