export interface VerifyRequest {
    /**
     * 问卷编号
     */
    id: number;
    /**
     * 统一密码
     */
    password: string;
    /**
     * 学号
     */
    stu_id: string;
    [property: string]: any;
}

export interface VerifyResponse {
    code: number;
    data: Data | null;
    msg: string;
    [property: string]: any;
}

export interface Data {
    /**
     * 当日剩余提交次数
     */
    daily_limit: number;
    /**
     * 总剩余提交次数
     */
    sum_limit: number;
    token: string;
    [property: string]: any;
}