import { request } from "@/apis/axios";

// 定义请求数据的接口
export interface Request {
  desc: string;
  img: string;
  questions: Question[];
  time: string;
  title: string;
  [property: string]: any; // 允许额外的属性
}

export interface Question {
  description?: string;
  img?: string;
  options: Option[];
  other_option: string;
  question_type: number;
  reg: string;
  required: boolean;
  serial_num: number;
  subject: string;
  unique: boolean;
  [property: string]: any; // 允许额外的属性
}

export interface Option {
  content: string;
  img: string;
  serial_num: number;
  [property: string]: any; // 允许额外的属性
}

// 定义发送问卷详情更新请求的函数
const setNewQuestionnaireDetailAPI = (data: Request) => {
  return request("/api/admin/create", {
    method: "POST",
    data: data
  });
};

export default setNewQuestionnaireDetailAPI;
