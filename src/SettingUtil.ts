import { getClientHeight, getClientWidth } from './util';
import { SettingState, ViewType } from './contexts';

export const isScroll = ({ viewType }: SettingState): boolean => viewType === ViewType.SCROLL;
export const isDoublePage = ({ viewType }: SettingState): boolean => viewType === ViewType.PAGE12 || viewType === ViewType.PAGE23;
export const columnsInPage = ({ viewType }: SettingState): number => ((viewType === ViewType.PAGE12 || viewType === ViewType.PAGE23) ? 2 : 1);
export const columnWidth = (setting: SettingState): number => {
  const columns = columnsInPage(setting);
  return (containerWidth(setting) - (columnGap(setting) * (columns - 1))) / columns;
};
export const columnGap = ({ columnGapInPercent }: SettingState): number => Math.ceil(getClientWidth() * (columnGapInPercent / 100));
export const contentPadding = ({ contentPaddingInPercent }: SettingState): number => {
  const clientWidth = getClientWidth();
  return Math.ceil(clientWidth * (contentPaddingInPercent / 100));
};
export const containerWidth = (setting: SettingState): number => {
  const clientWidth = getClientWidth();
  const containerWidth = clientWidth - (setting.containerHorizontalMargin * 2);
  return containerWidth - (contentPadding(setting) * 2);
};
export const containerHeight = ({ containerVerticalMargin }: SettingState): number => {
  const clientHeight = getClientHeight();
  return clientHeight - (containerVerticalMargin * 2);
};
