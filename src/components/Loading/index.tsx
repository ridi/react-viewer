/** @jsx jsx */
import * as React from 'react';
import { jsx } from '@emotion/core';
import { StatusContext } from '../../contexts';
import * as styles from './styles';

const Loading: React.FunctionComponent = () => {
  const statusContext = React.useContext(StatusContext);

  console.log(`startToRead: ${statusContext.startToRead}`);

  if (statusContext.startToRead) return null;
  return (
    <div css={styles.wrapper}>Loading...</div>
  );
};


export default Loading;
