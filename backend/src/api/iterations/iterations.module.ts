import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Users } from '../users/entities/users.entity';
import { Iterations } from './entities/iterations.entity';
import { IterationsController } from './iterations.controller';
import { IterationsService } from './iterations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Iterations, Users])],
  controllers: [IterationsController],
  providers: [IterationsService],
  exports: [IterationsService],
})
export class IterationsModule {}
