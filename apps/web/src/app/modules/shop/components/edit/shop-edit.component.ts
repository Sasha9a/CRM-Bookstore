import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { ShopFormDto } from "@crm/shared/dtos/shop/shop.form.dto";
import { ConfirmDialogService } from "@crm/web/core/services/confirm-dialog.service";
import { ErrorService } from "@crm/web/core/services/error.service";
import { ShopStateService } from "@crm/web/core/services/shop/shop-state.service";

@Component({
  selector: 'crm-edit',
  templateUrl: './shop-edit.component.html',
  styleUrls: []
})
export class ShopEditComponent implements OnInit {

  public shopId: string;
  public shop: ShopDto;

  public saving = false;

  public constructor(private readonly shopStateService: ShopStateService,
                     private readonly errorService: ErrorService,
                     private readonly confirmDialogService: ConfirmDialogService,
                     private readonly router: Router,
                     private readonly route: ActivatedRoute) { }

  public ngOnInit(): void {
    this.shopId = this.route.snapshot.params['id'];

    if (!this.shopId) {
      return this.errorService.addCustomError('Ошибка', 'Произошла ошибка, вернитесь на главную и попробуйте снова.');
    }

    this.shopStateService.findById<ShopDto>(this.shopId).subscribe((shop) => {
      this.shop = shop;
    });
  }

  public edit(body: ShopFormDto) {
    this.saving = true;

    this.shopStateService.update<ShopFormDto, ShopDto>(this.shopId, body).subscribe(() => {
      this.saving = false;
      this.errorService.addSuccessMessage("Магазин изменен");
      this.router.navigate(['/shop']).catch(console.error);
    }, () => this.saving = false);
  }

  public delete() {
    this.confirmDialogService.confirm({
      message: `Вы действительно хотите удалить магазин по адресу ${this.shop.address}?`,
      accept: () => {
        this.saving = true;

        this.shopStateService.deleteById(this.shop._id).subscribe(() => {
          this.saving = false;
          this.errorService.addSuccessMessage(`Успешно`, `Магазин по адресу ${this.shop.address} удален`);
          this.router.navigate(['/shop']).catch(console.error);
        });
      }
    });
  }

}
