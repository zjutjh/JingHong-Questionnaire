import { request } from "@/apis/axios";
import { GetAnswersRequest, GetAnswersResponse } from "@/apis/types/DataDisplay/getAnswersTypes";

const getAnswersAPI = (data: GetAnswersRequest):
  Promise<GetAnswersResponse> => {
  return request("/api/admin/list/answers", {
    params: data,
    method: "GET"
  });
};

export default getAnswersAPI;