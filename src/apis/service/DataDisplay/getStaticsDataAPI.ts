import { request } from "@/apis/axios";

const getStaticsDataAPI = (data:{
  id:number
}) => {
  return request("/api/admin/statics/answers", {
    params: data,
    method: "GET",
  });
};

export default getStaticsDataAPI;