import { Injectable } from '@nestjs/common';
import { IVehicleRepository } from '../../../../../domain/interfaces/repository.interface';
import { Vehicle } from '../../../../../domain/entities/vehicle.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MemoryVehicleRepository implements IVehicleRepository {
  private vehicles: Vehicle[] = [];

  async findByLicensePlate(licensePlate: string): Promise<Vehicle | null> {
    return this.vehicles.find((v) => v.licensePlate === licensePlate) || null;
  }

  async save(vehicle: Vehicle): Promise<Vehicle> {
    if (!vehicle.id) {
      vehicle.id = uuidv4();
    }
    
    const existingIndex = this.vehicles.findIndex((v) => v.id === vehicle.id);
    
    if (existingIndex >= 0) {
      this.vehicles[existingIndex] = vehicle;
    } else {
      this.vehicles.push(vehicle);
    }
    
    return vehicle;
  }
}