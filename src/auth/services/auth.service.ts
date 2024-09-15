import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersRepository } from 'src/users/repositories/users.repository';
import { LoginDto } from '../dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class AuthService {

    constructor(private readonly usersRepository: UsersRepository,
                private readonly jwtService: JwtService
    ) { }

    
    async create(createUserDto: CreateUserDto) {
        try {

            // Verificar si el usuario ya existe
            const existingUser = await this.usersRepository.findOne({ email: createUserDto.email });
            if (existingUser) {
                throw new ConflictException('El correo electrónico ya está en uso');
            }
            // Encriptar la contraseña
            const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

            // Crear un nuevo objeto de usuario con la contraseña encriptada
            const userWithHashedPassword = {
                ...createUserDto,
                password: hashedPassword,
            };

            // Crear el usuario en la base de datos
            return await this.usersRepository.create(userWithHashedPassword);

        } catch (error) {
            if (error.message.includes('bcrypt')) {
                throw new InternalServerErrorException('Error al encriptar la contraseña');
            }

            throw new InternalServerErrorException('Error al crear el usuario');
        }
    }
    
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
