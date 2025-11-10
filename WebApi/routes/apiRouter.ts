import { Router } from "express";
import { UserController } from "../controllers/UserController.ts";
import { ArticleController } from "../controllers/ArticleController.ts";
import { ImageController, upload } from "../controllers/ImageController.ts";
import { userService, articleService, imageUploadService, commentService } from "../../compositionRoot.ts";

import { CommentController } from "../controllers/CommentController";
import { authenticate } from "../middleware/authenticate.ts";

const apiRouter = Router();


const commentController = new CommentController(commentService);
apiRouter.post('/articles/:articleId/comments', authenticate, commentController.createComment.bind(commentController));
apiRouter.get('/articles/:articleId/comments', authenticate, commentController.getCommentsByArticle.bind(commentController));
apiRouter.put('/comments/:id', authenticate, commentController.updateComment.bind(commentController));
apiRouter.delete('/comments/:id', authenticate, commentController.deleteComment.bind(commentController));

const userController = new UserController(userService);
const articleController = new ArticleController(articleService);
const imageController = new ImageController(imageUploadService);

apiRouter.get('/status', (req, res) => {
  res.json({ status: 'ok' })
});

apiRouter.post('/register', userController.register.bind(userController));
apiRouter.post('/login', userController.login.bind(userController));
apiRouter.post('/refresh', userController.refresh.bind(userController));
apiRouter.post('/logout', userController.logout.bind(userController));
apiRouter.get('/me', authenticate,  userController.me.bind(userController));

apiRouter.post('/upload/image', authenticate, upload.single('image'), imageController.uploadImage.bind(imageController));
apiRouter.delete('/upload/image', authenticate, imageController.deleteImage.bind(imageController));

apiRouter.get('/articles/search', articleController.searchArticles.bind(articleController));
apiRouter.get('/articles', articleController.getAll.bind(articleController));
apiRouter.get('/articles/:id', articleController.getById.bind(articleController));
apiRouter.post('/articles', authenticate, articleController.create.bind(articleController));
apiRouter.put('/articles/:id', authenticate, articleController.update.bind(articleController));
apiRouter.delete('/articles/:id', authenticate, articleController.delete.bind(articleController));

export default apiRouter;