import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    // En test, on NE DOIT PAS planter l'appli…
    // mais on doit renvoyer une erreur claire.
    console.error("JWT_SECRET non défini");
    return res.status(500).json({ error: "Erreur serveur : secret JWT manquant" });
  }

  console.log("secret JWT is set: ", secret);
  console.log("Authenticating request...");
  console.log("header:", req.headers);

  const auth = req.headers.authorization;
  if (!auth) {
    console.error("Token manquant dans l'en-tête Authorization");
    return res.status(401).json({ error: "Token manquant" });
  }

  const token = auth.split(" ")[1];

  try {
    const payload = jwt.verify(token, secret);
    // @ts-expect-error
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Token invalide" });
  }
}