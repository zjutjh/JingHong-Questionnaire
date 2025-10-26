import { request } from "@/apis/axios";
import { GetStaticsDataResponse, GetStaticsDataRequest } from "@/apis/types/DataDisplay/getStaticsDataTypes";

const getStaticsDataAPI = (data: GetStaticsDataRequest):
  Promise<GetStaticsDataResponse> => {
  return request("/api/admin/statics/answers", {
    params: data,
    method: "GET"
  });
};

export default getStaticsDataAPI;