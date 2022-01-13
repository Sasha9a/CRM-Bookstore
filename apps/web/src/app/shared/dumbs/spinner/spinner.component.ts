import { Component, Input } from '@angular/core';

/** Компонент прогрузки/сохранения контента */
@Component({
  selector: 'crm-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: []
})
export class SpinnerComponent {

  /** Текст показывающий при загрузке */
  @Input() public text = 'Загрузка...';

}
