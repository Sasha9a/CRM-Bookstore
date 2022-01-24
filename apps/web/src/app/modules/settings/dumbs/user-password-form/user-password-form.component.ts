import { Component, Input } from '@angular/core';
import { UserPasswordFormDto } from "@crm/shared/dtos/user/user.password.form.dto";
import { ErrorService } from "@crm/web/core/services/error.service";
import { UserPasswordService } from "@crm/web/core/services/user/user-password.service";
import { BaseFormComponent } from "@crm/web/shared/dumbs/base-form/base-form.component";

/** Компонент ввода данных для смены пароля */
@Component({
  selector: 'crm-user-password-form',
  templateUrl: './user-password-form.component.html',
  styleUrls: []
})
export class UserPasswordFormComponent extends BaseFormComponent<UserPasswordFormDto> {

  /** Данные пароля */
  @Input() public body = new UserPasswordFormDto();
  public dto = UserPasswordFormDto;

  /** Грузится ли или нет */
  @Input() public loading = false;

  /** Показывать ли пароль */
  public showPassword = false;

  public constructor(public override readonly errorService: ErrorService,
                     public readonly userPasswordService: UserPasswordService) {
    super(errorService);
  }

  /** Очищает компонент */
  public reset() {
    this.body.password = '';
    this.body.repeatPassword = '';
    this.errors.password = null;
    this.errors.repeatPassword = null;
  }

}
