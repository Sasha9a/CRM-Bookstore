import { Injectable } from '@angular/core';
import { UserLoginFormDto } from "@crm/shared/dtos/user/user.login.form.dto";
import { UserSessionDto } from "@crm/shared/dtos/user/user.session.dto";
import { BaseStateService } from "@crm/web/core/services/base-state.service";
import { UserService } from "@crm/web/core/services/user/user.service";
import { Observable } from "rxjs";

/** Сервис для запросов по пользователю в API */
@Injectable({
  providedIn: 'root'
})
export class UserStateService extends BaseStateService {

  public constructor(private readonly userService: UserService) {
    super();
    this.baseService = userService;
  }

  /** Post-запрос на авторизацию пользователя
   * @param body данные пользователя
   * @return Возвращает объект пользователя или ошибку авторизации */
  public login(body: UserLoginFormDto): Observable<UserSessionDto> {
    return this.userService.login(body);
  }

  /** Get-запрос на проверку авторизации пользователя */
  public check(): Observable<null> {
    return this.userService.check();
  }

  /** Post-запрос на выход пользователя из системы
   * @param body данные пользователя */
  public logout(body: UserSessionDto): Observable<null> {
    return this.userService.logout(body);
  }
}
