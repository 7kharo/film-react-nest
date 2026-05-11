//TODO реализовать DTO для /orders

export class TicketDto {
  film: string;
  session: string;
  daytime: string;
  day: string;
  time: string;
  row: number;
  seat: number;
  price: number;
}

export class OrderDto {
  email: string;
  phone: string;
  tickets: TicketDto[];
}

export class TicketResponseDto extends TicketDto {
  id: string;
}

export class OrderResponseDto {
  total: number;
  items: TicketResponseDto[];
}
