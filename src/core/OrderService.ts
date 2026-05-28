import { Order, OrderStatus, OrderItem } from '../types';

export interface IOrderService {
  getOrdersByUser(userId: string): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean>;
  createOrder(userId: string, items: OrderItem[], total: number, startDate?: string, endDate?: string, shippingAddress?: string): Promise<Order>;
  deleteOrder(orderId: string): Promise<boolean>;
}

export class OrderService implements IOrderService {
  private key = 'siha_orders';

  constructor(initialOrders: Order[]) {
    if (!localStorage.getItem(this.key)) {
      localStorage.setItem(this.key, JSON.stringify(initialOrders));
    }
  }

  private getOrders(): Order[] {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  private saveOrders(orders: Order[]) {
    localStorage.setItem(this.key, JSON.stringify(orders));
    window.dispatchEvent(new Event('siha_orders_updated'));
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return this.getOrders().filter(o => o.userId === userId);
  }

  async getAllOrders(): Promise<Order[]> {
    return this.getOrders();
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index >= 0) {
      orders[index].status = status;
      this.saveOrders(orders);
      return true;
    }
    return false;
  }

  async createOrder(
    userId: string,
    items: OrderItem[],
    total: number,
    startDate?: string,
    endDate?: string,
    shippingAddress: string = 'SIHA Boutique Studio'
  ): Promise<Order> {
    const orders = this.getOrders();
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      userId,
      items,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      shippingAddress,
      startDate,
      endDate
    };
    orders.unshift(newOrder);
    this.saveOrders(orders);
    return newOrder;
  }

  async deleteOrder(orderId: string): Promise<boolean> {
    let orders = this.getOrders();
    const exists = orders.some(o => o.id === orderId);
    if (exists) {
      orders = orders.filter(o => o.id !== orderId);
      this.saveOrders(orders);
      return true;
    }
    return false;
  }
}
