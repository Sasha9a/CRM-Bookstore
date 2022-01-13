import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";

/** Функция для проверки валидации формы
 * @param data Данные формы
 * @param dto DTO формы, для проверки валидации
 * @return Возвращает valid - true при успешной валидации, errors - ошибки при неуспешной валидации */
export function validate(data: any, dto: any): { valid: boolean, errors?: any } {

  const result: any = plainToInstance(dto, data);

  const resultErrors = {};

  const errors = validateSync(result);

  if (errors.length > 0) {
    errors.map(error => {

      if (error.property && !resultErrors[error.property]) {
        resultErrors[error.property] = [];
      }

      if (error.constraints) {
        Object.keys(error.constraints).map((name) => {
          resultErrors[error.property].push(error.constraints[name]);
        });
      }

      if (error.children?.length) {
        error.children.forEach((childError) => {
          resultErrors[error.property][childError.property] = {};
          childError.children.forEach((child) => {
            let errorsArray = resultErrors[error.property][childError.property][child.property] = [];
            if (child.property && !errorsArray) {
              errorsArray = [];
            }
            Object.keys(child.constraints).forEach((constraintName) => errorsArray.push(child.constraints[constraintName]));
          });
        });
      }
    });

    return { valid: false, errors: resultErrors };
  }

  return { valid: true };
}
