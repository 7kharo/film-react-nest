import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: OrderService;

  const mockOrderService = {
    createOrder: jest.fn(),
  };

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
    orderService = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create order and return result', async () => {
      const orderDto: OrderDto = {
        email: 'test@example.com',
        phone: '+79999999999',
        tickets: [
          {
            film: 'film-1',
            session: 'session-1',
            daytime: '2024-06-28T10:00:53+03:00',
            day: '28 июня',
            time: '10:00',
            row: 5,
            seat: 10,
            price: 350,
          },
        ],
      };

      const expectedResponse = {
        total: 1,
        items: [
          {
            id: 'order-1',
            ...orderDto.tickets[0],
          },
        ],
      };

      mockOrderService.createOrder.mockResolvedValue(expectedResponse);

      const result = await controller.createOrder(orderDto);

      expect(result).toEqual(expectedResponse);
      expect(mockOrderService.createOrder).toHaveBeenCalledWith(orderDto);
      expect(mockOrderService.createOrder).toHaveBeenCalledTimes(1);
    });
  });
});