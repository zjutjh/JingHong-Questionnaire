import { request } from "@/apis/axios";
import { SetUserSubmitRequest, SetUserSubmitResponse } from "@/apis/types/User/setUserSubmitType";

const setUserSubmitAPI = (data: SetUserSubmitRequest):
  Promise<SetUserSubmitResponse> => {
  return request("/api/user/submit", {
    method: "POST",
    data: data
  });
};

export default setUserSubmitAPI;