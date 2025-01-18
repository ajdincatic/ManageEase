import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../shared/abstract.entity';
import { DayOffType } from '../../../shared/enums/day-off-type.enum';
import { Iterations } from '../../iterations/entities/iterations.entity';
import { Users } from '../../users/entities/users.entity';
import { DayOffDto } from '../dto/day-off.dto';

@Entity()
export class DaysOff extends AbstractEntity<DayOffDto> {
  @Column('enum', { enum: DayOffType })
  type: DayOffType;

  @Column('simple-array', { nullable: true })
  dates: string[];

  @Column({ nullable: true })
  numberOfSelectedDays: number;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  isApproved: boolean;

  @ManyToOne(() => Users, (x) => x.daysOff)
  user: Users;

  @ManyToOne(() => Iterations)
  iteration: Iterations;

  dtoClass = DayOffDto;
}
