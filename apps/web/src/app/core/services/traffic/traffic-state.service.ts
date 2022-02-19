import { Injectable } from '@angular/core';
import { BaseStateService } from "@crm/web/core/services/base-state.service";
import { TrafficService } from "@crm/web/core/services/traffic/traffic.service";

/** Сервис для запросов по трафику в API */
@Injectable({
  providedIn: 'root'
})
export class TrafficStateService extends BaseStateService {

  public constructor(private readonly trafficService: TrafficService) {
    super();
    this.baseService = trafficService;
  }

}
