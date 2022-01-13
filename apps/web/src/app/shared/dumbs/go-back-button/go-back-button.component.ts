import { Component, Input } from '@angular/core';
import { Router } from "@angular/router";
import { RoutingService } from "@crm/web/core/services/routing.service";

/** Компонент кнопки отмены */
@Component({
  selector: 'crm-go-back-button',
  template: `
    <button pButton [label]="label" [icon]="icon" [class]="buttonClass" (click)="btnClick()"></button>
  `
})
export class GoBackButtonComponent {

  /** Текст в кнопке */
  @Input() public label = 'Отмена';

  /** Иконка кнопки */
  @Input() public icon = 'pi pi-times';

  /** Классы кнопки */
  @Input() public buttonClass = 'p-button-secondary p-button-text';

  /** URL адрес при клике на кнопку */
  @Input() public route = '/';

  public constructor(private readonly router: Router,
                     public readonly routingService: RoutingService) {
  }

  /** Событие на клик кнопки */
  public btnClick() {
    if (this.routingService.previousUrl === '/') {
      this.router.navigate([this.route]).catch(console.error);
    } else {
      this.routingService.goToPreviousUrl();
    }
  }

}
