import { UserRole } from "@prisma/client";

export interface User {
    id: string;
    userName: string;
    email: string;
    password: string;
    role: UserRole;
}