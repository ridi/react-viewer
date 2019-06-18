import * as React from 'react';
import ViewTypeButton from './ViewTypeButton';
import {
  SettingContext,
  PagingContext,
  ViewType,
  EpubService,
  SettingUtil,
  EpubParsedData,
} from '@ridi/react-reader';
import axios from 'axios';

const Header: React.FunctionComponent = () => {
  const fileInputRef: React.RefObject<HTMLInputElement> = React.useRef(null);
  const fileOpenButtonRef: React.RefObject<HTMLButtonElement> = React.useRef(null);

  const settingState = React.useContext(SettingContext);
  const pagingState = React.useContext(PagingContext);

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
          isScroll: SettingUtil.isScroll(settingState),
          columnWidth: SettingUtil.columnWidth(settingState),
          columnGap: SettingUtil.columnGap(settingState),
        }).catch((error: any) => console.error(error));
      }).catch((error: any) => console.error(error));
    }
  };

  const onFileOpen = () => {
    const { current: fileInput } = fileInputRef;
    const { current: fileOpenButton } = fileOpenButtonRef;
    if (fileOpenButton) fileOpenButton.blur();
    if (fileInput) fileInput.click();
  };

  return (
    <div id="title_bar" className="navbar">
      <span id="title" className="navbar_title" aria-label="Title">Pilot Project</span>
      <div className="title_bar_right_container">
        <ViewTypeButton viewType={ViewType.SCROLL}/>
        <ViewTypeButton viewType={ViewType.PAGE1}/>
        <ViewTypeButton viewType={ViewType.PAGE12}/>
        <button
          ref={fileOpenButtonRef}
          type="button"
          className="button title_bar_button"
          aria-label="Select File"
          onClick={onFileOpen}
        >
          Select file...
        </button>
        <input ref={fileInputRef} type="file" accept=".epub" onChange={onFileChanged}/>
      </div>
    </div>
  );
};

export default Header;
