import { Component, OnInit } from '@angular/core';
import { CategoryDto } from "@crm/shared/dtos/category/category.dto";
import { CategoryStateService } from "@crm/web/core/services/category/category-state.service";

/** Компонент показывает список категорий */
@Component({
  selector: 'crm-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: []
})
export class CategoryListComponent implements OnInit {

  /** Категории */
  public categories: CategoryDto[];

  /** Грузится ли или нет */
  public loading = false;

  /** Массив ID категорий которые раскрыты */
  public openedDirectionIds: string[] = [];

  public constructor(private readonly categoryStateService: CategoryStateService) { }

  public ngOnInit(): void {
    this.loadCategories();
  }

  /** Функция загружает данные */
  public loadCategories() {
    this.loading = true;

    this.categoryStateService.find<CategoryDto>().subscribe((data) => {
      this.categories = data;
      this.loading = false;
    }, () => this.loading = false);
  }

  /** Функция типизирует переменную
   * @param category категория
   * @return возвращает категорию */
  public toCategory(category: any): CategoryDto {
    return category as CategoryDto;
  }

  /** Функция обновляет список в таблице
   * @param id ID категории */
  public updateDirection(id: string) {
    if (this.openedDirectionIds.includes(id)) {
      this.openedDirectionIds = this.openedDirectionIds.filter((ids) => ids !== id);
    } else {
      this.openedDirectionIds.push(id);
    }
  }


}
