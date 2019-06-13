export declare function measure(run: () => Promise<any> | any, message: string, ...optionalParams: Array<any>): Promise<any>;
export declare function withMeasure(run: () => Promise<any> | any, message: string, ...optionalParams: Array<any>): () => Promise<any>;
export declare function getRootElement(): HTMLElement | null;
export declare function getScrollWidth(): number;
export declare function getScrollHeight(): number;
export declare function getClientWidth(): number;
export declare function getClientHeight(): number;
