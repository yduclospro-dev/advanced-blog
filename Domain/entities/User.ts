import { UserRole } from "@prisma/client";

export class User {
  private _id?: string;
  private _userName: string;
  private _email: string;
  private _password: string;
  private _role: UserRole;

  constructor(userName: string, email: string, password: string, id?: string) {
    this._id = id;
    this._userName = userName;
    this._email = email;
    this._password = password;
    this._role = UserRole.USER;
  }

  get id(): string | undefined {
    return this._id;
  }

  get userName(): string {
    return this._userName;
  }
    
  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get role(): UserRole {
    return this._role;
  }

  setPassword(newPassword: string) {
    this._password = newPassword;
  }

  isPasswordValid(): boolean {
    return this._password.length >= 6;
  }
}