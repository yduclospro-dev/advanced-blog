import { UserRole } from "@prisma/client";

export class User {
  public id: string;
  public userName: string;
  public email: string;
  public password: string;
  public role: UserRole;

  constructor(id: string, userName: string, email: string, password: string) {
    this.id = id;
    this.userName = userName;
    this.email = email;
    this.password = password;
    this.role = UserRole.USER;
  }

  setPassword(newPassword: string) {
    this.password = newPassword;
  }

  isPasswordValid(): boolean {
    return this.password.length >= 6;
  }
}