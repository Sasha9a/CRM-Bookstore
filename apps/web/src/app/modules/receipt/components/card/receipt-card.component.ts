import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { ProductReceiptDto } from "@crm/shared/dtos/product/product.receipt.dto";
import { ReceiptDto } from "@crm/shared/dtos/receipt/receipt.dto";
import { CrmTableColumn } from "@crm/web/core/models/crm-table-column";
import { ErrorService } from "@crm/web/core/services/error.service";
import { ReceiptStateService } from "@crm/web/core/services/receipt/receipt-state.service";
import * as moment from "moment-timezone";

/** Компонент карточки данных о чеке */
@Component({
  selector: 'crm-receipt-card',
  templateUrl: './receipt-card.component.html',
  styleUrls: []
})
export class ReceiptCardComponent implements OnInit {

  /** Данные чека */
  public receipt: ReceiptDto;

  /** Идет загрузка или нет */
  public loading = true;

  /** Столбцы таблицы */
  public itemColumns: CrmTableColumn[] = [
    { style: { 'width.px': '80' } },
    { label: 'Название', name: 'name', sort: 'name:string' },
    { label: 'ID товара', name: 'code', sort: 'code:string' },
    { label: 'Категория', name: 'category', sort: 'category.name:string' },
    { label: 'Цена за шт.', name: 'price', sort: 'price:number' },
    { label: 'Кол-во', name: 'count', sort: 'count:number' },
    { label: 'Общая цена', name: 'totalPrice', sort: 'totalPrice:number' }
  ];

  public constructor(private readonly receiptStateService: ReceiptStateService,
                     private readonly route: ActivatedRoute,
                     private readonly errorService: ErrorService,
                     private readonly title: Title) { }

  public ngOnInit(): void {
    const receiptId = this.route.snapshot.params['id'];

    if (!receiptId) {
      return this.errorService.addCustomError('Ошибка', 'Произошла ошибка, вернитесь на главную и попробуйте снова.');
    }

    this.receiptStateService.findById<ReceiptDto>(receiptId).subscribe((receipt) => {
      this.receipt = receipt;
      this.title.setTitle(`Чек за ${moment(this.receipt.date).format('DD.MM.YYYY')} - CRM`);
      this.loading = false;
    }, () => this.loading = false);
  }

  /** Функция типизирует переменную
   * @param product товар
   * @return возвращает товар */
  public toProduct(product: any): ProductReceiptDto {
    return product as ProductReceiptDto;
  }

}
