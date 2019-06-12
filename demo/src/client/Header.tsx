import * as React from 'react';
import ViewTypeButton from './ViewTypeButton';
import { SettingContext, PagingContext, ViewType } from './reader/contexts';
import EpubService from './reader/EpubService';
import {columnGap, isScroll} from "./reader/SettingUtil";

const Header: React.FunctionComponent = () => {
  const fileInputRef: React.RefObject<HTMLInputElement> = React.useRef(null);
  const fileOpenButtonRef: React.RefObject<HTMLButtonElement> = React.useRef(null);

  const settingState = React.useContext(SettingContext);
  const pagingState = React.useContext(PagingContext);

  const onFileChanged = () => {
    const { current: fileInput } = fileInputRef;
    if (fileInput && fileInput.files) {
      EpubService.load(fileInput.files[0], pagingState.currentPage, isScroll(settingState), columnGap(settingState));
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
        <ViewTypeButton viewType={ViewType.SCROLL} />
        <ViewTypeButton viewType={ViewType.PAGE1} />
        <ViewTypeButton viewType={ViewType.PAGE12} />
        <button
          ref={fileOpenButtonRef}
          type="button"
          className="button title_bar_button"
          aria-label="Select File"
          onClick={onFileOpen}
        >
          Select file...
        </button>
        <input ref={fileInputRef} type="file" accept=".epub" onChange={onFileChanged} />
      </div>
    </div>
  );
};

export default Header;
