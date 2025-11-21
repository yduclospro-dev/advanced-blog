import type { Request, Response, NextFunction } from "express";
import { sendApiResponse } from '@webapi/utils/response';
import jwt from "jsonwebtoken";
import { UserService } from "@app/services/User/UserService";
import type { UserDto } from '@app/dtos/User/UserDto';
import { UnauthorizedError, NotFoundError } from "@domain/errors";
import { validateRequiredFields } from "@webapi/utils/validation";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      validateRequiredFields(req.body, ['userName', 'email', 'password']);

      const { userName, email, password } = req.body;
      const user = await this.userService.register(userName, email, password);
      
      return sendApiResponse(
        res, 
        {
          success: true,
          message: 'Inscription réussie',
          result: {
            id: user.id,
            userName: user.userName,
            email: user.email,
            role: user.role
          },
          statusCode: 201,
        }
      );
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      // Empêche la connexion si déjà connecté (refresh_token présent)
      if (req.cookies && req.cookies.refresh_token) {
        return sendApiResponse(res, {
          success: false,
          message: 'Déjà connecté. Veuillez vous déconnecter avant de changer d\'utilisateur.',
          result: null,
          statusCode: 400
        });
      }

      validateRequiredFields(req.body, ['email', 'password']);

      const { email, password } = req.body;
      const user = await this.userService.verifyCredentials(email, password);
      const accessToken = this.generateToken(user);

      const refreshSecret = process.env.JWT_SECRET;
      if (!refreshSecret) throw new Error('JWT_SECRET non défini');
      const refreshToken = jwt.sign({ userId: user.id }, refreshSecret, { expiresIn: 7 * 24 * 60 * 60 });

      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      sendApiResponse(res, {
        success: true,
        message: 'Connexion réussie',
        result: {
          accessToken,
          refreshToken,
          expiresIn: 900,
          user: {
            id: user.id,
            userName: user.userName,
            email: user.email,
            role: user.role
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as Request & { user?: { id?: string } };
      const userId = authReq.user?.id;
      if (!userId) {
        throw new UnauthorizedError("Utilisateur non authentifié");
      }

      const user = await this.userService.findById(userId);
      if (!user) {
        throw new NotFoundError("Utilisateur non trouvé");
      }

      sendApiResponse(res, {
        success: true,
        result: {
          id: user.id,
          email: user.email,
          userName: user.userName,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const cookieToken = req.cookies?.refresh_token;
      if (!cookieToken) {
        throw new UnauthorizedError('Refresh token manquant');
      }
      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error('JWT_SECRET non défini');
      let decoded: unknown;
      try {
        decoded = jwt.verify(cookieToken, secret);
      } catch {
        throw new UnauthorizedError('Refresh token invalide ou expiré');
      }
      const user = await this.userService.findById((decoded as { userId: string }).userId);
      if (!user) {
        throw new UnauthorizedError('Utilisateur non trouvé');
      }
      const accessToken = this.generateToken(user);

      const newRefreshToken = jwt.sign({ userId: user.id }, secret, { expiresIn: 7 * 24 * 60 * 60 });
      res.cookie('refresh_token', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      sendApiResponse(res, {
        success: true,
        message: 'Token rafraîchi',
        result: {
          accessToken,
          refreshToken: newRefreshToken,
          expiresIn: 900,
          user
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie('refresh_token');
      sendApiResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Déconnexion réussie',
        result: null
      });
    } catch (error) {
      next(error);
    }
  }

  private generateToken = (user: UserDto): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT secret is not configured');
    }

    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },      
      secret,
      { expiresIn: '15m' }
    );
  }
}