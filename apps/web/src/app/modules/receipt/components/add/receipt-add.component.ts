import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ProductDto } from "@crm/shared/dtos/product/product.dto";
import { ProductReceiptDto } from "@crm/shared/dtos/product/product.receipt.dto";
import { ReceiptDto } from "@crm/shared/dtos/receipt/receipt.dto";
import { ReceiptFormDto } from "@crm/shared/dtos/receipt/receipt.form.dto";
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { PaymentTypeEnum } from "@crm/shared/enums/payment.type.enum";
import { ErrorService } from "@crm/web/core/services/error.service";
import { ProductStateService } from "@crm/web/core/services/product/product-state.service";
import { ReceiptStateService } from "@crm/web/core/services/receipt/receipt-state.service";
import { ShopStateService } from "@crm/web/core/services/shop/shop-state.service";
import { AuthService } from "@crm/web/core/services/user/auth.service";
import { validate } from "@crm/web/core/services/validation/validate.service";
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

  /** Все виды оплаты */
  public paymentTypes = [
    { label: 'Наличными', value: PaymentTypeEnum.CASH },
    { label: 'Безналичными', value: PaymentTypeEnum.CASHLESS },
    { label: 'И то и то', value: PaymentTypeEnum.SO_SO }
  ];

  /** Выбор ввести либо наличные, либо безналичные при оплате "И то и то" */
  public isCashless = false;

  /** Максимальное кол-во товара в магазине */
  public maxCountProduct: Record<string, number> = {};

  public get PaymentTypeEnum() {
    return PaymentTypeEnum;
  }

  public constructor(private readonly receiptStateService: ReceiptStateService,
                     private readonly shopStateService: ShopStateService,
                     private readonly productStateService: ProductStateService,
                     public readonly authService: AuthService,
                     private readonly errorService: ErrorService,
                     private readonly router: Router) { }

  public ngOnInit(): void {
    this.shopStateService.find<ShopDto>().subscribe((shops) => {
      this.shops = shops;
      if (this.authService.currentUser.shop) {
        this.receipt.shop = this.shops.find((shop) => shop._id === this.authService.currentUser.shop._id);
      }
      this.loading = false;
    }, () => this.loading = false);

    this.receipt.date = moment().toDate();

    this.receipt.salesman = this.authService.currentUser;
  }

  /** Обновляет аналитику */
  public updateAnalytics() {
    const sum = this.receipt.products.reduce((sum, product) => sum + product.price * product.count, 0);
    if (this.receipt.paymentMethod === PaymentTypeEnum.CASH) {
      this.receipt.amountCash = sum;
    } else if (this.receipt.paymentMethod === PaymentTypeEnum.CASHLESS) {
      this.receipt.amountCashless = sum;
    } else {
      if (!this.isCashless) {
        if (sum - this.receipt.amountCash < 0) {
          this.receipt.amountCash = 0;
          this.receipt.amountCashless = sum;
        } else {
          this.receipt.amountCashless = sum - this.receipt.amountCash;
        }
      } else {
        if (sum - this.receipt.amountCashless < 0) {
          this.receipt.amountCashless = 0;
          this.receipt.amountCash = sum;
        } else {
          this.receipt.amountCash = sum - this.receipt.amountCashless;
        }
      }
    }
  }

  /** Обновляет кол-во товара */
  public updateCountProduct(event: { items: ProductReceiptDto[] }, count: number) {
    event.items.forEach((product) => product.count = count);
  }

  /** Обновляет таблицу */
  public updateTable(fullUpdate = false) {
    if (this.receipt.shop) {
      if (fullUpdate) {
        this.products = [];
        this.receipt.products = [];
        this.updateAnalytics();
        this.productStateService.find<ProductDto>({ deleted: false }).subscribe((products) => {
          const sourceProducts = [];
          products.forEach((product) => {
            if (product.count[this.receipt.shop._id] > 0) {
              sourceProducts.push({
                _id: product._id,
                name: product.name,
                category: product.category,
                code: product.code,
                image: product.image,
                price: product.price,
                count: 0
              });
            }
            this.maxCountProduct[product._id] = product.count[this.receipt.shop._id];
          });
          this.products = sourceProducts;
        });
      } else {
        this.productStateService.find<ProductDto>({ deleted: false }).subscribe((products) => {
          if (this.checkUpdateProducts(products)) {
            this.errorService.addSuccessMessage('Товары обновились');
          }
        });
      }
    }
  }

  /** Функция проверяет нет ли новых изменений в товарах
   * @param products товары
   * @return Возвращает производились ли изменения товаров или нет */
  public checkUpdateProducts(products: ProductDto[]): boolean {
    let isUpdate = false;
    products.forEach((product) => {
      if (!this.maxCountProduct[product._id] && product.count[this.receipt.shop._id]) {
        isUpdate = true;
        this.products.push({
          _id: product._id,
          name: product.name,
          category: product.category,
          code: product.code,
          image: product.image,
          price: product.price,
          count: 0
        });
        this.products = this.products.filter(() => true);
      }
      if (this.maxCountProduct[product._id] !== product.count[this.receipt.shop._id]) {
        isUpdate = true;
        this.maxCountProduct[product._id] = product.count[this.receipt.shop._id];
      }
    });
    this.receipt.products.forEach((product) => {
      if (!this.maxCountProduct[product._id]) {
        isUpdate = true;
        this.receipt.products = this.receipt.products.filter((p) => p._id !== product._id);
      }
    });
    this.products.forEach((product) => {
      if (!this.maxCountProduct[product._id]) {
        isUpdate = true;
        this.products = this.products.filter((p) => p._id !== product._id);
      }
    });
    this.updateAnalytics();
    return isUpdate;
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

      this.productStateService.find<ProductDto>({ deleted: false }).subscribe((products) => {
        if (this.checkUpdateProducts(products)) {
          this.loading = false;
          return this.errorService.addCustomError('Обновление товаров', 'В таблице обновились товары, перепроверьте, а затем создавайте чек');
        }

        this.receiptStateService.create<ReceiptFormDto, ReceiptDto>(this.receipt).subscribe(() => {
          this.loading = false;
          this.errorService.addSuccessMessage("Чек создан");
          this.router.navigate(['/product']).catch(console.error);
        }, () => this.loading = false);
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
