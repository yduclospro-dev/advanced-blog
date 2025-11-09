import { IRefreshTokenRepository } from "../../Domain/repositories/IRefreshTokenRepository";
import { RefreshToken } from "../../Domain/entities/RefreshToken";
import { PrismaClient } from "@prisma/client";
import { hashToken } from "../utils/hashToken";

const prisma = new PrismaClient();

export class RefreshTokenRepository implements IRefreshTokenRepository {
  // Store hashed tokens in the `token` column (backwards-compatible with schema)
  async create(refreshToken: RefreshToken): Promise<RefreshToken> {
    const tokenHash = hashToken(refreshToken.token);

    const created = await prisma.refreshToken.create({
      data: {
        id: refreshToken.id,
        token: tokenHash,
        userId: refreshToken.userId,
        expiresAt: refreshToken.expiresAt,
        createdAt: refreshToken.createdAt,
        revoked: refreshToken.revoked,
        revokedAt: refreshToken.revokedAt,
        replacedBy: refreshToken.replacedBy,
      },
    });

    return new RefreshToken(
      created.id,
      created.token,
      created.userId,
      new Date(created.expiresAt),
      new Date(created.createdAt)
    );
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const tokenHash = hashToken(token);
    const found = await prisma.refreshToken.findUnique({ where: { token: tokenHash } });
    if (!found) return null;

    const domain = new RefreshToken(
      found.id,
      found.token,
      found.userId,
      new Date(found.expiresAt),
      new Date(found.createdAt)
      ,
      found.revoked || false,
      found.revokedAt ? new Date(found.revokedAt) : null,
      found.replacedBy || null
    );

    if (domain.isExpired()) {
      await this.deleteByToken(token);
      return null;
    }

    return domain;
  }

  async deleteByToken(token: string): Promise<void> {
    const tokenHash = hashToken(token);
    // mark as revoked instead of deleting to allow reuse detection
    await prisma.refreshToken.updateMany({ where: { token: tokenHash }, data: { revoked: true, revokedAt: new Date() } });
  }

  async deleteByUserId(userId: string): Promise<void> {
    // revoke all tokens for a user
    await prisma.refreshToken.updateMany({ where: { userId }, data: { revoked: true, revokedAt: new Date() } });
  }
}
