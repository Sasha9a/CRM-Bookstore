import { Component, OnInit } from '@angular/core';
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { CrmTableColumn } from "@crm/web/core/models/crm-table-column";
import { ShopStateService } from "@crm/web/core/services/shop/shop-state.service";

/** Компонент показывает список магазинов */
@Component({
  selector: 'crm-list',
  templateUrl: './shop-list.component.html',
  styleUrls: []
})
export class ShopListComponent implements OnInit {

  /** Магазины */
  public shops: ShopDto[];

  /** Грузится ли или нет */
  public loading = false;

  /** Столбцы таблицы */
  public itemColumns: CrmTableColumn[] = [
    { label: 'Адрес', name: 'address', sort: 'address:string' },
    { label: 'Метро', name: 'metro', sort: 'metro:string' },
    { label: 'Режим работы', name: 'openingHours', sort: 'openingHours:string' }
  ];

  public constructor(private readonly shopStateService: ShopStateService) { }

  public ngOnInit(): void {
    this.loadShops();
  }

  /** Функция загружает данные */
  public loadShops() {
    this.loading = true;

    this.shopStateService.find<ShopDto>().subscribe((data) => {
      this.shops = data;
      this.loading = false;
    }, () => this.loading = false);
  }

  /** Функция типизирует переменную
   * @param shop магазин
   * @return возвращает магазин */
  public toShop(shop: any): ShopDto {
    return shop as ShopDto;
  }

}
