import { Router } from 'express';
import CartController from '../../controllers/cart/cart.controller';
import AuthMiddleware from '../../middlewares/authMiddleware';

const cartRoutes = Router();
const cartController = new CartController();

// Get the cart for the logged-in buyer
cartRoutes.get('/', AuthMiddleware.isTokenValid, cartController.getCart);

// Add a product to the cart
cartRoutes.post('/add', AuthMiddleware.isTokenValid, cartController.addProductToCart);

// Update the quantity of a product in the cart
cartRoutes.put('/update', AuthMiddleware.isTokenValid, cartController.updateProductQuantity);

// Remove a product from the cart
cartRoutes.delete('/remove/:productId', AuthMiddleware.isTokenValid, cartController.removeProductFromCart);

export { cartRoutes };
