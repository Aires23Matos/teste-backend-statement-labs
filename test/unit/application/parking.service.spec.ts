import { Test, TestingModule } from '@nestjs/testing';
import { ParkingService } from '../../../src/application/services/parking.service';
import { MemorySpotRepository } from '../../../src/infrastructure/database/repositories/implementations/memory/memory-spot.repository';
import { MemoryVehicleRepository } from '../../../src/infrastructure/database/repositories/implementations/memory/memory-vehicle.repository';
import { MemoryTicketRepository } from '../../../src/infrastructure/database/repositories/implementations/memory/memory-ticket.repository';
import { CheckInRequest } from '../../../src/application/dto/request/check-in.request';
import { CheckOutRequest } from '../../../src/application/dto/request/check-out.request';
import { BusinessException } from '../../../src/application/exceptions/business.exception';
import { ResourceNotFoundException } from '../../../src/application/exceptions/resource-not-found.exception';

describe('ParkingService', () => {
  let service: ParkingService;
  let spotRepo: MemorySpotRepository;
  let vehicleRepo: MemoryVehicleRepository;
  let ticketRepo: MemoryTicketRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParkingService,
        {
          provide: 'SPOT_REPOSITORY',
          useClass: MemorySpotRepository,
        },
        {
          provide: 'VEHICLE_REPOSITORY',
          useClass: MemoryVehicleRepository,
        },
        {
          provide: 'TICKET_REPOSITORY',
          useClass: MemoryTicketRepository,
        },
      ],
    }).compile();

    service = module.get<ParkingService>(ParkingService);
    spotRepo = module.get<MemorySpotRepository>('SPOT_REPOSITORY');
    vehicleRepo = module.get<MemoryVehicleRepository>('VEHICLE_REPOSITORY');
    ticketRepo = module.get<MemoryTicketRepository>('TICKET_REPOSITORY');
  });

  describe('checkIn', () => {
    it('should successfully check in a vehicle', async () => {
      const request: CheckInRequest = {
        licensePlate: 'ABC1234',
        model: 'Test Car',
        color: 'Blue',
      };

      const result = await service.checkIn(request);

      expect(result).toBeDefined();
      expect(result.licensePlate).toBe('ABC1234');
      expect(result.spotNumber).toBeDefined();
      expect(result.ticketCode).toMatch(/^TKT-/);
    });

    it('should throw error for invalid license plate format', async () => {
      const request: CheckInRequest = {
        licensePlate: 'INVALID',
        model: 'Test Car',
        color: 'Blue',
      };

      await expect(service.checkIn(request)).rejects.toThrow(
        BusinessException,
      );
      await expect(service.checkIn(request)).rejects.toThrow(
        'Formato de placa inválido',
      );
    });

    it('should throw error if vehicle is already parked', async () => {
      const request: CheckInRequest = {
        licensePlate: 'ABC1234',
        model: 'Test Car',
        color: 'Blue',
      };

      await service.checkIn(request);

      await expect(service.checkIn(request)).rejects.toThrow(
        BusinessException,
      );
      await expect(service.checkIn(request)).rejects.toThrow(
        'Veículo com placa ABC1234 já está estacionado',
      );
    });

    it('should throw error if no spots available', async () => {
      // Ocupar todas as 50 vagas
      for (let i = 0; i < 50; i++) {
        await service.checkIn({
          licensePlate: `ABC${i.toString().padStart(4, '0')}`,
        });
      }

      const request: CheckInRequest = {
        licensePlate: 'XYZ9999',
      };

      await expect(service.checkIn(request)).rejects.toThrow(
        BusinessException,
      );
      await expect(service.checkIn(request)).rejects.toThrow(
        'Não há vagas disponíveis no momento',
      );
    });
  });

  describe('checkOut', () => {
    it('should successfully check out a vehicle by ticket code', async () => {
      const checkInRequest: CheckInRequest = {
        licensePlate: 'ABC1234',
      };

      const checkInResult = await service.checkIn(checkInRequest);

      jest.useFakeTimers().setSystemTime(new Date(Date.now() + 4 * 60 * 60 * 1000));

      const checkOutRequest: CheckOutRequest = {
        ticketCodeOrPlate: checkInResult.ticketCode,
      };

      const result = await service.checkOut(checkOutRequest);

      expect(result).toBeDefined();
      expect(result.checkOutTime).toBeDefined();
      expect(result.totalAmount).toBe(1200); // 4 horas * 300

      jest.useRealTimers();
    });

    it('should successfully check out a vehicle by license plate', async () => {
      const checkInRequest: CheckInRequest = {
        licensePlate: 'ABC1234',
      };

      await service.checkIn(checkInRequest);

      jest.useFakeTimers().setSystemTime(new Date(Date.now() + 4 * 60 * 60 * 1000));

      const checkOutRequest: CheckOutRequest = {
        ticketCodeOrPlate: 'ABC1234',
      };

      const result = await service.checkOut(checkOutRequest);

      expect(result).toBeDefined();
      expect(result.licensePlate).toBe('ABC1234');
      expect(result.checkOutTime).toBeDefined();

      jest.useRealTimers();
    });

    it('should throw error if ticket not found', async () => {
      const request: CheckOutRequest = {
        ticketCodeOrPlate: 'INVALID',
      };

      await expect(service.checkOut(request)).rejects.toThrow(
        ResourceNotFoundException,
      );
    });
  });

  describe('getAvailableSpots', () => {
    it('should return all available spots', async () => {
      const spots = await service.getAvailableSpots();
      expect(spots.length).toBe(50); // Todas livres inicialmente

      await service.checkIn({ licensePlate: 'ABC1234' });

      const availableSpots = await service.getAvailableSpots();
      expect(availableSpots.length).toBe(49);
    });
  });

  describe('getActiveVehicles', () => {
    it('should return all active vehicles', async () => {
      await service.checkIn({ licensePlate: 'ABC1234' });
      await service.checkIn({ licensePlate: 'XYZ5678' });

      const activeVehicles = await service.getActiveVehicles();
      expect(activeVehicles.length).toBe(2);
    });
  });
});