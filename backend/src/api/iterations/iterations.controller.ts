import { Body, Get, Post, Put } from '@nestjs/common';

import { ApiKeyAuth } from '../../decorators/api-key-auth.decorator';
import { InitController } from '../../decorators/init-controller.decorator';
import { JwtAndRolesGuard } from '../../decorators/jwt-roles-guard.decorator';
import { UserType } from '../../shared/enums/user-type.enum';
import { CreateIterationDto } from './dto/create-iteration.dto';
import { EditIterationDto } from './dto/edit-iteration.dto';
import { HandleIterationDto } from './dto/handle-iteration.dto';
import { IterationsService } from './iterations.service';

@InitController('iterations')
@ApiKeyAuth()
export class IterationsController {
  constructor(private readonly _iterationsService: IterationsService) {}

  @Post('create')
  @JwtAndRolesGuard(UserType.OWNER)
  async create(@Body() createIterationDto: CreateIterationDto) {
    return await this._iterationsService.create(createIterationDto);
  }

  @Put('edit')
  @JwtAndRolesGuard(UserType.OWNER)
  async edit(@Body() editIterationDto: EditIterationDto) {
    return await this._iterationsService.edit(editIterationDto);
  }

  @Post('delete')
  @JwtAndRolesGuard(UserType.OWNER)
  async delete(@Body() handleIterationDto: HandleIterationDto) {
    return await this._iterationsService.delete(handleIterationDto.iterationId);
  }

  @Put('activate-iteration')
  @JwtAndRolesGuard(UserType.OWNER)
  async activate(@Body() handleIterationDto: HandleIterationDto) {
    return await this._iterationsService.activate(
      handleIterationDto.iterationId,
    );
  }

  @Get('/')
  @JwtAndRolesGuard(UserType.OWNER)
  async getIterations() {
    return await this._iterationsService.getIterations();
  }

  @Get('active-iteration')
  @JwtAndRolesGuard()
  async getActiveIteration() {
    return await this._iterationsService.getActiveIteration();
  }
}
