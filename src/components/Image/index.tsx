/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as React from 'react';
import { ImageData } from '../../ComicService';
import { ComicSettingContext, ComicSettingState } from '../../contexts';
import * as styles from './styles';
import { ImageStatus } from '../../constants';
import { ratio } from '../../utils/ComicSettingUtil';

export type ErrorRendererType = React.FunctionComponent<{ retry: () => void }>;
export type LoadingRendererType =  React.FunctionComponent;

export interface ImageRenderers {
  ErrorRenderer?: ErrorRendererType,
  LoadingRenderer?: LoadingRendererType,
}

export interface ImageProps {
  image: ImageData,
  renderers?: ImageRenderers,
}

export const Image: React.FunctionComponent<ImageProps> = ({ image, renderers = {} }) => {
  const settingState = React.useContext(ComicSettingContext);
  // const currentState = React.useContext(ComicCurrentContext);
  const ImageError = renderers.ErrorRenderer || DefaultImageError;
  const ImageLoading = renderers.LoadingRenderer || DefaultImageLoading;

  const [status, setStatus] = React.useState(ImageStatus.LOADING);

  // const checkImageInScreen = () => {
  //
  // };

  React.useEffect(() => {
    // lazyload 세팅
    // loading 상태 관리
  }, []);

  const retry = () => setStatus(ImageStatus.LOADING);
  const onLoad = () => setStatus(ImageStatus.LOADED);
  const onError = () => setStatus(ImageStatus.ERROR);

  return (
    <div css={styles.wrapper(settingState, ratio(image.width, image.height), status, image.index)}>
      <img src={image.uri} onLoad={onLoad} onError={onError} />
      {ImageStatus.LOADING === status && <ImageLoading />}
      {ImageStatus.ERROR === status && <ImageError retry={retry} />}
    </div>
  );
};

export const DefaultImageLoading: LoadingRendererType = () => {
  return <div css={styles.loading}>Loading...</div>
};

export const DefaultImageError: ErrorRendererType = ({ retry }) => {
  return (
    <div css={styles.error}>
      <button onClick={retry}>Retry</button>
    </div>
  );
};

export const BlankImage: React.FunctionComponent<{ settingState: ComicSettingState }> = ({ settingState }) => {
  return (<div css={styles.blank(settingState)} />);
};
