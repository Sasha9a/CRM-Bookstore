import { Roles } from "@crm/api/core/decorators/role.decorator";
import { JwtAuthGuard } from "@crm/api/core/guards/jwt-auth.guard";
import { RoleGuard } from "@crm/api/core/guards/role.guard";
import { ValidateObjectId } from "@crm/api/core/pipes/validate.object.id.pipes";
import { AuthService } from "@crm/api/modules/user/auth.service";
import { UserService } from "@crm/api/modules/user/user.service";
import { UserFormDto } from "@crm/shared/dtos/user/user.form.dto";
import { UserLoginFormDto } from "@crm/shared/dtos/user/user.login.form.dto";
import { UserSessionDto } from "@crm/shared/dtos/user/user.session.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { Body, Controller, Get, HttpStatus, Param, Post, Res, UseGuards } from "@nestjs/common";
import { Response } from 'express';

/** Контроллер принимающие запросы по пользователю */
@Controller('user')
export class UserController {

  public constructor(private readonly userService: UserService,
                     private readonly authService: AuthService) {
  }

  /** Get-запрос на получение списка всех пользователей
   * @param res переменная отвечает за возврат данных клиенту
   * @return Возвращает массив пользователей */
  @Roles(RoleEnum.GENERAL_MANAGER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  public async getAll(@Res() res: Response) {
    const users = await this.userService.findAll();
    return res.status(HttpStatus.OK).json(users).end();
  }

  /** Get-запрос на проверку авторизации пользователя
   * @param res переменная отвечает за возврат данных клиенту */
  @UseGuards(JwtAuthGuard)
  @Get('/check')
  public async check(@Res() res: Response) {
    return res.status(HttpStatus.NO_CONTENT).end();
  }

  /** Get-запрос на получение пользователя по ID
   * @param res переменная отвечает за возврат данных клиенту
   * @param id ID пользователя
   * @return Возвращает пользователя */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public async getUser(@Res() res: Response, @Param('id', new ValidateObjectId()) id: string) {
    const user = await this.userService.findById(id);
    return res.status(HttpStatus.OK).json(user).end();
  }

  /** Post-запрос на создание пользователя
   * @param res переменная отвечает за возврат данных клиенту
   * @param body данные пользователя
   * @return Возвращает объект пользователя */
  @Roles(RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  public async addUser(@Res() res: Response, @Body() body: UserFormDto) {
    const newUser = await this.userService.create(body);
    return res.status(HttpStatus.CREATED).json(newUser).end();
  }

  /** Post-запрос на авторизацию пользователя
   * @param res переменная отвечает за возврат данных клиенту
   * @param body данные пользователя
   * @return Возвращает объект пользователя или ошибку авторизации */
  @Post('/login')
  public async login(@Res() res: Response, @Body() body: UserLoginFormDto) {
    const user = await this.userService.findByLogin(body.login);
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({ error: { login: ['Нет такого аккаунта'] } }).end();
    }
    if (body.password === user.password) {
      const token = await this.authService.login(user);
      const login: UserSessionDto = {
        _id: user._id,
        login: user.login,
        roles: user.roles,
        token: token.accessToken,
        address: user.address,
        avatar: user.avatar,
        dateOfBirth: user.dateOfBirth,
        name: user.name,
        position: user.position,
        salary: user.salary,
        shop: user.shop,
        telephone: user.telephone
      };
      await this.userService.setToken(user._id, token.accessToken);
      return res.status(HttpStatus.OK).json(login).end();
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({ error: { password: ['Неверный пароль'] } }).end();
    }
  }

  /** Post-запрос на выход пользователя из системы
   * @param res переменная отвечает за возврат данных клиенту
   * @param body данные пользователя */
  @Post('/logout')
  public async logout(@Res() res: Response, @Body() body: UserSessionDto) {
    await this.userService.logout(body._id);
    return res.status(HttpStatus.OK).end();
  }

}
