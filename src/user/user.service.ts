/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, Inject, Injectable } from '@nestjs/common';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UserResponse,
} from 'src/model/user.model';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../common/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private validation: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.info(`Register User Payload : ${JSON.stringify(request)}`);

    const registerRequest: RegisterUserRequest = this.validation.validate(
      UserValidation.REGISTER,
      request,
    );

    const existUser = await this.prismaService.user.count({
      where: {
        username: registerRequest.username,
      },
    });

    if (existUser != 0) {
      throw new HttpException('User already exist', 400);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);
    const user = await this.prismaService.user.create({
      data: registerRequest,
    });

    return {
      username: user.username,
      name: user.name,
    };
  }

  async login(request: LoginUserRequest): Promise<UserResponse> {
    this.logger.info(`Login User Payload : ${JSON.stringify(request)}`);

    const loginUserRequest: LoginUserRequest = this.validation.validate(
      UserValidation.LOGIN,
      request,
    );

    let user = await this.prismaService.user.findUnique({
      where: {
        username: loginUserRequest.username,
      },
    });

    if (!user) throw new HttpException('Username or password is invalid', 400);

    const isPasswordValid = await bcrypt.compare(
      loginUserRequest.password,
      user.password,
    );

    if (!isPasswordValid)
      throw new HttpException('Username or password is invalid', 400);

    const token = this.jwtService.sign(loginUserRequest, {
      algorithm: 'HS256',
      expiresIn: '1d',
      secret: process.env.JWT_SECRET,
    });

    user = await this.prismaService.user.update({
      where: {
        username: loginUserRequest.username,
      },
      data: {
        token: token,
      },
    });

    return {
      username: user.username,
      name: user.name,
      token: user.token || '',
    };
  }
}
