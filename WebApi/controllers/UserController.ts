import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserService } from "../../Application/services/User/UserService.ts";
import type { UserDto } from '../../Application/dtos/UserDto.ts';
import { log } from "console";
import { BadRequestError, UnauthorizedError, NotFoundError } from "../../Domain/errors/index.ts";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { userName, email, password } = req.body;
      if (!userName || !email || !password) {
        throw new BadRequestError("Champs requis manquants");
      }

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
      const { email, password } = req.body;

      if (!email || !password) {
        throw new BadRequestError("Email et mot de passe requis");
      }

      const user = await this.userService.verifyCredentials(email, password);
      const token = this.generateToken(user);

      log("User logged in:", user);

      res.status(200).json({
        message: "Connexion réussie",
        token
      });
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
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

  private generateToken = (user: UserDto): string => {
    return jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }
}