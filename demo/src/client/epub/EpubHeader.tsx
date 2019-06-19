/** @jsx jsx */
import * as React from 'react';
import { jsx } from '@emotion/core';
import * as styles from './styles';
import { EpubViewTypeButton } from '../ViewTypeButton';
import {
  EpubSettingContext,
  EpubCalculationContext,
  ViewType,
  EpubService,
  EpubSettingUtil,
  EpubParsedData,
} from '@ridi/react-reader';
import axios from 'axios';

const EpubHeader: React.FunctionComponent = () => {
  const fileInputRef: React.RefObject<HTMLInputElement> = React.useRef(null);

  const settingState = React.useContext(EpubSettingContext);
  const pagingState = React.useContext(EpubCalculationContext);

  const loadFile = async (file: File): Promise<EpubParsedData> => {
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

  const onFileChanged = () => {
    const { current: fileInput } = fileInputRef;
    if (fileInput && fileInput.files) {
      loadFile(fileInput.files[0])
      .then((metadata: EpubParsedData) => {
        EpubService.load({
          metadata,
          currentSpineIndex: pagingState.currentSpineIndex,
          currentPosition: pagingState.currentPosition,
          isScroll: EpubSettingUtil.isScroll(settingState),
          columnWidth: EpubSettingUtil.columnWidth(settingState),
          columnGap: EpubSettingUtil.columnGap(settingState),
        }).catch((error: any) => console.error(error));
      }).catch((error: any) => console.error(error));
    }
  };

  return (
    <div css={styles.header}>
      <span id="title" className="navbar_title" aria-label="Title">Pilot Project</span>
      <div className="title_bar_right_container">
        <EpubViewTypeButton viewType={ViewType.SCROLL}/>
        <EpubViewTypeButton viewType={ViewType.PAGE1}/>
        <EpubViewTypeButton viewType={ViewType.PAGE12}/>
        <input ref={fileInputRef} type="file" accept=".epub" onChange={onFileChanged}/>
      </div>
    </div>
  );
};

export default EpubHeader;
