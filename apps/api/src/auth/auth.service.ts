import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './auth.dto';
import { LoginDto } from './auth.dto';

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
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  private sign(user: { id: string; email: string; role: string }) {
    return this.jwt.sign({ sub: user.id, email: user.email, role: user.role });
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.db.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email sudah terdaftar');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const initials = dto.name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('');

    const user = await this.prisma.db.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        initials,
        passwordHash,
        role: 'user',
        plan: 'free',
        credits: 5,
        totalCredits: 5,
        resetDay: 1,
      },
      select: USER_SELECT,
    });

    await this.prisma.db.creditTransaction.create({
      data: {
        userId: user.id,
        amount: 5,
        type: 'promo',
        description: 'Kredit percobaan gratis',
      },
    });

    return { user, accessToken: this.sign(user) };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.db.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Email atau password salah');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Email atau password salah');

    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, accessToken: this.sign(user) };
  }

  async me(userId: string) {
    return this.prisma.db.user.findUniqueOrThrow({
      where: { id: userId },
      select: USER_SELECT,
    });
  }
}
