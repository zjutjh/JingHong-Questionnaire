import { request } from "@/apis/axios";
import { SetQuestionnaireDetailRequest, SetQuestionnaireDetailResponse } from "@/apis/types/DetaiInfo/setQuestionnaireDetailTypes";


// 定义发送问卷详情更新请求的函数
const setQuestionnaireDetailAPI = (data: SetQuestionnaireDetailRequest):
  Promise<SetQuestionnaireDetailResponse> => {
  return request("/api/admin/update/questions", {
    method: "PUT",
    data: data
  });
};

export default setQuestionnaireDetailAPI;
