

export function isExist(object) {
  return object !== undefined && object !== null;
}

export function isArray(arr) {
  return Array.isArray(arr);
}

export function isObject(obj) {
  return !isArray(obj) && obj === Object(obj);
}

export const cloneObject = object => {
  if (object === null || typeof object !== 'object') {
    return object;
  }
  const _object = object.constructor();
  Object.keys(object).forEach(attr => {
    if (Object.prototype.hasOwnProperty.call(object, attr)) {
      _object[attr] = cloneObject(object[attr]);
    }
  });

  return _object;
};

function _updateObject(origin, target) {
  let _origin = origin;

  if (isObject(origin) && isObject(target)) {
    Object.keys(target).forEach(key => {
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
  for (let i = 0, length = keys.length; i < length; ++i) {
    result[object[keys[i]]] = keys[i];
  }
  return result;
}

export function nullSafeGet(object, path, defaultValue) {
  let refer = object;
  if (!isExist(object)) {
    return defaultValue;
  }
  path.every(key => {
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
