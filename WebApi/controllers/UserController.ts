import type { Request, Response } from "express";
import { UserRepository } from "../../Infrastructure/repositories/UserRepository.ts";
import { RegisterUser } from "../../Application/services/RegisterUser.ts";
import { LoginUser } from "../../Application/services/LoginUser.ts";

export class UserController {
  private registerUser: RegisterUser;
  private loginUser: LoginUser;

  constructor() {
    const userRepository = new UserRepository();
    this.registerUser = new RegisterUser(userRepository);
    this.loginUser = new LoginUser(userRepository);
  }

  async register(req: Request, res: Response) {
    console.log("BODY: ", req.body)
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Champs requis manquants" });
    }

    try {
      const user = await this.registerUser.execute(username, email, password);
      res.status(201).json({
        id: user.id,
        userName: user.userName,
        email: user.email,
        password: user.password
      });
    } catch {
      res.status(400).json({ error: "Echec de l'enregistrement de l'utilisateur" });
    }
  }

  async login(req: Request, res: Response) {
    console.log("BODY LOGIN: ", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    try {
      const user = await this.loginUser.execute(email, password);
      res.status(200).json({
        message: "Connexion réussie",
        user: {
          id: user.id,
          username: user.userName,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(401).json({ error: (error as Error).message });
    }
  }
}
