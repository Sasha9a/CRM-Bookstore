import { Injectable } from '@angular/core';
import { UserFormDto } from "@crm/shared/dtos/user/user.form.dto";
import { UserSessionDto } from "@crm/shared/dtos/user/user.session.dto";
import { BaseService } from "@crm/web/core/services/base.service";
import { Observable } from "rxjs";

/** Сервис для запросов по пользователю в API */
@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {

  /** URL пользователя в API */
  protected override baseUrl = '/user';

  /** Post-запрос на авторизацию пользователя
   * @param body данные пользователя
   * @return Возвращает объект пользователя или ошибку авторизации */
  public login(body: UserFormDto): Observable<UserSessionDto> {
    return this.http.post<UserSessionDto>(`${this.baseUrl}/login`, body);
  }

  /** Get-запрос на проверку авторизации пользователя */
  public check(): Observable<null> {
    return this.http.get<null>(`${this.baseUrl}/check`);
  }

  /** Post-запрос на выход пользователя из системы
   * @param body данные пользователя */
  public logout(body: UserSessionDto): Observable<null> {
    return this.http.post<null>(`${this.baseUrl}/logout`, body);
  }
}
