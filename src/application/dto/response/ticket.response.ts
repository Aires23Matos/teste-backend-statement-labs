import { ParkingTicket } from '../../../domain/entities/parking-ticket.entity';
import { PaymentStatus } from '../../../domain/enums/payment-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class TicketResponse {
  @ApiProperty()
  ticketCode: string;

  @ApiProperty()
  licensePlate: string;

  @ApiProperty()
  spotNumber: string;

  @ApiProperty()
  checkInTime: Date;

  @ApiProperty({ required: false })
  checkOutTime?: Date;

  @ApiProperty({ required: false })
  totalHours?: number;

  @ApiProperty({ required: false })
  totalAmount?: number;

  @ApiProperty({ enum: PaymentStatus })
  paymentStatus: PaymentStatus;

  @ApiProperty()
  formattedCheckIn: string;

  @ApiProperty({ required: false, nullable: true })
  formattedCheckOut?: string | null;  

  static fromDomain(ticket: ParkingTicket): TicketResponse {
    const formatter = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    return {
      ticketCode: ticket.ticketCode,
      licensePlate: ticket.vehicle.licensePlate,
      spotNumber: ticket.spot.spotNumber,
      checkInTime: ticket.checkInTime,
      checkOutTime: ticket.checkOutTime,
      totalHours: ticket.totalHours,
      totalAmount: ticket.totalAmount,
      paymentStatus: ticket.paymentStatus,
      formattedCheckIn: formatter.format(ticket.checkInTime),
      formattedCheckOut: ticket.checkOutTime 
        ? formatter.format(ticket.checkOutTime) 
        : null,  
    };
  }
}