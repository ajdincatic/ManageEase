import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../../shared/abstract.entity';
import { IterationDto } from '../dto/iteration.dto';

@Entity()
export class Iterations extends AbstractEntity<IterationDto> {
  @Column()
  name: string;

  @Column('date', { nullable: true })
  startDate: Date;

  @Column('date', { nullable: true })
  endDate: Date;

  @Column()
  isActive: boolean;

  dtoClass = IterationDto;
}
