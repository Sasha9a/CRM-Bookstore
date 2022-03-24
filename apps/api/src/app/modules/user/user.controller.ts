import { Roles } from "@crm/api/core/decorators/role.decorator";
import { JwtAuthGuard } from "@crm/api/core/guards/jwt-auth.guard";
import { RoleGuard } from "@crm/api/core/guards/role.guard";
import { ValidateObjectId } from "@crm/api/core/pipes/validate.object.id.pipes";
import { queryParamParser } from "@crm/api/core/services/query-param-parser.service";
import { AuthService } from "@crm/api/modules/user/auth.service";
import { UserService } from "@crm/api/modules/user/user.service";
import { UserCreateFormDto } from "@crm/shared/dtos/user/user.create.form.dto";
import { UserDto } from "@crm/shared/dtos/user/user.dto";
import { UserEditFormDto } from "@crm/shared/dtos/user/user.edit.form.dto";
import { UserLoginFormDto } from "@crm/shared/dtos/user/user.login.form.dto";
import { UserSessionDto } from "@crm/shared/dtos/user/user.session.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Put, Query, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from 'express';

/** Контроллер принимающие запросы по пользователю */
@Controller('user')
export class UserController {

  public constructor(private readonly userService: UserService,
                     private readonly authService: AuthService) {
  }

  /** Get-запрос на получение списка всех пользователей
   * @param res переменная отвечает за возврат данных клиенту
   * @param req переменная отвечает за приход данных от клиента
   * @param queryParams параметры от клиента
   * @return Возвращает массив пользователей */
  @Roles(RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  public async getAll(@Res() res: Response, @Req() req: Request, @Query() queryParams: any) {
    const user: UserDto = req.user as UserDto;
    let users = [];
    if (user?.roles?.includes(RoleEnum.GENERAL_MANAGER)) {
      users = await this.userService.findAll(queryParamParser(queryParams).filter, { password: 0, login: 0, token: 0 });
    } else if (user?.roles?.includes(RoleEnum.STORE_DIRECTOR)) {
      users = await this.userService.findAll({ shop: user.shop._id }, { password: 0, login: 0, token: 0 });
    }
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
    const user = await this.userService.findById(id, { password: 0, login: 0, token: 0 });
    return res.status(HttpStatus.OK).json(user).end();
  }

  /** Post-запрос на создание пользователя
   * @param res переменная отвечает за возврат данных клиенту
   * @param body данные пользователя
   * @param req переменная отвечает за приход данных от клиента
   * @return Возвращает объект пользователя */
  @Roles(RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  public async addUser(@Res() res: Response, @Body() body: UserCreateFormDto, @Req() req: Request) {
    const user: UserDto = req.user as UserDto;
    const userFromLogin = await this.userService.findByLogin(body.login);
    if (userFromLogin) {
      throw new NotFoundException("Такой логин уже занят");
    }
    if (user?.roles?.includes(RoleEnum.STORE_DIRECTOR)
      && !user?.roles?.includes(RoleEnum.GENERAL_MANAGER)
      && body?.roles?.includes(RoleEnum.GENERAL_MANAGER)) {
      throw new NotFoundException("Нет прав");
    }
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

  /** Put-запрос на изменение пользователя
   * @param res переменная отвечает за возврат данных клиенту
   * @param id ID пользователя
   * @param body данные пользователя
   * @param req переменная отвечает за приход данных от клиента
   * @return Возвращает объект пользователя */
  @Roles(RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put(':id')
  public async update(@Res() res: Response, @Param('id', new ValidateObjectId()) id: string, @Body() body: UserEditFormDto, @Req() req: Request) {
    const user: UserDto = req.user as UserDto;
    const userEdited = await this.userService.findById(id, { shop: 1 });
    let entity = {};
    if (user?.roles?.includes(RoleEnum.GENERAL_MANAGER) || (
      user?.roles?.includes(RoleEnum.STORE_DIRECTOR) && user.shop?._id == userEdited.shop?._id
    )) {
      if (user?.roles?.includes(RoleEnum.STORE_DIRECTOR)
        && !user?.roles?.includes(RoleEnum.GENERAL_MANAGER)
        && body?.roles?.includes(RoleEnum.GENERAL_MANAGER)) {
        throw new NotFoundException("Нет прав");
      }
      entity = await this.userService.update(id, body);
      if (!entity) {
        throw new NotFoundException("Нет такого объекта!");
      }
    } else {
      throw new NotFoundException("Нет прав");
    }
    return res.status(HttpStatus.OK).json(entity).end();
  }

  /** Delete-запрос на удаление пользователя
   * @param res переменная отвечает за возврат данных клиенту
   * @param id ID пользователя
   * @param req переменная отвечает за приход данных от клиента */
  @Roles(RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  public async delete(@Res() res: Response, @Param('id', new ValidateObjectId()) id: string, @Req() req: Request) {
    const user: UserDto = req.user as UserDto;
    const userDeleted = await this.userService.findById(id, { shop: 1 });
    if (user?.roles?.includes(RoleEnum.GENERAL_MANAGER) || (
      user?.roles?.includes(RoleEnum.STORE_DIRECTOR) && user.shop?._id == userDeleted.shop?._id
    )) {
      const entity = await this.userService.delete(id);
      if (!entity) {
        throw new NotFoundException("Нет такого объекта!");
      }
    }
    return res.status(HttpStatus.OK).end();
  }

}
