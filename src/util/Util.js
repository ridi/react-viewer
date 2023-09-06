import { Provider } from 'react-redux';


export function isExist(object) {
  return object !== undefined && object !== null;
}

export function isEmpty(object) {
  if (!isExist(object)) {
    return true;
  }

  if (typeof object === 'string' || object instanceof String) {
    return object.trim() === '';
  }

  if (Array.isArray(object)) {
    return object.length === 0;
  }

  return false;
}

export function isArray(arr) {
  return Array.isArray(arr);
}

export function isObject(obj) {
  return !isArray(obj) && obj === Object(obj);
}

export const cloneObject = (object) => {
  if (object === null || typeof object !== 'object') {
    return object;
  }
  const _object = object.constructor();
  Object.keys(object).forEach((attr) => {
    if (Object.prototype.hasOwnProperty.call(object, attr)) {
      _object[attr] = cloneObject(object[attr]);
    }
  });

  return _object;
};

function _updateObject(origin, target) {
  let _origin = origin;

  if (isObject(origin) && isObject(target)) {
    Object.keys(target).forEach((key) => {
      if (typeof target[key] !== 'object' || origin[key] == null) {
        _origin[key] = target[key];
      } else {
        _origin[key] = _updateObject(origin[key], target[key]);
      }
    });
  } else {
    _origin = target;
  }

  return _origin;
}

export const updateObject = (origin, target, isNeedClone = true) => {
  if (!isExist(target)) {
    return origin;
  }

  const _origin = isNeedClone ? cloneObject(origin) : origin;
  return _updateObject(_origin, target);
};

export function invert(object) {
  const result = {};
  const keys = Object.keys(object);
  for (let i = 0, { length } = keys; i < length; i += 1) {
    result[object[keys[i]]] = keys[i];
  }
  return result;
}

export function nullSafeGet(object, path, defaultValue) {
  let refer = object;
  if (!isExist(object)) {
    return defaultValue;
  }
  path.every((key) => {
    if (!isExist(refer[key])) {
      refer = defaultValue;
      return false;
    }
    refer = refer[key];
    return true;
  });
  return refer;
}

export function nullSafeSet(object, path, value) {
  let refer = object;
  if (!isExist(refer)) {
    refer = {};
  }
  path.forEach((key, index) => {
    if (index === path.length - 1) {
      refer[key] = value;
    } else if (!isExist(refer[key])) {
      refer[key] = {};
    }
    refer = refer[key];
  });
  return object;
}

/**
 * Create a debounced(grouping multiple event listener in one) function
 * And the latest invoking of this deboucnced function will only be taken after `wait` miliseconds periods.
 *
 * @param {function} fn
 * @param {number} [wait=100]
 * @param {boolean} [immediate=false]
 * @return {function} debounced function
 */
export function debounce(fn, wait = 100, immediate = false) {
  let timeout;
  return (...args) => {
    const context = this;
    if (immediate && !timeout) {
      // immediately run at the first time
      fn.apply(context, args);
    }
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => {
      timeout = null;
      fn.apply(context, args);
    }, wait);
  };
}

/**
 * Create a throttled(invoking only once in specified limited time) function
 *
 * @param {function} fn
 * @param {number} [limit=100] up to 1 invoke per ${limit} milliseconds
 * @param {boolean} [delayed=false] invoke ${fn} after ${limit} milliseconds delayed
 * @returns {function} throttled function
 */
export function throttle(fn, limit = 100, delayed = false) {
  let inThrottle = false;
  return (...args) => {
    const context = this;
    if (!inThrottle) {
      if (delayed) {
        setTimeout(() => fn.apply(context, args), limit);
      } else {
        fn.apply(context, args);
      }
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  };
}

export function redux5InteropRequired() {
  return 'propTypes' in Provider && !('context' in Provider.propTypes);
}
