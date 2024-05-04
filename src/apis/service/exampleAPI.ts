import { request } from "@/apis/axios";

const exampleAPI = (data: number ,token: string) => {
  return request("/api/example", {
    data: data,
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "multipart/form-data"
    }
  });
};

export default exampleAPI;