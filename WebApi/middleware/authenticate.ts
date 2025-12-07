import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("JWT_SECRET non défini");
    return res.status(500).json({ error: "Erreur serveur : secret JWT manquant" });
  }

  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).json({ error: "Token manquant" });
  }

  const token = auth.split(" ")[1];

  try {
    const payload = jwt.verify(token, secret);
    req.user = payload as any;
    next();
  } catch {
    return res.status(401).json({ error: "Token invalide" });
  }
}