import { from } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import EventBus, { Events } from '../event';
import BaseService from './BaseService';
import Connector from './connector';
import Logger from '../util/Logger';

class ContentService extends BaseService {
  setContentsByUri(contentFormat, bindingType, uris) {
    Connector.content.setContentsByUri(contentFormat, bindingType, uris);

    from(uris).pipe(
      mergeMap((uri, index) => ajax.getJSON(uri).pipe(
        map(data => ({ index: index + 1, content: data.value })),
        catchError(error => Connector.content.setContentError(index, error)),
      )),
    ).subscribe({
      next: ({ index, content }) => Connector.content.setContentLoaded(index, content),
      error: error => Logger.error(error),
      complete: (result) => {
        EventBus.emit(Events.content.ALL_CONTENT_LOADED, result);
      },
    });
  }

  setContentsByValue(contentFormat, bindingType, contents) {
    Connector.content.setContentsByValue(contentFormat, bindingType, contents);
    EventBus.emit(Events.content.ALL_CONTENT_LOADED, contents);
  }
}

export default new ContentService();
