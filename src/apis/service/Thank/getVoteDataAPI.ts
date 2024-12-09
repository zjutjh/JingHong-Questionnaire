import { request } from "@/apis/axios";

const getVoteDataAPI = (data: {
  id: number
}) => {
  return request("/api/user/statistic", {
    params: data,
    method: "GET",
  });
};

export default getVoteDataAPI;