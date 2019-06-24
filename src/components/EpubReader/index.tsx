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

  const setSpineContent = (spines: Array<String>) => setContent(spines.join(''));

  const updateCurrent = () => {
    if (!currentState.readyToRead) return;
    EpubService.get().updateCurrent().catch(error => console.error(error));
  };

  const invalidate = () => EpubService.get().invalidate().catch(error => console.error(error));

  React.useEffect(() => {
    Events.on(SET_CONTENT, setSpineContent);
    return () => {
      Events.off(SET_CONTENT, setSpineContent);
    };
  }, []);

  React.useLayoutEffect(() => {
    if (!contentRef.current) return;
    ReaderJsHelper.updateContents(Array.from(contentRef.current.getElementsByTagName('article')), contentRef.current);
  }, [content]);

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
    invalidate();
  }, [settingState]);

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
