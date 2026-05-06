// src/modules/auth/auth.controller.ts
import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
  } from '@nestjs/common';
  import type { Request, Response } from 'express';
  import { AuthService } from './auth.service';
  import { GoogleOAuthService } from './services/google-oauth.service';
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
    constructor(
      private readonly authService: AuthService,
      private readonly googleOAuthService: GoogleOAuthService,
    ) {}
  
    // ==================== LOCAL AUTH ====================
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
  
    // ==================== GOOGLE OAUTH ====================
    @Get('google')
    googleAuth(@Res() res: Response) {
      const url = this.googleOAuthService.getGoogleAuthUrl();
      res.redirect(url);
    }
  
    @Get('google/callback')
    async googleAuthCallback(
      @Query('code') code: string,
      @Query('error') error: string,
      @Res() res: Response,
    ) {
      if (error) {
        return res.redirect(`http://localhost:3000/login?error=${error}`);
      }
  
      try {
        const tokens = await this.googleOAuthService.getGoogleTokens(code);
        const userData = await this.googleOAuthService.getGoogleUserInfo(tokens.access_token);
        const authResponse = await this.googleOAuthService.handleGoogleLogin(userData);
  
        const frontendUrl = `http://localhost:3000/auth/callback?access_token=${authResponse.accessToken}&refresh_token=${authResponse.refreshToken}`;
        res.redirect(frontendUrl);
      } catch (err) {
        return res.redirect(`http://localhost:3000/login?error=oauth_failed`);
      }
    }
  }
  