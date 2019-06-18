/** @jsx jsx */
import * as React from 'react';
import { jsx } from '@emotion/core';
import { StatusContext } from '../../contexts';
import * as styles from './styles';

const Loading: React.FunctionComponent = () => {
  const statusContext = React.useContext(StatusContext);

  console.log(`readyToRead: ${statusContext.readyToRead}`);

  if (statusContext.readyToRead) return null;
  return (
    <div css={styles.wrapper}>Loading...</div>
  );
};


export default Loading;
