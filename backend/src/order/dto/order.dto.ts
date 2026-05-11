//TODO реализовать DTO для /orders

import { IsArray, IsNumber, IsString } from 'class-validator';

export class TicketDto {
  @IsString()
  film: string;

  @IsString()
  session: string;

  @IsString()
  daytime: string;

  @IsString()
  day: string;

  @IsString()
  time: string;

  @IsNumber()
  row: number;

  @IsNumber()
  seat: number;

  @IsNumber()
  price: number;
}

export class OrderDto {
  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsArray()
  tickets: TicketDto[];
}

export class TicketResponseDto extends TicketDto {
  @IsString()
  id: string;
}

export class OrderResponseDto {
  @IsNumber()
  total: number;

  @IsArray()
  items: TicketResponseDto[];
}
