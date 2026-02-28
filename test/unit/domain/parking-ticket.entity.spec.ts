import { ParkingTicket } from '../../../src/domain/entities/parking-ticket.entity';
import { Spot } from '../../../src/domain/entities/spot.entity';
import { Vehicle } from '../../../src/domain/entities/vehicle.entity';
import { SpotStatus } from '../../../src/domain/enums/spot-status.enum';
import { PaymentStatus } from '../../../src/domain/enums/payment-status.enum';

describe('ParkingTicket Entity', () => {
  let spot: Spot;
  let vehicle: Vehicle;

  beforeEach(() => {
    spot = new Spot({
      id: '1',
      spotNumber: '01',
      status: SpotStatus.LIVRE,
    });

    vehicle = new Vehicle({
      id: '1',
      licensePlate: 'ABC1234',
      model: 'Test Car',
      color: 'Blue',
    });
  });

  describe('calculateAmount', () => {
    it('should calculate amount correctly for 2 hours', () => {
      const checkInTime = new Date('2024-01-01T10:00:00');
      const checkOutTime = new Date('2024-01-01T12:00:00');

      const ticket = new ParkingTicket({
        checkInTime,
        checkOutTime,
        vehicle,
        spot,
      });

      const amount = ticket.calculateAmount();
      expect(amount).toBe(600); // 2 * 300
    });

    it('should calculate amount correctly for 6 hours', () => {
      const checkInTime = new Date('2024-01-01T10:00:00');
      const checkOutTime = new Date('2024-01-01T16:00:00');

      const ticket = new ParkingTicket({
        checkInTime,
        checkOutTime,
        vehicle,
        spot,
      });

      const amount = ticket.calculateAmount();
      expect(amount).toBe(1800); // 6 * 300
    });

    it('should calculate amount correctly for 8 hours', () => {
      const checkInTime = new Date('2024-01-01T10:00:00');
      const checkOutTime = new Date('2024-01-01T18:00:00');

      const ticket = new ParkingTicket({
        checkInTime,
        checkOutTime,
        vehicle,
        spot,
      });

      const amount = ticket.calculateAmount();
      expect(amount).toBe(2200); // (6 * 300) + (2 * 200)
    });

    it('should round up fractional hours', () => {
      const checkInTime = new Date('2024-01-01T10:00:00');
      const checkOutTime = new Date('2024-01-01T12:30:00');

      const ticket = new ParkingTicket({
        checkInTime,
        checkOutTime,
        vehicle,
        spot,
      });

      const amount = ticket.calculateAmount();
      expect(amount).toBe(900); // 3 * 300 (arredondou 2.5h para 3h)
    });

    it('should throw error if checkOutTime is before checkInTime', () => {
      const checkInTime = new Date('2024-01-01T12:00:00');
      const checkOutTime = new Date('2024-01-01T10:00:00');

      const ticket = new ParkingTicket({
        checkInTime,
        checkOutTime,
        vehicle,
        spot,
      });

      expect(() => ticket.calculateAmount()).toThrow(
        'Horário de saída não pode ser anterior à entrada',
      );
    });

    it('should throw error if checkOutTime is missing', () => {
      const ticket = new ParkingTicket({
        checkInTime: new Date(),
        vehicle,
        spot,
      });

      expect(() => ticket.calculateAmount()).toThrow(
        'Horários de entrada e saída são obrigatórios',
      );
    });
  });

  describe('checkOut', () => {
    it('should perform check-out correctly', () => {
      const checkInTime = new Date('2024-01-01T10:00:00');
      jest.useFakeTimers().setSystemTime(new Date('2024-01-01T14:00:00'));

      const ticket = new ParkingTicket({
        ticketCode: 'TKT-123',
        checkInTime,
        vehicle,
        spot,
      });

      ticket.checkOut();

      expect(ticket.checkOutTime).toBeDefined();
      expect(ticket.totalHours).toBe(4);
      expect(ticket.totalAmount).toBe(1200); // 4 * 300
      expect(ticket.paymentStatus).toBe(PaymentStatus.PAGO);
      expect(ticket.spot.status).toBe(SpotStatus.LIVRE);

      jest.useRealTimers();
    });

    it('should throw error if check-out already performed', () => {
      const ticket = new ParkingTicket({
        checkInTime: new Date(),
        checkOutTime: new Date(),
        vehicle,
        spot,
      });

      expect(() => ticket.checkOut()).toThrow('Veículo já realizou check-out');
    });
  });
});