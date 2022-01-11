import { User } from "@crm/shared/schemas/user.schema";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

/** Сервис для работы с авторизацией */
@Injectable()
export class AuthService {
  public constructor(private readonly jwtService: JwtService) {
  }

  /** Функция авторизовывает пользователя и генерирует токен
   * @param user объект пользователя
   * @return Возвращает токен */
  public async login(user: User) {
    const payload = { user: { _id: user._id, login: user.login, roles: user.roles } };
    return {
      accessToken: this.jwtService.sign(payload)
    };
  }
}
