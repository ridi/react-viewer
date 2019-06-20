import { ComicSettingState } from '../../contexts';
import { ImageStatus } from '../../constants';
export declare const wrapper: (setting: ComicSettingState, ratio: number, status: ImageStatus, imageIndex: number) => import("@emotion/utils").SerializedStyles;
export declare const loading: import("@emotion/utils").SerializedStyles;
export declare const error: import("@emotion/utils").SerializedStyles;
export declare const blank: (setting: ComicSettingState) => import("@emotion/utils").SerializedStyles;
