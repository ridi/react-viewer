import styled from 'styled-components';
import Connector from '../../service/connector';
import { screenHeight } from '../../util/BrowserWrapper';

const StyledBaseTouchable = styled.div`
  box-sizing: border-box;
`;

const StyledScrollTouchable = StyledBaseTouchable.extend``;
const StyledPageTouchable = StyledBaseTouchable.extend`
  overflow: hidden;
  height: ${() => `${screenHeight()}px`}
`;

export const StyledHtmlScrollTouchable = StyledScrollTouchable.extend`
   position: relative;
   overflow: hidden;
   min-height: calc(100vh + 100px);
   height: ${({ total }) => `${total + (Connector.setting.getContainerVerticalMargin() * 2)}px`};
`;
export const StyledImageScrollTouchable = StyledScrollTouchable.extend``;
export const StyledHtmlPageTouchable = StyledPageTouchable.extend``;
export const StyledImagePageTouchable = StyledPageTouchable.extend`
  white-space: nowrap;
  font-size: 0px;
  letter-spacing: 0;
  word-spacing: 0;
`;
