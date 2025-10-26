import { request } from "@/apis/axios";
import { saveImgResponse } from "../types/saveImgTypes";

const saveImgAPI = (data: FormData | null):
  Promise<saveImgResponse> => {
  return request("/api/user/upload/img", {
    data: data,
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};
export default saveImgAPI;