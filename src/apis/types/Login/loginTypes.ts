export interface LoginRequest {
    password: string;
    username: string;
    [property: string]: any;
}

export interface LoginResponse {
    code: number;
    /**
     * 应当返回 token
     */
    data: null | string;
    msg: string;
    [property: string]: any;
}
