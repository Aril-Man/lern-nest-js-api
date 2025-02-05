import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/common/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getUSersToken(): Promise<string> {
    const user = await this.prismaService.user.findFirst({
      where: {
        username: 'admin',
      },
      select: {
        token: true,
      },
    });

    return user?.token ? user.token : '';
  }
}
