import { request } from "@/apis/axios";



const getQuestionnaireDetailAPI = (data:{
    id:number
}) => {
    return request("/api/admin/single/question", {
        params: data,
        method: "GET",
    });
};

export default getQuestionnaireDetailAPI;