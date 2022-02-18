import { Roles } from "@crm/api/core/decorators/role.decorator";
import { JwtAuthGuard } from "@crm/api/core/guards/jwt-auth.guard";
import { RoleGuard } from "@crm/api/core/guards/role.guard";
import { ValidateObjectId } from "@crm/api/core/pipes/validate.object.id.pipes";
import { queryParamParser } from "@crm/api/core/services/query-param-parser.service";
import { OrderService } from "@crm/api/modules/order/order.service";
import { ProductService } from "@crm/api/modules/product/product.service";
import { OrderFormDto } from "@crm/shared/dtos/order/order.form.dto";
import { UserDto } from "@crm/shared/dtos/user/user.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";

/** Контроллер принимающие запросы по заказам */
@Controller('order')
export class OrderController {

  public constructor(private readonly orderService: OrderService,
                     private readonly productService: ProductService) {
  }

  /** Get-запрос на получение списка всех заказов
   * @param res переменная отвечает за возврат данных клиенту
   * @param queryParams параметры от клиента
   * @return Возвращает массив заказов */
  @Roles(RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  public async getAll(@Res() res: Response, @Query() queryParams: any) {
    const entities = await this.orderService.findAll(queryParamParser(queryParams).filter);
    return res.status(HttpStatus.OK).json(entities).end();
  }

  /** Get-запрос на получение последних заказов по конкретному товару
   * @param res переменная отвечает за возврат данных клиенту
   * @param req переменная отвечает за приход данных от клиента
   * @param id ID товара
   * @return Возвращает массив заказов */
  @Roles(RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/product/:id')
  public async getAllByProduct(@Res() res: Response, @Req() req: Request, @Param('id', new ValidateObjectId()) id: string) {
    const user: UserDto = req.user as UserDto;
    const entities = await this.orderService.getAllByProduct(id, user.shop?._id);
    entities.forEach((entity) => {
      entity.products = entity.products.filter((product) => product._id === id);
      entity.sum = undefined;
    });
    return res.status(HttpStatus.OK).json(entities).end();
  }

  /** Get-запрос на получение заказа по ID
   * @param res переменная отвечает за возврат данных клиенту
   * @param id ID заказа
   * @return Возвращает заказ */
  @Roles(RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get(':id')
  public async getById(@Res() res: Response, @Param('id', new ValidateObjectId()) id: string) {
    const entity = await this.orderService.findById(id);
    return res.status(HttpStatus.OK).json(entity).end();
  }

  /** Post-запрос на создание заказа
   * @param res переменная отвечает за возврат данных клиенту
   * @param body данные заказа
   * @return Возвращает объект заказа */
  @Roles(RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR, RoleEnum.MANAGER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  public async create(@Res() res: Response, @Body() body: OrderFormDto) {
    body.employee = {
      _id: body.employee._id,
      name: body.employee.name
    };
    body.shop = {
      _id: body.shop._id,
      address: body.shop.address
    };
    for (const product of body.products) {
      product.category = {
        _id: product.category._id,
        name: product.category.name
      };
      const selectProduct = await this.productService.findById(product._id);
      if (selectProduct?.count) {
        selectProduct.count[body.shop._id] += product.count;
        selectProduct.markModified('count');
        await selectProduct.save();
      }
    }
    const entity = await this.orderService.create(body);
    return res.status(HttpStatus.CREATED).json(entity).end();
  }

  /** Delete-запрос на удаление заказа
   * @param res переменная отвечает за возврат данных клиенту
   * @param id ID заказа */
  @Roles(RoleEnum.GENERAL_MANAGER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  public async delete(@Res() res: Response, @Param('id', new ValidateObjectId()) id: string) {
    const entity = await this.orderService.delete(id);
    if (!entity) {
      throw new NotFoundException("Нет такого объекта!");
    }
    return res.status(HttpStatus.OK).end();
  }

}
