import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ProductDto } from "@crm/shared/dtos/product/product.dto";
import { ProductReceiptDto } from "@crm/shared/dtos/product/product.receipt.dto";
import { ReceiptDto } from "@crm/shared/dtos/receipt/receipt.dto";
import { ReceiptFormDto } from "@crm/shared/dtos/receipt/receipt.form.dto";
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { ErrorService } from "@crm/web/core/services/error.service";
import { ProductStateService } from "@crm/web/core/services/product/product-state.service";
import { ReceiptStateService } from "@crm/web/core/services/receipt/receipt-state.service";
import { ShopStateService } from "@crm/web/core/services/shop/shop-state.service";
import { AuthService } from "@crm/web/core/services/user/auth.service";
import { validate } from "@crm/web/core/services/validation/validate.service";
import { forkJoin } from "rxjs";
import * as moment from "moment-timezone";

/** Компонент создания чека */
@Component({
  selector: 'crm-receipt-add',
  templateUrl: './receipt-add.component.html',
  styleUrls: []
})
export class ReceiptAddComponent implements OnInit {

  /** Данные чека */
  public receipt = new ReceiptFormDto();

  /** Ошибки при валидации данных в форме */
  public errors: Record<keyof ReceiptFormDto, any[]>;

  /** Грузится ли или нет */
  public loading = true;

  /** Все магазины */
  public shops: ShopDto[] = [];

  /** Все товары */
  public products: ProductReceiptDto[] = [];

  public constructor(private readonly receiptStateService: ReceiptStateService,
                     private readonly shopStateService: ShopStateService,
                     private readonly productStateService: ProductStateService,
                     public readonly authService: AuthService,
                     private readonly errorService: ErrorService,
                     private readonly router: Router) { }

  public ngOnInit(): void {
    forkJoin(
      this.shopStateService.find<ShopDto>(),
      this.productStateService.find<ProductDto>()
    )
    .subscribe(([shops, products]) => {
      this.shops = shops;
      if (this.authService.currentUser.shop) {
        this.receipt.shop = this.shops.find((shop) => shop._id === this.authService.currentUser.shop._id);
      }
      products.forEach((product) => {
        if (!product.deleted) {
          this.products.push({
            _id: product._id,
            name: product.name,
            category: product.category,
            code: product.code,
            image: product.image,
            price: product.price,
            count: 0
          });
        }
      });
      this.loading = false;
    }, () => this.loading = false);

    this.receipt.date = moment().toDate();

    this.receipt.salesman = this.authService.currentUser;
  }

  /** Функция создает чек */
  public create() {
    this.loading = true;

    const { valid, errors } = validate(this.receipt, ReceiptFormDto);
    if (!valid) {
      this.errors = errors;
      this.errorService.errorValues<ReceiptFormDto>(this.errors);
      console.log(this.errors);
      this.loading = false;
    } else {
      this.errors = null;

      this.receiptStateService.create<ReceiptFormDto, ReceiptDto>(this.receipt).subscribe(() => {
        this.loading = false;
        this.errorService.addSuccessMessage("Чек создан");
        this.router.navigate(['/product']).catch(console.error);
      }, () => this.loading = false);
    }
  }

  /** Функция типизирует переменную
   * @param product товар
   * @return возвращает товар */
  public toProduct(product: any): ProductReceiptDto {
    return product as ProductReceiptDto;
  }

}
