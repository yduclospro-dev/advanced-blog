import type { IUserRepository } from '../../Domain/repositories/IUserRepository.ts';
import { User } from '../../Domain/entities/User.ts';

export class UserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    // Mock: return user as is
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    // Mock: always return null
    return null;
  }
}
