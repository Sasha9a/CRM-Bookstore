import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { UserDto } from "@crm/shared/dtos/user/user.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { ConfirmDialogService } from "@crm/web/core/services/confirm-dialog.service";
import { ErrorService } from "@crm/web/core/services/error.service";
import { AuthService } from "@crm/web/core/services/user/auth.service";
import { UserStateService } from "@crm/web/core/services/user/user-state.service";

/** Компонент карточки пользователя */
@Component({
  selector: 'crm-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: []
})
export class UserCardComponent implements OnInit {

  /** Пользователь */
  public user: UserDto;

  /** Идет загрузка или нет */
  public loading = true;

  /** Загрузился ли аватар */
  public showAvatar = false;

  /** Может ли редактировать пользователя */
  public isEditable = false;

  public constructor(private readonly route: ActivatedRoute,
                     private readonly errorService: ErrorService,
                     private readonly userStateService: UserStateService,
                     private readonly confirmDialogService: ConfirmDialogService,
                     private readonly authService: AuthService,
                     private readonly router: Router,
                     private readonly title: Title) { }

  public ngOnInit(): void {
    const userId = this.route.snapshot.params['id'];

    if (!userId) {
      return this.errorService.addCustomError('Ошибка', 'Произошла ошибка, вернитесь на главную и попробуйте снова.');
    }

    this.userStateService.findById<UserDto>(userId).subscribe((data) => {
      this.user = data;
      this.title.setTitle(`${this.user.name} - CRM`);
      if (this.authService.checkRoles([RoleEnum.GENERAL_MANAGER]) || (
        this.authService.checkRoles([RoleEnum.STORE_DIRECTOR]) && this.authService.currentUser?.shop?._id === this.user?.shop?._id
      )) {
        this.isEditable = true;
      }
      this.loading = false;
    });
  }

  /** Функция удаляет пользователя */
  public delete() {
    this.confirmDialogService.confirm({
      message: `Вы действительно хотите удалить пользователя "${this.user.name}"?`,
      accept: () => {
        this.loading = true;

        this.userStateService.deleteById(this.user._id).subscribe(() => {
          this.loading = false;
          this.errorService.addSuccessMessage(`Успешно`, `Пользователь "${this.user.name}" удален`);
          this.router.navigate(['/user']).catch(console.error);
        });
      }
    });
  }

}
