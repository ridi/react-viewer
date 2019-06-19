import { ComicSettingState } from '../contexts/index';
import { ViewType } from '../constants/index';
import { getClientWidth } from './Util';

export const isScroll = ({ viewType }: ComicSettingState): boolean => viewType === ViewType.SCROLL;
export const isDoublePage = ({ viewType }: ComicSettingState): boolean => viewType === ViewType.PAGE12 || viewType === ViewType.PAGE23;
export const columnsInPage = ({ viewType }: ComicSettingState): number => ((viewType === ViewType.PAGE12 || viewType === ViewType.PAGE23) ? 2 : 1);
export const contentWidth = ({ contentWidthInPercent }: ComicSettingState): number => {
  const clientWidth = getClientWidth();
  return Math.ceil(clientWidth * (contentWidthInPercent / 100));
};
