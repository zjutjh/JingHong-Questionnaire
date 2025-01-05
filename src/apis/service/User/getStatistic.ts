import { request } from "@/apis/axios";

// 定义请求数据的接口

const setStatisticAPI = (params: { id: number }) => {
  return request("/api/user/statistic", {
    method: "GET",
    params: params
  });
};

export default setStatisticAPI;