/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as React from 'react';
import { EpubCalculationContext, EpubSettingContext, EpubCurrentContext } from '../../contexts';
import Events, { SET_CONTENT } from '../../Events';
import { EpubService } from '../../EpubService';
import * as styles from './styles';
import { isScroll } from '../../utils/EpubSettingUtil';
import { getContentRootElement } from '../../utils/Util';
import ReaderJsHelper from '../../ReaderJsHelper';

const EpubReader = () => {
  const contentRef: React.RefObject<HTMLDivElement> = React.useRef(null);
  const [content, setContent] = React.useState('');
  const calculationState = React.useContext(EpubCalculationContext);
  const settingState = React.useContext(EpubSettingContext);
  const currentState = React.useContext(EpubCurrentContext);

  const readyToRead = currentState.readyToRead;

  const setSpineContent = (spines: Array<String>) => setContent(spines.join(''));

  const updateCurrent = () => {
    if (!currentState.readyToRead) return;
    if (!EpubService.isInitialized()) return;
    EpubService.get().updateCurrent().catch(error => console.error(error));
  };

  const invalidate = () => {
    if (!EpubService.isInitialized()) return;
    if (!settingState.autoInvalidation) return;
    EpubService.get().invalidate().catch(error => console.error(error));
  };

  React.useEffect(() => {
    Events.on(SET_CONTENT, setSpineContent);
    window.addEventListener('resize', invalidate);
    return () => {
      Events.off(SET_CONTENT, setSpineContent);
      window.removeEventListener('resize', invalidate);
    };
  }, []);

  React.useLayoutEffect(() => {
    if (!contentRef.current) return;
    ReaderJsHelper.updateContents(Array.from(contentRef.current.getElementsByTagName('article')), contentRef.current);
  }, [content]);

  React.useEffect(() => {
    const rootElement = isScroll(settingState) ? window : getContentRootElement();
    if (rootElement) rootElement.addEventListener('scroll', updateCurrent);
    return () => {
      const rootElement = isScroll(settingState) ? window : getContentRootElement();
      if (rootElement) rootElement.removeEventListener('scroll', updateCurrent);
    };
  }, [readyToRead]);

  return (
    <div id="content_root" css={styles.wrapper(settingState)}>
      <div
        id="content_container"
        css={styles.contentWrapper(settingState, calculationState)}
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default EpubReader;
