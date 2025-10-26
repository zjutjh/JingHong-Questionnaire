export interface UpdateQuestionnaireStatusRequest {
    /**
     * 问卷编号
     */
    id: number;
    /**
     * 问卷状态，1草稿2发布
     */
    status: 1 | 2 | number,
    //status: number;
    [property: string]: any;
}

export interface UpdateQuestionnaireStatusResponse {
    code: number;
    data: null | string;
    msg: string;
    [property: string]: any;
}