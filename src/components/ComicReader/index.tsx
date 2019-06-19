/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as React from 'react';
import { EpubPagingContext, EpubSettingContext, EpubStatusContext } from '../../contexts';
import * as SettingUtil from '../../utils/EpubSettingUtil';
import { EpubService } from '../../EpubService';
import { isScroll } from '../../utils/EpubSettingUtil';
import { getContentRootElement } from '../../utils/Util';
import * as styles from './styles';
import { ImageData } from '../../ComicService';
import Events, { SET_CONTENT } from '../../Events';

const ComicReader: React.FunctionComponent = () => {
  const [content, setContent] = React.useState('');
  const pagingState = React.useContext(EpubPagingContext);
  const settingState = React.useContext(EpubSettingContext);
  const statusState = React.useContext(EpubStatusContext);

  const setImageContent = (images: Array<ImageData>) => setContent(
    images.map(({ index, path, width, height, fileSize }) => `${index + 1}: ${path} (w: ${width}, h: ${height}, size: ${fileSize})`).join('\n')
  );

  const updateCurrent = () => {
    if (!statusState.readyToRead) return;
    EpubService.updateCurrent({
      pageUnit: pagingState.pageUnit,
      isScroll: SettingUtil.isScroll(settingState),
      spines: pagingState.spines,
    }).catch(error => console.error(error));
  };

  const invalidate = () => EpubService.invalidate({
    currentSpineIndex: pagingState.currentSpineIndex,
    currentPosition: pagingState.currentPosition,
    isScroll: SettingUtil.isScroll(settingState),
    columnWidth: SettingUtil.columnWidth(settingState),
    columnGap: SettingUtil.columnGap(settingState),
  })
  .catch(error => console.error(error));

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
