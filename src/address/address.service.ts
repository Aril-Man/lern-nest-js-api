/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AddressResponse, AddAddressRequest } from '../model/address.model';
import { User } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ValidationService } from '../common/validation.service';

@Injectable()
export class AddressService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private validationService: ValidationService,
  ) {}

  async addAddress(
    req: any,
    request: AddAddressRequest,
  ): Promise<AddressResponse> {
    const user: User = req.user;

    const contact = await this.prismaService.contact.findFirst({
      where: {
        user: user,
      },
    });

    if (!contact)
      throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);

    try {
      const address = await this.prismaService.address.create({
        data: {
          street: request.street,
          city: request.city,
          country: request.country,
          postal_code: request.postal_code,
          province: request.province,
          contact: {
            connect: {
              id: contact.id,
            },
          },
        },
      });

      return {
        user: {
          username: user.username,
          password: user.password,
        },
        address: address,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
