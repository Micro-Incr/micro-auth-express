import { Router } from 'express';
import AuthController from '../../controllers/AuthController';

const AuthRouter = Router();

AuthRouter.post('/signup', AuthController.signUp);

AuthRouter.get('/signup/verify/:token', AuthController.verifySignupToken);

AuthRouter.post('/login', AuthController.login);

AuthRouter.post('/refresh', AuthController.refresh);

export default AuthRouter;
