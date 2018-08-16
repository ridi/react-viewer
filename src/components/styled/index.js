import { ContentFormat } from '../../constants/ContentConstants';
import { ViewType } from '../../constants/SettingConstants';
import {
  StyledHtmlPageTouchable,
  StyledHtmlScrollTouchable,
  StyledImagePageTouchable,
  StyledImageScrollTouchable,
} from './StyledTouchable';
import {
  StyledHtmlPageContent,
  StyledHtmlScrollContent,
  StyledImagePageContent,
  StyledImageScrollContent,
} from './StyledContent';
import { StyledPageFooter, StyledScrollFooter } from './StyledFooter';

export const getStyledTouchable = (contentFormat, viewType) => {
  if (contentFormat === ContentFormat.HTML && viewType === ViewType.SCROLL) return StyledHtmlScrollTouchable;
  if (contentFormat === ContentFormat.HTML && viewType === ViewType.PAGE) return StyledHtmlPageTouchable;
  if (contentFormat === ContentFormat.IMAGE && viewType === ViewType.SCROLL) return StyledImageScrollTouchable;
  if (contentFormat === ContentFormat.IMAGE && viewType === ViewType.PAGE) return StyledImagePageTouchable;
  return null;
};

export const getStyledContent = (contentFormat, viewType) => {
  if (contentFormat === ContentFormat.HTML && viewType === ViewType.SCROLL) return StyledHtmlScrollContent;
  if (contentFormat === ContentFormat.HTML && viewType === ViewType.PAGE) return StyledHtmlPageContent;
  if (contentFormat === ContentFormat.IMAGE && viewType === ViewType.SCROLL) return StyledImageScrollContent;
  if (contentFormat === ContentFormat.IMAGE && viewType === ViewType.PAGE) return StyledImagePageContent;
  return null;
};

export const getStyledFooter = (contentFormat, viewType) => {
  if (viewType === ViewType.SCROLL) return StyledScrollFooter;
  if (viewType === ViewType.PAGE) return StyledPageFooter;
  return null;
};

export default {
  getStyledTouchable,
  getStyledContent,
  getStyledFooter,
};
