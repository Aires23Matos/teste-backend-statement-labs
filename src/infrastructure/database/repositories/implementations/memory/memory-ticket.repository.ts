import { Injectable } from '@nestjs/common';
import type { IParkingTicketRepository } from '../../../../../domain/interfaces/repository.interface';
import { ParkingTicket } from '../../../../../domain/entities/parking-ticket.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MemoryTicketRepository implements IParkingTicketRepository {
  private tickets: ParkingTicket[] = [];

  async save(ticket: ParkingTicket): Promise<ParkingTicket> {
    if (!ticket.id) {
      ticket.id = uuidv4();
    }
    this.tickets.push(ticket);
    return ticket;
  }

  async update(ticket: ParkingTicket): Promise<ParkingTicket> {
    const index = this.tickets.findIndex((t) => t.id === ticket.id);
    if (index >= 0) {
      this.tickets[index] = ticket;
    }
    return ticket;
  }

  async findByTicketCode(ticketCode: string): Promise<ParkingTicket | null> {
    return this.tickets.find((t) => t.ticketCode === ticketCode) || null;
  }

  async existsActiveByLicensePlate(licensePlate: string): Promise<boolean> {
    return this.tickets.some(
      (t) =>
        t.vehicle.licensePlate === licensePlate &&
        !t.checkOutTime &&
        t.paymentStatus === 'PENDENTE',
    );
  }

  async findActiveByCodeOrPlate(codeOrPlate: string): Promise<ParkingTicket | null> {
    return (
      this.tickets.find(
        (t) =>
          !t.checkOutTime &&
          (t.ticketCode === codeOrPlate || t.vehicle.licensePlate === codeOrPlate),
      ) || null
    );
  }

  async findAllActive(): Promise<ParkingTicket[]> {
    return this.tickets.filter((t) => !t.checkOutTime);
  }

  async findAllWithCheckOut(limit: number = 100): Promise<ParkingTicket[]> {
    const ticketsWithCheckOut = this.tickets.filter(
      (t): t is ParkingTicket & { checkOutTime: Date } => 
        t.checkOutTime !== undefined && t.checkOutTime !== null
    );
    
    return ticketsWithCheckOut
      .sort((a, b) => b.checkOutTime.getTime() - a.checkOutTime.getTime())
      .slice(0, limit);
  }
}