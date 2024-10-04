import { getRepository } from 'typeorm';
import { Order } from '../entity/Order';
import { User } from '../entity/User';

export default class OrderService {
  public async findUserById(userId: string) {
    const userRepository = getRepository(User);
    return await userRepository.findOne({ where: { id: userId } });
  }

  public async createOrder(user: User, orderData: Partial<Order>) {
    const orderRepository = getRepository(Order);
    const newOrder = orderRepository.create({
      ...orderData,
      user,
      status: 'pending',  // Default status
    });
    return await orderRepository.save(newOrder);
  }

  public async findOrdersByUserId(userId: string) {
    const orderRepository = getRepository(Order);
    return await orderRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' }
    });
  }

  public async findOrderById(orderId: string) {
    const orderRepository = getRepository(Order);
    return await orderRepository.findOne({ where: { id: orderId } });
  }

  public async updateOrderStatus(orderId: string, status: string) {
    const orderRepository = getRepository(Order);
    const order = await orderRepository.findOne({ where: { id: orderId } });
    if (!order) throw new Error('Order not found');
    order.status = status;
    return await orderRepository.save(order);
  }

  public async deleteOrder(orderId: string) {
    const orderRepository = getRepository(Order);
    const order = await orderRepository.findOne({ where: { id: orderId } });
    if (!order) throw new Error('Order not found');
    return await orderRepository.remove(order);
  }
}
