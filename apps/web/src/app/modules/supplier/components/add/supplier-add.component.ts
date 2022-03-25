import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { SupplierDto } from "@crm/shared/dtos/supplier/supplier.dto";
import { SupplierFormDto } from "@crm/shared/dtos/supplier/supplier.form.dto";
import { ErrorService } from "@crm/web/core/services/error.service";
import { SupplierStateService } from "@crm/web/core/services/supplier/supplier-state.service";

/** Компонент добавления поставщика */
@Component({
  selector: 'crm-supplier-add',
  templateUrl: './supplier-add.component.html',
  styleUrls: []
})
export class SupplierAddComponent {

  /** Сохраняется ли или нет */
  public saving = false;

  public constructor(private readonly supplierStateService: SupplierStateService,
                     private readonly errorService: ErrorService,
                     private readonly router: Router) { }

  /** Функция создает поставщика
   * @param body данные поставщика */
  public create(body: SupplierFormDto) {
    this.saving = true;

    this.supplierStateService.create<SupplierFormDto, SupplierDto>(body).subscribe(() => {
      this.saving = false;
      this.errorService.addSuccessMessage("Поставщик успешно добавлен");
      this.router.navigate(['/supplier']).catch(console.error);
    }, () => this.saving = false);
  }

}
