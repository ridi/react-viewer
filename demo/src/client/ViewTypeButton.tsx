import * as React from 'react';
import { EpubSettingContext, ComicSettingContext, EpubService, ComicService, ViewType } from '@ridi/react-reader';

interface ViewTypeButtonProperty {
  viewType: ViewType,
}

export const EpubViewTypeButton: React.FunctionComponent<ViewTypeButtonProperty> = ({ viewType }) => {
  const settingState = React.useContext(EpubSettingContext);

  const getLabel = (viewType: ViewType): string => {
    if (viewType === ViewType.SCROLL) return '스크롤 보기';
    if (viewType === ViewType.PAGE1) return '1페이지 보기';
    if (viewType === ViewType.PAGE12) return '12페이지 보기';
    if (viewType === ViewType.PAGE23) return '23페이지 보기';
    return '보기 방식 없음';
  };

  return (
    <button
      type="button"
      onClick={() => EpubService.updateSetting({ viewType })}
      className={settingState.viewType === viewType ? 'active' : ''}
    >
      {getLabel(viewType)}
    </button>
  );
};

export const ComicViewTypeButton: React.FunctionComponent<ViewTypeButtonProperty> = ({ viewType }) => {
  const settingState = React.useContext(ComicSettingContext);

  const getLabel = (viewType: ViewType): string => {
    if (viewType === ViewType.SCROLL) return '스크롤 보기';
    if (viewType === ViewType.PAGE1) return '1페이지 보기';
    if (viewType === ViewType.PAGE12) return '12페이지 보기';
    if (viewType === ViewType.PAGE23) return '23페이지 보기';
    return '보기 방식 없음';
  };

  return (
    <button
      type="button"
      onClick={() => ComicService.updateSetting({ viewType })}
      className={settingState.viewType === viewType ? 'active' : ''}
    >
      {getLabel(viewType)}
    </button>
  );
};

