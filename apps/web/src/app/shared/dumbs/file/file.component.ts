import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileDto } from "@crm/shared/dtos/file.dto";

/** Компонент кнопки загрузки файлов */
@Component({
  selector: 'crm-file',
  templateUrl: './file.component.html',
  styleUrls: []
})
export class FileComponent {

  /** Файл */
  @Input() public file: FileDto;

  /** Нужно ли отображать кнопку удаления файла */
  @Input() public canDelete = false;

  /** Событие при удалении файла */
  @Output() public delete = new EventEmitter();

}
