import jwt from 'jsonwebtoken';
import type { Response, NextFunction, Request } from 'express';
import { UserRole } from '@prisma/client';
import { sendApiResponse } from '@webapi/utils/response';
import { log } from 'node:console';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET n\'est pas défini dans les variables d\'environnement');
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
    log("cookies:", req.cookies);
    const token = req.cookies && req.cookies.refresh_token;

    if (!token) {
        return sendApiResponse(res, {
            success: false,
            message: 'Token manquant ou invalide',
            result: null,
            statusCode: 401
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId: string;
            email: string;
            role: UserRole;
        };

        req.user = {
            id: decoded.userId,
            email: decoded.email,
            role: decoded.role
        };

        next();
    } catch {
        return sendApiResponse(res, {
            success: false,
            message: 'Token invalide ou expiré',
            result: null,
            statusCode: 401
        });
    }
}