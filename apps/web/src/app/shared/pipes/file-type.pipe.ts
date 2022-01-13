import { Pipe, PipeTransform } from '@angular/core';

/** Список иконок под конкретный тип файла */
const fileIcons = {
  'excel': 'pi-file-excel text-green-600',
  'spreadsheetml.sheet': 'pi-file-excel text-green-600',
  'text': 'pi-file text-blue-600',
  'image': 'pi-image text-pink-700',
  'audio': 'pi-volume-up text-blue-600',
  'video': 'pi-video text-blue-600',
  'pdf': 'pi-file-pdf color-red',
  'word': 'pi-file text-blue-600',
  'powerpoint': 'pi-file text-orange-500',
  'zip': 'pi-folder-open text-blue-900',
  'rar': 'pi-folder-open text-blue-900',
  'gzip': 'pi-folder-open text-blue-900'
};

/** Пайп вставляющий иконку в зависмости от типа файла */
@Pipe({
  name: 'fileType'
})
export class FileTypePipe implements PipeTransform {

  public transform(type: string): string {
    for (const key of Object.keys(fileIcons)) {
      if (type.includes(key)) {
        return fileIcons[key];
      }
    }
    return 'pi-file';
  }

}
