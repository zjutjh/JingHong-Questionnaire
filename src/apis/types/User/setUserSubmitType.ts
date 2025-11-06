export interface SetUserSubmitRequest {
    /**
     * 问卷编号
     */
    id: number;
    /**
     * 答卷列表
     */
    questions_list: QuestionsList[];
    /**
     * 包含学号信息的token
     */
    token: string;
    [property: string]: any;
}

export interface QuestionsList {
    /**
     * 答卷
     */
    answer: string;
    /**
     * 问题编号
     */
    question_id: number;
    [property: string]: any;
}


export interface SetUserSubmitResponse {
    code: number;
    data: Data | null;
    msg: string;
    [property: string]: any;
}

export interface Data {
    /**
     * 提交时间
     */
    time: string;
    [property: string]: any;
}

/*import { request } from "@/apis/axios";
import { UnwrapRef } from "vue";

// 定义请求数据的接口
export interface Request {
  id: string;
  questions: Question[];
  [property: string]: any; // 允许额外的属性
}

export interface Question {
  question_id: number;
  serial_num: number;
  answer: string;
  [property: string]: any; // 允许额外的属性
}

const setUserSubmitAPI = (data: UnwrapRef<{ id: null; questions_list: any[] }>) => {
  return request("/api/user/submit", {
    method: "POST",
    data: data
  });
};

export default setUserSubmitAPI; */