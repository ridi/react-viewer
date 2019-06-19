/** @jsx jsx */
import * as React from 'react';
import { jsx } from '@emotion/core';
import { TYPE } from '../constants';
import * as styles from './styles';

interface FileUploaderPropTypes {
  type: TYPE,
  onTypeChanged: (type: TYPE) => void,
}

const Index: React.FunctionComponent<FileUploaderPropTypes> = ({ type, onTypeChanged }) => {
  return (
    <div css={styles.wrapper}>
      <label>
        <input type="radio" value={TYPE.EPUB} checked={type === TYPE.EPUB} onChange={() => onTypeChanged(TYPE.EPUB)} />
        {TYPE.EPUB.toUpperCase()}
      </label>
      <label>
        <input type="radio" value={TYPE.COMIC} checked={type === TYPE.COMIC} onChange={() => onTypeChanged(TYPE.COMIC)} />
        {TYPE.COMIC.toUpperCase()}
      </label>
    </div>
  );
};

export default Index;
