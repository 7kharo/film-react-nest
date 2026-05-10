import { OrderDto, TicketResponseDto } from 'src/order/dto/order.dto';
import { IOrderRepository } from './order.repository';
import { v4 as uuidv4 } from 'uuid';
import { Order } from 'src/order/schemas/order.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

export class MongoOrderRepository implements IOrderRepository {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async createOrder(dto: OrderDto): Promise<TicketResponseDto[]> {
    const newOrder = dto.tickets.map((ticket) => {
      return { ...ticket, id: uuidv4() };
    });
    const order = new this.orderModel({
      email: dto.email,
      phone: dto.phone,
      tickets: newOrder,
    });
    await order.save();
    return newOrder;
  }
}
