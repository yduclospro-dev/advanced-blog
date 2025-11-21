import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { UserController } from "@webapi/controllers/UserController.ts";
import { ArticleController } from "@webapi/controllers/ArticleController.ts";
import { ImageController, upload } from "@webapi/controllers/ImageController.ts";
import { userService, articleService, imageUploadService, commentService, passwordResetService, emailService } from "@root/compositionRoot.ts";
import { CommentController } from "@webapi/controllers/CommentController";
import { authenticate } from "@webapi/middleware/authenticate.ts";
import { ensureNotAuthenticated } from "@webapi/middleware/ensureNotAuthenticated.ts";
import { PasswordResetController } from "@webapi/controllers/PasswordResetController";

const apiRouter = Router();

const commentController = new CommentController(commentService);
const userController = new UserController(userService);
const articleController = new ArticleController(articleService);
const imageController = new ImageController(imageUploadService);
const passwordResetController = new PasswordResetController(passwordResetService, emailService);

const prisma = new PrismaClient();
apiRouter.get('/', async (req, res) => {
  res.send('API is running');
});

apiRouter.get('/healthz', async (req, res) => {
  const start = Date.now();
  try {
    await prisma.user.count();
    const duration = Date.now() - start;
    res.status(200).json({ status: 'ok', db: 'ok', durationMs: duration });
  } catch (e) {
    const duration = Date.now() - start;
    res.status(503).json({ status: 'error', db: 'unreachable', durationMs: duration });
  }
});

apiRouter.post('/register', userController.register.bind(userController));
apiRouter.post('/login', userController.login.bind(userController));
apiRouter.post('/refresh', userController.refresh.bind(userController));
apiRouter.post('/logout', userController.logout.bind(userController));

apiRouter.get('/users', userController.getAllUsers.bind(userController));
apiRouter.get('/me', authenticate,  userController.me.bind(userController));

apiRouter.post('/forgot-password', ensureNotAuthenticated, passwordResetController.forgotPassword.bind(passwordResetController));
apiRouter.post('/reset-password', ensureNotAuthenticated, passwordResetController.resetPassword.bind(passwordResetController));

apiRouter.post('/upload/image', authenticate, upload.single('image'), imageController.uploadImage.bind(imageController));
apiRouter.delete('/upload/image', authenticate, imageController.deleteImage.bind(imageController));

apiRouter.get('/articles/search', articleController.searchArticles.bind(articleController));
apiRouter.get('/articles/:id', articleController.getById.bind(articleController));
apiRouter.post('/articles', authenticate, articleController.create.bind(articleController));
apiRouter.put('/articles/:id', authenticate, articleController.update.bind(articleController));
apiRouter.delete('/articles/:id', authenticate, articleController.delete.bind(articleController));

apiRouter.post('/articles/:articleId/comments', authenticate, commentController.createComment.bind(commentController));
apiRouter.get('/articles/:articleId/comments', authenticate, commentController.getCommentsByArticle.bind(commentController));
apiRouter.put('/comments/:id', authenticate, commentController.updateComment.bind(commentController));
apiRouter.delete('/comments/:id', authenticate, commentController.deleteComment.bind(commentController));

export default apiRouter;