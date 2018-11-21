import { tap } from 'rxjs/operators';

const _isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

export default class Logger {
  static info(...data) {
    console.log(...data);
  }

  static debug(...data) {
    if (_isDev) {
      console.log(...data);
    }
  }

  static error(...data) {
    console.error(...data);
  }
}

export const rxDebug = obs$ => obs$.pipe(tap((...data) => Logger.debug(...data)));
