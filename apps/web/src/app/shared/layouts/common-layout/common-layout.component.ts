import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { UserSessionDto } from "@crm/shared/dtos/user/user.session.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { AuthService } from "@crm/web/core/services/user/auth.service";
import { MenuItem, PrimeIcons } from "primeng/api";

@Component({
  selector: 'crm-common-layout',
  templateUrl: './common-layout.component.html',
  styleUrls: ['./common-layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CommonLayoutComponent implements OnInit {

  public items: MenuItem[];
  public menubar: MenuItem[];

  public get currentUser(): UserSessionDto {
    return this.authService.currentUser;
  }

  public menuMinimized: boolean = localStorage.getItem('user.settings.menu-minimized') === 'true';
  private windowWidth: number;

  public constructor(private readonly authService: AuthService) {
  }

  public ngOnInit(): void {
    this.windowWidth = window.innerWidth;
    if (!localStorage.getItem('user.settings.menu-minimized') && this.windowWidth < 992) {
      this.menuMinimized = true;
    }

    this.menubar = [
      {
        label: 'Настройки',
        icon: 'pi pi-cog',
        routerLink: '/settings',
        routerLinkActiveOptions: { exact: true }
      },
      {
        label: 'Выход',
        icon: 'pi pi-sign-out',
        command: () => {
          this.logout();
        }
      }
    ];

    this.items = [{
      label: 'Рабочий стол',
      icon: PrimeIcons.DESKTOP,
      routerLink: '/',
      routerLinkActiveOptions: { exact: true }
    }, {
      label: 'Магазины',
      icon: PrimeIcons.HOME,
      routerLink: '/shop',
      routerLinkActiveOptions: { exact: false },
      visible: this.authService.checkRoles([RoleEnum.GENERAL_MANAGER])
    }, {
      label: 'Пользователи',
      icon: PrimeIcons.USERS,
      routerLink: '/user',
      routerLinkActiveOptions: { exact: false },
      visible: this.authService.checkRoles([RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR])
    }, {
      label: 'Категории',
      icon: PrimeIcons.SITEMAP,
      routerLink: '/category',
      routerLinkActiveOptions: { exact: false },
      visible: this.authService.checkRoles([RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR, RoleEnum.MANAGER])
    }];
  }

  @HostListener('window:resize')
  private onWindowResize() {
    if (window.innerWidth < 992 && this.windowWidth >= 992 && !this.menuMinimized) {
      this.menuMinimized = true;
      this.saveMenuState();
    } else if (window.innerWidth >= 992 && this.windowWidth < 992 && this.menuMinimized) {
      this.menuMinimized = false;
      this.saveMenuState();
    }
    this.windowWidth = window.innerWidth;
  }

  public logout() {
    this.authService.logout(location.pathname);
  }

  public saveMenuState() {
    localStorage.setItem('user.settings.menu-minimized', JSON.stringify(this.menuMinimized));
  }

}
