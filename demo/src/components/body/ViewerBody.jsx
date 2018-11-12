import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Reader, {
  Connector,
  selectReaderCurrentContentIndex,
  selectReaderSetting,
  ViewType,
  load,
  unload,
  SelectionMode,
  ContentHelper,
} from '@ridi/react-viewer';
import { selectAnnotations } from '../../redux/Viewer.selector';
import ViewerScreenFooter from '../footers/ViewerScreenFooter';
import {
  requestLoadContent,
  addAnnotation,
  setAnnotations,
  updateAnnotation, removeAnnotation,
} from '../../redux/Viewer.action';
import { screenWidth } from '../../utils/BrowserWrapper';
import Cache from '../../utils/Cache';
import { Position } from '../../constants/ViewerConstants';
import SelectionContextMenu from '../selection/SelectionContextMenu';

// todo redux!
const initialState = {
  selection: null,
  contextMenuPosition: null,
  showContextMenu: false,
};

class ViewerBody extends React.Component {
  constructor(props) {
    super(props);
    this.readerCache = new Cache(props.contentMeta.id);
    this.annotationCache = new Cache(props.contentMeta.id, id => `${id}`);

    this.onReaderTouched = this.onReaderTouched.bind(this);
    this.onReaderLoaded = this.onReaderLoaded.bind(this);
    this.onReaderUnloaded = this.onReaderUnloaded.bind(this);
    this.onContentMenuItemClicked = this.onContentMenuItemClicked.bind(this);
    this.onReaderSelectionChanged = this.onReaderSelectionChanged.bind(this);
    this.onReaderAnnotationTouched = this.onReaderAnnotationTouched.bind(this);

    this.footer = <ViewerScreenFooter contentMeta={props.contentMeta} />;
    this.contentFooter = <small>content footer area...</small>;

    this.state = initialState;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.setting.viewType !== this.props.setting.viewType) {
      // selection 초기화 & annotation rects 계산
      this.setState(initialState);
    }
  }

  onReaderLoaded() {
    const {
      contentMeta,
      actionLoad,
      actionRequestLoadContent,
      actionSetAnnotations,
    } = this.props;
    this.readerCache = new Cache(contentMeta.id);
    const readerState = this.readerCache.get();
    if (readerState) {
      actionLoad(readerState);
    } else {
      actionRequestLoadContent(contentMeta);
    }
    const annotationsState = this.annotationCache.get();
    if (annotationsState) {
      actionSetAnnotations(annotationsState);
    }
  }

  onReaderUnloaded() {
    const {
      actionUnload,
      annotations,
    } = this.props;
    if (!Connector.core.isReaderLoaded() || !Connector.core.isReaderAllCalculated()) return;
    const currentState = Connector.core.getReaderState();
    this.readerCache.set(currentState);

    this.annotationCache.set(annotations.map(({ rects, ...others }) => others));

    actionUnload();
  }

  onReaderTouched(event) {
    this.setState(initialState);
    const link = ContentHelper.getLinkFromElement(event.target);
    if (link) {
      // TODO go to...
      return;
    }
    const { setting, onTouched } = this.props;

    const width = screenWidth();
    let position = Position.MIDDLE;
    if (setting.viewType === ViewType.PAGE) {
      if (event.clientX <= width * 0.2) position = Position.LEFT;
      if (event.clientX >= width * 0.8) position = Position.RIGHT;
    }
    onTouched(position);
  }

  onContentMenuItemClicked({ style }) {
    const {
      currentContentIndex,
      actionAddAnnotation,
      actionSetAnnotation,
      actionRemoveAnnotation,
    } = this.props;
    const {
      id,
      serializedRange,
      text,
      rects,
    } = this.state.selection;
    if (style === null) {
      actionRemoveAnnotation({
        id,
        serializedRange,
        text,
        rects,
        contentIndex: currentContentIndex,
        style,
      });
    } else if (id) {
      actionSetAnnotation({
        id,
        serializedRange,
        text,
        rects,
        contentIndex: currentContentIndex,
        style,
      });
    } else {
      actionAddAnnotation({
        serializedRange,
        text,
        rects,
        contentIndex: currentContentIndex,
        style,
      });
    }
    Connector.selection.endSelection();
    this.setState(initialState);
  }

  onReaderAnnotationTouched(annotation) {
    const lastRect = annotation.rects.length > 0 ? annotation.rects[annotation.rects.length - 1] : null;
    console.log('onReaderAnnotationTouched', annotation);
    this.setState({
      selection: annotation,
      showContextMenu: true,
      contextMenuPosition: {
        x: lastRect.left + lastRect.width,
        y: lastRect.top + lastRect.height,
      },
    });
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
    const {
      contextMenuPosition,
      showContextMenu,
    } = this.state;
    if (!showContextMenu) return null;
    return (
      <SelectionContextMenu
        position={contextMenuPosition}
        onClickItem={this.onContentMenuItemClicked}
      />
    );
  }

  onReaderSelectionChanged({ selection, selectionMode }) {
    const lastRect = selection.rects.length > 0 ? selection.rects[selection.rects.length - 1] : null;
    console.log('ViewerBody.onReaderSelectionChanged', selection, selectionMode);
    switch (selectionMode) {
      case SelectionMode.NORMAL:
        this.setState({
          selection,
          showContextMenu: false,
          contextMenuPosition: null,
        });
        break;
      case SelectionMode.USER_SELECTION:
        this.setState({
          selection,
          showContextMenu: true,
          contextMenuPosition: {
            x: lastRect.left + lastRect.width + Connector.setting.getContainerHorizontalMargin(),
            y: lastRect.top + lastRect.height + Connector.setting.getContainerHorizontalMargin(),
          },
        });
        break;
      case SelectionMode.AUTO_HIGHLIGHT:
        const { currentContentIndex, actionAddAnnotation } = this.props;
        actionAddAnnotation({ ...selection, contentIndex: currentContentIndex });
        Connector.selection.endSelection();
        this.setState(initialState);
        break;
      default: break;
    }
  }

  render() {
    const { onScrolled, annotations } = this.props;
    return (
      <>
        <Reader
          footer={this.footer}
          contentFooter={this.contentFooter}
          onMount={this.onReaderLoaded}
          onUnmount={this.onReaderUnloaded}
          onTouched={this.onReaderTouched}
          onScrolled={onScrolled}
          selectable
          annotationable
          annotations={annotations}
          onSelectionChanged={this.onReaderSelectionChanged}
          onAnnotationTouched={this.onReaderAnnotationTouched}
        />
        { this.renderContextMenu() }
      </>
    );
  }
}

