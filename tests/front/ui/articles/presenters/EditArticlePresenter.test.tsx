import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import EditArticlePresenter from '@/components/articles/presenters/EditArticlePresenter'

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

describe('EditArticlePresenter', () => {
  const mockProps = {
    formData: {
      title: 'Article existant',
      content: 'Contenu existant'
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
      render(<EditArticlePresenter {...mockProps} />)

      // Assert
      expect(screen.getByText(/📝 modifier l'article/i)).toBeInTheDocument()
    })

    it('should render title input', () => {
      // Arrange & Act
      render(<EditArticlePresenter {...mockProps} />)

      // Assert
      expect(screen.getByPlaceholderText('Titre')).toBeInTheDocument()
    })

    it('should render content textarea', () => {
      // Arrange & Act
      render(<EditArticlePresenter {...mockProps} />)

      // Assert
      expect(screen.getByPlaceholderText(/contenu de l'article/i)).toBeInTheDocument()
    })

    it('should render save and cancel buttons', () => {
      // Arrange & Act
      render(<EditArticlePresenter {...mockProps} />)

      // Assert
      expect(screen.getByText('Enregistrer')).toBeInTheDocument()
      expect(screen.getByText('Annuler')).toBeInTheDocument()
    })
  })

  describe('Form data display', () => {
    it('should display existing title', () => {
      // Arrange & Act
      render(<EditArticlePresenter {...mockProps} />)

      // Assert
      expect(screen.getByDisplayValue('Article existant')).toBeInTheDocument()
    })

    it('should display existing content', () => {
      // Arrange & Act
      render(<EditArticlePresenter {...mockProps} />)

      // Assert
      expect(screen.getByDisplayValue('Contenu existant')).toBeInTheDocument()
    })

    it('should display updated title', () => {
      // Arrange
      const updatedProps = {
        ...mockProps,
        formData: { title: 'Titre modifié', content: 'Contenu existant' }
      }

      // Act
      render(<EditArticlePresenter {...updatedProps} />)

      // Assert
      expect(screen.getByDisplayValue('Titre modifié')).toBeInTheDocument()
    })

    it('should display updated content', () => {
      // Arrange
      const updatedProps = {
        ...mockProps,
        formData: { title: 'Article existant', content: 'Contenu modifié' }
      }

      // Act
      render(<EditArticlePresenter {...updatedProps} />)

      // Assert
      expect(screen.getByDisplayValue('Contenu modifié')).toBeInTheDocument()
    })
  })

  describe('User interactions', () => {
    it('should call onInputChange when title changes', () => {
      // Arrange
      render(<EditArticlePresenter {...mockProps} />)
      const titleInput = screen.getByPlaceholderText('Titre')

      // Act
      fireEvent.change(titleInput, { target: { value: 'Nouveau titre' } })

      // Assert
      expect(mockProps.onInputChange).toHaveBeenCalledWith('title', 'Nouveau titre')
    })

    it('should call onInputChange when content changes', () => {
      // Arrange
      render(<EditArticlePresenter {...mockProps} />)
      const contentTextarea = screen.getByPlaceholderText(/contenu de l'article/i)

      // Act
      fireEvent.change(contentTextarea, { target: { value: 'Nouveau contenu' } })

      // Assert
      expect(mockProps.onInputChange).toHaveBeenCalledWith('content', 'Nouveau contenu')
    })

    it('should call onSave when save button is clicked', () => {
      // Arrange
      render(<EditArticlePresenter {...mockProps} />)
      const saveButton = screen.getByText('Enregistrer')

      // Act
      fireEvent.click(saveButton)

      // Assert
      expect(mockProps.onSave).toHaveBeenCalledTimes(1)
    })

    it('should call onCancel when cancel button is clicked', () => {
      // Arrange
      render(<EditArticlePresenter {...mockProps} />)
      const cancelButton = screen.getByText('Annuler')

      // Act
      fireEvent.click(cancelButton)

      // Assert
      expect(mockProps.onCancel).toHaveBeenCalledTimes(1)
    })
  })

  describe('Multiple interactions', () => {
    it('should handle multiple title changes', () => {
      // Arrange
      render(<EditArticlePresenter {...mockProps} />)
      const titleInput = screen.getByPlaceholderText('Titre')

      // Act
      fireEvent.change(titleInput, { target: { value: 'Version 1' } })
      fireEvent.change(titleInput, { target: { value: 'Version 2' } })
      fireEvent.change(titleInput, { target: { value: 'Version 3' } })

      // Assert
      expect(mockProps.onInputChange).toHaveBeenCalledTimes(3)
      expect(mockProps.onInputChange).toHaveBeenLastCalledWith('title', 'Version 3')
    })

    it('should handle multiple content changes', () => {
      // Arrange
      render(<EditArticlePresenter {...mockProps} />)
      const contentTextarea = screen.getByPlaceholderText(/contenu de l'article/i)

      // Act
      fireEvent.change(contentTextarea, { target: { value: 'Edit 1' } })
      fireEvent.change(contentTextarea, { target: { value: 'Edit 2' } })

      // Assert
      expect(mockProps.onInputChange).toHaveBeenCalledTimes(2)
      expect(mockProps.onInputChange).toHaveBeenLastCalledWith('content', 'Edit 2')
    })

    it('should handle alternating title and content changes', () => {
      // Arrange
      render(<EditArticlePresenter {...mockProps} />)
      const titleInput = screen.getByPlaceholderText('Titre')
      const contentTextarea = screen.getByPlaceholderText(/contenu de l'article/i)

      // Act
      fireEvent.change(titleInput, { target: { value: 'T1' } })
      fireEvent.change(contentTextarea, { target: { value: 'C1' } })
      fireEvent.change(titleInput, { target: { value: 'T2' } })
      fireEvent.change(contentTextarea, { target: { value: 'C2' } })

      // Assert
      expect(mockProps.onInputChange).toHaveBeenCalledTimes(4)
      expect(mockProps.onInputChange).toHaveBeenNthCalledWith(1, 'title', 'T1')
      expect(mockProps.onInputChange).toHaveBeenNthCalledWith(2, 'content', 'C1')
      expect(mockProps.onInputChange).toHaveBeenNthCalledWith(3, 'title', 'T2')
      expect(mockProps.onInputChange).toHaveBeenNthCalledWith(4, 'content', 'C2')
    })
  })

  describe('Button variants', () => {
    it('should render save button with primary variant', () => {
      // Arrange & Act
      render(<EditArticlePresenter {...mockProps} />)
      const buttons = screen.getAllByRole('button')
      const saveButton = buttons.find(btn => btn.textContent === 'Enregistrer')

      // Assert
      expect(saveButton).toHaveAttribute('data-variant', 'primary')
    })

    it('should render cancel button with outline variant', () => {
      // Arrange & Act
      render(<EditArticlePresenter {...mockProps} />)
      const buttons = screen.getAllByRole('button')
      const cancelButton = buttons.find(btn => btn.textContent === 'Annuler')

      // Assert
      expect(cancelButton).toHaveAttribute('data-variant', 'outline')
    })
  })

  describe('Comparison with empty state', () => {
    it('should handle empty title', () => {
      // Arrange
      const emptyTitleProps = {
        ...mockProps,
        formData: { title: '', content: 'Content' }
      }

      // Act
      render(<EditArticlePresenter {...emptyTitleProps} />)
      const titleInput = screen.getByPlaceholderText('Titre') as HTMLInputElement

      // Assert
      expect(titleInput.value).toBe('')
    })

    it('should handle empty content', () => {
      // Arrange
      const emptyContentProps = {
        ...mockProps,
        formData: { title: 'Title', content: '' }
      }

      // Act
      render(<EditArticlePresenter {...emptyContentProps} />)
      const contentTextarea = screen.getByPlaceholderText(/contenu de l'article/i) as HTMLTextAreaElement

      // Assert
      expect(contentTextarea.value).toBe('')
    })
  })
})
