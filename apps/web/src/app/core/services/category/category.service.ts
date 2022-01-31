import { Injectable } from '@angular/core';
import { BaseService } from "@crm/web/core/services/base.service";

/** Сервис для запросов по категории в API */
@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseService {

  /** URL категории в API */
  protected override baseUrl = '/category';
}
