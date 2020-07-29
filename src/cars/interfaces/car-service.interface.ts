import { Observable } from 'rxjs';
import { CarById } from './car-by-id.interface';
import { Car } from './car.interface';

export interface CarService {
  findOne(data: CarById): Observable<Car>;
}
