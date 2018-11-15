import styled from 'styled-components';
import Connector from '../../service/connector';
import PropTypes from '../prop-types';
import { ViewType } from '../../constants/SettingConstants';
import { SELECTION_LAYER_EXPANDED_WIDTH } from '../../constants/StyledConstants';

const getTop = viewType => (
  viewType === ViewType.SCROLL
    ? `${(Connector.setting.getScrollingContentGap() / 2) - SELECTION_LAYER_EXPANDED_WIDTH}px`
    : `-${SELECTION_LAYER_EXPANDED_WIDTH}px`
);
const getLeft = () => `-${SELECTION_LAYER_EXPANDED_WIDTH}px`;
const getWidth = (viewType, contentIndex) => (
  viewType === ViewType.SCROLL
    ? `calc(100% + ${SELECTION_LAYER_EXPANDED_WIDTH * 2}px)`
    : `calc(${Connector.setting.getContentWidth(contentIndex, true)} + ${(SELECTION_LAYER_EXPANDED_WIDTH * 2)}px)`
);
const getHeight = () => `calc(100% + ${SELECTION_LAYER_EXPANDED_WIDTH * 2}px)`;

const StyledSelectionLayer = styled.svg`
  position: absolute;
  top: ${({ viewType }) => getTop(viewType)};
  left: ${() => getLeft()};
  width: ${({ viewType, contentIndex }) => getWidth(viewType, contentIndex)};
  height: ${() => getHeight()};
`;

StyledSelectionLayer.propTypes = {
  contentIndex: PropTypes.number,
  viewType: PropTypes.string,
};

export default StyledSelectionLayer;
