import { request } from "@/apis/axios";
import { GetQuestionnaireListResponse, GetQuestionnaireListResquest } from "@/apis/types/Home/getQuestionnaireListTypes";

const getQuestionnaireListAPI = (data: GetQuestionnaireListResquest):
  Promise<GetQuestionnaireListResponse> => {
  return request("/api/admin/list/questions", {
    params: data,
    method: "GET"
  });
};

export default getQuestionnaireListAPI;