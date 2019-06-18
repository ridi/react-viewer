/** @jsx jsx */
import * as React from 'react';
import { jsx } from '@emotion/core';
import { EpubStatusContext } from '@ridi/react-reader';
import * as styles from './styles';

const Loading: React.FunctionComponent = () => {
  const statusContext = React.useContext(EpubStatusContext);

  if (statusContext.readyToRead) return null;
  return (
    <div css={styles.wrapper}>Loading...</div>
  );
};


export default Loading;
