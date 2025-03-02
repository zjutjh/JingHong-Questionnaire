import { request } from "@/apis/axios";
import { deepCamelToSnake } from "@/utilities/deepCamelToSnake";

export const createQuestionnaire = (schema: any) => {
  const snakedSchema = deepCamelToSnake(schema);
  return request("/api/admin/create", {
    data: snakedSchema,
    method: "post"
  });
};