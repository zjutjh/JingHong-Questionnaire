import { request } from "@/apis/axios";

const getQuestionnaireListAPI = (data: {
  page_num: number,
  page_size: number,
  title?: string
}) => {
  return request("/api/admin/list/questions", {
    params: data,
    method: "GET",
  });
};

export default getQuestionnaireListAPI;