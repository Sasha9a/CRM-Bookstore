import { UserService } from "@crm/api/modules/user/user.service";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { CanActivate, ExecutionContext, forwardRef, Inject, Injectable } from "@nestjs/common";
import { ROLES_KEY } from '@crm/api/core/decorators/role.decorator';
import { Reflector } from "@nestjs/core";

/** Проверка ролей пользователя */
@Injectable()
export class RoleGuard implements CanActivate {

  public constructor(private readonly reflector: Reflector,
                     @Inject(forwardRef(() => UserService))
                     private readonly userService: UserService) {
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      return false;
    }
    const verifyUser = await this.userService.findById(user._id);
    if (!verifyUser) {
      return false;
    }
    return requiredRoles.some((role) => verifyUser.roles?.includes(role));
  }
}
