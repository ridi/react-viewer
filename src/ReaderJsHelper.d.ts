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
    static updateState({ currentState, calculationState, settingState }: {
        currentState: EpubCurrentState;
        calculationState: EpubCalculationState;
        settingState: EpubSettingState;
    }): void;
    static get(key?: number | string | HTMLElement): Content | null;
    /**
     * 특정 포인트로부터 Reader.js content 인스턴스를 반환한다.
     * @param x pageX
     * @param y pageY
     */
    static getByPoint(x: number, y: number): Content | null;
    static reviseImages(): Promise<unknown[]> | undefined;
}
export default ReaderJsHelper;
export { Context };
