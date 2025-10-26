import { request } from "@/apis/axios";
import { setNewQuestionnaireDetailResponse, setNewQuestionnaireDetailRequest } from "@/apis/types/DetaiInfo/setNewQuestionnaireDetailTypes";
// 定义发送问卷详情更新请求的函数
const setNewQuestionnaireDetailAPI = (data: setNewQuestionnaireDetailRequest):
  Promise<setNewQuestionnaireDetailResponse> => {
  return request("/api/admin/create", {
    method: "POST",
    data: data
  });
};

export default setNewQuestionnaireDetailAPI;
