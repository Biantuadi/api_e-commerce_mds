import { Router } from 'express';
import { authRoutes } from './auth/auth.routes';
import { userRoutes } from './user/user.routes';
import { productRoutes } from './product/product.routes';
import { cartRoutes } from './cart/cart.routes';
import { orderRoutes } from './order/order.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);

export default router;
