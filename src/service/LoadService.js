import { from } from 'rxjs';
import {
  mergeMap,
  map,
  catchError,
  tap,
  filter,
  switchMap,
} from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import EventBus, { Events } from '../event';
import BaseService from './BaseService';
import Connector from './connector';
import Logger from '../util/Logger';
import { isExist } from '../util/Util';
import { ContentFormat } from '../constants/ContentConstants';

class LoadService extends BaseService {
  load({
    contents,
    metadata,
    setting,
    current,
    calculations,
  } = {}) {
    super.load();
    this.connectEvents(this.onSettingUpdated.bind(this), Events.UPDATE_SETTING);
    this.connectEvents(this.onContentLoaded.bind(this), Events.CONTENT_LOADED);
    this.connectEvents(this.onContentError.bind(this), Events.CONTENT_ERROR);
    this.connectEvents(this.onContentSetByUri.bind(this), Events.SET_CONTENTS_BY_URI);
    this.connectEvents(this.onContentSetByValue.bind(this), Events.SET_CONTENTS_BY_VALUE);
    if (contents && contents.length > 0 && metadata) {
      Connector.content.setContentsByValue(metadata.format, metadata.binding, contents.map(c => c.content));
    }
    if (setting) {
      Connector.setting.updateSetting(setting);
    }
    if (current && isExist(current.contentIndex) && isExist(current.position)) {
      Connector.current.updateCurrent(current);
    }
    if (calculations && isExist(calculations.contents) && isExist(calculations.footer) && isExist(calculations.contentTotal)) {
      Connector.calculations.setCalculations(calculations);
    }
  }

  afterLoaded() {
    if (Connector.content.isContentsLoaded()) {
      EventBus.emit(Events.ALL_CONTENT_LOADED, Connector.content.getContents());
    }
  }

  onContentSetByUri(contentSetByUri$) {
    return contentSetByUri$.pipe(
      map(({ data }) => ({ contentFormat: data.contentFormat, bindingType: data.bindingType, uris: data.uris })),
      tap(({ contentFormat, bindingType, uris }) => Connector.content.setContentsByUri(contentFormat, bindingType, uris)),
      filter(({ contentFormat }) => contentFormat === ContentFormat.HTML),
      switchMap(({ uris }) => from(uris).pipe(
        mergeMap((uri, index) => ajax.getJSON(uri).pipe(
          map(data => ({ index: index + 1, content: data.value })),
          catchError(error => ({ index: index + 1, error })),
        )),
      )),
    ).subscribe(({ index, content, error }) => {
      if (error) {
        return EventBus.emit(Events.CONTENT_ERROR, { index, error });
      }
      return EventBus.emit(Events.CONTENT_LOADED, { index, content });
    });
  }

  onContentSetByValue(contentSetByValue$) {
    return contentSetByValue$.subscribe(({ data }) => {
      const { contentFormat, bindingType, contents } = data;
      Connector.content.setContentsByValue(contentFormat, bindingType, contents);
      EventBus.emit(Events.ALL_CONTENT_LOADED, contents);
    });
  }

  onContentLoaded(contentLoaded$) {
    return contentLoaded$.subscribe(({ data }) => {
      const { index, content = null } = data;
      Connector.content.setContentLoaded(index, content);
      const contents = Connector.content.getContents();
      const allLoaded = contents.every(({ isContentLoaded, isContentOnError }) => isContentLoaded || isContentOnError);
      if (allLoaded) {
        EventBus.emit(Events.ALL_CONTENT_LOADED, contents);
      }
    });
  }

  onContentError(contentError$) {
    return contentError$.subscribe(({ data }) => {
      const { index, error = null } = data;
      const contents = Connector.content.getContents();
      Connector.content.setContentError(index, error);
      const allLoaded = contents.every(({ isContentLoaded, isContentOnError }) => isContentLoaded || isContentOnError);
      if (allLoaded) {
        EventBus.emit(Events.ALL_CONTENT_LOADED, contents);
      }
    });
  }

  onSettingUpdated(updateSetting$) {
    return updateSetting$.pipe(
      map(({ data: setting }) => setting),
      tap(setting => Logger.debug(setting)),
    ).subscribe((setting) => {
      Connector.setting.updateSetting(setting);
      EventBus.emit(Events.SETTING_UPDATED, setting);
    });
  }
}

export default new LoadService();
