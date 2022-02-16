import { MongooseQueryParser } from "mongoose-query-parser";

/** Функция парсит фильтры от клиента
 * @param queryParams параметры
 * @return распарсенные параметры */
export function queryParamParser(queryParams: any) {
  const parser = new MongooseQueryParser({
    skipKey: 'offset'
  });

  return parser.parse(queryParams);
}
