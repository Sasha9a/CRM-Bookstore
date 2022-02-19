import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { OrderDto } from "@crm/shared/dtos/order/order.dto";
import { OrderFormDto } from "@crm/shared/dtos/order/order.form.dto";
import { ProductDto } from "@crm/shared/dtos/product/product.dto";
import { ProductOrderDto } from "@crm/shared/dtos/product/product.order.dto";
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { ErrorService } from "@crm/web/core/services/error.service";
import { OrderStateService } from "@crm/web/core/services/order/order-state.service";
import { ProductStateService } from "@crm/web/core/services/product/product-state.service";
import { ShopStateService } from "@crm/web/core/services/shop/shop-state.service";
import { AuthService } from "@crm/web/core/services/user/auth.service";
import { validate } from "@crm/web/core/services/validation/validate.service";
import * as moment from "moment-timezone";

/** Компонент создания заказа */
@Component({
  selector: 'crm-order-add',
  templateUrl: './order-add.component.html',
  styleUrls: []
})
export class OrderAddComponent implements OnInit {

  /** Данные заказа */
  public order = new OrderFormDto();

  /** Ошибки при валидации данных в форме */
  public errors: Record<keyof OrderFormDto, any[]>;

  /** Грузится ли или нет */
  public loading = true;

  /** Все магазины */
  public shops: ShopDto[] = [];

  /** Все товары */
  public products: ProductOrderDto[] = [];

  /** Сегодняшняя дата */
  public currentDate = moment().toDate();

  public constructor(private readonly shopStateService: ShopStateService,
                     private readonly orderStateService: OrderStateService,
                     private readonly productStateService: ProductStateService,
                     public readonly authService: AuthService,
                     private readonly errorService: ErrorService,
                     private readonly router: Router) { }

  public ngOnInit(): void {
    if (!this.authService.checkRoles([RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR])) {
      this.shopStateService.findById<ShopDto>(this.authService.currentUser.shop?._id).subscribe((shop) => {
        this.shops = [shop];
        if (this.authService.currentUser.shop) {
          this.order.shop = shop;
        }
        this.updateTable();
        this.loading = false;
      }, () => this.loading = false);
    } else {
      this.shopStateService.find<ShopDto>().subscribe((shops) => {
        this.shops = shops;
        if (this.authService.currentUser.shop) {
          this.order.shop = this.shops.find((shop) => shop._id === this.authService.currentUser.shop._id);
        }
        this.updateTable();
        this.loading = false;
      }, () => this.loading = false);
    }

    this.order.date = moment().startOf('day').toDate();

    this.order.employee = this.authService.currentUser;
  }

  /** Обновляет аналитику */
  public updateAnalytics() {
    this.order.sum = this.order.products.reduce((sum, product) => {
      product.totalPrice = product.priceManufacture * product.count;
      product.markup = product.price - product.priceManufacture;
      product.markupPercent = product.markup / product.priceManufacture * 100;
      return sum + product.totalPrice;
    }, 0);
  }

  /** Обновляет таблицу */
  public updateTable() {
    this.products = [];
    this.order.products = [];
    this.productStateService.find<ProductDto>({ deleted: false }).subscribe((products) => {
      this.products = products.map((product) => {
        return {
          _id: product._id,
          name: product.name,
          category: product.category,
          code: product.code,
          image: product.image,
          price: product.price,
          count: 0,
          totalPrice: 0,
          markup: 0,
          markupPercent: 0,
          priceManufacture: 0
        };
      });
    });
  }

  /** Обновляет кол-во товара */
  public updateCountProduct(event: { items: ProductOrderDto[] }, count: number) {
    event.items.forEach((product) => product.count = count);
  }

  /** Функция создает заказ */
  public create() {
    this.loading = true;

    const { valid, errors } = validate(this.order, OrderFormDto);
    if (!valid) {
      this.errors = errors;
      this.errorService.errorValues<OrderFormDto>(this.errors);
      console.log(this.errors);
      this.loading = false;
    } else {
      this.errors = null;

      this.orderStateService.create<OrderFormDto, OrderDto>(this.order).subscribe(() => {
        this.loading = false;
        this.errorService.addSuccessMessage("Заказ создан");
        this.router.navigate(['/product']).catch(console.error);
      }, () => this.loading = false);
    }
  }

  /** Функция типизирует переменную
   * @param product товар
   * @return возвращает товар */
  public toProduct(product: any): ProductOrderDto {
    return product as ProductOrderDto;
  }

}
