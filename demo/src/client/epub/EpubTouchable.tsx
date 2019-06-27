/** @jsx jsx */
import * as React from 'react';
import { jsx } from '@emotion/core';
import * as styles from './styles';
import { ReaderJsHelper } from '@ridi/react-reader';

const EpubTouchable: React.FunctionComponent = () => {
  const touch = (e: React.MouseEvent) => {
    const readerjs = ReaderJsHelper.getByPoint(e.pageX, e.pageY);
    if (!readerjs) return;
    console.log('elementFromPoint', readerjs.elementFromPoint(e.clientX, e.clientY));
    console.log('imageFromPoint', readerjs.imageFromPoint(e.clientX, e.clientY));
    console.log('svgFromPoint', readerjs.svgFromPoint(e.clientX, e.clientY));
    console.log('linkFromPoint', readerjs.linkFromPoint(e.clientX, e.clientY));
  };

  return (
    <div
      css={styles.touchable}
      onClick={touch}
    />
  );
};

export default EpubTouchable;
