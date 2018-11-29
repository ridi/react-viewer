import { tap } from 'rxjs/operators';
import BaseService from './BaseService';
import EventBus, { Events } from '../event';
import Connector from './connector';
import Logger from '../util/Logger';

class SettingService extends BaseService {
  load() {
    super.load();
    this.connectEvents(this.onSettingUpdated.bind(this), Events.setting.UPDATE_SETTING);
  }

  onSettingUpdated(updateSetting$) {
    return updateSetting$.pipe(
      tap(({ data: setting }) => Logger.debug(setting)),
      tap(({ data: setting }) => Connector.setting.updateSetting(setting)),
    ).subscribe(setting => EventBus.emit(Events.setting.SETTING_UPDATED, setting));
  }
}

export default new SettingService();
