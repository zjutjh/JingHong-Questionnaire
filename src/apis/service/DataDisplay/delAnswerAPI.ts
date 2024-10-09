import { request } from "@/apis/axios";

//仅为骨架，不代表实际数据结构或实现逻辑。实际根据后端实际情况另行调整
const delAnswerAPI = (data: {
  index: number
}) => {
  //TODO:填写后端接口地址
  return request("/api/admin/xxxxxxx", {
    params: data,
    method: "DELETE",
  });
};

export default delAnswerAPI;