import { IsNotEmpty, Matches, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ minLength: 8 })
  @IsNotEmpty()
  public oldPassword: string;

  @ApiProperty({ minLength: 8 })
  @Matches(/^(?:(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*)$/, {
    message: 'Password must contain one uppercase letter and one number',
  })
  @MinLength(8)
  @IsNotEmpty()
  public newPassword: string;

  @ApiProperty({ minLength: 8 })
  @Matches(/^(?:(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*)$/, {
    message: 'Password must contain one uppercase letter and one number',
  })
  @MinLength(8)
  @IsNotEmpty()
  public newPasswordConfirmation: string;
}
