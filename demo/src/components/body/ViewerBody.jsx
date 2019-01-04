import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Reader, {
  ContentFormat,
  EventBus,
  Events,
  load,
  ReaderJsHelper,
  SelectionMode,
  selectReaderIsReadyToRead,
  selectReaderSetting,
  unload,
  ViewType,
} from '@ridi/react-viewer';
import { selectAnnotations, selectContextMenu } from '../../redux/Viewer.selector';
import ViewerScreenFooter from '../footers/ViewerScreenFooter';
import {
  addAnnotation,
  onScreenScrolled,
  removeAnnotation,
  setContextMenu,
  updateAnnotation,
} from '../../redux/Viewer.action';
import { screenWidth } from '../../utils/BrowserWrapper';
import { Position } from '../../constants/ViewerConstants';
import SelectionContextMenu from '../selection/SelectionContextMenu';

class ViewerBody extends React.Component {
  constructor(props) {
    super(props);
    this.onContentMenuItemClicked = this.onContentMenuItemClicked.bind(this);
    this.footer = <ViewerScreenFooter contentMeta={props.contentMeta} />;
    this.contentFooter = <small>content footer area...</small>;
  }

  componentDidMount() {
    EventBus.on(Events.SCROLL, this.onReaderScrolled.bind(this), this);
    EventBus.on(Events.TOUCH, this.onReaderTouched.bind(this), this);
    EventBus.on(Events.TOUCH_ANNOTATION, this.onReaderAnnotationTouched.bind(this), this);
    EventBus.on(Events.CHANGE_SELECTION, this.onReaderSelectionChanged.bind(this), this);
    if (this.props.contentMeta.contentFormat === ContentFormat.HTML) {
      EventBus.emit(Events.SET_ANNOTATIONS, this.props.annotations);
    }
  }

  componentDidUpdate(prevProps) {
    const { isReadyToRead, actionSetContextMenu, annotations } = this.props;
    if (prevProps.isReadyToRead && !isReadyToRead) {
      actionSetContextMenu(false);
    }
    if (this.props.contentMeta.contentFormat === ContentFormat.HTML) {
      if (annotations !== prevProps.annotations) {
        EventBus.emit(Events.SET_ANNOTATIONS, annotations);
      }
    }
  }

  componentWillUnmount() {
    EventBus.offByTarget(this);
  }

  onReaderScrolled() {
    const { actionOnScreenScrolled } = this.props;
    actionOnScreenScrolled();
  }

  onReaderTouched(event) {
    try {
      const link = ReaderJsHelper.getCurrent().content.getLinkFromElement(event.detail.target);
      if (link) {
        // TODO go to...
        return;
      }
    } catch (e) {
      // ignore...
    }
    const { setting, onTouched } = this.props;

    const width = screenWidth();
    let position = Position.MIDDLE;
    if (setting.viewType === ViewType.PAGE) {
      if (event.detail.clientX <= width * 0.2) position = Position.LEFT;
      if (event.detail.clientX >= width * 0.8) position = Position.RIGHT;
    }
    onTouched(position);
  }

  onContentMenuItemClicked(targetSelection) {
    const {
      actionAddAnnotation,
      actionSetAnnotation,
      actionRemoveAnnotation,
      actionSetContextMenu,
    } = this.props;
    const {
      id,
      color,
      withHandle,
      rects,
      ...others
    } = targetSelection;
    const updateSelection = {
      id,
      ...others,
      color,
    };
    if (!id) {
      actionAddAnnotation(updateSelection);
    } else if (!color) {
      actionRemoveAnnotation(updateSelection);
    } else if (color) {
      actionSetAnnotation(updateSelection);
    }
    EventBus.emit(Events.END_SELECTION);
    actionSetContextMenu(false);
  }

  onReaderAnnotationTouched(annotation) {
    const { actionSetContextMenu } = this.props;
    actionSetContextMenu(true, annotation);
  }

  onReaderSelectionChanged({ selection, selectionMode }) {
    const {
      actionAddAnnotation,
      actionSetContextMenu,
    } = this.props;

    if (selectionMode === SelectionMode.USER_SELECTION) {
      return actionSetContextMenu(true, selection);
    }
    if (selectionMode === SelectionMode.AUTO_HIGHLIGHT) {
      const {
        withHandle,
        rects,
        ...others
      } = selection;
      actionAddAnnotation(others);
      EventBus.emit(Events.END_SELECTION);
      return actionSetContextMenu(false);
    }
    return actionSetContextMenu(false);
  }

  renderPageButtons() {
    const { setting } = this.props;
    if (setting.viewType === ViewType.SCROLL) return null;
    return (
      <>
        <button type="button" className="left_button" />
        <button type="button" className="right_button" />
      </>
    );
  }

  renderContextMenu() {
    const { isVisible, target } = this.props.contextMenu;
    if (!isVisible) return null;

    const lastRect = target.rects.length > 0 ? target.rects[target.rects.length - 1] : null;
    return (
      <SelectionContextMenu
        top={lastRect.top + lastRect.height}
        left={lastRect.left + lastRect.width}
        targetItem={target}
        onClickItem={this.onContentMenuItemClicked}
      />
    );
  }

  renderReader() {
    const { annotations, contentMeta } = this.props;
    return (
      <Reader
        footer={this.footer}
        contentFooter={this.contentFooter}
        onMount={this.onReaderLoaded}
        onUnmount={this.onReaderUnloaded}
        selectable={contentMeta.contentFormat === ContentFormat.HTML}
        annotationable={contentMeta.contentFormat === ContentFormat.HTML}
        annotations={annotations}
      />
    );
  }

  render() {
    return (
      <>
        { this.renderReader() }
        { this.renderContextMenu() }
      </>
    );
  }
}

ViewerBody.propTypes = {
  contentMeta: PropTypes.object.isRequired,
  onTouched: PropTypes.func.isRequired,
  setting: PropTypes.object.isRequired,
  annotations: PropTypes.array.isRequired,
  actionAddAnnotation: PropTypes.func.isRequired,
  actionSetAnnotation: PropTypes.func.isRequired,
  actionRemoveAnnotation: PropTypes.func.isRequired,
  contextMenu: PropTypes.object.isRequired,
  actionSetContextMenu: PropTypes.func.isRequired,
  isReadyToRead: PropTypes.bool.isRequired,
  actionOnScreenScrolled: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isVisibleSettingPopup: state.viewer.ui.isVisibleSettingPopup,
  setting: selectReaderSetting(state),
  annotations: selectAnnotations(state),
  contextMenu: selectContextMenu(state),
  isReadyToRead: selectReaderIsReadyToRead(state),
});

const mapDispatchToProps = dispatch => ({
  actionLoad: state => dispatch(load(state)),
  actionUnload: () => dispatch(unload()),
  actionAddAnnotation: annotation => dispatch(addAnnotation(annotation)),
  actionSetAnnotation: annotation => dispatch(updateAnnotation(annotation)),
  actionRemoveAnnotation: annotation => dispatch(removeAnnotation(annotation)),
  actionSetContextMenu: (isVisible, target) => dispatch(setContextMenu(isVisible, target)),
  actionOnScreenScrolled: () => dispatch(onScreenScrolled()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewerBody);
