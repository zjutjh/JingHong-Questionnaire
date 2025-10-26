import { request } from "@/apis/axios";
import { DelQuestionnaireRequest, DelQuestionnaireResponse } from "@/apis/types/Home/delQuestionnaireTypes";

const delQuestionnaireAPI = (data: DelQuestionnaireRequest):
  Promise<DelQuestionnaireResponse> => {
  return request("/api/admin/delete", {
    params: data,
    method: "DELETE"
  });
};

export default delQuestionnaireAPI;