import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

type RefreshRequestUser = {
  sub: string;
  refreshToken: string;
};

type AccessRequestUser = {
  sub: string;
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(@Req() req: Request & { user: RefreshRequestUser }) {
    if (!req.user?.sub || !req.user?.refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    return this.authService.refreshTokens(req.user.sub, req.user.refreshToken);
  }

  @UseGuards(JwtAccessGuard)
  @Post('logout')
  logout(@Req() req: Request & { user: AccessRequestUser }) {
    if (!req.user?.sub) {
      throw new UnauthorizedException('User is not authenticated');
    }

    return this.authService.logout(req.user.sub);
  }
}
