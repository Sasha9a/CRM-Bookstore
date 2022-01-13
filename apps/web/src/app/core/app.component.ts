import { Component } from '@angular/core';
import { RoutingService } from "@crm/web/core/services/routing.service";

@Component({
  selector: 'crm-root',
  templateUrl: './app.component.html',
  styleUrls: [],
})
export class AppComponent {

  public constructor(public readonly routingService: RoutingService) {}
}
