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
import { ContactService } from './contact.service';
import { WebResponse } from '../model/web.model';
import { ResponseContact, RequestAddContact } from '../model/contact.model';
import { AuthGuard } from '../security/auth.guard';

@Controller('/api/contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.OK)
  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Add a new contact.
   *
   * @param req The current request, holding the user information.
   * @param request The contact details to add.
   * @returns A WebResponse containing the added contact.
   */
  /******  e1e86f0c-e20e-4de5-b74b-c62e29c9c604  *******/
  async addContact(
    @Request() req: any,
    @Body() request: RequestAddContact,
  ): Promise<WebResponse<ResponseContact>> {
    const result = await this.contactService.addContact(req, request);

    return {
      data: result,
    };
  }

  @UseGuards(AuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getContact(@Request() req: any): Promise<WebResponse<ResponseContact>> {
    const result = await this.contactService.getContact(req);

    return {
      data: result,
    };
  }
}
