import { Roles } from "@crm/api/core/decorators/role.decorator";
import { JwtAuthGuard } from "@crm/api/core/guards/jwt-auth.guard";
import { RoleGuard } from "@crm/api/core/guards/role.guard";
import { ValidateObjectId } from "@crm/api/core/pipes/validate.object.id.pipes";
import { queryParamParser } from "@crm/api/core/services/query-param-parser.service";
import { TrafficService } from "@crm/api/modules/traffic/traffic.service";
import { TrafficFormDto } from "@crm/shared/dtos/traffic/traffic.form.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Query, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";

/** Контроллер принимающие запросы по трафику */
@Controller('traffic')
export class TrafficController {

  public constructor(private readonly trafficService: TrafficService) {
  }

  /** Get-запрос на получение списка всех данных о трафике
   * @param res переменная отвечает за возврат данных клиенту
   * @param queryParams параметры от клиента
   * @return Возвращает массив данных о трафике */
  @Roles(RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  public async getAll(@Res() res: Response, @Query() queryParams: any) {
    const entities = await this.trafficService.findAll(queryParamParser(queryParams).filter);
    return res.status(HttpStatus.OK).json(entities).end();
  }

  /** Post-запрос на создание трафика
   * @param res переменная отвечает за возврат данных клиенту
   * @param body данные трафика
   * @return Возвращает объект трафика */
  @Roles(RoleEnum.GENERAL_MANAGER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  public async create(@Res() res: Response, @Body() body: TrafficFormDto) {
    const entity = await this.trafficService.create(body);
    return res.status(HttpStatus.CREATED).json(entity).end();
  }

  /** Delete-запрос на удаление трафика
   * @param res переменная отвечает за возврат данных клиенту
   * @param id ID трафика */
  @Roles(RoleEnum.GENERAL_MANAGER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  public async delete(@Res() res: Response, @Param('id', new ValidateObjectId()) id: string) {
    const entity = await this.trafficService.delete(id);
    if (!entity) {
      throw new NotFoundException("Нет такого объекта!");
    }
    return res.status(HttpStatus.OK).end();
  }

}
