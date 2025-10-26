export interface GetQuestionnaireDetailRequest {
    id: number;
    [property: string]: any;
}

export interface getQuestionnaireDetailResponse {
    code: number;
    data: Data | null;
    msg: string;
    [property: string]: any;
}

export interface Data {
    base_config: BaseConfig;
    ques_config: QuesConfig;
    /**
     * 1草稿、2发布、3已截止
     */
    status: number;
    /**
     * 问卷类型，0调研问卷，1投票问卷
     */
    survey_type: number;
    /**
     * 问卷编号
     */
    uuid: string;
    [property: string]: any;
}

export interface BaseConfig {
    /**
     * 每日提交限制，当启用统一验证时生效
     */
    day_limit: number;
    end_time: string;
    /**
     * 是否在收到回答时发送邮件提醒
     */
    need_notify: boolean;
    /**
     * 问卷开始时间，时间戳格式
     */
    start_time: string;
    /**
     * 总提交次数限制，当启用统一验证时生效
     */
    sum_limit: number;
    /**
     * 仅本科生，是否仅本科生
     */
    undergrad_only: boolean;
    /**
     * 是否统一登录验证
     */
    verify: boolean;
    [property: string]: any;
}

export interface QuesConfig {
    desc: string;
    question_list: QuestionList[];
    title: string;
    [property: string]: any;
}

export interface QuestionList {
    description?: string;
    id: number;
    img?: string;
    options?: Option[];
    ques_setting: QuesSetting;
    serial_num: number;
    subject?: string;
    [property: string]: any;
}

export interface Option {
    content?: string;
    description?: string;
    id?: number;
    img?: string;
    serial_num?: number;
    [property: string]: any;
}

export interface QuesSetting {
    maximum_option?: number;
    minimum_option?: number;
    other_option?: boolean;
    question_type: number;
    reg: string;
    required: boolean;
    unique: boolean;
    [property: string]: any;
}