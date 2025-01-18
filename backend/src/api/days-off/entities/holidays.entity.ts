import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../shared/abstract.entity';
import { Iterations } from '../../iterations/entities/iterations.entity';
import { HolidayDto } from '../dto/holiday.dto';

@Entity()
export class Holidays extends AbstractEntity<HolidayDto> {
  @Column()
  name: string;

  @Column('simple-array', { nullable: true })
  dates: string[];

  @Column({ nullable: true })
  numberOfSelectedDays: number;

  @ManyToOne(() => Iterations)
  iteration: Iterations;

  dtoClass = HolidayDto;
}
