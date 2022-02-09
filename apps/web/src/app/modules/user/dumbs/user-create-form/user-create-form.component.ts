import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { UserCreateFormDto } from "@crm/shared/dtos/user/user.create.form.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { ScheduleEnum } from "@crm/shared/enums/schedule.enum";
import { ErrorService } from "@crm/web/core/services/error.service";
import { UserPasswordService } from "@crm/web/core/services/user/user-password.service";
import { BaseFormComponent } from "@crm/web/shared/dumbs/base-form/base-form.component";
import { RoleNamePipe } from "@crm/web/shared/pipes/role-name.pipe";
import { ScheduleNamePipe } from "@crm/web/shared/pipes/schedule-name.pipe";

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

  /** URL на который возвращать при отмене */
  @Input() public route: string;

  /** Показывать ли пароль */
  public showPassword = false;

  public constructor(public override readonly errorService: ErrorService,
                     public readonly userPasswordService: UserPasswordService,
                     private readonly roleNamePipe: RoleNamePipe,
                     private readonly scheduleNamePipe: ScheduleNamePipe) {
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
  }

  /** Присваивает роль к пользователю
   * @param roles Роли */
  public setRole(roles: any) {
    this.user.roles = roles.map((role) => role.role);
  }

}
