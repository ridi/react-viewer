import { Context, Reader } from '@ridi/reader.js/web';
declare class ReaderJsHelper {
    private _readerJs;
    readonly readerJs: Reader | null;
    readonly sel: any;
    readonly content: any;
    readonly context: any;
    _setDebugMode(debugMode?: boolean): void;
    mount(contentRoot: HTMLElement, context: Context): void;
    unmount(): void;
    reviseImages(): Promise<any>;
    getOffsetFromNodeLocation(location: any): number | null;
    getNodeLocationOfCurrentPage(): string | null;
    getRectsFromSerializedRange(serializedRange: string): Array<any> | null;
    getOffsetFromSerializedRange(serializedRange: string): number | null;
    getOffsetFromAnchor(anchor: string): number | null;
}
declare const _default: ReaderJsHelper;
export default _default;
export { Context };
