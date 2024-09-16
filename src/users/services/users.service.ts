import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { InjectConnection } from '@nestjs/mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { Connection } from 'mongoose';
import { PaginationDto } from '../dto/pagination.dto';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class UsersService {

  constructor(
    @Inject('BUSINESS_SERVICE') private readonly businessClient: ClientProxy,
    @InjectConnection() private readonly connection: Connection,
    private readonly usersRepository: UsersRepository,
  ) { }

  async findAll(paginationDto: PaginationDto, token: string) {
    try {

      const result = firstValueFrom(
        this.businessClient.send(
          { cmd: 'get user pagination' },
          { paginationDto, token }
        ),
      );

      return result;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          throw new BadRequestException('Solicitud incorrecta');
        }
      }
      throw new InternalServerErrorException('Error al obtener la información de usuarios');
    }
  }

}