import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CategoryDto } from "@crm/shared/dtos/category/category.dto";
import { UtilsService } from "@crm/web/core/services/utils.service";

/** Компонент выбора категорий */
@Component({
  selector: 'crm-category-multi-select',
  templateUrl: './category-multi-select.component.html',
  styleUrls: []
})
export class CategoryMultiSelectComponent implements OnChanges {

  @Input() public categories: CategoryDto[];

  @Input() public selectedCategories: CategoryDto[];
  @Output() public selectedCategoriesChange = new EventEmitter<CategoryDto[]>();

  @Input() public class = '';
  @Input() public disabled = false;
  @Input() public placeholder = '';

  public dataCategories: { label: string, key: string, children: any[] }[];
  public dataSelectCategories: { label: string, key: string, children: any[] }[];

  public constructor(private readonly utilsService: UtilsService) {
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['categories']?.currentValue) {
      this.dataCategories = this.parseCategories(changes['categories'].currentValue);
    }
    if (changes['selectedCategories']?.currentValue) {
      this.dataSelectCategories = this.utilsService.flattenCategory(this.dataCategories).filter((category) => {
        return changes['selectedCategories'].currentValue.some((c) => c._id === category.key);
      });
    }
  }

  public changeValue(items: { label: string, key: string, children: any[] }[]) {
    const selectCategories = this.utilsService.flattenCategory(this.categories).filter((category) => {
      return items.some((c) => c.key === category._id);
    });
    this.selectedCategoriesChange.emit(selectCategories);
  }

  public parseCategories(categories: CategoryDto[]): { label: string, key: string, children: any[] }[] {
    if (!categories || !categories.length) {
      return [];
    }
    return categories.map((category) => {
      return {
        label: category.name,
        key: category._id,
        children: this.parseCategories(category.children)
      };
    });
  }

}
