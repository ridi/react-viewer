import ow from 'ow';
import { BindingTypeOptional, ViewTypeOptional } from './CommonValidator';
import { ComicCalculationProperties } from '../contexts/comic/ComicCalculationContext';
import { ComicCurrentProperties } from '../contexts/comic/ComicCurrentContext';
import { ComicSettingProperties } from '../contexts/comic/ComicSettingContext';
import { ComicStatusProperties } from '../contexts/comic/ComicStatusContext';

const notNegativeNumber = ow.number.not.negative;
const notNegativeNumberOptional = ow.optional.number.not.negative;

export const ImageCalculationContext = ow.object.exactShape({
  imageIndex: notNegativeNumber,
  ratio: notNegativeNumber,
});

export const CalculationState = ow.object.exactShape({
  [ComicCalculationProperties.TOTAL_PAGE]: notNegativeNumberOptional,
  [ComicCalculationProperties.PAGE_UNIT]: notNegativeNumberOptional,
  [ComicCalculationProperties.IMAGES]: ow.optional.array.ofType(ImageCalculationContext),
});

export const CurrentState = ow.object.exactShape({
  [ComicCurrentProperties.CURRENT_PAGE]: notNegativeNumberOptional,
});

export const SettingState = ow.object.exactShape({
  [ComicSettingProperties.VIEW_TYPE]: ViewTypeOptional,
  [ComicSettingProperties.CONTENT_WIDTH_IN_PERCENT]: notNegativeNumberOptional,
  [ComicSettingProperties.BINDING_TYPE]: BindingTypeOptional,
  [ComicSettingProperties.LAZY_LOAD]: ow.optional.any(ow.boolean, ow.number.not.negative),
});

export const StatusState = ow.object.exactShape({
  [ComicStatusProperties.READY_TO_READ]: ow.optional.boolean,
});

export const ImageData = ow.object.partialShape({
  fileSize: notNegativeNumber,
  index: notNegativeNumber,
  path: ow.optional.string,
  uri: ow.string,
  width: notNegativeNumberOptional,
  height: notNegativeNumberOptional,
});

export const ComicParsedData = ow.object.partialShape({
  type: ow.string.equals('comic'),
  images: ow.optional.array.ofType(ImageData),
  unzipPath: ow.string,
});
