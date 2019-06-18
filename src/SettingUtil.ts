import { getClientHeight, getClientWidth } from './util';
import { SettingState, ViewType } from './contexts';

export const isScroll = ({ viewType }: SettingState): boolean => viewType === ViewType.SCROLL;
export const isDoublePage = ({ viewType }: SettingState): boolean => viewType === ViewType.PAGE12 || viewType === ViewType.PAGE23;
export const columnsInPage = ({ viewType }: SettingState): number => ((viewType === ViewType.PAGE12 || viewType === ViewType.PAGE23) ? 2 : 1);
// 페이징 방식일 경우 페이징에 사용하는 offsetLeft 값이 항상 정수만 리턴하므로 발생하는 문제가 있다.
// 그래서 항상 columnWidth가 정수를 리턴하도록 하려면 containerWidth와 columnGap 계산 결과가 짝수여야 한다.
// columnWidth: 반드시 정수가 되려면 = (containerWidth: even number - (columnGap: even number * (columns - 1))) / columns;
export const columnWidth = (setting: SettingState): number => {
  const columns = columnsInPage(setting);
  return (containerWidth(setting) - (columnGap(setting) * (columns - 1))) / columns;
};
export const columnGap = ({ columnGapInPercent }: SettingState): number => {
  const result = Math.ceil(getClientWidth() * (columnGapInPercent / 100));
  return result % 2 === 1 ? result + 1 : result;
};
export const contentPadding = ({ contentPaddingInPercent }: SettingState): number => {
  const clientWidth = getClientWidth();
  return Math.ceil(clientWidth * (contentPaddingInPercent / 100));
};
export const containerWidth = (setting: SettingState): number => {
  const clientWidth = getClientWidth();
  const containerWidth = clientWidth - (setting.containerHorizontalMargin * 2);
  const result = containerWidth - (contentPadding(setting) * 2);
  return result % 2 === 1 ? result + 1 : result;
};
export const containerHeight = ({ containerVerticalMargin }: SettingState): number => {
  const clientHeight = getClientHeight();
  return clientHeight - (containerVerticalMargin * 2);
};
