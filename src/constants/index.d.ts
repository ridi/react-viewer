export declare enum ViewType {
    SCROLL = "scroll",
    PAGE1 = "page1",
    PAGE12 = "page12",
    PAGE23 = "page23"
}
export declare enum BindingType {
    LEFT = "left",
    RIGHT = "right"
}
export declare enum ImageStatus {
    NONE = "none",
    LOADING = "loading",
    ERROR = "error",
    LOADED = "loaded"
}
export declare const ViewTypeValidator: import("ow/dist/source").StringPredicate;
export declare const ViewTypeOptionalValidator: import("ow/dist/source").StringPredicate;
export declare const BindingTypeValidator: import("ow/dist/source").StringPredicate;
export declare const BindingTypeOptionalValidator: import("ow/dist/source").StringPredicate;
