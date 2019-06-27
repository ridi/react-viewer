import { Content, Context } from '@ridi/reader.js/web';
import { EpubCalculationState, EpubCurrentState, EpubSettingState } from './contexts';
declare class ReaderJsHelper {
    private static instance;
    private readerJs;
    private currentState;
    private calculationState;
    private settingState;
    private contentsNum;
    private constructor();
    static init(context: Context, { currentState, calculationState, settingState }: {
        currentState: EpubCurrentState;
        calculationState: EpubCalculationState;
        settingState: EpubSettingState;
    }): void;
    static updateContents(contentsRef: Array<HTMLElement>, contentWrapperRef: HTMLElement): void;
    static updateContext(context: Context): void;
    static updateState({ currentState }: {
        currentState: EpubCurrentState;
    }): void;
    static get(key?: number | HTMLElement): Content | null;
    static getByPoint(x: number, y: number): Content | null;
    static reviseImages(): Promise<unknown[]> | undefined;
}
export default ReaderJsHelper;
export { Context };
