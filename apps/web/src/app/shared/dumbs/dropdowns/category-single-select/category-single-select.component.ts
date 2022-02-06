import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CategoryDto } from "@crm/shared/dtos/category/category.dto";

/** Компонент выбора категории */
@Component({
  selector: 'crm-category-single-select',
  templateUrl: './category-single-select.component.html',
  styleUrls: []
})
export class CategorySingleSelectComponent implements OnChanges {

  @Input() public categories: CategoryDto[];

  @Input() public selectedCategory: CategoryDto;
  @Output() public selectedCategoryChange = new EventEmitter<CategoryDto>();

  @Input() public class = '';
  @Input() public disabled = false;
  @Input() public placeholder = '';

  public dataCategories: { label: string, key: string, children: any[] }[];
  public dataSelectCategory: { label: string, key: string, children: any[] };

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['categories']?.currentValue) {
      this.dataCategories = this.parseCategories(changes['categories'].currentValue);
    }
    if (changes['selectedCategory']?.currentValue) {
      this.dataSelectCategory = this.dataCategories.find((category) => {
        return category.key === changes['selectedCategory'].currentValue._id;
      });
    }
  }

  public changeValue(item: { label: string, key: string, children: any[] }) {
    const selectCategory = this.getCategory(item.key, this.categories);
    console.log(selectCategory);
    this.selectedCategoryChange.emit(selectCategory);
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

  public getCategory(id: string, categories: CategoryDto[]): CategoryDto {
    for (const category of categories) {
      if (category._id === id) {
        return category;
      }
      if (category.children) {
        return this.getCategory(id, category.children);
      }
    }
    return null;
  }

}