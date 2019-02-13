import path, {
  initialFooterCalculationsState,
  initialContentCalculationsState,
  initialSettingState,
  initialContentState,
  initialState,
  initialCalculationsState,
} from './path';
import createReducer from '../util/Reducer';
import { actions } from './action';
import { ImmutableObjectBuilder } from '../util/ImmutabilityHelper';
import { updateObject } from '../util/Util';
import { ContentFormat } from '../constants/ContentConstants';

const load = (state, { state: newState }) => new ImmutableObjectBuilder(newState)
  .set(path.isLoaded(), true)
  .build();

const unload = () => new ImmutableObjectBuilder(initialState())
  .set(path.isLoaded(), false)
  .build();

const setContents = (state, {
  metadata,
  contents,
  startOffset = 0,
  resetCalculations = false,
  isAllLoaded = false,
}) => {
  const builder = new ImmutableObjectBuilder(state)
    .set(path.isInitContents(), true)
    .set(path.metadata(), metadata)
    .set(path.contents(), contents.map((content, i) => updateObject(initialContentState(i + 1), content)))
    .set(path.isContentsLoaded(), isAllLoaded);

  if (resetCalculations) {
    builder
      .set(path.contentsCalculations(), metadata.format === ContentFormat.HTML
        ? contents.map((_, i) => initialContentCalculationsState(i + 1, startOffset))
        : contents.map((_, i) => initialContentCalculationsState(i + 1, startOffset, i, 1)))
      .set(path.footerCalculations(), metadata.format === ContentFormat.HTML
        ? initialFooterCalculationsState()
        : initialFooterCalculationsState(contents.length, 1));
  }
  return builder.build();
};

const updateCurrent = (state, { current }) => new ImmutableObjectBuilder(state)
  .set(path.current(), updateObject(state.current, current))
  .build();

const updateSetting = (state, { setting }) => new ImmutableObjectBuilder(state)
  .set(path.setting(), updateObject(state.setting, setting))
  .build();

const updateContent = (state, action) => new ImmutableObjectBuilder(state)
  .set(path.content(action.index), action.content)
  .set(path.contentRatio(action.index), action.ratio)
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

const updateContentCalculation = (state, { calculation }) => new ImmutableObjectBuilder(state)
  .set(
    path.contentsCalculation(calculation.index),
    updateObject(state.calculations.contents[calculation.index - 1], { ...state.calculations.contents[calculation.index - 1], ...calculation }),
  )
  .build();

const updateFooterCalculation = (state, { calculation }) => new ImmutableObjectBuilder(state)
  .set(
    path.footerCalculations(),
    updateObject(state.calculations.footer, { ...state.calculations.footer, ...calculation }),
  )
  .build();

const invalidateCalculations = (state, { startOffset }) => new ImmutableObjectBuilder(state)
  .set(path.isAllCalculated(), false)
  .set(path.isReadyToRead(), false)
  .set(path.contentsCalculations(), state.calculations.contents.map(s => initialContentCalculationsState(s.index, startOffset)))
  .set(path.footerCalculations(), initialFooterCalculationsState())
  .set(path.calculationsTargets(), [])
  .build();

const updateCalculationsTotal = (state, action) => new ImmutableObjectBuilder(state)
  .set(path.isAllCalculated(), action.isCompleted)
  .set(path.calculationsTotal(), action.calculationsTotal)
  .build();

const setReadyToRead = (state, { isReadyToRead }) => new ImmutableObjectBuilder(state)
  .set(path.isReadyToRead(), isReadyToRead)
  .build();

const updateSelection = (state, { selection }) => new ImmutableObjectBuilder(state)
  .set(path.selection(), selection)
  .build();

const setCalculationsTargets = (state, { targets }) => new ImmutableObjectBuilder(state)
  .set(path.calculationsTargets(), targets)
  .build();

const setContentsInScreen = (state, { contentIndexes }) => new ImmutableObjectBuilder(state)
  .set(path.contents(), state.contents.map(({ index, ...others }) => (
    { index, ...others, isInScreen: contentIndexes.includes(index) }
  ))).build();

const setCalculations = (state, { calculations }) => new ImmutableObjectBuilder(state)
  .set(path.calculations(), { ...initialCalculationsState(), ...calculations })
  .build();

export default ({
  setting: customSetting = {},
} = {}) => {
  const setting = { ...initialSettingState(), ...customSetting };
  return createReducer({ ...initialState(), setting }, {
    [actions.LOAD]: load,
    [actions.UNLOAD]: unload,
    [actions.SET_CONTENTS]: setContents,
    [actions.SET_READY_TO_READ]: setReadyToRead,
    [actions.UPDATE_SETTING]: updateSetting,
    [actions.UPDATE_CONTENT]: updateContent,
    [actions.UPDATE_CONTENT_ERROR]: updateContentError,
    [actions.UPDATE_CURRENT]: updateCurrent,
    [actions.INVALIDATE_CALCULATIONS]: invalidateCalculations,
    [actions.UPDATE_CONTENT_CALCULATIONS]: updateContentCalculation,
    [actions.UPDATE_FOOTER_CALCULATIONS]: updateFooterCalculation,
    [actions.UPDATE_CALCULATIONS_TOTAL]: updateCalculationsTotal,
    [actions.UPDATE_SELECTION]: updateSelection,
    [actions.SET_CALCULATIONS_TARGETS]: setCalculationsTargets,
    [actions.SET_CONTENTS_IN_SCREEN]: setContentsInScreen,
    [actions.SET_CALCULATIONS]: setCalculations,
  });
};
