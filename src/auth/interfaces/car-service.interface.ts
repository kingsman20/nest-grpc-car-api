import { Observable } from 'rxjs';
import { UserDetails } from './user-details.interface';
import { UserData } from './user-data.interface';
import {UserDto } from '../../users/dto/user.dto'

export interface CarService {
  login(data: UserDetails): Observable<UserData>;
  register(data: UserDto): Observable<UserData>
}
