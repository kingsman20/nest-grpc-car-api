import { Observable } from 'rxjs';
import { CarById } from './car-by-id.interface';
import { Car } from './car.interface';
import { CarDetails } from './car-details.interface';

export interface CarService {
  findAll(): Observable<Car>;
  findOne(data: CarById): Observable<Car>;
  createCar(data: CarDetails): Observable<Car>;
  updateCar(
    data: CarDetails,
  ): Promise<{
    numberOfAffectedRows: number;
    updatedCar: Car;
  }>;
}
