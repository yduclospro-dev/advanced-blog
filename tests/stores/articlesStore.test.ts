import { act } from '@testing-library/react'
import { useArticleStore } from '@/stores/articlesStore'
import { Article } from '@/types/Article'

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('useArticleStore', () => {
  beforeEach(() => {
    useArticleStore.setState({ articles: [] })
    jest.clearAllMocks()
  })

  afterEach(() => {
    useArticleStore.setState({ articles: [] })
  })

  describe('addArticle', () => {
    it('should add a new article with generated id, date, and empty likes/dislikes', () => {
      // Arrange
      const newArticleData = {
        title: 'Test Article',
        author: 'John Doe',
        authorId: 'user-1',
        content: 'This is test content'
      }
      
      // Act
      act(() => {
        useArticleStore.getState().addArticle(newArticleData)
      })
      
      // Assert
      const articles = useArticleStore.getState().articles
      expect(articles).toHaveLength(1)
      expect(articles[0]).toMatchObject(newArticleData)
      expect(articles[0].id).toBeDefined()
      expect(articles[0].date).toBeDefined()
      expect(articles[0].likes).toEqual([])
      expect(articles[0].dislikes).toEqual([])
    })

    it('should add multiple articles with unique ids', () => {
      // Arrange
      const article1 = {
        title: 'Article 1',
        author: 'John Doe',
        authorId: 'user-1',
        content: 'Content 1'
      }
      const article2 = {
        title: 'Article 2',
        author: 'Jane Doe',
        authorId: 'user-2',
        content: 'Content 2'
      }
      
      // Act
      act(() => {
        useArticleStore.getState().addArticle(article1)
        useArticleStore.getState().addArticle(article2)
      })
      
      // Assert
      const articles = useArticleStore.getState().articles
      expect(articles).toHaveLength(2)
      expect(articles[0].id).not.toBe(articles[1].id)
    })
  })

  describe('updateArticle', () => {
    it('should update an existing article', () => {
      // Arrange
      const article: Article = {
        id: 'article-1',
        title: 'Original Title',
        author: 'John Doe',
        authorId: 'user-1',
        date: '2024-01-01',
        content: 'Original content',
        likes: [],
        dislikes: []
      }
      useArticleStore.setState({ articles: [article] })
      
      const updatedData = {
        title: 'Updated Title',
        content: 'Updated content'
      }
      
      // Act
      act(() => {
        useArticleStore.getState().updateArticle('article-1', updatedData)
      })
      
      // Assert
      const articles = useArticleStore.getState().articles
      expect(articles).toHaveLength(1)
      expect(articles[0].title).toBe('Updated Title')
      expect(articles[0].content).toBe('Updated content')
      expect(articles[0].id).toBe('article-1')
    })

    it('should not affect other articles when updating one', () => {
      // Arrange
      const article1: Article = {
        id: 'article-1',
        title: 'Article 1',
        author: 'John Doe',
        authorId: 'user-1',
        date: '2024-01-01',
        content: 'Content 1',
        likes: [],
        dislikes: []
      }
      const article2: Article = {
        id: 'article-2',
        title: 'Article 2',
        author: 'Jane Doe',
        authorId: 'user-2',
        date: '2024-01-02',
        content: 'Content 2',
        likes: [],
        dislikes: []
      }
      useArticleStore.setState({ articles: [article1, article2] })
      
      const updatedData = {
        title: 'Updated Article 1'
      }
      
      // Act
      act(() => {
        useArticleStore.getState().updateArticle('article-1', updatedData)
      })
      
      // Assert
      const articles = useArticleStore.getState().articles
      expect(articles).toHaveLength(2)
      expect(articles[0].title).toBe('Updated Article 1')
      expect(articles[1].title).toBe('Article 2')
    })
  })

  describe('deleteArticle', () => {
    it('should delete an article by id', () => {
      // Arrange
      const article1: Article = {
        id: 'article-1',
        title: 'Article 1',
        author: 'John Doe',
        authorId: 'user-1',
        date: '2024-01-01',
        content: 'Content 1',
        likes: [],
        dislikes: []
      }
      const article2: Article = {
        id: 'article-2',
        title: 'Article 2',
        author: 'Jane Doe',
        authorId: 'user-2',
        date: '2024-01-02',
        content: 'Content 2',
        likes: [],
        dislikes: []
      }
      useArticleStore.setState({ articles: [article1, article2] })
      
      // Act
      act(() => {
        useArticleStore.getState().deleteArticle('article-1')
      })
      
      // Assert
      const articles = useArticleStore.getState().articles
      expect(articles).toHaveLength(1)
      expect(articles[0].id).toBe('article-2')
    })

    it('should do nothing when deleting non-existent article', () => {
      // Arrange
      const article: Article = {
        id: 'article-1',
        title: 'Article 1',
        author: 'John Doe',
        authorId: 'user-1',
        date: '2024-01-01',
        content: 'Content 1',
        likes: [],
        dislikes: []
      }
      useArticleStore.setState({ articles: [article] })
      
      // Act
      act(() => {
        useArticleStore.getState().deleteArticle('non-existent-id')
      })
      
      // Assert
      const articles = useArticleStore.getState().articles
      expect(articles).toHaveLength(1)
      expect(articles[0].id).toBe('article-1')
    })
  })

  describe('getArticleById', () => {
    it('should return article when id exists', () => {
      // Arrange
      const article: Article = {
        id: 'article-1',
        title: 'Test Article',
        author: 'John Doe',
        authorId: 'user-1',
        date: '2024-01-01',
        content: 'Content',
        likes: [],
        dislikes: []
      }
      useArticleStore.setState({ articles: [article] })
      
      // Act
      const foundArticle = useArticleStore.getState().getArticleById('article-1')
      
      // Assert
      expect(foundArticle).toEqual(article)
    })

    it('should return undefined when id does not exist', () => {
      // Arrange
      useArticleStore.setState({ articles: [] })
      
      // Act
      const foundArticle = useArticleStore.getState().getArticleById('non-existent-id')
      
      // Assert
      expect(foundArticle).toBeUndefined()
    })
  })

  describe('getLatestArticles', () => {
    it('should return articles sorted by date descending', () => {
      // Arrange
      const article1: Article = {
        id: 'article-1',
        title: 'Old Article',
        author: 'John Doe',
        authorId: 'user-1',
        date: '2024-01-01',
        content: 'Content 1',
        likes: [],
        dislikes: []
      }
      const article2: Article = {
        id: 'article-2',
        title: 'Recent Article',
        author: 'Jane Doe',
        authorId: 'user-2',
        date: '2024-12-31',
        content: 'Content 2',
        likes: [],
        dislikes: []
      }
      const article3: Article = {
        id: 'article-3',
        title: 'Middle Article',
        author: 'Bob Smith',
        authorId: 'user-3',
        date: '2024-06-15',
        content: 'Content 3',
        likes: [],
        dislikes: []
      }
      useArticleStore.setState({ articles: [article1, article2, article3] })
      
      // Act
      const latestArticles = useArticleStore.getState().getLatestArticles(3)
      
      // Assert
      expect(latestArticles).toHaveLength(3)
      expect(latestArticles[0].id).toBe('article-2')
      expect(latestArticles[1].id).toBe('article-3')
      expect(latestArticles[2].id).toBe('article-1')
    })

    it('should limit results to specified count', () => {
      // Arrange
      const articles: Article[] = Array.from({ length: 5 }, (_, i) => ({
        id: `article-${i}`,
        title: `Article ${i}`,
        author: 'John Doe',
        authorId: 'user-1',
        date: `2024-01-0${i + 1}`,
        content: `Content ${i}`,
        likes: [],
        dislikes: []
      }))
      useArticleStore.setState({ articles })
      
      // Act
      const latestArticles = useArticleStore.getState().getLatestArticles(3)
      
      // Assert
      expect(latestArticles).toHaveLength(3)
    })

    it('should return all articles when limit exceeds count', () => {
      // Arrange
      const articles: Article[] = Array.from({ length: 2 }, (_, i) => ({
        id: `article-${i}`,
        title: `Article ${i}`,
        author: 'John Doe',
        authorId: 'user-1',
        date: `2024-01-0${i + 1}`,
        content: `Content ${i}`,
        likes: [],
        dislikes: []
      }))
      useArticleStore.setState({ articles })
      
      // Act
      const latestArticles = useArticleStore.getState().getLatestArticles(5)
      
      // Assert
      expect(latestArticles).toHaveLength(2)
    })

    it('should return empty array when no articles exist', () => {
      // Arrange
      useArticleStore.setState({ articles: [] })
      
      // Act
      const latestArticles = useArticleStore.getState().getLatestArticles(3)
      
      // Assert
      expect(latestArticles).toEqual([])
    })
  })

  describe('toggleArticleLike', () => {
    it('should add user to likes when not already liked', () => {
      // Arrange
      const article: Article = {
        id: 'article-1',
        title: 'Test Article',
        author: 'John Doe',
        authorId: 'user-1',
        date: '2024-01-01',
        content: 'Content',
        likes: [],
        dislikes: []
      }
      useArticleStore.setState({ articles: [article] })
      
      // Act
      act(() => {
        useArticleStore.getState().toggleArticleLike('article-1', 'user-2')
      })
      
      // Assert
      const articles = useArticleStore.getState().articles
      expect(articles[0].likes).toEqual(['user-2'])
      expect(articles[0].dislikes).toEqual([])
    })

    it('should remove user from likes when already liked', () => {
      // Arrange
      const article: Article = {
        id: 'article-1',
        title: 'Test Article',
        author: 'John Doe',
        authorId: 'user-1',
        date: '2024-01-01',
        content: 'Content',
        likes: ['user-2'],
        dislikes: []
      }
      useArticleStore.setState({ articles: [article] })
      
      // Act
      act(() => {
        useArticleStore.getState().toggleArticleLike('article-1', 'user-2')
      })
      
      // Assert
      const articles = useArticleStore.getState().articles
      expect(articles[0].likes).toEqual([])
      expect(articles[0].dislikes).toEqual([])
    })

    it('should remove user from dislikes when adding like', () => {
      // Arrange
      const article: Article = {
        id: 'article-1',
        title: 'Test Article',
        author: 'John Doe',
        authorId: 'user-1',
        date: '2024-01-01',
        content: 'Content',
        likes: [],
        dislikes: ['user-2']
      }
      useArticleStore.setState({ articles: [article] })
      
      // Act
      act(() => {
        useArticleStore.getState().toggleArticleLike('article-1', 'user-2')
      })
      
      // Assert
      const articles = useArticleStore.getState().articles
      expect(articles[0].likes).toEqual(['user-2'])
      expect(articles[0].dislikes).toEqual([])
    })

    it('should not affect other articles', () => {
      // Arrange
      const article1: Article = {
        id: 'article-1',
        title: 'Article 1',
        author: 'John Doe',
        authorId: 'user-1',
        date: '2024-01-01',
        content: 'Content 1',
        likes: [],
        dislikes: []
      }
      const article2: Article = {
        id: 'article-2',
        title: 'Article 2',
        author: 'Jane Doe',
        authorId: 'user-2',
        date: '2024-01-02',
        content: 'Content 2',
        likes: [],
        dislikes: []
      }
      useArticleStore.setState({ articles: [article1, article2] })
      
      // Act
      act(() => {
        useArticleStore.getState().toggleArticleLike('article-1', 'user-3')
      })
      
      // Assert
      const articles = useArticleStore.getState().articles
      expect(articles[0].likes).toEqual(['user-3'])
      expect(articles[1].likes).toEqual([])
    })
  })

  describe('toggleArticleDislike', () => {
    it('should add user to dislikes when not already disliked', () => {
      // Arrange
      const article: Article = {
        id: 'article-1',
        title: 'Test Article',
        author: 'John Doe',
        authorId: 'user-1',
        date: '2024-01-01',
        content: 'Content',
        likes: [],
        dislikes: []
      }
      useArticleStore.setState({ articles: [article] })
      
      // Act
      act(() => {
        useArticleStore.getState().toggleArticleDislike('article-1', 'user-2')
      })
      
      // Assert
      const articles = useArticleStore.getState().articles
      expect(articles[0].likes).toEqual([])
      expect(articles[0].dislikes).toEqual(['user-2'])
    })

    it('should remove user from dislikes when already disliked', () => {
      // Arrange
      const article: Article = {
        id: 'article-1',
        title: 'Test Article',
        author: 'John Doe',
        authorId: 'user-1',
        date: '2024-01-01',
        content: 'Content',
        likes: [],
        dislikes: ['user-2']
      }
      useArticleStore.setState({ articles: [article] })
      
      // Act
      act(() => {
        useArticleStore.getState().toggleArticleDislike('article-1', 'user-2')
      })
      
      // Assert
      const articles = useArticleStore.getState().articles
      expect(articles[0].likes).toEqual([])
      expect(articles[0].dislikes).toEqual([])
    })

    it('should remove user from likes when adding dislike', () => {
      // Arrange
      const article: Article = {
        id: 'article-1',
        title: 'Test Article',
        author: 'John Doe',
        authorId: 'user-1',
        date: '2024-01-01',
        content: 'Content',
        likes: ['user-2'],
        dislikes: []
      }
      useArticleStore.setState({ articles: [article] })
      
      // Act
      act(() => {
        useArticleStore.getState().toggleArticleDislike('article-1', 'user-2')
      })
      
      // Assert
      const articles = useArticleStore.getState().articles
      expect(articles[0].likes).toEqual([])
      expect(articles[0].dislikes).toEqual(['user-2'])
    })

    it('should not affect other articles', () => {
      // Arrange
      const article1: Article = {
        id: 'article-1',
        title: 'Article 1',
        author: 'John Doe',
        authorId: 'user-1',
        date: '2024-01-01',
        content: 'Content 1',
        likes: [],
        dislikes: []
      }
      const article2: Article = {
        id: 'article-2',
        title: 'Article 2',
        author: 'Jane Doe',
        authorId: 'user-2',
        date: '2024-01-02',
        content: 'Content 2',
        likes: [],
        dislikes: []
      }
      useArticleStore.setState({ articles: [article1, article2] })
      
      // Act
      act(() => {
        useArticleStore.getState().toggleArticleDislike('article-1', 'user-3')
      })
      
      // Assert
      const articles = useArticleStore.getState().articles
      expect(articles[0].dislikes).toEqual(['user-3'])
      expect(articles[1].dislikes).toEqual([])
    })
  })

  describe('like/dislike mutual exclusivity', () => {
    it('should maintain mutual exclusivity through multiple toggles', () => {
      // Arrange
      const article: Article = {
        id: 'article-1',
        title: 'Test Article',
        author: 'John Doe',
        authorId: 'user-1',
        date: '2024-01-01',
        content: 'Content',
        likes: [],
        dislikes: []
      }
      useArticleStore.setState({ articles: [article] })
      
      // Act & Assert
      act(() => {
        useArticleStore.getState().toggleArticleLike('article-1', 'user-2')
      })
      expect(useArticleStore.getState().articles[0].likes).toEqual(['user-2'])
      expect(useArticleStore.getState().articles[0].dislikes).toEqual([])
      
      // Act & Assert
      act(() => {
        useArticleStore.getState().toggleArticleDislike('article-1', 'user-2')
      })
      expect(useArticleStore.getState().articles[0].likes).toEqual([])
      expect(useArticleStore.getState().articles[0].dislikes).toEqual(['user-2'])
      
      // Act & Assert
      act(() => {
        useArticleStore.getState().toggleArticleLike('article-1', 'user-2')
      })
      expect(useArticleStore.getState().articles[0].likes).toEqual(['user-2'])
      expect(useArticleStore.getState().articles[0].dislikes).toEqual([])
      
      // Act & Assert
      act(() => {
        useArticleStore.getState().toggleArticleLike('article-1', 'user-2')
      })
      expect(useArticleStore.getState().articles[0].likes).toEqual([])
      expect(useArticleStore.getState().articles[0].dislikes).toEqual([])
    })

    it('should handle multiple users with different reactions', () => {
      // Arrange
      const article: Article = {
        id: 'article-1',
        title: 'Test Article',
        author: 'John Doe',
        authorId: 'user-1',
        date: '2024-01-01',
        content: 'Content',
        likes: [],
        dislikes: []
      }
      useArticleStore.setState({ articles: [article] })
      
      // Act
      act(() => {
        useArticleStore.getState().toggleArticleLike('article-1', 'user-2')
        useArticleStore.getState().toggleArticleLike('article-1', 'user-3')
        useArticleStore.getState().toggleArticleDislike('article-1', 'user-4')
      })
      
      // Assert
      const articles = useArticleStore.getState().articles
      expect(articles[0].likes).toEqual(['user-2', 'user-3'])
      expect(articles[0].dislikes).toEqual(['user-4'])
    })
  })
})
