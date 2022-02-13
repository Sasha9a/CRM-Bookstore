import { Roles } from "@crm/api/core/decorators/role.decorator";
import { JwtAuthGuard } from "@crm/api/core/guards/jwt-auth.guard";
import { RoleGuard } from "@crm/api/core/guards/role.guard";
import { ValidateObjectId } from "@crm/api/core/pipes/validate.object.id.pipes";
import { queryParamParser } from "@crm/api/core/services/query-param-parser.service";
import { SalaryService } from "@crm/api/modules/salary/salary.service";
import { SalaryFormDto } from "@crm/shared/dtos/salary/salary.form.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Query, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";

/** Контроллер принимающие запросы по зарплатам */
@Controller('salary')
export class SalaryController {

  public constructor(private readonly salaryService: SalaryService) {
  }

  /** Get-запрос на получение списка всех актов о зарплатах
   * @param res переменная отвечает за возврат данных клиенту
   * @param queryParams параметры от клиента
   * @return Возвращает массив актов */
  @Roles(RoleEnum.GENERAL_MANAGER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  public async getAll(@Res() res: Response, @Query() queryParams: any) {
    const entities = await this.salaryService.findAll(queryParamParser(queryParams).filter);
    return res.status(HttpStatus.OK).json(entities).end();
  }

  /** Get-запрос на получение последних актов о зарплатах по конкретному сотруднику
   * @param res переменная отвечает за возврат данных клиенту
   * @param id ID сотрудника
   * @return Возвращает массив актов */
  @Roles(RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/user/:id')
  public async getAllByUser(@Res() res: Response, @Param('id', new ValidateObjectId()) id: string) {
    const entities = await this.salaryService.getAllByUser(id);
    entities.forEach((entity) => {
      entity.info = entity.info.filter((info) => info.user?._id === id);
      entity.sum = undefined;
    });
    return res.status(HttpStatus.OK).json(entities).end();
  }

  /** Get-запрос на получение акта зарплаты по ID
   * @param res переменная отвечает за возврат данных клиенту
   * @param id ID акта
   * @return Возвращает акт о зарплате */
  @Roles(RoleEnum.GENERAL_MANAGER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get(':id')
  public async getById(@Res() res: Response, @Param('id', new ValidateObjectId()) id: string) {
    const entities = await this.salaryService.findById(id);
    return res.status(HttpStatus.OK).json(entities).end();
  }

  /** Post-запрос на создание акта о зарплате
   * @param res переменная отвечает за возврат данных клиенту
   * @param body данные акта зарплат
   * @return Возвращает объект акта зарплат */
  @Roles(RoleEnum.GENERAL_MANAGER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  public async create(@Res() res: Response, @Body() body: SalaryFormDto) {
    body.info.forEach((entity) => {
      if (entity.user) {
        entity.user = {
          _id: entity.user._id,
          salary: entity.user.salary,
          schedule: entity.user.schedule,
          startDate: entity.user.startDate
        };
      }
    });
    const entity = await this.salaryService.create(body);
    return res.status(HttpStatus.CREATED).json(entity).end();
  }

  /** Delete-запрос на удаление данные о зарплате
   * @param res переменная отвечает за возврат данных клиенту
   * @param id ID акта зарплаты */
  @Roles(RoleEnum.GENERAL_MANAGER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  public async delete(@Res() res: Response, @Param('id', new ValidateObjectId()) id: string) {
    const entity = await this.salaryService.delete(id);
    if (!entity) {
      throw new NotFoundException("Нет такого объекта!");
    }
    return res.status(HttpStatus.OK).end();
  }

}
