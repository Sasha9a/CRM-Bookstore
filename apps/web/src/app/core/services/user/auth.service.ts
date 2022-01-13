import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserFormDto } from "@crm/shared/dtos/user/user.form.dto";
import { UserSessionDto } from "@crm/shared/dtos/user/user.session.dto";
import { UserStateService } from "@crm/web/core/services/user/user-state.service";
import { Observable, tap } from "rxjs";

/** Сервис для удобной работы с авторизованным пользователем */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /** Авторизованный пользователь */
  private user: UserSessionDto;

  public constructor(private readonly route: ActivatedRoute,
                     private readonly router: Router,
                     private readonly userStateService: UserStateService) {
    if (localStorage.getItem('JWT_USER')) {
      this.user = JSON.parse(localStorage.getItem('JWT_USER'));
    }
  }

  /** Функция авторизовывает пользователя в системе
   * @param user данные пользователя
   * @return Возвращает объект пользователя или ошибку авторизации */
  public login(user: UserFormDto): Observable<UserSessionDto> {
    return this.userStateService.login(user).pipe(tap((response) => {
      this.user = response;

      localStorage.setItem('JWT_TOKEN', response.token);
      localStorage.setItem('JWT_USER', JSON.stringify(response));
    }));
  }

  /** Функция выполняет выход из системы пользователя */
  public logout() {
    localStorage.removeItem('JWT_TOKEN');
    localStorage.removeItem('JWT_USER');

    this.userStateService.logout(this.user).subscribe();

    this.user = undefined;
  }

  /** Авторизованный пользователь
   * @return Возвращает авторизованного пользователя */
  public get currentUser() {
    return this.user;
  }

  /** Функция возвращает токен у авторизованного пользователя
   * @return токен пользвателя */
  public getToken() {
    return localStorage.getItem('JWT_TOKEN');
  }

  /** Функция проверяет, авторизованный ли пользователь, или нет
   * @return авторизован или нет */
  public isAuthenticated(): Promise<any> {
    if (!this.getToken()) {
      return Promise.reject(false);
    }
    return this.userStateService.check().toPromise();
  }
}
