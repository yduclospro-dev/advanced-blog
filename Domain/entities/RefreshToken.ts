export class RefreshToken {
  constructor(
    public readonly id: string,
    public readonly token: string,
    public readonly userId: string,
    public readonly expiresAt: Date,
    public readonly createdAt: Date
    ,
    public readonly revoked: boolean = false,
    public readonly revokedAt: Date | null = null,
    public readonly replacedBy: string | null = null
  ) {}

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  isRevoked(): boolean {
    return this.revoked === true;
  }

  static create(userId: string, token: string, expiresInDays: number = 7): RefreshToken {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expiresInDays * 24 * 60 * 60 * 1000);
    
    return new RefreshToken(
      crypto.randomUUID(),
      token,
      userId,
      expiresAt,
      now
    );
  }
}
