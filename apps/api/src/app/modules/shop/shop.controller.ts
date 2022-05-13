import { Roles } from "@crm/api/core/decorators/role.decorator";
import { JwtAuthGuard } from "@crm/api/core/guards/jwt-auth.guard";
import { RoleGuard } from "@crm/api/core/guards/role.guard";
import { ValidateObjectId } from "@crm/api/core/pipes/validate.object.id.pipes";
import { ShopService } from "@crm/api/modules/shop/shop.service";
import { UserService } from "@crm/api/modules/user/user.service";
import { ShopFormDto } from "@crm/shared/dtos/shop/shop.form.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Put, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";

/** Контроллер принимающие запросы по магазину */
@Controller('shop')
export class ShopController {

  public constructor(private readonly shopService: ShopService,
                     private readonly userService: UserService) {
  }

  /** Get-запрос на получение списка всех магазинов
   * @param res переменная отвечает за возврат данных клиенту
   * @return Возвращает массив магазинов */
  @Roles(RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR, RoleEnum.MANAGER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  public async getAll(@Res() res: Response) {
    const entities = await this.shopService.findAll();
    return res.status(HttpStatus.OK).json(entities).end();
  }

  /** Get-запрос на получение магазин по ID
   * @param res переменная отвечает за возврат данных клиенту
   * @param id ID магазина
   * @return Возвращает магазин */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public async getById(@Res() res: Response, @Param('id', new ValidateObjectId()) id: string) {
    const entity = await this.shopService.findById(id);
    return res.status(HttpStatus.OK).json(entity).end();
  }

  /** Post-запрос на создание магазина
   * @param res переменная отвечает за возврат данных клиенту
   * @param body данные магазина
   * @return Возвращает объект магазина */
  @Roles(RoleEnum.GENERAL_MANAGER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  public async create(@Res() res: Response, @Body() body: ShopFormDto) {
    const entity = await this.shopService.create(body);
    return res.status(HttpStatus.CREATED).json(entity).end();
  }

  /** Put-запрос на изменение магазина
   * @param res переменная отвечает за возврат данных клиенту
   * @param id ID магазина
   * @param body данные магазина
   * @return Возвращает объект магазина */
  @Roles(RoleEnum.GENERAL_MANAGER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put(':id')
  public async update(@Res() res: Response, @Param('id', new ValidateObjectId()) id: string, @Body() body: ShopFormDto) {
    const entity = await this.shopService.update(id, body);
    if (!entity) {
      throw new NotFoundException("Нет такого объекта!");
    }
    return res.status(HttpStatus.OK).json(entity).end();
  }

  /** Delete-запрос на удаление магазина
   * @param res переменная отвечает за возврат данных клиенту
   * @param id ID магазина */
  @Roles(RoleEnum.GENERAL_MANAGER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  public async delete(@Res() res: Response, @Param('id', new ValidateObjectId()) id: string) {
    const entity = await this.shopService.delete(id);
    if (!entity) {
      throw new NotFoundException("Нет такого объекта!");
    }
    const userList = await this.userService.findAll({ shop: entity._id });
    for (const user of userList) {
      await this.userService.update(user._id, { shop: null });
    }
    return res.status(HttpStatus.OK).end();
  }
}
