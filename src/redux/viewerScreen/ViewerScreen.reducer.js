import path, { initialState } from './ViewerScreen.path';
import createReducer from '../../util/Reducer';
import { actions } from './ViewerScreen.action';
import ReducerBuilder from '../../util/ReducerBuilder';
import { cloneObject, nullSafeGet, updateObject } from '../../util/Util';
import { isScrolledToTop, isScrolledToBottom } from '../../util/CommonUi';


const initializeViewerScreen = (state, action) => {
  const { viewerScreenSettings } = action;
  return updateObject(cloneObject(initialState), { viewerScreenSettings });
};

const onScreenTouched = state => new ReducerBuilder(state)
  .set(path.isFullScreen(), !state.isFullScreen)
  .build();

const isEdgeOfScreen = () => (isScrolledToTop() || isScrolledToBottom());

const onScreenScrolled = state => new ReducerBuilder(state)
  .set(path.isFullScreen(), !isEdgeOfScreen())
  .build();

const calculatedPageViewer = (state, action) => new ReducerBuilder(state)
  .set(path.pageViewPagination(), action.page)
  .build();

const movePageViewer = (state, action) => {
  const totalPage = nullSafeGet(state, path.pageViewTotalPage(), 1);

  return new ReducerBuilder(state)
    .set(path.isEndingScreen(), false)
    .set(path.isFullScreen(), true)
    .set(path.pageViewCurrentPage(), action.number)
    .set(path.pageViewReadProcess(), action.number / totalPage)
    .build();
};

const showEndingScreen = state => new ReducerBuilder(state)
  .set(path.isEndingScreen(), true)
  .set(path.isFullScreen(), false)
  .build();

const viewerScreenSettingChanged = (state, action) => new ReducerBuilder(state)
  .set(path.viewerScreenSettings(), updateObject(state.viewerScreenSettings, action.changedSetting))
  .build();

const updateSpineMetaData = (state, action) => new ReducerBuilder(state)
  .set(path.contentType(), action.contentType)
  .set(path.viewerType(), action.viewerType)
  .set(path.bindingType(), action.bindingType)
  .build();

const renderSpine = (state, action) => new ReducerBuilder(state)
  .set(path.spine(action.index), action.spine)
  .set(path.isLoadingCompleted(), true)
  .build();

const changedReadPosition = (state, action) => new ReducerBuilder(state)
  .set(path.readPosition(), action.position)
  .build();

export default createReducer(initialState, {
  [actions.INITIALIZE_VIEWER_SCREEN]: initializeViewerScreen,
  [actions.TOUCH_VIEWER_SCREEN]: onScreenTouched,
  [actions.SCROLLED_VIEWER_SCREEN]: onScreenScrolled,
  [actions.CALCULATED_PAGE_VIEWER]: calculatedPageViewer,
  [actions.CHANGED_READ_POSITION]: changedReadPosition,
  [actions.MOVE_PAGE_VIEWER]: movePageViewer,
  [actions.SHOW_ENDING_SCREEN]: showEndingScreen,
  [actions.VIEWER_SCREEN_SETTING_CHANGED]: viewerScreenSettingChanged,
  [actions.UPDATE_SPINE_META_DATA]: updateSpineMetaData,
  [actions.RENDER_SPINE]: renderSpine,
});
