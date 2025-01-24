import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { PrismaService } from './prisma.service';
import { ValidationService } from './validation.service';
import { APP_FILTER } from '@nestjs/core';
import { ErrorFillter } from './error.fillter';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    WinstonModule.forRoot({
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    }),
  ],
  providers: [
    PrismaService,
    ValidationService,
    {
      provide: APP_FILTER,
      useClass: ErrorFillter,
    },
  ],
  exports: [PrismaService, ValidationService],
})
export class CommonModule {}
