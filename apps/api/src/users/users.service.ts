import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const USER_SELECT = {
  id: true,
  email: true,
  name: true,
  initials: true,
  role: true,
  plan: true,
  credits: true,
  totalCredits: true,
  resetDay: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.db.user.findUnique({ where: { id: userId }, select: USER_SELECT });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
