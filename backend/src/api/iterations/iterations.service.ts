import { Repository } from 'typeorm';

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserType } from '../../shared/enums/user-type.enum';
import { MomentService } from '../../shared/helpers/moment.service';
import { Users } from '../users/entities/users.entity';
import { CreateIterationDto } from './dto/create-iteration.dto';
import { EditIterationDto } from './dto/edit-iteration.dto';
import { Iterations } from './entities/iterations.entity';
import { IterationDto } from './dto/iteration.dto';

@Injectable()
export class IterationsService {
  constructor(
    @InjectRepository(Iterations)
    private readonly _iterationsRepository: Repository<Iterations>,
    @InjectRepository(Users)
    private readonly _usersRepository: Repository<Users>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const findIterations = await this._iterationsRepository.find();
    if (findIterations.length > 0) return;

    await this._iterationsRepository.save({
      name: 'TEST',
      startDate: new Date(),
      endDate: new Date(),
      isActive: true,
    });
  }

  async create(createIterationDto: CreateIterationDto): Promise<boolean> {
    const findIteration = await this._iterationsRepository.findOneBy({
      name: createIterationDto.name,
    });

    if (findIteration)
      throw new BadRequestException(
        `Iteration ${createIterationDto.name} already exsists`,
      );

    await this._iterationsRepository.save({
      ...createIterationDto,
      isActive: false,
    });

    return true;
  }

  async edit(editIterationDto: EditIterationDto): Promise<boolean> {
    const findIteration = await this._iterationsRepository
      .findOneByOrFail({ id: editIterationDto.iterationId })
      .catch(() => {
        throw new BadRequestException('Iteration not found.');
      });

    if (findIteration.isActive)
      throw new BadRequestException('Can not edit active iteration');

    const findIterationByName = await this._iterationsRepository.findOneBy({
      name: editIterationDto.name,
    });

    if (findIterationByName && findIteration.name !== editIterationDto.name)
      throw new BadRequestException(
        `Iteration ${editIterationDto.name} already exsists`,
      );

    await this._iterationsRepository.save({
      id: editIterationDto.iterationId,
      ...editIterationDto,
    });

    return true;
  }

  async delete(iterationId: number): Promise<boolean> {
    const findIteration = await this._iterationsRepository
      .findOneOrFail({
        where: { id: iterationId },
      })
      .catch(() => {
        throw new BadRequestException('Wrong iteration id');
      });

    if (findIteration.isActive)
      throw new BadRequestException('Can not delete active iteration');

    await this._iterationsRepository.delete(findIteration.id).catch(() => {
      throw new BadRequestException('Iteration can not be deleted.');
    });

    return true;
  }

  async activate(iterationId: number): Promise<boolean> {
    const findIteration = await this._iterationsRepository
      .findOneByOrFail({ id: iterationId })
      .catch(() => {
        throw new BadRequestException('Iteration not found.');
      });

    const users = await this._usersRepository.findBy({ type: UserType.USER });

    const startVacationDays = 20;

    for await (const user of users) {
      let numberOfVacationDays = startVacationDays;

      numberOfVacationDays = MomentService.calculateVacationDays(
        user?.dateOfEmployment,
        findIteration?.startDate,
      );

      await this._usersRepository.save({
        id: user.id,
        numberOfVacationDays,
      });
    }

    const allIterations = await this._iterationsRepository.find();

    for await (const iteration of allIterations) {
      await this._iterationsRepository.update(iteration.id, {
        isActive: false,
      });
    }

    await this._iterationsRepository.update(findIteration.id, {
      isActive: true,
    });

    return true;
  }

  async getIterations(): Promise<IterationDto[]> {
    const findIterations = await this._iterationsRepository.find({
      order: {
        createdAt: {
          direction: 'DESC',
        },
      },
    });

    return findIterations.toDtos();
  }

  async getActiveIteration(): Promise<IterationDto> {
    const iteration = await this._iterationsRepository
      .findOneByOrFail({ isActive: true })
      .catch(() => {
        throw new BadRequestException('No active iteration.');
      });

    return iteration.toDto();
  }
}
