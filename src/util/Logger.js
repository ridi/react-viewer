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

  static table(...data) {
    if (_isDev) {
      console.table(...data);
    }
  }

  static error(...data) {
    console.error(...data);
  }

  static debugGroup(groupName, ...data) {
    if (_isDev) {
      console.group(groupName);
      console.log(...data);
      console.groupEnd();
    }
  }
}
