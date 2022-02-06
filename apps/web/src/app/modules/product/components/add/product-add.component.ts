import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CategoryDto } from "@crm/shared/dtos/category/category.dto";
import { ProductDto } from "@crm/shared/dtos/product/product.dto";
import { ProductFormDto } from "@crm/shared/dtos/product/product.form.dto";
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { CategoryStateService } from "@crm/web/core/services/category/category-state.service";
import { ErrorService } from "@crm/web/core/services/error.service";
import { ProductStateService } from "@crm/web/core/services/product/product-state.service";
import { ShopStateService } from "@crm/web/core/services/shop/shop-state.service";
import { AuthService } from "@crm/web/core/services/user/auth.service";

/** Компонент добавления товара */
@Component({
  selector: 'crm-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: []
})
export class ProductAddComponent implements OnInit {

  /** Список всех категорий и подкатегорий */
  public categories: CategoryDto[];

  /** Список всех магазинов */
  public shops: ShopDto[];

  /** Сохраняется ли или нет */
  public saving = false;

  public constructor(private readonly productStateService: ProductStateService,
                     private readonly categoryStateService: CategoryStateService,
                     private readonly shopStateService: ShopStateService,
                     private readonly errorService: ErrorService,
                     private readonly authService: AuthService,
                     private readonly router: Router) {
  }

  public ngOnInit(): void {
    this.categoryStateService.find<CategoryDto>().subscribe((categories) => this.categories = categories);
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

  /** Функция создает товар
   * @param body данные товара */
  public create(body: ProductFormDto) {
    this.saving = true;

    this.productStateService.create<ProductFormDto, ProductDto>(body).subscribe((product) => {
      this.saving = false;
      this.errorService.addSuccessMessage("Товар создан");
      this.router.navigate(['/product/card', product._id]).catch(console.error);
    }, () => this.saving = false);
  }

}
