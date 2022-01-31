import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { CategoryDto } from "@crm/shared/dtos/category/category.dto";
import { CategoryFormDto } from "@crm/shared/dtos/category/category.form.dto";
import { CategoryStateService } from "@crm/web/core/services/category/category-state.service";
import { ErrorService } from "@crm/web/core/services/error.service";

/** Компонент добавления категории */
@Component({
  selector: 'crm-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: []
})
export class CategoryAddComponent implements OnInit {

  /** Данные категории */
  public category = new CategoryFormDto();

  /** Сохраняется ли или нет */
  public saving = false;

  public constructor(private readonly categoryStateService: CategoryStateService,
                     private readonly errorService: ErrorService,
                     private readonly route: ActivatedRoute,
                     private readonly router: Router) { }

  public ngOnInit() {
    const parentId = this.route.snapshot.queryParams['parentId'];

    if (parentId) {
      this.categoryStateService.findById<CategoryDto>(parentId).subscribe((category) => {
        this.category.parent = category;
      });
    }
  }

  /** Функция создает категорию
   * @param body данные категории */
  public create(body: CategoryFormDto) {
    this.saving = true;

    this.categoryStateService.create<CategoryFormDto, CategoryDto>(body).subscribe(() => {
      this.saving = false;
      this.errorService.addSuccessMessage("Категория успешно создана");
      this.router.navigate(['/category']).catch(console.error);
    }, () => this.saving = false);
  }

}
