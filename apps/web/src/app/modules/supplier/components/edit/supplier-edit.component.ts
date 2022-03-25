import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { SupplierDto } from "@crm/shared/dtos/supplier/supplier.dto";
import { SupplierFormDto } from "@crm/shared/dtos/supplier/supplier.form.dto";
import { ConfirmDialogService } from "@crm/web/core/services/confirm-dialog.service";
import { ErrorService } from "@crm/web/core/services/error.service";
import { SupplierStateService } from "@crm/web/core/services/supplier/supplier-state.service";

/** Компонент изменяет поставщика */
@Component({
  selector: 'crm-supplier-edit',
  templateUrl: './supplier-edit.component.html',
  styleUrls: []
})
export class SupplierEditComponent implements OnInit {

  /** ID поставщика */
  public supplierId: string;

  /** Поставщик */
  public supplier: SupplierDto;

  /** Сохраняется ли или нет */
  public saving = false;

  public constructor(private readonly supplierStateService: SupplierStateService,
                     private readonly errorService: ErrorService,
                     private readonly confirmDialogService: ConfirmDialogService,
                     private readonly router: Router,
                     private readonly route: ActivatedRoute,
                     private readonly title: Title) { }

  public ngOnInit(): void {
    this.supplierId = this.route.snapshot.params['id'];

    if (!this.supplierId) {
      return this.errorService.addCustomError('Ошибка', 'Произошла ошибка, вернитесь на главную и попробуйте снова.');
    }

    this.supplierStateService.findById<SupplierDto>(this.supplierId).subscribe((supplier) => {
      this.supplier = supplier;
      this.title.setTitle(`${this.supplier.name} - CRM`);
    });
  }

  /** Функция изменяет поставщика
   * @param body данные поставщика */
  public edit(body: SupplierFormDto) {
    this.saving = true;

    this.supplierStateService.update<SupplierFormDto, SupplierDto>(this.supplierId, body).subscribe(() => {
      this.saving = false;
      this.errorService.addSuccessMessage("Поставщик изменен");
      this.router.navigate(['/supplier']).catch(console.error);
    }, () => this.saving = false);
  }

  /** Функция удаляет поставщика */
  public delete() {
    this.confirmDialogService.confirm({
      message: `Вы действительно хотите удалить поставщика "${this.supplier.name}"?`,
      accept: () => {
        this.saving = true;

        this.supplierStateService.deleteById(this.supplier._id).subscribe(() => {
          this.saving = false;
          this.errorService.addSuccessMessage(`Успешно`, `Поставщик "${this.supplier.name}" удален`);
          this.router.navigate(['/supplier']).catch(console.error);
        });
      }
    });
  }

}
