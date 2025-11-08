import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserService } from "../../Application/services/User/UserService.ts";
import type { User } from '@prisma/client';

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async register(req: Request, res: Response) {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      return res.status(400).json({ error: "Champs requis manquants" });
    }

    try {
      const user = await this.userService.register(userName, email, password);
      res.status(201).json({
        id: user.id,
        userName: user.userName,
        email: user.email
      });
    } catch {
      res.status(400).json({ error: "Echec de l'enregistrement de l'utilisateur" });
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    try {
      const user = await this.userService.login(email, password);
      if (!user) {
        return res.status(401).json({ error: "Email ou mot de passe incorrect" });
      }

      const token = this.generateToken(user);

      res.status(200).json({
        message: "Connexion réussie",
        token
      });
    } catch (error) {
      res.status(401).json({ error: (error as Error).message });
    }
  }

  async me(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    const user = await this.userService.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.status(200).json({
      id: user.id,
      email: user.email,
      userName: user.userName,
      role: user.role
    });
  }

  private generateToken = (user: User): string =>
    jwt.sign(
      { 
        userId: user.id, 
        userRole: user.role 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' });
}