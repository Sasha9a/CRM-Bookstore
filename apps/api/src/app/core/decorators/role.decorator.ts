import { RoleEnum } from "@crm/shared/enums/role.enum";
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);
