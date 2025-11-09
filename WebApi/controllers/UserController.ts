import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserService } from "@app/services/User/UserService";
import type { UserDto } from '@app/dtos/UserDto';
import { log } from "console";
import { UnauthorizedError, NotFoundError } from "@domain/errors";
import { validateRequiredFields } from "../utils/validation";

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
      res.status(201).json({
        id: user.id,
        userName: user.userName,
        email: user.email,
        role: user.role
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      validateRequiredFields(req.body, ['email', 'password']);

      const { email, password } = req.body;

      const user = await this.userService.verifyCredentials(email, password);
      const accessToken = this.generateToken(user);
      const refreshToken = await this.userService.generateRefreshToken(user.id);

      log("User logged in:", user, "Access Token:", accessToken, "Refresh Token:", refreshToken.token);

      // set httpOnly cookie for refresh token; keep returning accessToken in body
      res.cookie('refresh_token', refreshToken.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // match expiresInDays default
      });

      res.status(200).json({
        accessToken,
        refreshToken: refreshToken.token,
        expiresIn: 900,
        user: {
          id: user.id,
          userName: user.userName,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      // Express Request doesn't include the `user` property by default in types.
      // Cast to any (or better, declare an interface for authenticated request) to access it safely.
      const authReq = req as Request & { user?: { id?: string } };
      const userId = authReq.user?.id;
      if (!userId) {
        throw new UnauthorizedError("Utilisateur non authentifié");
      }

      const user = await this.userService.findById(userId);
      if (!user) {
        throw new NotFoundError("Utilisateur non trouvé");
      }

      res.status(200).json({
        id: user.id,
        email: user.email,
        userName: user.userName,
        role: user.role
      });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      // accept refresh token from body or cookie
      const bodyToken = req.body?.refreshToken;
      const cookieToken = req.cookies?.refresh_token;
      const refreshToken = bodyToken || cookieToken;

      if (!refreshToken) {
        throw new UnauthorizedError('Refresh token manquant');
      }

      const loginResponse = await this.userService.refresh(refreshToken);
      const accessToken = this.generateToken(loginResponse.user);

      // update httpOnly cookie with the new refresh token so cookie-based flows keep working
      res.cookie('refresh_token', loginResponse.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(200).json({
        accessToken,
        refreshToken: loginResponse.refreshToken,
        expiresIn: 900,
        user: loginResponse.user
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // accept token from body or cookie
      const bodyToken = req.body?.refreshToken;
      const cookieToken = req.cookies?.refresh_token;
      const refreshToken = bodyToken || cookieToken;

      if (refreshToken) {
        await this.userService.logout(refreshToken);
      }

      // clear cookie regardless
      res.clearCookie('refresh_token');

      res.status(204).send();
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