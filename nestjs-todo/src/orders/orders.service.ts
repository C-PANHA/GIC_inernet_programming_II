import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class OrdersService {
  constructor(private readonly notifications: NotificationsService) {}

  createOrder(orderDto: CreateOrderDto) {
    const order = {
      ...orderDto,
      createdAt: new Date().toISOString(),
    };

    this.notifications.notify('order_created', { order });

    return { status: 'Order accepted', order };
  }
}
