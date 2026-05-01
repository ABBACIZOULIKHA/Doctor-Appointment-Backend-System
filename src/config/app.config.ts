import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
    port: parseInt(process.env.PORT ?? '3000', 10),
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  }));