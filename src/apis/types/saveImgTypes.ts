export interface saveImgResponse {
    code: number;
    /**
     * 图片url
     */
    data: string | null;
    msg: string;
    [property: string]: any;
}
/*apifox中第一个成功示例的data为null，*/