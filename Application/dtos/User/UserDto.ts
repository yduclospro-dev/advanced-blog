import { UserRole } from "@prisma/client";

export type UserDto = {
  id: string;
  userName: string;
  email: string;
  role: UserRole;
}