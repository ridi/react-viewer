import React from 'react';
import PropTypes from 'prop-types';
import { FOOTER_INDEX, PRE_CALCULATION } from '../../constants/CalculationsConstants';
import { screenWidth } from '../../util/BrowserWrapper';

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.wrapper = React.createRef();
  }

  componentDidMount() {
    this.onContentRendered();
  }

  componentDidUpdate() {
    this.onContentRendered();
  }

  onContentRendered() {
    const { onContentRendered } = this.props;
    onContentRendered(FOOTER_INDEX, this.wrapper.current);
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
  onContentRendered: () => {},
  StyledFooter: () => {},
  startOffset: 0,
};

Footer.propTypes = {
  content: PropTypes.node,
  onContentRendered: PropTypes.func,
  startOffset: PropTypes.number,
  containerVerticalMargin: PropTypes.number.isRequired,
  StyledFooter: PropTypes.func,
};
