import { Injectable } from '@angular/core';
import { BaseStateService } from "@crm/web/core/services/base-state.service";
import { CategoryService } from "@crm/web/core/services/category/category.service";

/** Сервис для запросов по категории в API */
@Injectable({
  providedIn: 'root'
})
export class CategoryStateService extends BaseStateService {

  public constructor(private readonly categoryService: CategoryService) {
    super();
    this.baseService = categoryService;
  }

}
