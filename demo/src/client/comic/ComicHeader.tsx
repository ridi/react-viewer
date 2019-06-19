/** @jsx jsx */
import * as React from 'react';
import { jsx } from '@emotion/core';
import * as styles from './styles';
import { ComicViewTypeButton } from '../ViewTypeButton';
import {
  ComicSettingContext,
  ComicPagingContext,
  ViewType,
  ComicService,
  ComicParsedData,
} from '@ridi/react-reader';
import axios from 'axios';


const ComicHeader: React.FunctionComponent = () => {
  const fileInputRef: React.RefObject<HTMLInputElement> = React.useRef(null);

  const settingState = React.useContext(ComicSettingContext);
  const pagingState = React.useContext(ComicPagingContext);

  const loadFile = async (file: File): Promise<ComicParsedData> => {
    return new Promise((resolve, reject) => {
      axios.get(`/api/book?filename=${encodeURI(file.name)}`).then((response) => {
        return resolve(response.data);
      }).catch((error) => {
        if (error.response.status === 404) {
          const formData = new FormData();
          formData.append('file', file);
          return axios.post('/api/book/upload', formData).then(response => resolve(response.data));
        }
        reject(error);
      });
    });
  };

  const onFileChanged = async () => {
    const { current: fileInput } = fileInputRef;
    if (fileInput && fileInput.files) {
      try {
        const metadata: ComicParsedData = await loadFile(fileInput.files[0]);
        await ComicService.load({ metadata, pagingState, settingState });
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div css={styles.header}>
      <span id="title" className="navbar_title" aria-label="Title">Pilot Project</span>
      <div className="title_bar_right_container">
        <ComicViewTypeButton viewType={ViewType.SCROLL}/>
        <ComicViewTypeButton viewType={ViewType.PAGE1}/>
        <ComicViewTypeButton viewType={ViewType.PAGE12}/>
        <ComicViewTypeButton viewType={ViewType.PAGE23}/>
        <input ref={fileInputRef} type="file" accept=".zip" onChange={onFileChanged}/>
      </div>
    </div>
  );
};

export default ComicHeader;
