import * as React from 'react';
import { EpubCurrentContext, ComicCurrentContext } from '@ridi/react-reader';
import * as styles from './styles';

export const EpubLoading: React.FunctionComponent = () => {
  const currentState = React.useContext(EpubCurrentContext);

  if (currentState.readyToRead) return null;
  return (
    <div css={styles.wrapper}>
      Loading...
    </div>
  );
};

export const ComicLoading: React.FunctionComponent = () => {
  const currentState = React.useContext(ComicCurrentContext);

  if (currentState.readyToRead) return null;
  return (
    <div css={styles.wrapper}>
      Loading...
    </div>
  );
};
