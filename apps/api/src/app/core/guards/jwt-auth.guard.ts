import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/** Проверка авторизации пользователя, используется схема JWT */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
