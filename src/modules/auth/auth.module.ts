// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { JwtModule } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';
// import { PassportModule } from '@nestjs/passport';
// import { User } from '../users/entities/user.entity';
// import { UserRole } from './entities/user-role.entity';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';
// import { JwtStrategy } from './strategies/jwt.strategy';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([User, UserRole]),
//     PassportModule.register({ defaultStrategy: 'jwt' }),
//     JwtModule.registerAsync({
//       inject: [ConfigService],
//       useFactory: (config: ConfigService) => ({
//         secret: config.get('app.jwtSecret'),
//         signOptions: { expiresIn: config.get('app.jwtExpiresIn') },
//       }),
//     }),
//   ],
//   controllers: [AuthController],
//   providers: [AuthService, JwtStrategy],
//   exports: [AuthService],
// })
// export class AuthModule {}
