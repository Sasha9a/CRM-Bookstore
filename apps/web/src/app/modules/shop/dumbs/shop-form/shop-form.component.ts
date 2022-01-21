import { Component, Input } from '@angular/core';
import { ShopFormDto } from "@crm/shared/dtos/shop/shop.form.dto";
import { ErrorService } from "@crm/web/core/services/error.service";
import { BaseFormComponent } from "@crm/web/shared/dumbs/base-form/base-form.component";

/** Компонент ввода данных магазина */
@Component({
  selector: 'crm-shop-form',
  templateUrl: './shop-form.component.html',
  styleUrls: []
})
export class ShopFormComponent extends BaseFormComponent<ShopFormDto> {

  /** Данные магазина */
  @Input() public shop = new ShopFormDto();
  public dto = ShopFormDto;

  /** Показывать кнопку удаления */
  @Input() public override canDelete = false;

  /** URL на который возвращать при отмене */
  @Input() public route: string;

  public constructor(public override readonly errorService: ErrorService) {
    super(errorService);
  }
}
