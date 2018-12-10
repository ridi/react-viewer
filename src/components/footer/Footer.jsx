import React from 'react';
import PropTypes from 'prop-types';
import { FOOTER_INDEX, PRE_CALCULATION } from '../../constants/CalculationsConstants';
import { screenWidth } from '../../util/BrowserWrapper';
import EventBus, { Events } from '../../event';

export default class Footer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.wrapper = React.createRef();
  }

  componentDidMount() {
    const { isCalculated } = this.props;
    if (!isCalculated) {
      EventBus.emit(Events.CALCULATE_CONTENT, { index: FOOTER_INDEX, contentNode: this.wrapper.current });
    }
  }

  componentDidUpdate() {
    const { isCalculated } = this.props;
    if (!isCalculated) {
      EventBus.emit(Events.CALCULATE_CONTENT, { index: FOOTER_INDEX, contentNode: this.wrapper.current });
    }
  }

  render() {
    const {
      content,
      containerVerticalMargin,
      startOffset,
      StyledFooter,
    } = this.props;
    return (
      <StyledFooter
        innerRef={this.wrapper}
        containerVerticalMargin={containerVerticalMargin}
        visible={startOffset !== PRE_CALCULATION}
        startOffset={startOffset}
        width={`${screenWidth()}px`}
      >
        {content}
      </StyledFooter>
    );
  }
}

Footer.defaultProps = {
  content: null,
  StyledFooter: () => {},
  startOffset: 0,
};

Footer.propTypes = {
  content: PropTypes.node,
  startOffset: PropTypes.number,
  containerVerticalMargin: PropTypes.number.isRequired,
  StyledFooter: PropTypes.func,
  isCalculated: PropTypes.bool.isRequired,
};
