import { Router } from "express";
import { UserController } from "../controllers/UserController.ts";

const apiRouter = Router();

const userController = new UserController();

apiRouter.get('/status', (req, res) => {
  res.json({ status: 'ok' })
});

apiRouter.post('/register', userController.register.bind(userController));
apiRouter.post('/login', userController.login.bind(userController));

export default apiRouter;