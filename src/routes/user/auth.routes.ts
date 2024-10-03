import  AuthController  from '../../controllers/users/auth.ctrl';
import {Router} from 'express';
import AuthMiddleware from '../../middlewares/authMiddleware';

const authRoutes = Router();
const authController = new AuthController();

// login & signup
authRoutes.post('/login', authController.login);
authRoutes.post('/register', authController.signup);

// update password
authRoutes.put('/updatePassword', AuthMiddleware.isTokenValid, authController.updateUserPassword);

// remove db
authRoutes.delete('/deleteAll', AuthMiddleware.isTokenValid, authController.deleteAll);

export {authRoutes};