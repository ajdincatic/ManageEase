import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

import { RolesGuard } from '../guards/roles.guard';
import { UserType } from '../shared/enums/user-type.enum';

export const JwtAndRolesGuard = (...roles: UserType[]) =>
  applyDecorators(
    SetMetadata('roles', roles.length > 0 ? roles : undefined),
    UseGuards(AuthGuard('jwt'), RolesGuard),
    ApiBearerAuth(),
  );
