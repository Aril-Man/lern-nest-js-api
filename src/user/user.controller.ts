import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { WebResponse } from '../model/web.model';
import { AuthGuard } from '../security/auth.guard';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UserResponse,
} from '../model/user.model';
import { RequestUpdateUser } from '../model/user.model';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  /**
   * Registers a new user and returns the user details
   * @param request Request body with the user details
   * @returns WebResponse with the user data
   */
  async register(
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.register(request);

    return {
      data: result,
    };
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  /**
   * Logs in the user and returns the user details
   * @param request Request body with the username and password
   * @returns WebResponse with the user data
   */
  async login(
    @Body() request: LoginUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.login(request);

    return {
      data: result,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  @HttpCode(HttpStatus.OK)
  /**
   * Get current user
   * @param user Current user from the request
   * @returns WebResponse with the user data
   */
  async me(@Request() user: any): Promise<WebResponse<UserResponse>> {
    return {
      data: await this.userService.me(user),
    };
  }

  @UseGuards(AuthGuard)
  @Put('/update')
  @HttpCode(HttpStatus.OK)
  /**
   * Updates the user based on the user id
   * @param user User details from the request
   * @param request Request body with the user details to update
   * @returns The updated user
   */
  async updateUser(
    @Request() user: any,
    @Body() request: RequestUpdateUser,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.updateUser(user, request);

    return {
      data: result,
    };
  }
}
