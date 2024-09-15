import { Controller } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginDto } from '../dto/login.dto';
import { CreateUserDto } from '../dto/create-user.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({cmd: 'create user'})
  create(@Payload() createUserDto: CreateUserDto){
    return this.authService.create(createUserDto);
  }

  @MessagePattern({cmd: 'auth login user'})
  login(@Payload() loginUserDto: LoginDto){
    return this.authService.loginUser(loginUserDto);
  }
}
