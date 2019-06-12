import {getClientHeight, getClientWidth} from "./util";
import {SettingState, ViewType} from "./contexts";

export const isScroll = ({ viewType }: SettingState): boolean => viewType === ViewType.SCROLL;
export const columnsInPage = ({ viewType }: SettingState): number => ((viewType === ViewType.PAGE12 || viewType === ViewType.PAGE23) ? 2 : 1);
export const columnGap = ({ columnGapInPercent }: SettingState): number => Math.ceil(getClientWidth() * (columnGapInPercent / 100));
export const containerWidth = ({ containerHorizontalMargin, contentPaddingInPercent }: SettingState): number => {
  const clientWidth = getClientWidth();
  const containerWidth = clientWidth - (containerHorizontalMargin * 2);
  const extendedMargin = Math.ceil(clientWidth * (contentPaddingInPercent / 100));
  return containerWidth - (extendedMargin * 2);
};
export const containerHeight = ({ containerVerticalMargin }: SettingState): number => {
  const clientHeight = getClientHeight();
  return clientHeight - (containerVerticalMargin * 2);
};
