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
import { isEmpty, isExist } from '../util/Util';
import { ContentFormat, PRE_CALCULATED_RATIO } from '../constants/ContentConstants';

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
    this.connectEvents(this.onContentUpdated.bind(this), Events.UPDATE_CONTENT);

    if (setting) {
      Connector.setting.updateSetting(setting);
    }

    if (!isEmpty(contents) && isExist(metadata)) {
      const restoreContents = contents.map(content => ({
        ...content,
        error: null,
        isContentLoaded: !isEmpty(content.content),
        isContentOnError: false,
        isInScreen: false,
      }));
      Connector.content.setContents(metadata, restoreContents);

      if (current && isExist(current.contentIndex, current.position)) {
        Connector.current.updateCurrent(current);
      }
      if (calculations && isExist(calculations.contents, calculations.footer, calculations.contentTotal)) {
        Connector.calculations.setCalculations(calculations);
      }

      EventBus.emit(Events.ALL_CONTENT_READY);
    }
  }

  afterLoaded() {
    if (Connector.content.isContentsLoaded()) {
      EventBus.emit(Events.ALL_CONTENT_LOADED, Connector.content.getContents());
    }
  }

  onContentSetByUri(contentSetByUri$) {
    return contentSetByUri$.pipe(
      map(({ data }) => ({ format: data.contentFormat, binding: data.bindingType, uris: data.uris })),
      tap(({ format, binding, uris }) => Connector.content.setContentsByUri({ format, binding }, uris)),
      tap(() => EventBus.emit(Events.ALL_CONTENT_READY)),
      filter(({ format }) => format === ContentFormat.HTML),
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
      Connector.content.setContentsByValue({ format: contentFormat, binding: bindingType }, contents);
      EventBus.emit(Events.ALL_CONTENT_READY);
      EventBus.emit(Events.ALL_CONTENT_LOADED, contents);
    });
  }

  onContentLoaded(contentLoaded$) {
    return contentLoaded$.subscribe(({ data }) => {
      const { index, content = null, ratio = PRE_CALCULATED_RATIO } = data;
      Connector.content.setContentLoaded(index, content, ratio);
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

  onContentUpdated(contentUpdated$) {
    return contentUpdated$.subscribe(({ data }) => {
      const { index, content } = data;
      Connector.content.updateContent(index, content);
    });
  }
}

export default new LoadService();
