import { Router } from "express";
import { UserController } from "../controllers/UserController.ts";
import { PasswordController } from "../controllers/PasswordController.ts";
import { ArticleController } from "../controllers/ArticleController.ts";

const apiRouter = Router();

const userController = new UserController();
const passwordController = new PasswordController();
const articleController = new ArticleController();

apiRouter.get('/status', (req, res) => {
  res.json({ status: 'ok' })
});

apiRouter.post('/register', userController.register.bind(userController));
apiRouter.post('/login', userController.login.bind(userController));
apiRouter.post('/password/forgot', passwordController.forgotPassword.bind(passwordController));
apiRouter.post('/password/reset', passwordController.resetPassword.bind(passwordController));

apiRouter.get('/articles', articleController.getAll.bind(articleController));
apiRouter.get('/articles/:id', articleController.getById.bind(articleController));
apiRouter.post('/articles', articleController.create.bind(articleController));
apiRouter.put('/articles/:id', articleController.update.bind(articleController));
apiRouter.delete('/articles/:id', articleController.delete.bind(articleController));

export default apiRouter;