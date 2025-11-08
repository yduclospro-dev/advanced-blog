import { UserRole } from '@prisma/client';

export function isOwnerOrAdmin(userId: string, resourceOwnerId: string, userRole: UserRole): boolean {
    return userId === resourceOwnerId || userRole === UserRole.ADMIN;
}

export function isAdmin(userRole: UserRole): boolean {
    return userRole === UserRole.ADMIN;
}