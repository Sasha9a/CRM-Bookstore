import { Component, Input } from '@angular/core';
import { SupplierFormDto } from "@crm/shared/dtos/supplier/supplier.form.dto";
import { ErrorService } from "@crm/web/core/services/error.service";
import { BaseFormComponent } from "@crm/web/shared/dumbs/base-form/base-form.component";

/** Компонент ввода данных поставщика */
@Component({
  selector: 'crm-supplier-form',
  templateUrl: './supplier-form.component.html',
  styleUrls: []
})
export class SupplierFormComponent extends BaseFormComponent<SupplierFormDto> {

  /** Данные поставщика */
  @Input() public supplier = new SupplierFormDto();
  public dto = SupplierFormDto;

  /** URL на который возвращать при отмене */
  @Input() public route: string;

  public constructor(public override readonly errorService: ErrorService) {
    super(errorService);
  }

  /** Функция записывает период в переменную
   * @param dates Период */
  public setDateRange(dates: [Date, Date]) {
    [this.supplier.dateFrom, this.supplier.dateTo] = dates;
  }

}
