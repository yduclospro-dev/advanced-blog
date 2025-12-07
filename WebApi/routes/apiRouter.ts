import "@root/loadEnv";
import { Router } from "express";
import { UserController } from "@webapi/controllers/UserController";
import { ArticleController } from "@webapi/controllers/ArticleController";
import { ImageController, upload } from "@webapi/controllers/ImageController";
import { createCompositionRoot } from "@root/compositionRoot";
import { CommentController } from "@webapi/controllers/CommentController";
import { authenticate } from "@webapi/middleware/authenticate";
import { ensureNotAuthenticated } from "@webapi/middleware/ensureNotAuthenticated";
import { PasswordResetController } from "@webapi/controllers/PasswordResetController";

const apiRouter = Router();

const { 
    userService, 
    articleService, 
    imageUploadService, 
    commentService, 
    passwordResetService, 
    emailService } = createCompositionRoot();

const commentController = new CommentController(commentService, articleService);
const userController = new UserController(userService);
const articleController = new ArticleController(articleService);
const imageController = new ImageController(imageUploadService);
const passwordResetController = new PasswordResetController(passwordResetService, emailService);

/**
 * @swagger
 * /api/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Inscription d'un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userName, email, password]
 *             properties:
 *               userName: { type: string, example: "johndoe" }
 *               email: { type: string, format: email, example: "john@example.com" }
 *               password: { type: string, format: password, minLength: 6, example: "password123" }
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *                 result: { $ref: '#/components/schemas/User' }
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       409:
 *         description: Email déjà utilisé
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
apiRouter.post('/register', userController.register.bind(userController));

/**
 * @swagger
 * /api/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Connexion utilisateur
 *     description: Rate limited à 5 tentatives par 10 minutes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email, example: "john@example.com" }
 *               password: { type: string, format: password, example: "password123" }
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: refresh_token=abc123; HttpOnly; Secure; SameSite=Lax
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Connexion réussie" }
 *                 result:
 *                   type: object
 *                   properties:
 *                     accessToken: { type: string }
 *                     refreshToken: { type: string }
 *                     expiresIn: { type: integer, example: 900 }
 *                     user: { $ref: '#/components/schemas/User' }
 *       401:
 *         description: Identifiants invalides
 *       429:
 *         description: Trop de tentatives de connexion
 */
apiRouter.post('/login', userController.login.bind(userController));
apiRouter.post('/refresh', userController.refresh.bind(userController));
apiRouter.post('/logout', userController.logout.bind(userController));

apiRouter.get('/users', userController.getAllUsers.bind(userController));
apiRouter.get('/me', authenticate,  userController.me.bind(userController));

apiRouter.post('/forgot-password', ensureNotAuthenticated, passwordResetController.forgotPassword.bind(passwordResetController));
apiRouter.post('/reset-password', ensureNotAuthenticated, passwordResetController.resetPassword.bind(passwordResetController));

apiRouter.post('/upload/image', authenticate, upload.single('image'), imageController.uploadImage.bind(imageController));
apiRouter.delete('/upload/image', authenticate, imageController.deleteImage.bind(imageController));

/**
 * @swagger
 * /api/articles/search:
 *   get:
 *     tags: [Articles]
 *     summary: Recherche et pagination d'articles
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 10 }
 *         description: Nombre d'articles par page
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Terme de recherche (titre ou contenu)
 *     responses:
 *       200:
 *         description: Liste d'articles avec pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 result:
 *                   type: object
 *                   properties:
 *                     articles:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/Article' }
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage: { type: integer }
 *                         totalPages: { type: integer }
 *                         totalCount: { type: integer }
 *                         limit: { type: integer }
 */
apiRouter.get('/articles/search', articleController.searchArticles.bind(articleController));

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     tags: [Articles]
 *     summary: Récupérer un article par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Article trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 result: { $ref: '#/components/schemas/Article' }
 *       404:
 *         description: Article non trouvé
 */
apiRouter.get('/articles/:id', articleController.getById.bind(articleController));

/**
 * @swagger
 * /api/articles:
 *   post:
 *     tags: [Articles]
 *     summary: Créer un nouvel article
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title: { type: string, minLength: 1, maxLength: 255, example: "Mon article" }
 *               content: { type: string, minLength: 1, example: "Contenu de l'article..." }
 *               imageUrl: { type: string, nullable: true, example: "https://res.cloudinary.com/..." }
 *     responses:
 *       201:
 *         description: Article créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 result: { $ref: '#/components/schemas/Article' }
 *       401:
 *         description: Non authentifié
 */
apiRouter.post('/articles', authenticate, articleController.create.bind(articleController));
apiRouter.put('/articles/:id', authenticate, articleController.update.bind(articleController));
apiRouter.delete('/articles/:id', authenticate, articleController.delete.bind(articleController));

apiRouter.post('/articles/:articleId/comments', authenticate, commentController.createComment.bind(commentController));
apiRouter.get('/articles/:articleId/comments', authenticate, commentController.getCommentsByArticle.bind(commentController));
apiRouter.put('/comments/:id', authenticate, commentController.updateComment.bind(commentController));
apiRouter.delete('/comments/:id', authenticate, commentController.deleteComment.bind(commentController));

export default apiRouter;