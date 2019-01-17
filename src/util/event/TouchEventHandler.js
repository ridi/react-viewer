/* eslint-disable no-bitwise */
import DOMEventConstants from '../../constants/DOMEventConstants';
import {
  addEventListener,
  removeEventListener,
  CustomEvent,
} from '../EventHandler';
import { TouchEvent } from '../../constants/TouchEventConstants';

export default class TouchEventHandler {
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
      type,
      target,
    } = TouchEventHandler.isTouchEvent(event) ? event.changedTouches[0] : event;
    return {
      screenX,
      screenY,
      clientX,
      clientY,
      pageX,
      pageY,
      type,
      target,
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
    this.eventQueue.push({ type, detail: TouchEventHandler.getDetail(event) });
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
    return (this.isTouchMode ^ TouchEventHandler.isTouchEvent(event)) === 1;
  }

  start(event) {
    this.isTouchMode = event.type === DOMEventConstants.TOUCH_START;
    this.startTime = Date.now();
    this.isStarted = true;
    this.addEvent(TouchEvent.TouchStart, event);
  }

  move(event) {
    if (!this.isStarted || this.ignoreEvent(event)) return;

    this.addEvent(TouchEvent.TouchMove, event);
    if (Date.now() - this.startTime >= TouchEventHandler.DELAY_FOR_TOUCHMOVE) {
      this.emitEvents();
    }
    this.isMoved = true;
  }

  end(event) {
    if (!this.isStarted || this.ignoreEvent(event)) return;

    if (Date.now() - this.startTime >= TouchEventHandler.DELAY_FOR_TOUCHMOVE) {
      this.addEvent(TouchEvent.TouchEnd, event);
    } else {
      this.resetEvent();
      this.addEvent(TouchEvent.Touch, event);
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
  }
}
