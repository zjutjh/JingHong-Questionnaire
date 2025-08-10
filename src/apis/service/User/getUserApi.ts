import { request } from "@/apis/axios";
// import CryptoJS from 'crypto-js';

/*
const urlen =

const urlde =
*/
// 定义参数的类型
interface GetUserAPIParams {
  id: number | null;
}
const getUserAPI = (params: GetUserAPIParams) => {
  return request("/api/user/get", {
    method: "GET",
    params: params
  });
};

export default getUserAPI;
