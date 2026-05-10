import { OrderDto, TicketResponseDto } from 'src/order/dto/order.dto';

export const ORDER_REPOSITORY = 'ORDER_REPOSITORY';
export interface IOrderRepository {
  createOrder(dto: OrderDto): Promise<TicketResponseDto[]>;
}
