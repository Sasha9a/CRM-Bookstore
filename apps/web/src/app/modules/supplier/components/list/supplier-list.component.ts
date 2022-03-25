import { Component, OnInit } from '@angular/core';
import { SupplierDto } from "@crm/shared/dtos/supplier/supplier.dto";
import { CrmTableColumn } from "@crm/web/core/models/crm-table-column";
import { SupplierStateService } from "@crm/web/core/services/supplier/supplier-state.service";
import * as moment from "moment-timezone";

@Component({
  selector: 'crm-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: []
})
export class SupplierListComponent implements OnInit {

  /** Поставщики */
  public suppliers: SupplierDto[];

  /** Грузится ли или нет */
  public loading = false;

  /** Столбцы таблицы */
  public itemColumns: CrmTableColumn[] = [
    { label: 'Название', name: 'name', sort: 'name:string' },
    { label: 'Дата начала договора', name: 'dateFrom', sort: 'dateFrom:date' },
    { label: 'Дата окончания договора', name: 'dateTo', sort: 'dateTo:date' },
    { label: 'Сумма договора', name: 'sum', sort: 'sum:number' },
    { label: 'Дней до окончания', name: 'daysToEnd', sort: 'daysToEnd:number' }
  ];

  public constructor(private readonly supplierStateService: SupplierStateService) { }

  public ngOnInit(): void {
    this.loadShops();
  }

  /** Функция загружает данные */
  public loadShops() {
    this.loading = true;

    this.supplierStateService.find<SupplierDto>().subscribe((data) => {
      this.suppliers = data;
      this.suppliers.forEach((supplier: SupplierDto & { daysToEnd: number }) => {
        supplier.daysToEnd = moment(supplier.dateTo).diff(moment(), 'days');
      });
      this.loading = false;
    }, () => this.loading = false);
  }

  /** Функция типизирует переменную
   * @param supplier поставщик
   * @return возвращает поставщик */
  public toSupplier(supplier: any): SupplierDto & { daysToEnd: number } {
    return supplier as SupplierDto & { daysToEnd: number };
  }

}
