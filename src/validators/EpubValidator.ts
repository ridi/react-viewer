import ow from 'ow';
import { ViewTypeOptional } from './CommonValidator';
import { EpubCalculationProperties } from '../contexts/epub/EpubCalculationContext';
import { EpubSettingProperties } from '../contexts/epub/EpubSettingContext';
import { EpubCurrentProperties } from '../contexts/epub/EpubCurrentContext';
import { EpubStatusProperties } from '../contexts/epub/EpubStatusContext';

const notNegativeNumber = ow.number.not.negative;
const notNegativeNumberOptional = ow.optional.number.not.negative;

export const SpineCalculationState = ow.object.partialShape({
  spineIndex: notNegativeNumber,
  offset: notNegativeNumber,
  total: notNegativeNumber,
  startPage: notNegativeNumber,
  totalPage: notNegativeNumber,
});

export const CalculationState = ow.object.partialShape({
  [EpubCalculationProperties.TOTAL_PAGE]: notNegativeNumberOptional,
  [EpubCalculationProperties.PAGE_UNIT]: notNegativeNumberOptional,
  [EpubCalculationProperties.SPINES]: ow.optional.array.ofType(SpineCalculationState),
});

export const CurrentState = ow.object.partialShape({
  [EpubCurrentProperties.CURRENT_PAGE]: notNegativeNumberOptional,
  [EpubCurrentProperties.CURRENT_SPINE_INDEX]: notNegativeNumberOptional,
  [EpubCurrentProperties.CURRENT_POSITION]: notNegativeNumberOptional,
});

export const SettingState = ow.object.partialShape({
  [EpubSettingProperties.VIEW_TYPE]: ViewTypeOptional,
  [EpubSettingProperties.FONT]: ow.optional.string,
  [EpubSettingProperties.FONT_SIZE_IN_EM]: notNegativeNumberOptional,
  [EpubSettingProperties.LINE_HEIGHT_IN_EM]: notNegativeNumberOptional,
  [EpubSettingProperties.CONTENT_PADDING_IN_PERCENT]: notNegativeNumberOptional,
  [EpubSettingProperties.COLUMN_GAP_IN_PERCENT]: notNegativeNumberOptional,
  [EpubSettingProperties.CONTAINER_HORIZONTAL_MARGIN]: notNegativeNumberOptional,
  [EpubSettingProperties.CONTAINER_VERTICAL_MARGIN]: notNegativeNumberOptional,
});

export const StatusState = ow.object.partialShape({
  [EpubStatusProperties.READY_TO_READ]: ow.optional.boolean,
});

export const FontData = ow.object.partialShape({
  href: ow.string,
  uri: ow.optional.string,
  size: ow.optional.number.not.negative,
});

export const EpubParsedData = ow.object.partialShape({
  fonts: ow.optional.array.ofType(FontData),
  styles: ow.optional.array.ofType(ow.string),
  spines: ow.optional.array.ofType(ow.string),
  unzipPath: ow.string,
});
