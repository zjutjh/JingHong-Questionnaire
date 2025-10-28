import { request } from "@/apis/axios";
import { DelAnswerResponse, DelAnswerResquest } from "@/apis/types/DataDisplay/delAnswerTypes";

const delAnswerAPI = (data: DelAnswerResquest):
  Promise<DelAnswerResponse> => {
  return request("/api/admin/delete/answersheet", {
    params: data,
    method: "DELETE"
  });
};

export default delAnswerAPI;