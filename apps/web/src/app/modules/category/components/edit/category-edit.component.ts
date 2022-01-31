import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { CategoryDto } from "@crm/shared/dtos/category/category.dto";
import { CategoryFormDto } from "@crm/shared/dtos/category/category.form.dto";
import { CategoryStateService } from "@crm/web/core/services/category/category-state.service";
import { ConfirmDialogService } from "@crm/web/core/services/confirm-dialog.service";
import { ErrorService } from "@crm/web/core/services/error.service";

/** Компонент изменяет категорию */
@Component({
  selector: 'crm-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: []
})
export class CategoryEditComponent implements OnInit {

  /** ID категории */
  public categoryId: string;

  /** Категория */
  public category: CategoryDto;

  /** Сохраняется ли или нет */
  public saving = false;

  public constructor(private readonly categoryStateService: CategoryStateService,
                     private readonly errorService: ErrorService,
                     private readonly confirmDialogService: ConfirmDialogService,
                     private readonly router: Router,
                     private readonly route: ActivatedRoute,
                     private readonly title: Title) { }

  public ngOnInit(): void {
    this.categoryId = this.route.snapshot.params['id'];

    if (!this.categoryId) {
      return this.errorService.addCustomError('Ошибка', 'Произошла ошибка, вернитесь на главную и попробуйте снова.');
    }

    this.categoryStateService.findById<CategoryDto>(this.categoryId).subscribe((category) => {
      this.category = category;
      this.title.setTitle(`${this.category.name} - CRM`);
    });
  }

  /** Функция изменяет категорию
   * @param body данные категории */
  public edit(body: CategoryFormDto) {
    this.saving = true;

    this.categoryStateService.update<CategoryFormDto, CategoryDto>(this.categoryId, body).subscribe(() => {
      this.saving = false;
      this.errorService.addSuccessMessage("Категория изменена");
      this.router.navigate(['/category']).catch(console.error);
    }, () => this.saving = false);
  }

  /** Функция удаляет категорию */
  public delete() {
    this.confirmDialogService.confirm({
      message: `Вы действительно хотите удалить категорию "${this.category.name}"?`,
      accept: () => {
        this.saving = true;

        this.categoryStateService.deleteById(this.category._id).subscribe(() => {
          this.saving = false;
          this.errorService.addSuccessMessage(`Успешно`, `Категория "${this.category.name}" удалена`);
          this.router.navigate(['/category']).catch(console.error);
        });
      }
    });
  }

}
