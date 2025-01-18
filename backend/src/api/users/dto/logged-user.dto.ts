import { ApiProperty } from '@nestjs/swagger';

import { UserType } from '../../../shared/enums/user-type.enum';
import { TokenPayloadDto } from '../auth/dto/token-payload.dto';
import { Users } from '../entities/users.entity';

export class LoggedUserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  type: UserType;

  @ApiProperty({ type: TokenPayloadDto })
  token: TokenPayloadDto;

  constructor(data: { user: Users; token: TokenPayloadDto }) {
    this.id = data.user.id;
    this.firstName = data.user.firstName;
    this.lastName = data.user.lastName;
    this.type = data.user.type;
    this.token = data.token;
  }
}
