export declare function measure(run: () => Promise<any> | any, message: string, ...optionalParams: Array<any>): Promise<any>;
export declare const getRootElement: () => Element | null;
export declare const getContentRootElement: () => HTMLElement | null;
export declare const getContentContainerElement: () => HTMLElement | null;
export declare const getScrollWidth: () => number;
export declare const getScrollHeight: () => number;
export declare const getScrollLeft: () => number;
export declare const getScrollTop: () => number;
export declare const setScrollLeft: (scrollLeft: number) => void;
export declare const setScrollTop: (scrollTop: number) => void;
export declare const getClientWidth: () => number;
export declare const getClientHeight: () => number;
/**
 * Create a debounced(grouping multiple event listener in one) function
 * And the latest invoking of this deboucnced function will only be taken after `wait` miliseconds periods.
 *
 * @param {function} fn
 * @param {number} [wait=100]
 * @param {boolean} [immediate=false]
 * @return {function} debounced function
 */
export declare const debounce: (fn: () => any, wait?: number, immediate?: boolean) => () => void;
/**
 * Create a throttled(invoking only once in specified limited time) function
 *
 * @param {function} fn
 * @param {number} [limit=100] up to 1 invoke per ${limit} milliseconds
 * @param {boolean} [delayed=false] invoke ${fn} after ${limit} milliseconds delayed
 * @returns {function} throttled function
 */
export declare const throttle: (fn: () => any, limit?: number, delayed?: boolean) => () => void;
export declare const sleep: (millisecond?: number) => Promise<void>;
export declare const hasIntersect: (r1: number[], r2: number[]) => boolean;
