/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ValidationService } from '../common/validation.service';
import { RequestAddContact, ResponseContact } from '../model/contact.model';
import { ContactValidation } from './contact.validation';

@Injectable()
export class ContactService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private validationService: ValidationService,
  ) {}

  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Adds a new contact to the database.
   *
   * @param req - The current request containing user information.
   * @param request - The contact details to be added, validated before insertion.
   * @returns A promise resolving to a ResponseContact object containing the added contact's details.
   */

  /******  4fe3a82d-0d56-4d41-ba7d-639e5bc78744  *******/
  async addContact(
    req: any,
    request: RequestAddContact,
  ): Promise<ResponseContact> {
    this.logger.info('Payload add Contact : ', JSON.stringify(request));

    this.validationService.validate(ContactValidation.ADD_CONTACT, request);

    const user = req.user;

    await this.prismaService.contact.create({
      data: {
        first_name: request.firstName,
        last_name: request.lastName,
        email: request.email,
        phone: request.phone,
        username: user.username,
      },
    });

    return {
      username: user.username,
      name: user.name,
      fistName: request.firstName,
      lastName: request.lastName,
      email: request.email,
      phone: request.phone,
    };
  }
}
