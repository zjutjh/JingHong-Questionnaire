import { isArray, isObject, mapKeys, mapValues, snakeCase } from "lodash-es";

export const deepCamelToSnake = (obj: any): any => {
  if (isArray(obj)) {
    return obj.map((item: any) => deepCamelToSnake(item));
  } else if (isObject(obj)) {
    return mapKeys(mapValues(obj, (value: any) => deepCamelToSnake(value)), (_value: any, key: string) =>
      snakeCase(key)
    );
  }
  return obj;
};