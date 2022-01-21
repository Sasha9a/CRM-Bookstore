import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { ShopFormDto } from "@crm/shared/dtos/shop/shop.form.dto";
import { ErrorService } from "@crm/web/core/services/error.service";
import { ShopStateService } from "@crm/web/core/services/shop/shop-state.service";

/** Компонент добавления магазина */
@Component({
  selector: 'crm-add',
  templateUrl: './shop-add.component.html',
  styleUrls: []
})
export class ShopAddComponent {

  /** Сохраняется ли или нет */
  public saving = false;

  public constructor(private readonly shopStateService: ShopStateService,
                     private readonly errorService: ErrorService,
                     private readonly router: Router) { }

  /** Функция создает магазин
   * @param body данные магазина */
  public create(body: ShopFormDto) {
    this.saving = true;

    this.shopStateService.create<ShopFormDto, ShopDto>(body).subscribe(() => {
      this.saving = false;
      this.errorService.addSuccessMessage("Магазин успешно добавлен");
      this.router.navigate(['/shop']).catch(console.error);
    }, () => this.saving = false);
  }

}
