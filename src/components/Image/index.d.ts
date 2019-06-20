import * as React from 'react';
import { ImageData } from '../../ComicService';
import { ComicSettingState } from '../../contexts';
export declare type ErrorRendererType = React.FunctionComponent<{
    retry: () => void;
}>;
export declare type LoadingRendererType = React.FunctionComponent;
export interface ImageRenderers {
    ErrorRenderer?: ErrorRendererType;
    LoadingRenderer?: LoadingRendererType;
}
export interface ImageProps {
    image: ImageData;
    renderers?: ImageRenderers;
}
export declare const Image: React.FunctionComponent<ImageProps>;
export declare const DefaultImageLoading: LoadingRendererType;
export declare const DefaultImageError: ErrorRendererType;
export declare const BlankImage: React.FunctionComponent<{
    settingState: ComicSettingState;
}>;
