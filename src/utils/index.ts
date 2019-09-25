import { Context, Rect, RectList } from '@ridi/reader.js/web';
import * as ComicSettingUtil from './ComicSettingUtil';
import * as EpubSettingUtil from './EpubSettingUtil';
import * as Util from './Util';

// todo deprecated `SettingUtil`
export const SettingUtil = EpubSettingUtil;

export {
  EpubSettingUtil,
  ComicSettingUtil,
  Util,
  Context, Rect, RectList,
};
