import { applyDecorators, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export const InitController = (name: string) =>
  applyDecorators(Controller(name), ApiTags(name));
