import * as React from 'react';
import { ImageData } from '../../ComicService';
import { ComicSettingContext, ComicSettingState, ComicCurrentContext } from '../../contexts';
import * as styles from './styles';
import { ImageStatus } from '../../constants';
import { ratio } from '../../utils/ComicSettingUtil';

export type ErrorRendererType = React.FunctionComponent<{ retry: () => void }>;
export type LoadingRendererType = React.FunctionComponent;
export type ImageRendererType = React.FunctionComponent;

export interface ImageRenderers {
  ErrorRenderer?: ErrorRendererType,
  LoadingRenderer?: LoadingRendererType,
  ImageRenderer?: ImageRendererType,
}

export interface ImageProps {
  image: ImageData,
  renderers?: ImageRenderers,
}

export const Image: React.FunctionComponent<ImageProps> = ({ image, renderers = {} }) => {
  const settingState = React.useContext(ComicSettingContext);
  const currentState = React.useContext(ComicCurrentContext);
  const ImageError = renderers.ErrorRenderer || DefaultImageError;
  const ImageLoading = renderers.LoadingRenderer || DefaultImageLoading;

  const [status, setStatus] = React.useState(ImageStatus.NONE);

  const startLoading = () => {
    if (status === ImageStatus.LOADED) return;
    if (settingState.lazyLoad) {
      const preloadPagesOnBothSides = settingState.lazyLoad as number;
      if (image.index + 1 >= currentState.currentPage - preloadPagesOnBothSides
        && image.index + 1 < currentState.currentPage + preloadPagesOnBothSides) {
        setStatus(ImageStatus.LOADING);
      }
    } else {
      setStatus(ImageStatus.LOADING);
    }
  };

  React.useEffect(() => {
    startLoading();
  }, [currentState]);

  const retry = () => setStatus(ImageStatus.LOADING);
  const onLoad = () => setStatus(ImageStatus.LOADED);
  const onError = () => setStatus(ImageStatus.ERROR);

  return (
    <div css={styles.wrapper(settingState, ratio(image.width, image.height), status, image.index)}>
      {ImageStatus.NONE !== status && ImageStatus.ERROR !== status && <img src={image.uri} onLoad={onLoad} onError={onError} />}
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
