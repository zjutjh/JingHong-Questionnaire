import { request } from "@/apis/axios";
type getquestionnaire = {
    id:number;
}

const getServiceeAPI = (params:getquestionnaire ,token: string) => {
  return request("/api/user/get", {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + token,
    },
    params: params,
  });
};

export default getServiceeAPI;