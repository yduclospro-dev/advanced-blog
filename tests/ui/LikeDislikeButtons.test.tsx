import { render, screen, fireEvent } from '@testing-library/react'
import LikeDislikeButtons from '@/components/ui/LikeDislikeButtons/LikeDislikeButtons'

describe('LikeDislikeButtons', () => {
  const mockOnLike = jest.fn()
  const mockOnDislike = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render like and dislike buttons with counts', () => {
      // Arrange & Act
      render(
        <LikeDislikeButtons
          likesCount={5}
          dislikesCount={3}
          hasLiked={false}
          hasDisliked={false}
          onLike={mockOnLike}
          onDislike={mockOnDislike}
        />
      )

      // Assert
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.getByText('👍🏻')).toBeInTheDocument()
      expect(screen.getByText('👎🏻')).toBeInTheDocument()
    })

    it('should render zero counts', () => {
      // Arrange & Act
      render(
        <LikeDislikeButtons
          likesCount={0}
          dislikesCount={0}
          hasLiked={false}
          hasDisliked={false}
          onLike={mockOnLike}
          onDislike={mockOnDislike}
        />
      )

      // Assert
      const zeroElements = screen.getAllByText('0')
      expect(zeroElements).toHaveLength(2)
    })

    it('should render large counts', () => {
      // Arrange & Act
      render(
        <LikeDislikeButtons
          likesCount={999}
          dislikesCount={1000}
          hasLiked={false}
          hasDisliked={false}
          onLike={mockOnLike}
          onDislike={mockOnDislike}
        />
      )

      // Assert
      expect(screen.getByText('999')).toBeInTheDocument()
      expect(screen.getByText('1000')).toBeInTheDocument()
    })
  })

  describe('Active States', () => {
    it('should show active like emoji when hasLiked is true', () => {
      // Arrange & Act
      render(
        <LikeDislikeButtons
          likesCount={1}
          dislikesCount={0}
          hasLiked={true}
          hasDisliked={false}
          onLike={mockOnLike}
          onDislike={mockOnDislike}
        />
      )

      // Assert
      expect(screen.getByText('👍')).toBeInTheDocument()
    })

    it('should show active dislike emoji when hasDisliked is true', () => {
      // Arrange & Act
      render(
        <LikeDislikeButtons
          likesCount={0}
          dislikesCount={1}
          hasLiked={false}
          hasDisliked={true}
          onLike={mockOnLike}
          onDislike={mockOnDislike}
        />
      )

      // Assert
      expect(screen.getByText('👎')).toBeInTheDocument()
    })

    it('should show both inactive when neither liked nor disliked', () => {
      // Arrange & Act
      render(
        <LikeDislikeButtons
          likesCount={0}
          dislikesCount={0}
          hasLiked={false}
          hasDisliked={false}
          onLike={mockOnLike}
          onDislike={mockOnDislike}
        />
      )

      // Assert
      expect(screen.getByText('👍🏻')).toBeInTheDocument()
      expect(screen.getByText('👎🏻')).toBeInTheDocument()
    })

    it('should apply active styling when liked', () => {
      // Arrange & Act
      const { container } = render(
        <LikeDislikeButtons
          likesCount={1}
          dislikesCount={0}
          hasLiked={true}
          hasDisliked={false}
          onLike={mockOnLike}
          onDislike={mockOnDislike}
        />
      )

      // Assert
      const likeButton = container.querySelector('button:first-child')
      expect(likeButton).toHaveClass('border-blue-700')
    })

    it('should apply active styling when disliked', () => {
      // Arrange & Act
      const { container } = render(
        <LikeDislikeButtons
          likesCount={0}
          dislikesCount={1}
          hasLiked={false}
          hasDisliked={true}
          onLike={mockOnLike}
          onDislike={mockOnDislike}
        />
      )

      // Assert
      const dislikeButton = container.querySelector('button:last-child')
      expect(dislikeButton).toHaveClass('border-red-700')
    })
  })

  describe('Click Handlers', () => {
    it('should call onLike when like button is clicked', () => {
      // Arrange
      render(
        <LikeDislikeButtons
          likesCount={0}
          dislikesCount={0}
          hasLiked={false}
          hasDisliked={false}
          onLike={mockOnLike}
          onDislike={mockOnDislike}
        />
      )

      // Act
      const likeButton = screen.getByText('👍🏻').closest('button')
      fireEvent.click(likeButton!)

      // Assert
      expect(mockOnLike).toHaveBeenCalledTimes(1)
      expect(mockOnDislike).not.toHaveBeenCalled()
    })

    it('should call onDislike when dislike button is clicked', () => {
      // Arrange
      render(
        <LikeDislikeButtons
          likesCount={0}
          dislikesCount={0}
          hasLiked={false}
          hasDisliked={false}
          onLike={mockOnLike}
          onDislike={mockOnDislike}
        />
      )

      // Act
      const dislikeButton = screen.getByText('👎🏻').closest('button')
      fireEvent.click(dislikeButton!)

      // Assert
      expect(mockOnDislike).toHaveBeenCalledTimes(1)
      expect(mockOnLike).not.toHaveBeenCalled()
    })

    it('should allow multiple clicks on like button', () => {
      // Arrange
      render(
        <LikeDislikeButtons
          likesCount={0}
          dislikesCount={0}
          hasLiked={false}
          hasDisliked={false}
          onLike={mockOnLike}
          onDislike={mockOnDislike}
        />
      )

      // Act
      const likeButton = screen.getByText('👍🏻').closest('button')
      fireEvent.click(likeButton!)
      fireEvent.click(likeButton!)
      fireEvent.click(likeButton!)

      // Assert
      expect(mockOnLike).toHaveBeenCalledTimes(3)
    })

    it('should allow multiple clicks on dislike button', () => {
      // Arrange
      render(
        <LikeDislikeButtons
          likesCount={0}
          dislikesCount={0}
          hasLiked={false}
          hasDisliked={false}
          onLike={mockOnLike}
          onDislike={mockOnDislike}
        />
      )

      // Act
      const dislikeButton = screen.getByText('👎🏻').closest('button')
      fireEvent.click(dislikeButton!)
      fireEvent.click(dislikeButton!)

      // Assert
      expect(mockOnDislike).toHaveBeenCalledTimes(2)
    })

    it('should work when already liked and clicking like again', () => {
      // Arrange
      render(
        <LikeDislikeButtons
          likesCount={1}
          dislikesCount={0}
          hasLiked={true}
          hasDisliked={false}
          onLike={mockOnLike}
          onDislike={mockOnDislike}
        />
      )

      // Act
      const likeButton = screen.getByText('👍').closest('button')
      fireEvent.click(likeButton!)

      // Assert
      expect(mockOnLike).toHaveBeenCalledTimes(1)
    })

    it('should work when already disliked and clicking dislike again', () => {
      // Arrange
      render(
        <LikeDislikeButtons
          likesCount={0}
          dislikesCount={1}
          hasLiked={false}
          hasDisliked={true}
          onLike={mockOnLike}
          onDislike={mockOnDislike}
        />
      )

      // Act
      const dislikeButton = screen.getByText('👎').closest('button')
      fireEvent.click(dislikeButton!)

      // Assert
      expect(mockOnDislike).toHaveBeenCalledTimes(1)
    })
  })

  describe('Props Validation', () => {
    it('should handle hasLiked and hasDisliked both true (edge case)', () => {
      // Arrange & Act
      render(
        <LikeDislikeButtons
          likesCount={1}
          dislikesCount={1}
          hasLiked={true}
          hasDisliked={true}
          onLike={mockOnLike}
          onDislike={mockOnDislike}
        />
      )

      // Assert
      expect(screen.getByText('👍')).toBeInTheDocument()
      expect(screen.getByText('👎')).toBeInTheDocument()
    })

    it('should handle negative counts gracefully (edge case)', () => {
      // Arrange & Act
      render(
        <LikeDislikeButtons
          likesCount={-1}
          dislikesCount={-5}
          hasLiked={false}
          hasDisliked={false}
          onLike={mockOnLike}
          onDislike={mockOnDislike}
        />
      )

      // Assert
      expect(screen.getByText('-1')).toBeInTheDocument()
      expect(screen.getByText('-5')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should render buttons that are clickable', () => {
      // Arrange & Act
      render(
        <LikeDislikeButtons
          likesCount={0}
          dislikesCount={0}
          hasLiked={false}
          hasDisliked={false}
          onLike={mockOnLike}
          onDislike={mockOnDislike}
        />
      )

      // Assert
      const likeButton = screen.getByText('👍🏻').closest('button')
      const dislikeButton = screen.getByText('👎🏻').closest('button')
      
      expect(likeButton).toBeInTheDocument()
      expect(dislikeButton).toBeInTheDocument()
      expect(likeButton?.tagName).toBe('BUTTON')
      expect(dislikeButton?.tagName).toBe('BUTTON')
    })
  })
})
