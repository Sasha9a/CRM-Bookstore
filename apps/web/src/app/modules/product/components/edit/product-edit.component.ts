import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { CategoryDto } from "@crm/shared/dtos/category/category.dto";
import { ProductDto } from "@crm/shared/dtos/product/product.dto";
import { ProductFormDto } from "@crm/shared/dtos/product/product.form.dto";
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { CategoryStateService } from "@crm/web/core/services/category/category-state.service";
import { ConfirmDialogService } from "@crm/web/core/services/confirm-dialog.service";
import { ErrorService } from "@crm/web/core/services/error.service";
import { ProductStateService } from "@crm/web/core/services/product/product-state.service";
import { ShopStateService } from "@crm/web/core/services/shop/shop-state.service";
import { AuthService } from "@crm/web/core/services/user/auth.service";

/** Компонент изменяет товар */
@Component({
  selector: 'crm-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: []
})
export class ProductEditComponent implements OnInit {

  /** ID товара */
  public productId: string;

  /** Товар */
  public product: ProductDto;

  /** Список всех категорий и подкатегорий */
  public categories: CategoryDto[];

  /** Список всех магазинов */
  public shops: ShopDto[];

  /** Сохраняется ли или нет */
  public saving = false;

  public constructor(private readonly productStateService: ProductStateService,
                     private readonly shopStateService: ShopStateService,
                     private readonly categoryStateService: CategoryStateService,
                     private readonly errorService: ErrorService,
                     private readonly confirmDialogService: ConfirmDialogService,
                     private readonly authService: AuthService,
                     private readonly router: Router,
                     private readonly route: ActivatedRoute,
                     private readonly title: Title) {
  }

  public ngOnInit(): void {
    this.productId = this.route.snapshot.params['id'];

    if (!this.productId) {
      return this.errorService.addCustomError('Ошибка', 'Произошла ошибка, вернитесь на главную и попробуйте снова.');
    }

    this.productStateService.findById<ProductDto>(this.productId).subscribe((product) => {
      this.product = product;
      this.title.setTitle(`${this.product.name} - CRM`);
      if (!this.product.characteristics) {
        this.product.characteristics = {};
      }
      if (!this.product.count) {
        this.product.count = {};
      }
      if (this.product.deleted) {
        this.product = null;
        return this.errorService.addCustomError('Ошибка', 'Товар находится в архиве.');
      }
    });

    if (!this.authService.currentUser.roles.includes(RoleEnum.GENERAL_MANAGER)) {
      this.shopStateService.findById<ShopDto>(this.authService.currentUser.shop?._id).subscribe((shop) => {
        this.shops = [shop];
      });
    } else {
      this.shopStateService.find<ShopDto>().subscribe((shops) => {
        this.shops = shops;
      });
    }
    this.categoryStateService.find<CategoryDto>().subscribe((categories) => this.categories = categories);
  }

  /** Функция изменяет товар
   * @param body данные товара */
  public edit(body: ProductFormDto) {
    this.saving = true;

    this.productStateService.update<ProductFormDto, ProductDto>(this.productId, body).subscribe(() => {
      this.saving = false;
      this.errorService.addSuccessMessage("Товар изменен");
      this.router.navigate(['/product/card', this.productId]).catch(console.error);
    }, () => this.saving = false);
  }

}
