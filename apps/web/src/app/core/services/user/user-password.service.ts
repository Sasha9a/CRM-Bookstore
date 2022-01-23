import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserPasswordService {

  /** Функция генерирует пароль
   * @return сгенерированный пароль */
  public generatePassword(): string {
    return (
      (Math.random().toString(36).slice(-8) +
        '-!@#$%^&*'
          .split('')
          .sort(() => Math.random() - 0.5)
          .join('')
          .slice(0, 2))
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('')
    );
  }

}
