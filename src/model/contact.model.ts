export class RequestAddContact {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
}

export class ResponseContact {
  username: string;
  name: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
}
