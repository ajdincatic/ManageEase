import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../shared/abstract.entity';
import { UserType } from '../../../shared/enums/user-type.enum';
import { DaysOff } from '../../days-off/entities/days-off.entity';
import { UserDto } from '../dto/user.dto';

@Entity()
export class Users extends AbstractEntity<UserDto> {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column('enum', { enum: UserType, default: UserType.USER })
  type: UserType;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column('date', { nullable: true })
  dateOfEmployment: Date;

  @Column({ nullable: true })
  calculateBasedOnDateOfEmployment: boolean;

  @Column({ nullable: true })
  numberOfVacationDays: number;

  @OneToMany(() => DaysOff, (x) => x.user)
  daysOff: DaysOff[];

  dtoClass = UserDto;
}
