export class Vehicle {
  id?: string;
  licensePlate: string;
  model?: string;
  color?: string;
  createdAt: Date;

  constructor(partial: Partial<Vehicle>) {
    Object.assign(this, partial);
    this.createdAt = this.createdAt || new Date();
  }
}