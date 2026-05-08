// src/modules/auth/auth.service.ts
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { StringValue } from 'ms';
import { Repository } from 'typeorm';
import { UserRole as RoleEnum } from '../../common/enums/role.enum';
import { UserStatus } from '../../common/enums/user-status.enum';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from './entities/user-role.entity';
import { AuthResponse } from './types/auth-response.type';

type JwtPayload = {
  sub: string;
  email: string;
  roles: string[];
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRolesRepository: Repository<UserRole>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.usersRepository.create({
      email: dto.email.toLowerCase(),
      phone: dto.phone,
      passwordHash,
      status: UserStatus.ACTIVE,
    });

    const savedUser = await this.usersRepository.save(user);

    // ✅ Déterminer le rôle (patient par défaut si non spécifié)
    const userRole = dto.role || RoleEnum.PATIENT;

    // ✅ Validation : seul ADMIN peut créer un DOCTOR ou ADMIN
    // (à implémenter avec un guard si nécessaire)
    
    const defaultRole = this.userRolesRepository.create({
      userId: savedUser._id,
      role: userRole,
    });
    await this.userRolesRepository.save(defaultRole);

    const roles = [userRole];
    return this.issueTokens(savedUser, roles);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersRepository.findOne({
      where: { email: dto.email.toLowerCase() },
      relations: ['roles'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const roles = user.roles?.map((role) => role.role) ?? [];
    return this.issueTokens(user, roles);
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<AuthResponse> {
    const user = await this.usersRepository.findOne({
      where: { _id: userId },
      relations: ['roles'],
    });

    if (!user || !user.refreshTokenHash || !user.refreshTokenExpiresAt) {
      throw new UnauthorizedException('Refresh token is invalid');
    }

    if (user.refreshTokenExpiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('Refresh token is expired');
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refreshTokenHash,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Refresh token is invalid');
    }

    const roles = user.roles?.map((role) => role.role) ?? [];
    return this.issueTokens(user, roles);
  }

  async logout(userId: string): Promise<{ message: string }> {
    await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({
        refreshTokenHash: () => 'NULL',
        refreshTokenExpiresAt: () => 'NULL',
      })
      .where('_id = :id', { id: userId })
      .execute();

    return { message: 'Logged out successfully' };
  }

  private async issueTokens(user: User, roles: string[]): Promise<AuthResponse> {
    const payload: JwtPayload = {
      sub: user._id,
      email: user.email,
      roles,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('app.jwtAccessSecret') || 'access-secret-key',
      expiresIn:
        (this.configService.get<string>('app.jwtAccessExpiresIn') || '15m') as StringValue,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret:
        this.configService.get<string>('app.jwtRefreshSecret') || 'refresh-secret-key',
      expiresIn:
        (this.configService.get<string>('app.jwtRefreshExpiresIn') || '7d') as StringValue,
    });

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    const refreshTokenExpiresAt = this.getRefreshExpiryDate();

    await this.usersRepository.update(
      { _id: user._id },
      {
        refreshTokenHash,
        refreshTokenExpiresAt,
      },
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        roles,
      },
    };
  }

  private getRefreshExpiryDate(): Date {
    const refreshExpires = this.configService.get<string>('app.jwtRefreshExpiresIn') || '7d';
    const match = /^(\d+)([smhd])$/.exec(refreshExpires);

    if (!match) {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }

    const value = Number(match[1]);
    const unit = match[2];

    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return new Date(Date.now() + value * multipliers[unit]);
  }
}