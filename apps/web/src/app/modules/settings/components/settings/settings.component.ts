import { Component, OnInit, ViewChild } from '@angular/core';
import { UserDto } from "@crm/shared/dtos/user/user.dto";
import { UserPasswordFormDto } from "@crm/shared/dtos/user/user.password.form.dto";
import { ErrorService } from "@crm/web/core/services/error.service";
import { FileService } from "@crm/web/core/services/file.service";
import { AuthService } from '@crm/web/core/services/user/auth.service';
import { UserStateService } from "@crm/web/core/services/user/user-state.service";
import { UserPasswordFormComponent } from "@crm/web/modules/settings/dumbs/user-password-form/user-password-form.component";
import { FileUpload } from "primeng/fileupload";
import { switchMap } from "rxjs";

/** Компонент настройки пользователя */
@Component({
  selector: 'crm-settings',
  templateUrl: './settings.component.html',
  styleUrls: []
})
export class SettingsComponent implements OnInit {

  /** Пользователь */
  public user: UserDto;

  /** Загрузился ли аватар */
  public showAvatar = false;

  /** Грузится ли или нет */
  public loading = true;

  /** Кнопка смены аватара */
  @ViewChild('fileUpload') public fileUpload: FileUpload;

  /** Компонент смены пароля */
  @ViewChild(UserPasswordFormComponent, { static: false }) public changePasswordComponent: UserPasswordFormComponent;

  public constructor(private readonly authService: AuthService,
                     private readonly userStateService: UserStateService,
                     private readonly fileService: FileService,
                     private readonly errorService: ErrorService) { }

  public ngOnInit(): void {
    this.userStateService.findById<UserDto>(this.authService.currentUser._id).subscribe((user) => {
      this.user = user;
      this.loading = false;
    });
  }

  /** Загрузка нового аватара
   * @param data файл */
  public onAvatarFileSelect(data: { files: FileList }) {
    this.fileService.upload(data.files)
      .pipe(
        switchMap((files) => {
          this.user.avatar = files[0];
          this.authService.updateLoggedUser({ avatar: this.user.avatar });
          this.fileUpload.clear();
          return this.userStateService.update(this.user._id, { avatar: this.user.avatar });
        }))
      .subscribe();
  }

  /** Смена пароля
   * @param body пароли */
  public changePassword(body: UserPasswordFormDto) {
    if (body.password !== body.repeatPassword) {
      return this.errorService.addCustomError('Ошибка', 'Пароли не совпадают');
    }
    this.loading = true;
    this.userStateService.update<{ password: string }, UserDto>(this.user._id, { password: body.password }).subscribe(() => {
      this.loading = false;
      this.changePasswordComponent.reset();
      this.errorService.addSuccessMessage('Новый пароль установлен');
    }, () => this.loading = false);
  }

}
