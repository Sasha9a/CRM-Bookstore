import { Roles } from "@crm/api/core/decorators/role.decorator";
import { JwtAuthGuard } from "@crm/api/core/guards/jwt-auth.guard";
import { RoleGuard } from "@crm/api/core/guards/role.guard";
import { ValidateObjectId } from "@crm/api/core/pipes/validate.object.id.pipes";
import { ReceiptService } from "@crm/api/modules/receipt/receipt.service";
import { TrafficService } from "@crm/api/modules/traffic/traffic.service";
import { ReceiptDto } from "@crm/shared/dtos/receipt/receipt.dto";
import { TrafficReportDto } from "@crm/shared/dtos/traffic/report/traffic.report.dto";
import { TrafficReportItemDto } from "@crm/shared/dtos/traffic/report/traffic.report.item.dto";
import { TrafficReportQueryParamsDto } from "@crm/shared/dtos/traffic/report/traffic.report.query.params.dto";
import { TrafficDto } from "@crm/shared/dtos/traffic/traffic.dto";
import { TrafficFormDto } from "@crm/shared/dtos/traffic/traffic.form.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Query, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import * as moment from "moment-timezone";

/** Контроллер принимающие запросы по трафику */
@Controller('traffic')
export class TrafficController {

  public constructor(private readonly trafficService: TrafficService,
                     private readonly receiptService: ReceiptService) {
  }

  /** Get-запрос на получение списка всех данных о трафике
   * @param res переменная отвечает за возврат данных клиенту
   * @param queryParams параметры от клиента
   * @return Возвращает массив данных о трафике */
  @Roles(RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  public async getAll(@Res() res: Response, @Query() queryParams: TrafficReportQueryParamsDto) {
    const result: TrafficReportDto = {
      sums: {
        days: {},
        weeks: {},
        months: {},
        in: 0,
        notcome: 0,
        entrance: 0,
        countReceipt: 0,
        conversionReceipt: 0
      },
      items: []
    };

    let receipts: ReceiptDto[];
    let traffics: TrafficDto[];
    if (queryParams.shop !== 'undefined') {
      receipts = await this.receiptService.findAll({
        date: {
          $gte: moment(queryParams.from, 'YYYY-MM-DD').toISOString(),
          $lte: moment(queryParams.to, 'YYYY-MM-DD').toISOString()
        },
        'shop._id': queryParams.shop
      });
      traffics = await this.trafficService.findAll({
        date: {
          $gte: moment(queryParams.from, 'YYYY-MM-DD').toISOString(),
          $lte: moment(queryParams.to, 'YYYY-MM-DD').toISOString()
        },
        shops: {
          $elemMatch: {
            'shop._id': queryParams.shop
          }
        }
      });
    } else if (queryParams) {
      receipts = await this.receiptService.findAll({
        date: {
          $gte: moment(queryParams.from, 'YYYY-MM-DD').toISOString(),
          $lte: moment(queryParams.to, 'YYYY-MM-DD').toISOString()
        }
      });
      traffics = await this.trafficService.findAll({
        date: {
          $gte: moment(queryParams.from, 'YYYY-MM-DD').toISOString(),
          $lte: moment(queryParams.to, 'YYYY-MM-DD').toISOString()
        }
      });
    }
    for (const traffic of traffics) {
      if (queryParams.shop !== 'undefined') {
        traffic.shops = traffic.shops.filter((shop) => shop.shop?._id === queryParams.shop);
      }
      for (const shop of traffic.shops) {
        const countReceipt = receipts.reduce((sum, receipt) => {
          if (moment(receipt.date).format('YYYY-MM-DD') === moment(traffic.date).format('YYYY-MM-DD')
            && receipt.shop?._id === shop.shop?._id) {
            return sum + 1;
          }
          return sum;
        }, 0);
        const data: TrafficReportItemDto = {
          countReceipt: countReceipt,
          conversionReceipt: countReceipt / shop.in * 100,
          date: traffic.date,
          shop: shop
        };
        result.items.push(data);
      }
    }

    const dateToDay = moment(queryParams.to).clone().add(1, 'day');
    const dateToWeek = moment(queryParams.to).clone().add(1, 'week');
    const dateToMonth = moment(queryParams.to).clone().add(1, 'month');

    for (const date = moment(queryParams.from); date.isBefore(dateToDay, 'day'); date.add(1, 'day')) {
      if (result.items.findIndex((item) => moment(item.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')) !== -1) {
        const items = result.items.filter((item) => moment(item.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD'));
        result.sums.days[date.format('YYYY-MM-DD')] = {
          in: items.reduce((sum, item) => sum + item.shop.in, 0),
          notcome: items.reduce((sum, item) => sum + item.shop.notcome, 0),
          receipt: items.reduce((sum, item) => sum + item.countReceipt, 0)
        };
      }
    }

    for (const date = moment(queryParams.from); date.isBefore(dateToWeek, 'week'); date.add(1, 'week')) {
      if (result.items.findIndex((item) => moment(item.date).format('YYYY-WW') === date.format('YYYY-WW')) !== -1) {
        const items = result.items.filter((item) => moment(item.date).format('YYYY-WW') === date.format('YYYY-WW'));
        result.sums.weeks[date.format('YYYY-WW')] = {
          in: items.reduce((sum, item) => sum + item.shop.in, 0),
          notcome: items.reduce((sum, item) => sum + item.shop.notcome, 0),
          receipt: items.reduce((sum, item) => sum + item.countReceipt, 0)
        };
      }
    }

    for (const date = moment(queryParams.from); date.isBefore(dateToMonth, 'month'); date.add(1, 'month')) {
      if (result.items.findIndex((item) => moment(item.date).format('YYYY-MM') === date.format('YYYY-MM')) !== -1) {
        const items = result.items.filter((item) => moment(item.date).format('YYYY-MM') === date.format('YYYY-MM'));
        result.sums.months[date.format('YYYY-MM')] = {
          in: items.reduce((sum, item) => sum + item.shop.in, 0),
          notcome: items.reduce((sum, item) => sum + item.shop.notcome, 0),
          receipt: items.reduce((sum, item) => sum + item.countReceipt, 0)
        };
      }
    }

    result.sums.in = result.items.reduce((sum, item) => sum + item.shop.in, 0);
    result.sums.notcome = result.items.reduce((sum, item) => sum + item.shop.notcome, 0);
    result.sums.countReceipt = result.items.reduce((sum, item) => sum + item.countReceipt, 0);
    result.sums.entrance = result.sums.in / result.sums.notcome * 100;
    result.sums.conversionReceipt = result.sums.countReceipt / result.sums.in * 100;
    return res.status(HttpStatus.OK).json(result).end();
  }

  /** Post-запрос на создание трафика
   * @param res переменная отвечает за возврат данных клиенту
   * @param body данные трафика
   * @return Возвращает объект трафика */
  @Roles(RoleEnum.GENERAL_MANAGER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  public async create(@Res() res: Response, @Body() body: TrafficFormDto) {
    const entities = await this.trafficService.findAll({ date: body.date });
    if (entities.length) {
      throw new NotFoundException("Аналитика за этот день уже есть");
    }
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
