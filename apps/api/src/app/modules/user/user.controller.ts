import { Roles } from "@crm/api/core/decorators/role.decorator";
import { JwtAuthGuard } from "@crm/api/core/guards/jwt-auth.guard";
import { RoleGuard } from "@crm/api/core/guards/role.guard";
import { AuthService } from "@crm/api/modules/user/auth.service";
import { UserService } from "@crm/api/modules/user/user.service";
import { UserFormDto } from "@crm/shared/dtos/user/user.form.dto";
import { UserLoginFormDto } from "@crm/shared/dtos/user/user.login.form.dto";
import { UserSessionDto } from "@crm/shared/dtos/user/user.session.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { Body, Controller, Get, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";
import { Response } from 'express';

@Controller('user')
export class UserController {

  public constructor(private readonly userService: UserService,
                     private readonly authService: AuthService) {
  }

  @Get()
  public async getAll(@Res() res: Response) {
    const users = await this.userService.findAll();
    return res.status(HttpStatus.OK).json(users).end();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/check')
  public async check(@Res() res: Response) {
    return res.status(HttpStatus.NO_CONTENT).end();
  }

  @Roles(RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  public async addUser(@Res() res: Response, @Body() body: UserFormDto) {
    const newUser = await this.userService.create(body);
    return res.status(HttpStatus.CREATED).json(newUser).end();
  }

  @Post('/login')
  public async login(@Res() res: Response, @Body() body: UserFormDto) {
    const user = await this.userService.findByLogin(body.login);
    const errors: Record<keyof UserLoginFormDto, any[]> = {
      login: null,
      password: null
    };
    if (!user) {
      errors.login = ['Нет такого аккаунта'];
      return res.status(HttpStatus.NOT_FOUND).json(errors).end();
    }
    if (body.password === user.password) {
      const token = await this.authService.login(user);
      const login: UserSessionDto = {
        ...user,
        token: token.accessToken
      };
      await this.userService.setToken(user._id, token.accessToken);
      return res.status(HttpStatus.OK).json(login).end();
    } else {
      errors.password = ['Неверный пароль'];
      return res.status(HttpStatus.NOT_FOUND).json(errors).end();
    }
  }

  @Post('/logout')
  public async logout(@Res() res: Response, @Body() body: UserSessionDto) {
    await this.userService.logout(body._id);
    return res.status(HttpStatus.OK).end();
  }

}
