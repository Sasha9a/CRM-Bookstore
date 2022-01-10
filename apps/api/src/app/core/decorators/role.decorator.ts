import { RoleEnum } from "@crm/shared/enums/role.enum";
import { SetMetadata } from '@nestjs/common';

/** Ключ ролей */
export const ROLES_KEY = 'roles';

/** Декоратор для разрешения ролям использовать запросы */
export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);
