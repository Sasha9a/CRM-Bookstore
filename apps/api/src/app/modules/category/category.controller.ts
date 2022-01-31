import { Roles } from "@crm/api/core/decorators/role.decorator";
import { JwtAuthGuard } from "@crm/api/core/guards/jwt-auth.guard";
import { RoleGuard } from "@crm/api/core/guards/role.guard";
import { ValidateObjectId } from "@crm/api/core/pipes/validate.object.id.pipes";
import { CategoryService } from "@crm/api/modules/category/category.service";
import { CategoryFormDto } from "@crm/shared/dtos/category/category.form.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Put, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";

/** Контроллер принимающие запросы по категории */
@Controller('category')
export class CategoryController {

  public constructor(private readonly categoryService: CategoryService) {
  }

  /** Get-запрос на получение списка всех категорий и подкатегорий
   * @param res переменная отвечает за возврат данных клиенту
   * @return Возвращает массив категорий и подкатегорий */
  @UseGuards(JwtAuthGuard)
  @Get()
  public async getAll(@Res() res: Response) {
    let entities = await this.categoryService.findAll();
    entities = entities.filter((entity) => !entity.parent);
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
    if (entity.parent) {
      const parent = await this.categoryService.findById(entity.parent._id);
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
    if (entity.parent) {
      const parent = await this.categoryService.findById(entity.parent._id);
      await this.categoryService.update(parent._id, { children: parent.children });
    }
    return res.status(HttpStatus.OK).end();
  }

}
