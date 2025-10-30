import type { Request, Response } from "express";
import { ArticleRepository } from "../../Infrastructure/repositories/ArticleRepository.ts";
import { CreateArticle } from "../../Application/services/CreateArticle.ts";
import { UpdateArticle } from "../../Application/services/UpdateArticle.ts";
import { DeleteArticle } from "../../Application/services/DeleteArticle.ts";

export class ArticleController {
  private articleRepository: ArticleRepository;
  private createArticle: CreateArticle;
  private updateArticle: UpdateArticle;
  private deleteArticle: DeleteArticle;

  constructor() {
    this.articleRepository = new ArticleRepository();
    this.createArticle = new CreateArticle(this.articleRepository);
    this.updateArticle = new UpdateArticle(this.articleRepository);
    this.deleteArticle = new DeleteArticle(this.articleRepository);
  }

  async getAll(req: Request, res: Response) {
    try {
      const articles = await this.articleRepository.findAll();
      res.status(200).json(articles);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération des articles" });
    }
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const article = await this.articleRepository.findById(id);
      if (!article) {
        return res.status(404).json({ error: "Article non trouvé" });
      }
      res.status(200).json(article);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération de l'article" });
    }
  }

  async create(req: Request, res: Response) {
    console.log("📥 Requête reçue pour créer un article:", req.body);
    const { title, author, content, imageUrl } = req.body;

    if (!title || !author || !content) {
      console.log("❌ Champs manquants - title:", !!title, "author:", !!author, "content:", !!content);
      return res.status(400).json({ error: "Champs requis manquants: title, author, et content sont obligatoires" });
    }

    try {
      const createdArticle = await this.createArticle.execute(
        title,
        author,
        content,
        imageUrl
      );
      console.log("✅ Article créé avec succès:", createdArticle);
      res.status(201).json(createdArticle);
    } catch (error) {
      console.error("❌ Erreur lors de la création de l'article:", error);
      res.status(500).json({ error: "Erreur lors de la création de l'article" });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { title, content, imageUrl } = req.body;

    try {
      const updatedArticle = await this.updateArticle.execute(id, {
        title,
        content,
        imageUrl,
      });
      res.status(200).json(updatedArticle);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'article:", error);
      
      if ((error as Error).message === "Article non trouvé") {
        return res.status(404).json({ error: "Article non trouvé" });
      }
      
      res.status(500).json({ error: "Erreur lors de la mise à jour de l'article" });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await this.deleteArticle.execute(id);
      res.status(204).send();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'article:", error);
      
      if ((error as Error).message === "Article non trouvé") {
        return res.status(404).json({ error: "Article non trouvé" });
      }
      
      res.status(500).json({ error: "Erreur lors de la suppression de l'article" });
    }
  }

  async toggleLike(req: Request, res: Response) {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId est requis" });
    }

    try {
      const updatedArticle = await this.articleRepository.toggleLike(id, userId);
      res.status(200).json(updatedArticle);
    } catch (error) {
      console.error("Erreur lors du like de l'article:", error);
      res.status(500).json({ error: "Erreur lors du like de l'article" });
    }
  }

  async toggleDislike(req: Request, res: Response) {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId est requis" });
    }

    try {
      const updatedArticle = await this.articleRepository.toggleDislike(id, userId);
      res.status(200).json(updatedArticle);
    } catch (error) {
      console.error("Erreur lors du dislike de l'article:", error);
      res.status(500).json({ error: "Erreur lors du dislike de l'article" });
    }
  }
}
