import { request } from "@/apis/axios";
import { GetUserRequest, GetUserResponse } from "@/apis/types/User/getUserTypes";
// import CryptoJS from 'crypto-js';

/*
const urlen =

const urlde =
*/
// 定义参数的类型
const getUserAPI = (params: GetUserRequest):
  Promise<GetUserResponse> => {
  return request("/api/user/get", {
    method: "GET",
    params: params
  });
};

export default getUserAPI;
