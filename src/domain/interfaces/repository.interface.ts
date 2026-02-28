import { Spot } from '../entities/spot.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { ParkingTicket } from '../entities/parking-ticket.entity';

export interface ISpotRepository {
  findFirstAvailable(): Promise<Spot | null>;
  findAllAvailable(): Promise<Spot[]>;
  findAll(): Promise<Spot[]>;
  findBySpotNumber(spotNumber: string): Promise<Spot | null>;
  update(spot: Spot): Promise<Spot>;
  save(spot: Spot): Promise<Spot>;
}

export interface IVehicleRepository {
  findByLicensePlate(licensePlate: string): Promise<Vehicle | null>;
  save(vehicle: Vehicle): Promise<Vehicle>;
}

export interface IParkingTicketRepository {
  save(ticket: ParkingTicket): Promise<ParkingTicket>;
  update(ticket: ParkingTicket): Promise<ParkingTicket>;
  findByTicketCode(ticketCode: string): Promise<ParkingTicket | null>;
  existsActiveByLicensePlate(licensePlate: string): Promise<boolean>;
  findActiveByCodeOrPlate(codeOrPlate: string): Promise<ParkingTicket | null>;
  findAllActive(): Promise<ParkingTicket[]>;
  findAllWithCheckOut(limit?: number): Promise<ParkingTicket[]>;
}