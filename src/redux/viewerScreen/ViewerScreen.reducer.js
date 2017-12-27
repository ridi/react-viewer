import path, { initialState } from './ViewerScreen.path';
import createReducer from '../../util/Reducer';
import { actions } from './ViewerScreen.action';
import { ImmutableObjectBuilder } from '../../util/ImmutabilityHelper';
import { cloneObject, updateObject } from '../../util/Util';
import { isScrolledToBottom, isScrolledToTop } from '../../util/CommonUi';
import { ContentFormat } from '../../constants/ContentConstants';

const initializeViewerScreen = (state, action) => {
  const { viewerScreenSettings } = action;
  return updateObject(cloneObject(initialState), { viewerScreenSettings });
};

const onScreenTouched = state => new ImmutableObjectBuilder(state)
  .set(path.isFullScreen(), !state.isFullScreen)
  .build();

const isEdgeOfScreen = () => (isScrolledToTop() || isScrolledToBottom());

const onScreenScrolled = state => new ImmutableObjectBuilder(state)
  .set(path.isFullScreen(), !isEdgeOfScreen())
  .build();

const calculatedPageViewer = (state, action) => new ImmutableObjectBuilder(state)
  .set(path.pageViewTotalPage(), action.page.totalPage)
  .build();

const movePageViewer = (state, action) => {
  if (action.number > 0) {
    return new ImmutableObjectBuilder(state)
      .set(path.pageViewCurrentPage(), action.number)
      .build();
  }
  return state;
};

const viewerScreenSettingChanged = (state, action) => new ImmutableObjectBuilder(state)
  .set(path.viewerScreenSettings(), updateObject(state.viewerScreenSettings, action.changedSetting))
  .build();

const updateMetaData = (state, action) => new ImmutableObjectBuilder(state)
  .set(path.contentType(), action.contentType)
  .set(path.viewerType(), action.viewerType)
  .set(path.bindingType(), action.bindingType)
  .build();

const renderSpine = (state, action) => new ImmutableObjectBuilder(state)
  .set(path.spine(action.index), action.spine)
  .set(path.contentFormat(), ContentFormat.EPUB)
  .set(path.isLoadingCompleted(), true)
  .build();

const renderImages = (state, action) => new ImmutableObjectBuilder(state)
  .set(path.images(), action.images)
  .set(path.contentFormat(), ContentFormat.IMAGE)
  .set(path.isLoadingCompleted(), true)
  .build();

const changedReadPosition = (state, action) => new ImmutableObjectBuilder(state)
  .set(path.readPosition(), action.position)
  .build();

export default createReducer(initialState, {
  [actions.INITIALIZE_VIEWER_SCREEN]: initializeViewerScreen,
  [actions.TOUCH_VIEWER_SCREEN]: onScreenTouched,
  [actions.SCROLLED_VIEWER_SCREEN]: onScreenScrolled,
  [actions.CALCULATED_PAGE_VIEWER]: calculatedPageViewer,
  [actions.CHANGED_READ_POSITION]: changedReadPosition,
  [actions.MOVE_PAGE_VIEWER]: movePageViewer,
  [actions.VIEWER_SCREEN_SETTING_CHANGED]: viewerScreenSettingChanged,
  [actions.UPDATE_META_DATA]: updateMetaData,
  [actions.RENDER_SPINE]: renderSpine,
  [actions.RENDER_IMAGES]: renderImages,
});
