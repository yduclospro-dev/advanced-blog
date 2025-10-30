import { Router } from "express";
import { UserController } from "../controllers/UserController.ts";
import { ArticleController } from "../controllers/ArticleController.ts";

const apiRouter = Router();

const userController = new UserController();
const articleController = new ArticleController();

apiRouter.get('/status', (req, res) => {
  res.json({ status: 'ok' })
});

// Routes pour les utilisateurs
apiRouter.post('/register', userController.register.bind(userController));
apiRouter.post('/login', userController.login.bind(userController));

// Routes pour les articles
apiRouter.get('/articles', articleController.getAll.bind(articleController));
apiRouter.get('/articles/:id', articleController.getById.bind(articleController));
apiRouter.post('/articles', articleController.create.bind(articleController));
apiRouter.put('/articles/:id', articleController.update.bind(articleController));
apiRouter.delete('/articles/:id', articleController.delete.bind(articleController));
apiRouter.post('/articles/:id/like', articleController.toggleLike.bind(articleController));
apiRouter.post('/articles/:id/dislike', articleController.toggleDislike.bind(articleController));

export default apiRouter;