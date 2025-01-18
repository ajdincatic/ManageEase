import { plainToClass } from 'class-transformer';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AbstractDto } from './abstract.dto';

export abstract class AbstractEntity<T extends AbstractDto = AbstractDto> {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  abstract dtoClass: new (entity: AbstractEntity) => T;

  toDto(): T {
    return plainToClass(this.dtoClass, this);
  }
}
