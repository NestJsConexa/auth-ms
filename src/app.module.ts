import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required()
      })
    }),
    DatabaseModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
