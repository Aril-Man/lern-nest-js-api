/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
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
import * as jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { RequestUpdateUser } from '../model/user.model';

@Injectable()
export class UserService {
  constructor(
    private validation: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
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
      throw new HttpException('User already exist', HttpStatus.BAD_REQUEST);
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

  async logout(req: any): Promise<UserResponse> {
    const user: User = req.user;

    try {
      await this.prismaService.user.update({
        where: {
          username: user.username,
        },
        data: {
          token: null,
        },
      });

      return {
        username: user.username,
        name: user.name,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
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

    if (!user)
      throw new HttpException(
        'Username or password is invalid',
        HttpStatus.BAD_REQUEST,
      );

    const isPasswordValid = await bcrypt.compare(
      loginUserRequest.password,
      user.password,
    );

    if (!isPasswordValid)
      throw new HttpException(
        'Username or password is invalid',
        HttpStatus.BAD_REQUEST,
      );

    const token = jwt.sign(loginUserRequest, process.env.JWT_SECRET as string, {
      expiresIn: '1d',
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

  async me(req: any): Promise<UserResponse> {
    const user: User = req.user;

    return {
      username: user.username,
      name: user.name,
    };
  }

  async updateUser(
    req: any,
    request: RequestUpdateUser,
  ): Promise<UserResponse> {
    this.logger.info(`Update User Payload : ${JSON.stringify(request)}`);

    this.logger.info(`Update User Payload : ${JSON.stringify(req.user)}`);

    const user: User = req.user;

    this.validation.validate(UserValidation.UPDATE, request);

    const existUser = await this.prismaService.user.findFirst({
      where: {
        username: user.username,
      },
    });

    if (!existUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    await this.prismaService.user.update({
      where: {
        username: user.username,
      },
      data: {
        name: request.name,
      },
    });

    return {
      username: user.username,
      name: request.name,
    };
  }
}
