/* eslint-disable no-bitwise */
import DOMEventConstants from '../../constants/DOMEventConstants';
import {
  addEventListener,
  removeEventListener,
  CustomEvent,
} from '../EventHandler';

export default class ReaderGestureEventHandler {
  static EVENT_TYPE = {
    Touch: 'ReaderTouch',
    TouchStart: 'ReaderTouchStart',
    TouchMove: 'ReaderTouchMove',
    TouchEnd: 'ReaderTouchEnd',
  };

  static DELAY_FOR_TOUCHMOVE = 300;

  constructor(element) {
    this.element = element;

    this.start = this.start.bind(this);
    this.move = this.move.bind(this);
    this.end = this.end.bind(this);
    this.init();
  }

  static isTouchEvent(event) {
    return ([
      DOMEventConstants.TOUCH_START,
      DOMEventConstants.TOUCH_MOVE,
      DOMEventConstants.TOUCH_END,
      DOMEventConstants.TOUCH_CANCEL,
    ].includes(event.type));
  }

  static getDetail(event) {
    const {
      screenX,
      screenY,
      clientX,
      clientY,
      pageX,
      pageY,
    } = ReaderGestureEventHandler.isTouchEvent(event) ? event.changedTouches[0] : event;
    return {
      screenX,
      screenY,
      clientX,
      clientY,
      pageX,
      pageY,
    };
  }

  init() {
    this.isTouchMode = false;
    this.isStarted = false;
    this.isMoved = false;
    this.startTime = null;
    this.eventQueue = [];
    this.preventScrollEvent = false;
  }

  addEvent(type, event) {
    this.eventQueue.push({ type, detail: ReaderGestureEventHandler.getDetail(event) });
  }

  resetEvent() {
    this.eventQueue = [];
  }

  emitEvents() {
    this.eventQueue.forEach(({ type, detail }) => {
      this.element.dispatchEvent(new CustomEvent(type, { detail }));
    });
    this.resetEvent();
  }

  ignoreEvent(event) {
    return (this.isTouchMode ^ ReaderGestureEventHandler.isTouchEvent(event)) === 1;
  }

  start(event) {
    this.isTouchMode = event.type === DOMEventConstants.TOUCH_START;
    this.startTime = Date.now();
    this.isStarted = true;
    this.addEvent(ReaderGestureEventHandler.EVENT_TYPE.TouchStart, event);
  }

  move(event) {
    if (!this.isStarted || this.ignoreEvent(event)) return;

    this.addEvent(ReaderGestureEventHandler.EVENT_TYPE.TouchMove, event);
    if (Date.now() - this.startTime >= ReaderGestureEventHandler.DELAY_FOR_TOUCHMOVE) {
      this.emitEvents();
    }
    this.isMoved = true;
  }

  end(event) {
    if (!this.isStarted || this.ignoreEvent(event)) return;

    if (Date.now() - this.startTime >= ReaderGestureEventHandler.DELAY_FOR_TOUCHMOVE) {
      this.addEvent(ReaderGestureEventHandler.EVENT_TYPE.TouchEnd, event);
    } else {
      this.resetEvent();
      this.addEvent(ReaderGestureEventHandler.EVENT_TYPE.Touch, event);
    }
    this.emitEvents();
    this.init();
  }

  attach() {
    addEventListener(this.element, DOMEventConstants.TOUCH_START, this.start);
    addEventListener(this.element, DOMEventConstants.TOUCH_MOVE, this.move);
    addEventListener(this.element, DOMEventConstants.TOUCH_END, this.end);
    addEventListener(this.element, DOMEventConstants.TOUCH_CANCEL, this.end);
    addEventListener(this.element, DOMEventConstants.MOUSE_DOWN, this.start);
    addEventListener(this.element, DOMEventConstants.MOUSE_MOVE, this.move);
    addEventListener(this.element, DOMEventConstants.MOUSE_UP, this.end);
    addEventListener(this.element, DOMEventConstants.MOUSE_OUT, this.end);

    // prevent entering to selection mode and default context menu
    this.element.oncontextmenu = () => false;
    this.element.onselectstart = ({ target }) => (target && target.tagName ? target.tagName.toLowerCase() === 'textarea' : false);
    this.element.ondragstart = () => false;
  }

  detach() {
    removeEventListener(this.element, DOMEventConstants.TOUCH_START, this.start);
    removeEventListener(this.element, DOMEventConstants.TOUCH_MOVE, this.move);
    removeEventListener(this.element, DOMEventConstants.TOUCH_END, this.end);
    removeEventListener(this.element, DOMEventConstants.TOUCH_CANCEL, this.end);
    removeEventListener(this.element, DOMEventConstants.MOUSE_DOWN, this.start);
    removeEventListener(this.element, DOMEventConstants.MOUSE_MOVE, this.move);
    removeEventListener(this.element, DOMEventConstants.MOUSE_UP, this.end);
    removeEventListener(this.element, DOMEventConstants.MOUSE_OUT, this.end);
  }
}
