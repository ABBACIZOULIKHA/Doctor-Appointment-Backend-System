import { registerAs } from '@nestjs/config';


export default registerAs('app', () => ({
    port: parseInt(process.env.PORT ?? '3000', 10),
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'access-secret-key',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'refresh-secret-key',
    jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  }));