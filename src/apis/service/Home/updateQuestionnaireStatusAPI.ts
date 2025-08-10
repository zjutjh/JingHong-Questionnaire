import { request } from "@/apis/axios";

const updateQuestionnaireStatusAPI = (data: {
  id: number,
  status: 1 | 2,
}) => {
  return request("/api/admin/update/status", {
    data: data,
    method: "PUT"
  });
};

export default updateQuestionnaireStatusAPI;