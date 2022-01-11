import { JwtAuthGuard } from "@crm/api/core/guards/jwt-auth.guard";
import { RoleGuard } from "@crm/api/core/guards/role.guard";
import { AuthService } from "@crm/api/modules/user/auth.service";
import { JwtStrategy } from "@crm/api/modules/user/jwt.strategy";
import { UserController } from "@crm/api/modules/user/user.controller";
import { UserService } from "@crm/api/modules/user/user.service";
import { User, UserSchema } from "@crm/shared/schemas/user.schema";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { environment } from "../../../environments/environment";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: true
    }),
    JwtModule.register({
      secret: environment.secret,
      signOptions: {
        expiresIn: environment.expiresIn
      }
    })
  ],
  controllers: [UserController],
  providers: [UserService, AuthService, JwtStrategy, JwtAuthGuard, RoleGuard],
  exports: [UserService, AuthService]
})
export class UserModule {}
