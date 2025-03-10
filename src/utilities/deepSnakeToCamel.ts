import { isArray, isObject, mapKeys, mapValues, camelCase } from "lodash-es";

export const deepSnakeToCamel = (obj: any): any => {
  if (isArray(obj)) {
    return obj.map((item: any) => deepSnakeToCamel(item));
  } else if (isObject(obj)) {
    return mapKeys(mapValues(obj, (value: any) => deepSnakeToCamel(value)), (_value: any, key: string) =>
      camelCase(key)
    );
  }
  return obj;
};