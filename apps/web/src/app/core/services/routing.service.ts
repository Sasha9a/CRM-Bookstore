import { Injectable } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { ActivationEnd, NavigationEnd, Router } from "@angular/router";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { AuthService } from "@crm/web/core/services/user/auth.service";
import { filter } from "rxjs";

/** Начальные страницы в зависимости от роли */
const roleRoutes: Record<RoleEnum, string> = {
  [RoleEnum.GENERAL_MANAGER]: '/',
  [RoleEnum.STORE_DIRECTOR]: '/',
  [RoleEnum.MANAGER]: '/product',
  [RoleEnum.SELLER]: '/product'
};

/** Сервис для удобной работы с перенаправлениями */
@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  /** Текущий URL */
  public currentUrl = '/';

  /** Предыдущий URL */
  public previousUrl = '/';

  public constructor(private readonly router: Router,
                     private readonly authService: AuthService,
                     private readonly titleService: Title) {

    /** Тут выполняется событие при изменении URL */
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;

        if (event.url === '/') {
          this.redirectByRole();
        }
      });


    this.router.events.subscribe((data) => {
      if (data instanceof ActivationEnd && !data.snapshot.routeConfig.children && !data.snapshot.routeConfig.loadChildren) {
        this.titleService.setTitle(data.snapshot.data['title'] || 'CRM Bookstore');
      }
    });
  }

  /** Функция перенаправляет пользователя на предыдущий URL */
  public goToPreviousUrl() {
    if (this.previousUrl === '/') {
      this.redirectByRole();
    } else {
      this.router.navigateByUrl(this.previousUrl).catch(console.error);
    }
  }

  /** Функция перенаправляет пользователя на главную страницу в зависимости от роля */
  public redirectByRole() {
    const path = roleRoutes[this.authService.currentUser.roles[0]] || '/login';
    this.router.navigate([path]).catch(console.error);
  }

}
