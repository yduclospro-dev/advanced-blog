import type { Request, Response } from "express";
import { ArticleService } from "../../Application/services/Article/ArticleService.ts";

export class ArticleController {
  private articleService: ArticleService;

  constructor(articleService: ArticleService) {
    this.articleService = articleService;
  }

  async getAll(req: Request, res: Response) {
    try {
      const articles = await this.articleService.findAll();
      res.status(200).json(articles);
    } catch {
      res.status(500).json({ error: "Erreur lors de la récupération des articles" });
    }
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const article = await this.articleService.findById(id);
      if (!article) {
        return res.status(404).json({ error: "Article non trouvé" });
      }
      res.status(200).json(article);
    } catch {
      res.status(500).json({ error: "Erreur lors de la récupération de l'article" });
    }
  }

  async create(req: Request, res: Response) {
    const { title, content, imageUrl } = req.body;
    const authorId = req.user?.id;

    if (!authorId) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    if (!title || !content) {
      return res.status(400).json({ error: "Champs requis manquants: title et content sont obligatoires" });
    }

    try {
      const createdArticle = await this.articleService.create(
        title,
        authorId,
        content,
        imageUrl
      );

      if (!createdArticle) {
        return res.status(500).json({ error: "Échec de la création de l'article" });
      }

      res.status(201).json(createdArticle);
    } catch {
      res.status(500).json({ error: "Erreur lors de la création de l'article" });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { title, content, imageUrl } = req.body;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    try {
      const updatedArticle = await this.articleService.update(id, userId, userRole, {
        title,
        content,
        imageUrl,
      });
      res.status(200).json(updatedArticle);
    } catch (error) {
      if ((error as Error).message === "Article non trouvé") {
        return res.status(404).json({ error: "Article non trouvé" });
      }
      if ((error as Error).message === "Non autorisé à modifier cet article") {
        return res.status(403).json({ error: "Non autorisé à modifier cet article" });
      }
      
      res.status(500).json({ error: "Erreur lors de la mise à jour de l'article" });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    try {
      await this.articleService.delete(id, userId, userRole);
      res.status(204).send();
    } catch (error) {
      if ((error as Error).message === "Article non trouvé") {
        return res.status(404).json({ error: "Article non trouvé" });
      }
      if ((error as Error).message === "Non autorisé à supprimer cet article") {
        return res.status(403).json({ error: "Non autorisé à supprimer cet article" });
      }
      
      res.status(500).json({ error: "Erreur lors de la suppression de l'article" });
    }
  }
}
