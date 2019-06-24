/** @jsx jsx */
import * as React from 'react';
import { jsx } from '@emotion/core';
import * as styles from './styles';
import { ReaderJsHelper } from '@ridi/react-reader';

const EpubTouchable: React.FunctionComponent = () => {
  const touch = (e: React.MouseEvent) => {
    const readerjs = ReaderJsHelper.get();
    if (!readerjs) return;
    console.log(readerjs.elementFromPoint(e.clientX, e.clientY));
  };

  return (
    <div
      css={styles.touchable}
      onClick={touch}
    />
  );
};

export default EpubTouchable;
