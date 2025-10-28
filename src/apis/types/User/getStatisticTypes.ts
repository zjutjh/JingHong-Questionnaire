export interface SetStatisticRequest {
    /**
     * 问卷编号
     */
    id: number;
    [property: string]: any;
}

export interface SetStatisticResponse {
    code: number;
    data: Data | null;
    msg: string;
    [property: string]: any;
}

export interface Data {
    statistics: Statistic[];
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
    rank: number;
    /**
     * 选项序号
     */
    serial_num: number;
    [property: string]: any;
}