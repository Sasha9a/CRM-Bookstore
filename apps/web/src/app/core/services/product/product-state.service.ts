import { Injectable } from '@angular/core';
import { BaseStateService } from "@crm/web/core/services/base-state.service";
import { ProductService } from "@crm/web/core/services/product/product.service";

/** Сервис для запросов по товарам в API */
@Injectable({
  providedIn: 'root'
})
export class ProductStateService extends BaseStateService {

  public constructor(private readonly productService: ProductService) {
    super();
    this.baseService = productService;
  }

}
