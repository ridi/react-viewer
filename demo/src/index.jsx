import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import {
  selectReaderCurrentOffset,
  selectReaderCalculationsTotal,
  EventBus,
  Events,
} from '@ridi/react-viewer';
import ViewerHeader from './components/headers/ViewerHeader';
import ViewerFooter from './components/footers/ViewerFooter';
import { IconsSprite } from './components/icons/IconsSprite';
import { onScreenTouched } from './redux/Viewer.action';
import { BindingType } from '../../src/constants/ContentConstants';
import ViewerBody from './components/body/ViewerBody';
import { Position } from './constants/ViewerConstants';
import AppService from './service/AppService';

class DemoViewer extends React.Component {
  constructor(props) {
    super(props);
    this.cache = null;
    this.onTouched = this.onTouched.bind(this);
  }

  onMoveWrongDirection() {
    alert('move to the wrong direction');
  }

  onTouched(position) {
    const {
      actionOnScreenTouched,
      contentMeta,
      currentOffset,
      calculationsTotal,
    } = this.props;
    if (position === Position.MIDDLE) {
      actionOnScreenTouched();
      return;
    }

    if (position === Position.RIGHT
      && contentMeta.bindingType === BindingType.RIGHT
      && currentOffset === 0) {
      this.onMoveWrongDirection();
      return;
    }

    let nextOffset = currentOffset;
    if (position === Position.LEFT) {
      nextOffset = contentMeta.bindingType === BindingType.LEFT ? currentOffset - 1 : currentOffset + 1;
    } else if (position === Position.RIGHT) {
      nextOffset = contentMeta.bindingType === BindingType.LEFT ? currentOffset + 1 : currentOffset - 1;
    }

    nextOffset = Math.max(0, Math.min(nextOffset, calculationsTotal - 1));
    if (currentOffset === nextOffset) return;
    EventBus.emit(Events.UPDATE_CURRENT_OFFSET, nextOffset);
  }

  render() {
    const {
      contentMeta,
    } = this.props;
    return (
      <section
        id="viewer_page"
        role="button"
        tabIndex="-1"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            this.onTouched(Position.MIDDLE);
          } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
            this.onTouched(Position.LEFT);
          } else if (e.key === 'ArrowRight' || e.key === 'Right') {
            this.onTouched(Position.RIGHT);
          }
        }}
      >
        <ViewerHeader contentMeta={contentMeta} />
        <ViewerBody contentMeta={contentMeta} onTouched={this.onTouched} />
        <ViewerFooter contentMeta={contentMeta} />
        <IconsSprite />
      </section>
    );
  }
}

DemoViewer.propTypes = {
  contentMeta: PropTypes.object.isRequired,
  currentOffset: PropTypes.number.isRequired,
  calculationsTotal: PropTypes.number.isRequired,
  actionOnScreenTouched: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isVisibleSettingPopup: state.viewer.ui.isVisibleSettingPopup,
  currentOffset: selectReaderCurrentOffset(state),
  calculationsTotal: selectReaderCalculationsTotal(state),
});

const mapDispatchToProps = dispatch => ({
  actionOnScreenTouched: () => dispatch(onScreenTouched()),
});

const DemoViewerPage = connect(mapStateToProps, mapDispatchToProps)(DemoViewer);

ReactDOM.render(
  <Provider store={AppService.store}>
    <DemoViewerPage contentMeta={AppService.contentMeta} />
  </Provider>,
  document.getElementById('app'),
);
