/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as React from 'react';
import { ComicCalculationContext, ComicSettingContext, ComicCurrentContext } from '../../contexts';
import { ComicService }  from '../../ComicService';
import { isDoublePage, isScroll, startWithBlankPage } from '../../utils/ComicSettingUtil';
import { debounce, getContentRootElement } from '../../utils/Util';
import * as styles from './styles';
import { ImageData } from '../../ComicService';
import Events, { SET_CONTENT } from '../../Events';
import { BlankImage, Image, ImageRenderers } from '../Image/index';
import { BindingType } from '../../constants/index';

interface ComicReaderProps {
  renderers?: ImageRenderers
}

const BLANK_IMAGE = -1;

const ComicReader: React.FunctionComponent<ComicReaderProps> = ({ renderers = {} }) => {
  const [images, setImages] = React.useState<Array<ImageData>>([]);
  const calculationState = React.useContext(ComicCalculationContext);
  const settingState = React.useContext(ComicSettingContext);
  const currentState = React.useContext(ComicCurrentContext);

  const updateCurrent = debounce(() => {
    if (!currentState.readyToRead) return;
    ComicService.get().updateCurrent().catch(error => console.error(error));
  });

  const invalidate = debounce(() => ComicService.get().invalidate().catch(error => console.error(error)));

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
  }, [settingState, calculationState, currentState]);

  React.useEffect(() => {
    if (images.length > 0) {
      invalidate();
    }
  }, [settingState]);


  const imageSequence = React.useMemo(() => {
    let sequence = images.map(({ index }) => index);
    if (startWithBlankPage(settingState)) {
      sequence = [BLANK_IMAGE, ...sequence];
    }
    if (isDoublePage(settingState) && settingState.bindingType === BindingType.RIGHT) {
      for (let i = 0; i < sequence.length; i += 2) {
        sequence.splice(i, 2, (i + 1 >= sequence.length ? BLANK_IMAGE : sequence[i+1]), sequence[i]);
      }
    }
    return sequence;
  }, [images, settingState.viewType, settingState.bindingType]);

  return (
    <div id="content_root" css={styles.wrapper(settingState)}>
      <div css={styles.imageContainer(settingState, calculationState)}>
      {imageSequence.map((imageIndex, index) => {
        if (imageIndex === BLANK_IMAGE) {
          return <BlankImage key={`comic-blank-${index}`} settingState={settingState} />;
        }
        const image = images[imageIndex];
        return <Image key={`comic-image-${image.index}`} image={image} renderers={renderers} />;
      })}
      </div>
    </div>
  );
};

export default ComicReader;
