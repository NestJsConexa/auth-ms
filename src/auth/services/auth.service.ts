import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersRepository } from 'src/users/repositories/users.repository';
import { LoginDto } from '../dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(private readonly usersRepository: UsersRepository,
                private readonly jwtService: JwtService
    ) { }

    async loginUser(loginUserDto: LoginDto): Promise<{accessToken: string }> {
        const { email, password } = loginUserDto;

        try {
            const existingUser = await this.usersRepository.findOne({ email });
            if (!existingUser) {
                throw new ConflictException('Usuario o contraseña no validos');
            }

            const isPasswordValid = bcrypt.compareSync(password, existingUser.password);

            if (!isPasswordValid) {
                throw new ConflictException('Contraseña incorrecta');
            }

            const payload = { email: existingUser.email, sub: existingUser._id };
            const accessToken = this.jwtService.sign(payload);

            return {accessToken};


        } catch (error) {
            throw new InternalServerErrorException('Error al loguearse');
        }
    }

}
