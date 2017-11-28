function() {

// underscore's _.each implementation, use for _.extend
var _each = function(obj, iterator, context) {
    if (obj == null) return obj;
    if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
    return obj;
  };

// underscore's _.extend implementation
var _extend = function (obj) {
  _each(Array.prototype.slice.call(arguments, 1), function(source) {
    if (source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
}

// underscore's _.sortBy implementation
var _isFunction = function(obj) {
  return typeof obj === 'function';
};

var lookupIterator = function(value) {
  if (value == null) return _.identity;
  if (_isFunction(value)) return value;
  return _.property(value);
};

_map = function(obj, iterator, context) {
  var results = [];
  if (obj == null) return results;
  if (Array.prototype.map && obj.map === Array.prototype.map) return obj.map(iterator, context);
  each(obj, function(value, index, list) {
    results.push(iterator.call(context, value, index, list));
  });
  return results;
};

_pluck = function(obj, key) {
  return _map(obj, _property(key));
};

_property = function(key) {
  return function(obj) {
    return obj[key];
  };
};

var _sortBy = function (obj, iterator, context) {
  iterator = lookupIterator(iterator);
  return _pluck(_map(obj, function(value, index, list) {
    return {
      value: value,
      index: index,
      criteria: iterator.call(context, value, index, list)
    };
  }).sort(function(left, right) {
    var a = left.criteria;
    var b = right.criteria;
    if (a !== b) {
      if (a > b || a === void 0) return 1;
      if (a < b || b === void 0) return -1;
    }
    return left.index - right.index;
  }), 'value');
}
