import { request } from "@/apis/axios";
import { GetQuestionnaireDetailRequest, getQuestionnaireDetailResponse } from "@/apis/types/DetaiInfo/getQuestionnaireDetailTypes";

const getQuestionnaireDetailAPI = (data: GetQuestionnaireDetailRequest):
  Promise<getQuestionnaireDetailResponse> => {
  return request("/api/admin/single/question", {
    params: data,
    method: "GET"
  });
};

export default getQuestionnaireDetailAPI;