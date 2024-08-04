import { request } from "@/apis/axios";

const getStaticsDataAPI = (data: { page_num: number; id: any; page_size: number }) => {
  return request("/api/admin/statics/answers", {
    params: data,
    method: "GET",
  });
};

export default getStaticsDataAPI;