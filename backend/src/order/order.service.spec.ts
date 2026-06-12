import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { ORDER_REPOSITORY, IOrderRepository } from '../repository/order.repository';
import { FILM_REPOSITORY, IFilmRepository } from '../repository/film.repository';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: IOrderRepository;
  let filmRepository: IFilmRepository;

  const mockOrderRepository = {
    createOrder: jest.fn(),
  };

  const mockFilmRepository = {
    getFilms: jest.fn(),
    getFilmById: jest.fn(),
    getIdSchedule: jest.fn(),
    addTakenPlace: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: ORDER_REPOSITORY,
          useValue: mockOrderRepository,
        },
        {
          provide: FILM_REPOSITORY,
          useValue: mockFilmRepository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get<IOrderRepository>(ORDER_REPOSITORY);
    filmRepository = module.get<IFilmRepository>(FILM_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create order successfully', async () => {
      const orderDto = {
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

      const mockSessions = [
        {
          id: 'session-1',
          filmId: 'film-1',
          daytime: '2024-06-28T10:00:53+03:00',
          hall: 1,
          rows: 5,
          seats: 10,
          price: 350,
          taken: [],
        },
      ];

      const mockOrderResult = [
        {
          id: 'order-1',
          ...orderDto.tickets[0],
        },
      ];

      mockFilmRepository.getIdSchedule.mockResolvedValue(mockSessions);
      mockFilmRepository.addTakenPlace.mockResolvedValue(undefined);
      mockOrderRepository.createOrder.mockResolvedValue(mockOrderResult);

      const result = await service.createOrder(orderDto);

      expect(result.total).toBe(1);
      expect(result.items).toEqual(mockOrderResult);
      expect(mockFilmRepository.getIdSchedule).toHaveBeenCalledWith('film-1');
      expect(mockFilmRepository.addTakenPlace).toHaveBeenCalledWith('film-1', 'session-1', 5, 10);
      expect(mockOrderRepository.createOrder).toHaveBeenCalledWith(orderDto);
    });

    it('should throw BadRequestException if seat is already taken', async () => {
      const orderDto = {
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

      const mockSessions = [
        {
          id: 'session-1',
          filmId: 'film-1',
          daytime: '2024-06-28T10:00:53+03:00',
          hall: 1,
          rows: 5,
          seats: 10,
          price: 350,
          taken: ['5:10'], // место уже занято
        },
      ];

      mockFilmRepository.getIdSchedule.mockResolvedValue(mockSessions);

      await expect(service.createOrder(orderDto)).rejects.toThrow(
        'Место 10 ряд 5 уже занято',
      );
      expect(mockFilmRepository.addTakenPlace).not.toHaveBeenCalled();
      expect(mockOrderRepository.createOrder).not.toHaveBeenCalled();
    });
  });
});