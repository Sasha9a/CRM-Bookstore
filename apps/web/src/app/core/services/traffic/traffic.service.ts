import { Injectable } from '@angular/core';
import { BaseService } from "@crm/web/core/services/base.service";

/** Сервис для запросов по трафику в API */
@Injectable({
  providedIn: 'root'
})
export class TrafficService extends BaseService {

  /** URL трафика в API */
  protected override baseUrl = '/traffic';

}
