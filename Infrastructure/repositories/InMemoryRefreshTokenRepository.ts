import { IRefreshTokenRepository } from "../../Domain/repositories/IRefreshTokenRepository";
import { RefreshToken } from "../../Domain/entities/RefreshToken";

export class InMemoryRefreshTokenRepository implements IRefreshTokenRepository {
  private tokens: Map<string, RefreshToken> = new Map();

  async create(refreshToken: RefreshToken): Promise<RefreshToken> {
    this.tokens.set(refreshToken.token, refreshToken);
    return refreshToken;
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const refreshToken = this.tokens.get(token);
    if (!refreshToken) {
      return null;
    }
    if (refreshToken.isExpired()) {
      await this.deleteByToken(token);
      return null;
    }
    return refreshToken;
  }

  async deleteByToken(token: string): Promise<void> {
    this.tokens.delete(token);
  }

  async deleteByUserId(userId: string): Promise<void> {
    const tokensToDelete: string[] = [];
    for (const [token, refreshToken] of this.tokens.entries()) {
      if (refreshToken.userId === userId) {
        tokensToDelete.push(token);
      }
    }
    tokensToDelete.forEach(token => this.tokens.delete(token));
  }
}
