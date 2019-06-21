import ow from 'ow';
import { BindingType as BindingTypeEnum, ViewType as ViewTypeEnum } from '../constants';

export const Page = ow.number;
export const ViewType = ow.string.oneOf([ViewTypeEnum.SCROLL, ViewTypeEnum.PAGE1, ViewTypeEnum.PAGE23, ViewTypeEnum.PAGE12]);
export const ViewTypeOptional = ow.optional.string.oneOf([ViewTypeEnum.SCROLL, ViewTypeEnum.PAGE1, ViewTypeEnum.PAGE23, ViewTypeEnum.PAGE12]);
export const BindingType = ow.string.oneOf([BindingTypeEnum.LEFT, BindingTypeEnum.RIGHT]);
export const BindingTypeOptional = ow.optional.string.oneOf([BindingTypeEnum.LEFT, BindingTypeEnum.RIGHT]);
