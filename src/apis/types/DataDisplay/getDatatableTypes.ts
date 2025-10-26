export interface GetDatatableRequest {
    /**
     * 问卷编号
     */
    id: number;
    [property: string]: any;
}

export interface GetDatatableResponse {
    code: number;
    /**
     * 问卷url
     */
    data: string | null;
    msg: string;
    [property: string]: any;
}




