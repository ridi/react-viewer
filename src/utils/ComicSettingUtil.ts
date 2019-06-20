import { ComicCalculationState, ComicSettingState } from '../contexts';
import { getClientWidth } from './Util';
import { BindingType, ViewType } from '../constants';

export const isScroll = ({ viewType }: ComicSettingState): boolean => viewType === ViewType.SCROLL;
export const isDoublePage = ({ viewType }: ComicSettingState): boolean => viewType === ViewType.PAGE12 || viewType === ViewType.PAGE23;
export const columnsInPage = ({ viewType }: ComicSettingState): number => ((viewType === ViewType.PAGE12 || viewType === ViewType.PAGE23) ? 2 : 1);
export const contentWidth = (setting: ComicSettingState): number => {
  const clientWidth = getClientWidth();
  if (isScroll(setting)) {
    return Math.ceil(clientWidth * (setting.contentWidthInPercent / 100));
  }
  return clientWidth / columnsInPage(setting);
};
export const ratio = (width?: number, height?: number): number => {
  return (height && width) ? height / width : 1.4;
};
export const containerWidth = (setting: ComicSettingState, calculation: ComicCalculationState): number => {
  const widthPerContent = contentWidth(setting);
  let totalPage = calculation.totalPage + (setting.viewType === ViewType.PAGE23 ? 1 : 0);
  if (isDoublePage(setting) && totalPage % 2 === 1) totalPage += 1;
  return widthPerContent * totalPage;
};

// BindingType.LEFT && ViewType.PAGE12 => [1(page# on screen), 2] [3, 4] ...
// BindingType.RIGHT && ViewTYpe.PAGE12 => [2, 1(page# on screen)] [4, 3] ...
// BindingType.RIGHT && ViewTYpe.PAGE23 => [1, 0(page# on screen)] [3, 2] ...
// BindingType.LEFT && ViewType.PAGE23 => [0(page# on screen), 1] [2, 3] ...
export const allowedPageNumber = (setting: ComicSettingState, calculation: ComicCalculationState, page: number) => {
  let allowedPage = page;

  const isAllowedZeroPage = setting.viewType === ViewType.PAGE23;
  const allowedPageRange = [isAllowedZeroPage ? 0 : 1, calculation.totalPage];
  if (isDoublePage(setting)) {
    const isOnlyAllowedEvenPage = setting.viewType === ViewType.PAGE23;
    const isOnlyAllowedOddPage = setting.viewType === ViewType.PAGE12;

    const isEven = allowedPage % 2 === 0;
    if (isEven && !isOnlyAllowedEvenPage) allowedPage -= 1;
    if (!isEven && !isOnlyAllowedOddPage) allowedPage -= 1;
  }
  return Math.max(Math.min(allowedPage, allowedPageRange[1]), allowedPageRange[0]);
};

export const objectPosition = (setting: ComicSettingState, imageIndex: number) => {
  if (isScroll(setting) || !isDoublePage(setting)) {
    return '50% 50%';
  }
  // BindingType.LEFT && ViewType.PAGE12 => [imageIndex: 0, 1] [2, 3] even => right, odd => left
  // BindingType.RIGHT && ViewTYpe.PAGE23 => [0, -1] [2, 1] even => right, odd => left
  // BindingType.LEFT && ViewType.PAGE23 => [-1, 0] [1, 2] even => left, odd => right
  // BindingType.RIGHT && ViewTYpe.PAGE12 => [1, 0] [3, 2] even => left, odd => right
  if ((setting.bindingType === BindingType.LEFT && setting.viewType === ViewType.PAGE12)
    || (setting.bindingType === BindingType.RIGHT && setting.viewType === ViewType.PAGE23)) {
    return (imageIndex % 2 === 0) ? 'right 50%' : 'left 50%';
  } else {
    return (imageIndex % 2 === 0) ? 'left 50%' : 'right 50%';
  }
};
export const startWithBlankPage = ({ viewType }: ComicSettingState): boolean => viewType === ViewType.PAGE23;
