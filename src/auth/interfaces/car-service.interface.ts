import { Observable } from 'rxjs';
import { UserDetails } from './user-details.interface';
import { UserData } from './user-data.interface';
import { UserDto } from '../../users/dto/user.dto';
import { TopUp } from './top-up.interface';
import { User } from './user.interface';

export interface CarService {
  login(data: UserDetails): Observable<UserData>;
  register(data: UserDto): Observable<UserData>;
  topUp(data: TopUp): Observable<User>;
}
