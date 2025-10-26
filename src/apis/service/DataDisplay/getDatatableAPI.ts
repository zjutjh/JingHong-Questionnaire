import { request } from "@/apis/axios";
import { GetDatatableRequest, GetDatatableResponse } from "@/apis/types/DataDisplay/getDatatableTypes";

const getDatatableAPI = (data: GetDatatableRequest):
  Promise<GetDatatableResponse> => {
  return request("/api/admin/download", {
    params: data,
    method: "GET"
  });
};

export default getDatatableAPI;