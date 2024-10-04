import { Request, Response } from 'express';
import OrderService from '../../services/order.service';

const orderService = new OrderService();

export default class OrderController {
  
  // Create a new order
  public async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const { productIds, total_amount, shipping_address } = req.body;
      const userId = (req.body.user as { userID: string }).userID;

      // Find the user (buyer)
      const user = await orderService.findUserById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      // Create the new order
      const newOrder = await orderService.createOrder(user, {
        total_amount,
        shipping_address,
        product_ids: productIds,
      });

      res.status(201).json({ message: "Order created successfully", order: newOrder });
    } catch (error: any) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get all orders for the authenticated user
  public async getUserOrders(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.body.user as { userID: string }).userID;

      const orders = await orderService.findOrdersByUserId(userId);
      res.status(200).json(orders);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get order by ID
  public async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const orderId = req.params.id;

      const order = await orderService.findOrderById(orderId);
      if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
      }

      res.status(200).json(order);
    } catch (error: any) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Update order status
  public async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const orderId = req.params.id;
      const { status } = req.body;

      const updatedOrder = await orderService.updateOrderStatus(orderId, status);
      res.status(200).json({ message: "Order status updated successfully", order: updatedOrder });
    } catch (error: any) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Delete an order
  public async deleteOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderId = req.params.id;

      await orderService.deleteOrder(orderId);
      res.status(200).json({ message: "Order deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting order:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
