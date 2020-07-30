import { Controller, OnModuleInit, Get, Param, Inject } from '@nestjs/common';
import { GrpcMethod, ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CarById } from './interfaces/car-by-id.interface';
import { Car } from './interfaces/car.interface';
import { CarService } from './interfaces/car-service.interface';

@Controller('cars')
export class CarsController implements OnModuleInit {
  private readonly items: Car[] = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Doe' },
  ];

  private carService: CarService;

  constructor(@Inject('CAR_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.carService = this.client.getService<CarService>('CarService');
  }

  // HTTP Endpoints
  @Get(':id')
  getById(@Param('id') id: string): Observable<Car> {
    return this.carService.findOne({ id: +id });
  }

  // GPRC Methods
  @GrpcMethod('CarService')
  findOne(data: CarById, metadata: any): Car {
    return this.items.find(({ id }) => id === data.id);
  }
}
