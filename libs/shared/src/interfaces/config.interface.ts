/** Шаблон для конфигурационных данных проекта */
export interface ConfigInterface {

  /** Продакшн */
  production: boolean;

  /** Секретный ключ проекта */
  secret: string;

  /** Путь к базе данных проекта */
  db: string;

  /** На сколько секунд авторизовать пользователя */
  expiresIn: number;
}
