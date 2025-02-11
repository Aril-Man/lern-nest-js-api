/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  AddressResponse,
  AddAddressRequest,
  UpdateAddressRequest,
} from '../model/address.model';
import { Address, User } from '@prisma/client';
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
        username: user.username,
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
          name: user.name,
        },
        contact: contact,
        address: address,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAddress(req: any): Promise<AddressResponse> {
    const user: User = req.user;

    const contact = await this.prismaService.contact.findFirst({
      where: {
        username: user.username,
      },
    });

    if (!contact)
      throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);

    const address = await this.prismaService.address.findFirst({
      where: {
        contact_id: contact.id,
      },
    });

    this.logger.info('Data Address : ', JSON.stringify(contact));

    return {
      user: {
        username: user.username,
        name: user.name,
      },
      contact: contact,
      address: address as Address,
    };
  }

  async updateAddress(
    req: any,
    request: UpdateAddressRequest,
    id: string,
  ): Promise<AddressResponse> {
    const user: User = req.user;

    const contact = await this.prismaService.contact.findFirst({
      where: {
        username: user.username,
      },
    });

    if (!contact)
      throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);

    try {
      const address = await this.prismaService.address.update({
        where: {
          id: parseInt(id),
          contact_id: contact.id,
        },
        data: {
          street: request.street,
          city: request.city,
          country: request.country,
          postal_code: request.postal_code,
          province: request.province,
        },
      });

      return {
        user: {
          username: user.username,
          name: user.name,
        },
        contact: contact,
        address: address,
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
