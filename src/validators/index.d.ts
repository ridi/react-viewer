import * as Common from './CommonValidator';
import * as Comic from './ComicValidator';
import * as Epub from './EpubValidator';
declare const Validator: {
    Common: typeof Common;
    Comic: typeof Comic;
    Epub: typeof Epub;
};
export default Validator;
