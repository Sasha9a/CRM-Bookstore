import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AuthService } from "@crm/web/core/services/user/auth.service";
import { Observable } from 'rxjs';
import { environment } from "../../../environments/environment";

/** Класс отлавливает запросы в API и в запросе вставляет токен пользователя */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  public constructor(private readonly authService: AuthService) {}

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    const currentUser = this.authService.currentUser;

    if (currentUser && token) {
      const modifiedReq = request.clone({ withCredentials: true, url: environment.url + request.url, headers: request.headers.set('Authorization', 'Bearer ' + token) });
      return next.handle(modifiedReq);
    } else {
      return next.handle(request.clone({ url: environment.url + request.url }));
    }
  }

}
