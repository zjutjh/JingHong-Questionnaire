import { request } from "@/apis/axios";
import { VerifyRequest, VerifyResponse } from "@/apis/types/User/verifyTypes";

const verifyAPI = (data: VerifyRequest):
  Promise<VerifyResponse> => {
  return request("/api/user/oauth", {
    method: "POST",
    data: data
  });
};

export default verifyAPI;
