import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { CreateRoleDto } from './dtos/create-role.dto';
import { RolesService } from './roles.service';
import { GetUsersQueryDto } from 'src/users/dtos/get-user.dto';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Post('')
  createRole(@Body() body: CreateRoleDto) {
    return this.rolesService.create(body);
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const role = await this.rolesService.findOne(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  @Get()
  findAll(@Query() query: GetUsersQueryDto, @Res() res: Response) {
    return this.rolesService.findAll(query).then((roles) => {
      res.json(roles);
    });
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() body: Partial<CreateRoleDto>) {
    return await this.rolesService.update(id, body);
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    return await this.rolesService.remove(id);
  }
}
