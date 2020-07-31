import { Car } from './car.entity';
import { CAR_REPOSITORY } from '../core/constants';

export const carsProviders = [{
    provide: CAR_REPOSITORY,
    useValue: Car,
}];