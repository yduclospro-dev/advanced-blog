import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import NewArticlePresenter from '@/components/articles/presenters/NewArticlePresenter'

jest.mock('@/components/ui', () => ({
  Button: ({ label, onClick, variant }: { label: string; onClick: () => void; variant?: string }) => (
    <button onClick={onClick} data-variant={variant}>{label}</button>
  ),
  Input: ({ value, onChange, placeholder, type }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; type?: string }) => (
    <input value={value} onChange={onChange} placeholder={placeholder} type={type} />
  ),
  TextArea: ({ value, onChange, placeholder, rows }: { value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string; rows?: number }) => (
    <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} />
  ),
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
  ,
  ImageUpload: ({ value }: { value?: string | null }) => <div data-testid="image-upload">{value}</div>
}))

describe('NewArticlePresenter', () => {
  const mockProps = {
    formData: {
      title: '',
      content: ''
    },
    onInputChange: jest.fn(),
    onImageChange: jest.fn(),
    onImageError: jest.fn(),
    onSave: jest.fn(),
    onCancel: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render form title', () => {
      // Arrange & Act
      render(<NewArticlePresenter {...mockProps} />)

      // Assert
      expect(screen.getByText(/📰 créer un nouvel article/i)).toBeInTheDocument()
    })

    it('should render back button', () => {
      // Arrange & Act
      render(<NewArticlePresenter {...mockProps} />)

      // Assert
      expect(screen.getByText(/← retour à la liste/i)).toBeInTheDocument()
    })

    it('should render title input', () => {
      // Arrange & Act
      render(<NewArticlePresenter {...mockProps} />)

      // Assert
      expect(screen.getByPlaceholderText('Titre')).toBeInTheDocument()
    })

    it('should render content textarea', () => {
      // Arrange & Act
      render(<NewArticlePresenter {...mockProps} />)

      // Assert
      expect(screen.getByPlaceholderText(/contenu de l'article/i)).toBeInTheDocument()
    })

    it('should render save and cancel buttons', () => {
      // Arrange & Act
      render(<NewArticlePresenter {...mockProps} />)

      // Assert
      expect(screen.getByText('Enregistrer')).toBeInTheDocument()
      expect(screen.getByText('Annuler')).toBeInTheDocument()
    })
  })

  describe('Form data display', () => {
    it('should display title value', () => {
      // Arrange
      const propsWithData = {
        ...mockProps,
        formData: { title: 'Mon article', content: '' }
      }

      // Act
      render(<NewArticlePresenter {...propsWithData} />)

      // Assert
      expect(screen.getByDisplayValue('Mon article')).toBeInTheDocument()
    })

    it('should display content value', () => {
      // Arrange
      const propsWithData = {
        ...mockProps,
        formData: { title: '', content: 'Contenu de mon article' }
      }

      // Act
      render(<NewArticlePresenter {...propsWithData} />)

      // Assert
      expect(screen.getByDisplayValue('Contenu de mon article')).toBeInTheDocument()
    })

    it('should display both title and content', () => {
      // Arrange
      const propsWithData = {
        ...mockProps,
        formData: { title: 'Titre', content: 'Contenu' }
      }

      // Act
      render(<NewArticlePresenter {...propsWithData} />)

      // Assert
      expect(screen.getByDisplayValue('Titre')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Contenu')).toBeInTheDocument()
    })
  })

  describe('User interactions', () => {
    it('should call onInputChange when title changes', () => {
      // Arrange
      render(<NewArticlePresenter {...mockProps} />)
      const titleInput = screen.getByPlaceholderText('Titre')

      // Act
      fireEvent.change(titleInput, { target: { value: 'Nouveau titre' } })

      // Assert
      expect(mockProps.onInputChange).toHaveBeenCalledWith('title', 'Nouveau titre')
    })

    it('should call onInputChange when content changes', () => {
      // Arrange
      render(<NewArticlePresenter {...mockProps} />)
      const contentTextarea = screen.getByPlaceholderText(/contenu de l'article/i)

      // Act
      fireEvent.change(contentTextarea, { target: { value: 'Nouveau contenu' } })

      // Assert
      expect(mockProps.onInputChange).toHaveBeenCalledWith('content', 'Nouveau contenu')
    })

    it('should call onSave when save button is clicked', () => {
      // Arrange
      render(<NewArticlePresenter {...mockProps} />)
      const saveButton = screen.getByText('Enregistrer')

      // Act
      fireEvent.click(saveButton)

      // Assert
      expect(mockProps.onSave).toHaveBeenCalledTimes(1)
    })

    it('should call onCancel when cancel button is clicked', () => {
      // Arrange
      render(<NewArticlePresenter {...mockProps} />)
      const cancelButton = screen.getByText('Annuler')

      // Act
      fireEvent.click(cancelButton)

      // Assert
      expect(mockProps.onCancel).toHaveBeenCalledTimes(1)
    })

    it('should call onCancel when back button is clicked', () => {
      // Arrange
      render(<NewArticlePresenter {...mockProps} />)
      const backButton = screen.getByText(/← retour à la liste/i)

      // Act
      fireEvent.click(backButton)

      // Assert
      expect(mockProps.onCancel).toHaveBeenCalledTimes(1)
    })
  })

  describe('Multiple interactions', () => {
    it('should handle multiple title changes', () => {
      // Arrange
      render(<NewArticlePresenter {...mockProps} />)
      const titleInput = screen.getByPlaceholderText('Titre')

      // Act
      fireEvent.change(titleInput, { target: { value: 'First' } })
      fireEvent.change(titleInput, { target: { value: 'Second' } })
      fireEvent.change(titleInput, { target: { value: 'Third' } })

      // Assert
      expect(mockProps.onInputChange).toHaveBeenCalledTimes(3)
      expect(mockProps.onInputChange).toHaveBeenLastCalledWith('title', 'Third')
    })

    it('should handle multiple content changes', () => {
      // Arrange
      render(<NewArticlePresenter {...mockProps} />)
      const contentTextarea = screen.getByPlaceholderText(/contenu de l'article/i)

      // Act
      fireEvent.change(contentTextarea, { target: { value: 'Content 1' } })
      fireEvent.change(contentTextarea, { target: { value: 'Content 2' } })

      // Assert
      expect(mockProps.onInputChange).toHaveBeenCalledTimes(2)
      expect(mockProps.onInputChange).toHaveBeenLastCalledWith('content', 'Content 2')
    })

    it('should handle both title and content changes', () => {
      // Arrange
      render(<NewArticlePresenter {...mockProps} />)
      const titleInput = screen.getByPlaceholderText('Titre')
      const contentTextarea = screen.getByPlaceholderText(/contenu de l'article/i)

      // Act
      fireEvent.change(titleInput, { target: { value: 'My Title' } })
      fireEvent.change(contentTextarea, { target: { value: 'My Content' } })

      // Assert
      expect(mockProps.onInputChange).toHaveBeenCalledTimes(2)
      expect(mockProps.onInputChange).toHaveBeenNthCalledWith(1, 'title', 'My Title')
      expect(mockProps.onInputChange).toHaveBeenNthCalledWith(2, 'content', 'My Content')
    })
  })

  describe('Button variants', () => {
    it('should render save button with primary variant', () => {
      // Arrange & Act
      render(<NewArticlePresenter {...mockProps} />)
      const buttons = screen.getAllByRole('button')
      const saveButton = buttons.find(btn => btn.textContent === 'Enregistrer')

      // Assert
      expect(saveButton).toHaveAttribute('data-variant', 'primary')
    })

    it('should render cancel button with outline variant', () => {
      // Arrange & Act
      render(<NewArticlePresenter {...mockProps} />)
      const buttons = screen.getAllByRole('button')
      const cancelButton = buttons.find(btn => btn.textContent === 'Annuler')

      // Assert
      expect(cancelButton).toHaveAttribute('data-variant', 'outline')
    })
  })
})
