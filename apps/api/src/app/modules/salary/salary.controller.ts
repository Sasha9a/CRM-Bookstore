import { Roles } from "@crm/api/core/decorators/role.decorator";
import { JwtAuthGuard } from "@crm/api/core/guards/jwt-auth.guard";
import { RoleGuard } from "@crm/api/core/guards/role.guard";
import { ValidateObjectId } from "@crm/api/core/pipes/validate.object.id.pipes";
import { SalaryService } from "@crm/api/modules/salary/salary.service";
import { SalaryFormDto } from "@crm/shared/dtos/salary/salary.form.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";

/** Контроллер принимающие запросы по зарплатам */
@Controller('salary')
export class SalaryController {

  public constructor(private readonly salaryService: SalaryService) {
  }

  /** Get-запрос на получение списка всех актов о зарплатах
   * @param res переменная отвечает за возврат данных клиенту
   * @return Возвращает массив актов */
  @Roles(RoleEnum.GENERAL_MANAGER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  public async getAll(@Res() res: Response) {
    const entities = await this.salaryService.findAll();
    return res.status(HttpStatus.OK).json(entities).end();
  }

  /** Get-запрос на получение последних актов о зарплатах по конкретному сотруднику
   * @param res переменная отвечает за возврат данных клиенту
   * @param id ID сотрудника
   * @return Возвращает массив актов */
  @Roles(RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get(':id')
  public async getAllFromUser(@Res() res: Response, @Param('id', new ValidateObjectId()) id: string) {
    const entities = await this.salaryService.findAllFromUser(id);
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
