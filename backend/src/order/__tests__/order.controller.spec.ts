import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../order.controller';
import { OrderService } from '../order.service';
import { OrderDto } from '../dto/order.dto';

const mockOrderService = {
  createOrder: jest.fn(),
};

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);

    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe('createOrder', () => {
    const validOrderDto: OrderDto = {
      email: 'test@example.com',
      phone: '+71234567890',
      tickets: [
        {
          film: 'film-1',
          session: 'session-1',
          daytime: '2024-06-28T10:00:53+03:00',
          day: '28 июня',
          time: '10:00',
          row: 3,
          seat: 5,
          price: 350,
        },
        {
          film: 'film-1',
          session: 'session-1',
          daytime: '2024-06-28T10:00:53+03:00',
          day: '28 июня',
          time: '10:00',
          row: 3,
          seat: 6,
          price: 350,
        },
      ],
    };

    const mockOrderResponse = {
      total: 2,
      items: [
        {
          id: 'order-1',
          film: 'film-1',
          session: 'session-1',
          daytime: '2024-06-28T10:00:53+03:00',
          day: '28 июня',
          time: '10:00',
          row: 3,
          seat: 5,
          price: 350,
        },
        {
          id: 'order-2',
          film: 'film-1',
          session: 'session-1',
          daytime: '2024-06-28T10:00:53+03:00',
          day: '28 июня',
          time: '10:00',
          row: 3,
          seat: 6,
          price: 350,
        },
      ],
    };

    it('should create order successfully', async () => {
      mockOrderService.createOrder.mockResolvedValue(mockOrderResponse);

      const result = await controller.createOrder(validOrderDto);

      expect(result).toEqual(mockOrderResponse);
      expect(mockOrderService.createOrder).toHaveBeenCalledWith(validOrderDto);
      expect(mockOrderService.createOrder).toHaveBeenCalledTimes(1);
    });

    it('should handle single ticket order', async () => {
      const singleTicketOrder: OrderDto = {
        email: 'single@example.com',
        phone: '+79876543210',
        tickets: [
          {
            film: 'film-2',
            session: 'session-2',
            daytime: '2024-06-29T15:00:00+03:00',
            day: '29 июня',
            time: '15:00',
            row: 1,
            seat: 1,
            price: 400,
          },
        ],
      };

      const singleTicketResponse = {
        total: 1,
        items: [
          {
            id: 'order-single',
            ...singleTicketOrder.tickets[0],
          },
        ],
      };

      mockOrderService.createOrder.mockResolvedValue(singleTicketResponse);

      const result = await controller.createOrder(singleTicketOrder);

      expect(result.total).toBe(1);
      expect(result.items).toHaveLength(1);
      expect(mockOrderService.createOrder).toHaveBeenCalledWith(singleTicketOrder);
    });

    it('should handle taken seats error', async () => {
      const takenSeatError = new Error('Место 5 ряд 3 уже занято');
      mockOrderService.createOrder.mockRejectedValue(takenSeatError);

      await expect(controller.createOrder(validOrderDto)).rejects.toThrow(
        'Место 5 ряд 3 уже занято',
      );
    });

    it('should handle invalid email format', async () => {
      const invalidEmailOrder: OrderDto = {
        ...validOrderDto,
        email: 'invalid-email',
      };

      const validationError = new Error('Invalid email format');
      mockOrderService.createOrder.mockRejectedValue(validationError);

      await expect(controller.createOrder(invalidEmailOrder)).rejects.toThrow();
    });

    it('should handle invalid phone format', async () => {
      const invalidPhoneOrder: OrderDto = {
        ...validOrderDto,
        phone: '123',
      };

      const validationError = new Error('Invalid phone format');
      mockOrderService.createOrder.mockRejectedValue(validationError);

      await expect(controller.createOrder(invalidPhoneOrder)).rejects.toThrow();
    });

    it('should handle empty tickets array', async () => {
      const emptyTicketsOrder: OrderDto = {
        email: 'empty@example.com',
        phone: '+71234567890',
        tickets: [],
      };

      const emptyResponse = {
        total: 0,
        items: [],
      };

      mockOrderService.createOrder.mockResolvedValue(emptyResponse);

      const result = await controller.createOrder(emptyTicketsOrder);

      expect(result.total).toBe(0);
      expect(result.items).toHaveLength(0);
    });
  });
});