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

const ComicReader: React.FunctionComponent = () => {
  const [content, setContent] = React.useState('');
  const pagingState = React.useContext(ComicCalculationContext);
  const settingState = React.useContext(ComicSettingContext);
  const statusState = React.useContext(ComicStatusContext);

  const setImageContent = (images: Array<ImageData>) => setContent(
    images.map(({ index, path, width, height, fileSize }) => `${index}: ${path} (w: ${width}, h: ${height}, size: ${fileSize})`).join('\n')
  );

  const updateCurrent = () => {
    if (!statusState.readyToRead) return;
    ComicService.get().updateCurrent().catch(error => console.error(error));
  };

  const invalidate = () => ComicService.get().invalidate().catch(error => console.error(error));

  React.useEffect(() => {
    Events.on(SET_CONTENT, setImageContent);
    return () => {
      Events.off(SET_CONTENT, setImageContent);
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
  }, [settingState, pagingState, statusState]);

  React.useEffect(() => {
    invalidate();
  }, [settingState]);

  return (
    <div id="content_root" css={styles.wrapper()}>
      ... // todo images
      {content}
    </div>
  );
};

export default ComicReader;
