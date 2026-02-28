import { Vehicle } from './vehicle.entity';
import { Spot } from './spot.entity';
import { PaymentStatus } from '../enums/payment-status.enum';

export class ParkingTicket {
  id?: string;
  ticketCode: string;
  vehicle: Vehicle;
  spot: Spot;
  checkInTime: Date;
  checkOutTime?: Date;
  totalHours?: number;
  totalAmount?: number;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ParkingTicket>) {
    Object.assign(this, partial);
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = this.updatedAt || new Date();
    this.paymentStatus = this.paymentStatus || PaymentStatus.PENDENTE;
  }

  calculateAmount(): number {
    if (!this.checkOutTime || !this.checkInTime) {
      throw new Error('Horários de entrada e saída são obrigatórios');
    }

    const minutes = Math.floor(
      (this.checkOutTime.getTime() - this.checkInTime.getTime()) / 60000,
    );

    if (minutes < 0) {
      throw new Error('Horário de saída não pode ser anterior à entrada');
    }

    // Arredondar para horas (sempre para cima)
    const hours = Math.ceil(minutes / 60);

    // Cálculo da tarifa
    // Até 6 horas: 300 Kz por hora
    // Após 6 horas: 200 Kz por hora adicional
    if (hours <= 6) {
      return hours * 300;
    } else {
      const additionalHours = hours - 6;
      return 6 * 300 + additionalHours * 200;
    }
  }

  checkOut(): void {
    if (this.checkOutTime) {
      throw new Error('Veículo já realizou check-out');
    }

    this.checkOutTime = new Date();
    this.totalHours = parseFloat(
      (
        (this.checkOutTime.getTime() - this.checkInTime.getTime()) /
        (1000 * 60 * 60)
      ).toFixed(2),
    );
    this.totalAmount = this.calculateAmount();
    this.paymentStatus = PaymentStatus.PAGO;
    this.updatedAt = new Date();

    // Liberar a vaga
    this.spot.release();
  }
}