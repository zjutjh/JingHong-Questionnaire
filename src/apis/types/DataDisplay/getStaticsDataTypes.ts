export interface GetStaticsDataRequest {
    id?: number;
    page_num: number;
    page_size: number;
    [property: string]: any;
}

export interface GetStaticsDataResponse {
    code: number;
    data: Data | null;
    msg: string;
    [property: string]: any;
}

export interface Data {
    statistics: Statistic[];
    survey_type: number;
    /**
     * 总数
     */
    total: number;
    /**
     * 总页数
     */
    total_sum_page: number;
    [property: string]: any;
}

export interface Statistic {
    options: Option[];
    /**
     * 题目标题
     */
    question: string;
    /**
     * 题目类型，1单选2多选
     */
    question_type: number;
    /**
     * 题目序号
     */
    serial_num: number;
    [property: string]: any;
}

export interface Option {
    /**
     * 选项内容
     */
    content: string;
    /**
     * 选人数
     */
    count: number;
    /**
     * 选项序号
     */
    serial_num: number;
    [property: string]: any;
}