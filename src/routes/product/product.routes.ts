import { Router } from 'express';
import ProductController from '../../controllers/product.controller';
import AuthMiddleware from '../../middlewares/authMiddleware';

const productRoutes = Router();
const productController = new ProductController();

// Public routes to view products
productRoutes.get('/', productController.getAllProducts);
productRoutes.get('/:id', productController.getProductById);

// Protected routes for sellers
productRoutes.post('/', AuthMiddleware.isTokenValid, AuthMiddleware.isSeller, productController.addProduct);
productRoutes.put('/:id', AuthMiddleware.isTokenValid, AuthMiddleware.isSeller, productController.updateProduct);
productRoutes.delete('/:id', AuthMiddleware.isTokenValid, AuthMiddleware.isSeller, productController.deleteProduct);

export { productRoutes };
