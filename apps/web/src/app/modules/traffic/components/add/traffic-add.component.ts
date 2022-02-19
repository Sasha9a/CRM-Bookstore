import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { ShopTrafficDto } from "@crm/shared/dtos/shop/shop.traffic.dto";
import { TrafficDto } from "@crm/shared/dtos/traffic/traffic.dto";
import { TrafficFormDto } from "@crm/shared/dtos/traffic/traffic.form.dto";
import { CrmTableColumn } from "@crm/web/core/models/crm-table-column";
import { ErrorService } from "@crm/web/core/services/error.service";
import { ShopStateService } from "@crm/web/core/services/shop/shop-state.service";
import { TrafficStateService } from "@crm/web/core/services/traffic/traffic-state.service";
import { validate } from "@crm/web/core/services/validation/validate.service";
import * as moment from "moment-timezone";

/** Компонент создания трафика */
@Component({
  selector: 'crm-traffic-add',
  templateUrl: './traffic-add.component.html',
  styleUrls: []
})
export class TrafficAddComponent implements OnInit {

  /** Данные заказа */
  public traffic = new TrafficFormDto();

  /** Ошибки при валидации данных в форме */
  public errors: Record<keyof TrafficFormDto, any[]>;

  /** Грузится ли или нет */
  public loading = true;

  /** Все магазины */
  public shops: ShopDto[] = [];

  /** Сегодняшняя дата */
  public currentDate = moment().toDate();

  /** Столбцы таблицы */
  public itemColumns: CrmTableColumn[] = [
    { label: 'Магазин', name: 'shop', sort: 'shop.address:string' },
    { label: 'Вошли' },
    { label: 'Прошли мимо' },
    { label: 'Конверсия, вход', style: { 'max-width.px': 100 } }
  ];

  public constructor(private readonly trafficStateService: TrafficStateService,
                     private readonly shopStateService: ShopStateService,
                     private readonly errorService: ErrorService,
                     private readonly router: Router) { }

  public ngOnInit(): void {
    this.shopStateService.find<ShopDto>().subscribe((shops) => {
      this.shops = shops;
      this.traffic.shops = this.shops.map((shop) => {
        return <ShopTrafficDto>{
          shop: shop,
          in: 0,
          notcome: 0,
          entrance: 0
        };
      });
      this.loading = false;
    }, () => this.loading = false);
  }

  /** Обновляет аналитику в таблице */
  public updateAnalytics() {
    this.traffic.shops.forEach((shop) => {
      shop.entrance = shop.in / shop.notcome * 100;
    });
    this.traffic.in = this.traffic.shops.reduce((sum, shop) => sum + shop.in, 0);
    this.traffic.notcome = this.traffic.shops.reduce((sum, shop) => sum + shop.notcome, 0);
    this.traffic.entrance = this.traffic.in / this.traffic.notcome * 100;
  }

  /** Функция создает трафик */
  public create() {
    this.loading = true;

    const { valid, errors } = validate(this.traffic, TrafficFormDto);
    if (!valid) {
      this.errors = errors;
      this.errorService.errorValues<TrafficFormDto>(this.errors);
      console.log(this.errors);
      this.loading = false;
    } else {
      this.errors = null;

      this.trafficStateService.create<TrafficFormDto, TrafficDto>(this.traffic).subscribe(() => {
        this.loading = false;
        this.errorService.addSuccessMessage("Трафик создан");
        this.router.navigate(['']).catch(console.error);
      }, () => this.loading = false);
    }
  }

  /** Функция типизирует переменную
   * @param shop магазин
   * @return возвращает магазин */
  public toShop(shop: any): ShopTrafficDto {
    return shop as ShopTrafficDto;
  }

}
