export interface SetQuestionnaireDetailRequest {
    base_config: BaseConfig;
    /**
     * 问卷编号
     */
    id: number;
    ques_config: QuesConfig;
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
    /**
     * 截止时间，xxxx-xx-xxTxx:xx:xxZ
     */
    end_time: string;
    /**
     * 是否在收到回答时发送邮件提醒
     */
    need_notify: boolean;
    /**
     * 问卷开始时间，xxxx-xx-xxTxx:xx:xxZ
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
    /**
     * 问卷描述
     */
    description?: string;
    /**
     * 图片链接
     */
    img?: string;
    options?: Option[];
    ques_setting: QuesSetting;
    /**
     * 问题序号
     */
    serial_num: number;
    subject?: string;
    [property: string]: any;
}

export interface Option {
    content?: string;
    description?: string;
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

export interface SetQuestionnaireDetailResponse {
    code: number;
    data: string | null;
    msg: string;
    [property: string]: any;
}