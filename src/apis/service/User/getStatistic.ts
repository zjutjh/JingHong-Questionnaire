import { request } from "@/apis/axios";
import { SetStatisticRequest, SetStatisticResponse } from "@/apis/types/User/getStatisticTypes";

// 定义请求数据的接口
// API名字与文件名不一致

const setStatisticAPI = (params: SetStatisticRequest)
  : Promise<SetStatisticResponse> => {
  return request("/api/user/statistic", {
    method: "GET",
    params: params
  });
};

export default setStatisticAPI;