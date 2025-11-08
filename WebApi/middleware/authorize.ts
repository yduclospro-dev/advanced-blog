import { UserRole } from '@prisma/client';

/**
 * Vérifie si l'utilisateur est propriétaire de la ressource ou administrateur
 * Utilisé dans les controllers pour vérifier les permissions
 */
export function isOwnerOrAdmin(userId: string, resourceOwnerId: string, userRole: UserRole): boolean {
    return userId === resourceOwnerId || userRole === UserRole.ADMIN;
}

/**
 * Vérifie si l'utilisateur est administrateur
 */
export function isAdmin(userRole: UserRole): boolean {
    return userRole === UserRole.ADMIN;
}
