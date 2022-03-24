import { Pipe, PipeTransform } from '@angular/core';
import { CategoryDto } from "@crm/shared/dtos/category/category.dto";
import { UtilsService } from "@crm/web/core/services/utils.service";

@Pipe({
  name: 'pathCategory'
})
export class PathCategoryPipe implements PipeTransform {

  public constructor(private readonly utilsService: UtilsService) {
  }

  public transform(category: CategoryDto, categories: CategoryDto[]): string {
    if (!category || !categories || !categories.length) {
      return null;
    }

    let result = category.name || '';
    let isParent = !!category.parentId || false;

    while (isParent) {
      const _category = this.utilsService.flattenCategory(categories).find((c: CategoryDto) => c._id === category.parentId);
      if (_category) {
        category = _category;
        isParent = !!category.parentId;
        result = `${category.name} -> ${result}`;
      } else {
        isParent = false;
      }
    }

    return result;
  }

}
