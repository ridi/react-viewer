import { from } from 'rxjs';
import { switchMap, map, catchError, tap, of } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import EventBus, { Events } from '../event';
import BaseService from './BaseService';
import Connector from './connector';

class ContentService extends BaseService {
  listeningEvents = {
    // [Events.core.UNLOADED]: this.appUnloaded.bind(this),
  };

  setContentsByUri(contentFormat, bindingType, uris) {
    Connector.content.setContentsByUri(contentFormat, bindingType, uris);

    // TODO 완성하기!
    from(uris).pipe(
      switchMap((uri, index) => ajax.getJSON(uri).pipe(
        map(data => ({ index, content: data.value })),
        tap(result => EventBus.emit(Events.content.CONTENT_LOADED, result)),
        catchError((error) => {
          EventBus.emit(Events.content.CONTENT_LOAD_FAIL, { index, error });
          return of({ index, error });
        }),
      )),
    ).subscribe({
      next: result => EventBus.emit(Events.content.ALL_CONTENT_LOADED, result),
      error: error => console.error(error),
      complete: result => console.log('complete', result),
    });
  }

  setContentsByValue(contentFormat, bindingType, contents) {
    Connector.content.setContentsByValue(contentFormat, bindingType, contents);
    EventBus.emit(Events.content.ALL_CONTENT_LOADED, contents);
  }
}

export default new ContentService();
