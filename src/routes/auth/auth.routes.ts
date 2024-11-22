import  AuthController  from '../../controllers/auth/auth.ctrl';
import {Router} from 'express';
import AuthMiddleware from '../../middlewares/authMiddleware';

const authRoutes = Router();
const authController = new AuthController();

// login & signup
authRoutes.post('/login', authController.login);
authRoutes.post('/register', authController.signup);

// remove db
authRoutes.delete('/deleteAll', AuthMiddleware.isTokenValid, AuthMiddleware.isAdmin, authController.deleteAll);

export {authRoutes};