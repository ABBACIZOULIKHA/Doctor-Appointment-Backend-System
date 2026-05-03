import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

type RefreshPayload = {
  sub: string;
  email: string;
  roles: string[];
  refreshToken: string;
};

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('app.jwtRefreshSecret') || 'refresh-secret-key',
      passReqToCallback: true,
    });
  }

  validate(
    req: Request,
    payload: { sub: string; email: string; roles: string[] },
  ): RefreshPayload {
    const authHeader = req.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

    return {
      ...payload,
      refreshToken: token,
    };
  }
}
