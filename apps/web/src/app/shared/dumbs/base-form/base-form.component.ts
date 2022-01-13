import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ErrorService } from "@crm/web/core/services/error.service";
import { validate } from "@crm/web/core/services/validation/validate.service";

/** Компонент модифицирующий форму */
@Component({
  selector: 'crm-base-form',
  template: '',
  styleUrls: []
})
export abstract class BaseFormComponent<T> {

  /** Текст кнопки сохранения */
  @Input() public saveButtonLabel = 'Сохранить';

  /** Показывать кнопку удаления */
  @Input() public canDelete = false;

  /** Событие при клике на сохранение */
  @Output() public save = new EventEmitter<T>();

  /** Событие при клике на удаление */
  @Output() public delete = new EventEmitter<T>();

  /** Ошибки при валидации данных в форме */
  public errors: Record<keyof T, any[]>;

  /** DTO формы, для проверки валидации */
  public abstract dto: new () => T;

  protected constructor(public readonly errorService: ErrorService) {
  }

  /** Событие при клике на сохранение
   * @param entity данные с формы */
  public onSave(entity: T) {
    const { valid, errors } = validate(entity, this.dto);
    if (!valid) {
      this.errors = errors;
      console.log(entity);
      this.errorService.errorValues<T>(this.errors);
      console.log(this.errors);
    } else {
      this.errors = null;
      this.save.emit(entity);
    }
  }

}
