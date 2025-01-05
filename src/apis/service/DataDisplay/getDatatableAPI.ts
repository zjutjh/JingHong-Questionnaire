import { request } from "@/apis/axios";

const getDatatableAPI = (data: {
  id: number
}) => {
  return request("/api/admin/download", {
    params: data,
    method: "GET"
  });
};

export default getDatatableAPI;