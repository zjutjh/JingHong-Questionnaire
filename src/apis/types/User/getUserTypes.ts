export interface GetUserRequest {
    /**
     * 问卷编号
     */
    id: number | null;
    [property: string]: any;
}

export interface GetUserResponse {
    code: number;
    data: Data | null;
    msg?: string;
    [property: string]: any;
}

export interface Data {
    base_config: BaseConfig;
    /**
     * 问卷编号
     */
    id: number;
    ques_config: QuesConfig;
    status: number;
    /**
     * 问卷类型，0调研问卷，1投票问卷
     */
    survey_type: number;
    [property: string]: any;
}

export interface BaseConfig {
    /**
     * 每日提交限制，当启用统一验证时生效
     */
    day_limit: number;
    end_time: string;
    start_time: string;
    /**
     * 总提交次数限制，当启用统一验证时生效
     */
    sum_limit: string;
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
    /**
     * 问题列表
     */
    question_list: QuestionList[];
    title: string;
    [property: string]: any;
}

export interface QuestionList {
    /**
     * 问题描述
     */
    description?: string;
    /**
     * 题目编号
     */
    id: number;
    /**
     * 图片链接
     */
    img?: string;
    options?: Option[];
    ques_setting: QuesSetting;
    /**
     * 题目序号
     */
    serial_num: number;
    /**
     * 问题题目
     */
    subject?: string;
    [property: string]: any;
}

export interface Option {
    /**
     * 选项内容
     */
    content?: string;
    /**
     * 描述
     */
    description?: string;
    /**
     * 选项编号
     */
    id?: number;
    /**
     * 选项图片
     */
    img?: string;
    /**
     * 选项序号
     */
    serial_num?: number;
    [property: string]: any;
}

export interface QuesSetting {
    /**
     * 多选所选最大限制数量，0为不限制
     */
    maximum_option?: number;
    /**
     * 多选所选最小限制，0为不限制
     */
    minimum_option?: number;
    /**
     * 是否有其他选项
     */
    other_option?: boolean;
    /**
     * 问题类型，调研问卷为1单选2多选3填空4简答5图片6文件。  投票问卷为1投票
     */
    question_type: number;
    /**
     * 正则表达式
     */
    reg: string;
    /**
     * 是否必须作答
     */
    required: boolean;
    /**
     * 是否唯一
     */
    unique: boolean;
    [property: string]: any;
}