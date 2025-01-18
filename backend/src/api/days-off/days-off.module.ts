import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IterationsModule } from '../iterations/iterations.module';
import { Users } from '../users/entities/users.entity';
import { DaysOffController } from './days-off.controller';
import { DaysOffService } from './days-off.service';
import { DaysOff } from './entities/days-off.entity';
import { Holidays } from './entities/holidays.entity';

@Module({
  imports: [
    forwardRef(() => IterationsModule),
    TypeOrmModule.forFeature([DaysOff, Users, Holidays]),
  ],
  controllers: [DaysOffController],
  providers: [DaysOffService],
  exports: [DaysOffService],
})
export class DaysOffModule {}
