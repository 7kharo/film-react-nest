import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { OrderDto, TicketResponseDto } from '../order/dto/order.dto';
import { IOrderRepository } from './order.repository';
import { Order } from '../order/entities/order.entity';

export class PostgresOrderRepository implements IOrderRepository {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
    ) {}

    async createOrder(dto: OrderDto): Promise<TicketResponseDto[]> {
        const tickets = dto.tickets.map(ticket => ({
            ...ticket, id: uuidv4(),}));
        const order = this.orderRepository.create({
            email: dto.email,
            phone: dto.phone,
            tickets,
        });
        await this.orderRepository.save(order);
        return tickets;
    }
}