/** Интерфейс для заголовков столбцов таблиц */
export interface CrmTableColumn {
  name?: string,
  label?: string,
  sort?: string,
  class?: string,
  style?: Record<string, any>,
  skeleton?: {
    shape?: 'rectangle' | 'circle';
    height?: string;
  }
}
