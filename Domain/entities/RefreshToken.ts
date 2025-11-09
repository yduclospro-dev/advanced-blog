export class RefreshToken {
  constructor(
    public readonly id: string,
    public readonly token: string,
    public readonly userId: string,
    public readonly expiresAt: Date,
    public readonly createdAt: Date
  ) {}

  isExpired(): boolean {
    return new Date() > this.expiresAt;
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
