import { Router } from "express";
import { UserController } from "../controllers/UserController.ts";
import { PasswordController } from "../controllers/PasswordController.ts";

const apiRouter = Router();

const userController = new UserController();
const passwordController = new PasswordController();

apiRouter.get('/status', (req, res) => {
  res.json({ status: 'ok' })
});

apiRouter.post('/register', userController.register.bind(userController));
apiRouter.post('/login', userController.login.bind(userController));

apiRouter.post('/password/forgot', passwordController.forgotPassword.bind(passwordController));
apiRouter.post('/password/reset', passwordController.resetPassword.bind(passwordController));

export default apiRouter;