import { BehaviorSubject } from 'rxjs';
import { share, tap } from 'rxjs/operators';
import Logger from '../util/Logger';

export default class BaseStore {
  _subject = null;

  constructor(initialValue = null) {
    this._subject = (new BehaviorSubject(initialValue)).pipe(
      tap(data => Logger.debugGroup(`📥 ${this.constructor.name}`, data)),
      share(),
    );
  }

  asObservable() {
    return this._subject;
  }

  next() {
    this._subject.next(this.getData());
  }

  getData() {
    throw new Error('Should implement `getData()` method');
  }
}
