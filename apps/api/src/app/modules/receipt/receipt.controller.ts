import { Roles } from "@crm/api/core/decorators/role.decorator";
import { JwtAuthGuard } from "@crm/api/core/guards/jwt-auth.guard";
import { RoleGuard } from "@crm/api/core/guards/role.guard";
import { ValidateObjectId } from "@crm/api/core/pipes/validate.object.id.pipes";
import { queryParamParser } from "@crm/api/core/services/query-param-parser.service";
import { ReceiptService } from "@crm/api/modules/receipt/receipt.service";
import { ReceiptFormDto } from "@crm/shared/dtos/receipt/receipt.form.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Query, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";

/** Контроллер принимающие запросы по чекам */
@Controller('receipt')
export class ReceiptController {

  public constructor(private readonly receiptService: ReceiptService) {
  }

  /** Get-запрос на получение списка всех чеков
   * @param res переменная отвечает за возврат данных клиенту
   * @param queryParams параметры от клиента
   * @return Возвращает массив чеков */
  @Roles(RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  public async getAll(@Res() res: Response, @Query() queryParams: any) {
    const entities = await this.receiptService.findAll(queryParamParser(queryParams).filter);
    return res.status(HttpStatus.OK).json(entities).end();
  }

  /** Get-запрос на получение чека по ID
   * @param res переменная отвечает за возврат данных клиенту
   * @param id ID чека
   * @return Возвращает чек */
  @Roles(RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get(':id')
  public async getById(@Res() res: Response, @Param('id', new ValidateObjectId()) id: string) {
    const entity = await this.receiptService.findById(id);
    return res.status(HttpStatus.OK).json(entity).end();
  }

  /** Post-запрос на создание чека
   * @param res переменная отвечает за возврат данных клиенту
   * @param body данные чека
   * @return Возвращает объект чека */
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(@Res() res: Response, @Body() body: ReceiptFormDto) {
    body.salesman = {
      _id: body.salesman._id,
      name: body.salesman.name
    };
    body.shop = {
      _id: body.shop._id,
      address: body.shop.address
    };
    body.products.forEach((product) => {
      product.category = {
        _id: product.category._id,
        name: product.category.name
      };
    });
    const entity = await this.receiptService.create(body);
    return res.status(HttpStatus.CREATED).json(entity).end();
  }

  /** Delete-запрос на удаление чека
   * @param res переменная отвечает за возврат данных клиенту
   * @param id ID чека */
  @Roles(RoleEnum.GENERAL_MANAGER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  public async delete(@Res() res: Response, @Param('id', new ValidateObjectId()) id: string) {
    const entity = await this.receiptService.delete(id);
    if (!entity) {
      throw new NotFoundException("Нет такого объекта!");
    }
    return res.status(HttpStatus.OK).end();
  }

}
