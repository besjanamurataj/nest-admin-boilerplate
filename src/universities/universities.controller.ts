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
import { UniversityService } from './universities.service';
import { GetUsersQueryDto } from 'src/users/dtos/get-user.dto';
import { CreateUniversityDto } from './dto/create-university.dto';

@Controller('universities')
export class UniversityController {
  constructor(private readonly universityService: UniversityService) {}

  @Post('')
  createUniversity(@Body() body: CreateUniversityDto) {
    return this.universityService.create(body);
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const university = await this.universityService.findOne(id);

    if (!university) {
      throw new NotFoundException('University not found');
    }

    return university;
  }

  @Get()
  findAll(@Query() query: GetUsersQueryDto, @Res() res) {
    return this.universityService.findAll(query).then((universities) => {
      res.json(universities);
    });
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<CreateUniversityDto>,
  ) {
    return await this.universityService.update(id, body);
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    return await this.universityService.remove(id);
  }
}
