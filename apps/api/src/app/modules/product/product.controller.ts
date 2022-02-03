import { JwtAuthGuard } from "@crm/api/core/guards/jwt-auth.guard";
import { ValidateObjectId } from "@crm/api/core/pipes/validate.object.id.pipes";
import { ProductService } from "@crm/api/modules/product/product.service";
import { ProductFormDto } from "@crm/shared/dtos/product/product.form.dto";
import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Put, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";

/** Контроллер принимающие запросы по товарам */
@Controller('product')
export class ProductController {

  public constructor(private readonly productService: ProductService) {
  }

  /** Get-запрос на получение списка всех товаров
   * @param res переменная отвечает за возврат данных клиенту
   * @return Возвращает массив товаров */
  @UseGuards(JwtAuthGuard)
  @Get()
  public async getAll(@Res() res: Response) {
    const entities = await this.productService.findAll();
    return res.status(HttpStatus.OK).json(entities).end();
  }

  /** Get-запрос на получение товара по ID
   * @param res переменная отвечает за возврат данных клиенту
   * @param id ID товара
   * @return Возвращает товар */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public async getById(@Res() res: Response, @Param('id', new ValidateObjectId()) id: string) {
    const entity = await this.productService.findById(id);
    return res.status(HttpStatus.OK).json(entity).end();
  }

  /** Post-запрос на создание товара
   * @param res переменная отвечает за возврат данных клиенту
   * @param body данные товара
   * @return Возвращает объект товара */
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(@Res() res: Response, @Body() body: ProductFormDto) {
    let checkCode = false;
    do {
      body.code = "";
      const char = "1234567890";
      for (let i = 0; i < 8; i++) {
        body.code += char.charAt(Math.floor(Math.random() * char.length));
      }
      const entityCode = await this.productService.findAll({ code: body.code });
      if (entityCode?.length === 0) {
        checkCode = true;
      }
    } while (!checkCode);
    const entity = await this.productService.create(body);
    return res.status(HttpStatus.CREATED).json(entity).end();
  }

  /** Put-запрос на изменение товара
   * @param res переменная отвечает за возврат данных клиенту
   * @param id ID товара
   * @param body данные товара
   * @return Возвращает объект товара */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  public async update(@Res() res: Response, @Param('id', new ValidateObjectId()) id: string, @Body() body: ProductFormDto) {
    const entity = await this.productService.update(id, body);
    if (!entity) {
      throw new NotFoundException("Нет такого объекта!");
    }
    return res.status(HttpStatus.OK).json(entity).end();
  }

  /** Delete-запрос на удаление товара
   * @param res переменная отвечает за возврат данных клиенту
   * @param id ID товара */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  public async delete(@Res() res: Response, @Param('id', new ValidateObjectId()) id: string) {
    const entity = await this.productService.update(id, { deleted: true });
    if (!entity) {
      throw new NotFoundException("Нет такого объекта!");
    }
    return res.status(HttpStatus.OK).end();
  }
}
