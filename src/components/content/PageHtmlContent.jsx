/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import BaseHtmlContent from './BaseHtmlContent';
import Connector from '../../service/connector';
import EventBus, { Events } from '../../event';
import { waitThenRun } from '../../util/BrowserWrapper';

class PageHtmlContent extends BaseHtmlContent {
  constructor(props) {
    super(props);
    this.moveToOffset = this.moveToOffset.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();
    EventBus.on(Events.core.MOVE_TO_OFFSET, this.moveToOffset, this);
  }

  componentWillUnmount() {
    EventBus.offByTarget(this);
  }

  moveToOffset() {
    const { localOffset } = this.props;
    if (this.contentWrapperRef.current && localOffset >= 0) {
      waitThenRun(() => {
        this.contentWrapperRef.current.scrollLeft = localOffset
          * (Connector.setting.getContainerWidth() + Connector.setting.getColumnGap());
        waitThenRun(() => EventBus.emit(Events.core.MOVED), 0);
      }, 0);
    }
  }
}

PageHtmlContent.defaultProps = {
  ...BaseHtmlContent.defaultProps,
};

PageHtmlContent.propTypes = {
  ...BaseHtmlContent.propTypes,
};

export default PageHtmlContent;
