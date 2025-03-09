import { request } from "@/apis/axios";

const delAnswerAPI = (data: {
  answer_id: string
}) => {
  return request("/api/admin/delete/answersheet", {
    params: data,
    method: "DELETE"
  });
};

export default delAnswerAPI;