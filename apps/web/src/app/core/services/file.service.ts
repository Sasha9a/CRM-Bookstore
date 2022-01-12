import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { FileDto } from "@crm/shared/dtos/file.dto";
import { ErrorService } from "@crm/web/core/services/error.service";
import { catchError, forkJoin, Observable, of, throwError } from "rxjs";

/** Сервис для удобной работы с файлами */
@Injectable({
  providedIn: 'root'
})
export class FileService {

  public constructor(private readonly http: HttpClient,
                     private readonly errorService: ErrorService) {
  }

  /** Функция отправляет файлы на сервер
   * @param files Файлы
   * @return Данные файлов */
  public upload(files: FileList): Observable<FileDto[]> {
    const filesObservables: Observable<FileDto>[] = [];

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i], files[i].name);
        filesObservables.push(this.http.post<FileDto>('/file', formData));
      }
    }

    return filesObservables.length
      ? forkJoin(filesObservables)
        .pipe(
          catchError((error) => {
            this.errorService.addDefaultError(error);
            return throwError(error);
          })
        )
      : of([]);
  }

  /** Функция удаляет файл на сервере
   * @param path Зашифрованное название файла */
  public deleteFile(path: string): Observable<null> {
    return this.http.delete<null>(`/file/${path}`);
  }

}
