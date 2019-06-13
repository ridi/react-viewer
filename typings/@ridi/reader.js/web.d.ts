declare module '@ridi/reader.js/web' {
  export class Reader {
    constructor(wrapper: HTMLElement, context: Context);
    debugNodeLocation: boolean;
    sel: any;
    content: any;
    context: any;
    unmount(): void;
    getOffsetFromNodeLocation(location: any, detectionType: any): number;
    getNodeLocationOfCurrentPage(detectionType: any): string;
    getRectsFromSerializedRange(serializedRange: string): Array<any>;
    getOffsetFromSerializedRange(serializedRange: string): number;
    getOffsetFromAnchor(anchor: string): number;
  }
  export class Context {
    constructor(width: number, height: number, columnGap: number, doublePageMode: boolean, scrollMode: boolean, systemMajorVersion?: number, maxSelectionLength?: number);
  }
  export namespace Util {
    export function getStylePropertyIntValue(node: HTMLElement, propertyName: string): number;
  }
}
