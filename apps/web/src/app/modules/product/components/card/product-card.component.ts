import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { ProductDto } from "@crm/shared/dtos/product/product.dto";
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { ConfirmDialogService } from "@crm/web/core/services/confirm-dialog.service";
import { ErrorService } from "@crm/web/core/services/error.service";
import { ProductStateService } from "@crm/web/core/services/product/product-state.service";
import { ShopStateService } from "@crm/web/core/services/shop/shop-state.service";
import { AuthService } from "@crm/web/core/services/user/auth.service";

/** Компонент карточки товара */
@Component({
  selector: 'crm-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: []
})
export class ProductCardComponent implements OnInit {

  /** Товар */
  public product: ProductDto;

  /** Список магазинов */
  public shops: ShopDto[];

  /** Идет загрузка или нет */
  public loading = true;

  /** Загрузилась ли фотография */
  public showImage = false;

  public constructor(private readonly productStateService: ProductStateService,
                     private readonly shopStateService: ShopStateService,
                     private readonly authService: AuthService,
                     private readonly route: ActivatedRoute,
                     private readonly confirmDialogService: ConfirmDialogService,
                     private readonly errorService: ErrorService,
                     private readonly title: Title) {
  }

  public ngOnInit(): void {
    const productId = this.route.snapshot.params['id'];

    if (!productId) {
      return this.errorService.addCustomError('Ошибка', 'Произошла ошибка, вернитесь на главную и попробуйте снова.');
    }

    this.productStateService.findById<ProductDto>(productId).subscribe((product) => {
      this.product = product;
      this.title.setTitle(`${this.product.name} - CRM`);
      this.loading = false;
    }, () => this.loading = false);

    if (!this.authService.currentUser.roles.includes(RoleEnum.GENERAL_MANAGER)) {
      this.shopStateService.findById<ShopDto>(this.authService.currentUser.shop?._id).subscribe((shop) => {
        this.shops = [shop];
      });
    } else {
      this.shopStateService.find<ShopDto>().subscribe((shops) => {
        this.shops = shops;
      });
    }
  }

  /** Функция отправляет в архив товар */
  public toArchiveProduct() {
    this.confirmDialogService.confirm({
      message: `Вы действительно хотите отправить товар "${this.product.name}" в архив?`,
      accept: () => {
        this.loading = true;

        this.productStateService.deleteById(this.product._id).subscribe(() => {
          this.product.deleted = true;
          this.loading = false;
          this.errorService.addSuccessMessage(`Успешно`, `Товар "${this.product.name}" в архиве`);
        });
      }
    });
  }

  /** Функция активирует товар */
  public toActiveProduct() {
    this.confirmDialogService.confirm({
      message: `Вы действительно хотите вернуть товар "${this.product.name}" из архива?`,
      accept: () => {
        this.loading = true;

        this.productStateService.update(this.product._id, { deleted: false }).subscribe(() => {
          this.product.deleted = false;
          this.loading = false;
          this.errorService.addSuccessMessage(`Успешно`, `Товар "${this.product.name}" стал активным`);
        });
      }
    });
  }

}
