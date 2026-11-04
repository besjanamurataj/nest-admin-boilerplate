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
import { GetUsersQueryDto } from 'src/users/dtos/get-user.dto';
import { DepartmentService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';

@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post('')
  createDepartment(@Body() body: CreateDepartmentDto) {
    return this.departmentService.create(body);
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const department = await this.departmentService.findOne(id);

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return department;
  }

  @Get()
  findAll(@Query() query: GetUsersQueryDto, @Res() res: Response) {
    return this.departmentService.findAll(query).then((departments) => {
      res.json(departments);
    });
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<CreateDepartmentDto>,
  ) {
    return await this.departmentService.update(id, body);
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    return await this.departmentService.remove(id);
  }
}
