import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  NotFoundException,
  UseGuards,
  Res,
  UseInterceptors,
  ParseIntPipe,
  Put,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from 'src/users/dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interception';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { GetUsersQueryDto } from './dtos/get-user.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { Public } from 'src/shared/decoratores/public.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { BatchService } from 'src/batch/batch.service';
import { User } from './user.entity';
import { AuthenticatedRequest } from '../models/authenticated-request.interface';

@Controller('users')
@Serialize(UserDto)
@UseInterceptors(Serialize)
@UseGuards(AuthGuard)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private batchService: BatchService,
  ) {}

  @Post('/signup')
  @Public()
  async signup(@Body() body: User): Promise<User> {
    const user = await this.authService.signup(body);
    return user;
  }

  @Public()
  @Post()
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.usersService.find(body.email);
    if (user) {
      throw new NotFoundException('User with this email already exists');
    }
    return this.usersService.create(body);
  }

  @Get()
  findAll(@Query() query: GetUsersQueryDto, @Res() res): Promise<User> {
    return this.usersService.findAll(query).then((result) => {
      return res.json(result);
    });
  }

  @Put('change-password')
  changePassword(@Body() dto: ChangePasswordDto, @Req() req) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException("Password don't match");
    }
    return this.usersService.changePassword(req.user.userId, dto.password);
  }

  @Put('')
  updateProfile(@Body() dto: UpdateUserDto, @Req() req) {
    return this.usersService.update(req.user.userId, dto);
  }

  @Get('/:id')
  @Serialize(UserDto)
  async findUser(@Param('id') id: number) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() attrs: Partial<UpdateUserDto>,
  ) {
    return this.usersService.update(id, attrs);
  }

  @Delete(':id')
  removeUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
