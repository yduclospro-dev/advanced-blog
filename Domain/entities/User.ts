import crypto from "crypto";

export class User {
  public id: string;
  public userName: string;
  public email: string;
  public password: string;
  public resetPasswordToken?: string;
  public resetPasswordExpires?: Date;

  constructor(
    id: string,
    userName: string,
    email: string,
    password: string,
    resetPasswordToken?: string,
    resetPasswordExpires?: Date
  ) {
    this.id = id;
    this.userName = userName;
    this.email = email;
    this.password = password;
    this.resetPasswordToken = resetPasswordToken;
    this.resetPasswordExpires = resetPasswordExpires;
  }

  setPassword(newPassword: string) {
    this.password = newPassword;
  }

  isPasswordValid(): boolean {
    return this.password.length >= 6;
  }

  generateResetToken(): string {
    const token = crypto.randomBytes(32).toString("hex");
    this.resetPasswordToken = token;
    // Token expires in 1 hour
    this.resetPasswordExpires = new Date(Date.now() + 3600000);
    return token;
  }

  isResetTokenValid(): boolean {
    if (!this.resetPasswordToken || !this.resetPasswordExpires) {
      return false;
    }
    return this.resetPasswordExpires > new Date();
  }

  clearResetToken() {
    this.resetPasswordToken = undefined;
    this.resetPasswordExpires = undefined;
  }
}