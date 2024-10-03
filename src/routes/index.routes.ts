import { Router } from 'express';
import { authRoutes } from './user/auth.routes';
import { userRoutes } from './user/user.routes';
import { productRoutes } from './product/product.routes';
import { cartRoutes } from './cart/cart.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);

export default router;
