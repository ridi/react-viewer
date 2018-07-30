import styled from 'styled-components';
import Connector from '../../util/connector/';
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
  
  .page_move_button {
    position: fixed;
    top: 0;
    display: block;
    height: 100%;
    width: ${() => Connector.setting.getSideTouchWidth(true)};
    cursor: default;
    background: transparent;
    border: 0;
    z-index: 1;
    
    &.left_button {
      left: 0;
    }
    &.right_button {
      right: 0;
    }
  }
`;

export const StyledHtmlScrollTouchable = StyledScrollTouchable.extend`
   min-height: calc(100vh + 100px);
   height: ${({ total }) => `${total}px`};
`;
export const StyledImageScrollTouchable = StyledScrollTouchable.extend``;
export const StyledHtmlPageTouchable = StyledPageTouchable.extend``;
export const StyledImagePageTouchable = StyledPageTouchable.extend``;
