import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { AddAddressRequest, AddressResponse } from '../model/address.model';
import { WebResponse } from '../model/web.model';
import { AuthGuard } from '../security/auth.guard';

@Controller('/api/address')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.OK)
  /**
   * Add a new address
   *
   * @param req The current request, holding the user information.
   * @param request The address details to add.
   * @returns A WebResponse containing the added address.
   */
  async addAddress(
    @Request() req: any,
    @Body() request: AddAddressRequest,
  ): Promise<WebResponse<AddressResponse>> {
    const result = await this.addressService.addAddress(req, request);

    return {
      data: result,
    };
  }

  @UseGuards(AuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  /**
   * Get the address of the user.
   *
   * @param req The current request, holding the user information.
   * @returns A WebResponse containing the user's address.
   */
  async getAddress(@Request() req: any): Promise<WebResponse<AddressResponse>> {
    const result = await this.addressService.getAddress(req);

    return {
      data: result,
    };
  }
}
