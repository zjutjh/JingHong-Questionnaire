import { request } from "@/apis/axios";
//import CryptoJS from 'crypto-js';

/*
const urlen =

const urlde =
*/
// 定义参数的类型
type verifyData = {
  stu_id: string,
  password :string,
  survey: number
}
const verifyAPI = (data: verifyData ) => {
  return request("/api/user/oauth", {
    method: "POST",
    data: data,
  });
};

export default verifyAPI;
