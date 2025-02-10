import { Address, Contact } from '@prisma/client';

export class AddAddressRequest {
  street: string;
  city: string;
  country: string;
  postal_code: string;
  province: string;
}

export class AddressResponse {
  user: {
    username: string;
    name: string;
  };
  contact: Contact;
  address: Address;
}
