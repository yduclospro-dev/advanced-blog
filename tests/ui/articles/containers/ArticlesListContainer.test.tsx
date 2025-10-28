import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ArticlesListContainer from '@/components/articles/containers/ArticlesListContainer'
import { Article } from '@/types/Article'

const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Article 1',
    content: 'Content 1',
    author: 'User1',
    authorId: 'user1',
    date: '2024-01-01',
    likes: [],
    dislikes: []
  },
  {
    id: '2',
    title: 'Article 2',
    content: 'Content 2',
    author: 'User2',
    authorId: 'user2',
    date: '2024-01-02',
    likes: [],
    dislikes: []
  }
]

const mockArticleStore = {
  articles: mockArticles
}

const mockUserStore = {
  isAuthenticated: true
}

jest.mock('@/stores/articlesStore', () => ({
  useArticleStore: () => mockArticleStore
}))

jest.mock('@/stores/userStore', () => ({
  useUserStore: () => mockUserStore
}))

jest.mock('@/components/articles/presenters/ArticlesListPresenter', () => ({
  __esModule: true,
  default: ({ articles, isAuthenticated }: { articles: Article[]; isAuthenticated: boolean }) => (
    <div data-testid="articles-list-presenter">
      <div data-testid="articles-count">{articles.length}</div>
      <div data-testid="is-authenticated">{isAuthenticated ? 'authenticated' : 'not-authenticated'}</div>
      {articles.map(article => (
        <div key={article.id} data-testid={`article-${article.id}`}>
          {article.title}
        </div>
      ))}
    </div>
  )
}))

describe('ArticlesListContainer', () => {
  beforeEach(() => {
    mockArticleStore.articles = mockArticles
    mockUserStore.isAuthenticated = true
  })

  describe('Rendering', () => {
    it('should render ArticlesListPresenter', () => {
      // Arrange & Act
      render(<ArticlesListContainer />)

      // Assert
      expect(screen.getByTestId('articles-list-presenter')).toBeInTheDocument()
    })
  })

  describe('Articles data', () => {
    it('should pass articles to presenter', () => {
      // Arrange & Act
      render(<ArticlesListContainer />)

      // Assert
      expect(screen.getByTestId('articles-count')).toHaveTextContent('2')
      expect(screen.getByTestId('article-1')).toHaveTextContent('Article 1')
      expect(screen.getByTestId('article-2')).toHaveTextContent('Article 2')
    })

    it('should handle empty articles array', () => {
      // Arrange
      mockArticleStore.articles = []

      // Act
      render(<ArticlesListContainer />)

      // Assert
      expect(screen.getByTestId('articles-count')).toHaveTextContent('0')
    })

    it('should handle single article', () => {
      // Arrange
      mockArticleStore.articles = [mockArticles[0]]

      // Act
      render(<ArticlesListContainer />)

      // Assert
      expect(screen.getByTestId('articles-count')).toHaveTextContent('1')
      expect(screen.getByTestId('article-1')).toBeInTheDocument()
    })

    it('should handle multiple articles', () => {
      // Arrange
      const manyArticles = [
        ...mockArticles,
        { ...mockArticles[0], id: '3', title: 'Article 3' },
        { ...mockArticles[0], id: '4', title: 'Article 4' },
        { ...mockArticles[0], id: '5', title: 'Article 5' }
      ]
      mockArticleStore.articles = manyArticles

      // Act
      render(<ArticlesListContainer />)

      // Assert
      expect(screen.getByTestId('articles-count')).toHaveTextContent('5')
    })
  })

  describe('Authentication state', () => {
    it('should pass authentication status to presenter when authenticated', () => {
      // Arrange
      mockUserStore.isAuthenticated = true

      // Act
      render(<ArticlesListContainer />)

      // Assert
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('authenticated')
    })

    it('should pass authentication status to presenter when not authenticated', () => {
      // Arrange
      mockUserStore.isAuthenticated = false

      // Act
      render(<ArticlesListContainer />)

      // Assert
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('not-authenticated')
    })
  })

  describe('Data updates', () => {
    it('should reflect store updates', () => {
      // Arrange
      const { rerender } = render(<ArticlesListContainer />)
      expect(screen.getByTestId('articles-count')).toHaveTextContent('2')

      // Act
      mockArticleStore.articles = [...mockArticles, { ...mockArticles[0], id: '3' }]
      rerender(<ArticlesListContainer />)

      // Assert
      expect(screen.getByTestId('articles-count')).toHaveTextContent('3')
    })

    it('should reflect authentication changes', () => {
      // Arrange
      const { rerender } = render(<ArticlesListContainer />)
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('authenticated')

      // Act
      mockUserStore.isAuthenticated = false
      rerender(<ArticlesListContainer />)

      // Assert
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('not-authenticated')
    })
  })

  describe('Edge cases', () => {
    it('should handle articles with special characters in title', () => {
      // Arrange
      const specialArticles = [{
        ...mockArticles[0],
        id: 'special',
        title: 'Article <>&" with special chars'
      }]
      mockArticleStore.articles = specialArticles

      // Act
      render(<ArticlesListContainer />)

      // Assert
      expect(screen.getByTestId('article-special')).toHaveTextContent('Article <>&" with special chars')
    })

    it('should handle articles with empty title', () => {
      // Arrange
      const emptyTitleArticles = [{
        ...mockArticles[0],
        title: ''
      }]
      mockArticleStore.articles = emptyTitleArticles

      // Act
      render(<ArticlesListContainer />)

      // Assert
      expect(screen.getByTestId('articles-count')).toHaveTextContent('1')
    })

    it('should handle articles with very long title', () => {
      // Arrange
      const longTitle = 'A'.repeat(500)
      const longTitleArticles = [{
        ...mockArticles[0],
        title: longTitle
      }]
      mockArticleStore.articles = longTitleArticles

      // Act
      render(<ArticlesListContainer />)

      // Assert
      expect(screen.getByTestId('article-1')).toHaveTextContent(longTitle)
    })
  })

  describe('Integration', () => {
    it('should work with authenticated user and articles', () => {
      // Arrange
      mockArticleStore.articles = mockArticles
      mockUserStore.isAuthenticated = true

      // Act
      render(<ArticlesListContainer />)

      // Assert
      expect(screen.getByTestId('articles-list-presenter')).toBeInTheDocument()
      expect(screen.getByTestId('articles-count')).toHaveTextContent('2')
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('authenticated')
    })

    it('should work with unauthenticated user and articles', () => {
      // Arrange
      mockArticleStore.articles = mockArticles
      mockUserStore.isAuthenticated = false

      // Act
      render(<ArticlesListContainer />)

      // Assert
      expect(screen.getByTestId('articles-list-presenter')).toBeInTheDocument()
      expect(screen.getByTestId('articles-count')).toHaveTextContent('2')
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('not-authenticated')
    })

    it('should work with authenticated user and no articles', () => {
      // Arrange
      mockArticleStore.articles = []
      mockUserStore.isAuthenticated = true

      // Act
      render(<ArticlesListContainer />)

      // Assert
      expect(screen.getByTestId('articles-list-presenter')).toBeInTheDocument()
      expect(screen.getByTestId('articles-count')).toHaveTextContent('0')
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('authenticated')
    })
  })
})
