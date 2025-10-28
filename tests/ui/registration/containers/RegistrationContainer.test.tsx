import { act } from '@testing-library/react'
import { useUserStore } from '@/stores/userStore'
import { User } from '@/types/User'

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('useUserStore', () => {
  beforeEach(() => {
    useUserStore.setState({ users: [] })
    jest.clearAllMocks()
  })

  afterEach(() => {
    useUserStore.setState({ users: [] })
  })

  describe('addUser', () => {
    it('should add a new user to the store', () => {
      // Arrange
      const newUser: User = {
        id: '1',
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123'
      }
      
      // Act
      act(() => {
        useUserStore.getState().addUser(newUser)
      })
      
      // Assert
      const users = useUserStore.getState().users
      expect(users).toHaveLength(1)
      expect(users[0]).toEqual(newUser)
    })

    it('should add multiple users to the store', () => {
      // Arrange
      const user1: User = {
        id: '1',
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123'
      }
      const user2: User = {
        id: '2',
        username: 'jane_doe',
        email: 'jane@example.com',
        password: 'password456'
      }
      
      // Act
      act(() => {
        useUserStore.getState().addUser(user1)
        useUserStore.getState().addUser(user2)
      })
      
      // Assert
      const users = useUserStore.getState().users
      expect(users).toHaveLength(2)
      expect(users).toEqual([user1, user2])
    })
  })

  describe('getUserByEmail', () => {
    beforeEach(() => {
      const users: User[] = [
        {
          id: '1',
          username: 'john_doe',
          email: 'john@example.com',
          password: 'password123'
        },
        {
          id: '2',
          username: 'jane_doe',
          email: 'jane@example.com',
          password: 'password456'
        }
      ]
      useUserStore.setState({ users })
    })

    it('should return user when email exists', () => {
      // Arrange
      const targetEmail = 'john@example.com'
      
      // Act
      const user = useUserStore.getState().getUserByEmail(targetEmail)
      
      // Assert
      expect(user).toBeDefined()
      expect(user?.email).toBe(targetEmail)
      expect(user?.username).toBe('john_doe')
    })

    it('should return undefined when email does not exist', () => {
      // Arrange
      const nonExistentEmail = 'nonexistent@example.com'
      
      // Act
      const user = useUserStore.getState().getUserByEmail(nonExistentEmail)
      
      // Assert
      expect(user).toBeUndefined()
    })

    it('should return undefined when email is empty', () => {
      // Arrange
      const emptyEmail = ''
      
      // Act
      const user = useUserStore.getState().getUserByEmail(emptyEmail)
      
      // Assert
      expect(user).toBeUndefined()
    })
  })

  describe('getAllUsers', () => {
    it('should return empty array when no users exist', () => {
      // Arrange
      
      // Act
      const users = useUserStore.getState().getAllUsers()
      
      // Assert
      expect(users).toEqual([])
      expect(users).toHaveLength(0)
    })

    it('should return all users when users exist', () => {
      // Arrange
      const expectedUsers: User[] = [
        {
          id: '1',
          username: 'john_doe',
          email: 'john@example.com',
          password: 'password123'
        },
        {
          id: '2',
          username: 'jane_doe',
          email: 'jane@example.com',
          password: 'password456'
        }
      ]
      useUserStore.setState({ users: expectedUsers })
      
      // Act
      const users = useUserStore.getState().getAllUsers()
      
      // Assert
      expect(users).toEqual(expectedUsers)
      expect(users).toHaveLength(2)
    })
  })

  describe('checkIfUsernameOrEmailExists', () => {
    beforeEach(() => {
      const users: User[] = [
        {
          id: '1',
          username: 'john_doe',
          email: 'john@example.com',
          password: 'password123'
        },
        {
          id: '2',
          username: 'jane_doe',
          email: 'jane@example.com',
          password: 'password456'
        }
      ]
      useUserStore.setState({ users })
    })

    it('should return true when username exists', () => {
      // Arrange
      const existingUsername = 'john_doe'
      const newEmail = 'new@example.com'
      
      // Act
      const exists = useUserStore.getState().checkIfUsernameOrEmailExists(existingUsername, newEmail)
      
      // Assert
      expect(exists).toBe(true)
    })

    it('should return true when email exists', () => {
      // Arrange
      const newUsername = 'new_user'
      const existingEmail = 'jane@example.com'
      
      // Act
      const exists = useUserStore.getState().checkIfUsernameOrEmailExists(newUsername, existingEmail)
      
      // Assert
      expect(exists).toBe(true)
    })

    it('should return true when both username and email exist', () => {
      // Arrange
      const existingUsername = 'john_doe'
      const existingEmail = 'jane@example.com'
      
      // Act
      const exists = useUserStore.getState().checkIfUsernameOrEmailExists(existingUsername, existingEmail)
      
      // Assert
      expect(exists).toBe(true)
    })

    it('should return false when neither username nor email exist', () => {
      // Arrange
      const newUsername = 'new_user'
      const newEmail = 'new@example.com'
      
      // Act
      const exists = useUserStore.getState().checkIfUsernameOrEmailExists(newUsername, newEmail)
      
      // Assert
      expect(exists).toBe(false)
    })

    it('should return false when store is empty', () => {
      // Arrange
      useUserStore.setState({ users: [] })
      const username = 'any_user'
      const email = 'any@example.com'
      
      // Act
      const exists = useUserStore.getState().checkIfUsernameOrEmailExists(username, email)
      
      // Assert
      expect(exists).toBe(false)
    })
  })

  describe('store state management', () => {
    it('should maintain state consistency after multiple operations', () => {
      // Arrange
      const user1: User = {
        id: '1',
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123'
      }
      const user2: User = {
        id: '2',
        username: 'jane_doe',
        email: 'jane@example.com',
        password: 'password456'
      }
      
      // Act
      act(() => {
        useUserStore.getState().addUser(user1)
        useUserStore.getState().addUser(user2)
      })
      
      // Assert
      const allUsers = useUserStore.getState().getAllUsers()
      expect(allUsers).toHaveLength(2)
      
      const foundUser = useUserStore.getState().getUserByEmail('john@example.com')
      expect(foundUser).toEqual(user1)
      
      const exists = useUserStore.getState().checkIfUsernameOrEmailExists('jane_doe', 'new@example.com')
      expect(exists).toBe(true)
    })

    it('should handle edge cases correctly', () => {
      // Arrange
      const userWithSpecialChars: User = {
        id: '1',
        username: 'user@special+chars',
        email: 'test+email@example.co.uk',
        password: 'complex!Password123'
      }
      
      // Act
      act(() => {
        useUserStore.getState().addUser(userWithSpecialChars)
      })
      
      // Assert
      const foundUser = useUserStore.getState().getUserByEmail('test+email@example.co.uk')
      expect(foundUser).toEqual(userWithSpecialChars)
      
      const exists = useUserStore.getState().checkIfUsernameOrEmailExists('user@special+chars', 'other@example.com')
      expect(exists).toBe(true)
    })
  })
})