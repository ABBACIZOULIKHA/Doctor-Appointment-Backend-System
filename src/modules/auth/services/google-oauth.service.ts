// src/modules/auth/services/google-oauth.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { User } from '../../users/entities/user.entity';
import { UserRole } from '../entities/user-role.entity';
import { UserRole as RoleEnum } from '../../../common/enums/role.enum';
import { UserStatus } from '../../../common/enums/user-status.enum';
import { AuthResponse } from '../types/auth-response.type';
import { OAuthUserData } from '../types/oauth.types';
import * as bcrypt from 'bcrypt';

// ✅ Add this type
type StringValue = `${number}${'ms'|'s'|'m'|'h'|'d'|'w'|'y'}`;

@Injectable()
export class GoogleOAuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRolesRepository: Repository<UserRole>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  getGoogleAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.configService.get('app.googleClientId')!,
      redirect_uri: this.configService.get('app.googleCallbackUrl')!,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async getGoogleTokens(code: string) {
    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        client_id: this.configService.get('app.googleClientId'),
        client_secret: this.configService.get('app.googleClientSecret'),
        redirect_uri: this.configService.get('app.googleCallbackUrl'),
        grant_type: 'authorization_code',
      });

      return response.data;
    } catch (error) {
      throw new BadRequestException('Failed to exchange Google code for tokens');
    }
  }

  async getGoogleUserInfo(accessToken: string): Promise<OAuthUserData> {
    try {
      const response = await axios.get(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      return {
        email: response.data.email,
        firstName: response.data.given_name,
        lastName: response.data.family_name,
        picture: response.data.picture,
        provider: 'google',        // ✅ FIXED
        providerId: response.data.id,
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch Google user info');
    }
  }

  async handleGoogleLogin(userData: OAuthUserData): Promise<AuthResponse> {
    // ✅ FIXED: TypeORM 0.2 syntax
    const user = await this.usersRepository.findOne({
      where: { email: userData.email.toLowerCase() },
      relations: ['roles'],
    });

    if (user) {
      const roles = user.roles?.map((role) => role.role) ?? [];
      return this.issueTokens(user, roles);
    }

    const randomPassword = Math.random().toString(36).slice(-16) + Date.now().toString(36);
    const passwordHash = await bcrypt.hash(randomPassword, 10);

    // ✅ FIXED: Don't set phone to null
    const newUser = new User();
    newUser.email = userData.email.toLowerCase();
    newUser.passwordHash = passwordHash;
    newUser.status = UserStatus.ACTIVE;

    const savedUser = await this.usersRepository.save(newUser);

    const defaultRole = this.userRolesRepository.create({
      userId: savedUser._id,
      role: RoleEnum.PATIENT,
    });
    await this.userRolesRepository.save(defaultRole);

    const roles = [RoleEnum.PATIENT];
    return this.issueTokens(savedUser, roles);
  }

  private async issueTokens(user: User, roles: string[]): Promise<AuthResponse> {
    const payload = {
      sub: user._id,
      email: user.email,
      roles,
    };

    // ✅ Cast expiresIn to StringValue
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('app.jwtAccessSecret')!,
      expiresIn: (this.configService.get<string>('app.jwtAccessExpiresIn') || '15m') as StringValue,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('app.jwtRefreshSecret')!,
      expiresIn: (this.configService.get<string>('app.jwtRefreshExpiresIn') || '7d') as StringValue,
    });

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
}