ViewerBody.propTypes = {
  contentMeta: PropTypes.object.isRequired,
  onTouched: PropTypes.func.isRequired,
  onScrolled: PropTypes.func.isRequired,
  currentContentIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  actionRequestLoadContent: PropTypes.func.isRequired,
  setting: PropTypes.object.isRequired,
  actionLoad: PropTypes.func.isRequired,
  actionUnload: PropTypes.func.isRequired,
  annotations: PropTypes.array.isRequired,
  actionAddAnnotation: PropTypes.func.isRequired,
  actionSetAnnotations: PropTypes.func.isRequired,
  actionSetAnnotation: PropTypes.func.isRequired,
  actionRemoveAnnotation: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isVisibleSettingPopup: state.viewer.ui.isVisibleSettingPopup,
  currentContentIndex: selectReaderCurrentContentIndex(state),
  setting: selectReaderSetting(state),
  annotations: selectAnnotations(state),
});

const mapDispatchToProps = dispatch => ({
  actionRequestLoadContent: contentMeta => dispatch(requestLoadContent(contentMeta)),
  actionLoad: state => dispatch(load(state)),
  actionUnload: () => dispatch(unload()),
  actionAddAnnotation: annotation => dispatch(addAnnotation(annotation)),
  actionSetAnnotations: annotations => dispatch(setAnnotations(annotations)),
  actionSetAnnotation: annotation => dispatch(updateAnnotation(annotation)),
  actionRemoveAnnotation: annotation => dispatch(removeAnnotation(annotation)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewerBody);
