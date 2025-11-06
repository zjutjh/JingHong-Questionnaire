export interface DelQuestionnaireRequest {
    /**
     * 问卷编号
     */
    id: number;
    [property: string]: any;
}

export interface DelQuestionnaireResponse {
    code: number;
    data: null;
    msg: string;
    [property: string]: any;
}