import { Router } from "express";
import { UserController } from "../controllers/UserController.ts";
import { ArticleController } from "../controllers/ArticleController.ts";
import { ImageController, upload } from "../controllers/ImageController.ts";
import { userService, articleService, imageUploadService } from "../../compositionRoot.ts";
import { authenticate } from "../middleware/authenticate.ts";

const apiRouter = Router();

// Create controllers with services
const userController = new UserController(userService);
const articleController = new ArticleController(articleService);
const imageController = new ImageController(imageUploadService);

apiRouter.get('/status', (req, res) => {
  res.json({ status: 'ok' })
});

apiRouter.post('/register', userController.register.bind(userController));
apiRouter.post('/login', userController.login.bind(userController));
apiRouter.get('/me', authenticate,  userController.me.bind(userController));

// Image upload routes
apiRouter.post('/upload/image', authenticate, upload.single('image'), imageController.uploadImage.bind(imageController));
apiRouter.delete('/upload/image', authenticate, imageController.deleteImage.bind(imageController));

// Article routes
apiRouter.get('/articles', articleController.getAll.bind(articleController));
apiRouter.get('/articles/:id', articleController.getById.bind(articleController));
apiRouter.post('/articles', authenticate, articleController.create.bind(articleController));
apiRouter.put('/articles/:id', authenticate, articleController.update.bind(articleController));
apiRouter.delete('/articles/:id', authenticate, articleController.delete.bind(articleController));

export default apiRouter;