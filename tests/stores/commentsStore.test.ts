import { act } from '@testing-library/react'
import { useCommentsStore } from '@/stores/commentsStore'
import { Comment } from '@/types/Comment'

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('useCommentsStore', () => {
  beforeEach(() => {
    useCommentsStore.setState({ comments: [] })
    jest.clearAllMocks()
  })

  afterEach(() => {
    useCommentsStore.setState({ comments: [] })
  })

  describe('addComment', () => {
    it('should add a new comment with generated id, date, and empty likes/dislikes', () => {
      // Arrange
      const newCommentData = {
        articleId: 'article-1',
        authorId: 'user-1',
        authorName: 'John Doe',
        content: 'This is a test comment'
      }
      
      // Act
      act(() => {
        useCommentsStore.getState().addComment(newCommentData)
      })
      
      // Assert
      const comments = useCommentsStore.getState().comments
      expect(comments).toHaveLength(1)
      expect(comments[0]).toMatchObject(newCommentData)
      expect(comments[0].id).toBeDefined()
      expect(comments[0].date).toBeDefined()
      expect(comments[0].likes).toEqual([])
      expect(comments[0].dislikes).toEqual([])
    })

    it('should add multiple comments with unique ids', () => {
      // Arrange
      const comment1 = {
        articleId: 'article-1',
        authorId: 'user-1',
        authorName: 'John Doe',
        content: 'Comment 1'
      }
      const comment2 = {
        articleId: 'article-1',
        authorId: 'user-2',
        authorName: 'Jane Doe',
        content: 'Comment 2'
      }
      
      // Act
      act(() => {
        useCommentsStore.getState().addComment(comment1)
        useCommentsStore.getState().addComment(comment2)
      })
      
      // Assert
      const comments = useCommentsStore.getState().comments
      expect(comments).toHaveLength(2)
      expect(comments[0].id).not.toBe(comments[1].id)
    })
  })

  describe('updateComment', () => {
    it('should update an existing comment', () => {
      // Arrange
      const comment: Comment = {
        id: 'comment-1',
        articleId: 'article-1',
        authorId: 'user-1',
        authorName: 'John Doe',
        date: '2024-01-01T10:00:00.000Z',
        content: 'Original content',
        likes: [],
        dislikes: []
      }
      useCommentsStore.setState({ comments: [comment] })
      
      // Act
      act(() => {
        useCommentsStore.getState().updateComment('comment-1', 'Updated content')
      })
      
      // Assert
      const comments = useCommentsStore.getState().comments
      expect(comments).toHaveLength(1)
      expect(comments[0].content).toBe('Updated content')
      expect(comments[0].id).toBe('comment-1')
    })

    it('should not affect other comments when updating one', () => {
      // Arrange
      const comment1: Comment = {
        id: 'comment-1',
        articleId: 'article-1',
        authorId: 'user-1',
        authorName: 'John Doe',
        date: '2024-01-01T10:00:00.000Z',
        content: 'Comment 1',
        likes: [],
        dislikes: []
      }
      const comment2: Comment = {
        id: 'comment-2',
        articleId: 'article-1',
        authorId: 'user-2',
        authorName: 'Jane Doe',
        date: '2024-01-01T11:00:00.000Z',
        content: 'Comment 2',
        likes: [],
        dislikes: []
      }
      useCommentsStore.setState({ comments: [comment1, comment2] })
      
      // Act
      act(() => {
        useCommentsStore.getState().updateComment('comment-1', 'Updated Comment 1')
      })
      
      // Assert
      const comments = useCommentsStore.getState().comments
      expect(comments).toHaveLength(2)
      expect(comments[0].content).toBe('Updated Comment 1')
      expect(comments[1].content).toBe('Comment 2')
    })
  })

  describe('deleteComment', () => {
    it('should delete a comment by id', () => {
      // Arrange
      const comment1: Comment = {
        id: 'comment-1',
        articleId: 'article-1',
        authorId: 'user-1',
        authorName: 'John Doe',
        date: '2024-01-01T10:00:00.000Z',
        content: 'Comment 1',
        likes: [],
        dislikes: []
      }
      const comment2: Comment = {
        id: 'comment-2',
        articleId: 'article-1',
        authorId: 'user-2',
        authorName: 'Jane Doe',
        date: '2024-01-01T11:00:00.000Z',
        content: 'Comment 2',
        likes: [],
        dislikes: []
      }
      useCommentsStore.setState({ comments: [comment1, comment2] })
      
      // Act
      act(() => {
        useCommentsStore.getState().deleteComment('comment-1')
      })
      
      // Assert
      const comments = useCommentsStore.getState().comments
      expect(comments).toHaveLength(1)
      expect(comments[0].id).toBe('comment-2')
    })

    it('should do nothing when deleting non-existent comment', () => {
      // Arrange
      const comment: Comment = {
        id: 'comment-1',
        articleId: 'article-1',
        authorId: 'user-1',
        authorName: 'John Doe',
        date: '2024-01-01T10:00:00.000Z',
        content: 'Comment 1',
        likes: [],
        dislikes: []
      }
      useCommentsStore.setState({ comments: [comment] })
      
      // Act
      act(() => {
        useCommentsStore.getState().deleteComment('non-existent-id')
      })
      
      // Assert
      const comments = useCommentsStore.getState().comments
      expect(comments).toHaveLength(1)
      expect(comments[0].id).toBe('comment-1')
    })
  })

  describe('getCommentsByArticle', () => {
    it('should return comments for specific article', () => {
      // Arrange
      const comment1: Comment = {
        id: 'comment-1',
        articleId: 'article-1',
        authorId: 'user-1',
        authorName: 'John Doe',
        date: '2024-01-01T10:00:00.000Z',
        content: 'Comment for article 1',
        likes: [],
        dislikes: []
      }
      const comment2: Comment = {
        id: 'comment-2',
        articleId: 'article-2',
        authorId: 'user-2',
        authorName: 'Jane Doe',
        date: '2024-01-01T11:00:00.000Z',
        content: 'Comment for article 2',
        likes: [],
        dislikes: []
      }
      useCommentsStore.setState({ comments: [comment1, comment2] })
      
      // Act
      const articleComments = useCommentsStore.getState().getCommentsByArticle('article-1')
      
      // Assert
      expect(articleComments).toHaveLength(1)
      expect(articleComments[0].id).toBe('comment-1')
    })

    it('should return empty array when no comments for article', () => {
      // Arrange
      useCommentsStore.setState({ comments: [] })
      
      // Act
      const articleComments = useCommentsStore.getState().getCommentsByArticle('article-1')
      
      // Assert
      expect(articleComments).toEqual([])
    })

    it('should return multiple comments for the same article', () => {
      // Arrange
      const comment1: Comment = {
        id: 'comment-1',
        articleId: 'article-1',
        authorId: 'user-1',
        authorName: 'John Doe',
        date: '2024-01-01T10:00:00.000Z',
        content: 'Comment 1',
        likes: [],
        dislikes: []
      }
      const comment2: Comment = {
        id: 'comment-2',
        articleId: 'article-1',
        authorId: 'user-2',
        authorName: 'Jane Doe',
        date: '2024-01-01T11:00:00.000Z',
        content: 'Comment 2',
        likes: [],
        dislikes: []
      }
      useCommentsStore.setState({ comments: [comment1, comment2] })
      
      // Act
      const articleComments = useCommentsStore.getState().getCommentsByArticle('article-1')
      
      // Assert
      expect(articleComments).toHaveLength(2)
    })
  })

  describe('toggleCommentLike', () => {
    it('should add user to likes when not already liked', () => {
      // Arrange
      const comment: Comment = {
        id: 'comment-1',
        articleId: 'article-1',
        authorId: 'user-1',
        authorName: 'John Doe',
        date: '2024-01-01T10:00:00.000Z',
        content: 'Comment',
        likes: [],
        dislikes: []
      }
      useCommentsStore.setState({ comments: [comment] })
      
      // Act
      act(() => {
        useCommentsStore.getState().toggleCommentLike('comment-1', 'user-2')
      })
      
      // Assert
      const comments = useCommentsStore.getState().comments
      expect(comments[0].likes).toEqual(['user-2'])
      expect(comments[0].dislikes).toEqual([])
    })

    it('should remove user from likes when already liked', () => {
      // Arrange
      const comment: Comment = {
        id: 'comment-1',
        articleId: 'article-1',
        authorId: 'user-1',
        authorName: 'John Doe',
        date: '2024-01-01T10:00:00.000Z',
        content: 'Comment',
        likes: ['user-2'],
        dislikes: []
      }
      useCommentsStore.setState({ comments: [comment] })
      
      // Act
      act(() => {
        useCommentsStore.getState().toggleCommentLike('comment-1', 'user-2')
      })
      
      // Assert
      const comments = useCommentsStore.getState().comments
      expect(comments[0].likes).toEqual([])
      expect(comments[0].dislikes).toEqual([])
    })

    it('should remove user from dislikes when adding like', () => {
      // Arrange
      const comment: Comment = {
        id: 'comment-1',
        articleId: 'article-1',
        authorId: 'user-1',
        authorName: 'John Doe',
        date: '2024-01-01T10:00:00.000Z',
        content: 'Comment',
        likes: [],
        dislikes: ['user-2']
      }
      useCommentsStore.setState({ comments: [comment] })
      
      // Act
      act(() => {
        useCommentsStore.getState().toggleCommentLike('comment-1', 'user-2')
      })
      
      // Assert
      const comments = useCommentsStore.getState().comments
      expect(comments[0].likes).toEqual(['user-2'])
      expect(comments[0].dislikes).toEqual([])
    })

    it('should not affect other comments', () => {
      // Arrange
      const comment1: Comment = {
        id: 'comment-1',
        articleId: 'article-1',
        authorId: 'user-1',
        authorName: 'John Doe',
        date: '2024-01-01T10:00:00.000Z',
        content: 'Comment 1',
        likes: [],
        dislikes: []
      }
      const comment2: Comment = {
        id: 'comment-2',
        articleId: 'article-1',
        authorId: 'user-2',
        authorName: 'Jane Doe',
        date: '2024-01-01T11:00:00.000Z',
        content: 'Comment 2',
        likes: [],
        dislikes: []
      }
      useCommentsStore.setState({ comments: [comment1, comment2] })
      
      // Act
      act(() => {
        useCommentsStore.getState().toggleCommentLike('comment-1', 'user-3')
      })
      
      // Assert
      const comments = useCommentsStore.getState().comments
      expect(comments[0].likes).toEqual(['user-3'])
      expect(comments[1].likes).toEqual([])
    })
  })

  describe('toggleCommentDislike', () => {
    it('should add user to dislikes when not already disliked', () => {
      // Arrange
      const comment: Comment = {
        id: 'comment-1',
        articleId: 'article-1',
        authorId: 'user-1',
        authorName: 'John Doe',
        date: '2024-01-01T10:00:00.000Z',
        content: 'Comment',
        likes: [],
        dislikes: []
      }
      useCommentsStore.setState({ comments: [comment] })
      
      // Act
      act(() => {
        useCommentsStore.getState().toggleCommentDislike('comment-1', 'user-2')
      })
      
      // Assert
      const comments = useCommentsStore.getState().comments
      expect(comments[0].likes).toEqual([])
      expect(comments[0].dislikes).toEqual(['user-2'])
    })

    it('should remove user from dislikes when already disliked', () => {
      // Arrange
      const comment: Comment = {
        id: 'comment-1',
        articleId: 'article-1',
        authorId: 'user-1',
        authorName: 'John Doe',
        date: '2024-01-01T10:00:00.000Z',
        content: 'Comment',
        likes: [],
        dislikes: ['user-2']
      }
      useCommentsStore.setState({ comments: [comment] })
      
      // Act
      act(() => {
        useCommentsStore.getState().toggleCommentDislike('comment-1', 'user-2')
      })
      
      // Assert
      const comments = useCommentsStore.getState().comments
      expect(comments[0].likes).toEqual([])
      expect(comments[0].dislikes).toEqual([])
    })

    it('should remove user from likes when adding dislike', () => {
      // Arrange
      const comment: Comment = {
        id: 'comment-1',
        articleId: 'article-1',
        authorId: 'user-1',
        authorName: 'John Doe',
        date: '2024-01-01T10:00:00.000Z',
        content: 'Comment',
        likes: ['user-2'],
        dislikes: []
      }
      useCommentsStore.setState({ comments: [comment] })
      
      // Act
      act(() => {
        useCommentsStore.getState().toggleCommentDislike('comment-1', 'user-2')
      })
      
      // Assert
      const comments = useCommentsStore.getState().comments
      expect(comments[0].likes).toEqual([])
      expect(comments[0].dislikes).toEqual(['user-2'])
    })

    it('should not affect other comments', () => {
      // Arrange
      const comment1: Comment = {
        id: 'comment-1',
        articleId: 'article-1',
        authorId: 'user-1',
        authorName: 'John Doe',
        date: '2024-01-01T10:00:00.000Z',
        content: 'Comment 1',
        likes: [],
        dislikes: []
      }
      const comment2: Comment = {
        id: 'comment-2',
        articleId: 'article-1',
        authorId: 'user-2',
        authorName: 'Jane Doe',
        date: '2024-01-01T11:00:00.000Z',
        content: 'Comment 2',
        likes: [],
        dislikes: []
      }
      useCommentsStore.setState({ comments: [comment1, comment2] })
      
      // Act
      act(() => {
        useCommentsStore.getState().toggleCommentDislike('comment-1', 'user-3')
      })
      
      // Assert
      const comments = useCommentsStore.getState().comments
      expect(comments[0].dislikes).toEqual(['user-3'])
      expect(comments[1].dislikes).toEqual([])
    })
  })

  describe('like/dislike mutual exclusivity', () => {
    it('should maintain mutual exclusivity through multiple toggles', () => {
      // Arrange
      const comment: Comment = {
        id: 'comment-1',
        articleId: 'article-1',
        authorId: 'user-1',
        authorName: 'John Doe',
        date: '2024-01-01T10:00:00.000Z',
        content: 'Comment',
        likes: [],
        dislikes: []
      }
      useCommentsStore.setState({ comments: [comment] })
      
      // Act & Assert
      act(() => {
        useCommentsStore.getState().toggleCommentLike('comment-1', 'user-2')
      })
      expect(useCommentsStore.getState().comments[0].likes).toEqual(['user-2'])
      expect(useCommentsStore.getState().comments[0].dislikes).toEqual([])
      
      // Act & Assert
      act(() => {
        useCommentsStore.getState().toggleCommentDislike('comment-1', 'user-2')
      })
      expect(useCommentsStore.getState().comments[0].likes).toEqual([])
      expect(useCommentsStore.getState().comments[0].dislikes).toEqual(['user-2'])
      
      // Act & Assert
      act(() => {
        useCommentsStore.getState().toggleCommentLike('comment-1', 'user-2')
      })
      expect(useCommentsStore.getState().comments[0].likes).toEqual(['user-2'])
      expect(useCommentsStore.getState().comments[0].dislikes).toEqual([])
      
      // Act & Assert
      act(() => {
        useCommentsStore.getState().toggleCommentLike('comment-1', 'user-2')
      })
      expect(useCommentsStore.getState().comments[0].likes).toEqual([])
      expect(useCommentsStore.getState().comments[0].dislikes).toEqual([])
    })

    it('should handle multiple users with different reactions', () => {
      // Arrange
      const comment: Comment = {
        id: 'comment-1',
        articleId: 'article-1',
        authorId: 'user-1',
        authorName: 'John Doe',
        date: '2024-01-01T10:00:00.000Z',
        content: 'Comment',
        likes: [],
        dislikes: []
      }
      useCommentsStore.setState({ comments: [comment] })
      
      // Act
      act(() => {
        useCommentsStore.getState().toggleCommentLike('comment-1', 'user-2')
        useCommentsStore.getState().toggleCommentLike('comment-1', 'user-3')
        useCommentsStore.getState().toggleCommentDislike('comment-1', 'user-4')
      })
      
      // Assert
      const comments = useCommentsStore.getState().comments
      expect(comments[0].likes).toEqual(['user-2', 'user-3'])
      expect(comments[0].dislikes).toEqual(['user-4'])
    })
  })
})
