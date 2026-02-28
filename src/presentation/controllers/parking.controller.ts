import {
  Controller,
  Post,
  Get,
  Body,
  HttpStatus,
  HttpCode,
  UseFilters,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ParkingService } from '../../application/services/parking.service';
import { CheckInRequest } from '../../application/dto/request/check-in.request';
import { CheckOutRequest } from '../../application/dto/request/check-out.request';
import { TicketResponse } from '../../application/dto/response/ticket.response';
import { ErrorResponse } from '../../application/dto/response/error.response';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

@ApiTags('Estacionamento')
@Controller('api/parking')
@UseFilters(HttpExceptionFilter)
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  @Post('check-in')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar entrada de veículo' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Check-in realizado com sucesso',
    type: TicketResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Veículo já estacionado',
    type: ErrorResponse,
  })
  async checkIn(@Body() request: CheckInRequest): Promise<TicketResponse> {
    return this.parkingService.checkIn(request);
  }

  @Post('check-out')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Registrar saída de veículo' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Check-out realizado com sucesso',
    type: TicketResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ticket não encontrado',
    type: ErrorResponse,
  })
  async checkOut(@Body() request: CheckOutRequest): Promise<TicketResponse> {
    return this.parkingService.checkOut(request);
  }

  @Get('spots')
  @ApiOperation({ summary: 'Listar todas as vagas' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de vagas' })
  async getAllSpots() {
    return this.parkingService.getAllSpots();
  }

  @Get('spots/available')
  @ApiOperation({ summary: 'Listar vagas disponíveis' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Vagas disponíveis' })
  async getAvailableSpots() {
    return this.parkingService.getAvailableSpots();
  }

  @Get('active')
  @ApiOperation({ summary: 'Listar veículos estacionados' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Veículos ativos',
    type: [TicketResponse],
  })
  async getActiveVehicles(): Promise<TicketResponse[]> {
    return this.parkingService.getActiveVehicles();
  }

  @Get('history')
  @ApiOperation({ summary: 'Listar histórico de estadias' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Histórico de estadias',
    type: [TicketResponse],
  })
  async getHistory(): Promise<TicketResponse[]> {
    return this.parkingService.getHistory();
  }
}