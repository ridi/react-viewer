import styled from 'styled-components';
import Connector from '../../util/connector';
import { screenHeight } from '../../util/BrowserWrapper';

const StyledBaseTouchable = styled.div`
  box-sizing: border-box;
`;

const StyledScrollTouchable = StyledBaseTouchable.extend``;
const StyledPageTouchable = StyledBaseTouchable.extend`
  overflow: hidden;
  white-space: nowrap;
  font-size: 0px;
  letter-spacing: 0;
  word-spacing: 0;
  height: ${() => `${screenHeight()}px`}
`;

export const StyledHtmlScrollTouchable = StyledScrollTouchable.extend`
   min-height: calc(100vh + 100px);
   height: ${({ total }) => `${total + (Connector.setting.getContainerVerticalMargin() * 2)}px`};
`;
export const StyledImageScrollTouchable = StyledScrollTouchable.extend``;
export const StyledHtmlPageTouchable = StyledPageTouchable.extend``;
export const StyledImagePageTouchable = StyledPageTouchable.extend``;
