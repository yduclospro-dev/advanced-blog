import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import CommentsListPresenter from '@/components/articles/comments/presenters/CommentsListPresenter'
import { Comment } from '@/types/Comment'

jest.mock('@/components/ui', () => ({
  Button: ({ label, onClick, icon, variant, size }: { label: string; onClick?: () => void; icon?: React.ReactNode; variant?: string; size?: string }) => (
    <button onClick={onClick} data-variant={variant} data-size={size}>
      {icon}
      {label}
    </button>
  ),
  TextArea: ({ value, onChange, rows }: { value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; rows?: number }) => (
    <textarea value={value} onChange={onChange} rows={rows} />
  ),
  LikeDislikeButtons: ({ likesCount, dislikesCount, hasLiked, hasDisliked, onLike, onDislike }: { likesCount: number; dislikesCount: number; hasLiked: boolean; hasDisliked: boolean; onLike: () => void; onDislike: () => void }) => (
    <div data-testid="like-dislike-buttons">
      <button onClick={onLike} data-active={hasLiked}>
        Like ({likesCount})
      </button>
      <button onClick={onDislike} data-active={hasDisliked}>
        Dislike ({dislikesCount})
      </button>
    </div>
  ),
  ImageUpload: ({ value }: { value?: string | null }) => <div data-testid="image-upload">{value}</div>
}))

