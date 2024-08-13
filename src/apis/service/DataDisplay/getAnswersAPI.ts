import { request } from "@/apis/axios";

const getAnswersAPI = (data:{
  id:number,
  page_num: number,
  page_size: number,
  text?: string,
  unique: boolean,
}) => {
  return request("/api/admin/list/answers", {
    params: data,
    method: "GET",
  });
};

export default getAnswersAPI;