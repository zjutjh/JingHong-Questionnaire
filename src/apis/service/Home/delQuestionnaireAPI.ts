import { request } from "@/apis/axios";

const delQuestionnaireAPI = (data: {
  id: number
}) => {
  return request("/api/admin/delete", {
    params: data,
    method: "DELETE"
  });
};

export default delQuestionnaireAPI;