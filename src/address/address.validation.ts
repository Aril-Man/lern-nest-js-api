import { Injectable } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class AddressValidation {
  static readonly ADD_ADDRESS: z.ZodType = z.object({
    street: z.string().min(1).max(100),
    city: z.string().min(1).max(100),
    country: z.string().min(1).max(100),
    postal_code: z.string().min(1).max(100),
    provice: z.string().min(1).max(100),
  });
}
