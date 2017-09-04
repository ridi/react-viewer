export default class AsyncTask {
  constructor(callback) {
    this.callback = callback;
    this.isAlive = false;
  }

  start(delay = 0) {
    this.timerId = setTimeout(this._run.bind(this), delay);
  }

  stop() {
    if (!this.isAlive) {
      return;
    }

    clearTimeout(this.timerId);
    this.isAlive = false;
  }

  _run() {
    this.isAlive = true;
    this.callback();
    this.isAlive = false;
  }
}
