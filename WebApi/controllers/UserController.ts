import express from "express";
import type { Request, Response } from "express";
import { UserRepository } from "../../Infrastructure/repositories/UserRepository.ts";
import { RegisterUser } from "../../Application/services/RegisterUser.ts";

export class UserController {
  private registerUser: RegisterUser;

  constructor() {
    const userRepository = new UserRepository();
    this.registerUser = new RegisterUser(userRepository);
  }

  async register(req: Request, res: Response) {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
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
      res.status(400).json({ error: "User registration failed" });
    }
  }
}
