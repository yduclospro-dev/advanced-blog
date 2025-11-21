import type { IUserRepository } from '@domain/repositories/IUserRepository.ts';
import { User } from '@domain/entities/User.ts';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();
export class UserRepository implements IUserRepository {

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });
  }
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
  // ...existing code...
  async findByUserName(userName: string): Promise<User | null> {
    const found = await prisma.user.findUnique({ where: { userName } });
    if (!found) return null;
    return new User(found.userName, found.email, found.password, found.role, found.id);
  }

  async findById(id: string): Promise<User | null> {
    const found = await prisma.user.findUnique({ where: { id } });
    if (!found) return null;
    return new User(found.userName, found.email, found.password, found.role, found.id);
  }

  async getAll(): Promise<User[]> {
    const users = await prisma.user.findMany();
    return users.map(u => new User(u.userName, u.email, u.password, u.role, u.id));
  }
}