jest.mock('@/components/ConfirmModal', () => ({
  __esModule: true,
  default: ({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) => (
    <div data-testid="confirm-modal">
      <p>{message}</p>
      <button onClick={onConfirm}>Confirmer</button>
      <button onClick={onCancel}>Annuler</button>
    </div>
  )
}))

describe('CommentsListPresenter', () => {
  const mockComments: Comment[] = [
    {
      id: '1',
      articleId: 'article1',
      content: 'Premier commentaire',
      authorId: 'user1',
      authorName: 'Alice',
      date: '2024-01-15T10:00:00Z',
      likes: ['user2'],
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
      dislikes: ['user1']
    }
  ]

  const mockProps = {
    comments: mockComments,
    currentUserId: 'user1',
    editingId: null,
    editContent: '',
    deleteConfirmId: null,
    onStartEditing: jest.fn(),
    onCancelEditing: jest.fn(),
    onEditContentChange: jest.fn(),
    onSaveEdit: jest.fn(),
    onShowDeleteConfirm: jest.fn(),
    onConfirmDelete: jest.fn(),
    onCancelDelete: jest.fn(),
    onCommentLike: jest.fn(),
    onCommentDislike: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render empty state when no comments', () => {
      // Arrange
      const emptyProps = { ...mockProps, comments: [] }

      // Act
      render(<CommentsListPresenter {...emptyProps} />)

      // Assert
      expect(screen.getByText(/aucun commentaire pour le moment/i)).toBeInTheDocument()
    })

    it('should render comments list with title and count', () => {
      // Arrange & Act
      render(<CommentsListPresenter {...mockProps} />)

      // Assert
      expect(screen.getByText(/💬 commentaires \(2\)/i)).toBeInTheDocument()
    })

    it('should render all comments', () => {
      // Arrange & Act
      render(<CommentsListPresenter {...mockProps} />)

      // Assert
      expect(screen.getByText('Premier commentaire')).toBeInTheDocument()
      expect(screen.getByText('Deuxième commentaire')).toBeInTheDocument()
      expect(screen.getByText('Alice')).toBeInTheDocument()
      expect(screen.getByText('Bob')).toBeInTheDocument()
    })

    it('should format dates correctly', () => {
      // Arrange & Act
      render(<CommentsListPresenter {...mockProps} />)

      // Assert
      expect(screen.getByText(/15 janvier 2024/i)).toBeInTheDocument()
      expect(screen.getByText(/16 janvier 2024/i)).toBeInTheDocument()
    })
  })

  describe('Owner actions', () => {
    it('should show edit and delete buttons for own comment', () => {
      // Arrange & Act
      render(<CommentsListPresenter {...mockProps} />)

      // Assert
      const buttons = screen.getAllByRole('button')
      const editDeleteButtons = buttons.filter(btn => 
        btn.getAttribute('data-variant') === 'primary' || 
        btn.getAttribute('data-variant') === 'danger'
      )
      expect(editDeleteButtons.length).toBeGreaterThanOrEqual(2)
    })

    it('should not show edit/delete buttons for other users comments', () => {
      // Arrange
      const comment = mockComments[1]
      const props = { ...mockProps, comments: [comment] }

      // Act
      render(<CommentsListPresenter {...props} />)

      // Assert
      const buttons = screen.getAllByRole('button')
      const editDeleteButtons = buttons.filter(btn => 
        btn.getAttribute('data-variant') === 'primary' || 
        btn.getAttribute('data-variant') === 'danger'
      )
      expect(editDeleteButtons.length).toBe(0)
    })

    it('should call onStartEditing when edit button is clicked', () => {
      // Arrange
      render(<CommentsListPresenter {...mockProps} />)
      const buttons = screen.getAllByRole('button')
      const editButton = buttons.find(btn => btn.getAttribute('data-variant') === 'primary')

      // Act
      if (editButton) fireEvent.click(editButton)

      // Assert
      expect(mockProps.onStartEditing).toHaveBeenCalledWith(mockComments[0])
    })

    it('should call onShowDeleteConfirm when delete button is clicked', () => {
      // Arrange
      render(<CommentsListPresenter {...mockProps} />)
      const buttons = screen.getAllByRole('button')
      const deleteButton = buttons.find(btn => btn.getAttribute('data-variant') === 'danger')

      // Act
      if (deleteButton) fireEvent.click(deleteButton)

      // Assert
      expect(mockProps.onShowDeleteConfirm).toHaveBeenCalledWith('1')
    })
  })

  describe('Editing mode', () => {
    it('should show textarea when editing', () => {
      // Arrange
      const editingProps = {
        ...mockProps,
        editingId: '1',
        editContent: 'Contenu en cours de modification'
      }

      // Act
      render(<CommentsListPresenter {...editingProps} />)

      // Assert
      const textarea = screen.getByDisplayValue('Contenu en cours de modification')
      expect(textarea).toBeInTheDocument()
    })

    it('should show save and cancel buttons when editing', () => {
      // Arrange
      const editingProps = {
        ...mockProps,
        editingId: '1',
        editContent: 'Edit'
      }

      // Act
      render(<CommentsListPresenter {...editingProps} />)

      // Assert
      expect(screen.getByText('Sauvegarder')).toBeInTheDocument()
      expect(screen.getByText('Annuler')).toBeInTheDocument()
    })

    it('should call onEditContentChange when textarea changes', () => {
      // Arrange
      const editingProps = {
        ...mockProps,
        editingId: '1',
        editContent: 'Old content'
      }
      render(<CommentsListPresenter {...editingProps} />)
      const textarea = screen.getByDisplayValue('Old content')

      // Act
      fireEvent.change(textarea, { target: { value: 'New content' } })

      // Assert
      expect(mockProps.onEditContentChange).toHaveBeenCalledWith('New content')
    })

    it('should call onSaveEdit when save button is clicked', () => {
      // Arrange
      const editingProps = {
        ...mockProps,
        editingId: '1',
        editContent: 'Edited'
      }
      render(<CommentsListPresenter {...editingProps} />)
      const saveButton = screen.getByText('Sauvegarder')

      // Act
      fireEvent.click(saveButton)

      // Assert
      expect(mockProps.onSaveEdit).toHaveBeenCalledWith('1')
    })

    it('should call onCancelEditing when cancel button is clicked', () => {
      // Arrange
      const editingProps = {
        ...mockProps,
        editingId: '1',
        editContent: 'Edited'
      }
      render(<CommentsListPresenter {...editingProps} />)
      const cancelButton = screen.getByText('Annuler')

      // Act
      fireEvent.click(cancelButton)

      // Assert
      expect(mockProps.onCancelEditing).toHaveBeenCalled()
    })

    it('should not show comment content when editing', () => {
      // Arrange
      const editingProps = {
        ...mockProps,
        editingId: '1',
        editContent: 'Editing...'
      }

      // Act
      render(<CommentsListPresenter {...editingProps} />)

      // Assert
      expect(screen.queryByText('Premier commentaire')).not.toBeInTheDocument()
    })
  })

  describe('Like/Dislike functionality', () => {
    it('should show like/dislike buttons for other users comments', () => {
      // Arrange
      const comment = mockComments[1]
      const props = { ...mockProps, comments: [comment] }

      // Act
      render(<CommentsListPresenter {...props} />)

      // Assert
      expect(screen.getByTestId('like-dislike-buttons')).toBeInTheDocument()
    })

    it('should not show like/dislike buttons for own comments', () => {
      // Arrange
      const comment = mockComments[0]
      const props = { ...mockProps, comments: [comment] }

      // Act
      render(<CommentsListPresenter {...props} />)

      // Assert
      expect(screen.queryByTestId('like-dislike-buttons')).not.toBeInTheDocument()
    })

    it('should not show like/dislike buttons when not authenticated', () => {
      // Arrange
      const props = { ...mockProps, currentUserId: undefined }

      // Act
      render(<CommentsListPresenter {...props} />)

      // Assert
      expect(screen.queryByTestId('like-dislike-buttons')).not.toBeInTheDocument()
    })

    it('should call onCommentLike when like button is clicked', () => {
      // Arrange
      const comment = mockComments[1]
      const props = { ...mockProps, comments: [comment] }
      render(<CommentsListPresenter {...props} />)
      const likeButton = screen.getByText(/like \(0\)/i)

      // Act
      fireEvent.click(likeButton)

      // Assert
      expect(mockProps.onCommentLike).toHaveBeenCalledWith('2')
    })

    it('should call onCommentDislike when dislike button is clicked', () => {
      // Arrange
      const comment = mockComments[1]
      const props = { ...mockProps, comments: [comment] }
      render(<CommentsListPresenter {...props} />)
      const dislikeButton = screen.getByText(/dislike \(1\)/i)

      // Act
      fireEvent.click(dislikeButton)

      // Assert
      expect(mockProps.onCommentDislike).toHaveBeenCalledWith('2')
    })

    it('should pass correct counts to like/dislike buttons', () => {
      // Arrange
      const props = { ...mockProps, comments: [mockComments[1]] }

      // Act
      render(<CommentsListPresenter {...props} />)

      // Assert
      expect(screen.getByText(/like \(0\)/i)).toBeInTheDocument()
      expect(screen.getByText(/dislike \(1\)/i)).toBeInTheDocument()
    })
  })

  describe('Visual distinction', () => {
    it('should apply blue background to own comments', () => {
      // Arrange & Act
      const { container } = render(<CommentsListPresenter {...mockProps} />)

      // Assert
      const ownComment = container.querySelector('.bg-blue-50')
      expect(ownComment).toBeInTheDocument()
    })

    it('should apply gray background to other users comments', () => {
      // Arrange & Act
      const { container } = render(<CommentsListPresenter {...mockProps} />)

      // Assert
      const otherComment = container.querySelector('.bg-gray-50')
      expect(otherComment).toBeInTheDocument()
    })
  })

  describe('Delete confirmation modal', () => {
    it('should show modal when deleteConfirmId is set', () => {
      // Arrange
      const propsWithModal = {
        ...mockProps,
        deleteConfirmId: '1'
      }

      // Act
      render(<CommentsListPresenter {...propsWithModal} />)

      // Assert
      expect(screen.getByTestId('confirm-modal')).toBeInTheDocument()
      expect(screen.getByText(/êtes-vous sûr de vouloir supprimer ce commentaire/i)).toBeInTheDocument()
    })

    it('should not show modal when deleteConfirmId is null', () => {
      // Arrange & Act
      render(<CommentsListPresenter {...mockProps} />)

      // Assert
      expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument()
    })

    it('should call onConfirmDelete when confirm button is clicked', () => {
      // Arrange
      const propsWithModal = {
        ...mockProps,
        deleteConfirmId: '1'
      }
      render(<CommentsListPresenter {...propsWithModal} />)
      const confirmButton = screen.getByText('Confirmer')

      // Act
      fireEvent.click(confirmButton)

      // Assert
      expect(mockProps.onConfirmDelete).toHaveBeenCalled()
    })

    it('should call onCancelDelete when cancel button is clicked', () => {
      // Arrange
      const propsWithModal = {
        ...mockProps,
        deleteConfirmId: '1'
      }
      render(<CommentsListPresenter {...propsWithModal} />)
      const cancelButton = screen.getByText('Annuler')

      // Act
      fireEvent.click(cancelButton)

      // Assert
      expect(mockProps.onCancelDelete).toHaveBeenCalled()
    })
  })
})
