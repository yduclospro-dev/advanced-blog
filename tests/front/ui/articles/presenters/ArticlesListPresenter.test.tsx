import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ArticlesListPresenter from '@/components/articles/presenters/ArticlesListPresenter'
import { Article } from '@/types/Article'

jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
  return MockLink
})

jest.mock('@/components/ui', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>,
  ButtonLink: ({ href, label }: { href: string; label: string }) => (
    <a href={href} data-testid="button-link">{label}</a>
  )
  ,
  ImageUpload: ({ value }: { value?: string | null }) => <div data-testid="image-upload">{value}</div>
}))

jest.mock('@/components/ArticleCard', () => {
  return function ArticleCard({ article }: { article: Article }) {
    return (
      <div data-testid="card">
        <h2>{article.title}</h2>
        <p>{article.author}</p>
        <p>{article.date}</p>
        <p>{article.content.substring(0, 100)}</p>
      </div>
    )
  }
})

describe('ArticlesListPresenter', () => {
  const mockArticles: Article[] = [
    {
      id: '1',
      title: 'Test Article 1',
      author: 'John Doe',
      authorId: 'user-1',
      date: '2024-01-01',
      content: 'Content 1',
      likes: ['user-2'],
      dislikes: []
    },
    {
      id: '2',
      title: 'Test Article 2',
      author: 'Jane Smith',
      authorId: 'user-2',
      date: '2024-01-02',
      content: 'Content 2',
      likes: [],
      dislikes: ['user-1']
    }
  ]

  describe('Rendering with articles', () => {
    it('should render all articles', () => {
      // Arrange & Act
      render(<ArticlesListPresenter articles={mockArticles} isAuthenticated={false} />)

      // Assert
      expect(screen.getByText('Test Article 1')).toBeInTheDocument()
      expect(screen.getByText('Test Article 2')).toBeInTheDocument()
    })

    it('should display article metadata', () => {
      // Arrange & Act
      render(<ArticlesListPresenter articles={mockArticles} isAuthenticated={false} />)

      // Assert
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('2024-01-01')).toBeInTheDocument()
      expect(screen.getByText('2024-01-02')).toBeInTheDocument()
    })

    it('should render correct number of cards', () => {
      // Arrange & Act
      const { getAllByTestId } = render(<ArticlesListPresenter articles={mockArticles} isAuthenticated={false} />)

      // Assert
      const cards = getAllByTestId('card')
      expect(cards).toHaveLength(2)
    })

    it('should render links to article details', () => {
      // Arrange & Act
      render(<ArticlesListPresenter articles={mockArticles} isAuthenticated={false} />)

      // Assert
      const links = screen.getAllByRole('link')
      expect(links.some(link => link.getAttribute('href')?.includes('/articles/1'))).toBe(true)
      expect(links.some(link => link.getAttribute('href')?.includes('/articles/2'))).toBe(true)
    })
  })

  describe('Rendering without articles', () => {
    it('should render empty grid when no articles', () => {
      // Arrange & Act
      render(<ArticlesListPresenter articles={[]} isAuthenticated={false} />)

      // Assert
      expect(screen.getAllByText('Articles')).toHaveLength(2)
    })

    it('should not render any cards when empty', () => {
      // Arrange & Act
      const { queryAllByTestId } = render(<ArticlesListPresenter articles={[]} isAuthenticated={false} />)

      // Assert
      const cards = queryAllByTestId('card')
      expect(cards).toHaveLength(0)
    })
  })

  describe('Article content display', () => {
    it('should truncate long content', () => {
      // Arrange
      const longContentArticles: Article[] = [{
        id: '1',
        title: 'Long Article',
        author: 'Author',
        authorId: 'user-1',
        date: '2024-01-01',
        content: 'A'.repeat(200),
        likes: [],
        dislikes: []
      }]

      // Act
      const { container } = render(<ArticlesListPresenter articles={longContentArticles} isAuthenticated={false} />)

      // Assert
      const contentText = container.querySelector('p:last-child')
      expect(contentText?.textContent?.length).toBeLessThanOrEqual(100)
    })

    it('should display full short content', () => {
      // Arrange
      const shortContentArticles: Article[] = [{
        id: '1',
        title: 'Short Article',
        author: 'Author',
        authorId: 'user-1',
        date: '2024-01-01',
        content: 'Short content here',
        likes: [],
        dislikes: []
      }]

      // Act
      render(<ArticlesListPresenter articles={shortContentArticles} isAuthenticated={false} />)

      // Assert
      expect(screen.getByText('Short content here')).toBeInTheDocument()
    })
  })

  describe('Multiple articles handling', () => {
    it('should render large number of articles', () => {
      // Arrange
      const manyArticles: Article[] = Array.from({ length: 10 }, (_, i) => ({
        id: `${i}`,
        title: `Article ${i}`,
        author: `Author ${i}`,
        authorId: `user-${i}`,
        date: '2024-01-01',
        content: `Content ${i}`,
        likes: [],
        dislikes: []
      }))

      // Act
      const { getAllByTestId } = render(<ArticlesListPresenter articles={manyArticles} isAuthenticated={false} />)

      // Assert
      const cards = getAllByTestId('card')
      expect(cards).toHaveLength(10)
    })

    it('should maintain order of articles', () => {
      // Arrange & Act
      render(<ArticlesListPresenter articles={mockArticles} isAuthenticated={false} />)

      // Assert
      const titles = screen.getAllByText(/Test Article \d/)
      expect(titles[0]).toHaveTextContent('Test Article 1')
      expect(titles[1]).toHaveTextContent('Test Article 2')
    })
  })

  describe('Authentication state', () => {
    it('should show create button when authenticated', () => {
      // Arrange & Act
      render(<ArticlesListPresenter articles={mockArticles} isAuthenticated={true} />)

      // Assert
      const buttonLinks = screen.getAllByTestId('button-link')
      expect(buttonLinks).toHaveLength(2)
      const labels = screen.getAllByText('+ Créer un article')
      expect(labels).toHaveLength(2)
    })

    it('should not show create button when not authenticated', () => {
      // Arrange & Act
      const { queryByTestId } = render(<ArticlesListPresenter articles={mockArticles} isAuthenticated={false} />)

      // Assert
      expect(queryByTestId('button-link')).not.toBeInTheDocument()
    })
  })
})
