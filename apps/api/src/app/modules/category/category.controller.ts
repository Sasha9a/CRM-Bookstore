import { Roles } from "@crm/api/core/decorators/role.decorator";
import { JwtAuthGuard } from "@crm/api/core/guards/jwt-auth.guard";
import { RoleGuard } from "@crm/api/core/guards/role.guard";
import { ValidateObjectId } from "@crm/api/core/pipes/validate.object.id.pipes";
import { CategoryService } from "@crm/api/modules/category/category.service";
import { ProductService } from "@crm/api/modules/product/product.service";
import { CategoryFormDto } from "@crm/shared/dtos/category/category.form.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Put, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";

/** Контроллер принимающие запросы по категории */
@Controller('category')
export class CategoryController {

  public constructor(private readonly categoryService: CategoryService,
                     private readonly productService: ProductService) {
  }

  /** Get-запрос на получение списка всех категорий и подкатегорий
   * @param res переменная отвечает за возврат данных клиенту
   * @return Возвращает массив категорий и подкатегорий */
  @UseGuards(JwtAuthGuard)
  @Get()
  public async getAll(@Res() res: Response) {
    let entities = await this.categoryService.findAll();
    entities = entities.filter((entity) => !entity.parentId);
    return res.status(HttpStatus.OK).json(entities).end();
  }

  /** Get-запрос на получение категорий/подкатегории по ID
   * @param res переменная отвечает за возврат данных клиенту
   * @param id ID категории/подкатегории
   * @return Возвращает категорию/подкатегорию */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public async getById(@Res() res: Response, @Param('id', new ValidateObjectId()) id: string) {
    const entity = await this.categoryService.findById(id);
    return res.status(HttpStatus.OK).json(entity).end();
  }

  /** Post-запрос на создание категории/подкатегории
   * @param res переменная отвечает за возврат данных клиенту
   * @param body данные категории/подкатегории
   * @return Возвращает объект категории/подкатегории */
  @Roles(RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR, RoleEnum.MANAGER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  public async create(@Res() res: Response, @Body() body: CategoryFormDto) {
    const entity = await this.categoryService.create(body);
    if (entity.parentId) {
      const parent = await this.categoryService.findById(entity.parentId);
      parent.children.push(entity);
      await parent.save();
    }
    return res.status(HttpStatus.CREATED).json(entity).end();
  }

  /** Put-запрос на изменение категории/подкатегории
   * @param res переменная отвечает за возврат данных клиенту
   * @param id ID категории/подкатегории
   * @param body данные категории/подкатегории
   * @return Возвращает объект категории/подкатегории */
  @Roles(RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR, RoleEnum.MANAGER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put(':id')
  public async update(@Res() res: Response, @Param('id', new ValidateObjectId()) id: string, @Body() body: CategoryFormDto) {
    const entity = await this.categoryService.update(id, body);
    if (!entity) {
      throw new NotFoundException("Нет такого объекта!");
    }
    return res.status(HttpStatus.OK).json(entity).end();
  }

  /** Delete-запрос на удаление категории/подкатегории
   * @param res переменная отвечает за возврат данных клиенту
   * @param id ID категории/подкатегории */
  @Roles(RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR, RoleEnum.MANAGER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  public async delete(@Res() res: Response, @Param('id', new ValidateObjectId()) id: string) {
    const entity = await this.categoryService.delete(id);
    if (!entity) {
      throw new NotFoundException("Нет такого объекта!");
    }
    const isParent = !!entity.parentId;
    if (isParent) {
      const parent = await this.categoryService.findById(entity.parentId);
      if (parent?.children) {
        parent.children.push(...entity.children);
        await parent.save();
      }
    }

    const children = await this.categoryService.findAll({ parentId: entity.id });
    for (const child of children) {
      await this.categoryService.update(child._id, { parentId: isParent ? entity.parentId : null });
    }

    const products = await this.productService.findAll({ category: entity._id });
    for (const product of products) {
      await this.productService.update(product._id, { category: isParent ? entity.parentId : null });
    }
    return res.status(HttpStatus.OK).end();
  }

}
