import _ from "lodash";

// 递归地将对象的所有键从小驼峰转换为蛇形命名
export const deepCamelToSnake = (obj: Record<string, any>): Record<string, any> => {
  return _.mapKeys(obj, (value, key) => {
    const newKey = _.snakeCase(key);

    if (_.isObject(value) && !_.isArray(value)) {
      return [newKey, deepCamelToSnake(value)];
    }

    return [newKey, value];
  });
};