import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { UserCreateFormDto } from "@crm/shared/dtos/user/user.create.form.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { ScheduleEnum } from "@crm/shared/enums/schedule.enum";
import { ErrorService } from "@crm/web/core/services/error.service";
import { FileService } from "@crm/web/core/services/file.service";
import { UserPasswordService } from "@crm/web/core/services/user/user-password.service";
import { BaseFormComponent } from "@crm/web/shared/dumbs/base-form/base-form.component";
import { RoleNamePipe } from "@crm/web/shared/pipes/role-name.pipe";
import { ScheduleNamePipe } from "@crm/web/shared/pipes/schedule-name.pipe";
import { FileUpload } from "primeng/fileupload";

/** Компонент ввода данных пользователя при создании */
@Component({
  selector: 'crm-user-create-form',
  templateUrl: './user-create-form.component.html',
  styleUrls: []
})
export class UserCreateFormComponent extends BaseFormComponent<UserCreateFormDto> implements OnChanges {

  /** Данные пользователя */
  @Input() public user = new UserCreateFormDto();
  public dto = UserCreateFormDto;

  /** Список магазинов */
  @Input() public shops: ShopDto[] = [];

  /** Директор магазина или нет, кто создает пользователя */
  @Input() public isDirector = false;

  /** Магазин директора */
  @Input() public shopDirector: ShopDto;

  /** Список ролей */
  public roles: any[] = [];

  /** Список график работы */
  public schedules: any[] = [];

  /** Выбранные роли */
  public selectedRoles: any[] = [];

  /** Выбранный график работы */
  public selectSchedule: any;

  /** URL на который возвращать при отмене */
  @Input() public route: string;

  /** Показывать ли пароль */
  public showPassword = false;

  /** Загружается ли фото или нет */
  public uploadingFiles = false;

  /** Кнопка смены аватара */
  @ViewChild('fileUpload') public fileUpload: FileUpload;

  public constructor(public override readonly errorService: ErrorService,
                     public readonly userPasswordService: UserPasswordService,
                     private readonly roleNamePipe: RoleNamePipe,
                     private readonly scheduleNamePipe: ScheduleNamePipe,
                     private readonly fileService: FileService) {
    super(errorService);

    Object.keys(RoleEnum).forEach((role) => {
      this.roles.push({
        name: this.roleNamePipe.transform(RoleEnum[role]),
        role: RoleEnum[role]
      });
    });

    Object.keys(ScheduleEnum).forEach((schedule) => {
      this.schedules.push({
        name: this.scheduleNamePipe.transform(ScheduleEnum[schedule]),
        schedule: ScheduleEnum[schedule]
      });
    });
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['shopDirector']?.currentValue) {
      if (this.isDirector) {
        this.user.shop = this.shopDirector;
      }
    }
    if (changes['user']?.currentValue) {
      this.selectedRoles = [];
      changes['user']?.currentValue.roles?.forEach((role) => {
        this.selectedRoles.push({
          name: this.roleNamePipe.transform(RoleEnum[role]),
          role: RoleEnum[role]
        });
      });
      if (changes['user']?.currentValue.schedule) {
        this.selectSchedule = {
          name: this.scheduleNamePipe.transform(ScheduleEnum[changes['user']?.currentValue.schedule]),
          schedule: ScheduleEnum[changes['user']?.currentValue.schedule]
        };
      }
    }
  }

  /** Присваивает роль к пользователю
   * @param roles Роли */
  public setRole(roles: any) {
    this.user.roles = roles.map((role) => role.role);
  }

  /** Добавляет или изменяет аватар пользователя
   * @param data файлы */
  public addImage(data: { files: FileList }) {
    this.uploadingFiles = true;
    this.fileService.upload(data.files).subscribe((files) => {
      if (this.user.avatar) {
        this.fileService.deleteFile(this.user.avatar.path).subscribe(() => {
          this.user.avatar = files[0];
        });
      } else {
        this.user.avatar = files[0];
      }
      this.fileUpload.clear();
      this.uploadingFiles = false;
    }, () => this.uploadingFiles = false);
  }

}
