import * as React from 'react';
export declare enum ComicCalculationActionType {
    UPDATE_CALCULATION = "update_calculation"
}
export declare enum ComicCalculationProperties {
    TOTAL_PAGE = "totalPage",
    PAGE_UNIT = "pageUnit",
    IMAGES = "images"
}
export declare type ComicCalculationAction = {
    type: ComicCalculationActionType.UPDATE_CALCULATION;
    calculation: Partial<ComicCalculationState>;
};
export declare type ImageCalculationState = {
    imageIndex: number;
    /**
     * height / width
     * immutable value
     */
    ratio: number;
    /**
     *  start offset in px on scroll view mode
     *  modified when resizing or changing setting.contentWidth
     */
    offsetTop: number;
    height: number;
};
export declare type ComicCalculationState = {
    [ComicCalculationProperties.TOTAL_PAGE]: number;
    [ComicCalculationProperties.PAGE_UNIT]: number;
    [ComicCalculationProperties.IMAGES]: Array<ImageCalculationState>;
};
export declare const initialComicCalculationState: ComicCalculationState;
export declare const ComicCalculationReducer: React.Reducer<ComicCalculationState, ComicCalculationAction>;
export declare const ComicCalculationDispatchContext: React.Context<React.Dispatch<ComicCalculationAction>>, ComicCalculationContext: React.Context<ComicCalculationState>, ComicCalculationContextProvider: React.FunctionComponent<{
    children: React.ReactNode;
    customInitialState?: Partial<ComicCalculationState> | undefined;
}>;
