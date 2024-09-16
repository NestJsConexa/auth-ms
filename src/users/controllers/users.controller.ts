import { Controller, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaginationDto } from '../dto/pagination.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @MessagePattern({ cmd: 'get user pagination' })
  async findAll(@Payload() paginationDto: PaginationDto, token: string) {
    return this.usersService.findAll(paginationDto, token);
  }

}