import { Injectable } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { ActivationEnd, NavigationEnd, Router } from "@angular/router";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { AuthService } from "@crm/web/core/services/user/auth.service";
import { filter } from "rxjs";

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
          if (this.authService.checkRoles([RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR])) {
            this.router.navigate([event.url]).catch(console.error);
          } else {
            this.router.navigate(['/product']).catch(console.error);
          }
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
    this.router.navigateByUrl(this.previousUrl).catch(console.error);
  }
}
