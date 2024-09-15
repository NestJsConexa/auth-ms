import { Controller } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginDto } from '../dto/login.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({cmd: 'auth login user'})
  create(@Payload() loginUserDto: LoginDto){
    return this.authService.loginUser(loginUserDto);
  }
}
