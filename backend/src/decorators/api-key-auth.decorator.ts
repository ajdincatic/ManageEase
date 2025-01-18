import { ApiSecurity } from '@nestjs/swagger';

export const ApiKeyAuth = () => ApiSecurity('Api-Key');
