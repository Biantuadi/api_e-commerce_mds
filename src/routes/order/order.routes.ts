import { Router } from 'express';
import OrderController from '../../controllers/order/order.controller';
import AuthMiddleware from '../../middlewares/authMiddleware';

const orderRoutes = Router();
const orderController = new OrderController();

// Create a new order
orderRoutes.post('/', AuthMiddleware.isTokenValid, orderController.createOrder);

// Get all orders for the authenticated user
orderRoutes.get('/', AuthMiddleware.isTokenValid, orderController.getUserOrders);

// Get order by ID
orderRoutes.get('/:id', AuthMiddleware.isTokenValid, orderController.getOrderById);

// Update order status
orderRoutes.put('/:id/status', AuthMiddleware.isTokenValid, orderController.updateOrderStatus);

// Delete an order
orderRoutes.delete('/:id', AuthMiddleware.isTokenValid, orderController.deleteOrder);

export { orderRoutes };
