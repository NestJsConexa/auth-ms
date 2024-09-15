import { Controller } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from '../dto/create-user.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({cmd: 'create user'})
  create(@Payload() createUserDto: CreateUserDto){
    return this.usersService.create(createUserDto);
  }
}