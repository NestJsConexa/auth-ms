import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

    constructor(private readonly usersRepository: UsersRepository) { }

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
}