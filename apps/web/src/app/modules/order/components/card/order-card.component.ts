import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { OrderDto } from "@crm/shared/dtos/order/order.dto";
import { ProductOrderDto } from "@crm/shared/dtos/product/product.order.dto";
import { CrmTableColumn } from "@crm/web/core/models/crm-table-column";
import { ErrorService } from "@crm/web/core/services/error.service";
import { OrderStateService } from "@crm/web/core/services/order/order-state.service";
import * as moment from "moment-timezone";

/** Компонент карточки данных о заказе */
@Component({
  selector: 'crm-order-card',
  templateUrl: './order-card.component.html',
  styleUrls: []
})
export class OrderCardComponent implements OnInit {

  /** Данные заказа */
  public order: OrderDto;

  /** Идет загрузка или нет */
  public loading = true;

  /** Столбцы таблицы */
  public itemColumns: CrmTableColumn[] = [
    { style: { 'width.px': '80' } },
    { label: 'Название', name: 'name', sort: 'name:string' },
    { label: 'Артикул', name: 'code', sort: 'code:string' },
    { label: 'Категория', name: 'category', sort: 'category.name:string' },
    { label: 'Цена за шт. на сайте', name: 'price', sort: 'price:number' },
    { label: 'Цена за шт. от произв.', name: 'priceManufacture', sort: 'priceManufacture:number' },
    { label: 'Кол-во', name: 'count', sort: 'count:number' },
    { label: 'Общая цена', name: 'totalPrice', sort: 'totalPrice:number' },
    { label: 'Наценка', name: 'markup', sort: 'markup:number' },
  ];

  public constructor(private readonly orderStateService: OrderStateService,
                     private readonly route: ActivatedRoute,
                     private readonly errorService: ErrorService,
                     private readonly title: Title) { }

  public ngOnInit(): void {
    const orderId = this.route.snapshot.params['id'];

    if (!orderId) {
      return this.errorService.addCustomError('Ошибка', 'Произошла ошибка, вернитесь на главную и попробуйте снова.');
    }

    this.orderStateService.findById<OrderDto>(orderId).subscribe((order) => {
      this.order = order;
      this.title.setTitle(`Заказ от ${moment(this.order.date).format('DD.MM.YYYY')} - CRM`);
      this.loading = false;
    }, () => this.loading = false);
  }

  /** Функция типизирует переменную
   * @param product товар
   * @return возвращает товар */
  public toProduct(product: any): ProductOrderDto {
    return product as ProductOrderDto;
  }

}
