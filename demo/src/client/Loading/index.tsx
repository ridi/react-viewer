/** @jsx jsx */
import * as React from 'react';
import { jsx } from '@emotion/core';
import { EpubStatusContext, ComicStatusContext } from '@ridi/react-reader';
import * as styles from './styles';

export const EpubLoading: React.FunctionComponent = () => {
  const statusContext = React.useContext(EpubStatusContext);

  if (statusContext.readyToRead) return null;
  return (
    <div css={styles.wrapper}>
      Loading...
    </div>
  );
};

export const ComicLoading: React.FunctionComponent = () => {
  const statusContext = React.useContext(ComicStatusContext);

  if (statusContext.readyToRead) return null;
  return (
    <div css={styles.wrapper}>
      Loading...
    </div>
  );
};
