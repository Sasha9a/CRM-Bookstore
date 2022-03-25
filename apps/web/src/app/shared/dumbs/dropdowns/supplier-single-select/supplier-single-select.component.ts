import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SupplierDto } from "@crm/shared/dtos/supplier/supplier.dto";

/** Компонент выбора поставщика */
@Component({
  selector: 'crm-supplier-single-select',
  templateUrl: './supplier-single-select.component.html',
  styleUrls: []
})
export class SupplierSingleSelectComponent {

  @Input() public suppliers: SupplierDto[] = [];

  @Input() public selectedSupplier: SupplierDto | Partial<SupplierDto>;
  @Output() public selectedSupplierChange = new EventEmitter<SupplierDto>();

  @Input() public virtualScroll = false;
  @Input() public itemSize = 47;

  @Input() public labelInput = '';
  @Input() public placeholder = '\u00A0';

  @Input() public class = '';

  @Input() public disabled = false;

  public toSupplier(supplier: any): SupplierDto {
    return supplier as SupplierDto;
  }

}
