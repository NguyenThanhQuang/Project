import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  forwardRef,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AdminLoginLoggerMiddleware } from 'src/common/middleware/admin-login-logger.middleware';
import { Company, CompanySchema } from 'src/companies/schemas/company.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OptionalJwtAuthGuard } from './guards/optional-jwt-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TokenModule } from './token/token.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Company.name, schema: CompanySchema },
    ]),
    forwardRef(() => UsersModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TokenModule,
  ],
  providers: [AuthService, JwtStrategy, OptionalJwtAuthGuard],
  controllers: [AuthController],
  exports: [AuthService, PassportModule, OptionalJwtAuthGuard],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminLoginLoggerMiddleware)
      .forRoutes({ path: 'auth/login', method: RequestMethod.POST });
  }
}
