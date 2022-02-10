import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { UserLoginFormDto } from "@crm/shared/dtos/user/user.login.form.dto";
import { ErrorService } from "@crm/web/core/services/error.service";
import { RoutingService } from "@crm/web/core/services/routing.service";
import { AuthService } from "@crm/web/core/services/user/auth.service";
import { validate } from "@crm/web/core/services/validation/validate.service";

/** Компонент авторизации */
@Component({
  selector: 'crm-login',
  templateUrl: './login.component.html',
  styleUrls: []
})
export class LoginComponent implements OnInit {

  public user = new UserLoginFormDto();
  public errors: Record<keyof UserLoginFormDto, any[]>;
  public loading = false;

  private url: string;
  private queryParams: any;

  public constructor(private readonly authService: AuthService,
                     private readonly errorService: ErrorService,
                     private readonly router: Router,
                     private readonly route: ActivatedRoute,
                     private readonly routingService: RoutingService) { }

  public ngOnInit(): void {
    this.url = this.route.snapshot.queryParams['url'] || '/';
    this.queryParams = this.url.split('?')[1] || '';

    this.url = this.url.split('?')[0] || this.url;
    this.queryParams = this.queryParams ? JSON.parse('{"' + decodeURI(this.queryParams.replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}') : {};

    if (this.authService.currentUser) {
      this.router.navigate([this.url], { queryParams: this.queryParams }).catch(console.error);
    }
  }

  /** Событие на клик авторизации */
  public clickLogin() {
    this.loading = true;

    const { valid, errors } = validate(this.user, UserLoginFormDto);
    if (!valid) {
      console.error(errors);
      this.errors = errors;
      this.loading = false;
    } else {
      this.errors = null;
      this.authService.login(this.user).subscribe({
        next: () => {
          this.loading = false;
          this.errorService.addSuccessMessage("Вы авторизовались!");
          if (this.url === '/') {
            this.routingService.redirectByRole();
          } else {
            this.router.navigate([this.url], { queryParams: this.queryParams }).catch(console.error);
          }
        },
        error: (err) => {
          this.loading = false;
          this.errors = err.error;
        }
      });
    }
  }

  /** Задает фокус на элемент
   * @param elem Элемент, на который нужно повесить фокус */
  public setFocus(elem: any) {
    elem.input?.nativeElement?.focus();
  }

}
