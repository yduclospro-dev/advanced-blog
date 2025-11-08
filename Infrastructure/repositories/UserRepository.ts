import type { IUserRepository } from '../../Domain/repositories/IUserRepository.ts';
import { User } from '../../Domain/entities/User.ts';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    const created = await prisma.user.create({
      data: {
        userName: user.userName,
        email: user.email,
        password: user.password,
      },
    });
    
    return new User(
      created.userName,
      created.email,
      created.password,
      created.role,
      created.id
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const found = await prisma.user.findUnique({ where: { email } });
    if (!found) return null;
    return new User(found.userName, found.email, found.password, found.role, found.id);
  }

  async findById(id: string): Promise<User | null> {
    const found = await prisma.user.findUnique({ where: { id } });
    if (!found) return null;

    return new User(found.userName, found.email, found.password, found.role, found.id);
  }
}