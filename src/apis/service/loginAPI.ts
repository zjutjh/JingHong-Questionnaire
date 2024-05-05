import { request } from "@/apis/axios";

const loginAPI = (data: {
  username: string,
  password: string
}) => {
  return request("/api/admin/login", {
    data: data,
    method: "POST",
  });
};

export default loginAPI;