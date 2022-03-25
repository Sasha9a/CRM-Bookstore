import { Roles } from "@crm/api/core/decorators/role.decorator";
import { JwtAuthGuard } from "@crm/api/core/guards/jwt-auth.guard";
import { RoleGuard } from "@crm/api/core/guards/role.guard";
import { ValidateObjectId } from "@crm/api/core/pipes/validate.object.id.pipes";
import { SupplierService } from "@crm/api/modules/supplier/supplier.service";
import { ShopFormDto } from "@crm/shared/dtos/shop/shop.form.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Put, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";

/** Контроллер принимающие запросы по поставщику */
@Controller('supplier')
export class SupplierController {

  public constructor(private readonly supplierService: SupplierService) {
  }

  /** Get-запрос на получение списка всех поставщиков
   * @param res переменная отвечает за возврат данных клиенту
   * @return Возвращает массив поставщиков */
  @Roles(RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR, RoleEnum.MANAGER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  public async getAll(@Res() res: Response) {
    await this.supplierService.deleteOverdue();
    const entities = await this.supplierService.findAll();
    return res.status(HttpStatus.OK).json(entities).end();
  }

  /** Get-запрос на получение поставщика по ID
   * @param res переменная отвечает за возврат данных клиенту
   * @param id ID поставщика
   * @return Возвращает поставщика */
  @Roles(RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR, RoleEnum.MANAGER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get(':id')
  public async getById(@Res() res: Response, @Param('id', new ValidateObjectId()) id: string) {
    await this.supplierService.deleteOverdue();
    const entity = await this.supplierService.findById(id);
    return res.status(HttpStatus.OK).json(entity).end();
  }

  /** Post-запрос на создание поставщика
   * @param res переменная отвечает за возврат данных клиенту
   * @param body данные поставщика
   * @return Возвращает объект поставщика */
  @Roles(RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR, RoleEnum.MANAGER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  public async create(@Res() res: Response, @Body() body: ShopFormDto) {
    await this.supplierService.deleteOverdue();
    const entity = await this.supplierService.create(body);
    return res.status(HttpStatus.CREATED).json(entity).end();
  }

  /** Put-запрос на изменение поставщика
   * @param res переменная отвечает за возврат данных клиенту
   * @param id ID поставщика
   * @param body данные поставщика
   * @return Возвращает объект поставщика */
  @Roles(RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR, RoleEnum.MANAGER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put(':id')
  public async update(@Res() res: Response, @Param('id', new ValidateObjectId()) id: string, @Body() body: ShopFormDto) {
    await this.supplierService.deleteOverdue();
    const entity = await this.supplierService.update(id, body);
    if (!entity) {
      throw new NotFoundException("Нет такого объекта!");
    }
    return res.status(HttpStatus.OK).json(entity).end();
  }

  /** Delete-запрос на удаление поставщика
   * @param res переменная отвечает за возврат данных клиенту
   * @param id ID поставщика */
  @Roles(RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR, RoleEnum.MANAGER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  public async delete(@Res() res: Response, @Param('id', new ValidateObjectId()) id: string) {
    await this.supplierService.deleteOverdue();
    const entity = await this.supplierService.delete(id);
    if (!entity) {
      throw new NotFoundException("Нет такого объекта!");
    }
    return res.status(HttpStatus.OK).end();
  }

}
