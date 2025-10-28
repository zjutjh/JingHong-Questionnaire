import { request } from "@/apis/axios";
import { UpdateQuestionnaireStatusRequest, UpdateQuestionnaireStatusResponse } from "@/apis/types/Home/updateQuestionnaireStatusTypes";

const updateQuestionnaireStatusAPI = (data: UpdateQuestionnaireStatusRequest):
  Promise<UpdateQuestionnaireStatusResponse> => {
  return request("/api/admin/update/status", {
    data: data,
    method: "PUT"
  });
};

export default updateQuestionnaireStatusAPI;