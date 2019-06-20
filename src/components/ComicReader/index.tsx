/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as React from 'react';
import { ComicCalculationContext, ComicSettingContext, ComicStatusContext } from '../../contexts';
import { ComicService }  from '../../ComicService';
import { isScroll } from '../../utils/ComicSettingUtil';
import { getContentRootElement } from '../../utils/Util';
import * as styles from './styles';
import { ImageData } from '../../ComicService';
import Events, { SET_CONTENT } from '../../Events';
import { BlankImage, Image, ImageRenderers } from '../Image/index';
import { ViewType } from '../../constants/index';

interface ComicReaderProps {
  renderers?: ImageRenderers
}

const ComicReader: React.FunctionComponent<ComicReaderProps> = ({ renderers = {} }) => {
  const [images, setImages] = React.useState<Array<ImageData>>([]);
  const calculationState = React.useContext(ComicCalculationContext);
  const settingState = React.useContext(ComicSettingContext);
  const statusState = React.useContext(ComicStatusContext);

  const updateCurrent = () => {
    if (!statusState.readyToRead) return;
    ComicService.get().updateCurrent().catch(error => console.error(error));
  };

  const invalidate = () => ComicService.get().invalidate().catch(error => console.error(error));

  React.useEffect(() => {
    Events.on(SET_CONTENT, setImages);
    return () => {
      Events.off(SET_CONTENT, setImages);
    };
  }, []);

  React.useEffect(() => {
    window.addEventListener('resize', invalidate);
    const rootElement = isScroll(settingState) ? window : getContentRootElement();
    if (rootElement) rootElement.addEventListener('scroll', updateCurrent);
    return () => {
      window.removeEventListener('resize', invalidate);
      const rootElement = isScroll(settingState) ? window : getContentRootElement();
      if (rootElement) rootElement.removeEventListener('scroll', updateCurrent);
    };
  }, [settingState, calculationState, statusState]);

  React.useEffect(() => {
    if (images.length > 0) {
      invalidate();
    }
  }, [settingState]);

  return (
    <div id="content_root" css={styles.wrapper(settingState)}>
      <div css={styles.imageContainer(settingState, calculationState)}>
      {settingState.viewType === ViewType.PAGE23 && <BlankImage settingState={settingState} />}
      {images.map((image) => (
        <Image key={`comic-image-${image.index}`} image={image} renderers={renderers} />
      ))}
      </div>
    </div>
  );
};

export default ComicReader;
