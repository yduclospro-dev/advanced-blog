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
    return new User(created.id, created.userName, created.email, created.password);
  }

  async findByEmail(email: string): Promise<User | null> {
    const found = await prisma.user.findUnique({ where: { email } });
    if (!found) return null;
    return new User(
      found.id,
      found.userName,
      found.email,
      found.password,
      found.resetPasswordToken ?? undefined,
      found.resetPasswordExpires ?? undefined
    );
  }

  async findByResetToken(token: string): Promise<User | null> {
    const found = await prisma.user.findFirst({
      where: { resetPasswordToken: token },
    });
    if (!found) return null;
    return new User(
      found.id,
      found.userName,
      found.email,
      found.password,
      found.resetPasswordToken ?? undefined,
      found.resetPasswordExpires ?? undefined
    );
  }

  async updateResetToken(userId: string, token: string, expires: Date): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      },
    });
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async clearResetToken(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });
  }
}
