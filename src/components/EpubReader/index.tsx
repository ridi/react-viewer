/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as React from 'react';
import { PagingContext, SettingContext, StatusContext } from '../../contexts';
import * as SettingUtil from '../../SettingUtil';
import Events, { SET_CONTENT } from '../../Events';
import ReaderJsHelper, { Context } from '../../ReaderJsHelper';
import { EpubService } from '../../EpubService';
import * as styles from './styles';

const EpubReader = () => {
  const contentRef: React.RefObject<HTMLDivElement> = React.useRef(null);
  const [content, setContent] = React.useState('');
  const pagingState = React.useContext(PagingContext);
  const settingState = React.useContext(SettingContext);
  const statusState = React.useContext(StatusContext);

  const setSpineContent = (spines: Array<String>) => setContent(spines.join(''));

  const createContext = (maxSelectionLength: number = 1000): Context => {
    return new Context(
      SettingUtil.containerWidth(settingState),
      SettingUtil.containerHeight(settingState),
      SettingUtil.columnGap(settingState),
      SettingUtil.isDoublePage(settingState),
      SettingUtil.isScroll(settingState),
      maxSelectionLength);
  };

  React.useEffect(() => {
    if (contentRef.current) {
      ReaderJsHelper.mount(contentRef.current, createContext());
    }

    Events.on(SET_CONTENT, setSpineContent);

    return () => {
      Events.off(SET_CONTENT, setSpineContent);
    };
  }, []);

  React.useEffect(() => {
    const invalidate = () => EpubService.invalidate({
      currentPage: pagingState.currentPage,
      isScroll: SettingUtil.isScroll(settingState),
      columnWidth: SettingUtil.columnWidth(settingState),
      columnGap: SettingUtil.columnGap(settingState),
      columnsInPage: SettingUtil.columnsInPage(settingState),
    }).catch(error => console.error(error));
    const updateCurrent = () => {
      if (!statusState.startToRead) return;
      EpubService.updateCurrent({
        pageUnit: pagingState.pageUnit,
        isScroll: SettingUtil.isScroll(settingState),
        columnsInPage: SettingUtil.columnsInPage(settingState),
      }).catch(error => console.error(error));
    };

    window.addEventListener('resize', invalidate);
    window.addEventListener('scroll', updateCurrent);
    return () => {
      window.removeEventListener('resize', invalidate);
      window.removeEventListener('scroll', updateCurrent);
    };
  }, [settingState, pagingState, statusState]);

  React.useEffect(() => {
    if (contentRef.current) {
      ReaderJsHelper.mount(contentRef.current, createContext());
    }
    EpubService.invalidate({
      currentPage: pagingState.currentPage,
      isScroll: SettingUtil.isScroll(settingState),
      columnWidth: SettingUtil.columnWidth(settingState),
      columnGap: SettingUtil.columnGap(settingState),
      columnsInPage: SettingUtil.columnsInPage(settingState),
    }).catch(error => console.error(error));
  }, [settingState]);

  return (
    <div id="content_root" css={styles.wrapper(settingState)}>
      <div
        css={styles.contentWrapper(settingState)}
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default EpubReader;
