import { Injectable, Inject, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CheckInRequest } from '../dto/request/check-in.request';
import { CheckOutRequest } from '../dto/request/check-out.request';
import { TicketResponse } from '../dto/response/ticket.response';
import { BusinessException } from '../exceptions/business.exception';
import { ResourceNotFoundException } from '../exceptions/resource-not-found.exception';
import type {  
  ISpotRepository,
  IVehicleRepository,
  IParkingTicketRepository,
} from '../../domain/interfaces/repository.interface';
import { Spot } from '../../domain/entities/spot.entity';
import { Vehicle } from '../../domain/entities/vehicle.entity';
import { ParkingTicket } from '../../domain/entities/parking-ticket.entity';

@Injectable()
export class ParkingService {
  private readonly logger = new Logger(ParkingService.name);

  constructor(
    @Inject('SPOT_REPOSITORY')
    private readonly spotRepository: ISpotRepository,  
    @Inject('VEHICLE_REPOSITORY')
    private readonly vehicleRepository: IVehicleRepository,  
    @Inject('TICKET_REPOSITORY')
    private readonly ticketRepository: IParkingTicketRepository,  
  ) {}

  async checkIn(request: CheckInRequest): Promise<TicketResponse> {
    this.logger.log(`Registrando entrada para veículo: ${request.licensePlate}`);

    // Validar formato da placa
    if (!this.isValidLicensePlate(request.licensePlate)) {
      throw new BusinessException('Formato de placa inválido. Use o padrão AAA9999');
    }

    // Verificar se veículo já está estacionado
    const hasActiveTicket = await this.ticketRepository.existsActiveByLicensePlate(
      request.licensePlate,
    );

    if (hasActiveTicket) {
      throw new BusinessException(
        `Veículo com placa ${request.licensePlate} já está estacionado`,
      );
    }

    // Buscar ou criar veículo
    let vehicle = await this.vehicleRepository.findByLicensePlate(
      request.licensePlate,
    );

    if (!vehicle) {
      vehicle = new Vehicle({
        licensePlate: request.licensePlate,
        model: request.model,
        color: request.color,
      });
      vehicle = await this.vehicleRepository.save(vehicle);
    }

    // Buscar vaga disponível
    const availableSpot = await this.spotRepository.findFirstAvailable();

    if (!availableSpot) {
      throw new BusinessException('Não há vagas disponíveis no momento');
    }

    // Ocupar a vaga
    availableSpot.occupy();
    await this.spotRepository.update(availableSpot);

    // Criar ticket
    const ticket = new ParkingTicket({
      ticketCode: this.generateTicketCode(),
      vehicle,
      spot: availableSpot,
      checkInTime: new Date(),
    });

    const savedTicket = await this.ticketRepository.save(ticket);
    this.logger.log(`Check-in realizado com sucesso. Ticket: ${savedTicket.ticketCode}`);

    return TicketResponse.fromDomain(savedTicket);
  }

  async checkOut(request: CheckOutRequest): Promise<TicketResponse> {
    this.logger.log(`Registrando saída para: ${request.ticketCodeOrPlate}`);

    // Buscar ticket ativo
    const ticket = await this.ticketRepository.findActiveByCodeOrPlate(
      request.ticketCodeOrPlate,
    );

    if (!ticket) {
      throw new ResourceNotFoundException('Ticket ativo não encontrado');
    }

    // Realizar check-out (já libera a vaga automaticamente)
    ticket.checkOut();
    const updatedTicket = await this.ticketRepository.update(ticket);

    this.logger.log(
      `Check-out realizado com sucesso. Valor a pagar: ${updatedTicket.totalAmount} Kz`,
    );

    return TicketResponse.fromDomain(updatedTicket);
  }

  async getAvailableSpots(): Promise<Spot[]> {
    return this.spotRepository.findAllAvailable();
  }

  async getAllSpots(): Promise<Spot[]> {
    return this.spotRepository.findAll();
  }

  async getActiveVehicles(): Promise<TicketResponse[]> {
    const activeTickets = await this.ticketRepository.findAllActive();
    return activeTickets.map(TicketResponse.fromDomain);
  }

  async getHistory(): Promise<TicketResponse[]> {
    const history = await this.ticketRepository.findAllWithCheckOut(100);
    return history.map(TicketResponse.fromDomain);
  }

  private generateTicketCode(): string {
    return `TKT-${uuidv4().substring(0, 8).toUpperCase()}`;
  }

  private isValidLicensePlate(plate: string): boolean {
    return /^[A-Z]{3}[0-9]{4}$/.test(plate);
  }
}