import { z, ZodType } from 'zod';

export class ContactValidation {
  static readonly ADD_CONTACT: ZodType = z.object({
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    email: z.string().min(1).max(100),
    phone: z.string().min(1).max(100),
  });
}
