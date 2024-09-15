import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDocument, UserSchema } from '../auth/schemas/user.schema';
import { UsersRepository } from './repositories/users.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [DatabaseModule,
    MongooseModule.forFeature([{ name: UserDocument.name, schema: UserSchema }]),
    ConfigModule.forRoot(),
    ClientsModule.registerAsync([
      {
        name: 'BUSINESS_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('BUSINESS_SERVICE_HOST'),
            port: parseInt(configService.get<string>('BUSINESS_SERVICE_PORT'), 10),
          },
        }),
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersRepository]
})
export class UsersModule {}
