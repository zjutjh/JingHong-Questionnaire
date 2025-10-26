import { request } from "@/apis/axios";
import { LoginRequest, LoginResponse } from "@/apis/types/Login/loginTypes";

const loginAPI = (data: LoginRequest): Promise<LoginResponse> => {
  return request("/api/admin/login", {
    data: data,
    method: "POST"
  });
};

export default loginAPI;