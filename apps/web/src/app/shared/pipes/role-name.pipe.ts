import { Pipe, PipeTransform } from '@angular/core';
import { RoleEnum } from "@crm/shared/enums/role.enum";

const roleName = {
  [RoleEnum.GENERAL_MANAGER]: 'Управляющий сетью',
  [RoleEnum.STORE_DIRECTOR]: 'Директор магазина',
  [RoleEnum.MANAGER]: 'Менеджер магазина',
  [RoleEnum.SELLER]: 'Продавец'
};

@Pipe({
  name: 'roleName'
})
export class RoleNamePipe implements PipeTransform {

  public transform(value: RoleEnum): string {
    return roleName[value] || '';
  }

}
