import { Pipe, PipeTransform } from '@angular/core';

/** Пайп сортирующий массив */
@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  public transform<T>(array: T[], args: string): T[] {
    if (!array || !args) {
      return array;
    }
    array.sort((a, b) => {
      const argsSplitted = args.split(':');

      let objectProps = argsSplitted[0];
      const ascending = objectProps[0] === '-';
      const type = argsSplitted[argsSplitted.length - 1];

      if (ascending) {
        objectProps = objectProps.slice(1);
      }
      let left = objectProps
        .split('.')
        .reduce((value, key) => value[key] ?? '', a);
      let right = objectProps
        .split('.')
        .reduce((value, key) => value[key] ?? '', b);

      if (left == undefined && right == undefined) {
        return 0;
      }

      if (left != undefined && right == undefined) {
        return ascending ? 1 : -1;
      }

      if (left == undefined && right != undefined) {
        return ascending ? -1 : 1;
      }

      if (type === 'string') {
        left = left?.toLowerCase();
        right = right?.toLowerCase();
      }

      if (type === 'number') {
        return ascending ? right - left : left - right;
      } else if (type === 'date') {
        return ascending
          ? Number(new Date(right)) - Number(new Date(left))
          : Number(new Date(left)) - Number(new Date(right));
      } else {
        if (left < right) {
          return ascending ? 1 : -1;
        } else if (left > right) {
          return ascending ? -1 : 1;
        } else {
          return 0;
        }
      }
    });
    return array;
  }

}
