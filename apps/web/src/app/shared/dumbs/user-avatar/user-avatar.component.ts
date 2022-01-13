import { Component, Input } from '@angular/core';
import { UserDto } from "@crm/shared/dtos/user/user.dto";
import { UserSessionDto } from "@crm/shared/dtos/user/user.session.dto";

/** Компонент аватара пользователя */
@Component({
  selector: 'crm-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: []
})
export class UserAvatarComponent {

  /** Пользователь */
  @Input() public user: UserSessionDto | UserDto;

  /** Размер аватара */
  @Input() public size = 'large';

  /** Форма аватара */
  @Input() public shape = 'square';

  /** Текст аватара */
  public get userLabel() {
    const [firstName, secondName] = (this.user.name || '').split(' ');
    return (firstName ? firstName[0] : '') + (secondName ? secondName[0] : '');
  }


}
