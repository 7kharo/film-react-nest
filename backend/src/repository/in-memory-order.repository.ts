import { OrderDto, TicketResponseDto } from 'src/order/dto/order.dto';
import { IOrderRepository } from './order.repository';
import { v4 as uuidv4 } from 'uuid';

export class InMemoryOrderRepository implements IOrderRepository {
  private orders = [];

  async createOrder(dto: OrderDto): Promise<TicketResponseDto[]> {
    const newOrder = dto.tickets.map((ticket) => {
      return { ...ticket, id: uuidv4() };
    });
    this.orders.push(newOrder);
    return newOrder;
  }
}
