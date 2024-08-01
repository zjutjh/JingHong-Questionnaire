import { request } from "@/apis/axios";
import {UnwrapRef} from "vue";

// 定义请求数据的接口
export interface Request {
    id:string;
    questions: Question[];
    [property: string]: any; // 允许额外的属性
}

export interface Question {
    question_id:number;
    serial_num:number;
    answer:string;
    [property: string]: any; // 允许额外的属性
}

const setUserSubmitAPI = (data: UnwrapRef<{ id: null; questions_list: any[] }>) => {
    return request("/api/user/submit", {
        method: "POST",
        data: data,
    });
};

export default setUserSubmitAPI;