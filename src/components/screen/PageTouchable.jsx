import React from 'react';
import { preventScrollEvent, removeScrollEvent } from '../../util/CommonUi';
import Connector from '../../util/connector/';
import BaseTouchable, { Position } from './BaseTouchable';

export { Position };

class PageTouchable extends BaseTouchable {
  componentDidMount() {
    this.handleScrollEvent();
  }

  componentDidUpdate() {
    this.handleScrollEvent();
  }

  handleScrollEvent() {
    const { forwardedRef } = this.props;
    if (Connector.current.isOnFooter()) removeScrollEvent(forwardedRef.current);
    else preventScrollEvent(forwardedRef.current);
  }

  renderContent() {
    const { children } = this.props;
    const isFooter = Connector.current.isOnFooter();
    return (
      <React.Fragment>
        {!isFooter && <button className="page_move_button left_button" onClick={e => this.onTouchScreenHandle(e, Position.LEFT)} />}
        {!isFooter && <button className="page_move_button right_button" onClick={e => this.onTouchScreenHandle(e, Position.RIGHT)} />}
        {children}
      </React.Fragment>
    );
  }
}

PageTouchable.defaultProps = {
  ...BaseTouchable.defaultProps,
};

PageTouchable.propTypes = {
  ...BaseTouchable.propTypes,
};

export default React.forwardRef((props, ref) => <PageTouchable {...props} forwardedRef={ref} />);
