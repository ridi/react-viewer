import { ViewerUiActions } from './Viewer.action';
import path, { initialState, setAnnotation } from './Viewer.path';
import { ImmutableObjectBuilder } from '../../../src/util/ImmutabilityHelper';
import { updateObject } from '../../../src/util/Util';
import createReducer from '../../../src/util/Reducer';
import { scrollTop, scrollHeight, screenHeight } from '../utils/BrowserWrapper';

const isScrolledToTop = () => scrollTop() <= 100;
const isScrolledToBottom = () => scrollTop() >= scrollHeight() - screenHeight() - 100;

const isEdgeOfScreen = () => (isScrolledToTop() || isScrolledToBottom());

const onToggleViewerSetting = state => new ImmutableObjectBuilder(state)
  .set(path.isVisibleSettingPopup(), !state.ui.isVisibleSettingPopup)
  .build();

const viewerSettingChanged = (state, action) => new ImmutableObjectBuilder(state)
  .set(path.viewerSettings(), updateObject(state.ui.viewerSettings, action.changeSetting))
  .build();

const onScreenTouched = state => new ImmutableObjectBuilder(state)
  .set(path.isFullScreen(), !state.ui.isFullScreen)
  .set(path.isVisibleSettingPopup(), false)
  .build();

const onScreenScrolled = state => new ImmutableObjectBuilder(state)
  .set(path.isFullScreen(), !isEdgeOfScreen())
  .set(path.isVisibleSettingPopup(), false)
  .build();

const onAnnotationAdded = (state, { annotation }) => new ImmutableObjectBuilder(state)
  .set(path.annotations(), setAnnotation(state.annotations, annotation))
  .build();

const onAnnotationsSet = (state, { annotations }) => new ImmutableObjectBuilder(state)
  .set(path.annotations(), annotations)
  .build();

const onAnnotationUpdated = (state, { annotation }) => new ImmutableObjectBuilder(state)
  .set(path.annotations(), setAnnotation(state.annotations, annotation))
  .build();

const onAnnotationRemoved = (state, { annotation }) => new ImmutableObjectBuilder(state)
  .set(path.annotations(), setAnnotation(state.annotations, annotation, true))
  .build();

export default createReducer(initialState, {
  [ViewerUiActions.TOGGLE_VIEWER_SETTING]: onToggleViewerSetting,
  [ViewerUiActions.VIEWER_SETTING_CHANGED]: viewerSettingChanged,
  [ViewerUiActions.TOUCHED]: onScreenTouched,
  [ViewerUiActions.SCROLLED]: onScreenScrolled,
  [ViewerUiActions.ADD_ANNOTATION]: onAnnotationAdded,
  [ViewerUiActions.UPDATE_ANNOTATION]: onAnnotationUpdated,
  [ViewerUiActions.SET_ANNOTATIONS]: onAnnotationsSet,
  [ViewerUiActions.REMOVE_ANNOTATION]: onAnnotationRemoved,
});
