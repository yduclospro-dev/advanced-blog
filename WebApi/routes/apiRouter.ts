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

/**
 * @swagger
 * /api/refresh:
 *   post:
 *     tags: [Authentication]
 *     summary: Rafraîchir le token d'accès
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Token rafraîchi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 result:
 *                   type: object
 *                   properties:
 *                     accessToken: { type: string }
 *       401:
 *         description: Token invalide ou expiré
 */
apiRouter.post('/refresh', userController.refresh.bind(userController));

/**
 * @swagger
 * /api/logout:
 *   post:
 *     tags: [Authentication]
 *     summary: Déconnexion utilisateur
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */
apiRouter.post('/logout', userController.logout.bind(userController));

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Lister tous les utilisateurs
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 result:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/User' }
 */
apiRouter.get('/users', userController.getAllUsers.bind(userController));

/**
 * @swagger
 * /api/me:
 *   get:
 *     tags: [Users]
 *     summary: Récupérer les informations de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informations utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 result: { $ref: '#/components/schemas/User' }
 *       401:
 *         description: Non authentifié
 */
apiRouter.get('/me', authenticate,  userController.me.bind(userController));

/**
 * @swagger
 * /api/forgot-password:
 *   post:
 *     tags: [Password Reset]
 *     summary: Demander un lien de réinitialisation de mot de passe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email, example: "john@example.com" }
 *     responses:
 *       200:
 *         description: Email de réinitialisation envoyé
 *       404:
 *         description: Utilisateur non trouvé
 */
apiRouter.post('/forgot-password', ensureNotAuthenticated, passwordResetController.forgotPassword.bind(passwordResetController));

/**
 * @swagger
 * /api/reset-password:
 *   post:
 *     tags: [Password Reset]
 *     summary: Réinitialiser le mot de passe avec le token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, newPassword]
 *             properties:
 *               token: { type: string, example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
 *               newPassword: { type: string, format: password, minLength: 6, example: "newpass123" }
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé avec succès
 *       400:
 *         description: Token invalide ou expiré
 */
apiRouter.post('/reset-password', ensureNotAuthenticated, passwordResetController.resetPassword.bind(passwordResetController));

/**
 * @swagger
 * /api/upload/image:
 *   post:
 *     tags: [Images]
 *     summary: Upload une image sur Cloudinary
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Fichier image (jpg, png, gif, webp, max 5MB)
 *     responses:
 *       200:
 *         description: Image uploadée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 result:
 *                   type: object
 *                   properties:
 *                     url: { type: string, example: "https://res.cloudinary.com/..." }
 *       400:
 *         description: Format ou taille invalide
 *       401:
 *         description: Non authentifié
 *   delete:
 *     tags: [Images]
 *     summary: Supprimer une image de Cloudinary
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [imageUrl]
 *             properties:
 *               imageUrl: { type: string, example: "https://res.cloudinary.com/..." }
 *     responses:
 *       200:
 *         description: Image supprimée
 *       401:
 *         description: Non authentifié
 */
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

/**
 * @swagger
 * /api/articles/{id}:
 *   put:
 *     tags: [Articles]
 *     summary: Modifier un article (auteur ou admin uniquement)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string, example: "Titre modifié" }
 *               content: { type: string, example: "Contenu modifié..." }
 *               imageUrl: { type: string, nullable: true }
 *     responses:
 *       200:
 *         description: Article modifié
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Article non trouvé
 *   delete:
 *     tags: [Articles]
 *     summary: Supprimer un article (auteur ou admin uniquement)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Article supprimé
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Article non trouvé
 */
apiRouter.put('/articles/:id', authenticate, articleController.update.bind(articleController));
apiRouter.delete('/articles/:id', authenticate, articleController.delete.bind(articleController));

/**
 * @swagger
 * /api/articles/{articleId}/comments:
 *   post:
 *     tags: [Comments]
 *     summary: Créer un commentaire sur un article
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content: { type: string, minLength: 1, example: "Super article!" }
 *     responses:
 *       201:
 *         description: Commentaire créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 result: { $ref: '#/components/schemas/Comment' }
 *       404:
 *         description: Article non trouvé
 *   get:
 *     tags: [Comments]
 *     summary: Récupérer tous les commentaires d'un article
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Liste des commentaires
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 result:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Comment' }
 */
apiRouter.post('/articles/:articleId/comments', authenticate, commentController.createComment.bind(commentController));
apiRouter.get('/articles/:articleId/comments', authenticate, commentController.getCommentsByArticle.bind(commentController));

/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     tags: [Comments]
 *     summary: Modifier un commentaire (auteur ou admin uniquement)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content: { type: string, minLength: 1, example: "Commentaire modifié" }
 *     responses:
 *       200:
 *         description: Commentaire modifié
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Commentaire non trouvé
 *   delete:
 *     tags: [Comments]
 *     summary: Supprimer un commentaire (auteur ou admin uniquement)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Commentaire supprimé
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Commentaire non trouvé
 */
apiRouter.put('/comments/:id', authenticate, commentController.updateComment.bind(commentController));
apiRouter.delete('/comments/:id', authenticate, commentController.deleteComment.bind(commentController));

export default apiRouter;