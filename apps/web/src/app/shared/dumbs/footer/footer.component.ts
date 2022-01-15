import { Component } from '@angular/core';
import * as moment from 'moment-timezone';

/** Компонент конца страницы */
@Component({
  selector: 'crm-footer',
  template: `
    <footer class="mt-6">
      <p-divider></p-divider>
      <div class="w-full text-center mt-5">
        <p class="greytext">Все права защищены © {{ footerYear }}</p>
      </div>
    </footer>
  `,
  styleUrls: []
})
export class FooterComponent {

  public footerYear: string;

  public constructor() {
    if (moment().year() === 2022) {
      this.footerYear = '2022';
    } else {
      this.footerYear = `2022-${moment().year()}`;
    }
  }


}
