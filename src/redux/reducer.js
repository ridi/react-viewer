import path, {
  initialFooterCalculationsState,
  initialContentCalculationsState, initialSettingState,
  initialContentState,
  initialState,
} from './path';
import createReducer from '../util/Reducer';
import { actions } from './action';
import { ImmutableObjectBuilder } from '../util/ImmutabilityHelper';
import { updateObject } from '../util/Util';
import { isScrolledToBottom, isScrolledToTop } from '../util/CommonUi';
import * as BrowserWrapper from '../util/BrowserWrapper';
import { ContentFormat } from '..';

const isEdgeOfScreen = () => (isScrolledToTop() || isScrolledToBottom());

// TODO remove? isFullScreen
const onTouched = state => new ImmutableObjectBuilder(state)
  .set(path.isFullScreen(), !state.status.isFullScreen)
  .build();

const onScrolled = state => new ImmutableObjectBuilder(state)
  .set(path.isFullScreen(), !isEdgeOfScreen())  // TODO remove? isFullScreen
  .set(path.currentOffset(), BrowserWrapper.scrollTop())
  .build();

const updateCurrent = (state, action) => new ImmutableObjectBuilder(state)
  .set(path.current(), updateObject(state.current, action.current))
  .build();

const updateSetting = (state, action) => new ImmutableObjectBuilder(state)
  .set(path.setting(), updateObject(state.setting, action.setting))
  .build();

const setContents = (state, action) => new ImmutableObjectBuilder(state)
  .set(path.isInitContents(), true)
  .set(path.contentType(), action.contentType)
  .set(path.contentFormat(), action.contentFormat)
  .set(path.bindingType(), action.bindingType)
  .set(path.contents(), action.contents.map((uri, i) => initialContentState(i + 1, uri)))
  .set(path.contentsCalculations(), action.contentFormat === ContentFormat.HTML
    ? action.contents.map((_, i) => initialContentCalculationsState(i + 1))
    : [initialContentCalculationsState(1)])
  .build();

const updateContent = (state, action) => new ImmutableObjectBuilder(state)
  .set(path.content(action.index), action.content)
  .set(path.isContentLoaded(action.index), true)
  .set(path.isContentOnError(action.index), false)
  .set(path.contentError(action.index), null)
  .set(path.isContentsLoaded(), action.isAllLoaded)
  .build();

const updateContentError = (state, action) => new ImmutableObjectBuilder(state)
  .set(path.content(action.index), null)
  .set(path.isContentLoaded(action.index), false)
  .set(path.isContentOnError(action.index), true)
  .set(path.contentError(action.index), action.error)
  .set(path.isContentsLoaded(), action.isAllLoaded)
  .build();

const updateContentCalculations = (state, action) => new ImmutableObjectBuilder(state)
  .set(path.isContentsCalculated(action.index), true)
  .set(path.contentCalculationsTotal(action.index), action.total)
  .build();

const invalidateCalculations = state => new ImmutableObjectBuilder(state)
  .set(path.isAllCalculated(), false)
  .set(path.contentsCalculations(), state.calculations.contents.map(s => initialContentCalculationsState(s.index)))
  .set(path.footerCalculations(), initialFooterCalculationsState())
  .build();

const updateCalculationsTotal = (state, action) => new ImmutableObjectBuilder(state)
  .set(path.isAllCalculated(), action.isCompleted)
  .set(path.calculationsTotal(), action.calculationsTotal)
  .build();

const updateFooterCalculation = (state, action) => new ImmutableObjectBuilder(state)
  .set(path.isFooterCalculated(), true)
  .set(path.footerCalculationsTotal(), action.total)
  .build();

export default ({
  setting: customSetting = {},
} = {}) => {
  const setting = { ...initialSettingState(), ...customSetting };
  return createReducer({ ...initialState, setting }, {
    [actions.TOUCHED]: onTouched,
    [actions.SCROLLED]: onScrolled,
    [actions.SET_CONTENTS]: setContents,
    [actions.UPDATE_SETTING]: updateSetting,
    [actions.UPDATE_CONTENT]: updateContent,
    [actions.UPDATE_CONTENT_ERROR]: updateContentError,
    [actions.UPDATE_CURRENT]: updateCurrent,
    [actions.INVALIDATE_CALCULATIONS]: invalidateCalculations,
    [actions.UPDATE_CONTENT_CALCULATIONS]: updateContentCalculations,
    [actions.UPDATE_FOOTER_CALCULATIONS]: updateFooterCalculation,
    [actions.UPDATE_CALCULATIONS_TOTAL]: updateCalculationsTotal,
  });
};
